import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // --- Users & Roles ---
  const password = await bcrypt.hash('password123', 10);

  // 1. Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodfest.com' },
    update: {},
    create: {
      email: 'admin@foodfest.com',
      name: 'Admin User',
      password,
      telephone: '0600000001',
      role: 'ADMIN',
    },
  });
  console.log('👤 Admin created:', admin.email);

  // 2. Staff (Replacing Chef)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@foodfest.com' },
    update: {},
    create: {
      email: 'staff@foodfest.com',
      name: 'Staff Member',
      password,
      telephone: '0600000002',
      role: 'STAFF',
    },
  });
  console.log('👤 Staff created:', staff.email);

  // 3. Normal User
  const user = await prisma.user.upsert({
    where: { email: 'user@foodfest.com' },
    update: {},
    create: {
      email: 'user@foodfest.com',
      name: 'Hungry User',
      password,
      telephone: '0600000003',
      role: 'USER',

    },
  });
  console.log('👤 User created:', user.email);

  // --- Dishes ---
  // Assigning dishes to the Admin since Chef role is gone
  const dishesData = [
    {
      name: 'Burger Signature',
      description: 'Un burger juteux avec du bœuf wagyu, confit d\'oignons, et fromage raclette.',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
      price: 5000,
      userId: admin.id,
    },
    {
      name: 'Pizza Truffe',
      description: 'Pizza à la crème de truffe, champignons sauvages et mozzarella di bufala.',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
      price: 7500,
      userId: admin.id,
    },
    {
      name: 'Sushi Deluxe Box',
      description: 'Assortiment de 24 pièces : nigiri, maki, sashimi et california rolls.',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop',
      price: 15000,
      userId: admin.id,
    },
    {
      name: 'Poké Bowl Saumon',
      description: 'Riz vinaigré, saumon mariné, avocat, mangue, edamame et graines de sésame.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
      price: 4500,
      userId: admin.id,
    },
    {
       name: 'Tacos Al Pastor',
       description: 'Trois tacos avec porc mariné, ananas rôti, coriandre et oignons.',
       imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1000&auto=format&fit=crop',
       price: 3500,
       userId: admin.id,
    }
  ];

  for (const dishData of dishesData) {
     const existing = await prisma.dish.findFirst({ where: { name: dishData.name }});
     if (existing) {
        await prisma.dish.update({
           where: { id: existing.id },
           data: {
              price: dishData.price,
              description: dishData.description,
              imageUrl: dishData.imageUrl
           }
        });
     } else {
        await prisma.dish.create({ data: dishData });
     }
  }
  console.log(`🍽️  ${dishesData.length} Dishes processed.`);



  // --- Orders ---
  const existingOrder = await prisma.order.findFirst({ where: { userId: user.id } });
  if (!existingOrder) {
      const dish = await prisma.dish.findFirst();
      if (dish) {
         await prisma.order.create({
            data: {
               userId: user.id,
               secretCode: Math.random().toString(36).substring(7).toUpperCase(),
               total: dish.price * 2,
               seats: 2,
               status: 'COMPLETED',
               items: {
                  create: [
                     {
                        dishId: dish.id,
                        quantity: 2,
                        price: dish.price
                     }
                  ]
               }
            }
         });
         console.log('📦 Sample Order created for User.');
      }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
