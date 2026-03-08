import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-accent-line" />
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span>🩸</span>
                            <span className="footer-logo-text">Blood<span className="footer-logo-accent">Connect</span></span>
                        </div>
                        <p className="footer-tagline">
                            Saving lives by connecting blood donors with patients in emergency situations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <Link to="/register">Become a Donor</Link>
                        <Link to="/request/new">Request Blood</Link>
                        <Link to="/login">Login</Link>
                    </div>

                    {/* Features */}
                    <div className="footer-col">
                        <h4>Features</h4>
                        <Link to="/history/donations">Donation History</Link>
                        <Link to="/history/requests">Request History</Link>
                        <Link to="/profile">Donor Profile</Link>
                    </div>

                    {/* Project */}
                    <div className="footer-col">
                        <h4>Project</h4>
                        <a href="https://github.com/kazisalman21/blood-donation-platform" target="_blank" rel="noreferrer">GitHub Repository</a>
                        <a href="https://docs.google.com/document/d/1tLieUNqrSS-HghBV5eOAdE_CtdKRPXOHXDnVw7Eo8YA/edit?usp=sharing" target="_blank" rel="noreferrer">SRS Document</a>
                        <span className="footer-link-muted">CSE470 — Spring 2026</span>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="footer-bottom">
                    <p>© 2026 BloodConnect — CSE470 Group 6</p>
                    <p className="footer-team">Built by Salman · Anika · Athoy</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
