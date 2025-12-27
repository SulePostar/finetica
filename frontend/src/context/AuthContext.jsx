import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser } from "../api/auth";
import { getMe } from "../api/users";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem("authToken");
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        validateToken();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            const token = data.data.token;
            const user = data.data.user;

            localStorage.setItem("authToken", token);
            setUser(user);
            setIsAuthenticated(true);
            return { success: true };

        } catch (error) {
            console.error("Login failed:", error);

            let message = "Login failed";
            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    message = "Bad credentials";
                } else if (status === 403) {
                    message = "User is pending approval";
                } else {
                    message = data?.message || "Login failed";
                }
            } else {
                message = "Network error or server unreachable";
            }

            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
