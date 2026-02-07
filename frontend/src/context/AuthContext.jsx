import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await API.get('/auth/me/');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await API.post('/auth/login/', { username, password });
        localStorage.setItem('token', response.data.access);
        fetchUser();
        return response.data;
    };

    const register = async (userData) => {
        const response = await API.post('/auth/register/', userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            refreshUser: fetchUser,
            isAdmin: user?.is_staff || user?.is_superuser,
            isSuperuser: user?.is_superuser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
