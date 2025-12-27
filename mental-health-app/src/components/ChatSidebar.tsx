"use client";

import { motion } from "framer-motion";
import {
    MessageSquarePlus,
    Trash2,
    Menu,
    X,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
    id: string;
    title: string;
    timestamp: Date;
    preview: string;
}

interface ChatSidebarProps {
    conversations: Conversation[];
    currentId: string | null;
    onSelect: (id: string) => void;
    onNew: () => void;
    onDelete: (id: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export function ChatSidebar({
    conversations,
    currentId,
    onSelect,
    onNew,
    onDelete,
    isOpen,
    onToggle
}: ChatSidebarProps) {
    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={onToggle}
                className="md:hidden fixed top-20 left-4 z-40 p-2 rounded-full glass hover:bg-primary/10 transition-colors"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isOpen ? 0 : -300,
                    opacity: isOpen ? 1 : 0
                }}
                className={cn(
                    "fixed md:relative top-16 md:top-0 left-0 h-[calc(100vh-64px)] w-72 z-30",
                    "glass border-r flex flex-col",
                    "md:transform-none md:opacity-100"
                )}
            >
                {/* New Chat Button */}
                <div className="p-4">
                    <button
                        onClick={onNew}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity glow"
                    >
                        <MessageSquarePlus className="h-5 w-5" />
                        New Conversation
                    </button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto px-3 pb-4">
                    {conversations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No conversations yet</p>
                            <p className="text-xs mt-1">Start a new chat!</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => onSelect(conv.id)}
                                    className={cn(
                                        "group relative p-3 rounded-xl cursor-pointer transition-all",
                                        currentId === conv.id
                                            ? "bg-primary/10 border border-primary/20"
                                            : "hover:bg-accent"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm truncate">
                                                {conv.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                {conv.preview}
                                            </p>
                                            <p className="text-xs text-muted-foreground/60 mt-1">
                                                {formatDate(conv.timestamp)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(conv.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/20 z-20 top-16"
                    onClick={onToggle}
                />
            )}
        </>
    );
}
