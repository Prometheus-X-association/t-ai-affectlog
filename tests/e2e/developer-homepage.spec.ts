/**
 * E2E tests for the public homepage.
 * Verifies required content, CTA links, footer, and forbidden terms.
 *
 * Run with: npx playwright test tests/e2e/developer-homepage.spec.ts
 * Requires a running frontend at http://localhost:3000.
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test.describe("Public homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("renders hero title", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Open Trustworthy AI Assessment"
    );
  });

  test("has primary CTA: Launch the Assessment Console", async ({ page }) => {
    const link = page.getByRole("link", { name: /Launch the Assessment Console/i });
    await expect(link).toBeVisible();
  });

  test("has secondary CTA: Contribute on GitHub", async ({ page }) => {
    const link = page.getByRole("link", { name: /Contribute on GitHub/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /github\.com/);
  });

  test("has Prometheus-X ecosystem trust badge", async ({ page }) => {
    await expect(page.getByText(/Prometheus-X Ecosystem/i)).toBeVisible();
  });

  test("shows CARiSMA in ecosystem section", async ({ page }) => {
    await expect(page.getByText(/CARiSMA/i)).toBeVisible();
  });

  test("shows LOLA in ecosystem section", async ({ page }) => {
    await expect(page.getByText(/LOLA/i)).toBeVisible();
  });

  test("footer contains EU funding acknowledgement", async ({ page }) => {
    await expect(page.getByText(/Co-funded by the European Union/i)).toBeVisible();
  });

  test("footer links to Prometheus-X BB04", async ({ page }) => {
    const link = page.getByRole("link", { name: /Prometheus-X BB04/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /prometheus-x\.org/);
  });

  test("footer links to EDGE-Skills EU project", async ({ page }) => {
    const link = page.getByRole("link", { name: /EDGE-Skills EU Project/i });
    await expect(link).toBeVisible();
  });

  test("footer links to GitHub repository", async ({ page }) => {
    const link = page.getByRole("link", { name: /GitHub Repository/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /Prometheus-X-association/);
  });

  test("developer CTA section is present", async ({ page }) => {
    await expect(page.getByText(/Build reusable assessment recipes with us/i)).toBeVisible();
  });

  test("developer CTA has Contributor Guide button", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Read Contributor Guide/i })).toBeVisible();
  });

  // ── Forbidden terms ────────────────────────────────────────────────────
  const FORBIDDEN = ["D3.7", "TRL", "reporting period"];

  for (const term of FORBIDDEN) {
    test(`homepage does not contain forbidden term: "${term}"`, async ({ page }) => {
      const content = await page.content();
      expect(content).not.toContain(term);
    });
  }

  test("does not imply exploratory-only status", async ({ page }) => {
    const content = await page.content();
    const forbiddenPhrases = ["proof of concept", "work in progress", "not yet ready"];
    for (const phrase of forbiddenPhrases) {
      expect(content.toLowerCase()).not.toContain(phrase);
    }
  });
});

test.describe("Auth pages", () => {
  test("login page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
  });

  test("register page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await expect(page.getByRole("heading", { name: /Request Access/i })).toBeVisible();
  });

  test("awaiting approval page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/awaiting-approval`);
    await expect(page.getByText(/awaiting administrator review/i)).toBeVisible();
  });
});
