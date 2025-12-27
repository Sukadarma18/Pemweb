"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatSidebar } from "@/components/ChatSidebar";
import {
    Send,
    User,
    Bot,
    Loader2,
    Sparkles,
    MessageCircle,
    Brain,
    Heart,
    BookOpen,
    FileText
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: Array<{ title: string; type: string }>;
    timestamp: Date;
}

interface Conversation {
    id: string;
    title: string;
    timestamp: Date;
    preview: string;
    messages: Message[];
}

const SUGGESTIONS = [
    { icon: Brain, text: "How can I manage anxiety?", color: "from-blue-500 to-cyan-500" },
    { icon: Heart, text: "Tips for better mental health", color: "from-pink-500 to-rose-500" },
    { icon: BookOpen, text: "Mindfulness techniques", color: "from-purple-500 to-indigo-500" },
    { icon: MessageCircle, text: "I need someone to talk to", color: "from-teal-500 to-green-500" },
];

export default function ChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConvId, setCurrentConvId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { user } = useAuth();

    const currentConversation = conversations.find(c => c.id === currentConvId);
    const messages = currentConversation?.messages || [];

    useEffect(() => {
        // Load conversations from localStorage
        const saved = localStorage.getItem("mindhaven_conversations");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setConversations(parsed.map((c: Conversation) => ({
                    ...c,
                    timestamp: new Date(c.timestamp),
                    messages: c.messages.map((m: Message) => ({
                        ...m,
                        timestamp: new Date(m.timestamp)
                    }))
                })));
            } catch {
                // ignore
            }
        }
    }, []);

    useEffect(() => {
        // Save conversations to localStorage
        if (conversations.length > 0) {
            localStorage.setItem("mindhaven_conversations", JSON.stringify(conversations));
        }
    }, [conversations]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const createNewConversation = () => {
        const newConv: Conversation = {
            id: generateId(),
            title: "New Conversation",
            timestamp: new Date(),
            preview: "",
            messages: []
        };
        setConversations(prev => [newConv, ...prev]);
        setCurrentConvId(newConv.id);
        setSidebarOpen(false);
        inputRef.current?.focus();
    };

    const deleteConversation = (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (currentConvId === id) {
            setCurrentConvId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        // Create new conversation if none exists
        let convId = currentConvId;
        if (!convId) {
            const newConv: Conversation = {
                id: generateId(),
                title: userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : ""),
                timestamp: new Date(),
                preview: userMessage,
                messages: []
            };
            setConversations(prev => [newConv, ...prev]);
            convId = newConv.id;
            setCurrentConvId(convId);
        }

        // Add user message
        const userMsg: Message = {
            id: generateId(),
            role: "user",
            content: userMessage,
            timestamp: new Date()
        };

        setConversations(prev => prev.map(c =>
            c.id === convId
                ? {
                    ...c,
                    messages: [...c.messages, userMsg],
                    preview: userMessage,
                    title: c.messages.length === 0 ? userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : "") : c.title
                }
                : c
        ));

        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();

            const assistantMsg: Message = {
                id: generateId(),
                role: "assistant",
                content: data.reply,
                sources: data.sources,
                timestamp: new Date()
            };

            setConversations(prev => prev.map(c =>
                c.id === convId
                    ? { ...c, messages: [...c.messages, assistantMsg] }
                    : c
            ));
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg: Message = {
                id: generateId(),
                role: "assistant",
                content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
                timestamp: new Date()
            };
            setConversations(prev => prev.map(c =>
                c.id === convId
                    ? { ...c, messages: [...c.messages, errorMsg] }
                    : c
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (text: string) => {
        setInput(text);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Sidebar */}
            <ChatSidebar
                conversations={conversations}
                currentId={currentConvId}
                onSelect={(id) => { setCurrentConvId(id); setSidebarOpen(false); }}
                onNew={createNewConversation}
                onDelete={deleteConversation}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Messages or Welcome Screen */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        /* Welcome Screen - Gemini Style */
                        <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center max-w-2xl"
                            >
                                {/* Logo */}
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 glow-animate float">
                                    <Sparkles className="h-10 w-10 text-white" />
                                </div>

                                {/* Greeting */}
                                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                                    {user ? (
                                        <>Hello, <span className="text-gradient">{user.name.split(" ")[0]}</span></>
                                    ) : (
                                        <>Hello, <span className="text-gradient">there</span></>
                                    )}
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8">
                                    How can I support you today?
                                </p>

                                {/* Suggestions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                                    {SUGGESTIONS.map((suggestion, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => handleSuggestionClick(suggestion.text)}
                                            className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 bg-card hover:bg-accent transition-all text-left hover-lift"
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0",
                                                suggestion.color
                                            )}>
                                                <suggestion.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                                {suggestion.text}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Message List */
                        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={cn(
                                            "flex gap-4",
                                            message.role === "user" ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex items-start gap-3 max-w-[85%]",
                                                message.role === "user" ? "flex-row-reverse" : "flex-row"
                                            )}
                                        >
                                            {/* Avatar */}
                                            <div
                                                className={cn(
                                                    "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                                                    message.role === "user"
                                                        ? "bg-gradient-primary glow"
                                                        : "bg-card border shadow-sm"
                                                )}
                                            >
                                                {message.role === "user"
                                                    ? <User className="h-4 w-4 text-white" />
                                                    : <Bot className="h-4 w-4 text-primary" />
                                                }
                                            </div>

                                            {/* Message Content */}
                                            <div className="space-y-2">
                                                <div
                                                    className={cn(
                                                        "p-4 rounded-2xl text-sm leading-relaxed",
                                                        message.role === "user"
                                                            ? "bg-gradient-primary text-white rounded-tr-sm"
                                                            : "glass rounded-tl-sm"
                                                    )}
                                                >
                                                    {message.content}
                                                </div>

                                                {/* Sources */}
                                                {message.sources && message.sources.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {message.sources.map((source, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-xs text-primary"
                                                            >
                                                                <FileText className="h-3 w-3" />
                                                                {source.title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-4 justify-start"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="h-9 w-9 rounded-full bg-card border shadow-sm flex items-center justify-center">
                                            <Bot className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="glass p-4 rounded-2xl rounded-tl-sm">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 border-t bg-background/80 backdrop-blur-lg">
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSubmit} className="relative">
                            <div className="glass rounded-2xl p-2 flex items-end gap-2">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Send a message..."
                                    rows={1}
                                    className="flex-1 min-h-[48px] max-h-[200px] resize-none bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground"
                                    style={{ height: "48px" }}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = "48px";
                                        target.style.height = Math.min(target.scrollHeight, 200) + "px";
                                    }}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-12 w-12 rounded-xl shrink-0 bg-gradient-primary hover:opacity-90 glow"
                                    disabled={isLoading || !input.trim()}
                                >
                                    {isLoading
                                        ? <Loader2 className="h-5 w-5 animate-spin" />
                                        : <Send className="h-5 w-5" />
                                    }
                                </Button>
                            </div>
                        </form>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                            MindHaven AI is here to support you. Remember to seek professional help when needed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
