"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      role: {
        select: { id: true, name: true },
      },
      department: {
        select: { id: true },
      },
    },
  });

  if (!user || !user.password) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return null;
  }

  const permissions = await prisma.permission.findMany({
    where: { roles: { some: { roleId: user.role.id } } },
  });

  if (!permissions) {
    return null;
  }

  console.log("user", {
    ...user,
    permissions: permissions.map((p) => p.code),
  });

  return {
    ...user,
    permissions: permissions.map((p) => p.code),
  };
}
