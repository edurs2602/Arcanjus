import { prisma } from '../config/database.js';
import { uploadImage, deleteImage } from './storageService.js';

interface CreateShirtInput {
  name: string;
  description: string;
  price: number;
  sizes: string[];
  color: string;
  category: string;
  images: Array<{ buffer: Buffer; mimeType: string; alt: string }>;
}

interface UpdateShirtInput {
  name?: string;
  description?: string;
  price?: number;
  sizes?: string[];
  color?: string;
  category?: string;
  active?: boolean;
}

export async function listAllShirts(params: {
  active?: boolean;
  page?: number;
  limit?: number;
}) {
  const { active, page = 1, limit = 20 } = params;
  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;

  const where = active !== undefined ? { active } : {};

  const [shirts, total] = await Promise.all([
    prisma.shirt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { clicks: true } },
      },
    }),
    prisma.shirt.count({ where }),
  ]);

  return {
    shirts: shirts.map((shirt) => ({
      id: shirt.id,
      name: shirt.name,
      price: Number(shirt.price),
      color: shirt.color,
      category: shirt.category,
      sizes: shirt.sizes,
      active: shirt.active,
      clickCount: shirt._count.clicks,
      primaryImage: shirt.images[0] ? { url: shirt.images[0].url, alt: shirt.images[0].alt } : null,
      createdAt: shirt.createdAt.toISOString(),
    })),
    pagination: { page, limit: take, total, totalPages: Math.ceil(total / take) },
  };
}

export async function createShirt(input: CreateShirtInput) {
  const imageUrls = await Promise.all(
    input.images.map(async (img, i) => {
      const url = await uploadImage(img.buffer, img.mimeType);
      return { url, alt: img.alt, sortOrder: i, isPrimary: i === 0 };
    }),
  );

  const shirt = await prisma.shirt.create({
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      sizes: input.sizes,
      color: input.color,
      category: input.category,
      images: { create: imageUrls },
    },
    include: { images: true },
  });

  return shirt;
}

export async function updateShirt(id: string, input: UpdateShirtInput) {
  const shirt = await prisma.shirt.update({
    where: { id },
    data: input,
    include: { images: true },
  });

  return shirt;
}

export async function deactivateShirt(id: string) {
  await prisma.shirt.update({
    where: { id },
    data: { active: false },
  });
}
