import React, { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser } from "../api/auth";
import { getMe } from "../api/users";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const isAdmin = isAuthenticated && user?.roleName === "admin";
    useRealtimeNotifications(isAdmin);

    useEffect(() => {
        if (loading) return;

        if (!isAdmin) {
            if (socket.connected) socket.disconnect();
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) return;

        socket.auth = { token };
        socket.connect();

        return () => socket.disconnect();
    }, [isAdmin, loading]);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const userData = await getMe();

                    if (!userData.isEnabled) {
                        localStorage.removeItem("authToken");
                        setUser(null);
                        setIsAuthenticated(false);
                        setLoading(false);
                        return;
                    }

                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem("authToken");
                    setUser(null);
                    setIsAuthenticated(false);
                    console.error("Token validation failed:", error);
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

            if (!user.isEnabled) {
                return {
                    success: false,
                    error: "Your account has been deactivated. Please contact an administrator if you want to reactivate it."
                };
            }

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

    const logout = async () => {
        try {
            const response = await logoutUser();
            toast.success(response.message || "Logged out successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Backend logout failed";
            toast.error(errorMessage);
        } finally {
            localStorage.removeItem("authToken");
            queryClient.clear();
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);