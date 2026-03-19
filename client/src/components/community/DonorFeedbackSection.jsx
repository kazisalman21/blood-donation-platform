/**
 * DonorFeedbackSection — View layer for Feature 15 (Public Feedback Display)
 * Owner: Miskatul Afrin Anika
 * Controller: communityController.getDonorFeedback()
 * Model: Feedback.js
 *
 * SRS Requirement:
 * FR-15.5: Display approved public feedback on the donor's profile page
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Feedback.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DonorFeedbackSection = ({ donorId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get(`${API_URL}/community/feedback/donor/${donorId}`);
                setFeedbacks(res.data);
            } catch (err) {
                console.error('Failed to load feedback:', err);
            } finally {
                setLoading(false);
            }
        };
        if (donorId) fetchFeedback();
    }, [donorId]);

    if (loading) return null;
    if (feedbacks.length === 0) {
        return (
            <div className="feedback-section">
                <h3 className="feedback-section-title">Community Feedback</h3>
                <p className="feedback-empty-text">No public feedback yet.</p>
            </div>
        );
    }

    // Render stars for a given rating
    const renderStars = (rating) => {
        return (
            <span className="feedback-display-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? 'star-filled' : 'star-empty'}>
                        ★
                    </span>
                ))}
            </span>
        );
    };

    // Format date display
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="feedback-section">
            <h3 className="feedback-section-title">
                Community Feedback
                <span className="feedback-count">{feedbacks.length}</span>
            </h3>
            <div className="feedback-cards">
                {feedbacks.map((fb) => (
                    <div className="feedback-card" key={fb._id}>
                        <div className="feedback-card-header">
                            {renderStars(fb.rating)}
                            <span className="feedback-date">{formatDate(fb.createdAt)}</span>
                        </div>
                        {fb.message && (
                            <p className="feedback-card-message">"{fb.message}"</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonorFeedbackSection;
