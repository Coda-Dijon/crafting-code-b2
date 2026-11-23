import { defineConfig } from "@playwright/test";

// Ces tests visent un site en ligne : pas de webServer local à démarrer.
// Le réseau peut être instable, d'où un retry.
export default defineConfig({
    testDir: "./tests",
    reporter: [["html", { open: "never" }]],
    retries: 1,
    use: {
        baseURL: "https://green-craft.fr",
        headless: true,
        screenshot: "only-on-failure",
        video: "on-first-retry",
    },
});
