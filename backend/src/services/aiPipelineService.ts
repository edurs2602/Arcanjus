import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { generateModelPhotos } from './vmakeService.js';
import { analyzeShirtImage } from './visionService.js';
import { uploadImage } from './storageService.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function processShirtPipeline(shirtId: string): Promise<void> {
  if (!env.AI_PIPELINE_ENABLED) {
    console.log(`[AI Pipeline] Disabled — skipping shirt ${shirtId}`);
    return;
  }

  if (!env.VMAKE_API_KEY || !env.ANTHROPIC_API_KEY) {
    console.warn('[AI Pipeline] Missing API keys — skipping');
    return;
  }

  try {
    // 1. Set status to processing
    await prisma.shirt.update({
      where: { id: shirtId },
      data: { pipelineStatus: 'processing', pipelineError: null },
    });

    // 2. Get the shirt's primary image
    const shirt = await prisma.shirt.findUnique({
      where: { id: shirtId },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });

    if (!shirt || shirt.images.length === 0) {
      throw new Error('Shirt not found or has no primary image');
    }

    const primaryImage = shirt.images[0]!;
    const imageUrl = primaryImage.url;

    // 3. Get image buffer for Claude Vision
    let imageBuffer: Buffer;
    if (imageUrl.startsWith('/uploads/')) {
      // Local file
      const filepath = join(env.UPLOADS_DIR, imageUrl.replace('/uploads/', ''));
      imageBuffer = await readFile(filepath);
    } else {
      // Remote URL
      const res = await fetch(imageUrl);
      imageBuffer = Buffer.from(await res.arrayBuffer());
    }

    // Determine mime type from URL
    const ext = imageUrl.split('.').pop()?.toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    // 4. Construct public URL for VMake (needs publicly accessible URL)
    const publicImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${env.PUBLIC_BACKEND_URL}${imageUrl}`;

    // 5. Run VMake + Claude Vision in parallel
    const [modelPhotos, analysis] = await Promise.allSettled([
      generateModelPhotos(publicImageUrl),
      analyzeShirtImage(imageBuffer, mimeType),
    ]);

    // 6. Process VMake results — store generated images
    if (modelPhotos.status === 'fulfilled') {
      const existingImageCount = await prisma.shirtImage.count({ where: { shirtId } });

      for (let i = 0; i < modelPhotos.value.length; i++) {
        const photo = modelPhotos.value[i]!;
        const storedUrl = await uploadImage(photo.buffer, photo.mimeType, 'ai-models');

        await prisma.shirtImage.create({
          data: {
            shirtId,
            url: storedUrl,
            alt: `${shirt.name} - modelo ${i + 1}`,
            sortOrder: existingImageCount + i + 1,
            isPrimary: false,
            isAiGenerated: true,
            modelName: photo.modelId,
          },
        });
      }
    } else {
      console.error('[AI Pipeline] VMake failed:', modelPhotos.reason);
    }

    // 7. Process Claude Vision results
    const aiData: { aiColor?: string; aiType?: string; aiDescription?: string } = {};
    if (analysis.status === 'fulfilled') {
      aiData.aiColor = analysis.value.color;
      aiData.aiType = analysis.value.type;
      aiData.aiDescription = analysis.value.description;
    } else {
      console.error('[AI Pipeline] Vision analysis failed:', analysis.reason);
    }

    // 8. Determine final status
    const vmakeFailed = modelPhotos.status === 'rejected';
    const visionFailed = analysis.status === 'rejected';

    if (vmakeFailed && visionFailed) {
      throw new Error('Both VMake and Vision analysis failed');
    }

    // 9. Update shirt with results
    await prisma.shirt.update({
      where: { id: shirtId },
      data: {
        ...aiData,
        pipelineStatus: 'complete',
        pipelineError: vmakeFailed
          ? 'Geração de fotos com modelo falhou'
          : visionFailed
            ? 'Análise de imagem falhou'
            : null,
      },
    });

    console.log(`[AI Pipeline] Completed for shirt ${shirtId}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[AI Pipeline] Failed for shirt ${shirtId}:`, message);

    await prisma.shirt.update({
      where: { id: shirtId },
      data: { pipelineStatus: 'failed', pipelineError: message },
    });
  }
}
