"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import {
    User,
    Shield,
    FileEdit,
    ArrowRight,
    Mail,
    Lock,
    Loader2,
    Sparkles
} from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login, loginAsRole } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const success = await login(email, password);
        if (success) {
            router.push("/chat");
        } else {
            setError("Invalid email or password");
        }
        setIsLoading(false);
    };

    const handleDemoLogin = (role: "user" | "contributor" | "admin") => {
        loginAsRole(role);
        if (role === "admin") {
            router.push("/admin");
        } else if (role === "contributor") {
            router.push("/contributor");
        } else {
            router.push("/chat");
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 pattern-dots">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 glow">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">
                        Sign in to continue your journey
                    </p>
                </div>

                {/* Login Form */}
                <div className="glass rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-destructive text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-sm text-muted-foreground">or try demo</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Demo Accounts */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => handleDemoLogin("user")}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-input hover:border-primary hover:bg-accent transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-xs font-medium">User</span>
                        </button>

                        <button
                            onClick={() => handleDemoLogin("contributor")}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-input hover:border-primary hover:bg-accent transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <FileEdit className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-xs font-medium">Contributor</span>
                        </button>

                        <button
                            onClick={() => handleDemoLogin("admin")}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-input hover:border-primary hover:bg-accent transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-xs font-medium">Admin</span>
                        </button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Register here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
