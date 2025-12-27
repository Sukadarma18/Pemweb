"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { knowledgeBase, KnowledgeContent, CATEGORIES } from "@/lib/knowledge-base";
import { motion } from "framer-motion";
import {
    FileEdit,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    TrendingUp,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContributorDashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [submissions, setSubmissions] = useState<KnowledgeContent[]>([]);

    useEffect(() => {
        if (!isLoading && (!user || (user.role !== "contributor" && user.role !== "admin"))) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user) {
            const userSubmissions = knowledgeBase.getByAuthor(user.id);
            setSubmissions(userSubmissions);
        }
    }, [user]);

    if (isLoading || !user) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const stats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === "pending").length,
        approved: submissions.filter(s => s.status === "approved").length,
        rejected: submissions.filter(s => s.status === "rejected").length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600">
                        <Clock className="h-3 w-3" /> Pending
                    </span>
                );
            case "approved":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                        <CheckCircle2 className="h-3 w-3" /> Approved
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600">
                        <XCircle className="h-3 w-3" /> Rejected
                    </span>
                );
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-gradient-primary">
                                    <FileEdit className="h-6 w-6 text-white" />
                                </div>
                                Contributor Dashboard
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Manage and submit your content contributions
                            </p>
                        </div>
                        <Link href="/contributor/submit">
                            <Button className="rounded-full px-6 glow">
                                <Plus className="h-4 w-4 mr-2" />
                                New Submission
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: "Total", value: stats.total, icon: FileText, color: "from-blue-500 to-cyan-500" },
                        { label: "Pending", value: stats.pending, icon: Clock, color: "from-yellow-500 to-orange-500" },
                        { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
                        { label: "Rejected", value: stats.rejected, icon: XCircle, color: "from-red-500 to-rose-500" },
                    ].map((stat, index) => (
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

                {/* Submissions List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl overflow-hidden"
                >
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Your Submissions
                        </h2>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="font-medium mb-1">No submissions yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start contributing knowledge to help others!
                            </p>
                            <Link href="/contributor/submit">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create First Submission
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {submissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="p-4 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">
                                                    {CATEGORIES.find(c => c.id === submission.category)?.icon || "📄"}
                                                </span>
                                                <h3 className="font-medium truncate">{submission.title}</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {submission.summary}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                <span className="capitalize">{submission.type}</span>
                                                <span>•</span>
                                                <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {submission.feedback && submission.status === "rejected" && (
                                                <p className="mt-2 text-sm text-destructive bg-destructive/10 p-2 rounded-lg">
                                                    Feedback: {submission.feedback}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(submission.status)}
                                            {submission.status === "approved" && (
                                                <Link href={`/knowledge/${submission.id}`}>
                                                    <Button variant="ghost" size="icon" className="rounded-full">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
