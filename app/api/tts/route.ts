import { NextRequest, NextResponse } from 'next/server';

interface VoiceConfig {
  voice_id: string;
  model_id: string;
  voice_settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { text, isWord = false, gender, isUser = false } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Voice selection logic
    let selectedVoiceId: string;
    
    if (isUser) {
      // Always use this voice for user text (language choices)
      selectedVoiceId = 'pNInz6obpgDQGcFmaJgB';
    } else {
      // NPC voices based on gender
      selectedVoiceId = gender === 'male' ? '2EiwWnXFnvU5JabPnv8n' : 'XB0fDUnXU5powFXDhCwa';
    }

    const voiceConfig: VoiceConfig = {
      voice_id: selectedVoiceId,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: isWord ? 0.6 : 0.5,
        similarity_boost: 0.8,
        style: isWord ? 0.3 : 0.4,
        use_speaker_boost: true
      }
    };

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: voiceConfig.model_id,
        voice_settings: voiceConfig.voice_settings
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', response.status, errorText);
      throw new Error(`Eleven Labs API error: ${response.status} - ${errorText}`);
    }

    const audioData = await response.arrayBuffer();
    
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });

  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}