import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { Agent } from "undici";
import { httpUrl } from "../../src/data/event-schema";
export function publicAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const [a,b,c] = address.split(".").map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || (b === 0 && [0,2].includes(c)))) || (a === 100 && b >= 64 && b <= 127) || (a === 198 && ([18,19].includes(b) || (b === 51 && c === 100))) || (a === 203 && b === 0 && c === 113));
  }
  // Permit global unicast only; mapped/private/link-local/loopback addresses fail closed.
  return isIP(address) === 6 && /^[23][0-9a-f]{3}:/i.test(address) && !/^2001:(?:db8|0):/i.test(address);
}
async function publicUrl(value: string) {
  httpUrl.parse(value);
  const parsed = new URL(value), host = parsed.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) throw new Error("Use a public event URL.");
  const addresses = isIP(host) ? [{ address: host, family: isIP(host) }] : await Promise.race([
    lookup(host, { all: true }),
    delay(10000, undefined, { ref: false }).then(() => { throw new Error("Event hostname lookup timed out."); }),
  ]);
  if (!addresses.length || addresses.some(item => !publicAddress(item.address))) throw new Error("Private or local network URLs are not supported.");
  return { parsed, addresses };
}
export async function fetchPublic(value: string, maxBytes = 2_000_000): Promise<{ bytes: Buffer; url: string; contentType: string }> {
  let current = value;
  const signal = AbortSignal.timeout(15000);
  for (let redirects = 0; redirects <= 4; redirects++) {
    const { parsed: target, addresses } = await publicUrl(current);
    const dispatcher = new Agent({ connect: { lookup: (_hostname, options, callback) => {
      if (options.all) callback(null, addresses);
      else callback(null, addresses[0].address, addresses[0].family);
    } } });
    try {
    const options = { dispatcher, redirect: "manual" as const, signal, headers: { "User-Agent": "KrowdKraft-Event-Organizer/1.0", Accept: "text/html,image/*;q=0.8,*/*;q=0.1" } };
    const response = await fetch(target, options);
    if ([301,302,303,307,308].includes(response.status)) {
      const location = response.headers.get("location"); await response.body?.cancel();
      if (!location) throw new Error("The event page redirected without a destination.");
      current = new URL(location, target).href; continue;
    }
    if (!response.ok) { await response.body?.cancel(); throw new Error(`The page returned HTTP ${response.status}.`); }
    if (Number(response.headers.get("content-length")) > maxBytes) { await response.body?.cancel(); throw new Error("The download exceeds the size limit."); }
    const chunks: Uint8Array[] = []; let size = 0;
    if (!response.body) throw new Error("The page returned no content.");
    const reader = response.body.getReader();
    try {
      for (;;) { const { done, value: chunk } = await reader.read(); if (done) break; size += chunk.length; if (size > maxBytes) throw new Error("The download exceeds the size limit."); chunks.push(chunk); }
    } finally { await reader.cancel(); reader.releaseLock(); }
    return { bytes: Buffer.concat(chunks), url: target.href, contentType: response.headers.get("content-type") || "" };
    } finally { await dispatcher.close(); }
  }
  throw new Error("The event URL redirected too many times.");
}
