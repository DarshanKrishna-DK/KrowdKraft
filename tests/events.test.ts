import assert from "node:assert/strict";
import test from "node:test";
import { eventsSchema, eventSchema } from "../src/data/event-schema";
import { isUpcoming, kolkataToday } from "../src/data/events";

export const example = {
  id: "test-only",
  slug: "test-only",
  title: "Test fixture, never published",
  description: "A temporary fixture.",
  date: "2026-10-13",
  endDate: null,
  venue: "Test venue",
  city: "Bengaluru",
  type: "meetup",
  relationship: "hosted",
  image: null,
  sourceUrl: null,
  registrationUrl: null,
  featured: false,
} as const;
test("event data permits an intentional empty list and rejects impossible dates", () => {
  assert.deepEqual(eventsSchema.parse([]), []);
  assert.equal(
    eventSchema.safeParse({ ...example, date: "2026-02-30" }).success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({ ...example, endDate: "2026-10-12" }).success,
    false,
  );
});
test("duplicate identities and executable URLs are rejected", () => {
  assert.equal(eventsSchema.safeParse([example, example]).success, false);
  assert.equal(
    eventSchema.safeParse({ ...example, sourceUrl: "javascript:alert(1)" })
      .success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({ ...example, image: "/events/../../secret.png" })
      .success,
    false,
  );
});
test("classification uses the Kolkata date across UTC midnight boundaries", () => {
  assert.equal(kolkataToday(new Date("2026-10-12T18:29:59Z")), "2026-10-12");
  assert.equal(kolkataToday(new Date("2026-10-12T18:30:00Z")), "2026-10-13");
  assert.equal(isUpcoming(eventSchema.parse(example), "2026-10-13"), true);
  assert.equal(isUpcoming(eventSchema.parse(example), "2026-10-14"), false);
});
