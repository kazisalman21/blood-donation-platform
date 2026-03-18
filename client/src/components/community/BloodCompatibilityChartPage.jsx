/**
 * BloodCompatibilityChartPage — View layer for Feature 20
 * Owner: Miskatul Afrin Anika
 *
 * SRS Requirement:
 * FR-20.2: Display a color-coded blood compatibility chart
 *          (static component, hand-coded data — no library)
 */
import React, { useState } from 'react';
import './FAQ.css';

// Hand-written compatibility data matching server/utils/bloodCompatibility.js
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const compatibilityMap = {
    'A+':  ['A+', 'A-', 'O+', 'O-'],
    'A-':  ['A-', 'O-'],
    'B+':  ['B+', 'B-', 'O+', 'O-'],
    'B-':  ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['AB-', 'A-', 'B-', 'O-'],
    'O+':  ['O+', 'O-'],
    'O-':  ['O-']
};

const BloodCompatibilityChartPage = () => {
    const [hoveredCell, setHoveredCell] = useState(null);

    const isCompatible = (recipient, donor) => {
        return compatibilityMap[recipient]?.includes(donor) || false;
    };

    return (
        <div className="faq-page">
            <div className="faq-container">
                <div className="faq-header">
                    <h1 className="faq-title">🩸 Blood Compatibility Chart</h1>
                    <p className="faq-subtitle">Which blood types can donate to which recipients?</p>
                </div>

                {/* Legend */}
                <div className="compat-legend">
                    <span className="compat-legend-item">
                        <span className="compat-dot compatible"></span> Compatible
                    </span>
                    <span className="compat-legend-item">
                        <span className="compat-dot incompatible"></span> Incompatible
                    </span>
                </div>

                {/* Compatibility Table */}
                <div className="compat-table-wrapper">
                    <table className="compat-table">
                        <thead>
                            <tr>
                                <th className="compat-corner">Recipient ↓ / Donor →</th>
                                {BLOOD_TYPES.map(bt => (
                                    <th key={bt} className="compat-header">{bt}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {BLOOD_TYPES.map(recipient => (
                                <tr key={recipient}>
                                    <td className="compat-row-header">{recipient}</td>
                                    {BLOOD_TYPES.map(donor => {
                                        const compatible = isCompatible(recipient, donor);
                                        const cellKey = `${recipient}-${donor}`;
                                        return (
                                            <td
                                                key={donor}
                                                className={`compat-cell ${compatible ? 'yes' : 'no'} ${hoveredCell === cellKey ? 'hovered' : ''}`}
                                                onMouseEnter={() => setHoveredCell(cellKey)}
                                                onMouseLeave={() => setHoveredCell(null)}
                                                title={`${donor} → ${recipient}: ${compatible ? 'Compatible ✓' : 'Incompatible ✕'}`}
                                            >
                                                {compatible ? '✓' : '✕'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Quick Facts */}
                <div className="compat-facts">
                    <div className="compat-fact-card">
                        <span className="compat-fact-icon">🏥</span>
                        <h3>Universal Donor</h3>
                        <p>O- can donate to <strong>all</strong> blood types</p>
                    </div>
                    <div className="compat-fact-card">
                        <span className="compat-fact-icon">💉</span>
                        <h3>Universal Recipient</h3>
                        <p>AB+ can receive from <strong>all</strong> blood types</p>
                    </div>
                    <div className="compat-fact-card">
                        <span className="compat-fact-icon">⏱️</span>
                        <h3>56-Day Rule</h3>
                        <p>Minimum <strong>56 days</strong> between whole-blood donations</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BloodCompatibilityChartPage;
