import { z } from "zod";

export const createDocumentSchema = z.object({
  collectionId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["Contract", "Report", "Certificate", "Invoice", "Dataset", "Other"]),
  fileType: z.enum(["pdf", "image", "docx"]),
  ownerWallet: z.string().min(1),
});
