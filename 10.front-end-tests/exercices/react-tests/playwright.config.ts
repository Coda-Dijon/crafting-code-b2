import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    reporter: [["html", { open: "never" }]],
    use: {
        baseURL: "http://localhost:3001",
        headless: true,
        screenshot: "only-on-failure",
        video: "on-first-retry",
    },
    webServer: {
        command: "npm start",
        port: 3001,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});