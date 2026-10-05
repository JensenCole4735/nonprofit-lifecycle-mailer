import { sendLifecycleMail } from "./lifecycle.js";

const to = process.env.DEMO_EMAIL_TO;
if (!to) throw new Error("DEMO_EMAIL_TO is required");
const result = await sendLifecycleMail({ kind: "donor_receipt", to, name: "Amina", amount: 500 });
console.log(`sent donor receipt: ${result.message_id}`);
