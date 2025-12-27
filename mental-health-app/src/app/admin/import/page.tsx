"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Terminal,
    FileText,
    Database,
    CheckCircle2,
    Copy,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImportJournalsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "admin")) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    const copyCommand = () => {
        navigator.clipboard.writeText("node scripts/import-journals.js");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading || !user || user.role !== "admin") {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-muted/30 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 glow">
                            <Database className="h-6 w-6 text-white" />
                        </div>
                        Import Jurnal PDF
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Panduan untuk mengimpor 44 jurnal mental health ke Knowledge Base
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="space-y-6">
                    {/* Step 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass rounded-2xl p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                1
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">Pastikan Folder Jurnal Tersedia</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Letakkan semua file PDF jurnal di folder:
                                </p>
                                <code className="block p-3 bg-muted rounded-lg text-sm font-mono">
                                    📁 Jurnal Mental Health/
                                </code>
                                <p className="text-xs text-muted-foreground mt-2">
                                    (Folder ini harus berada di root folder project)
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass rounded-2xl p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                2
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">Jalankan Script Import</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Buka terminal di folder project dan jalankan:
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono flex items-center gap-2">
                                        <Terminal className="h-4 w-4 text-primary" />
                                        node scripts/import-journals.js
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={copyCommand}
                                        className="shrink-0"
                                    >
                                        {copied ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass rounded-2xl p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                3
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">Tunggu Proses Selesai</h3>
                                <p className="text-sm text-muted-foreground">
                                    Script akan mengekstrak teks dari semua PDF dan menyimpannya ke:
                                </p>
                                <code className="block p-3 bg-muted rounded-lg text-sm font-mono mt-3">
                                    📄 src/data/journals.json
                                </code>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 4 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass rounded-2xl p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">Selesai!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Chatbot AI sekarang akan menggunakan konten jurnal sebagai sumber informasi tambahan saat menjawab pertanyaan pengguna.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20"
                >
                    <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-600 mb-1">Catatan</h4>
                            <p className="text-sm text-muted-foreground">
                                Beberapa file PDF mungkin tidak dapat dibaca jika terenkripsi atau memiliki format yang tidak standar.
                                Script akan melewati file yang bermasalah dan melaporkan jumlah yang berhasil diimpor.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Back to chat */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center"
                >
                    <Link href="/chat">
                        <Button className="rounded-full px-8 glow">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Test Chatbot AI
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
