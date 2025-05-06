import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const hashedPassword = await bcrypt.hash("adminpassword", 10);

async function main() {
  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Full system access",
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: "EMPLOYEE" },
    update: {},
    create: {
      name: "EMPLOYEE",
      description: "Basic access to report incidents and view own reports",
    },
  });

  // Create sample departments
  const itDepartment = await prisma.department.upsert({
    where: { name: "Information Technology" },
    update: {
      name: "Information Technology",
    },
    create: {
      name: "Information Technology",
    },
  });

  const hrDepartment = await prisma.department.upsert({
    where: { name: "Human Resources" },
    update: {
      name: "Human Resources",
    },
    create: {
      name: "Human Resources",
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      email: "admin@example.com",
      name: "Admin User",
      username: "admin",
      password: hashedPassword,
      roleId: adminRole.id,
    },
    create: {
      email: "admin@example.com",
      name: "Admin User",
      username: "admin",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  const hrUser = await prisma.user.upsert({
    where: { email: "hr@ova.com" },
    update: {
      email: "hr@ova.com",
      name: "HR User",
      username: "hr",
      password: hashedPassword,
      roleId: employeeRole.id,
      departmentId: hrDepartment.id,
    },
    create: {
      email: "hr@ova.com",
      name: "HR User",
      username: "hr",
      password: hashedPassword,
      roleId: employeeRole.id,
      departmentId: hrDepartment.id,
    },
  });

  const permissions = [
    // Admin permissions
    {
      code: "admin:all",
      name: "Manage All",
      description: "Ability to view all pages",
    },
    {
      code: "manage:management",
      name: "Manage System",
      description: "Ability to view management and users pages",
    },
    {
      code: "manage:users",
      name: "Manage users",
      description: "Ability to view users pages",
    },
    {
      code: "manage:roles",
      name: "Manage roles",
      description: "Ability to view roles pages",
    },
    {
      code: "manage:departments",
      name: "Manage Departments",
      description: "Ability to view departments pages",
    },
    {
      code: "manage:permissions",
      name: "Manage Permissions",
      description: "Ability to view permissions pages",
    },
    // HR Employee permissions
    {
      code: "manage:employees",
      name: "Manage Employees",
      description: "Ability to view employees pages",
    },
    {
      code: "manage:reports",
      name: "Manage Reports",
      description: "Ability to view reports pages",
    },
    {
      code: "manage:dashboards",
      name: "Manage Dashboards",
      description: "Ability to view dashboards pages",
    },
  ];

  console.log("Creating permissions...");
  const createdPermissions = [];

  for (const perm of permissions) {
    const permission = await prisma.permission.upsert({
      where: { code: perm.code },
      update: perm,
      create: perm,
    });
    createdPermissions.push(permission);
  }

  const rolePermissions = {
    ADMIN: ["admin:all"],
    EMPLOYEE: ["manage:employees", "manage:reports"],
  };

  console.log("Assigning permissions to roles...");

  // Clear existing role-permission associations first to avoid duplicates
  await prisma.rolePermission.deleteMany({});

  // Create role-permission associations
  for (const [roleName, permCodes] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      console.log(`Role ${roleName} not found, skipping permission assignment`);
      continue;
    }

    for (const permCode of permCodes) {
      const permission = await prisma.permission.findUnique({
        where: { code: permCode },
      });

      if (!permission) {
        console.log(`Permission ${permCode} not found, skipping`);
        continue;
      }

      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log("Permissions assigned successfully");

  console.log("Seeding completed successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
