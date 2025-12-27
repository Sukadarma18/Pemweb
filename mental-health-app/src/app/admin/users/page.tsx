"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, User as AuthUser } from "@/context/auth-context";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    User,
    Shield,
    FileEdit,
    Mail,
    Search
} from "lucide-react";

// Demo users for display
const DEMO_USERS = [
    { id: "user-1", name: "John Doe", email: "user@demo.com", role: "user" },
    { id: "contributor-1", name: "Dr. Sarah Smith", email: "contributor@demo.com", role: "contributor" },
    { id: "admin-1", name: "Admin User", email: "admin@demo.com", role: "admin" },
];

export default function UsersPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState(DEMO_USERS);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "admin")) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        // Load registered users from localStorage
        const registered = JSON.parse(localStorage.getItem("mindhaven_registered_users") || "[]");
        setUsers([...DEMO_USERS, ...registered.map((u: AuthUser & { password?: string }) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
        }))]);
    }, []);

    if (isLoading || !user || user.role !== "admin") {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "admin":
                return <Shield className="h-4 w-4" />;
            case "contributor":
                return <FileEdit className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "from-purple-500 to-indigo-600";
            case "contributor":
                return "from-blue-500 to-cyan-500";
            default:
                return "from-gray-500 to-slate-500";
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-muted/30 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all registered users
                    </p>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </motion.div>

                {/* Users Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filteredUsers.map((u, index) => (
                        <motion.div
                            key={u.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="glass rounded-2xl p-4 hover-lift"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRoleColor(u.role)} flex items-center justify-center text-white shrink-0`}>
                                    {getRoleIcon(u.role)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">{u.name}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                                        <Mail className="h-3 w-3" />
                                        {u.email}
                                    </p>
                                    <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${u.role === "admin"
                                            ? "bg-purple-500/10 text-purple-600"
                                            : u.role === "contributor"
                                                ? "bg-blue-500/10 text-blue-600"
                                                : "bg-gray-500/10 text-gray-600"
                                        }`}>
                                        {getRoleIcon(u.role)}
                                        {u.role}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No users found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
