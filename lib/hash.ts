import { createHash } from "node:crypto";

/**
 * One-way hash of the submitter's IP, used only for spam triage.
 * We never store raw IPs.
 */
export function hashIp(ip: string | null | undefined): string | undefined {
  if (!ip) return undefined;
  const salt = process.env.IP_HASH_SALT || "hokkaidao-v1";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
