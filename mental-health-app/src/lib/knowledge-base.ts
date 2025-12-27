import { generateId } from "./utils";

export type ContentType = "article" | "news" | "pdf" | "journal";
export type ContentStatus = "pending" | "approved" | "rejected";

export interface KnowledgeContent {
    id: string;
    title: string;
    summary: string;
    content: string;
    type: ContentType;
    category: string;
    author: {
        id: string;
        name: string;
    };
    status: ContentStatus;
    createdAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    feedback?: string;
    pdfFilename?: string;
}

// Categories - Updated with Indonesian labels
export const CATEGORIES = [
    { id: "anxiety", label: "Kecemasan & Stres", icon: "🧠" },
    { id: "depression", label: "Depresi", icon: "💭" },
    { id: "child-mental-health", label: "Kesehatan Mental Anak & Remaja", icon: "👶" },
    { id: "relationships", label: "Hubungan & Keluarga", icon: "💕" },
    { id: "digital-mental-health", label: "Media Sosial & Teknologi", icon: "📱" },
    { id: "mindfulness", label: "Mindfulness", icon: "🧘" },
    { id: "self-care", label: "Perawatan Diri", icon: "🌱" },
    { id: "therapy", label: "Terapi & Pengobatan", icon: "🩺" },
    { id: "general", label: "Kesehatan Mental Umum", icon: "✨" },
];

