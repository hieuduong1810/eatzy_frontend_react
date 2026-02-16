
import { useEffect, useState, useRef, useMemo } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Store, MapPin, Navigation } from "lucide-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const isValidCoordinate = (lat, lng) => {
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

const DriverOrderMapView = ({ order, currentDriverLocation }) => {
    const mapRef = useRef(null);
    const [driverRoute, setDriverRoute] = useState(null);
    const [deliveryRoute, setDeliveryRoute] = useState(null);
    const [progressA, setProgressA] = useState(0);
    const [progressB, setProgressB] = useState(0);

    // Use live location if available, otherwise fall back to order's snapshot
    const driverLoc = currentDriverLocation && isValidCoordinate(currentDriverLocation.lat, currentDriverLocation.lng)
        ? currentDriverLocation
        : order.driverLocation;

    const hasDriver = isValidCoordinate(driverLoc?.lat, driverLoc?.lng);
    const hasPickup = isValidCoordinate(order.pickup?.lat, order.pickup?.lng);
    const hasDropoff = isValidCoordinate(order.dropoff?.lat, order.dropoff?.lng);

    // Determine destination based on status
    const isPickupPhase = ["DRIVER_ASSIGNED", "READY"].includes(order.orderStatus);
    const destination = isPickupPhase ? order.pickup : order.dropoff;

    // Ref to track last fetched location to prevent spamming API
    const lastFetchedLoc = useRef(null);
    const MIN_MOVE_DIST = 0.0005; // Approx 50 meters

    // Fetch Delivery Route (Static - only runs when pickup/dropoff changes)
    useEffect(() => {
        if (!hasPickup || !hasDropoff) return;

        const fetchDeliveryRoute = async () => {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${order.pickup.lng},${order.pickup.lat};${order.dropoff.lng},${order.dropoff.lat}?geometries=geojson&steps=true&overview=full&language=vi&access_token=${MAPBOX_TOKEN}`;
            try {
                const res = await fetch(url);
                const json = await res.json();
                if (json?.routes?.[0]) {
                    setDeliveryRoute(json.routes[0]);

                    // Fit bounds to include pickup and dropoff initially
                    const coords = [
                        [order.pickup.lng, order.pickup.lat],
                        [order.dropoff.lng, order.dropoff.lat]
                    ];
                    const lngs = coords.map((c) => c[0]);
                    const lats = coords.map((c) => c[1]);
                    mapRef.current?.getMap()?.fitBounds(
                        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                        { padding: 80, duration: 900 }
                    );
                }
            } catch (err) {
                console.error("Error fetching delivery route:", err);
            }
        };
        fetchDeliveryRoute();
    }, [order.pickup?.lng, order.pickup?.lat, order.dropoff?.lng, order.dropoff?.lat, hasPickup, hasDropoff]);


    // Fetch Driver Route (Dynamic - runs when driver moves significantly)
    useEffect(() => {
        if (!hasDriver || !destination || !isValidCoordinate(destination.lat, destination.lng)) return;

        // Check distance threshold
        if (lastFetchedLoc.current) {
            const dLat = Math.abs(driverLoc.lat - lastFetchedLoc.current.lat);
            const dLng = Math.abs(driverLoc.lng - lastFetchedLoc.current.lng);
            if (dLat < MIN_MOVE_DIST && dLng < MIN_MOVE_DIST) {
                return; // Moved too little, skip fetch
            }
        }

        const fetchDriverRoute = async () => {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${driverLoc.lng},${driverLoc.lat};${destination.lng},${destination.lat}?geometries=geojson&steps=true&overview=full&language=vi&access_token=${MAPBOX_TOKEN}`;
            try {
                const res = await fetch(url);
                const json = await res.json();
                if (json?.routes?.[0]) {
                    setDriverRoute(json.routes[0]);
                    lastFetchedLoc.current = driverLoc; // Update cached location
                }
            } catch (err) {
                console.error("Error fetching driver route:", err);
            }
        };

        fetchDriverRoute();

        // Setup animation loop only once or when dependency changes
        const startTime = performance.now();
        const animate = (time) => {
            const t = Math.min((time - startTime) / 900, 1);
            setProgressA(t);
            setProgressB(t);
            if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

    }, [driverLoc?.lat, driverLoc?.lng, destination?.lat, destination?.lng, hasDriver]);

    const driverFeature = useMemo(() => {
        if (!hasDriver || !hasPickup) return null;
        // logic should use driverRoute
        const routeGeo = driverRoute?.geometry?.coordinates;
        if (!routeGeo) return { type: "Feature", geometry: { type: "LineString", coordinates: [[driverLoc.lng, driverLoc.lat], [order.pickup.lng, order.pickup.lat]] }, properties: {} };

        const coords = routeGeo.length > 1
            ? (() => {
                const p = partial(routeGeo, progressA);
                return p.length > 1 ? p : routeGeo;
            })()
            : routeGeo;
        return { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} };
    }, [driverRoute, progressA, order, hasDriver, hasPickup, driverLoc]);

    const deliveryFeature = useMemo(() => {
        if (!hasPickup || !hasDropoff) return null;
        const routeGeo = deliveryRoute?.geometry?.coordinates;
        if (!routeGeo) return { type: "Feature", geometry: { type: "LineString", coordinates: [[order.pickup.lng, order.pickup.lat], [order.dropoff.lng, order.dropoff.lat]] }, properties: {} };

        const coords = routeGeo.length > 1
            ? (() => {
                const p = partial(routeGeo, progressB);
                return p.length > 1 ? p : routeGeo;
            })()
            : routeGeo;
        return { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} };
    }, [deliveryRoute, progressB, order, hasPickup, hasDropoff]);

    const lines = useMemo(() => ({
        type: "FeatureCollection",
        features: [driverFeature, deliveryFeature].filter(Boolean),
    }), [driverFeature, deliveryFeature]);

    const etaText = useMemo(() => {
        const d1 = Number(driverRoute?.distance ?? 0);
        const d2 = Number(deliveryRoute?.distance ?? 0);
        const dur1 = Number(driverRoute?.duration ?? 0);
        const dur2 = Number(deliveryRoute?.duration ?? 0);
        const km = (d1 + d2) / 1000;
        const min = (dur1 + dur2) / 60;
        if (km <= 0 || min <= 0) return "";
        return `${Math.round(min)} phút · ${km.toFixed(1)} km`;
    }, [driverRoute, deliveryRoute]);

    const lineLayer = {
        id: "line",
        type: "line",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
            "line-color": "#28a745", // Green color
            "line-width": 5,
            "line-opacity": 0.8
        },
    };

    const initialView = {
        longitude: order.pickup?.lng || 0,
        latitude: order.pickup?.lat || 0,
        zoom: 14,
    };

    return (
        <Map
            ref={mapRef}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={initialView}
            style={{ width: "100%", height: "100%" }}
        >
            <Source id="order-lines" type="geojson" data={lines}>
                <Layer {...lineLayer} />
            </Source>

            {hasPickup && (
                <Marker longitude={order.pickup.lng} latitude={order.pickup.lat} anchor="bottom">
                    <div className="dmap-marker-col">
                        <div className="dmap-marker dmap-marker--pickup">
                            <Store size={18} />
                        </div>
                        <div className="dmap-marker-stem dmap-marker-stem--pickup" />
                    </div>
                </Marker>
            )}

            {hasDropoff && (
                <Marker longitude={order.dropoff.lng} latitude={order.dropoff.lat} anchor="bottom">
                    <div className="dmap-marker-col">
                        <div className="dmap-marker dmap-marker--dropoff">
                            <MapPin size={18} />
                        </div>
                        <div className="dmap-marker-stem dmap-marker-stem--dropoff" />
                    </div>
                </Marker>
            )}

            {hasDriver && (
                <Marker longitude={driverLoc.lng} latitude={driverLoc.lat} anchor="center">
                    <div className="dmap-driver-wrap">
                        <div className="dmap-driver-pulse" style={{ borderColor: '#3B82F6' }} />
                        <div className="dmap-driver-dot" style={{ backgroundColor: '#3B82F6' }} />
                    </div>
                </Marker>
            )}

            {etaText && (
                <div className="dmap-eta">{etaText}</div>
            )}
        </Map>
    );
};

export default DriverOrderMapView;
