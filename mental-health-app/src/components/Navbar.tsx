"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen, Home, Menu, X, Smile } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const routes = [
        { href: "/", label: "Home", icon: Home },
        { href: "/chat", label: "AI Companion", icon: MessageCircle },
        { href: "/journal", label: "Journal", icon: BookOpen },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Smile className="h-6 w-6 text-primary" />
                        </div>
                        <span>MindHaven</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                                    pathname === route.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <route.icon className="h-4 w-4" />
                                {route.label}
                            </Link>
                        ))}
                        <Link href="/chat">
                            <Button size="sm" className="rounded-full px-6 shadow-none hover:shadow-lg transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-muted-foreground"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b bg-background/95 backdrop-blur-lg"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-4">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-2 text-sm font-medium py-2 px-2 rounded-md transition-colors",
                                        pathname === route.href
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <route.icon className="h-5 w-5" />
                                    {route.label}
                                </Link>
                            ))}
                            <div className="pt-2">
                                <Link href="/chat" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Chat with AI</Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
