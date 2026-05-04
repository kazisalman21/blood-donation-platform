import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './InventoryPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ALL_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CRITICAL_THRESHOLD = 5;
const LOW_THRESHOLD = 15;

/**
 * InventoryPage — F17 Blood Inventory & Supply Overview
 * Displays available donor count per blood type in an 8-card grid.
 * Critical shortage (<5), Low (<15), OK (≥15) status indicators.
 * Hand-written status logic — no external library.
 */
const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchInventory();
    }, [selectedCity]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedCity) params.city = selectedCity;
            const res = await axios.get(`${API_URL}/admin/inventory`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setInventory(res.data.inventory);
            if (res.data.cities) setCities(res.data.cities);
        } catch (err) {
            console.error('Error fetching inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    // Build a lookup map from the aggregation result
    const inventoryMap = {};
    inventory.forEach(item => {
        inventoryMap[item._id] = { count: item.count, verified: item.verifiedCount || 0 };
    });

    // Calculate summary stats
    const totalDonors = ALL_BLOOD_TYPES.reduce((sum, bt) => sum + (inventoryMap[bt]?.count || 0), 0);
    const criticalCount = ALL_BLOOD_TYPES.filter(bt => (inventoryMap[bt]?.count || 0) < CRITICAL_THRESHOLD).length;
    const verifiedTotal = ALL_BLOOD_TYPES.reduce((sum, bt) => sum + (inventoryMap[bt]?.verified || 0), 0);

    /**
     * Hand-written status classification — no library.
     */
    const getStatus = (count) => {
        if (count < CRITICAL_THRESHOLD) return 'critical';
        if (count < LOW_THRESHOLD) return 'low';
        return 'ok';
    };

    const getStatusLabel = (status) => {
        if (status === 'critical') return '🔴 Critical';
        if (status === 'low') return '🟡 Low';
        return '🟢 OK';
    };

    return (
        <div className="inventory-page">
            <div className="inventory-container">
                <div className="inventory-header">
                    <div className="inventory-title-section">
                        <h1>🏥 Blood Inventory</h1>
                        <p>Real-time overview of available blood donors by type</p>
                    </div>
                    <select className="inventory-city-select" value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)} id="inventory-city-filter">
                        <option value="">All Cities</option>
                        {cities.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Summary cards */}
                <div className="inventory-summary">
                    <div className="summary-card">
                        <span className="summary-value total">{totalDonors}</span>
                        <span className="summary-label">Total Available Donors</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-value available">{ALL_BLOOD_TYPES.length - criticalCount}</span>
                        <span className="summary-label">Types in Stock</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-value critical">{criticalCount}</span>
                        <span className="summary-label">Critical Shortages</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-value verified">{verifiedTotal}</span>
                        <span className="summary-label">Verified Donors</span>
                    </div>
                </div>

                {/* Blood type cards */}
                {loading ? (
                    <div className="map-loading" style={{height: '300px'}}>
                        <div className="loading-spinner"></div>
                        <p>Loading inventory data...</p>
                    </div>
                ) : (
                    <div className="inventory-grid">
                        {ALL_BLOOD_TYPES.map(bt => {
                            const data = inventoryMap[bt] || { count: 0, verified: 0 };
                            const status = getStatus(data.count);
                            return (
                                <div className={`blood-card status-${status}`} key={bt} id={`card-${bt.replace('+','pos').replace('-','neg')}`}>
                                    <div className="blood-card-header">
                                        <div className="blood-card-type">{bt}</div>
                                        <span className={`blood-card-status ${status}`}>
                                            {getStatusLabel(status)}
                                        </span>
                                    </div>
                                    <div className="blood-card-count">{data.count}</div>
                                    <div className="blood-card-label">available donor{data.count !== 1 ? 's' : ''}</div>
                                    <div className="blood-card-verified">
                                        ✓ <strong>{data.verified}</strong> verified
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryPage;
