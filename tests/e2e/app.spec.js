import { test, expect } from "@playwright/test";

const primaryRoutes = [
  "/",
  "/about",
  "/products",
  "/softwares",
  "/downloads",
  "/faq",
  "/vehicle-fleet",
  "/security",
  "/personal",
  "/whychoose",
  "/whygps",
  "/contact",
];

test("home to contact and map location", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("nav .nav-links a", { hasText: "Contact" })
    .first()
    .click({ force: true });
  await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();

  const mapFrame = page.getByTitle("Location map");
  await expect(mapFrame).toHaveAttribute("src", /maps\.google\.com/);
  await expect(mapFrame).toHaveAttribute("src", /iwloc=near/);

  const locationSelect = page.getByRole("combobox");
  if (await locationSelect.count()) {
    const options = locationSelect.locator("option");
    if ((await options.count()) > 1) {
      await locationSelect.selectOption({ index: 1 });
      const mapSrc = await mapFrame.getAttribute("src");
      expect(mapSrc).toContain("maps.google.com");
    }
  }
});

test("opens enquiry modal from home", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Request Online Demo" }).click();
  await expect(
    page.getByRole("heading", { name: "Enquiry Form" }),
  ).toBeVisible();
});

test("shows 404 page for unknown routes", async ({ page }) => {
  await page.goto("/not-a-real-page");
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});

test("primary routes render without 404", async ({ page }) => {
  for (const route of primaryRoutes) {
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toHaveCount(0);
  }
});
