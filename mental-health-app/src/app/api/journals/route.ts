import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface JournalData {
    id: string;
    filename: string;
    title: string;
    content: string;
    summary: string;
    author: string;
    category: string;
    fileSize?: number;
    addedDate?: string;
}

const JOURNALS_DATA_PATH = path.join(process.cwd(), "src", "data", "journals.json");

// Map journal categories to knowledge base categories
const categoryMapping: Record<string, string> = {
    "Kesehatan Mental Anak & Remaja": "child-mental-health",
    "Depresi": "depression",
    "Anxiety & Gangguan Cemas": "anxiety",
    "Stress Management": "anxiety",
    "Media Sosial & Teknologi": "digital-mental-health",
    "Hubungan Sosial": "relationships",
    "Kesehatan Mental Komunitas": "general",
    "Pencegahan & Promosi": "general",
    "Psikoedukasi & Literasi": "general",
    "Generasi Z": "child-mental-health",
    "Kesehatan Mental Umum": "general",
};

export async function GET() {
    try {
        // Read journals.json
        const data = await fs.readFile(JOURNALS_DATA_PATH, "utf-8");
        const journals: JournalData[] = JSON.parse(data);

        // Convert to KnowledgeContent format
        const knowledgeContent = journals.map(journal => ({
            id: journal.id,
            title: journal.title || journal.filename,
            summary: journal.summary,
            content: journal.content,
            type: "journal" as const,
            category: categoryMapping[journal.category] || "general",
            author: {
                id: "system-journals",
                name: journal.author || "Research & References",
            },
            status: "approved" as const,
            createdAt: new Date(journal.addedDate || Date.now()),
            pdfFilename: journal.filename,
        }));

        return NextResponse.json({
            success: true,
            count: knowledgeContent.length,
            journals: knowledgeContent,
        });
    } catch (error) {
        console.error("Error loading journals:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to load journals",
            },
            { status: 500 }
        );
    }
}
