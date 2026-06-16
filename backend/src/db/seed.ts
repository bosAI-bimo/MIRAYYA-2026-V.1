import { db } from './index';
import { roles, branches } from './schema';

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Roles sesuai PRD
  const defaultRoles = [
    { name: 'owner' },
    { name: 'hr' },
    { name: 'accounting' },
    { name: 'store_leader' },
    { name: 'ba' }
  ];
  
  await db.insert(roles).values(defaultRoles).onConflictDoNothing();
  console.log('✅ Roles seeded.');

  // 2. Seed Cabang Utama Dummy
  await db.insert(branches).values({
    name: 'Mirraya Head Office',
    address: 'Jl. Utama No. 1, Jakarta',
    phone: '0211234567'
  }).onConflictDoNothing();
  console.log('✅ Initial branch seeded.');

  console.log('🌲 Seeding completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
