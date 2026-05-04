import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import haversineDistance from '../../utils/distance';
import 'leaflet/dist/leaflet.css';
import './DonorMapPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Hand-written city-to-coordinate map — no external geocoding library.
 * Covers major Bangladeshi cities for F10 Location-Based Donor Search.
 */
const CITY_COORDS = {
    'Dhaka':        { lat: 23.8103, lng: 90.4125 },
    'Chittagong':   { lat: 22.3569, lng: 91.7832 },
    'Sylhet':       { lat: 24.8949, lng: 91.8687 },
    'Rajshahi':     { lat: 24.3636, lng: 88.6241 },
    'Khulna':       { lat: 22.8456, lng: 89.5403 },
    'Barisal':      { lat: 22.7010, lng: 90.3535 },
    'Rangpur':      { lat: 25.7439, lng: 89.2752 },
    'Mymensingh':   { lat: 24.7471, lng: 90.4203 },
    'Comilla':      { lat: 23.4607, lng: 91.1809 },
    'Gazipur':      { lat: 23.9999, lng: 90.4203 },
    'Narayanganj':  { lat: 23.6238, lng: 90.5000 },
    'Bogra':        { lat: 24.8465, lng: 89.3773 },
    "Cox's Bazar":  { lat: 21.4272, lng: 92.0058 },
    'Jessore':      { lat: 23.1667, lng: 89.2167 },
    'Dinajpur':     { lat: 25.6217, lng: 88.6354 }
};

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const RADIUS_OPTIONS = [
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
    { label: '20 km', value: 20 },
    { label: '50 km', value: 50 },
    { label: 'All', value: 0 }
];

/**
 * Hand-written blood-type-to-color map for map markers.
 */
const BLOOD_COLORS = {
    'A+': '#ef4444', 'A-': '#f87171',
    'B+': '#3b82f6', 'B-': '#60a5fa',
    'AB+': '#8b5cf6', 'AB-': '#a78bfa',
    'O+': '#10b981', 'O-': '#34d399'
};

/**
 * Create a custom Leaflet icon for a donor marker.
 * Hand-written SVG icon generation — no icon library.
 */
