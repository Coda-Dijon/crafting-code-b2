import { test, expect } from '@playwright/test';

test.describe('App Component', () => {
    test('should render the React logo and link', async ({ page }) => {
        await page.goto('/');

        // Sélecteur ARIA : getByRole('img') + name = alt text
        const reactLogo = page.getByRole('img', { name: 'React logo' });
        await expect(reactLogo).toBeVisible();

        // Sélecteur ARIA : getByRole('link') + name
        const reactLink = page.getByRole('link', { name: 'React logo' });
        await expect(reactLink).toHaveAttribute('href', 'https://react.dev');
    });

    test('should display the correct title', async ({ page }) => {
        await page.goto('/');

        // Sélecteur ARIA : getByRole('heading') — résistant aux changements de style
        const title = page.getByRole('heading', { name: 'Vite + React', level: 1 });
        await expect(title).toBeVisible();
    });

    test('should increment the counter when the counter button is clicked', async ({ page }) => {
        await page.goto('/');

        // getByRole('button') — accessible label via aria-label
        const counterButton = page.getByRole('button', { name: /Increment counter/ });

        await expect(counterButton).toHaveText('count is 0');

        await counterButton.click();
        await expect(counterButton).toHaveText('count is 1');

        await counterButton.click();
        await expect(counterButton).toHaveText('count is 2');
    });

    test('should display the footer text', async ({ page }) => {
        await page.goto('/');

        // getByText — quand le contenu visible est suffisamment unique
        const footer = page.getByText('Click on the Vite and React logos to learn more');
        await expect(footer).toBeVisible();
    });

    test('should show and hide the form when the toggle button is clicked', async ({ page }) => {
        await page.goto('/');

        // getByRole('button') avec name exact
        const toggleButton = page.getByRole('button', { name: 'Show Form' });
        await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

        await toggleButton.click();

        // getByRole('form') avec accessible name (aria-label sur <form>)
        await expect(page.getByRole('form', { name: 'Contact form' })).toBeVisible();

        const hideButton = page.getByRole('button', { name: 'Hide Form' });
        await expect(hideButton).toHaveAttribute('aria-expanded', 'true');

        await hideButton.click();
        await expect(page.getByRole('form', { name: 'Contact form' })).not.toBeVisible();
    });
});
