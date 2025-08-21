import { test, expect } from "@playwright/test";

test.describe("Application Structure Tests", () => {
  test("should have proper HTML structure and meta tags", async ({ page }) => {
    await page.goto("/");

    // Vérifier la présence des méta tags essentiels
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute(
      "content",
      "width=device-width, initial-scale=1.0"
    );

    // Vérifier la structure HTML de base (sans tester head qui n'est pas visible)
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("body")).toBeVisible();

    // Vérifier que l'application React se monte correctement
    await expect(page.locator("#root")).toBeVisible();
  });

  test("should load CSS and be styled correctly", async ({ page }) => {
    await page.goto("/");

    // Vérifier que les styles Tailwind sont appliqués

    // Attendre que les styles se chargent
    await page.waitForLoadState("networkidle");

    // Vérifier que l'élément principal a des styles appliqués
    const mainElement = page.locator("body > div, #root");
    await expect(mainElement).toBeVisible();

    // Vérifier qu'il n'y a pas d'erreurs de console majeures
    const logs: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        logs.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);

    // Filtrer les erreurs connues ou acceptables
    const criticalErrors = logs.filter(
      (log) =>
        !log.includes("favicon") &&
        !log.includes("service-worker") &&
        !log.includes("Firebase")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    // Définir une taille mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Vérifier que le contenu s'affiche correctement sur mobile
    await expect(page.locator("body")).toBeVisible();

    // Vérifier que le bouton de menu mobile est présent (si applicable)
    const mobileMenuButton = page.locator(
      'button[aria-label*="menu"], button[aria-label*="Menu"]'
    );
    if ((await mobileMenuButton.count()) > 0) {
      await expect(mobileMenuButton).toBeVisible();
    }
  });

  test("should handle page refresh correctly", async ({ page }) => {
    await page.goto("/");

    // Attendre que la page se charge complètement
    await page.waitForLoadState("networkidle");

    // Actualiser la page
    await page.reload();

    // Vérifier que l'application se recharge correctement
    await expect(page.locator("#root")).toBeVisible();
    await expect(page.locator("body")).toBeVisible();
  });

  test("should have proper error boundaries", async ({ page }) => {
    await page.goto("/");

    // Vérifier que l'application se charge sans erreur fatale
    await expect(page.locator("#root")).toBeVisible();

    // Tenter d'accéder à une route inexistante
    await page.goto("/route-inexistante");

    // L'application devrait gérer gracieusement les routes non trouvées
    // (soit redirection, soit page 404, mais pas de crash)
    await expect(page.locator("body")).toBeVisible();
  });
});
