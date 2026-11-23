import { test, expect } from "@playwright/test";

test.describe("Form Submission", () => {
    test("should submit form data successfully", async ({ page }) => {
        // Mock réseau : intercepte la requête API avant qu'elle parte
        await page.route("**/api/submit", (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ message: "Form submitted successfully!" }),
            })
        );

        await page.goto("/");

        // getByRole('button') — résistant aux changements CSS / className
        await page.getByRole('button', { name: 'Show Form' }).click();

        // getByLabel — le sélecteur le plus robuste pour les champs de formulaire
        // Il suit l'association htmlFor/id et est indépendant du CSS
        await page.getByLabel('Name:').fill("John Doe");
        await page.getByLabel('Email:').fill("johndoe@example.com");

        // getByRole('button', { name }) — cible le bouton de soumission sémantiquement
        await page.getByRole('button', { name: 'Submit' }).click();

        // getByRole('status') — cible le <p role="status"> pour les messages dynamiques
        // aria-live="polite" garantit l'annonce aux lecteurs d'écran
        await expect(page.getByRole('status')).toHaveText("Success: Form submitted successfully!");
    });

    test("should handle form submission errors", async ({ page }) => {
        await page.route("**/api/submit", (route) =>
            route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({ message: "Internal Server Error" }),
            })
        );

        await page.goto("/");

        await page.getByRole('button', { name: 'Show Form' }).click();
        await page.getByLabel('Name:').fill("John Doe");
        await page.getByLabel('Email:').fill("johndoe@example.com");
        await page.getByRole('button', { name: 'Submit' }).click();

        await expect(page.getByRole('status')).toHaveText("Error: Unable to submit.");
    });

    test("should hide the form when 'Hide Form' is clicked", async ({ page }) => {
        await page.goto("/");

        await page.getByRole('button', { name: 'Show Form' }).click();
        await expect(page.getByRole('form', { name: 'Contact form' })).toBeVisible();

        await page.getByRole('button', { name: 'Hide Form' }).click();
        await expect(page.getByRole('form', { name: 'Contact form' })).not.toBeVisible();
    });
});
