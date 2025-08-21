import { test, expect } from "@playwright/test";

test.describe("Login UI Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display login form elements correctly", async ({ page }) => {
    // Vérifier le titre principal
    await expect(page.locator("text=Connexion sécurisée")).toBeVisible();

    // Vérifier les champs de saisie
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Vérifier les placeholders
    await expect(emailInput).toHaveAttribute(
      "placeholder",
      "Votre adresse email"
    );
    await expect(passwordInput).toHaveAttribute(
      "placeholder",
      "Votre mot de passe"
    );
  });

  test("should validate email input format", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');

    // Saisir un email invalide
    await emailInput.fill("invalid-email");
    await emailInput.blur(); // Déclencher la validation

    // Vérifier qu'un message d'erreur apparaît
    await expect(page.locator("text=Format d'email invalide")).toBeVisible();
  });

  test("should have proper form structure", async ({ page }) => {
    // Vérifier la présence du formulaire
    await expect(page.locator("form")).toBeVisible();

    // Vérifier la présence des icônes dans les champs
    await expect(page.locator("svg").first()).toBeVisible(); // Icône Shield ou Mail

    // Vérifier que le formulaire contient les éléments essentiels
    await expect(page.locator("form")).toContainText("Mot de passe oublié");
  });
});
