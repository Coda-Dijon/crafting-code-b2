export type Language = 'fr' | 'en';

// Tout ce qui dépend de la langue est rassemblé ici :
// si le site change un libellé, c'est le seul endroit à modifier.
export const languages = {
    fr: {
        locale: 'fr-FR',
        homePath: '/',
        manifestoPath: '/manifeste',
        manifestoUrl: /^https:\/\/green-craft\.fr\/manifeste/,
        fullManifestoLink: /le manifeste complet/i,
        manifestoTitle: "Manifeste pour l'artisanat logiciel responsable",
        switchLanguageLink: 'Switch to English version',
    },
    en: {
        locale: 'en-US',
        homePath: '/en/',
        manifestoPath: '/en/manifeste.html',
        manifestoUrl: /^https:\/\/green-craft\.fr\/en\/manifeste/,
        fullManifestoLink: /the full manifesto/i,
        manifestoTitle: 'Manifesto for Responsible Software Craftsmanship',
        switchLanguageLink: 'Passer à la version française',
    },
} as const;

export const otherLanguage = (language: Language): Language =>
    language === 'fr' ? 'en' : 'fr';
