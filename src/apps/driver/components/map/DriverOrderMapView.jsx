import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Store, MapPin } from "lucide-react";

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

const DriverOrderMapView = ({ order }) => {
    const mapRef = useRef(null);
    const [driverRoute, setDriverRoute] = useState(null);
    const [deliveryRoute, setDeliveryRoute] = useState(null);
    const [progressA, setProgressA] = useState(0);
    const [progressB, setProgressB] = useState(0);

    const hasDriver = isValidCoordinate(order.driverLocation?.lat, order.driverLocation?.lng);
    const hasPickup = isValidCoordinate(order.pickup?.lat, order.pickup?.lng);
    const hasDropoff = isValidCoordinate(order.dropoff?.lat, order.dropoff?.lng);

    useEffect(() => {
        if (!hasPickup || !hasDropoff) return;

        const fetchRoute = async (start, end) => {
            try {
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&steps=true&overview=full&language=vi&access_token=${MAPBOX_TOKEN}`;
                const res = await fetch(url);
                const json = await res.json();
                return json?.routes?.[0] ?? null;
            } catch {
                return null;
            }
        };

        (async () => {
            const a = hasDriver ? await fetchRoute(order.driverLocation, order.pickup) : null;
            const b = await fetchRoute(order.pickup, order.dropoff);
            setDriverRoute(a);
            setDeliveryRoute(b);

            const inst = mapRef.current;
            const coords = [
                ...(a?.geometry?.coordinates ?? []),
                ...(b?.geometry?.coordinates ?? []),
                ...(hasDriver ? [[order.driverLocation.lng, order.driverLocation.lat]] : []),
                [order.pickup.lng, order.pickup.lat],
                [order.dropoff.lng, order.dropoff.lat],
            ];
            const lngs = coords.map((c) => c[0]);
            const lats = coords.map((c) => c[1]);

            inst?.getMap()?.fitBounds(
                [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                { padding: 80, duration: 900 }
            );

            const startTime = performance.now();
            const animate = (time) => {
                const t = Math.min((time - startTime) / 900, 1);
                setProgressA(t);
                setProgressB(t);
                if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        })();
    }, [order, hasDriver, hasPickup, hasDropoff]);

    const driverFeature = useMemo(() => {
        if (!hasDriver || !hasPickup) return null;
        const coords = driverRoute?.geometry?.coordinates?.length > 1
            ? (() => {
                const p = partial(driverRoute.geometry.coordinates, progressA);
                return p.length > 1 ? p : [[order.driverLocation.lng, order.driverLocation.lat], [order.pickup.lng, order.pickup.lat]];
            })()
            : [[order.driverLocation.lng, order.driverLocation.lat], [order.pickup.lng, order.pickup.lat]];
        return { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} };
    }, [driverRoute, progressA, order, hasDriver, hasPickup]);

    const deliveryFeature = useMemo(() => {
        if (!hasPickup || !hasDropoff) return null;
        const coords = deliveryRoute?.geometry?.coordinates?.length > 1
            ? (() => {
                const p = partial(deliveryRoute.geometry.coordinates, progressB);
                return p.length > 1 ? p : [[order.pickup.lng, order.pickup.lat], [order.dropoff.lng, order.dropoff.lat]];
            })()
            : [[order.pickup.lng, order.pickup.lat], [order.dropoff.lng, order.dropoff.lat]];
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

    const initialView = { longitude: order.pickup.lng, latitude: order.pickup.lat, zoom: 13 };

    const lineLayer = {
        id: "route-lines",
        type: "line",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#78C841", "line-width": 5, "line-opacity": 0.95 },
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
                <Marker longitude={order.driverLocation.lng} latitude={order.driverLocation.lat} anchor="center">
                    <div className="dmap-driver-wrap">
                        <div className="dmap-driver-pulse" />
                        <div className="dmap-driver-dot" />
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
