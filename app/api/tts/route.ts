import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId = "pNInz6obpgDQGcFmaJcg" } = await req.json(); // Adam voice by default

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsApiKey) {
      return NextResponse.json({ error: "ElevenLabs API key missing" }, { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Elevenlabs Error:", err);
        return NextResponse.json({ error: err }, { status: response.status });
    }

    return new NextResponse(response.body, {
        headers: {
            "Content-Type": "audio/mpeg",
        },
    });

  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
