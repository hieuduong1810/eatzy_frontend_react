import { useState, useRef, useEffect, useCallback } from "react";
import { locationActions, useLocationStore } from "../../../stores/locationStore";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { X, Search, MapPin, Navigation, Clock, Home, Building, Hand } from "lucide-react";

// ... (existing code)


import "mapbox-gl/dist/mapbox-gl.css";
import "./LocationPickerModal.css";

// Use a public token or process.env. If you don't have one, the map might not load tiles but will show the container.
// This is a placeholder public token for demo or development functionality if allowed.
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const DEFAULT_VIEWPORT = {
    latitude: 10.762622,
    longitude: 106.660172,
    zoom: 14
};

const recentLocations = [
    { id: 1, type: "home", name: "Nhà riêng", address: "123 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM" },
    { id: 2, type: "work", name: "Công ty", address: "Toà nhà Bitexco, 2 Hải Triều, Bến Nghé, Quận 1" },
    { id: 3, type: "history", name: "Starbucks Rex", address: "141 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM" },
];

export default function LocationPickerModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    console.log("LocationPickerModal rendering - Draggable Green Pin Version");

    const { location } = useLocationStore();
    const mapRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Initialize selected address from store if available
    const [selectedAddress, setSelectedAddress] = useState(
        location ? {
            id: 'current',
            name: location.name,
            address: location.address,
            type: 'current'
        } : recentLocations[0]
    );

    const [markerPosition, setMarkerPosition] = useState({
        longitude: location ? location.longitude : DEFAULT_VIEWPORT.longitude,
        latitude: location ? location.latitude : DEFAULT_VIEWPORT.latitude
    });

    const isProgrammaticSearch = useRef(false);

    // Debounce search input
    useEffect(() => {
        if (isProgrammaticSearch.current) {
            isProgrammaticSearch.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            if (searchQuery.length > 2) {
                handleSearch(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = async (query) => {
        setIsSearching(true);
        try {
            const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=vn&language=vi&autocomplete=true&limit=5`;
            const response = await fetch(endpoint);
            const data = await response.json();
            setSearchResults(data.features || []);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLocation = (feature) => {
        const [lng, lat] = feature.center;

        // Update marker position
        setMarkerPosition({ longitude: lng, latitude: lat });

        // Update selected address state
        setSelectedAddress({
            id: feature.id,
            name: feature.text,
            address: feature.place_name,
            type: 'search'
        });

        // Set search query to persist
        isProgrammaticSearch.current = true;
        setSearchQuery(feature.text);
        setSearchResults([]);

        // Fly to location
        mapRef.current?.flyTo({
            center: [lng, lat],
            zoom: 16,
            duration: 1000
        });
    };

    // Handle marker drag end
    const onMarkerDragEnd = useCallback(async (evt) => {
        const { lng, lat } = evt.lngLat;
        setMarkerPosition({ longitude: lng, latitude: lat });

        try {
            // Reverse geocode
            const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=poi,address&limit=1`;
            const response = await fetch(endpoint);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                setSelectedAddress({
                    id: feature.id,
                    name: feature.text,
                    address: feature.place_name,
                    type: 'map-pin'
                });
                // Update search query to reflect the new location
                isProgrammaticSearch.current = true;
                setSearchQuery(feature.text);
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
        }
    }, []);

    return (
        <div className="cust-location-modal-overlay" onClick={onClose}>
            <div className="cust-location-modal" onClick={(e) => e.stopPropagation()}>
                <button className="cust-location-close" onClick={onClose}>
                    <X size={20} />
                </button>

                {/* ── Left: Map ── */}
                <div className="cust-location-map-col">
                    <div className="cust-map-search-float">
                        <Search size={18} color="#888" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm địa điểm, tòa nhà, đường..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="cust-search-clear-btn" onClick={() => { setSearchQuery(""); setSearchResults([]); }}>
                                <X size={16} />
                            </button>
                        )}

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="cust-search-dropdown">
                                {searchResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="cust-search-item"
                                        onClick={() => handleSelectLocation(result)}
                                    >
                                        <MapPin size={16} className="cust-search-icon-sm" />
                                        <div className="cust-search-text">
                                            <span className="cust-search-name">{result.text}</span>
                                            <span className="cust-search-addr">{result.place_name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="cust-map-wrapper">
                        <Map
                            ref={mapRef}
                            initialViewState={{
                                ...DEFAULT_VIEWPORT,
                                longitude: markerPosition.longitude,
                                latitude: markerPosition.latitude
                            }}
                            style={{ width: "100%", height: "100%" }}
                            mapStyle="mapbox://styles/mapbox/streets-v12"
                            mapboxAccessToken={MAPBOX_TOKEN}
                        >
                            <NavigationControl position="bottom-right" />

                            {/* Draggable Marker */}
                            <Marker
                                longitude={markerPosition.longitude}
                                latitude={markerPosition.latitude}
                                draggable
                                onDragEnd={onMarkerDragEnd}
                                anchor="bottom"
                            >
                                <div className="cust-marker-container">
                                    <div className="cust-marker-pin">
                                        <Hand size={20} color="white" strokeWidth={2.5} />
                                    </div>
                                    <div className="cust-marker-shadow"></div>
                                </div>
                            </Marker>
                        </Map>
                    </div>
                </div>

                {/* ── Right: Sidebar ── */}
                <div className="cust-location-sidebar">
                    <div className="cust-location-header">
                        <h2 className="cust-location-title">BẠN MUỐN GIAO ĐẾN ĐÂU?</h2>
                        <p className="cust-location-subtitle">Kéo thả ghim hoặc tìm kiếm địa chỉ của bạn</p>
                    </div>

                    <div className="cust-location-body">
                        <div className="cust-loc-section-title">
                            <Clock size={14} /> Địa điểm gần đây
                        </div>
                        <div className="cust-recent-list">
                            {recentLocations.map((loc) => (
                                <div
                                    key={loc.id}
                                    className="cust-addr-item"
                                    onClick={() => setSelectedAddress(loc)}
                                >
                                    <div className="cust-addr-icon">
                                        {loc.type === 'home' ? <Home size={18} /> :
                                            loc.type === 'work' ? <Building size={18} /> : <MapPin size={18} />}
                                    </div>
                                    <div className="cust-addr-content">
                                        <span className="cust-addr-name">{loc.name}</span>
                                        <span className="cust-addr-detail">{loc.address}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cust-location-footer">
                        <div className="cust-loc-section-title" style={{ marginBottom: 12 }}>
                            ĐỊA CHỈ ĐANG CHỌN
                        </div>
                        <div className="cust-selected-box">
                            <div className="cust-selected-icon">
                                <Navigation size={20} fill="currentColor" />
                            </div>
                            <div className="cust-addr-content">
                                <span className="cust-addr-name">{selectedAddress?.name || "Vị trí trên bản đồ"}</span>
                                <span className="cust-addr-detail">{selectedAddress?.address || "Đang xác định..."}</span>
                            </div>
                        </div>
                        <button className="cust-confirm-btn" onClick={() => {
                            if (selectedAddress) {
                                locationActions.setLocation({
                                    latitude: markerPosition.latitude,
                                    longitude: markerPosition.longitude,
                                    address: selectedAddress.address,
                                    name: selectedAddress.name
                                });
                                onClose();
                            }
                        }}>
                            <span>Xác nhận địa điểm</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
