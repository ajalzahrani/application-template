import { z } from "zod";

// Permission schema for validation
export const employeeSchema = z.object({
  id: z.string().optional(),
  employeeNo: z
    .string()
    .min(6, "Employee number must be at least 6 characters"),
  firstName: z.string().min(2, "First name is required"),
  secondName: z.string().optional(),
  thirdName: z.string().optional().nullable(),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["Male", "Female"], {
    required_error: "Gender is required",
  }),
  dob: z.date().refine((date) => date !== null, {
    message: "Date of birth is required",
  }),
  citizenship: z.enum(["Civilian", "Foreigner", "Other"], {
    required_error: "Citizenship is required",
  }),
  noriqama: z.string().min(1, "National/Iqama number is required"),
  mrn: z.string().optional().nullable(),
  nationalityId: z.string().min(1, "Nationality is required"),
  unitId: z.string().optional().nullable(),
  rankId: z.string().optional().nullable(),
  jobTitleId: z.string().optional().nullable(),
  sponsorId: z.string().optional().nullable(),
  pictureLink: z.string().optional(),
  cardExpiryAt: z.date({
    required_error: "Card expiry date is required",
  }),
  lastRenewalAt: z.date().optional(),
  isActive: z.boolean(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
