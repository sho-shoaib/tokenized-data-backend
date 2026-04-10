import { z } from "zod";

export const grantAccessSchema = z.object({
  viewerId: z.string().uuid(),
});

export const signDocumentSchema = z.object({
  signatureHash: z.string().min(1),
});
