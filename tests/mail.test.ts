import test from "node:test";
import assert from "node:assert/strict";
import { collaborationSchema, joinSchema } from "../src/lib/form-schema";
import { mailConfiguration } from "../src/server/mail/config";
import { collaborationMessage, joinMessage } from "../src/server/mail/message";
import { sendResend } from "../src/server/mail/resend";
import { unconfigured } from "../src/server/mail/unconfigured";
import { clientKey, createRateLimiter } from "../src/server/rate-limit";

const proposal = { represents: "Community", organization: "Test community", name: "Test person", email: "person@example.com", website: "", planning: "Meetup", proposedDate: "", location: "", audience: "", idea: "A hands-on developer meetup about accessible web development.", involvement: "Help us bring developers together.", fax: "" };
test("mail validates required fields, limits, honeypot, URLs and real dates", () => {
  assert.equal(collaborationSchema.safeParse(proposal).success, true);
  for (const fields of [{ email: "a@example.com\r\nBcc:evil@example.com" }, { website: "javascript:alert(1)" }, { proposedDate: "2026-02-30" }, { idea: "x".repeat(4001) }, { fax: "bot" }, { to: "evil@example.com" }]) assert.equal(collaborationSchema.safeParse({ ...proposal, ...fields }).success, false);
  assert.equal(joinSchema.safeParse({ email: "person@example.com" }).success, true);
  assert.equal(joinSchema.safeParse({ email: "invalid" }).success, false);
});
test("configuration fails closed and gives Resend precedence", async () => {
  assert.deepEqual(await unconfigured(), { delivered: false, reason: "mail_not_configured" });
  assert.equal(mailConfiguration({ RESEND_API_KEY: "test" }).adapter, "unconfigured");
  assert.equal(mailConfiguration({ MAIL_FROM: "hello@example.com", SMTP_URL: "https://example.com" }).adapter, "unconfigured");
  const config = mailConfiguration({ MAIL_FROM: "hello@example.com", RESEND_API_KEY: "test", SMTP_URL: "smtp://localhost" });
  assert.equal(config.adapter, "resend");
  if (config.adapter === "resend") { assert.equal(config.ignoredSmtp, true); assert.equal(config.to, "krowdkraft.official@gmail.com"); }
});
test("messages escape markup and distinguish interest from enrollment", () => {
  const message = collaborationMessage(collaborationSchema.parse({ ...proposal, name: '<img src=x onerror="alert(1)">' }));
  assert.ok(message.html.includes("&lt;img")); assert.ok(!message.html.includes("<img"));
  assert.equal(message.replyTo, proposal.email); assert.equal(message.subject, "KrowdKraft collaboration request");
  assert.match(joinMessage(proposal.email).subject, /join-interest note \(not list enrollment\)/);
});
test("Resend success requires provider acceptance and never leaks recipient control", async () => {
  const config = { from: "hello@example.com", to: "team@example.com", key: "test" };
  const message = joinMessage(proposal.email);
  const accept: typeof fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(body.to, [config.to]); assert.equal(body.from, config.from); assert.equal(body.reply_to, proposal.email);
    return Response.json({ id: "test-provider-id" });
  };
  assert.deepEqual(await sendResend(message, config, accept), { delivered: true });
  for (const response of [Response.json({ error: "rejected" }, { status: 422 }), Response.json({}), new Response("unavailable", { status: 503 })]) {
    assert.deepEqual(await sendResend(message, config, async () => response), { delivered: false, reason: "provider_error" });
  }
  assert.deepEqual(await sendResend(message, config, async () => { throw new Error("network"); }), { delivered: false, reason: "provider_error" });
});
test("rate limits expire, bound memory, and distrust forwarded headers by default", () => {
  const limit = createRateLimiter(2, 100, 2);
  assert.equal(limit("a", 0), true); assert.equal(limit("a", 1), true); assert.equal(limit("a", 2), false);
  assert.equal(limit("b", 3), true); assert.equal(limit("c", 4), false); assert.equal(limit("a", 100), true);
  const first = new Headers({ "x-forwarded-for": "203.0.113.1" });
  const second = new Headers({ "x-forwarded-for": "203.0.113.2" });
  assert.equal(clientKey(first), clientKey(second)); assert.notEqual(clientKey(first, true), clientKey(second, true));
  assert.equal(clientKey(new Headers({ "x-forwarded-for": "invalid" }), true), clientKey(first));
});
