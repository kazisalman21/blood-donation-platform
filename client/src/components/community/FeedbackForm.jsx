/**
 * FeedbackForm — View layer for Feature 15 (Donor-Requester Feedback)
 * Owner: Miskatul Afrin Anika
 * Controller: communityController.submitFeedback()
 * Model: Feedback.js
 *
 * SRS Requirements:
 * FR-15.1: Only allow feedback when request status is 'Completed'
 * FR-15.2: Star rating (1–5) built with clickable icons and React state — no library
 * FR-15.3: Limit feedback messages to 300 characters
 * FR-15.4: Include a "Make Public" checkbox requiring donor consent
 */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Feedback.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const MAX_MESSAGE_LENGTH = 300;

const FeedbackForm = ({ requestId, donorId, onSubmitted, onCancel }) => {
    const { token } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [message, setMessage] = useState('');
    const [allowPublic, setAllowPublic] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await axios.post(`${API_URL}/community/feedback`, {
                donorId,
                requestId,
                rating,
                message: message.trim(),
                allowPublic
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSubmitted(true);
            if (onSubmitted) onSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="feedback-success">
                <span className="feedback-success-icon">✓</span>
                <p>Thank you for your feedback!</p>
            </div>
        );
    }

    return (
        <form className="feedback-form" onSubmit={handleSubmit}>
            <h3 className="feedback-form-title">Rate Your Experience</h3>

            {/* Star Rating — hand-written, no library (FR-15.2) */}
            <div className="feedback-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        type="button"
                        key={star}
                        className={`feedback-star ${star <= (hoveredStar || rating) ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowRight' && star < 5) {
                                setRating(star + 1);
                                e.target.nextSibling?.focus();
                            } else if (e.key === 'ArrowLeft' && star > 1) {
                                setRating(star - 1);
                                e.target.previousSibling?.focus();
                            }
                        }}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                        ★
                    </button>
                ))}
                <span className="feedback-rating-text">
                    {rating > 0 && ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
            </div>

            {/* Message — 300 char limit (FR-15.3) */}
            <div className="feedback-field">
                <textarea
                    className="feedback-textarea"
                    placeholder="Share your experience... (optional)"
                    value={message}
                    onChange={(e) => {
                        if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                            setMessage(e.target.value);
                        }
                    }}
                    rows={3}
                />
                <span className="feedback-char-count">
                    {message.length}/{MAX_MESSAGE_LENGTH}
                </span>
            </div>

            {/* Make Public checkbox (FR-15.4) */}
            <label className="feedback-checkbox-label">
                <input
                    type="checkbox"
                    checked={allowPublic}
                    onChange={(e) => setAllowPublic(e.target.checked)}
                    className="feedback-checkbox"
                />
                <span>Make this feedback public on the donor's profile</span>
            </label>

            {error && <p className="feedback-error">{error}</p>}

            <button
                type="submit"
                className="feedback-submit-btn"
                disabled={submitting || rating === 0}
            >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            {onCancel && (
                <button type="button" className="feedback-cancel-btn" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default FeedbackForm;
