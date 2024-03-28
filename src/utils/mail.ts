const postmark = require("postmark");
import { Mail } from "../types/api";
const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY as string;
const client = new postmark.ServerClient(POSTMARK_API_KEY);

export async function sendMail(mail: Mail) {
  await client.sendEmail({
    From: "abundance.anyanwu@stu.cu.edu.ng",
    To: mail.to,
    Subject: mail.subject,
    TextBody: mail.body,
    MessageStream: "outbound",
  });
}
