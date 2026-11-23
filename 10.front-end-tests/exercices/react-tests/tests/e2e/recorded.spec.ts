import {expect, test} from '@playwright/test';

test.describe('Main page', () => {
    test('Count should be 4', async ({page}) => {
        await page.goto('/');
        await page.getByRole('button', {name: 'count is'}).click();
        await page.getByRole('button', {name: 'count is'}).click();
        await page.getByRole('button', {name: 'count is'}).click();
        await page.getByRole('button', {name: 'count is'}).click();
        await page.getByText('Click on the Vite and React').click();

        await expect(page.getByRole('button', {name: 'count is'}))
            .toHaveText('count is 4');
    })
});