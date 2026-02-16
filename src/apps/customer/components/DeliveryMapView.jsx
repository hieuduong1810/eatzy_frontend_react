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
 * - showRoute: boolean (default true) – whether to fetch & draw route
 * - interactive: boolean (default true) – allow pan/zoom
 * - style: CSS style object for the container
 */
const DeliveryMapView = ({
    pickup,
    dropoff,
    driverLocation,
    showRoute = true,
    interactive = true,
    style,
}) => {
    const mapRef = useRef(null);
    const [route, setRoute] = useState(null);
    const [progress, setProgress] = useState(0);

    const hasPickup = pickup && isValid(pickup.lat, pickup.lng);
    const hasDropoff = dropoff && isValid(dropoff.lat, dropoff.lng);
    const hasDriver = driverLocation && isValid(driverLocation.lat, driverLocation.lng);

    // Fetch Directions route
    useEffect(() => {
        if (!showRoute || !hasPickup || !hasDropoff) return;

        const fetchRoute = async () => {
            try {
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?geometries=geojson&steps=true&overview=full&language=vi&access_token=${MAPBOX_TOKEN}`;
                const res = await fetch(url);
                const json = await res.json();
                const r = json?.routes?.[0] ?? null;
                setRoute(r);

                // Fit bounds to route
                const inst = mapRef.current;
                const coords = [
                    ...(r?.geometry?.coordinates ?? []),
                    [pickup.lng, pickup.lat],
                    [dropoff.lng, dropoff.lat],
                    ...(hasDriver ? [[driverLocation.lng, driverLocation.lat]] : []),
                ];
                const lngs = coords.map((c) => c[0]);
                const lats = coords.map((c) => c[1]);
                inst?.getMap()?.fitBounds(
                    [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                    { padding: 60, duration: 900 }
                );

                // Animate route draw
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
    }, [pickup, dropoff, driverLocation, showRoute, hasPickup, hasDropoff, hasDriver]);

    // If no route, just fit bounds to markers when we have them
    useEffect(() => {
        if (showRoute) return;
        if (!hasPickup && !hasDropoff) return;
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

    const routeFeature = useMemo(() => {
        if (!route?.geometry?.coordinates) return null;
        const coords = route.geometry.coordinates.length > 1
            ? partial(route.geometry.coordinates, progress)
            : (hasPickup && hasDropoff
                ? [[pickup.lng, pickup.lat], [dropoff.lng, dropoff.lat]]
                : []);
        if (coords.length < 2) return null;
        return { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} };
    }, [route, progress, pickup, dropoff, hasPickup, hasDropoff]);

    const lineData = useMemo(() => ({
        type: "FeatureCollection",
        features: routeFeature ? [routeFeature] : [],
    }), [routeFeature]);

    const etaText = useMemo(() => {
        if (!route) return "";
        const km = (Number(route.distance ?? 0)) / 1000;
        const min = (Number(route.duration ?? 0)) / 60;
        if (km <= 0 || min <= 0) return "";
        return `${Math.round(min)} phút · ${km.toFixed(1)} km`;
    }, [route]);

    const center = hasPickup
        ? { longitude: pickup.lng, latitude: pickup.lat }
        : hasDropoff
            ? { longitude: dropoff.lng, latitude: dropoff.lat }
            : { longitude: 106.7, latitude: 10.78 };

    const lineLayer = {
        id: "customer-route-line",
        type: "line",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#78C841", "line-width": 5, "line-opacity": 0.95 },
    };

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
            {showRoute && (
                <Source id="customer-route" type="geojson" data={lineData}>
                    <Layer {...lineLayer} />
                </Source>
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
