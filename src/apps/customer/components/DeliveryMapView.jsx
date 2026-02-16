import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Store, MapPin, Bike } from "lucide-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const isValid = (lat, lng) => {
    if (lat == null || lng == null) return false;
    const nLat = Number(lat);
    const nLng = Number(lng);
    if (nLat === 0 && nLng === 0) return false;
    return nLat >= -90 && nLat <= 90 && nLng >= -180 && nLng <= 180;
};

const partial = (coords, t) => {
    const safe = Array.isArray(coords)
        ? coords.filter((c) => Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1]))
        : [];
    const n = safe.length;
    if (n === 0) return [];
    if (n === 1) return [safe[0]];
    const tt = Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0;
    const total = n - 1;
    const exact = tt * total;
    const idx = Math.floor(exact);
    const frac = exact - idx;
    const sliced = safe.slice(0, Math.max(1, Math.min(n, idx + 1)));
    if (idx < total) {
        const a = safe[idx];
        const b = safe[idx + 1];
        if (a && b) {
            const x = a[0] + (b[0] - a[0]) * frac;
            const y = a[1] + (b[1] - a[1]) * frac;
            sliced.push([x, y]);
        }
    }
    return sliced;
};

/**
 * DeliveryMapView – Reusable Mapbox map for customer pages.
 * 
 * Props:
 * - pickup: { lat, lng } – restaurant/pickup location
 * - dropoff: { lat, lng } – delivery location
 * - driverLocation: { lat, lng } (optional) – driver current location
 * - routeFrom: { lat, lng } (optional) – start point for route line
 * - routeTo: { lat, lng } (optional) – end point for route line
 * - waypoints: Array<{lat, lng}> (optional) - list of points for the route (overrides routeFrom/routeTo)
 * - showRoute: boolean (default true) – whether to fetch & draw route
 * - interactive: boolean (default true) – allow pan/zoom
 * - style: CSS style object for the container
 */
