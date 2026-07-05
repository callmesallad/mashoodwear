import { test, expect } from "@playwright/test";

test.describe("Brand collections", () => {
  test("E2E-D-08: collections list shows Drift with cover", async ({ page }) => {
    await page.goto("/collections");
    await expect(page.getByRole("heading", { name: "Collections" })).toBeVisible();
    const driftCard = page.locator(".collection-card").filter({ hasText: "Drift" });
    await expect(driftCard).toBeVisible();
    await expect(driftCard.getByText(/\d+ pieces?/)).toBeVisible();
  });

  test("E2E-D-09: collection detail shows products with stock labels", async ({ page }) => {
    await page.goto("/collections/drift");
    await expect(page.getByRole("heading", { name: "Drift" })).toBeVisible();
    await expect(page.locator(".product-card").first()).toBeVisible();
    await expect(page.locator(".card-stock-label").first()).toBeVisible();
  });

  test("E2E-D-10: tap product in collection opens product detail", async ({ page }) => {
    await page.goto("/collections/drift");
    const firstProduct = page.locator(".product-card").first();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/products\/.+/);
    await expect(page.locator(".product-detail-page")).toBeVisible();
  });
});
