import { prisma } from '../config/database.js';

export async function getStoreInfo() {
  const info = await prisma.storeInfo.findFirst();
  if (!info) return null;

  return {
    name: info.name,
    address: info.address,
    city: info.city,
    state: info.state,
    zipCode: info.zipCode,
    phone: info.phone,
    latitude: Number(info.latitude),
    longitude: Number(info.longitude),
    hours: info.hoursJson,
    aboutTitle: info.aboutTitle,
    aboutContent: info.aboutContent,
  };
}

export async function updateStoreInfo(data: Partial<{
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  latitude: number;
  longitude: number;
  hoursJson: Record<string, unknown>;
  aboutTitle: string;
  aboutContent: string;
}>) {
  const existing = await prisma.storeInfo.findFirst();
  if (!existing) return null;

  const updated = await prisma.storeInfo.update({
    where: { id: existing.id },
    data,
  });

  return {
    name: updated.name,
    address: updated.address,
    city: updated.city,
    state: updated.state,
    zipCode: updated.zipCode,
    phone: updated.phone,
    latitude: Number(updated.latitude),
    longitude: Number(updated.longitude),
    hours: updated.hoursJson,
    aboutTitle: updated.aboutTitle,
    aboutContent: updated.aboutContent,
  };
}
