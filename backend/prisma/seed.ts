import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 12);
  await prisma.adminUser.upsert({
    where: { email: 'admin@arcanjus.com' },
    update: {},
    create: {
      email: 'admin@arcanjus.com',
      name: 'Admin Arcanjus',
      passwordHash,
    },
  });

  // Create store info
  const storeExists = await prisma.storeInfo.findFirst();
  if (!storeExists) {
    await prisma.storeInfo.create({
      data: {
        name: 'Arcanjus',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        phone: '(11) 99999-0000',
        latitude: -23.5505,
        longitude: -46.6333,
        hoursJson: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '09:00', close: '13:00' },
          sunday: null,
        },
        aboutTitle: 'Sobre a Arcanjus',
        aboutContent:
          'A Arcanjus nasceu da paixão por camisas de qualidade. Nossa missão é oferecer peças que combinam estilo, conforto e durabilidade, para que você se sinta confiante em todas as ocasiões.',
      },
    });
  }

  // Create sample shirts
  const shirtCount = await prisma.shirt.count();
  if (shirtCount === 0) {
    const shirts = [
      {
        name: 'Camisa Polo Clássica',
        description: 'Camisa polo em algodão premium, perfeita para o dia a dia.',
        price: 129.9,
        sizes: ['P', 'M', 'G', 'GG'],
        color: 'azul',
        category: 'polo',
      },
      {
        name: 'Camisa Social Slim',
        description: 'Camisa social com corte slim fit, ideal para ocasiões formais.',
        price: 189.9,
        sizes: ['P', 'M', 'G'],
        color: 'branco',
        category: 'social',
      },
      {
        name: 'Camisa Casual Listrada',
        description: 'Camisa casual com listras finas, versátil para qualquer situação.',
        price: 149.9,
        sizes: ['M', 'G', 'GG'],
        color: 'azul',
        category: 'casual',
      },
    ];

    for (const shirt of shirts) {
      await prisma.shirt.create({
        data: {
          ...shirt,
          price: shirt.price,
          images: {
            create: {
              url: '/placeholder-shirt.png',
              alt: `${shirt.name} - imagem principal`,
              isPrimary: true,
              sortOrder: 0,
            },
          },
        },
      });
    }
  }

  console.log('✓ Database seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