// Initial sample content in Indonesian
const SAMPLE_CONTENT: KnowledgeContent[] = [
    {
        id: "kb-1",
        title: "Memahami Kecemasan: Penyebab dan Strategi Penanganan",
        summary: "Panduan komprehensif untuk memahami gangguan kecemasan dan mekanisme koping berbasis bukti.",
        content: `Kecemasan adalah respons alami terhadap stres, namun ketika menjadi berlebihan, dapat mengganggu kehidupan sehari-hari.

**Penyebab Umum Kecemasan:**
- Faktor genetik
- Ketidakseimbangan kimia otak
- Peristiwa traumatis
- Stres kronis
- Kondisi medis tertentu

**Strategi Penanganan Berbasis Bukti:**

1. **Pernapasan Dalam**: Praktikkan teknik 4-7-8 - tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik.

2. **Relaksasi Otot Progresif**: Tegangkan dan lepaskan kelompok otot secara sistematis untuk mengurangi ketegangan fisik.

3. **Restrukturisasi Kognitif**: Tantang pola pikir negatif dan ganti dengan perspektif yang lebih seimbang.

4. **Olahraga Teratur**: Aktivitas fisik melepaskan endorfin dan mengurangi hormon stres.

5. **Meditasi Mindfulness**: Tetap hadir dan amati pikiran tanpa menghakimi.

Ingat: Jika kecemasan secara signifikan memengaruhi hidup Anda, mencari bantuan profesional adalah tanda kekuatan, bukan kelemahan.`,
        type: "article",
        category: "anxiety",
        author: { id: "contributor-1", name: "Dr. Sarah Wijaya" },
        status: "approved",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        reviewedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
        id: "kb-2",
        title: "5 Praktik Mindfulness Harian untuk Kesehatan Mental yang Lebih Baik",
        summary: "Teknik mindfulness sederhana yang dapat Anda masukkan ke dalam rutinitas harian.",
        content: `Mindfulness membantu kita tetap membumi di saat ini. Berikut 5 praktik yang bisa dicoba:

**1. Rasa Syukur Pagi (2 menit)**
Sebelum bangun dari tempat tidur, pikirkan 3 hal yang Anda syukuri.

**2. Makan dengan Penuh Kesadaran (10 menit)**
Saat makan, fokus sepenuhnya pada rasa, tekstur, dan pengalaman makan.

**3. Meditasi Berjalan (10 menit)**
Berjalan sambil memperhatikan setiap langkah, pernapasan, dan lingkungan sekitar.

**4. Body Scan (5 menit)**
Tutup mata dan perlahan pindai tubuh dari kepala hingga kaki, perhatikan sensasi yang dirasakan.

**5. Refleksi Malam (5 menit)**
Sebelum tidur, renungkan satu momen positif dari hari Anda.

Mulailah dengan satu praktik dan tambahkan lebih banyak secara bertahap.`,
        type: "article",
        category: "mindfulness",
        author: { id: "contributor-1", name: "Dr. Sarah Wijaya" },
        status: "approved",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
        id: "kb-3",
        title: "Mengenali Tanda-tanda Depresi: Kapan Harus Mencari Bantuan",
        summary: "Pelajari cara mengidentifikasi gejala umum depresi dan pahami kapan bantuan profesional diperlukan.",
        content: `Depresi lebih dari sekadar merasa sedih. Ini adalah kondisi kesehatan mental serius yang memengaruhi cara Anda merasa, berpikir, dan menangani aktivitas sehari-hari.

**Gejala Umum:**
- Suasana hati sedih, cemas, atau "kosong" yang terus-menerus
- Kehilangan minat pada aktivitas yang dulu disukai
- Perubahan nafsu makan atau berat badan
- Gangguan tidur (insomnia atau tidur berlebihan)
- Kelelahan dan penurunan energi
- Kesulitan berkonsentrasi atau membuat keputusan
- Perasaan tidak berharga atau rasa bersalah berlebihan
- Pikiran tentang kematian atau bunuh diri

**Kapan Mencari Bantuan:**
- Gejala berlangsung lebih dari 2 minggu
- Fungsi sehari-hari terganggu secara signifikan
- Menggunakan zat untuk mengatasi masalah
- Memiliki pikiran menyakiti diri sendiri

**Ingat:** Depresi dapat diobati. Meminta bantuan adalah langkah pertama menuju pemulihan.

Jika Anda dalam krisis, segera hubungi profesional kesehatan mental atau layanan darurat.`,
        type: "article",
        category: "depression",
        author: { id: "contributor-1", name: "Dr. Sarah Wijaya" },
        status: "approved",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
];

// Knowledge Base Service
class KnowledgeBaseService {
    private storageKey = "mindhaven_knowledge_base";
    private journalsKey = "mindhaven_journals";
    private journalsLoaded = false;

    // Load journals from API on first access
    private async loadJournalsFromAPI(): Promise<void> {
        if (this.journalsLoaded || typeof window === "undefined") return;

        try {
            const response = await fetch("/api/journals");
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.journals) {
                    this.saveJournals(data.journals);
                    this.journalsLoaded = true;
                }
            }
        } catch (error) {
            console.log("Could not load journals from API:", error);
        }
    }

    getAll(): KnowledgeContent[] {
        if (typeof window === "undefined") return SAMPLE_CONTENT;

        const saved = localStorage.getItem(this.storageKey);
        if (!saved) {
            // Initialize with sample content
            localStorage.setItem(this.storageKey, JSON.stringify(SAMPLE_CONTENT));
            return SAMPLE_CONTENT;
        }

        try {
            return JSON.parse(saved).map((item: KnowledgeContent) => ({
                ...item,
                createdAt: new Date(item.createdAt),
                reviewedAt: item.reviewedAt ? new Date(item.reviewedAt) : undefined,
            }));
        } catch {
            return SAMPLE_CONTENT;
        }
    }

    // Get imported journals from localStorage
    getJournals(): KnowledgeContent[] {
        if (typeof window === "undefined") return [];

        const saved = localStorage.getItem(this.journalsKey);
        if (!saved) return [];

        try {
            return JSON.parse(saved).map((item: KnowledgeContent) => ({
                ...item,
                createdAt: new Date(item.createdAt),
            }));
        } catch {
            return [];
        }
    }

    // Save imported journals
    saveJournals(journals: KnowledgeContent[]): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(this.journalsKey, JSON.stringify(journals));
        }
    }

    // Get all content including journals
    getAllWithJournals(): KnowledgeContent[] {
        return [...this.getAll(), ...this.getJournals()];
    }

    getApproved(): KnowledgeContent[] {
        // Try to load journals if not already loaded
        if (typeof window !== "undefined" && !this.journalsLoaded) {
            this.loadJournalsFromAPI();
        }
        return this.getAllWithJournals().filter(c => c.status === "approved");
    }

    getPending(): KnowledgeContent[] {
        return this.getAll().filter(c => c.status === "pending");
    }

    getByAuthor(authorId: string): KnowledgeContent[] {
        return this.getAll().filter(c => c.author.id === authorId);
    }

    getById(id: string): KnowledgeContent | undefined {
        return this.getAllWithJournals().find(c => c.id === id);
    }

    search(query: string): KnowledgeContent[] {
        const q = query.toLowerCase();
        return this.getApproved().filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.summary.toLowerCase().includes(q) ||
            c.content.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        );
    }

    add(content: Omit<KnowledgeContent, "id" | "createdAt" | "status">): KnowledgeContent {
        const all = this.getAll();
        const newContent: KnowledgeContent = {
            ...content,
            id: generateId(),
            createdAt: new Date(),
            status: "pending",
        };
        all.unshift(newContent);
        this.save(all);
        return newContent;
    }

    update(id: string, updates: Partial<KnowledgeContent>): KnowledgeContent | undefined {
        const all = this.getAll();
        const index = all.findIndex(c => c.id === id);
        if (index === -1) return undefined;

        all[index] = { ...all[index], ...updates };
        this.save(all);
        return all[index];
    }

    approve(id: string, reviewerId: string): KnowledgeContent | undefined {
        return this.update(id, {
            status: "approved",
            reviewedAt: new Date(),
            reviewedBy: reviewerId,
        });
    }

    reject(id: string, reviewerId: string, feedback: string): KnowledgeContent | undefined {
        return this.update(id, {
            status: "rejected",
            reviewedAt: new Date(),
            reviewedBy: reviewerId,
            feedback,
        });
    }

    delete(id: string): boolean {
        const all = this.getAll();
        const filtered = all.filter(c => c.id !== id);
        if (filtered.length === all.length) return false;
        this.save(filtered);
        return true;
    }

    private save(content: KnowledgeContent[]): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(this.storageKey, JSON.stringify(content));
        }
    }

    // For chat responses - find relevant content with improved Indonesian search
    findRelevant(query: string, limit = 5): KnowledgeContent[] {
        const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

        // Common Indonesian mental health terms mapping
        const synonyms: Record<string, string[]> = {
            "cemas": ["anxiety", "kecemasan", "anxious", "worry", "khawatir"],
            "sedih": ["depression", "depresi", "sad", "murung", "down"],
            "stres": ["stress", "tekanan", "overwhelmed", "tertekan"],
            "mindfulness": ["meditasi", "meditation", "relaksasi", "calm", "tenang"],
            "depresi": ["depression", "sedih", "hopeless", "putus asa"],
            "mental": ["kesehatan mental", "mental health", "psikis", "jiwa"],
            "anak": ["child", "remaja", "youth", "generasi z"],
            "sosial": ["social", "hubungan", "relationship", "komunitas"],
        };

        // Expand keywords with synonyms
        const expandedKeywords = new Set<string>(keywords);
        keywords.forEach(keyword => {
            for (const [key, values] of Object.entries(synonyms)) {
                if (keyword.includes(key) || values.some(v => keyword.includes(v))) {
                    expandedKeywords.add(key);
                    values.forEach(v => expandedKeywords.add(v));
                }
            }
        });

        const scored = this.getApproved().map(content => {
            let score = 0;
            const searchText = `${content.title} ${content.summary} ${content.content} ${content.category}`.toLowerCase();

            expandedKeywords.forEach(keyword => {
                if (searchText.includes(keyword)) {
                    score += 1;
                    if (content.title.toLowerCase().includes(keyword)) score += 3;
                    if (content.summary.toLowerCase().includes(keyword)) score += 2;
                }
            });

            return { content, score };
        });

        return scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(s => s.content);
    }
}

export const knowledgeBase = new KnowledgeBaseService();
