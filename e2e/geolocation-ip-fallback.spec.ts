import { test, expect } from "@playwright/test";

test.describe("Geolocation IP Fallback", () => {
  test("should show approximate location via IP when GPS permission is denied", async ({
    page,
    context,
  }) => {
    // Crea un contexto sin permisos de geolocalización
    await context.grantPermissions([]);

    // Inicia la app
    await page.goto("http://localhost:5173");

    // Abre el LocationSheet tocando el ícono de ubicación
    const locationButton = page.locator('button[aria-label="Elegir ubicación"]');
    await locationButton.click();

    // Intenta usar ubicación actual (GPS falla, intenta IP)
    const ciudadActualButton = page
      .locator("button")
      .filter({ hasText: "Ciudad actual" });
    await ciudadActualButton.click();

    // Espera a que termine el proceso
    await page.waitForTimeout(3000);

    // Verifica que se muestre "aproximada"
    const ubicacionTexto = page
      .locator("span")
      .filter({ hasText: /aproximada/ });
    await expect(ubicacionTexto).toBeVisible({ timeout: 5000 });
  });

  test("should still show error message when both GPS and IP fail", async ({
    page,
    context,
  }) => {
    // Intercepta la API de IP para simular un fallo
    await page.route("https://ipwho.is/**", (route) => {
      route.abort("failed");
    });

    // Sin permisos de GPS
    await context.grantPermissions([]);

    await page.goto("http://localhost:5173");

    // Abre el LocationSheet
    const locationButton = page.locator('button[aria-label="Elegir ubicación"]');
    await locationButton.click();

    // Intenta usar ubicación actual
    const ciudadActualButton = page
      .locator("button")
      .filter({ hasText: "Ciudad actual" });
    await ciudadActualButton.click();

    // Espera a que terminen ambos intentos
    await page.waitForTimeout(2000);

    // Verifica que se muestre el mensaje de error
    const errorTexto = page
      .locator("span")
      .filter({ hasText: "No se pudo confirmar" });
    await expect(errorTexto).toBeVisible({ timeout: 5000 });
  });
});
