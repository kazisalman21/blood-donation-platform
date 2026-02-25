import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Every Drop <span className="highlight">Saves</span> a Life
                    </h1>
                    <p className="hero-subtitle">
                        Connect with blood donors in your area during emergencies.
                        Fast, secure, and life-saving.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary">Become a Donor</Link>
                        <Link to="/request/new" className="btn btn-secondary">Request Blood</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">8</span>
                            <span className="stat-label">Blood Types Supported</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Emergency Matching</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">Privacy Protected</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2 className="section-title">How It Works</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Register</h3>
                        <p>Sign up with your blood type and location to join the donor network.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚨</div>
                        <h3>Request</h3>
                        <p>Post an emergency blood request with hospital details and urgency level.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Match</h3>
                        <p>Our algorithm finds compatible donors near the patient instantly.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤝</div>
                        <h3>Connect</h3>
                        <p>Both parties consent before contact info is shared — privacy first.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
