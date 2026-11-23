import type { Locator, Page } from '@playwright/test';
import { type Language, languages, otherLanguage } from './languages';

export class ManifestoPage {
    readonly title: Locator;
    readonly document: Locator;
    readonly url: RegExp;
    private readonly switchLanguageLink: Locator;

    constructor(private readonly page: Page, private readonly language: Language) {
        const texts = languages[language];

        this.title = page.getByRole('heading', { name: texts.manifestoTitle });
        this.document = page.locator('html');
        this.url = texts.manifestoUrl;
        this.switchLanguageLink = page.getByRole('link', { name: texts.switchLanguageLink });
    }

    async goto(): Promise<void> {
        await this.page.goto(languages[this.language].manifestoPath);
    }

    async switchLanguage(): Promise<ManifestoPage> {
        await this.switchLanguageLink.click();
        return new ManifestoPage(this.page, otherLanguage(this.language));
    }
}
