"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { knowledgeBase, KnowledgeContent, CATEGORIES } from "@/lib/knowledge-base";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Eye,
    FileText,
    User,
    Calendar,
    Loader2,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApprovalsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [pending, setPending] = useState<KnowledgeContent[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [rejectFeedback, setRejectFeedback] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "admin")) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        setPending(knowledgeBase.getPending());
    }, []);

    const handleApprove = async (id: string) => {
        if (!user) return;
        setProcessing(true);

        await new Promise(resolve => setTimeout(resolve, 500));
        knowledgeBase.approve(id, user.id);
        setPending(knowledgeBase.getPending());

        setProcessing(false);
    };

    const handleReject = async () => {
        if (!user || !selectedId) return;
        setProcessing(true);

        await new Promise(resolve => setTimeout(resolve, 500));
        knowledgeBase.reject(selectedId, user.id, rejectFeedback);
        setPending(knowledgeBase.getPending());

        setShowRejectModal(false);
        setRejectFeedback("");
        setSelectedId(null);
        setProcessing(false);
    };

    const openRejectModal = (id: string) => {
        setSelectedId(id);
        setShowRejectModal(true);
    };

    if (isLoading || !user || user.role !== "admin") {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const selectedContent = pending.find(c => c.id === selectedId);

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
                    <h1 className="text-3xl font-bold">Content Approvals</h1>
                    <p className="text-muted-foreground mt-1">
                        Review and approve submitted content ({pending.length} pending)
                    </p>
                </motion.div>

                {/* Content List */}
                {pending.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-2xl p-12 text-center"
                    >
                        <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
                        <p className="text-muted-foreground">
                            No pending content to review at the moment.
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {pending.map((content, index) => (
                                <motion.div
                                    key={content.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass rounded-2xl overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                                            {/* Content Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">
                                                        {CATEGORIES.find(c => c.id === content.category)?.icon || "📄"}
                                                    </span>
                                                    <h3 className="font-semibold text-lg truncate">{content.title}</h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {content.summary}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {content.author.name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(content.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FileText className="h-3 w-3" />
                                                        {content.type}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                                                        {content.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-full"
                                                    onClick={() => setSelectedId(selectedId === content.id ? null : content.id)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Preview
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-full text-destructive hover:bg-destructive/10"
                                                    onClick={() => openRejectModal(content.id)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="rounded-full bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleApprove(content.id)}
                                                    disabled={processing}
                                                >
                                                    {processing ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Preview Panel */}
                                        <AnimatePresence>
                                            {selectedId === content.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="mt-4 pt-4 border-t border-border overflow-hidden"
                                                >
                                                    <div className="prose prose-sm max-w-none dark:prose-invert">
                                                        <div className="bg-muted/50 rounded-xl p-4 max-h-[300px] overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                                                            {content.content}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Reject Modal */}
                <AnimatePresence>
                    {showRejectModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowRejectModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="glass rounded-2xl p-6 max-w-md w-full"
                                onClick={e => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-destructive" />
                                    Reject Content
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Provide feedback for the contributor about why this content was rejected.
                                </p>
                                <textarea
                                    value={rejectFeedback}
                                    onChange={(e) => setRejectFeedback(e.target.value)}
                                    placeholder="Enter feedback (optional)..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowRejectModal(false)}
                                        className="rounded-full"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        disabled={processing}
                                        className="rounded-full bg-destructive hover:bg-destructive/90"
                                    >
                                        {processing ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "Reject"
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
