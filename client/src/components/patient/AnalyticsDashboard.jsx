import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './AnalyticsDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PIE_COLORS = ['#ef4444', '#f87171', '#3b82f6', '#60a5fa', '#8b5cf6', '#a78bfa', '#10b981', '#34d399'];

/**
 * Custom tooltip for dark theme — hand-written, no library.
 */
const DarkTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.82rem'
        }}>
            <p style={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
            ))}
        </div>
    );
};

const AnalyticsDashboard = () => {
    const [requestData, setRequestData] = useState([]);
    const [donationData, setDonationData] = useState([]);
    const [matchRateData, setMatchRateData] = useState([]);
    const [responseTime, setResponseTime] = useState({ averageResponseTimeHours: 0, totalMatched: 0 });
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [reqRes, donRes, matchRes, respRes] = await Promise.all([
                axios.get(`${API_URL}/admin/analytics/requests`, { headers }),
                axios.get(`${API_URL}/admin/analytics/donations`, { headers }),
                axios.get(`${API_URL}/admin/analytics/matchrate`, { headers }),
                axios.get(`${API_URL}/admin/analytics/responsetime`, { headers })
            ]);
            setRequestData(reqRes.data.map(d => ({ week: `W${d._id}`, requests: d.count })));
            setDonationData(donRes.data.map(d => ({ city: d._id || 'Unknown', donations: d.count })));
            setMatchRateData(matchRes.data.map(d => ({
                name: d._id, total: d.total, matched: d.matched,
                rate: Math.round(d.rate)
            })));
            setResponseTime(respRes.data);
        } catch (err) {
            console.error('Analytics error:', err);
        } finally {
            setLoading(false);
        }
    };

    // KPI calculations — hand-written
    const totalRequests = requestData.reduce((sum, d) => sum + d.requests, 0);
    const totalDonations = donationData.reduce((sum, d) => sum + d.donations, 0);
    const avgMatchRate = matchRateData.length > 0
        ? Math.round(matchRateData.reduce((sum, d) => sum + d.rate, 0) / matchRateData.length)
        : 0;

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="analytics-container">
                    <div className="map-loading" style={{height:'400px'}}>
                        <div className="loading-spinner"></div>
                        <p>Loading analytics data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="analytics-container">
                <div className="analytics-header">
                    <h1>📈 Platform Analytics</h1>
                    <p>Comprehensive overview of platform activity, matching performance, and response metrics</p>
                </div>

                {/* KPI Row */}
                <div className="analytics-kpis">
                    <div className="kpi-card kpi-requests">
                        <span className="kpi-icon">🚨</span>
                        <div className="kpi-value">{totalRequests}</div>
                        <div className="kpi-label">Requests (8 Weeks)</div>
                    </div>
                    <div className="kpi-card kpi-donations">
                        <span className="kpi-icon">🩸</span>
                        <div className="kpi-value">{totalDonations}</div>
                        <div className="kpi-label">Total Donations</div>
                    </div>
                    <div className="kpi-card kpi-matchrate">
                        <span className="kpi-icon">🎯</span>
                        <div className="kpi-value">{avgMatchRate}%</div>
                        <div className="kpi-label">Avg Match Rate</div>
                    </div>
                    <div className="kpi-card kpi-response">
                        <span className="kpi-icon">⏱️</span>
                        <div className="kpi-value">{responseTime.averageResponseTimeHours}h</div>
                        <div className="kpi-label">Avg Response Time</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="analytics-charts">
                    {/* Line Chart — Requests per Week */}
                    <div className="chart-panel" id="chart-requests">
                        <h3>📉 Requests Per Week (Last 8 Weeks)</h3>
                        {requestData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={requestData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" />
                                    <YAxis stroke="rgba(255,255,255,0.3)" />
                                    <Tooltip content={<DarkTooltip />} />
                                    <Line type="monotone" dataKey="requests" stroke="#ef4444" strokeWidth={2}
                                        dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <div className="chart-empty">No request data available</div>}
                    </div>

                    {/* Bar Chart — Donations by City */}
                    <div className="chart-panel" id="chart-donations">
                        <h3>🏙️ Donations by City</h3>
                        {donationData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={donationData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="city" stroke="rgba(255,255,255,0.3)" />
                                    <YAxis stroke="rgba(255,255,255,0.3)" />
                                    <Tooltip content={<DarkTooltip />} />
                                    <Bar dataKey="donations" fill="#34d399" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="chart-empty">No donation data available</div>}
                    </div>

                    {/* Pie Chart — Match Rate by Blood Type */}
                    <div className="chart-panel" id="chart-matchrate">
                        <h3>🎯 Match Rate by Blood Type</h3>
                        {matchRateData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={matchRateData} dataKey="total" nameKey="name"
                                        cx="50%" cy="50%" outerRadius={90} label={({ name, rate }) => `${name}: ${rate}%`}>
                                        {matchRateData.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<DarkTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className="chart-empty">No match rate data available</div>}
                    </div>

                    {/* Bar Chart — Matched vs Total per Blood Type */}
                    <div className="chart-panel" id="chart-comparison">
                        <h3>📊 Matched vs Total Requests</h3>
                        {matchRateData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={matchRateData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                                    <YAxis stroke="rgba(255,255,255,0.3)" />
                                    <Tooltip content={<DarkTooltip />} />
                                    <Legend />
                                    <Bar dataKey="total" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Total" />
                                    <Bar dataKey="matched" fill="#34d399" radius={[4, 4, 0, 0]} name="Matched" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="chart-empty">No data available</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
