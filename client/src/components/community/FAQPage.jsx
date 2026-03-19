/**
 * FAQPage — View layer for Feature 20 (Content & FAQ Management)
 * Owner: Miskatul Afrin Anika
 * Controller: communityController.getFAQs()
 * Model: FAQ.js
 *
 * SRS Requirements:
 * FR-20.1: Display FAQs in accordion format grouped by category tabs
 *          (Eligibility, Blood Types, Preparation, After Donation)
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './FAQ.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CATEGORIES = ['Eligibility', 'Blood Types', 'Preparation', 'After Donation'];

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Eligibility');
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const res = await axios.get(`${API_URL}/community/faqs`);
                setFaqs(res.data);
            } catch (err) {
                console.error('Failed to load FAQs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, []);

    const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);

    const toggleFAQ = (id) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    if (loading) return <div className="loading-screen">Loading FAQs...</div>;

    return (
        <div className="faq-page">
            <div className="faq-container">
                <div className="faq-header">
                    <h1 className="faq-title">❓ Frequently Asked Questions</h1>
                    <p className="faq-subtitle">Everything you need to know about blood donation</p>
                </div>

                {/* Category Tabs (FR-20.1) */}
                <div className="faq-tabs">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`faq-tab ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => { setActiveCategory(cat); setExpandedFAQ(null); }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Accordion FAQ List (FR-20.1) */}
                <div className="faq-list">
                    {filteredFAQs.length === 0 ? (
                        <p className="faq-empty">No FAQs in this category yet.</p>
                    ) : (
                        filteredFAQs.map(faq => (
                            <div
                                key={faq._id}
                                className={`faq-item ${expandedFAQ === faq._id ? 'expanded' : ''}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => toggleFAQ(faq._id)}
                                >
                                    <span>{faq.question}</span>
                                    <span className={`faq-arrow ${expandedFAQ === faq._id ? 'open' : ''}`}>
                                        ▼
                                    </span>
                                </button>
                                {expandedFAQ === faq._id && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Cross-link to Blood Compatibility Chart */}
                <div className="faq-crosslink">
                    <Link to="/blood-compatibility" className="faq-crosslink-btn">
                        🩸 View Blood Compatibility Chart →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
