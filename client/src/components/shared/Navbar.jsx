import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🩸</span>
                    <span className="logo-text">BloodConnect</span>
                </Link>

                <div className="navbar-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="nav-link">Profile</Link>
                            <Link to="/request/new" className="nav-link">Post Request</Link>
                            <Link to="/history/donations" className="nav-link">History</Link>
                            <div className="nav-user">
                                <span className="user-name">{user?.name}</span>
                                <span className="blood-badge">{user?.bloodType}</span>
                                <button onClick={logout} className="btn-logout">Logout</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link btn-register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
