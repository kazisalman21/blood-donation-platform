import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RequestCard.css';

/**
 * Hand-written relative time formatter — no external library (course requirement)
 * Converts a date string to "X minutes/hours/days ago" format.
 */
const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
};

/**
 * RequestCard — Reusable card component for displaying blood requests.
 * Displays blood type badge, urgency indicator, hospital info, and status.
 * Used in MyRequestsPage and other listing views.
 *
 * @param {object} request - The blood request object
 */
const RequestCard = ({ request }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/requests/${request._id}`);
    };

    return (
        <div
            className={`request-card urgency-${request.urgency}`}
            onClick={handleClick}
            id={`request-card-${request._id}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
            {/* Top row: Blood type + info + badges */}
            <div className="request-card-top">
                <div className="request-card-left">
                    <div className="blood-badge">{request.bloodType}</div>
                    <div className="request-info">
                        <h3>{request.hospital}</h3>
                        <p>{request.patientName || 'Patient'} • {request.unitsNeeded} unit{request.unitsNeeded > 1 ? 's' : ''} needed</p>
                    </div>
                </div>
                <div className="request-badges">
                    <span className={`badge badge-urgency-${request.urgency}`}>
                        <span className="badge-dot"></span>
                        {request.urgency}
                    </span>
                    <span className={`badge badge-status status-${request.status?.replace(/\s/g, '-')}`}>
                        {request.status}
                    </span>
                </div>
            </div>

            {/* Detail row */}
            <div className="request-card-details">
                <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    {request.location}
                </div>
                <div className="detail-item">
                    <span className="detail-icon">🩸</span>
                    {request.bloodType} needed
                </div>
                <div className="detail-item">
                    <span className="detail-icon">📦</span>
                    {request.unitsNeeded} unit{request.unitsNeeded > 1 ? 's' : ''}
                </div>
            </div>

            {/* Footer */}
            <div className="request-card-footer">
                <span className="time-ago">{getTimeAgo(request.createdAt)}</span>
                <span className={`donors-matched ${request.compatibleDonorsCount === 0 ? 'no-donors' : ''}`}>
                    {request.compatibleDonorsCount > 0
                        ? `✅ ${request.compatibleDonorsCount} donor${request.compatibleDonorsCount > 1 ? 's' : ''} matched`
                        : '⏳ Awaiting donors'}
                </span>
            </div>
        </div>
    );
};

export default RequestCard;
