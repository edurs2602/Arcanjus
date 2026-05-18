import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';

interface ShirtAnalysis {
  type: string;
  color: string;
  description: string;
}

export async function analyzeShirtImage(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<ShirtAnalysis> {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY! });

  const base64 = imageBuffer.toString('base64');
  const mediaType = mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: `Analise esta imagem de uma camisa e retorne APENAS um JSON com os seguintes campos:
- "type": tipo da camisa (escolha entre: casual, social, polo, esporte, linho, jeans)
- "color": cor principal em português (ex: branco, azul, preto, vermelho, verde, bege)
- "description": descrição curta da camisa em português (máximo 2 frases, focando em estilo, tecido aparente e ocasião de uso)

Responda SOMENTE com o JSON, sem markdown ou texto adicional.`,
          },
        ],
      },
    ],
  });

  const firstBlock = response.content[0];
  const text = firstBlock && firstBlock.type === 'text' ? firstBlock.text : '';

  try {
    const parsed = JSON.parse(text.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
    return {
      type: parsed.type ?? 'casual',
      color: parsed.color ?? 'indefinido',
      description: parsed.description ?? '',
    };
  } catch {
    console.error('Failed to parse Claude Vision response:', text);
    return { type: 'casual', color: 'indefinido', description: '' };
  }
}
