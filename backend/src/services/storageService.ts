import { env } from '../config/env.js';
import { randomUUID } from 'crypto';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

// --- Local storage implementation ---

async function uploadImageLocal(buffer: Buffer, mimeType: string, folder: string): Promise<string> {
  const extension = mimeType.split('/')[1] ?? 'jpg';
  const filename = `${randomUUID()}.${extension}`;
  const dir = join(env.UPLOADS_DIR, folder);

  await mkdir(dir, { recursive: true });
  const filepath = join(dir, filename);
  await writeFile(filepath, buffer);

  // Return URL path served by Express static middleware
  return `/uploads/${folder}/${filename}`;
}

async function deleteImageLocal(url: string): Promise<void> {
  // url is like /uploads/shirts/uuid.jpg
  const filepath = join(env.UPLOADS_DIR, url.replace('/uploads/', ''));
  try {
    await unlink(filepath);
  } catch {
    // File may already be deleted
  }
}

// --- Cloud (S3) storage implementation ---

async function getS3Client() {
  const { S3Client } = await import('@aws-sdk/client-s3');
  return new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY!,
      secretAccessKey: env.S3_SECRET_KEY!,
    },
    forcePathStyle: !!env.S3_ENDPOINT,
  });
}

async function uploadImageCloud(buffer: Buffer, mimeType: string, folder: string): Promise<string> {
  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const s3 = await getS3Client();

  const extension = mimeType.split('/')[1] ?? 'jpg';
  const key = `${folder}/${randomUUID()}.${extension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );

  if (env.S3_ENDPOINT) {
    return `${env.S3_ENDPOINT}/${env.S3_BUCKET}/${key}`;
  }
  return `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${key}`;
}

async function deleteImageCloud(url: string): Promise<void> {
  const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
  const s3 = await getS3Client();

  const key = url.split('.com/')[1];
  if (!key) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET!,
      Key: key,
    }),
  );
}

// --- Public API (delegates based on STORAGE_MODE) ---

export async function uploadImage(
  buffer: Buffer,
  mimeType: string,
  folder: string = 'shirts',
): Promise<string> {
  if (env.STORAGE_MODE === 'cloud') {
    return uploadImageCloud(buffer, mimeType, folder);
  }
  return uploadImageLocal(buffer, mimeType, folder);
}

export async function deleteImage(url: string): Promise<void> {
  if (env.STORAGE_MODE === 'cloud') {
    return deleteImageCloud(url);
  }
  return deleteImageLocal(url);
}