const createDonorIcon = (bloodType) => {
    const color = BLOOD_COLORS[bloodType] || '#ef4444';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="${color}" opacity="0.9"/>
        <circle cx="14" cy="13" r="8" fill="white" opacity="0.95"/>
        <text x="14" y="16" text-anchor="middle" fill="${color}" font-size="7" font-weight="800" font-family="Inter,sans-serif">${bloodType}</text>
    </svg>`;
    return L.divIcon({
        html: svg,
        className: 'custom-marker',
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -36]
    });
};

/** Component to re-center map when city changes */
const MapRecenter = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom]);
    return null;
};

const DonorMapPage = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState('Dhaka');
    const [bloodFilter, setBloodFilter] = useState('');
    const [radiusKm, setRadiusKm] = useState(20);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const { token, user } = useAuth();

    // Set initial city from user profile
    useEffect(() => {
        if (user?.city && CITY_COORDS[user.city]) {
            setSelectedCity(user.city);
        }
    }, [user]);

    useEffect(() => {
        fetchDonors();
    }, [selectedCity, bloodFilter]);

    const fetchDonors = async () => {
        setLoading(true);
        try {
            const params = { city: selectedCity, isAvailable: 'true' };
            if (bloodFilter) params.bloodType = bloodFilter;
            const res = await axios.get(`${API_URL}/donors/search`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setDonors(res.data);
        } catch (err) {
            console.error('Error fetching donors:', err);
        } finally {
            setLoading(false);
        }
    };

    const cityCenter = CITY_COORDS[selectedCity] || CITY_COORDS['Dhaka'];

    /**
     * Hand-written donor positioning algorithm — no geocoding library.
     * Assigns approximate lat/lng to donors based on their city + a deterministic offset
     * derived from their name hash so pins don't overlap.
     */
    const donorsWithCoords = useMemo(() => {
        return donors.map((donor, idx) => {
            const base = CITY_COORDS[donor.city] || cityCenter;
            // Deterministic scatter: use donor name chars as seed
            const nameSum = (donor.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            const angle = ((nameSum + idx * 137) % 360) * (Math.PI / 180);
            const dist = ((nameSum + idx * 73) % 100) / 100 * 0.04 + 0.005;
            const lat = base.lat + Math.cos(angle) * dist;
            const lng = base.lng + Math.sin(angle) * dist;
            const distFromCenter = haversineDistance(cityCenter.lat, cityCenter.lng, lat, lng);
            return { ...donor, lat, lng, distFromCenter };
        });
    }, [donors, cityCenter]);

    // Filter by radius
    const filteredDonors = useMemo(() => {
        if (radiusKm === 0) return donorsWithCoords;
        return donorsWithCoords.filter(d => d.distFromCenter <= radiusKm);
    }, [donorsWithCoords, radiusKm]);

    return (
        <div className="donor-map-page">
            <div className="donor-map-container">
                <div className="donor-map-header">
                    <h1>📍 Donor Map Search</h1>
                    <p>Find available blood donors near you with real-time map visualization</p>
                </div>

                {/* Filters */}
                <div className="map-filters">
                    <select className="map-filter-select" value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)} id="filter-city">
                        {Object.keys(CITY_COORDS).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <select className="map-filter-select" value={bloodFilter}
                        onChange={(e) => setBloodFilter(e.target.value)} id="filter-blood">
                        <option value="">All Blood Types</option>
                        {BLOOD_TYPES.map(bt => (
                            <option key={bt} value={bt}>{bt}</option>
                        ))}
                    </select>

                    <select className="map-filter-select" value={radiusKm}
                        onChange={(e) => setRadiusKm(Number(e.target.value))} id="filter-radius">
                        {RADIUS_OPTIONS.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>

                    <div className="map-stats-bar">
                        <div className="map-stat">Donors: <strong>{filteredDonors.length}</strong></div>
                        <div className="map-stat">City: <strong>{selectedCity}</strong></div>
                    </div>
                </div>

                {/* Map + Sidebar */}
                <div className="map-wrapper">
                    <div className="leaflet-container-wrap">
                        <MapContainer center={[cityCenter.lat, cityCenter.lng]} zoom={13}
                            style={{ height: '100%', width: '100%' }} id="donor-map">
                            <MapRecenter center={[cityCenter.lat, cityCenter.lng]} zoom={13} />
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />

                            {/* Radius circle */}
                            {radiusKm > 0 && (
                                <Circle center={[cityCenter.lat, cityCenter.lng]}
                                    radius={radiusKm * 1000}
                                    pathOptions={{
                                        color: 'rgba(239, 68, 68, 0.5)',
                                        fillColor: 'rgba(239, 68, 68, 0.08)',
                                        fillOpacity: 0.3,
                                        weight: 1
                                    }}
                                />
                            )}

                            {/* Donor markers */}
                            {filteredDonors.map(donor => (
                                <Marker key={donor._id} position={[donor.lat, donor.lng]}
                                    icon={createDonorIcon(donor.bloodType)}
                                    eventHandlers={{
                                        click: () => setSelectedDonor(donor._id)
                                    }}>
                                    <Popup>
                                        <div className="donor-popup">
                                            <h4>{donor.name} {donor.isVerified ? '✓' : ''}</h4>
                                            <p>📍 {donor.city}{donor.area ? `, ${donor.area}` : ''}</p>
                                            <p>📏 {donor.distFromCenter.toFixed(1)} km away</p>
                                            <span className="popup-blood">{donor.bloodType}</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* Sidebar */}
                    <div className="map-sidebar">
                        <div className="sidebar-header">
                            <h3>🩸 Available Donors</h3>
                            <p>{filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''} in range</p>
                        </div>
                        <div className="sidebar-list">
                            {loading ? (
                                <div className="map-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Searching donors...</p>
                                </div>
                            ) : filteredDonors.length === 0 ? (
                                <div className="map-empty">
                                    <span className="map-empty-icon">🔍</span>
                                    <p>No donors found in this area. Try a larger radius or different city.</p>
                                </div>
                            ) : (
                                filteredDonors
                                    .sort((a, b) => a.distFromCenter - b.distFromCenter)
                                    .map(donor => (
                                    <div key={donor._id}
                                        className={`sidebar-donor ${selectedDonor === donor._id ? 'active' : ''}`}
                                        onClick={() => setSelectedDonor(donor._id)}>
                                        <div className="sidebar-avatar">
                                            {donor.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div className="sidebar-donor-info">
                                            <h4>
                                                {donor.name}
                                                {donor.isVerified && <span style={{color: '#60a5fa'}}>✓</span>}
                                            </h4>
                                            <p>{donor.city}{donor.area ? `, ${donor.area}` : ''}</p>
                                        </div>
                                        <span className="sidebar-blood">{donor.bloodType}</span>
                                        <span className="sidebar-distance">{donor.distFromCenter.toFixed(1)} km</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorMapPage;
