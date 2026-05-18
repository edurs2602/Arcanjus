import { prisma } from '../config/database.js';

interface ListShirtsParams {
  category?: string;
  color?: string;
  size?: string;
  collection?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

export async function listShirts(params: ListShirtsParams) {
  const { category, color, size, collection, sort = 'newest', page = 1, limit = 20 } = params;
  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;

  const where = {
    active: true,
    ...(category && { category }),
    ...(color && { color }),
    ...(size && { sizes: { has: size } }),
    ...(collection && { collectionId: collection }),
  };

  const orderBy = {
    price_asc: { price: 'asc' as const },
    price_desc: { price: 'desc' as const },
    newest: { createdAt: 'desc' as const },
  }[sort];

  const [shirts, total] = await Promise.all([
    prisma.shirt.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
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
      primaryImage: shirt.images[0]
        ? { url: shirt.images[0].url, alt: shirt.images[0].alt }
        : null,
    })),
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

export async function getShirtById(id: string) {
  const shirt = await prisma.shirt.findFirst({
    where: { id, active: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!shirt) return null;

  return {
    id: shirt.id,
    name: shirt.name,
    description: shirt.description,
    price: Number(shirt.price),
    color: shirt.color,
    category: shirt.category,
    sizes: shirt.sizes,
    collectionId: shirt.collectionId,
    images: shirt.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
      isAiGenerated: img.isAiGenerated,
    })),
    createdAt: shirt.createdAt.toISOString(),
  };
}

export async function getShirtFilters() {
  const shirts = await prisma.shirt.findMany({
    where: { active: true },
    select: { category: true, color: true, sizes: true },
  });

  const categories = [...new Set(shirts.map((s) => s.category))].sort();
  const colors = [...new Set(shirts.map((s) => s.color))].sort();
  const sizes = [...new Set(shirts.flatMap((s) => s.sizes))].sort();

  return { categories, colors, sizes };
}
