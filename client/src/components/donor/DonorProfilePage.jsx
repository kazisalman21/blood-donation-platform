import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import AvailabilityToggle from './AvailabilityToggle';
import EligibilityReminderCard from '../community/EligibilityReminderCard';
import HealthTipsSection from '../community/HealthTipsSection';
import DonorFeedbackSection from '../community/DonorFeedbackSection';
import './DonorProfile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DonorProfilePage = () => {
    const { user, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/donors/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
            } catch (err) {
                console.error('Failed to load profile:', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchProfile();
    }, [user, token]);

    if (loading) return <div className="loading-screen">Loading profile...</div>;
    if (!profile) return <div className="error-screen">Failed to load profile</div>;

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profile.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">
                            {profile.name}
                            {profile.isVerified && <span className="verified-badge" title="Verified Donor">✓</span>}
                        </h1>
                        <p className="profile-email">{profile.email}</p>
                    </div>
                    <div className="blood-type-big">{profile.bloodType}</div>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-value">{profile.donationCount}</span>
                        <span className="stat-label">Donations</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{profile.donationCount}</span>
                        <span className="stat-label">Lives Helped</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">
                            {profile.nextEligibleDate
                                ? new Date(profile.nextEligibleDate).toLocaleDateString()
                                : 'Eligible Now'}
                        </span>
                        <span className="stat-label">Next Eligible</span>
                    </div>
                </div>

                <div className="availability-section">
                    <h3>Availability Status</h3>
                    <div className={`availability-indicator ${profile.isAvailable ? 'available' : 'unavailable'}`}>
                        {profile.isAvailable ? '🟢 Available to Donate' : '🔴 Not Available'}
                    </div>
                    <AvailabilityToggle
                        donorId={user._id}
                        token={token}
                        isAvailable={profile.isAvailable}
                        nextEligibleDate={profile.nextEligibleDate}
                        onUpdate={(newAvail, newDate) => {
                            setProfile(prev => ({
                                ...prev,
                                isAvailable: newAvail,
                                nextEligibleDate: newDate
                            }));
                        }}
                    />
                </div>

                {profile.badges && profile.badges.length > 0 && (
                    <div className="badges-section">
                        <h3>Badges</h3>
                        <div className="badges-grid">
                            {profile.badges.map((badge, i) => (
                                <span key={i} className="badge">{badge}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Anika — F14: Eligibility Reminder & Health Tips */}
                <EligibilityReminderCard
                    nextEligibleDate={profile.nextEligibleDate}
                    lastDonationDate={profile.lastDonationDate}
                />
                <HealthTipsSection />

                <div className="profile-details">
                    <h3>Details</h3>
                    <div className="detail-row">
                        <span>City:</span> <span>{profile.city || 'Not set'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Area:</span> <span>{profile.area || 'Not set'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Phone:</span> <span>{profile.phone || 'Not set'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Verification:</span>
                        <span className={`status-${profile.verificationStatus}`}>
                            {profile.verificationStatus?.charAt(0).toUpperCase() + profile.verificationStatus?.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Anika — F15: Public Feedback from Requesters */}
                <DonorFeedbackSection donorId={profile._id} />
            </div>
        </div>
    );
};

export default DonorProfilePage;
