import { test, expect } from '@playwright/test';

test.describe('Form Rendering — Snapshot Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // getByRole('button') — sélecteur ARIA, résistant aux refactorings CSS
        await page.getByRole('button', { name: 'Show Form' }).click();
    });

    test('renders the initial form correctly', async ({ page }) => {
        // getByRole('form') avec accessible name — plus précis que locator('form')
        const form = page.getByRole('form', { name: 'Contact form' });
        await expect(form).toHaveScreenshot('form-rendering.png');
    });

    test('renders the name field with its label', async ({ page }) => {
        // getByLabel — vérifie l'association label/input (accessibilité)
        const nameInput = page.getByLabel('Name:');
        await expect(nameInput).toBeVisible();
        await expect(nameInput).toHaveAttribute('type', 'text');
        await expect(nameInput).toHaveAttribute('aria-required', 'true');
    });

    test('renders the email field with its label', async ({ page }) => {
        const emailInput = page.getByLabel('Email:');
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toHaveAttribute('type', 'email');
        await expect(emailInput).toHaveAttribute('aria-required', 'true');
    });

    test('renders the submit button', async ({ page }) => {
        const submitButton = page.getByRole('button', { name: 'Submit' });
        await expect(submitButton).toBeVisible();
        await expect(submitButton).toHaveAttribute('type', 'submit');
    });
});
