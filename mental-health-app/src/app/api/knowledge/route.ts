import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all content (optionally filtered by status)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    try {
        const whereClause: any = {};
        if (status) whereClause.status = status;
        if (category && category !== "all") whereClause.category = category;

        const content = await prisma.knowledgeContent.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { name: true, email: true }
                }
            }
        });

        return NextResponse.json(content);
    } catch (error) {
        console.error("Failed to fetch knowledge:", error);
        return NextResponse.json(
            { error: "Failed to fetch content" },
            { status: 500 }
        );
    }
}

// POST: Create new content
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, summary, content, type, category, authorId } = body;

        if (!title || !content || !authorId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create new content
        const newContent = await prisma.knowledgeContent.create({
            data: {
                title,
                summary: summary || title,
                content,
                type: type || "ARTICLE",
                category: category || "general",
                authorId,
                status: "PENDING", // Default to pending for approval workflow
            },
        });

        return NextResponse.json(newContent, { status: 201 });
    } catch (error) {
        console.error("Failed to create content:", error);
        return NextResponse.json(
            { error: "Failed to create content" },
            { status: 500 }
        );
    }
}
