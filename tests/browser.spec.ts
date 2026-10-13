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
for (const width of [390, 1440])
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
  for (const name of ["Darshan", "Deepak", "Vihar"])
    await expect(
      page.locator("#people").getByText(name, { exact: true }),
    ).toBeVisible();
  await expect(page.locator("#people")).toContainText("5,000+");
  await expect(page.locator("#people")).toContainText("30+");
  const social = page.getByRole("navigation", { name: "Follow KrowdKraft" });
  await expect(social.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/company/krowdkraft/",
  );
  await expect(social.getByRole("link", { name: /Instagram/ })).toHaveAttribute(
    "href",
    "https://www.instagram.com/krowdkraft_/",
  );
  await expect(social.getByRole("link", { name: /^X / })).toHaveAttribute(
    "href",
    "https://x.com/KrowdKraft_",
  );
  await expect(
    page.locator('#journal a[href^="https://medium.com/@cryptech_dk/"]'),
  ).toHaveCount(3);
});
test("mobile menu and keyboard search", async ({ page }) => {
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
  await page.keyboard.press("Control+k");
  const search = page.getByRole("dialog", { name: "Find something good." });
  await page.getByLabel("Search pages, events and articles").fill("x402");
  await expect(
    search.getByRole("link", { name: /x402 Global Challenge/ }),
  ).toHaveCount(1);
  await accessible(page);
  await search.getByRole("link", { name: /x402 Global Challenge/ }).click();
  await expect(page).toHaveURL(/\/events\/x402-global-challenge-prehack$/);
});
test("event archive filters, registration cutoff and calendar", async ({
  page,
  request,
}) => {
  await page.goto("/events");
  await expect(page.locator(".event-archive-card")).toHaveCount(
    eventData.length,
  );
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
  await expect(page.locator(".submission-form").getByRole("alert")).toContainText(
    "Online submissions aren’t open just yet",
  );
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
});
test("Krafty travels to anchors, reacts and keeps sound optional", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Reflect.set(window, "audioCount", 0);
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
  await page.locator('[data-duck-dock="products"]').scrollIntoViewIfNeeded();
  await expect(duck).toHaveAttribute("data-stop", "products");
  await expect(duck).toHaveAttribute("data-mood", "curious");
  await duck.getByRole("button", { name: /Krafty is/ }).click();
  await expect(duck).toHaveAttribute("data-mood", "celebrate");
  await page
    .getByRole("button", { name: "Duck sounds off", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Duck sounds on", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => Reflect.get(window, "audioCount"))).toBe(1);
  await page.getByRole("button", { name: "Hide Krafty", exact: true }).click();
  await expect(duck).not.toBeVisible();
  await page.getByRole("button", { name: "Show Krafty", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Duck sounds off", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Pause animations" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Resume animations" }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("hiding Krafty cancels pending sound activation", async ({ page }) => {
  await page.addInitScript(() => {
    AudioContext.prototype.resume = function () {
      return new Promise<void>((resolve) => {
        Reflect.set(window, "finishDuckAudio", resolve);
      });
    };
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Duck sounds off", exact: true })
    .click();
  await page.getByRole("button", { name: "Hide Krafty", exact: true }).click();
  await page.evaluate(() => Reflect.get(window, "finishDuckAudio")());
  await page.getByRole("button", { name: "Show Krafty", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Duck sounds off", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
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
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Marketplace", exact: true })
    .click();
  await expect.poll(async () => (await views()).length).toBe(2);
  await page
    .getByLabel("Your contact email")
    .fill("private-fixture@example.com");
  expect(
    await page.evaluate(() => Reflect.get(window, "ga-disable-G-QM44WYFLFR")),
  ).toBe(true);
  expect(JSON.stringify(await views())).not.toContain("private-fixture");
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
