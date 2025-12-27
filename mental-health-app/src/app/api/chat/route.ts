import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Groq from "groq-sdk";

// Lazy initialization of Groq client
let groqClient: Groq | null = null;
function getGroqClient(): Groq | null {
    const apiKey = process.env.GROQ_API_KEY;
    console.log("Checking API Key:", apiKey ? "Present (Starts with " + apiKey.substring(0, 4) + ")" : "Missing");

    if (!apiKey) return null;
    if (!groqClient) {
        groqClient = new Groq({ apiKey });
    }
    return groqClient;
}

// Find relevant content using Prisma
async function findRelevantContent(query: string, limit = 3) {
    try {
        const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

        // Check if we have any content in DB
        const count = await prisma.knowledgeContent.count({ where: { status: "APPROVED" } });
        console.log("DB Content Count:", count);

        if (count === 0) return [];

        // Fetch recent approved items to filter in memory (better for small datasets)
        const content = await prisma.knowledgeContent.findMany({
            where: { status: "APPROVED" },
            take: 100,
            orderBy: { createdAt: 'desc' }
        });

        // Rank in memory
        const scored = content.map(item => {
            let score = 0;
            const text = `${item.title} ${item.summary} ${item.content} ${item.category}`.toLowerCase();

            keywords.forEach(k => {
                if (text.includes(k)) {
                    score += 1;
                    if (item.title.toLowerCase().includes(k)) score += 5;
                    if (item.summary.toLowerCase().includes(k)) score += 3;
                }
            });
            return { item, score };
        });

        return scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(s => s.item);
    } catch (e) {
        console.error("DB Error in findRelevantContent:", e);
        return []; // Return empty if DB fails so chat can continue
    }
}

// Build context from content
function buildContext(items: any[]): string {
    if (items.length === 0) return "";

    let context = "Berikut adalah informasi dari jurnal ilmiah yang relevan:\n\n";

    items.forEach((item, index) => {
        const excerpt = item.content.slice(0, 1500).trim();
        context += `--- SUMBER ${index + 1} ---\n`;
        context += `Judul: ${item.title}\n`;
        context += `Ringkasan: ${item.summary}\n`;
        context += `Konten: ${excerpt}...\n\n`;
    });

    return context;
}

const SYSTEM_PROMPT = `Kamu adalah MindHaven AI, teman curhat dan asisten kesehatan mental yang hangat, empatik, dan suportif.

PERAN UTAMA:
1.  **Active Listener**: Dengarkan keluh kesah pengguna dengan hati. Validasi perasaan mereka terlebih dahulu sebelum memberikan saran.
2.  **Edukatif**: Berikan informasi berdasarkan jurnal ilmiah (Knowledge Base) yang tersedia, namun jelaskan dengan bahasa yang mudah dimengerti (bukan bahasa akademis kaku).
3.  **Penjaga Keamanan**: Selalu waspada terhadap tanda-tanda krisis (bunuh diri/self-harm).

GAYA KOMUNIKASI:
-   **Bernada Hangat**: Gunakan sapaan yang akrab namun sopan. Gunakan emoji sesekali yang sesuai (🌿, 💙, ✨, 🤗).
-   **Validasi Emosi**: Contoh: "Aku mengerti rasanya berat sekali ya...", "Wajar kok kalau kamu merasa cemas..."
-   **Bahasa Indonesia Natural**: Hindari kata-kata "Saya adalah model bahasa AI". Gunakan "Aku" atau "Saya" (sesuaikan konteks), tapi tetap profesional.

STRUKTUR RESPON:
1.  **Validasi & Empati**: Mulai dengan mengakui perasaan pengguna.
2.  **Informasi (Knowledge Base)**: Jika ada konteks jurnal, rangkum poin pentingnya yang relevan dengan pertanyaan. Sebutkan: "Menurut riset di jurnal [Judul]..."
3.  **Saran Praktis**: Berikan 1-2 langkah kecil yang bisa dilakukan.
4.  **Penutup**: Berikan semangat atau pertanyaan terbuka. "Bagaimana menurutmu?", "Kamu mau cerita lebih lanjut?"

PROTOKOL KRISIS (PENTING):
Jika pengguna ingin bunuh diri atau melukai diri:
-   JANGAN memberikan saran medis/diagnosis.
-   Segera berikan respon suportif singkat dan arahkan ke bantuan profesional.
-   Tampilkan: "Kamu tidak sendirian. Silakan hubungi Psikolog Klinis atau Hotline Kesehatan Mental (Layanan SEJIWA: 119 ext 8)."
-   Jangan lanjutkan diskusi filosofis, fokus ke keselamatan.`;

export async function POST(req: Request) {
    try {
        console.log("Chat request received");
        const { message } = await req.json();

        const groq = getGroqClient();
        if (!groq) {
            console.error("Groq Client init failed - Check API Key");
            return NextResponse.json({
                reply: "⚠️ API Key Groq belum dikonfigurasi. Mohon cek file .env.local",
                sources: [],
            });
        }

        // Find relevant content from DB
        console.log("Searching knowledge base...");
        const relevantContent = await findRelevantContent(message);
        console.log(`Found ${relevantContent.length} relevant items`);

        // Build context
        const context = buildContext(relevantContent);

        // Build user message
        let userMessage = message;
        if (context) {
            userMessage = `${context}\n\nPERTANYAAN PENGGUNA:\n${message}\n\nJawab dengan menggunakan informasi dari sumber di atas jika relevan.`;
        }

        console.log("Sending request to Groq...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });
        console.log("Groq responded successfully");

        const reply = chatCompletion.choices[0]?.message?.content || "Maaf, ada kendala teknis.";

        const sources = relevantContent.map(item => ({
            title: item.title,
            type: "journal",
            author: "Penulis", // Author is a relation, complicated to fetch with basic select, simplified for now
        }));

        return NextResponse.json({ reply, sources });

    } catch (error: any) {
        console.error("Chat API Critical Error:", error);

        // Return detailed error for debugging (remove in production)
        const errorMessage = error?.message || "Unknown error";

        return NextResponse.json({
            reply: `Maaf, terjadi kesalahan teknis pada server. (${errorMessage})`,
            sources: [],
        }, { status: 500 });
    }
}
