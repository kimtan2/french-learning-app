interface AudioCache {
  [key: string]: string; // URL for the audio blob
}

class ElevenLabsService {
  private audioCache: AudioCache = {};

  constructor() {
    // No need for API key on client side
  }

  private generateCacheKey(text: string, isWord: boolean): string {
    return `${isWord ? 'word' : 'sentence'}_${btoa(text).replace(/[^a-zA-Z0-9]/g, '')}`;
  }

  private async createAudioBlob(audioData: ArrayBuffer): Promise<string> {
    const blob = new Blob([audioData], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  }

  async generateSpeech(text: string, isWord: boolean = false): Promise<string | null> {
    const cacheKey = this.generateCacheKey(text, isWord);
    
    // Check cache first
    if (this.audioCache[cacheKey]) {
      return this.audioCache[cacheKey];
    }

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          isWord: isWord
        })
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const audioData = await response.arrayBuffer();
      const audioUrl = await this.createAudioBlob(audioData);
      
      // Cache the result
      this.audioCache[cacheKey] = audioUrl;
      
      return audioUrl;
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }

  async playAudio(text: string, isWord: boolean = false): Promise<void> {
    const audioUrl = await this.generateSpeech(text, isWord);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }

  clearCache(): void {
    // Clean up blob URLs to prevent memory leaks
    Object.values(this.audioCache).forEach(url => {
      URL.revokeObjectURL(url);
    });
    this.audioCache = {};
  }
}

export const elevenLabsService = new ElevenLabsService();
export default elevenLabsService;