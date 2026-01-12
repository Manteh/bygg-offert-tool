import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

export async function POST(req: Request) {
    try {
        const { text, targetLanguage } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            // Mock response if no key
            return NextResponse.json({ translatedText: `[MOCK] ${text}` });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a senior construction project manager and native Swedish speaker with 20+ years of experience in the Swedish construction industry. Your task is to translate construction work descriptions from Lithuanian to professional, idiomatic Swedish suitable for formal client offers (offert).

CRITICAL RULES:
1. ACCURACY: Do not guess. If a term is ambiguous, choose the most standard professional term used in Swedish construction (Bygg-AMA standard).
2. TERMINOLOGY:
   - Use 'Montering' or 'Installation' instead of 'Sätta' or 'Lägga' where appropriate.
   - Use 'Rivning' for demolition.
   - Use 'Underarbete' for preparation work.
   - Use 'Spackling' and 'Målning' for finishing.
   - Use 'Gipsning' for installing drywall.
   - Use 'Regling' for framing.
3. TONE: Professional, concise, and formal. Avoid colloquialisms.
4. OUTPUT: Return ONLY the translated text. No explanations, no quotes, no preambles.`
                },
                {
                    role: "user",
                    content: text
                }
            ],
        });

        const translatedText = response.choices[0].message.content;

        return NextResponse.json({ translatedText });
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
}
