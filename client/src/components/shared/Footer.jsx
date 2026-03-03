import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span>🩸</span>
                            <span className="footer-logo-text">Blood<span style={{ color: 'var(--accent-light)' }}>Connect</span></span>
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

            <style>{`
                .site-footer {
                    background: rgba(10, 10, 18, 0.95);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 3.5rem 2rem 0;
                    margin-top: auto;
                }
                .footer-container {
                    max-width: var(--container-max);
                    margin: 0 auto;
                }
                .footer-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr 1fr 1fr;
                    gap: 2.5rem;
                    padding-bottom: 2.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.3rem;
                    font-weight: 800;
                    margin-bottom: 0.8rem;
                }
                .footer-logo-text {
                    color: #fff;
                    letter-spacing: -0.5px;
                }
                .footer-tagline {
                    color: var(--text-muted);
                    font-size: 0.88rem;
                    line-height: 1.6;
                    max-width: 280px;
                }
                .footer-col {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }
                .footer-col h4 {
                    color: #fff;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 0.3rem;
                }
                .footer-col a, .footer-link-muted {
                    color: var(--text-muted);
                    font-size: 0.88rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-col a:hover {
                    color: var(--accent-light);
                }
                .footer-link-muted {
                    opacity: 0.6;
                }
                .footer-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.2rem 0;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }
                .footer-team {
                    opacity: 0.6;
                }
                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                    }
                }
                @media (max-width: 480px) {
                    .site-footer { padding: 2.5rem 1.2rem 0; }
                    .footer-grid { grid-template-columns: 1fr; gap: 1.5rem; }
                    .footer-bottom { flex-direction: column; gap: 0.3rem; text-align: center; }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
