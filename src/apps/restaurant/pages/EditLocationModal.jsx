import React, { useState, useEffect, useCallback } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { X, MapPin, Save, Edit2, Navigation } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./EditLocationModal.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const EditLocationModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [address, setAddress] = useState("");
    const [marker, setMarker] = useState({
        latitude: 10.8231,
        longitude: 106.6297
    });
    const [viewState, setViewState] = useState({
        latitude: 10.8231,
        longitude: 106.6297,
        zoom: 15
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setAddress(initialData.address || "");
            const lat = parseFloat(initialData.latitude) || 10.8231;
            const lng = parseFloat(initialData.longitude) || 106.6297;
            setMarker({ latitude: lat, longitude: lng });
            setViewState(prev => ({ ...prev, latitude: lat, longitude: lng }));
        }
    }, [isOpen, initialData]);

    const reverseGeocode = async (lng, lat) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=vi`
            );
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                setAddress(data.features[0].place_name);
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
        }
    };

    const onMarkerDragEnd = useCallback((event) => {
        const newLng = event.lngLat.lng;
        const newLat = event.lngLat.lat;
        setMarker({
            longitude: newLng,
            latitude: newLat
        });
        reverseGeocode(newLng, newLat);
    }, []);

    const handleSave = () => {
        onSave({
            address,
            latitude: marker.latitude,
            longitude: marker.longitude
        });
    };

    if (!isOpen) return null;

    return (
        <div className="elm-overlay" onClick={onClose}>
            <div className="elm-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="elm-header">
                    <div className="elm-header-left">
                        <div className="elm-icon-box">
                            <MapPin size={20} color="#10B981" />
                        </div>
                        <h2 className="elm-title">EDIT LOCATION</h2>
                    </div>
                    <div className="elm-header-actions">
                        <button className="elm-save-btn" onClick={handleSave} title="Save changes">
                            <Save size={20} color="#6B7280" />
                        </button>
                        <button className="elm-close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="elm-body">
                    {/* Address Input Area */}
                    <div className="elm-address-section">
                        <span className="elm-label">ADDRESS</span>
                        <div className="elm-input-wrapper">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="elm-address-input"
                                placeholder="Nhập địa chỉ của bạn..."
                            />
                            <Edit2 size={16} className="elm-edit-icon" />
                        </div>
                    </div>

                    {/* Map Area */}
                    <div className="elm-map-container">
                        <Map
                            {...viewState}
                            onMove={evt => setViewState(evt.viewState)}
                            style={{ width: "100%", height: "100%", borderRadius: "20px" }}
                            mapStyle="mapbox://styles/mapbox/streets-v12"
                            mapboxAccessToken={MAPBOX_TOKEN}
                        >
                            <NavigationControl position="bottom-right" />

                            <Marker
                                longitude={marker.longitude}
                                latitude={marker.latitude}
                                anchor="bottom"
                                draggable
                                onDragEnd={onMarkerDragEnd}
                            >
                                <div className="custom-marker">
                                    <div className="marker-pin"></div>
                                    <div className="marker-pulse"></div>
                                </div>
                            </Marker>

                            {/* Floating Instruction */}
                            <div className="elm-map-instruction">
                                <Navigation size={14} />
                                <span>Di chuyển ghim trên bản đồ để cập nhật tọa độ chính xác.</span>
                            </div>
                        </Map>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLocationModal;
