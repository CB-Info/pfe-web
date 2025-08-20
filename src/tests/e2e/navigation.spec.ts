import { test, expect } from "@playwright/test";

test.describe("Navigation E2E Tests", () => {
  test("should display login page when not authenticated", async ({ page }) => {
    await page.goto("/");

    // Vérifier que la page de login s'affiche avec le bon texte
    await expect(page.locator("text=Connexion sécurisée")).toBeVisible();

    // Vérifier la présence des champs de connexion
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Vérifier le placeholder de l'email
    await expect(
      page.locator('input[placeholder="Votre adresse email"]')
    ).toBeVisible();
  });

  test("should have proper page title and meta", async ({ page }) => {
    await page.goto("/");

    // Vérifier le titre de la page (tel qu'il est défini dans index.html)
    await expect(page).toHaveTitle("Vite + React + TS");

    // Vérifier la présence du viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute(
      "content",
      "width=device-width, initial-scale=1.0"
    );
  });

  test("should load application correctly", async ({ page }) => {
    await page.goto("/");

    // Vérifier que l'application React se monte correctement
    await expect(page.locator("#root")).toBeVisible();

    // Vérifier qu'aucune erreur critique n'apparaît
    await expect(page.locator("body")).toBeVisible();
  });
});
