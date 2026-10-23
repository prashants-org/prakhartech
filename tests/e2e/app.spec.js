import { test, expect } from "@playwright/test";

const primaryRoutes = [
  "/",
  "/about",
  "/products",
  "/software",
  "/fleet-savings-calculator",
  "/stationery",
  "/gifts",
  "/corporate-gifting",
  "/elidefireball",
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
  await page.getByRole("button", { name: "Send an enquiry" }).first().click();
  await expect(
    page.getByRole("heading", { name: "Get in Touch" }),
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

test("grouped navigation opens a business-line menu", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 860 });
  await page.goto("/");
  await page.getByRole("button", { name: "Fire Safety" }).click();
  await page.locator("#nav-panel-safety").getByRole("link", { name: /Specs & Fire Classes/ }).click();
  await expect(page).toHaveURL(/\/elidefireball\/product-overview$/);
  await expect(page).toHaveTitle(/Elide Fire Ball Product Overview/);
});

test("old URLs redirect to their new home", async ({ page }) => {
  await page.goto("/softwares");
  await expect(page).toHaveURL(/\/software$/);
  await page.goto("/elidefireball/product-warrantee");
  await expect(page).toHaveURL(/\/elidefireball\/product-warranty$/);
});

test("savings calculator pre-fills a proposal enquiry", async ({ page }) => {
  await page.goto("/fleet-savings-calculator");
  await page.locator("#fc-vehicles").fill("25");
  await page.getByRole("button", { name: /Get a proposal for this fleet/ }).click();
  const dialog = page.getByRole("dialog", { name: "Enquiry form" });
  await expect(dialog.getByLabel("Message")).toHaveValue(/25 vehicles/);
});
