import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DonationStatsCard = () => {
    const { user, token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/community/donors/${user._id}/stats`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStats(res.data);
            } catch (err) {
                console.error('Failed to load stats:', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchStats();
    }, [user, token]);

    if (loading || !stats) return null;

    // Transform monthly breakdown data for Recharts
    const chartData = stats.monthlyBreakdown
        ? stats.monthlyBreakdown
            .map(item => ({
                month: `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`,
                donations: item.count
            }))
            .reverse() // oldest first for chart
        : [];

    // Custom tooltip for the bar chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'rgba(15, 15, 20, 0.95)',
                    border: '1px solid rgba(239, 83, 80, 0.3)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.8rem',
                    fontSize: '0.8rem'
                }}>
                    <p style={{ color: '#fff', margin: 0 }}>{label}</p>
                    <p style={{ color: '#ef5350', margin: 0, fontWeight: 700 }}>
                        {payload[0].value} donation{payload[0].value !== 1 ? 's' : ''}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
        }}>
            <h3 style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                Donation Statistics
            </h3>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.8rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    background: 'rgba(239, 83, 80, 0.1)',
                    border: '1px solid rgba(239, 83, 80, 0.2)',
                    borderRadius: '10px',
                    padding: '1rem',
                    textAlign: 'center'
                }}>
                    <span style={{ display: 'block', fontSize: '2rem', fontWeight: 800, color: '#ef5350' }}>
                        {stats.totalDonations}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        Total Donations
                    </span>
                </div>
                <div style={{
                    background: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    borderRadius: '10px',
                    padding: '1rem',
                    textAlign: 'center'
                }}>
                    <span style={{ display: 'block', fontSize: '2rem', fontWeight: 800, color: '#4caf50' }}>
                        {stats.livesHelped}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        Lives Helped
                    </span>
                </div>
            </div>

            {/* Monthly Bar Chart */}
            {chartData.length > 0 ? (
                <div>
                    <p style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.8rem',
                        marginBottom: '0.8rem'
                    }}>
                        Monthly Breakdown (Last 12 Months)
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="donations"
                                fill="#ef5350"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                    No monthly data yet — complete donations to see your chart!
                </p>
            )}
        </div>
    );
};

export default DonationStatsCard;
