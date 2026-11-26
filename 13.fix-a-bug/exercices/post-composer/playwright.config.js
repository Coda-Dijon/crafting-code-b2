import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    reporter: [['html', { open: 'never' }]],
    use: {
        baseURL: 'http://localhost:3002',
        headless: true,
        screenshot: 'only-on-failure',
    },
    webServer: {
        command: 'npm start',
        port: 3002,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});
