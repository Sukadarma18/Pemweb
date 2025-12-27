"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { knowledgeBase, ContentType, CATEGORIES } from "@/lib/knowledge-base";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    FileText,
    Newspaper,
    Upload,
    Send,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubmitContentPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [contentType, setContentType] = useState<ContentType>("article");
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("general");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        knowledgeBase.add({
            title,
            summary,
            content: contentType === "pdf" ? `[PDF Document: ${pdfFile?.name}]\n\n${content}` : content,
            type: contentType,
            category,
            author: {
                id: user.id,
                name: user.name,
            },
            pdfFilename: pdfFile?.name,
        });

        setIsSubmitting(false);
        setIsSuccess(true);

        // Redirect after success
        setTimeout(() => {
            router.push("/contributor");
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Submission Successful!</h2>
                    <p className="text-muted-foreground">
                        Your content has been submitted for review.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-muted/30 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/contributor"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">Submit New Content</h1>
                    <p className="text-muted-foreground mt-1">
                        Share knowledge to help others on their mental health journey
                    </p>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="glass rounded-2xl p-6 space-y-6"
                >
                    {/* Content Type */}
                    <div>
                        <label className="text-sm font-medium mb-3 block">Content Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { type: "article" as ContentType, label: "Article", icon: FileText },
                                { type: "news" as ContentType, label: "News", icon: Newspaper },
                                { type: "pdf" as ContentType, label: "PDF Upload", icon: Upload },
                            ].map(({ type, label, icon: Icon }) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setContentType(type)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${contentType === type
                                            ? "border-primary bg-primary/10"
                                            : "border-input hover:border-primary/50"
                                        }`}
                                >
                                    <Icon className={`h-6 w-6 ${contentType === type ? "text-primary" : "text-muted-foreground"}`} />
                                    <span className={`text-sm font-medium ${contentType === type ? "text-primary" : ""}`}>
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PDF Upload */}
                    {contentType === "pdf" && (
                        <div>
                            <label className="text-sm font-medium mb-2 block">Upload PDF</label>
                            <div
                                className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => document.getElementById("pdf-input")?.click()}
                            >
                                <input
                                    id="pdf-input"
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                />
                                {pdfFile ? (
                                    <div className="flex items-center justify-center gap-2 text-primary">
                                        <FileText className="h-6 w-6" />
                                        <span className="font-medium">{pdfFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            Click to upload PDF or drag and drop
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a descriptive title..."
                            className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Summary</label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Brief summary of the content..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            {contentType === "pdf" ? "Additional Notes (Optional)" : "Content"}
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={contentType === "pdf"
                                ? "Add any additional context or notes about this PDF..."
                                : "Write your content here. You can use markdown formatting..."
                            }
                            rows={10}
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
                            required={contentType !== "pdf"}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Link href="/contributor">
                            <Button type="button" variant="outline" className="rounded-full px-6">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            className="rounded-full px-6 glow"
                            disabled={isSubmitting || !title || !summary || (contentType !== "pdf" && !content)}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Submit for Review
                                </>
                            )}
                        </Button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
