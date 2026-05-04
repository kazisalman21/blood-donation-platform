import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../donor/NotificationBell';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.png" alt="BloodConnect Logo" className="navbar-logo-img" />
                    <span className="logo-text">Blood<span className="logo-accent">Connect</span></span>
                </Link>

                {/* Desktop Nav */}
                <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                Profile
                            </Link>
                            <Link to="/request/new" className={`nav-link ${isActive('/request/new') ? 'active' : ''}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                Post Request
                            </Link>
                            <Link to="/requests/my" className={`nav-link ${isActive('/requests/my') ? 'active' : ''}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6m-3 7h.01M9 16h6" /></svg>
                                My Requests
                            </Link>
                            <Link to="/donor-map" className={`nav-link ${isActive('/donor-map') ? 'active' : ''}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                Donor Map
                            </Link>
                            <Link to="/status-tracker" className={`nav-link ${isActive('/status-tracker') ? 'active' : ''}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                Tracker
                            </Link>
                            <Link to="/history/donations" className={`nav-link ${isActive('/history/donations') ? 'active' : ''}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                History
                            </Link>
                            <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8m-4-4v4M6 3h12l-1.5 6h-9L6 3Zm1.5 6 1 4h7l1-4" /></svg>
                                Leaderboard
                            </Link>
                            <Link to="/faq" className={`nav-link ${isActive('/faq') ? 'active' : ''}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
                                FAQ
                            </Link>
                            {/* Notification Bell — F3 */}
                            <NotificationBell />
                            <div className="nav-divider" />

                            {/* Admin-only links */}
                            {user?.role === 'admin' && (
                                <>
                                    <Link to="/admin/users" className={`nav-link nav-admin ${isActive('/admin/users') ? 'active' : ''}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                        Users
                                    </Link>
                                    <Link to="/admin/content" className={`nav-link nav-admin ${isActive('/admin/content') ? 'active' : ''}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                        Content
                                    </Link>
                                    <Link to="/admin/inventory" className={`nav-link nav-admin ${isActive('/admin/inventory') ? 'active' : ''}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        Inventory
                                    </Link>
                                    <Link to="/admin/analytics" className={`nav-link nav-admin ${isActive('/admin/analytics') ? 'active' : ''}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                                        Analytics
                                    </Link>
                                    <Link to="/admin/broadcast" className={`nav-link nav-admin ${isActive('/admin/broadcast') ? 'active' : ''}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                        Broadcast
                                    </Link>
                                </>
                            )}

                            <div className="nav-user">
                                <div className="user-avatar">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <span className="user-name">{user?.name}</span>
                                <span className="blood-badge">{user?.bloodType}</span>
                                <button onClick={logout} className="btn-logout">Logout</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
                            <Link to="/register" className="btn-register">
                                Get Started
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className={`hamburger ${mobileOpen ? 'open' : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
        </nav>
    );
};

export default Navbar;
