import { createHash } from "node:crypto";
import { isIP } from "node:net";
type Entry = { count: number; expires: number };
export function clientKey(headers: Pick<Headers, "get">, trustProxy = false): string {
  const value = trustProxy ? headers.get("x-forwarded-for")?.split(",")[0].trim() : undefined;
  return createHash("sha256").update(value && isIP(value) ? value : "shared-untrusted-origin").digest("hex");
}
export function createRateLimiter(limit = 5, windowMs = 3600000, capacity = 2000) {
  const entries = new Map<string, Entry>();
  return (key: string, now = Date.now()): boolean => {
    for (const [id, entry] of entries) if (entry.expires <= now) entries.delete(id);
    const existing = entries.get(key);
    if (existing) { if (existing.count >= limit) return false; existing.count++; return true; }
    if (entries.size >= capacity) return false;
    entries.set(key, { count: 1, expires: now + windowMs }); return true;
  };
}
export const allowSubmission = createRateLimiter();
export const allowGlobalSubmission = createRateLimiter(100);
