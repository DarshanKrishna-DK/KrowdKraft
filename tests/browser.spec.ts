import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import eventData from "../src/data/events.json" with { type: "json" };
const pages = [
  "/",
  "/events",
  "/marketplace",
  "/spotlight",
  "/journal",
  "/leaderboard",
  "/account",
  "/privacy",
  "/events/hacktoberfest-hack-day-2026",
];
async function accessible(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    violations.map(({ id, nodes }) => ({
      id,
      nodes: nodes.map((n) => ({ target: n.target, reason: n.failureSummary })),
    })),
  ).toEqual([]);
}
for (const width of [320, 390, 768, 1440])
  test(`public pages at ${width}px: accessibility, layout and browser errors`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (e) => {
      if (e.type() === "error") errors.push(e.text());
    });
    for (const route of pages) {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await accessible(page);
    }
    expect(errors).toEqual([]);
  });
test("restored people, impact, Medium and socials", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Darshan Krishna N", "Deepak N", "Viha Shomikha"])
    await expect(
      page.locator("#people").getByText(name, { exact: true }),
    ).toBeVisible();
  await expect(page.locator("#people")).toContainText("5,000+");
  await expect(page.locator("#people")).toContainText("30+");
  await expect(page.locator("#people")).toContainText("1,400+");
  const social = page.getByRole("navigation", { name: "Follow KrowdKraft" });
  await expect(social.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/company/krowdkraft/",
  );
  await expect(social.getByRole("link", { name: /Instagram/ })).toHaveAttribute(
    "href",
    "https://www.instagram.com/krowdkraft_/",
  );
  await expect(
    social.getByRole("link", { name: "X", exact: true }),
  ).toHaveAttribute("href", "https://x.com/KrowdKraft_");
  await expect(
    social.getByRole("link", { name: "WhatsApp", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://whatsapp.com/channel/0029Vb9BTtuEawdmK4IivD1M",
  );
  await expect(
    page.locator('#journal a[href^="https://medium.com/@cryptech_dk/"]'),
  ).toHaveCount(3);
  for (const cover of await page.locator("#journal .journal-cover img").all()) {
    await cover.scrollIntoViewIfNeeded();
    await expect(cover).toHaveAttribute(
      "src",
      /journal%2F(certifications|dev-vs-dsa|hidden-gems)\.webp/,
    );
    await expect
      .poll(() =>
        cover.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
});
test("mobile navigation traps focus, restores it and reaches the community pages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const menu = page.getByRole("dialog", { name: "Find your corner." });
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(
      await menu.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await accessible(page);
  await menu.getByRole("link", { name: "Events", exact: true }).click();
  await expect(page).toHaveURL(/\/events$/);
  await expect(
    page.getByRole("button", { name: /Search the community/ }),
  ).toHaveCount(0);
});
test("event archive filters, registration cutoff and calendar", async ({
  page,
  request,
}) => {
  await page.goto("/events");
  await expect(page.locator(".event-archive-card")).toHaveCount(
    eventData.length,
  );
  await page.getByLabel("Event type", { exact: true }).selectOption("meetup");
  await expect(page.locator(".event-archive-card")).toHaveCount(1);
  await expect(page.locator(".event-archive-card")).toContainText(
    "Community partner",
  );
  await expect(page.locator(".event-archive-card")).not.toContainText(
    "Bengaluru, Bengaluru",
  );
  await page.getByLabel("Event type", { exact: true }).selectOption("all");
  await page.getByLabel("Venue", { exact: true }).selectOption("Startup Park");
  await expect(page.locator(".event-archive-card")).toHaveCount(2);
  await page.getByLabel("Venue", { exact: true }).selectOption("all");
  await page.getByRole("button", { name: "Past events", exact: true }).click();
  await page.getByLabel("Search events").fill("HackCulture");
  await expect(page.locator(".event-archive-card")).toHaveCount(1);
  await expect(page.locator(".event-archive-card")).toContainText("x402");
  await page.getByLabel("Search events").fill("nothing-matches");
  await page.getByRole("button", { name: "Show all events" }).click();
  await expect(page.locator(".event-archive-card")).toHaveCount(
    eventData.length,
  );
  await page.goto("/events/hacktoberfest-hack-day-2026");
  await expect(
    page.getByRole("link", { name: "Registration details", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Official event page" }),
  ).toHaveAttribute("href", /events\.mlh\.com/);
  const response = await request.get(
    "/events/hacktoberfest-hack-day-2026/calendar",
  );
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("text/calendar");
  expect(await response.text()).toContain("DTSTART:20261018T030000Z");
  expect((await request.get("/events/missing/calendar")).status()).toBe(404);
});
test("email-only product form validates consent and preserves an unsaved draft", async ({
  page,
}) => {
  await page.goto("/marketplace#submit");
  await expect(page.locator('input[type="tel"]')).toHaveCount(0);
  await page
    .getByLabel("Product name", { exact: true })
    .fill("Browser fixture");
  await page.getByLabel("Builder or team name").fill("Test builder");
  await page.getByLabel("Your contact email").fill("test@example.com");
  await page
    .getByLabel("Product, demo or repository link")
    .fill("https://example.com/project");
  await page
    .getByLabel("What does it do, and who is it for?")
    .fill("A browser-only fixture for clear and honest submission behavior.");
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByRole("checkbox")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(
    page.locator(".submission-form").getByRole("alert"),
  ).toContainText("Online submissions aren’t open just yet");
  await expect(page.getByLabel("Product name", { exact: true })).toHaveValue(
    "Browser fixture",
  );
  await expect(
    page.getByRole("link", { name: /Open this submission/ }),
  ).toHaveAttribute("href", /^mailto:krowdkraft\.official@gmail\.com\?/);
  await accessible(page);
});
test("collaboration validates and reports unconfigured delivery", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Build with the Krowd" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Your name").fill("Test person");
  await dialog
    .getByRole("button", { name: "Send collaboration request" })
    .click();
  await expect(dialog.getByText("Choose who you represent.")).toBeVisible();
  await dialog.getByLabel("I represent a").selectOption("Community");
  await dialog.getByLabel("Organization name").fill("Test community");
  await dialog.getByLabel("Email", { exact: false }).fill("test@example.com");
  await dialog.getByLabel("What are you planning?").selectOption("Meetup");
  await dialog
    .getByLabel("Tell us about the idea")
    .fill("A hands-on community workshop for developers.");
  await dialog
    .getByLabel("How would you like KrowdKraft involved?")
    .fill("Help bring the community together.");
  await dialog
    .getByRole("button", { name: "Send collaboration request" })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    "mail isn't configured",
  );
  await expect(dialog.getByLabel("Your name")).toHaveValue("Test person");
  await accessible(page);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("Test person");
  await page.keyboard.press("Escape");
});
test("Krafty stays visible, travels and starts sound only after interaction", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("krowd-duck", "hidden");
    Reflect.set(window, "audioCount", 0);
    Reflect.set(window, "quackCount", 0);
    const start = OscillatorNode.prototype.start;
    OscillatorNode.prototype.start = function (...args) {
      Reflect.set(window, "quackCount", Reflect.get(window, "quackCount") + 1);
      return start.apply(this, args);
    };
    window.AudioContext = new Proxy(window.AudioContext, {
      construct(target, args) {
        Reflect.set(
          window,
          "audioCount",
          Reflect.get(window, "audioCount") + 1,
        );
        return Reflect.construct(target, args);
      },
    });
  });
  await page.goto("/");
  const duck = page.getByRole("complementary", {
    name: "Krafty, your community companion",
  });
  await page.locator('[data-duck-dock="hello"]').scrollIntoViewIfNeeded();
  await expect(duck).toBeVisible();
  await expect(duck).toHaveAttribute("data-stop", "hello");
  expect(await page.evaluate(() => Reflect.get(window, "audioCount"))).toBe(0);
  await page.locator('[data-duck-dock="event"]').scrollIntoViewIfNeeded();
  await expect(duck).toHaveAttribute("data-stop", "event");
  await expect(duck).toHaveAttribute("data-mood", "thinking");
  await duck.getByRole("button", { name: /Krafty is/ }).click();
  await expect(duck).toHaveAttribute("data-mood", "celebrate");
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, "audioCount")))
    .toBe(1);
  await page.locator('[data-duck-dock="join"]').scrollIntoViewIfNeeded();
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, "quackCount")))
    .toBeGreaterThan(0);
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(async () => {
      const box = await duck.boundingBox();
      const height = await page.evaluate(() => innerHeight);
      return !!box && box.y >= 0 && box.y + box.height <= height;
    })
    .toBe(true);
  await duck.getByRole("button", { name: /Krafty is/ }).hover();
  await expect(duck.locator(".krafty-body-button")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator(".footer-settings")).toHaveCount(0);
});
test("showcase remains prominent and Krafty settles before giving a contextual tip", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator("header").getByRole("link", { name: "Showcase", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#made-here")).toContainText("Built by the Krowd.");
  await expect(page.locator("#spotlights")).toContainText("Good work.");
  await page
    .locator("#made-here")
    .evaluate((node) => node.scrollIntoView({ block: "start" }));
  const duck = page.getByRole("complementary", {
    name: "Krafty, your community companion",
  });
  await expect(duck).toHaveAttribute("data-stop", "projects");
  await expect(duck).toHaveAttribute("data-walking", "false");
  await expect(duck.locator(".krafty-bubble")).toContainText(
    "elaborate folder",
  );
  const before = await duck.boundingBox();
  await page.evaluate(() => scrollBy(0, 35));
  await expect(duck).toHaveAttribute("data-stop", "projects");
  const after = await duck.boundingBox();
  expect(after?.x).toBe(before?.x);
  expect(after?.y).toBe(before?.y);
  await page
    .locator("#made-here")
    .getByRole("link", { name: "Explore the showcase" })
    .click();
  await expect(page).toHaveURL(/\/marketplace$/);
  await expect(
    page
      .getByRole("navigation", { name: "Showcase sections" })
      .getByRole("link", { name: "Builder spotlight" }),
  ).toBeVisible();
  await expect(page.locator("#builders")).toContainText("Meet the people");
});
test("destination navigation starts at the top and section links retain their target", async ({
  page,
}) => {
  await page.goto("/");
  for (const destination of ["Showcase", "Spotlight", "Journal", "Events"]) {
    await page
      .locator("footer")
      .getByRole("link", { name: destination, exact: true })
      .click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(page.locator("h1")).toBeInViewport();
  }
  await page
    .locator("footer")
    .getByRole("link", { name: "Events", exact: true })
    .click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.goto("/marketplace#submit");
  await expect(page.locator("#submit")).toBeInViewport();
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
});
test("private routes fail closed; content works without JavaScript", async ({
  browser,
  request,
}) => {
  expect((await request.get("/admin")).status()).toBe(404);
  const callback = await request.get("/auth/callback?code=invalid-fixture", {
    maxRedirects: 0,
  });
  expect(callback.status()).toBe(307);
  expect(callback.headers().location).toContain(
    "/account?notice=connection-failed",
  );
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3180");
  await expect(
    page.getByRole("heading", { name: /People behind/ }),
  ).toBeVisible();
  await expect(page.locator(".krafty-traveller")).not.toBeVisible();
  await context.close();
});
test("Analytics consent, one public route view, and private-data exclusion", async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  let scriptLoads = 0;
  await context.route("https://community.test/**", async (route) => {
    const response = await route.fetch({
      url: route
        .request()
        .url()
        .replace("https://community.test", "http://127.0.0.1:3180"),
    });
    await route.fulfill({ response });
  });
  await context.route("https://www.googletagmanager.com/**", (route) => {
    scriptLoads++;
    return route.fulfill({
      contentType: "text/javascript",
      body: "/* isolated analytics test */",
    });
  });
  await context.route(/google-analytics\.com/, (route) => route.abort());
  await page.goto(
    "https://community.test/?email=never-send@example.com#private",
  );
  await expect(
    page.getByRole("region", { name: "Optional analytics" }),
  ).toBeVisible();
  expect(scriptLoads).toBe(0);
  await page
    .getByRole("button", { name: "Allow analytics", exact: true })
    .click();
  await expect.poll(() => scriptLoads).toBe(1);
  const views = () =>
    page.evaluate(() =>
      (window.dataLayer || [])
        .map((value) => Array.from(value as ArrayLike<unknown>))
        .filter((item) => item[0] === "event" && item[1] === "page_view"),
    );
  await expect.poll(async () => (await views()).length).toBe(1);
  expect(JSON.stringify(await views())).not.toMatch(
    /never-send|private|email=/,
  );
  expect(
    await page.evaluate(() =>
      Object.prototype.toString.call(window.dataLayer?.[0]),
    ),
  ).toBe("[object Arguments]");
  await page
    .locator("footer")
    .getByRole("link", { name: "Showcase", exact: true })
    .click();
  await expect.poll(async () => (await views()).length).toBe(2);
  await page
    .getByLabel("Your contact email")
    .fill("private-fixture@example.com");
  expect(
    await page.evaluate(() => Reflect.get(window, "ga-disable-G-QM44WYFLFR")),
  ).toBe(true);
  expect(JSON.stringify(await views())).not.toContain("private-fixture");
  await page
    .locator("footer")
    .getByRole("link", { name: "Privacy", exact: true })
    .click();
  await page.getByRole("button", { name: "Analytics preferences" }).click();
  await page.getByRole("button", { name: "No thanks" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("krowd-analytics")),
  ).toBe("declined");
  await page.goto("https://community.test/account?notice=private");
  await expect(
    page.getByRole("button", { name: "GitHub connection coming soon" }),
  ).toBeDisabled();
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
  expect(scriptLoads).toBe(1);
  await page.goto("https://community.test/journal");
  expect(scriptLoads).toBe(1);
  await context.close();
});

