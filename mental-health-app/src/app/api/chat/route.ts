import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const userText = message.toLowerCase();

        // Simulate network delay for realism
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let reply = "I hear you. Could you tell me more about that?";

        if (userText.includes("sad") || userText.includes("depressed") || userText.includes("lonely")) {
            reply = "I'm sorry you're feeling this way. It takes courage to share that. Remember that your feelings are valid. Would you like to talk about what might be causing these feelings?";
        } else if (userText.includes("anxious") || userText.includes("worry") || userText.includes("stress")) {
            reply = "It sounds like you're carrying a heavy load right now. Let's take a deep breath together. What's one thing that is worrying you the most at this moment?";
        } else if (userText.includes("happy") || userText.includes("good") || userText.includes("great")) {
            reply = "That's wonderful to hear! Holding onto these positive moments is so important. What made you feel this way?";
        } else if (userText.includes("help") || userText.includes("suicide")) {
            reply = "If you are in crisis, please know there is support available. Please reach out to a professional immediately or contact a local emergency number. You are not alone.";
        }

        return NextResponse.json({ reply });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
