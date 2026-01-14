import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user'); // Storing basic user info
        if (token) {
            // Ideally we would validate token with an API call like /me if available
            // For now, assume validity or let next API call 401
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user from storage", e);
                }
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { login: email, password });

            if (response.success) {
                const { token, auth_me_fullname, auth_me_username, auth_me_id } = response;
                localStorage.setItem('token', token);

                const userData = {
                    id: auth_me_id,
                    name: auth_me_fullname,
                    username: auth_me_username
                };

                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return true;
            } else {
                throw new Error(response.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Best effort logout
            await api.get('/logout');
        } catch (e) {
            console.warn("Logout API call failed", e);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            // Could use navigate here if we had access to router, 
            // but AuthProvider is often inside Router or we rely on state change to redirect
        }
    };

    const isAuthenticated = !!user || !!localStorage.getItem('token');

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
