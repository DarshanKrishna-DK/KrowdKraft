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