test("nomination keeps private contact details and recovers after unavailable storage", async ({
  page,
}) => {
  await page.goto("/spotlight#nominate");
  await page
    .getByLabel("Story or achievement")
    .fill("Isolated test nomination");
  await page.getByLabel("Builder or team name").fill("Test builder");
  await page.getByLabel("Your contact email").fill("nomination@example.com");
  await page
    .getByLabel("Link to the work or achievement")
    .fill("https://example.com/work");
  await page
    .getByLabel("Tell us why this deserves a spotlight")
    .fill(
      "An isolated fixture to verify nomination recovery without publishing a story.",
    );
  await page.getByText("Add public profile links", { exact: false }).click();
  await page
    .getByLabel("Public profile 1")
    .fill("https://github.com/test-builder");
  await page
    .getByLabel("Public profile 2")
    .fill("https://linkedin.com/in/test-builder");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Nominate this builder" }).click();
  await expect(
    page.locator(".submission-form").getByRole("alert"),
  ).toContainText("Online submissions aren’t open just yet");
  await expect(page.getByLabel("Your contact email")).toHaveValue(
    "nomination@example.com",
  );
  await expect(
    page.getByRole("link", { name: /Open this submission/ }),
  ).toHaveAttribute("href", /^mailto:/);
  await expect(
    page.getByRole("link", { name: /Open this submission/ }),
  ).toHaveAttribute("href", /github.com%2Ftest-builder/);
  await expect(page.getByLabel("Public profile 2")).toHaveValue(
    "https://linkedin.com/in/test-builder",
  );
  await accessible(page);
});

