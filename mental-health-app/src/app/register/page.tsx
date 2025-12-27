"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole } from "@/context/auth-context";
import { motion } from "framer-motion";
import {
    User,
    FileEdit,
    ArrowRight,
    Mail,
    Lock,
    Loader2,
    Sparkles,
    UserPlus
} from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("user");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const success = await register(name, email, password, role);
        if (success) {
            if (role === "contributor") {
                router.push("/contributor");
            } else {
                router.push("/chat");
            }
        } else {
            setError("Email already registered");
        }
        setIsLoading(false);
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
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-muted-foreground">
                        Join MindHaven today
                    </p>
                </div>

                {/* Register Form */}
                <div className="glass rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Full Name</label>
                            <div className="relative">
                                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

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
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">I want to...</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("user")}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === "user"
                                            ? "border-primary bg-primary/10"
                                            : "border-input hover:border-primary/50"
                                        }`}
                                >
                                    <User className={`h-6 w-6 ${role === "user" ? "text-primary" : "text-muted-foreground"}`} />
                                    <span className={`text-sm font-medium ${role === "user" ? "text-primary" : ""}`}>
                                        Get Support
                                    </span>
                                    <span className="text-xs text-muted-foreground text-center">
                                        Chat & access resources
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRole("contributor")}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === "contributor"
                                            ? "border-primary bg-primary/10"
                                            : "border-input hover:border-primary/50"
                                        }`}
                                >
                                    <FileEdit className={`h-6 w-6 ${role === "contributor" ? "text-primary" : "text-muted-foreground"}`} />
                                    <span className={`text-sm font-medium ${role === "contributor" ? "text-primary" : ""}`}>
                                        Contribute
                                    </span>
                                    <span className="text-xs text-muted-foreground text-center">
                                        Share articles & news
                                    </span>
                                </button>
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
                                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
