"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch(`${API_URL}/auth/me`, {
                        headers: { 'x-auth-token': token }
                    });

                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true };
        } else {
            return { success: false, msg: data.msg };
        }
    };

    const register = async (username, email, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true };
        } else {
            return { success: false, msg: data.msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (username, password) => {
        const token = localStorage.getItem('token');
        if (!token) return { success: false, msg: "Not authenticated" };

        const body = {};
        if (username) body.username = username;
        if (password) body.password = password;

        try {
            const res = await fetch(`${API_URL}/auth/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                // Refresh user data usually, simplistic update here
                if (username) setUser(prev => ({ ...prev, username }));
                return { success: true };
            } else {
                const data = await res.json();
                return { success: false, msg: data.msg || 'Update failed' };
            }
        } catch (err) {
            return { success: false, msg: 'Server error' };
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {/* Removed !loading check to allow SSR to render content immediately */}
            {children}
        </AuthContext.Provider>
    );
};
