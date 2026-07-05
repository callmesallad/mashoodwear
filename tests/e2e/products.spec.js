import { test, expect } from "@playwright/test";

test.describe("Products page", () => {
  test("filter size L shows only L products — E2E-D-11", async ({ page }) => {
    await page.goto("/products");

    await expect(page.getByRole("heading", { name: "Products", level: 1 })).toBeVisible();

    const productGrid = page.locator(".products-results .product-grid");
    await expect(productGrid).toBeVisible({ timeout: 15000 });
    await expect(productGrid.locator(".product-card").first()).toBeVisible();

    const sizeButton = page
      .locator(".filters-sidebar .size-btn")
      .filter({ hasText: /^L$/ });
    await sizeButton.click();

    await expect(page).toHaveURL(/size=L/);

    await expect(productGrid).toBeVisible({ timeout: 15000 });
    const cardCount = await productGrid.locator(".product-card").count();
    expect(cardCount).toBeGreaterThan(0);

    const productNames = await productGrid.locator(".product-name").allTextContents();
    for (const name of productNames) {
      expect(name.length).toBeGreaterThan(0);
    }
  });

  test("legacy /collection redirects to /products", async ({ page }) => {
    await page.goto("/collection");
    await expect(page).toHaveURL(/\/products$/);
    await expect(page.getByRole("heading", { name: "Products", level: 1 })).toBeVisible();
  });
});