const DeliveryMapView = ({
    pickup,
    dropoff,
    driverLocation,
    routeFrom,
    routeTo,
    waypoints,
    showRoute = true,
    interactive = true,
    style,
}) => {
    const mapRef = useRef(null);
    const [route, setRoute] = useState(null); // Single route (2 points)
    const [routeSegments, setRouteSegments] = useState([]); // Multiple segments (3+ points)
    const [progress, setProgress] = useState(0);

    const hasPickup = pickup && isValid(pickup.lat, pickup.lng);
    const hasDropoff = dropoff && isValid(dropoff.lat, dropoff.lng);
    const hasDriver = driverLocation && isValid(driverLocation.lat, driverLocation.lng);

    // Prepare route points
    const activeWaypoints = useMemo(() => {
        if (waypoints && waypoints.length >= 2) {
            return waypoints.filter(p => p && isValid(p.lat, p.lng));
        }
        const start = routeFrom && isValid(routeFrom.lat, routeFrom.lng) ? routeFrom : pickup;
        const end = routeTo && isValid(routeTo.lat, routeTo.lng) ? routeTo : dropoff;
        if (start && end && isValid(start.lat, start.lng) && isValid(end.lat, end.lng)) {
            return [start, end];
        }
        return [];
    }, [waypoints, routeFrom, routeTo, pickup, dropoff]);

    const hasRoutePoints = activeWaypoints.length >= 2;
    const isMultiSegment = activeWaypoints.length > 2;

    // Fetch Directions route
    useEffect(() => {
        if (!showRoute || !hasRoutePoints) return;

        const fetchRoute = async () => {
            try {
                if (isMultiSegment) {
                    // Fetch separate segments to allow different coloring
                    // Segment 1: Waypoint 0 -> Waypoint 1 (Driver -> Restaurant)
                    // Segment 2: Waypoint 1 -> Waypoint 2 (Restaurant -> Customer)
                    // We assume max 3 points for now based on requirement
                    const p1 = activeWaypoints[0];
                    const p2 = activeWaypoints[1];
                    const p3 = activeWaypoints[2];

                    if (!p1 || !p2 || !p3) return;

                    const url1 = `https://api.mapbox.com/directions/v5/mapbox/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?geometries=geojson&steps=true&overview=full&access_token=${MAPBOX_TOKEN}`;
                    const url2 = `https://api.mapbox.com/directions/v5/mapbox/driving/${p2.lng},${p2.lat};${p3.lng},${p3.lat}?geometries=geojson&steps=true&overview=full&access_token=${MAPBOX_TOKEN}`;

                    const [res1, res2] = await Promise.all([fetch(url1), fetch(url2)]);
                    const json1 = await res1.json();
                    const json2 = await res2.json();

                    setRouteSegments([
                        json1?.routes?.[0] ?? null,
                        json2?.routes?.[0] ?? null
                    ]);
                    setRoute(null); // Clear single route

                    // Fit bounds to all points
                    const inst = mapRef.current;
                    const allCoords = [
                        ...(json1?.routes?.[0]?.geometry?.coordinates ?? []),
                        ...(json2?.routes?.[0]?.geometry?.coordinates ?? [])
                    ];
                    if (allCoords.length > 0) {
                        const lngs = allCoords.map((c) => c[0]);
                        const lats = allCoords.map((c) => c[1]);
                        inst?.getMap()?.fitBounds(
                            [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                            { padding: 60, duration: 900 }
                        );
                    }

                } else {
                    // Single segment
                    const coordsString = activeWaypoints.map(p => `${p.lng},${p.lat}`).join(';');
                    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&steps=true&overview=full&language=vi&access_token=${MAPBOX_TOKEN}`;

                    const res = await fetch(url);
                    const json = await res.json();
                    const r = json?.routes?.[0] ?? null;
                    setRoute(r);
                    setRouteSegments([]);

                    const inst = mapRef.current;
                    const coords = r?.geometry?.coordinates ?? [];
                    if (coords.length > 0) {
                        const lngs = coords.map((c) => c[0]);
                        const lats = coords.map((c) => c[1]);
                        inst?.getMap()?.fitBounds(
                            [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                            { padding: 60, duration: 900 }
                        );
                    }
                }

                // Animate route draw (simplified for multi-segment)
                const startTime = performance.now();
                const animate = (time) => {
                    const t = Math.min((time - startTime) / 900, 1);
                    setProgress(t);
                    if (t < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);

            } catch {
                /* silently fail */
            }
        };
        fetchRoute();
    }, [activeWaypoints, showRoute, isMultiSegment]);

    // If no route, just fit bounds to markers when we have them
    useEffect(() => {
        if (showRoute) return;
        const points = [];
        if (hasPickup) points.push([pickup.lng, pickup.lat]);
        if (hasDropoff) points.push([dropoff.lng, dropoff.lat]);
        if (hasDriver) points.push([driverLocation.lng, driverLocation.lat]);
        if (points.length === 0) return;

        setTimeout(() => {
            const inst = mapRef.current;
            if (points.length === 1) {
                inst?.getMap()?.flyTo({ center: points[0], zoom: 15, duration: 600 });
            } else {
                const lngs = points.map((p) => p[0]);
                const lats = points.map((p) => p[1]);
                inst?.getMap()?.fitBounds(
                    [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                    { padding: 60, duration: 600 }
                );
            }
        }, 200);
    }, [pickup, dropoff, driverLocation, showRoute, hasPickup, hasDropoff, hasDriver]);

    // Features for single route
    const routeFeature = useMemo(() => {
        if (!route?.geometry?.coordinates) return null;
        const coords = route.geometry.coordinates.length > 1
            ? partial(route.geometry.coordinates, progress)
            : [];
        if (coords.length < 2) return null;
        return { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} };
    }, [route, progress]);

    const lineData = useMemo(() => ({
        type: "FeatureCollection",
        features: routeFeature ? [routeFeature] : [],
    }), [routeFeature]);


    // Features for multi-segment route
    const segmentFeatures = useMemo(() => {
        if (!isMultiSegment || routeSegments.length < 2) return [];
        return routeSegments.map((seg, idx) => {
            if (!seg?.geometry?.coordinates) return null;
            // Apply partial animation if needed, or just show full path for simplicity in multi-mode
            // Let's animate them together
            const coords = seg.geometry.coordinates.length > 1
                ? partial(seg.geometry.coordinates, progress)
                : [];
            if (coords.length < 2) return null;
            return {
                type: "Feature",
                geometry: { type: "LineString", coordinates: coords },
                properties: { segmentIndex: idx }
            };
        }).filter(Boolean);
    }, [routeSegments, progress, isMultiSegment]);


    const lineLayer = {
        id: "customer-route-line",
        type: "line",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#78C841", "line-width": 5, "line-opacity": 0.95 },
    };

    // Gray line for first segment (Driver -> Restaurant)
    const grayLineLayer = {
        id: "customer-route-line-gray",
        type: "line",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#9ca3af", "line-width": 5, "line-opacity": 0.95, "line-dasharray": [1, 0] }, // Solid gray
    };

    const etaText = useMemo(() => {
        if (isMultiSegment && routeSegments.length > 0) {
            const totalDuration = routeSegments.reduce((acc, s) => acc + (s?.duration || 0), 0);
            const totalDistance = routeSegments.reduce((acc, s) => acc + (s?.distance || 0), 0);
            const km = totalDistance / 1000;
            const min = totalDuration / 60;
            if (km <= 0 || min <= 0) return "";
            return `${Math.round(min)} phút · ${km.toFixed(1)} km`;
        }

        if (!route) return "";
        const km = (Number(route.distance ?? 0)) / 1000;
        const min = (Number(route.duration ?? 0)) / 60;
        if (km <= 0 || min <= 0) return "";
        return `${Math.round(min)} phút · ${km.toFixed(1)} km`;
    }, [route, routeSegments, isMultiSegment]);

    const center = hasPickup
        ? { longitude: pickup.lng, latitude: pickup.lat }
        : hasDropoff
            ? { longitude: dropoff.lng, latitude: dropoff.lat }
            : { longitude: 106.7, latitude: 10.78 };

    return (
        <Map
            ref={mapRef}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{ ...center, zoom: 14 }}
            style={style || { width: "100%", height: "100%" }}
            scrollZoom={interactive}
            dragPan={interactive}
            dragRotate={false}
            touchZoomRotate={interactive}
        >
            {/* Single Route render */}
            {showRoute && !isMultiSegment && (
                <Source id="customer-route" type="geojson" data={lineData}>
                    <Layer {...lineLayer} />
                </Source>
            )}

            {/* Multi Segment render */}
            {showRoute && isMultiSegment && segmentFeatures.length > 0 && (
                <>
                    {/* Segment 1: Driver -> Restaurant (Gray) */}
                    <Source id="customer-route-seg1" type="geojson" data={{ type: "FeatureCollection", features: [segmentFeatures[0]] }}>
                        <Layer {...grayLineLayer} />
                    </Source>

                    {/* Segment 2: Restaurant -> Customer (Green) */}
                    {segmentFeatures[1] && (
                        <Source id="customer-route-seg2" type="geojson" data={{ type: "FeatureCollection", features: [segmentFeatures[1]] }}>
                            <Layer {...lineLayer} />
                        </Source>
                    )}
                </>
            )}

            {hasPickup && (
                <Marker longitude={pickup.lng} latitude={pickup.lat} anchor="bottom">
                    <div className="dmap-marker-col">
                        <div className="dmap-marker dmap-marker--pickup">
                            <Store size={18} />
                        </div>
                        <div className="dmap-marker-stem dmap-marker-stem--pickup" />
                    </div>
                </Marker>
            )}

            {hasDropoff && (
                <Marker longitude={dropoff.lng} latitude={dropoff.lat} anchor="bottom">
                    <div className="dmap-marker-col">
                        <div className="dmap-marker dmap-marker--dropoff">
                            <MapPin size={18} />
                        </div>
                        <div className="dmap-marker-stem dmap-marker-stem--dropoff" />
                    </div>
                </Marker>
            )}

            {hasDriver && (
                <Marker longitude={driverLocation.lng} latitude={driverLocation.lat} anchor="center">
                    <div className="dmap-driver-wrap">
                        <div className="dmap-driver-shadow" />
                        <div className="dmap-driver-pulse" />
                        <div className="dmap-driver-icon">
                            <Bike size={20} />
                        </div>
                    </div>
                </Marker>
            )}

            {etaText && showRoute && (
                <div className="dmap-eta">{etaText}</div>
            )}
        </Map>
    );
};

export default DeliveryMapView;
