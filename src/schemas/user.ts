import { z } from "zod";

export const sendMailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
});