test("event sharing, calendar links, security headers and legacy redirect", async ({
  page,
  request,
}) => {
  const legacy = await request.get("/community", { maxRedirects: 0 });
  expect(legacy.status()).toBe(308);
  expect(legacy.headers().location).toBe("/events");
  const response = await page.goto("/events/hacktoberfest-hack-day-2026");
  expect(response?.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Hacktoberfest Hack Day | KrowdKraft",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /hacktoberfest-hack-day-2026\/share$/,
  );
  const image = await request.get("/events/hacktoberfest-hack-day-2026/share");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  expect((await image.body()).subarray(1, 4).toString()).toBe("PNG");
  await expect(
    page.getByRole("link", { name: "Open venue map" }),
  ).toHaveAttribute("href", /query_place_id=/);
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Add to calendar" }).click();
  expect((await download).suggestedFilename()).toBe(
    "hacktoberfest-hack-day-2026.ics",
  );
  await page.goto("/events/namaste-arbitrum-2025");
  await expect(
    page.getByRole("link", { name: "Official event page" }),
  ).toHaveAttribute("href", "https://luma.com/9usbg8kx");
  await expect(
    page.getByRole("link", { name: "Add to calendar" }),
  ).toBeVisible();
});

test("motion controls pause the rainfall and factual ribbon", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause code rain" }).click();
  await expect(
    page.getByRole("button", { name: "Play code rain" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Pause community ribbon" }).click();
  await expect(page.locator(".ribbon-track")).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await expect(
    page.locator(".ticket-barcode, .ticket-code, .ticket-kicker .live-dot"),
  ).toHaveCount(0);
  await expect(page.locator(".ticket-bottom")).not.toContainText("below");
});
