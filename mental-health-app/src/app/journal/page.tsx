"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JournalEntry {
    id: string;
    content: string;
    date: string;
    mood: "Happy" | "Neutral" | "Sad" | "Anxious";
}

export default function JournalPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [newEntry, setNewEntry] = useState("");
    const [selectedMood, setSelectedMood] = useState<JournalEntry["mood"]>("Neutral");

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("journal_entries");
        if (saved) {
            setEntries(JSON.parse(saved));
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem("journal_entries", JSON.stringify(entries));
    }, [entries]);

    const addEntry = () => {
        if (!newEntry.trim()) return;

        const entry: JournalEntry = {
            id: Date.now().toString(),
            content: newEntry,
            date: new Date().toLocaleDateString(),
            mood: selectedMood,
        };

        setEntries([entry, ...entries]);
        setNewEntry("");
    };

    const deleteEntry = (id: string) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-muted/30 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Your Personal Journal</h1>
                    <p className="text-muted-foreground">Capture your thoughts and feelings in a safe space.</p>
                </div>

                {/* Input Area */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                    <textarea
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        placeholder="How are you feeling today?"
                        className="w-full min-h-[150px] p-4 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2">
                            {(["Happy", "Neutral", "Sad", "Anxious"] as const).map((mood) => (
                                <button
                                    key={mood}
                                    onClick={() => setSelectedMood(mood)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedMood === mood
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {mood}
                                </button>
                            ))}
                        </div>
                        <Button onClick={addEntry} disabled={!newEntry.trim()}>
                            <Plus className="mr-2 h-4 w-4" /> Save Entry
                        </Button>
                    </div>
                </div>

                {/* Entries List */}
                <div className="grid gap-6">
                    <AnimatePresence>
                        {entries.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 text-muted-foreground"
                            >
                                <Book className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No entries yet. Start writing your first one!</p>
                            </motion.div>
                        ) : (
                            entries.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-card border rounded-xl p-6 shadow-sm group hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                {entry.mood}
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {entry.date}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteEntry(entry.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                        {entry.content}
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
