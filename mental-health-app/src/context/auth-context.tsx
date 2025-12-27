"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "user" | "contributor" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    loginAsRole: (role: UserRole) => void;
    logout: () => void;
    register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for quick testing
const DEMO_USERS: Record<UserRole, User> = {
    user: {
        id: "user-1",
        name: "John Doe",
        email: "user@demo.com",
        role: "user",
    },
    contributor: {
        id: "contributor-1",
        name: "Dr. Sarah Smith",
        email: "contributor@demo.com",
        role: "contributor",
    },
    admin: {
        id: "admin-1",
        name: "Admin User",
        email: "admin@demo.com",
        role: "admin",
    },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem("mindhaven_user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("mindhaven_user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Keep demo users for easy testing
        const demoUser = Object.values(DEMO_USERS).find(u => u.email === email);
        if (demoUser && password === "demo123") {
            setUser(demoUser);
            localStorage.setItem("mindhaven_user", JSON.stringify(demoUser));
            return true;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                localStorage.setItem("mindhaven_user", JSON.stringify(data.user));
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error);
        }

        return false;
    };

    const loginAsRole = (role: UserRole) => {
        const demoUser = DEMO_USERS[role];
        setUser(demoUser);
        localStorage.setItem("mindhaven_user", JSON.stringify(demoUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("mindhaven_user");
    };

    const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                localStorage.setItem("mindhaven_user", JSON.stringify(data.user));
                return true;
            }
        } catch (error) {
            console.error("Registration failed:", error);
        }

        return false;
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, loginAsRole, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
