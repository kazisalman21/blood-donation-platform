import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    // Bug Fix BUG-NEW-M2: auto-logout on 401 (expired/invalid token)
    // Prevents cryptic "Server error" messages when JWT expires after 30 days
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401 && token) {
                    // Token expired or invalid — force logout
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [token]);

    const login = (userData, tokenValue) => {
        setUser(userData);
        setToken(tokenValue);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenValue);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Bug Fix BUG-NEW-H1: allow components to refresh stale user data
    // after profile edits, donation completions, badge awards, etc.
    const updateUser = (updatedFields) => {
        setUser(prev => {
            const merged = { ...prev, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(merged));
            return merged;
        });
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
