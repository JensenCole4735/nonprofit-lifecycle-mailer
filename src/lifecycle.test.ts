import { lifecycleRequest } from "./lifecycle.js";

const valid = lifecycleRequest.parse({ kind: "volunteer_reminder", to: "volunteer@example.org", name: "Lee" });
if (valid.kind !== "volunteer_reminder") throw new Error("kind was not preserved");
let rejected = false;
try { lifecycleRequest.parse({ kind: "donor_receipt", to: "bad", name: "Lee" }); } catch { rejected = true; }
if (!rejected) throw new Error("invalid recipient should be rejected");
console.log("lifecycle request boundary: ok");
