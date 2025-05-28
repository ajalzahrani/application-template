"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EmployeeFormValues, employeeSchema } from "./employees.validation";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

/**
 * Get all employees
 */
export async function getEmployees() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        firstName: "asc",
      },
      include: {
        nationality: true,
        jobTitle: true,
      },
    });
    return { success: true, employees };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { success: false, error: "Error fetching employees" };
  }
}

/**
 * Get employee by ID
 */
export async function getEmployeeById(employeeId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        nationality: true,
        jobTitle: true,
        unit: true,
        rank: true,
        sponsor: true,
      },
    });
    return { success: true, employee };
  } catch (error) {
    console.error("Error fetching employee:", error);
    return { success: false, error: "Error fetching employee" };
  }
}

export async function generateEmployeeNo() {
  const lastEmployee = await prisma.employee.findFirst({
    orderBy: { employeeNo: "desc" },
  });

  if (!lastEmployee) {
    return "000001";
  }

  const lastEmployeeNo = lastEmployee.employeeNo;
  const lastEmployeeNoInt = parseInt(lastEmployeeNo);
  const newEmployeeNo = (lastEmployeeNoInt + 1).toString().padStart(6, "0");
  return newEmployeeNo;
}

/**
 * Upload a file to the server
 */
export async function uploadFile(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create the images directory if it doesn't exist
  const imagesDir = "repo/images";
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Generate a unique filename
  const uniqueFilename = `${Date.now()}-${file.name}`;
  const filePath = `${imagesDir}/${uniqueFilename}`;

  // Write the file
  fs.writeFileSync(filePath, buffer);

  // Return the API route path for the image
  return `/api/images/${uniqueFilename}`;
}

/**
 * Create a new employee
 */
export async function createEmployee(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Extract form fields
  const employeeData = {
    firstName: formData.get("firstName") as string,
    secondName: formData.get("secondName") as string,
    thirdName: formData.get("thirdName") as string,
    lastName: formData.get("lastName") as string,
    dob: formData.get("dob")
      ? new Date(formData.get("dob") as string)
      : undefined,
    gender: formData.get("gender") as string,
    citizenship: formData.get("citizenship") as string,
    noriqama: formData.get("noriqama") as string,
    mrn: formData.get("mrn") as string,
    employeeNo: formData.get("employeeNo") as string,
    jobTitleId: formData.get("jobTitleId") as string,
    nationalityId: formData.get("nationalityId") as string,
    unitId: formData.get("unitId") as string,
    rankId: formData.get("rankId") as string,
    sponsorId: formData.get("sponsorId") as string,
    cardExpiryAt: formData.get("cardExpiryAt")
      ? new Date(formData.get("cardExpiryAt") as string)
      : undefined,
    isActive: true,
  };

  const validatedFields = employeeSchema.safeParse(employeeData);

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error);
    return { success: false, error: "Invalid fields" };
  }

  try {
    // Get the file from the form
    const file = formData.get("file") as File;
    let pictureLink: string | undefined;

    if (file) {
      pictureLink = await uploadFile(file);
    }

    const newEmployee = await prisma.employee.create({
      data: {
        firstName: employeeData.firstName,
        secondName: employeeData.secondName,
        thirdName: employeeData.thirdName,
        lastName: employeeData.lastName,
        gender: employeeData.gender,
        dob: employeeData.dob || null,
        citizenship: employeeData.citizenship,
        noriqama: employeeData.noriqama,
        mrn: employeeData.mrn,
        employeeNo: await generateEmployeeNo(),
        nationality: {
          connect: { id: employeeData.nationalityId },
        },
        unit: employeeData.unitId
          ? {
              connect: { id: employeeData.unitId },
            }
          : undefined,
        rank: employeeData.rankId
          ? {
              connect: { id: employeeData.rankId },
            }
          : undefined,
        jobTitle: employeeData.jobTitleId
          ? {
              connect: { id: employeeData.jobTitleId },
            }
          : undefined,
        sponsor: employeeData.sponsorId
          ? {
              connect: { id: employeeData.sponsorId },
            }
          : undefined,
        pictureLink: pictureLink || null,
        cardExpiryAt: employeeData.cardExpiryAt || new Date(),
        isActive: employeeData.isActive,
      },
    });

    revalidatePath("/employees");
    return { success: true, employee: newEmployee };
  } catch (error) {
    console.error("Error creating employee:", error);
    return { success: false, error: "Error creating employee", details: error };
  }
}

/**
 * Update a employee
 */
export async function updateEmployee(employeeId: string, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Extract form fields
  const employeeData = {
    firstName: formData.get("firstName") as string,
    secondName: formData.get("secondName") as string,
    thirdName: formData.get("thirdName") as string,
    lastName: formData.get("lastName") as string,
    dob: formData.get("dob")
      ? new Date(formData.get("dob") as string)
      : undefined,
    gender: formData.get("gender") as string,
    citizenship: formData.get("citizenship") as string,
    noriqama: formData.get("noriqama") as string,
    mrn: formData.get("mrn") as string,
    employeeNo: formData.get("employeeNo") as string,
    jobTitleId: formData.get("jobTitleId") as string,
    nationalityId: formData.get("nationalityId") as string,
    unitId: formData.get("unitId") as string,
    rankId: formData.get("rankId") as string,
    sponsorId: formData.get("sponsorId") as string,
    cardExpiryAt: formData.get("cardExpiryAt")
      ? new Date(formData.get("cardExpiryAt") as string)
      : undefined,
    isActive: true,
  };

  const validatedFields = employeeSchema.safeParse(employeeData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid fields",
      details: validatedFields.error,
    };
  }

  try {
    // Get the current employee to check for existing picture
    const currentEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!currentEmployee) {
      return { success: false, error: "Employee not found" };
    }

    const file = formData.get("file") as File;
    let pictureLink = currentEmployee.pictureLink;

    if (file) {
      // Delete old picture if it exists
      if (currentEmployee.pictureLink) {
        const oldPicturePath = path.join(
          process.cwd(),
          "repo/images",
          path.basename(currentEmployee.pictureLink)
        );
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }

      // Upload new picture
      pictureLink = await uploadFile(file);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...validatedFields.data,
        pictureLink,
      },
    });

    revalidatePath("/employees");
    return { success: true, employee: updatedEmployee };
  } catch (error) {
    console.error("Error updating employee:", error);
    return { success: false, error: "Error updating employee" };
  }
}

/**
 * Deactivate a employee
 */
export async function deactivateEmployee(employeeId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: { isActive: false },
    });

    revalidatePath("/employees");

    return { success: true, employee: updatedEmployee };
  } catch (error) {
    console.error("Error deactivating employee:", error);
    return { success: false, error: "Error deactivating employee" };
  }
}
