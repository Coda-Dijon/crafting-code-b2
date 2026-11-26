import { expect, test } from '@playwright/test';

test.describe('Composer', () => {
    test('shows the remaining characters while typing', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('Votre message').fill('Bonjour');

        await expect(page.getByRole('status')).toHaveText('273 caractères restants');
    });

    test('publishes a message in the timeline', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('Votre message').fill('Bonjour Coda !');
        await page.getByRole('button', { name: 'Publier' }).click();

        await expect(page.getByRole('list', { name: 'Messages publiés' }))
            .toContainText('Bonjour Coda !');
        await expect(page.getByLabel('Votre message')).toBeEmpty();
    });
});
