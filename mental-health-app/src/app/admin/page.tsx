"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { knowledgeBase, KnowledgeContent } from "@/lib/knowledge-base";
import { motion } from "framer-motion";
import {
    Shield,
    FileText,
    Users,
    Clock,
    CheckCircle2,
    TrendingUp,
    ArrowRight,
    Library
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "admin")) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const all = knowledgeBase.getAll();
        setStats({
            total: all.length,
            pending: all.filter(c => c.status === "pending").length,
            approved: all.filter(c => c.status === "approved").length,
            rejected: all.filter(c => c.status === "rejected").length,
        });
    }, []);

    if (isLoading || !user || user.role !== "admin") {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const quickActions = [
        {
            title: "Import Jurnal PDF",
            description: "Import 44 jurnal mental health",
            icon: Library,
            href: "/admin/import",
            color: "from-emerald-500 to-teal-600",
            urgent: true,
        },
        {
            title: "Review Pending",
            description: `${stats.pending} item menunggu approval`,
            icon: Clock,
            href: "/admin/approvals",
            color: "from-yellow-500 to-orange-500",
            urgent: stats.pending > 0,
        },
        {
            title: "Kelola Pengguna",
            description: "Lihat dan kelola akun pengguna",
            icon: Users,
            href: "/admin/users",
            color: "from-blue-500 to-cyan-500",
        },
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-muted/30 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 glow">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage content, users, and system settings
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: "Total Content", value: stats.total, icon: FileText, color: "from-blue-500 to-cyan-500" },
                        { label: "Pending Review", value: stats.pending, icon: Clock, color: "from-yellow-500 to-orange-500" },
                        { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
                        { label: "Growth", value: "+12%", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="glass rounded-2xl p-4 hover-lift"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-3 gap-4 mb-8"
                >
                    {quickActions.map((action) => (
                        <Link key={action.title} href={action.href}>
                            <div className={`glass rounded-2xl p-6 hover-lift cursor-pointer transition-all ${action.urgent ? "ring-2 ring-yellow-500/50" : ""
                                }`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                                        <action.icon className="h-6 w-6 text-white" />
                                    </div>
                                    {action.urgent && (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600">
                                            Action needed
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold mb-1">{action.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                                <div className="flex items-center text-primary text-sm font-medium">
                                    Go to page <ArrowRight className="h-4 w-4 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-2xl overflow-hidden"
                >
                    <div className="p-4 border-b border-border">
                        <h2 className="font-semibold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            System Overview
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Content Distribution</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Approved</span>
                                            <span>{stats.approved}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full transition-all"
                                                style={{ width: `${stats.total ? (stats.approved / stats.total) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Pending</span>
                                            <span>{stats.pending}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-500 rounded-full transition-all"
                                                style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Rejected</span>
                                            <span>{stats.rejected}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className="h-full bg-red-500 rounded-full transition-all"
                                                style={{ width: `${stats.total ? (stats.rejected / stats.total) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Stats</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-primary/5 text-center">
                                        <p className="text-2xl font-bold text-primary">3</p>
                                        <p className="text-xs text-muted-foreground">Demo Users</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-primary/5 text-center">
                                        <p className="text-2xl font-bold text-primary">7</p>
                                        <p className="text-xs text-muted-foreground">Categories</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
