"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import {
  MessageCircle,
  Shield,
  Heart,
  Sparkles,
  Brain,
  ArrowRight,
  Users,
  FileText,
  Zap,
  BookOpen,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Chat",
      description: "Get compassionate, intelligent responses powered by our knowledge base of mental health resources.",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your conversations are private. We prioritize your anonymity and data security above all else.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Heart,
      title: "Expert Content",
      description: "Access curated articles and resources from mental health professionals and contributors.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const roles = [
    {
      icon: Users,
      title: "For Users",
      description: "Chat with our AI companion, access mental health resources, and find support anytime.",
      action: "Start Chatting",
      href: "/chat",
      color: "bg-gradient-to-br from-teal-500 to-cyan-600",
    },
    {
      icon: FileText,
      title: "For Contributors",
      description: "Share your expertise by contributing articles, research, and mental health resources.",
      action: "Contribute",
      href: "/login",
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      icon: Shield,
      title: "For Administrators",
      description: "Manage content, approve submissions, and ensure quality resources for our community.",
      action: "Admin Login",
      href: "/login",
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 pattern-dots opacity-50" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

        <div className="container relative z-10 mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-8 backdrop-blur-sm glow">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AI-Powered Mental Wellness Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Your Safe Space for{" "}
              <br className="hidden md:block" />
              <span className="text-gradient">Mental Wellness</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Chat with AI, access curated resources, and join a community dedicated to mental health support.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/chat">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 glow">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Chatting
                </Button>
              </Link>
              <Link href="/knowledge">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50 glass">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Resources
                </Button>
              </Link>
            </div>

            {user && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-sm text-muted-foreground"
              >
                Welcome back, <span className="text-primary font-medium">{user.name}</span>!
                {user.role !== "user" && (
                  <Link href={user.role === "admin" ? "/admin" : "/contributor"} className="ml-2 text-primary hover:underline">
                    Go to Dashboard →
                  </Link>
                )}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Why Choose <span className="text-gradient">MindHaven</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We combine advanced AI technology with expert knowledge to support your mental health journey.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="group glass rounded-2xl p-8 hover-lift"
              >
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform glow`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Join Our Community
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you&apos;re seeking support, sharing knowledge, or managing our platform - there&apos;s a place for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden hover-lift"
              >
                <div className={`h-24 ${role.color} flex items-center justify-center`}>
                  <role.icon className="h-10 w-10 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {role.description}
                  </p>
                  <Link href={role.href}>
                    <Button variant="outline" className="w-full rounded-full">
                      {role.action} <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "24/7", label: "Available" },
              { value: "100%", label: "Private" },
              { value: "Free", label: "To Use" },
              { value: "∞", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass rounded-3xl p-8 md:p-12">
              <Zap className="h-12 w-12 mx-auto text-primary mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to start your journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of others who are finding clarity and peace with MindHaven.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <Button size="lg" className="rounded-full px-10 h-14 text-lg glow">
                    Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Instant access
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 MindHaven. A safe space for mental wellness.</p>
          <p className="mt-2">
            Remember: This is a supportive tool, not a replacement for professional help.
          </p>
        </div>
      </footer>
    </div>
  );
}
