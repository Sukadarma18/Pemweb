"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Heart, Sparkles, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-24 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05]" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)' }} />

        <div className="container relative z-10 mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span>AI-Powered Mental Wellness</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Find Peace of Mind <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Anytime, Anywhere</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              A safe space to share your thoughts, track your mood, and receive compassionate support from your AI companion.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/chat">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Chatting Now
                </Button>
              </Link>
              <Link href="/journal">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50">
                  Visit Journal
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose MindHaven?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We combine advanced AI technology with proven wellness techniques to support your mental health journey.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Brain,
                title: "Empathetic AI",
                description: "Our chatbot is trained to listen without judgment and offer supportive, grounding conversations."
              },
              {
                icon: Shield,
                title: "Private & Secure",
                description: "Your conversations are private. We prioritize your anonymity and data security above all else."
              },
              {
                icon: Heart,
                title: "Wellness Tools",
                description: "Access journaling tools and mood tracking to better understand your emotional patterns."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="group p-8 rounded-2xl bg-card border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
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

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your journey?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of others who are finding clarity and peace with MindHaven.
            </p>
            <Link href="/chat">
              <Button size="lg" className="rounded-full px-10 h-12 text-lg">
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
