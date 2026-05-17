import { prisma } from '../config/database.js';

interface PageViewInput {
  page: string;
  referrer?: string;
  deviceType: string;
}

interface ProductClickInput {
  shirtId: string;
  actionType: string;
}

export async function recordPageView(input: PageViewInput): Promise<void> {
  await prisma.pageViewEvent.create({
    data: {
      page: input.page,
      referrer: input.referrer ?? null,
      deviceType: input.deviceType,
    },
  });
}

export async function recordProductClick(input: ProductClickInput): Promise<void> {
  await prisma.productClickEvent.create({
    data: {
      shirtId: input.shirtId,
      actionType: input.actionType,
    },
  });
}
