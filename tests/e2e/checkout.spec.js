import { test, expect } from "@playwright/test";

test.describe("Checkout", () => {
  test("E2E-D-04: empty cart checkout blocked", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByText("Your cart is empty")).toBeVisible();
    await expect(page.getByRole("button", { name: "Complete Order on Instagram" })).toHaveCount(0);
  });

  test("E2E-D-01: cart to checkout with Instagram CTA", async ({ page }) => {
    await page.goto("/products/street-hoodie-black");
    await page.getByRole("button", { name: "M" }).click();
    await page.getByRole("button", { name: "Black", exact: true }).click();
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByText("Added to cart")).toBeVisible();

    await page.goto("/cart");
    await page.getByRole("link", { name: "Continue to Checkout" }).click();
    await expect(page).toHaveURL("/checkout");
    await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
    await expect(page.getByText("Street Hoodie Black")).toBeVisible();
    await expect(page.getByRole("button", { name: "Complete Order on Instagram" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy order details for DM" })).toBeVisible();
  });
});
