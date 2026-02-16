import { useCallback, useEffect, useRef, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import DriverOrderMapView from "./DriverOrderMapView";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const isValidCoordinate = (lat, lng) => {
    if (lat == null || lng == null) return false;
    const nLat = Number(lat);
    const nLng = Number(lng);
    if (nLat === 0 && nLng === 0) return false;
    return nLat >= -90 && nLat <= 90 && nLng >= -180 && nLng <= 180;
};

const DriverMapView = ({ locateVersion = 0, activeOrder = null }) => {
    const mapRef = useRef(null);
    const [userPos, setUserPos] = useState(null);
    const [error, setError] = useState(null);
    const [pulseAt, setPulseAt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        if (!navigator.geolocation) {
            setError("Trình duyệt không hỗ trợ định vị");
            return;
        }
        const id = navigator.geolocation.watchPosition(
            (p) => {
                if (cancelled) return;
                setUserPos({ lng: p.coords.longitude, lat: p.coords.latitude });
            },
            (err) => {
                if (cancelled) return;
                setError(err.message || "Không thể lấy vị trí");
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
        );
        return () => {
            cancelled = true;
            if (typeof id === "number") navigator.geolocation.clearWatch(id);
        };
    }, []);

    const initialView = isValidCoordinate(userPos?.lat, userPos?.lng)
        ? { longitude: userPos.lng, latitude: userPos.lat, zoom: 14 }
        : { longitude: 106.66, latitude: 10.76, zoom: 12 };

    const flyToUser = useCallback(() => {
        if (!isValidCoordinate(userPos?.lat, userPos?.lng)) return;
        const inst = mapRef.current;
        inst?.getMap()?.flyTo({ center: [userPos.lng, userPos.lat], zoom: 16, duration: 900 });
    }, [userPos]);

    useEffect(() => {
        flyToUser();
        setPulseAt(Date.now());
    }, [locateVersion]);

    if (!MAPBOX_TOKEN) {
        return (
            <div className="dmap-no-token">
                <div>Chưa cấu hình Mapbox token</div>
            </div>
        );
    }

    if (activeOrder) {
        return (
            <div className="dmap-full">
                <DriverOrderMapView order={activeOrder} />
            </div>
        );
    }

    return (
        <div className="dmap-full">
            <Map
                ref={mapRef}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={initialView}
                style={{ width: "100%", height: "100%" }}
            >
                {userPos && (
                    <Marker longitude={userPos.lng} latitude={userPos.lat} anchor="center">
                        <div className="dmap-user-dot-wrap">
                            <div className="dmap-user-dot" />
                            {pulseAt > 0 && Date.now() - pulseAt < 2000 && (
                                <div className="dmap-user-pulse" />
                            )}
                        </div>
                    </Marker>
                )}

                {error && (
                    <div className="dmap-error">{error}</div>
                )}
            </Map>
        </div>
    );
};

export default DriverMapView;
