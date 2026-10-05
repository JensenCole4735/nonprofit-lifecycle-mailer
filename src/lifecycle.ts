import { z } from "zod";
import { infrai } from "./infrai.js";

export const lifecycleRequest = z.object({
  kind: z.enum(["donor_receipt", "volunteer_reminder", "campaign_report"]),
  to: z.string().email(),
  name: z.string().min(1),
  amount: z.number().positive().optional(),
  campaign: z.string().min(1).optional(),
});
export type LifecycleRequest = z.infer<typeof lifecycleRequest>;

const templates = {
  donor_receipt: { subject: "Donation receipt", html: (r: LifecycleRequest) => `<p>Thank you, ${r.name}. Your receipt is ready.</p>` },
  volunteer_reminder: { subject: "Volunteer shift reminder", html: (r: LifecycleRequest) => `<p>Hello ${r.name}, this is a reminder for your upcoming volunteer shift.</p>` },
  campaign_report: { subject: "Campaign report", html: (r: LifecycleRequest) => `<p>${r.name}, the ${r.campaign ?? "campaign"} report is ready.</p>` },
} as const;

export async function sendLifecycleMail(input: unknown) {
  const request = lifecycleRequest.parse(input);
  const template = templates[request.kind];
  return infrai.email.send({ to: request.to, subject: template.subject, html: template.html(request) });
}
