import { z } from "zod";

const itemSchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
});
type ItemFormValues = z.infer<typeof itemSchema>;

export { itemSchema, type ItemFormValues };
