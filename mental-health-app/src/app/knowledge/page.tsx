"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { knowledgeBase, KnowledgeContent, CATEGORIES } from "@/lib/knowledge-base";
import { motion } from "framer-motion";
import {
    Search,
    Library,
    FileText,
    User,
    Calendar,
    ArrowRight,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KnowledgePage() {
    const [articles, setArticles] = useState<KnowledgeContent[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<KnowledgeContent | null>(null);

    useEffect(() => {
        setArticles(knowledgeBase.getApproved());
    }, []);

    const filteredArticles = articles.filter(article => {
        const matchesSearch = search === "" ||
            article.title.toLowerCase().includes(search.toLowerCase()) ||
            article.summary.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-[calc(100vh-64px)] bg-muted/30">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 glow">
                            <Library className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">Knowledge Base</h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Explore our collection of mental health articles, resources, and expert insights
                        </p>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-8 max-w-xl mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 overflow-x-auto pb-2"
                >
                    <div className="flex gap-2 min-w-max">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border hover:border-primary/50"
                                }`}
                        >
                            <Filter className="h-4 w-4 inline mr-1" />
                            All
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card border hover:border-primary/50"
                                    }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Articles Grid */}
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-1">No articles found</h3>
                        <p className="text-muted-foreground">
                            {search ? "Try a different search term" : "Check back later for new content"}
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article, index) => (
                            <motion.article
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                className="glass rounded-2xl overflow-hidden hover-lift cursor-pointer group"
                                onClick={() => setSelectedArticle(article)}
                            >
                                <div className="h-2 bg-gradient-primary" />
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-2xl">
                                            {CATEGORIES.find(c => c.id === article.category)?.icon || "📄"}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                            {article.category}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {article.summary}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {article.author.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20 overflow-y-auto"
                    onClick={() => setSelectedArticle(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass rounded-2xl max-w-3xl w-full my-8"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="h-2 bg-gradient-primary rounded-t-2xl" />
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl">
                                    {CATEGORIES.find(c => c.id === selectedArticle.category)?.icon || "📄"}
                                </span>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary capitalize">
                                    {selectedArticle.category}
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold mb-4">{selectedArticle.title}</h2>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {selectedArticle.author.name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(selectedArticle.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
                                <p className="text-lg text-muted-foreground mb-6">{selectedArticle.summary}</p>
                                <div className="whitespace-pre-wrap">{selectedArticle.content}</div>
                            </div>

                            <div className="mt-8 pt-6 border-t flex justify-between items-center">
                                <Link href="/chat">
                                    <Button className="rounded-full">
                                        Ask about this topic <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedArticle(null)}
                                    className="rounded-full"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
