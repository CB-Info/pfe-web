import { test, expect } from "@playwright/test";

test.describe("Basic Interactions Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should allow typing in form fields", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Tester la saisie dans le champ email
    await emailInput.fill("user@example.com");
    await expect(emailInput).toHaveValue("user@example.com");

    // Tester la saisie dans le champ password
    await passwordInput.fill("mypassword");
    await expect(passwordInput).toHaveValue("mypassword");
  });

  test("should clear form fields", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');

    // Saisir du texte puis l'effacer
    await emailInput.fill("test@example.com");
    await emailInput.clear();

    await expect(emailInput).toHaveValue("");
  });

  test("should show password reset option", async ({ page }) => {
    // Vérifier que le lien "Mot de passe oublié" est présent
    await expect(page.locator("text=Mot de passe oublié")).toBeVisible();

    // Le lien devrait être cliquable
    const resetLink = page.locator("text=Mot de passe oublié");
    await expect(resetLink).toBeVisible();
  });

  test("should have responsive design elements", async ({ page }) => {
    // Vérifier que les éléments principaux sont présents et visibles
    await expect(page.locator("text=Connexion sécurisée")).toBeVisible();
    await expect(
      page.locator("text=Accédez à votre espace de gestion")
    ).toBeVisible();

    // Tester sur une taille mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Les éléments principaux devraient toujours être visibles
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should support basic keyboard interactions", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');

    // Cliquer sur le champ email et vérifier qu'on peut y saisir du texte
    await emailInput.click();
    await page.keyboard.type("test@example.com");

    await expect(emailInput).toHaveValue("test@example.com");

    // Utiliser Escape pour potentiellement fermer des éléments ouverts
    await page.keyboard.press("Escape");

    // Le champ devrait toujours contenir sa valeur
    await expect(emailInput).toHaveValue("test@example.com");
  });
});
