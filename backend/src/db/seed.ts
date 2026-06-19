import { db } from './index';
import { roles, branches, users } from './schema';
import { auth } from '../auth';
import { eq } from 'drizzle-orm';

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

  // Ambil data roles untuk referensi ID
  const rolesData = await db.select().from(roles);
  const getRoleId = (name: string) => rolesData.find(r => r.name === name)?.id;

  // 2. Seed 6 Cabang
  const branchList = [
    { name: 'Sokaraja', address: 'Jl. Sokaraja', phone: '0811111111' },
    { name: 'Wonosobo', address: 'Jl. Wonosobo', phone: '0822222222' },
    { name: 'Mandiraja', address: 'Jl. Mandiraja', phone: '0833333333' },
    { name: 'Wanadadi', address: 'Jl. Wanadadi', phone: '0844444444' },
    { name: 'Banjarnegara Kota', address: 'Jl. Banjarnegara', phone: '0855555555' },
    { name: 'Sokanandi', address: 'Jl. Sokanandi', phone: '0866666666' }
  ];

  await db.insert(branches).values(branchList).onConflictDoNothing();
  console.log('✅ 6 Branches seeded.');

  // Ambil data cabang untuk referensi ID
  const branchesData = await db.select().from(branches);
  const getBranchId = (name: string) => branchesData.find(b => b.name === name)?.id;

  // 3. Seed Users
  const demoUsers = [
    { email: 'owner@mirayya.com', name: 'Super Owner', password: 'Password123', role: 'owner', branch: null },
    { email: 'hr@mirayya.com', name: 'HR Manager', password: 'Password123', role: 'hr', branch: null },
    { email: 'acc@mirayya.com', name: 'Head Accounting', password: 'Password123', role: 'accounting', branch: null },
    { email: 'store@mirayya.com', name: 'Kepala Toko Sokaraja', password: 'Password123', role: 'store_leader', branch: 'Sokaraja' },
    { email: 'ba@mirayya.com', name: 'BA Sokanandi', password: 'Password123', role: 'ba', branch: 'Sokanandi' },
  ];

  for (const u of demoUsers) {
    const exists = await db.select().from(users).where(eq(users.email, u.email));
    if (exists.length === 0) {
      try {
        const newUser = await auth.api.signUpEmail({
          body: { email: u.email, password: u.password, name: u.name }
        });
        
        if (newUser && newUser.user) {
          await db.update(users)
            .set({ 
              roleId: getRoleId(u.role)!, 
              branchId: u.branch ? getBranchId(u.branch) : null 
            })
            .where(eq(users.id, newUser.user.id));
          console.log(`✅ User seeded: ${u.email}`);
        }
      } catch (err) {
        console.error(`Failed to seed user ${u.email}:`, err);
      }
    } else {
      console.log(`ℹ️ User already exists: ${u.email}`);
    }
  }

  console.log('🌲 Seeding completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
