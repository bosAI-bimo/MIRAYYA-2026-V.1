import { db } from "./src/db";
import { users, roles } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const allRoles = await db.select().from(roles);
  console.log("Roles:", allRoles);

  const allUsers = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    roleId: users.roleId,
    roleName: roles.name
  }).from(users).leftJoin(roles, eq(users.roleId, roles.id));
  
  console.log("Users:", allUsers);
  process.exit(0);
}

main().catch(console.error);
