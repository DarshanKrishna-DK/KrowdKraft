import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("community content, empty tracks, and accessibility", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main > section")).toHaveCount(9);
  await page.getByRole("button", { name: "What's next", exact: true }).click();
  await expect(page.getByRole("heading", { name: "We're krafting the next one." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Coming soon." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]); expect(errors).toEqual([]);
});
test("phone menu traps focus, closes with Escape, and restores the trigger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" }); await trigger.click();
  const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("page copy is present without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto("http://127.0.0.1:3180");
  await expect(page.locator("main > section")).toHaveCount(9);
  await expect(page.getByRole("heading", { name: "People behind the Krowd." })).toBeVisible();
  await context.close();
});
test("collaboration preserves input and reports unconfigured mail honestly", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Build with the Krowd" }); await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Your name").fill("Test person");
  await dialog.getByRole("button", { name: "Send collaboration request" }).click();
  await expect(dialog.getByText("Choose who you represent.")).toBeVisible();
  await expect(dialog.getByLabel("Your name")).toHaveValue("Test person");
  await dialog.getByLabel("I represent a").selectOption("Community");
  await dialog.getByLabel("Organization name").fill("Browser test community");
  await dialog.getByLabel("Your name").fill("Test person");
  await dialog.getByLabel("Email", { exact: false }).fill("test@example.com");
  await dialog.getByLabel("What are you planning?").selectOption("Meetup");
  await dialog.getByLabel("Tell us about the idea").fill("A hands-on community workshop for developers.");
  await dialog.getByLabel("How would you like KrowdKraft involved?").fill("Help bring the community together.");
  await dialog.getByRole("button", { name: "Send collaboration request" }).click();
  await expect(dialog.getByRole("alert")).toContainText("mail isn't configured");
  await expect(dialog.getByLabel("Your name")).toHaveValue("Test person");
  await expect(dialog.getByText("Connection made.")).toHaveCount(0);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
});
test("figures mount nearby; reduced motion settles; only the hero mounts on phones", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/");
  const hero = page.locator('[data-figure="gather"] svg');
  await expect(hero).toBeVisible();
  await hero.hover(); await page.waitForTimeout(150);
  const settled = await hero.innerHTML(); await page.waitForTimeout(800); expect(await hero.innerHTML()).toBe(settled);
  await expect(page.locator('[data-figure="seat"] svg')).toHaveCount(0);
  for (const name of ["route", "blocks", "bridge", "seat"]) {
    const plate = page.locator(`[data-figure="${name}"]`);
    await plate.scrollIntoViewIfNeeded(); await expect(plate.locator("svg")).toBeVisible();
  }
  await expect(hero).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/");
  await expect(page.locator('[data-figure="gather"] svg')).toBeVisible();
  await page.locator("#join").scrollIntoViewIfNeeded();
  await expect(page.locator(".desktop-figure svg")).toHaveCount(0);
});
test("Krafty guides navigation, keeps audio opt-in, and can be hidden and restored", async ({ page }) => {
  await page.addInitScript(() => {
    const tracked = Object.assign(window, { audioContextCount: 0 });
    window.AudioContext = new Proxy(window.AudioContext, { construct(target, args) { tracked.audioContextCount++; return Reflect.construct(target, args); } });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const contexts = () => page.evaluate(() => Reflect.get(window, "audioContextCount"));
  expect(await contexts()).toBe(0);
  await page.getByRole("button", { name: "Open Krafty, the duck guide" }).click();
  const guide = page.getByRole("region", { name: "Hey, I'm Krafty." }); await expect(guide).toBeVisible();
  expect(await contexts()).toBe(0);
  await guide.getByRole("link", { name: "Explore events", exact: true }).click();
  await expect(page).toHaveURL(/#events$/);
  await expect(guide.locator(".guide-message")).toContainText("Krowd Map");
  await guide.getByRole("button", { name: "Turn duck sounds on" }).click();
  await expect(guide.getByRole("button", { name: "Turn duck sounds off" })).toHaveAttribute("aria-pressed", "true");
  expect(await contexts()).toBe(1);
  await guide.getByRole("button", { name: "Turn duck sounds off" }).click();
  await expect(guide.getByRole("button", { name: "Turn duck sounds on" })).toHaveAttribute("aria-pressed", "false");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape"); await expect(guide).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open Krafty, the duck guide" })).toBeFocused();
  await page.getByRole("button", { name: "Open Krafty, the duck guide" }).click();
  await guide.getByRole("button", { name: "Hide duck" }).click();
  await expect(page.locator(".duck-avatar")).toHaveCount(0);
  await page.getByRole("button", { name: "Show Krafty, the duck guide" }).click();
  await expect(page.locator(".duck-avatar")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("join sends an interest note without claiming list enrollment", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email me when something is happening.").fill("interest@example.com");
  await page.getByRole("button", { name: "Join the Krowd", exact: true }).click();
  await expect(page.locator("#join").getByRole("alert")).toContainText("mail isn't configured");
});
