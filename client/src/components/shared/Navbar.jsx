import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../donor/NotificationBell';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const [requestsDropdownOpen, setRequestsDropdownOpen] = useState(false);
    const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
    const adminDropdownRef = useRef(null);
    const requestsDropdownRef = useRef(null);
    const communityDropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close all menus on route change
    useEffect(() => {
        setMobileOpen(false);
        setAdminDropdownOpen(false);
        setRequestsDropdownOpen(false);
        setCommunityDropdownOpen(false);
    }, [location]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (adminDropdownRef.current && !adminDropdownRef.current.contains(e.target)) {
                setAdminDropdownOpen(false);
            }
            if (requestsDropdownRef.current && !requestsDropdownRef.current.contains(e.target)) {
                setRequestsDropdownOpen(false);
            }
            if (communityDropdownRef.current && !communityDropdownRef.current.contains(e.target)) {
                setCommunityDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => location.pathname === path;
    const isAdminPath = location.pathname.startsWith('/admin');
    const isRequestsPath = ['/requests/my', '/request/new', '/status-tracker'].includes(location.pathname);
    const isCommunityPath = ['/donor-map', '/history/donations', '/history/requests', '/leaderboard', '/faq'].includes(location.pathname);

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
                            {/* Requests Dropdown */}
                            <div className="nav-dropdown" ref={requestsDropdownRef}>
                                <button
                                    className={`nav-dropdown-trigger ${isRequestsPath ? 'active' : ''}`}
                                    onClick={() => {
                                        setRequestsDropdownOpen(!requestsDropdownOpen);
                                        setCommunityDropdownOpen(false);
                                        setAdminDropdownOpen(false);
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6" /></svg>
                                    Requests
                                    <svg className={`dropdown-arrow ${requestsDropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
                                </button>
                                {requestsDropdownOpen && (
                                    <div className="nav-dropdown-menu">
                                        <Link to="/request/new" className={`nav-dropdown-item ${isActive('/request/new') ? 'active' : ''}`}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                            Post Request
                                        </Link>
                                        <Link to="/requests/my" className={`nav-dropdown-item ${isActive('/requests/my') ? 'active' : ''}`}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6m-3 7h.01M9 16h6" /></svg>
                                            My Requests
                                        </Link>
                                        <Link to="/status-tracker" className={`nav-dropdown-item ${isActive('/status-tracker') ? 'active' : ''}`}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                            Status Tracker
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Community Dropdown */}
                            <div className="nav-dropdown" ref={communityDropdownRef}>
                                <button
                                    className={`nav-dropdown-trigger ${isCommunityPath ? 'active' : ''}`}
                                    onClick={() => {
                                        setCommunityDropdownOpen(!communityDropdownOpen);
                                        setRequestsDropdownOpen(false);
                                        setAdminDropdownOpen(false);
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    Community
                                    <svg className={`dropdown-arrow ${communityDropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
                                </button>
                                {communityDropdownOpen && (
                                    <div className="nav-dropdown-menu">
                                        <Link to="/donor-map" className={`nav-dropdown-item ${isActive('/donor-map') ? 'active' : ''}`}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                            Donor Map
                                        </Link>
                                        <Link to="/history/donations" className={`nav-dropdown-item ${isActive('/history/donations') ? 'active' : ''}`}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                            Donation History
                                        </Link>
                                        <Link to="/leaderboard" className={`nav-dropdown-item ${isActive('/leaderboard') ? 'active' : ''}`}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8m-4-4v4M6 3h12l-1.5 6h-9L6 3Zm1.5 6 1 4h7l1-4" /></svg>
                                            Leaderboard
                                        </Link>
                                        <Link to="/faq" className={`nav-dropdown-item ${isActive('/faq') ? 'active' : ''}`}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
                                            FAQ
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Notification Bell — F3 */}
                            <NotificationBell />

                            {/* Admin Dropdown — grouped */}
                            {user?.role === 'admin' && (
                                <>
                                    <div className="nav-divider" />
                                    <div className="admin-dropdown" ref={adminDropdownRef}>
                                        <button
                                            className={`admin-dropdown-trigger ${isAdminPath ? 'active' : ''}`}
                                            onClick={() => {
                                                setAdminDropdownOpen(!adminDropdownOpen);
                                                setRequestsDropdownOpen(false);
                                                setCommunityDropdownOpen(false);
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                                            Admin
                                            <svg className={`dropdown-arrow ${adminDropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
                                        </button>
                                        {adminDropdownOpen && (
                                            <div className="admin-dropdown-menu">
                                                <Link to="/admin/users" className={`admin-dropdown-item ${isActive('/admin/users') ? 'active' : ''}`}>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                                    Users
                                                </Link>
                                                <Link to="/admin/content" className={`admin-dropdown-item ${isActive('/admin/content') ? 'active' : ''}`}>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                                    Content
                                                </Link>
                                                <Link to="/admin/inventory" className={`admin-dropdown-item ${isActive('/admin/inventory') ? 'active' : ''}`}>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                    Inventory
                                                </Link>
                                                <Link to="/admin/analytics" className={`admin-dropdown-item ${isActive('/admin/analytics') ? 'active' : ''}`}>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                                                    Analytics
                                                </Link>
                                                <Link to="/admin/broadcast" className={`admin-dropdown-item ${isActive('/admin/broadcast') ? 'active' : ''}`}>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                                    Broadcast
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="nav-divider" />
                            <div className="nav-user">
                                <Link to="/profile" className="nav-user-profile-link">
                                    <div className="user-avatar">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span className="user-name">{user?.name}</span>
                                </Link>
                                <span className="blood-badge">{user?.bloodType}</span>
                                <button onClick={logout} className="btn-logout">Logout</button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
                            <Link to="/register" className="btn-register">
                                Get Started
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
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
