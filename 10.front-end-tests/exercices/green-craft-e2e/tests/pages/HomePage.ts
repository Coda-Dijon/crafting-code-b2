import type { Locator, Page } from '@playwright/test';
import { type Language, languages } from './languages';
import { ManifestoPage } from './ManifestoPage';

export class HomePage {
    private readonly fullManifestoLink: Locator;

    constructor(private readonly page: Page, private readonly language: Language) {
        this.fullManifestoLink = page.getByRole('link', { name: languages[language].fullManifestoLink });
    }

    async goto(): Promise<void> {
        await this.page.goto(languages[this.language].homePath);
    }

    async openFullManifesto(): Promise<ManifestoPage> {
        await this.fullManifestoLink.click();
        return new ManifestoPage(this.page, this.language);
    }
}
