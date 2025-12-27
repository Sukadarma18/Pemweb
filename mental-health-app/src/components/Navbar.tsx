"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import {
    MessageCircle,
    BookOpen,
    Home,
    Menu,
    X,
    Sparkles,
    LogIn,
    LogOut,
    User,
    Shield,
    FileEdit,
    ChevronDown,
    Library
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();

    const routes = [
        { href: "/", label: "Home", icon: Home },
        { href: "/chat", label: "AI Chat", icon: MessageCircle },
        { href: "/knowledge", label: "Knowledge Base", icon: Library },
        { href: "/journal", label: "Journal", icon: BookOpen },
    ];

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b glass">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="bg-gradient-primary p-2 rounded-full glow">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-gradient">MindHaven</span>
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

                        {/* Role-based links */}
                        {user?.role === "contributor" && (
                            <Link
                                href="/contributor"
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                                    pathname.startsWith("/contributor") ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <FileEdit className="h-4 w-4" />
                                Dashboard
                            </Link>
                        )}

                        {user?.role === "admin" && (
                            <Link
                                href="/admin"
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                                    pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Shield className="h-4 w-4" />
                                Admin
                            </Link>
                        )}

                        {/* User Menu / Auth Buttons */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium max-w-[100px] truncate">
                                        {user.name.split(" ")[0]}
                                    </span>
                                    <ChevronDown className={cn(
                                        "h-4 w-4 transition-transform",
                                        showUserMenu && "rotate-180"
                                    )} />
                                </button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-56 glass rounded-xl p-2"
                                        >
                                            <div className="px-3 py-2 border-b border-border mb-2">
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1 capitalize">
                                                    {user.role}
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="rounded-full">
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/chat">
                                    <Button size="sm" className="rounded-full px-6 shadow-none hover:shadow-lg transition-all">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
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
                        className="md:hidden border-b glass"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-2">
                            {user && (
                                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-primary/5 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{user.name}</p>
                                        <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                                    </div>
                                </div>
                            )}

                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg transition-colors",
                                        pathname === route.href
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <route.icon className="h-5 w-5" />
                                    {route.label}
                                </Link>
                            ))}

                            {user?.role === "contributor" && (
                                <Link
                                    href="/contributor"
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg transition-colors",
                                        pathname.startsWith("/contributor")
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent"
                                    )}
                                >
                                    <FileEdit className="h-5 w-5" />
                                    Contributor Dashboard
                                </Link>
                            )}

                            {user?.role === "admin" && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg transition-colors",
                                        pathname.startsWith("/admin")
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent"
                                    )}
                                >
                                    <Shield className="h-5 w-5" />
                                    Admin Panel
                                </Link>
                            )}

                            <div className="pt-2 border-t border-border">
                                {user ? (
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="w-full flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg text-destructive hover:bg-destructive/10"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Sign Out
                                    </button>
                                ) : (
                                    <div className="space-y-2">
                                        <Link href="/login" onClick={() => setIsOpen(false)}>
                                            <Button variant="outline" className="w-full">
                                                <LogIn className="h-4 w-4 mr-2" />
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/chat" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full">Get Started</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
