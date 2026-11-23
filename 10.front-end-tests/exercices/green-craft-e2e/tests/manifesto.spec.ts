import { expect, test } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ManifestoPage } from './pages/ManifestoPage';
import { languages } from './pages/languages';

// Test E2E sur un site réel : https://green-craft.fr
// Le site choisit sa langue selon la locale du navigateur,
// on la fixe donc explicitement pour chaque scénario.
// Les détails d'UI (libellés, URLs, sélecteurs) sont dans les Page Objects (./pages).

test.describe('Manifeste Green Craft en français', () => {
    test.use({ locale: languages.fr.locale });

    test('le manifeste est accessible depuis la page d\'accueil', async ({ page }) => {
        const home = new HomePage(page, 'fr');
        await home.goto();

        const manifesto = await home.openFullManifesto();

        await expect(page).toHaveURL(manifesto.url);
        await expect(manifesto.title).toBeVisible();
        await expect(manifesto.document).toHaveAttribute('lang', 'fr');
    });

    test('on peut passer du manifeste français au manifeste anglais', async ({ page }) => {
        const frenchManifesto = new ManifestoPage(page, 'fr');
        await frenchManifesto.goto();

        const englishManifesto = await frenchManifesto.switchLanguage();

        await expect(page).toHaveURL(englishManifesto.url);
        await expect(englishManifesto.title).toBeVisible();
    });
});

test.describe('Green Craft manifesto in English', () => {
    test.use({ locale: languages.en.locale });

    test('the manifesto is reachable from the home page', async ({ page }) => {
        const home = new HomePage(page, 'en');
        await home.goto();

        const manifesto = await home.openFullManifesto();

        await expect(page).toHaveURL(manifesto.url);
        await expect(manifesto.title).toBeVisible();
        await expect(manifesto.document).toHaveAttribute('lang', 'en');
    });
});
