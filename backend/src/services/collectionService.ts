import { prisma } from '../config/database.js';
import { uploadImage, deleteImage } from './storageService.js';

export async function listActiveCollections() {
  return prisma.collection.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      description: true,
      bannerUrl: true,
      bannerAlt: true,
      order: true,
    },
  });
}

export async function listAllCollections() {
  return prisma.collection.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { shirts: true } },
    },
  });
}

export async function getCollectionById(id: string) {
  return prisma.collection.findUnique({
    where: { id },
    include: {
      shirts: {
        where: { active: true },
        include: { images: { where: { isPrimary: true }, take: 1 } },
      },
    },
  });
}

interface CreateCollectionInput {
  name: string;
  description?: string;
  bannerAlt?: string;
  order?: number;
  banner: { buffer: Buffer; mimeType: string };
}

export async function createCollection(input: CreateCollectionInput) {
  const bannerUrl = await uploadImage(input.banner.buffer, input.banner.mimeType, 'collections');

  return prisma.collection.create({
    data: {
      name: input.name,
      description: input.description,
      bannerUrl,
      bannerAlt: input.bannerAlt ?? input.name,
      order: input.order ?? 0,
    },
  });
}

interface UpdateCollectionInput {
  name?: string;
  description?: string;
  bannerAlt?: string;
  order?: number;
  active?: boolean;
  banner?: { buffer: Buffer; mimeType: string };
}

export async function updateCollection(id: string, input: UpdateCollectionInput) {
  const existing = await prisma.collection.findUnique({ where: { id } });
  if (!existing) return null;

  let bannerUrl = existing.bannerUrl;
  if (input.banner) {
    await deleteImage(existing.bannerUrl);
    bannerUrl = await uploadImage(input.banner.buffer, input.banner.mimeType, 'collections');
  }

  return prisma.collection.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.bannerAlt !== undefined && { bannerAlt: input.bannerAlt }),
      ...(input.order !== undefined && { order: input.order }),
      ...(input.active !== undefined && { active: input.active }),
      bannerUrl,
    },
  });
}

export async function deactivateCollection(id: string) {
  return prisma.collection.update({
    where: { id },
    data: { active: false },
  });
}
