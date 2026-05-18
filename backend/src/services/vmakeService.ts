import { env } from '../config/env.js';

const VMAKE_BASE = 'https://open.vmake.ai/api/v4/image/ai-fashion-model/clothing-tasks';
const MODEL_IDS = ['002', '005', '008'];
const POLL_INTERVAL = 3000;
const MAX_POLLS = 40;

interface TaskResult {
  downloadUrl: string;
  width: number;
  height: number;
}

async function createTryOnTask(imageUrl: string, modelId: string): Promise<string> {
  const response = await fetch(VMAKE_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': env.VMAKE_API_KEY!,
    },
    body: JSON.stringify({
      image: imageUrl,
      modelId,
      sceneType: 'preset',
      sceneId: '035',
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`VMake create task failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as { code: number; message?: string; data: { taskId: string } };
  if (data.code !== 0) {
    throw new Error(`VMake error: ${data.message}`);
  }

  return data.data.taskId;
}

async function pollTaskResult(taskId: string): Promise<TaskResult> {
  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));

    const response = await fetch(`${VMAKE_BASE}/${taskId}`, {
      headers: { 'X-Api-Key': env.VMAKE_API_KEY! },
    });

    if (!response.ok) continue;

    const data = (await response.json()) as { code: number; data: { status: string; results: TaskResult; message?: string } };
    if (data.code !== 0) continue;

    const task = data.data;

    if (task.status === 'success') {
      return task.results;
    }

    if (task.status === 'error') {
      throw new Error(`VMake task failed: ${task.message ?? 'unknown error'}`);
    }
  }

  throw new Error('VMake task timed out after 2 minutes');
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function generateModelPhotos(
  imageUrl: string,
): Promise<Array<{ buffer: Buffer; modelId: string; mimeType: string }>> {
  const results: Array<{ buffer: Buffer; modelId: string; mimeType: string }> = [];

  // Process each model sequentially to respect rate limits
  for (const modelId of MODEL_IDS) {
    try {
      const taskId = await createTryOnTask(imageUrl, modelId);
      const result = await pollTaskResult(taskId);
      const buffer = await downloadImage(result.downloadUrl);
      results.push({ buffer, modelId, mimeType: 'image/png' });
    } catch (error) {
      console.error(`VMake model ${modelId} failed:`, error);
      // Continue with remaining models even if one fails
    }
  }

  if (results.length === 0) {
    throw new Error('All VMake model generations failed');
  }

  return results;
}
