import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=lt|sv`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`MyMemory error: ${response.status}`);
        }

        const data = await response.json();
        const translatedText = data?.responseData?.translatedText ?? null;

        if (!translatedText) {
            throw new Error('No translation returned');
        }

        return NextResponse.json({ translatedText });
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
}
