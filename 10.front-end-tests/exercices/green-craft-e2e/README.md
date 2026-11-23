# Tests E2E sur un site en ligne : Green Craft

Un projet Playwright à part, qui teste un site réel : [green-craft.fr](https://green-craft.fr/).

Le parcours à protéger : **le manifeste est accessible en français et en anglais**.

Les tests utilisent le **Page Object Model** : les scénarios décrivent l'intention, les détails d'UI (libellés, URLs, sélecteurs) sont rangés dans `tests/pages`.

## Lancer les tests

```bash
# Installer les dépendances (première fois)
npm install
npx playwright install chromium

# Lancer les tests
npm test

# Voir le navigateur pendant les tests
npm run test:headed

# Enregistrer un parcours avec Playwright Codegen
npm run recorder
```

## Structure du projet

```
green-craft-e2e/
├── tests/
│   ├── manifesto.spec.ts    # Les scénarios : ils expriment l'intention
│   └── pages/               # Page Object Model : les détails d'UI
│       ├── HomePage.ts      # Page d'accueil (lien vers le manifeste complet)
│       ├── ManifestoPage.ts # Manifeste (titre, changement de langue)
│       └── languages.ts     # Libellés et URLs par langue (fr, en)
└── playwright.config.ts     # baseURL en ligne, pas de webServer local
```

## À vous de jouer

1. Lancez `npm test` : les 3 scénarios passent ?
2. Lisez `manifesto.spec.ts`. Pourquoi chaque `describe` fixe-t-il la `locale` du navigateur ?
   Retirez `test.use({ locale: 'fr-FR' })` et relancez : que se passe-t-il ?
3. Pourquoi ces tests sont-ils dans un **projet à part**, et pas dans la suite de l'application ?
4. Lisez les Page Objects dans `tests/pages`. Que faudrait-il modifier si le site renommait le lien « Switch to English version » ? Et sans POM ?
5. Ajoutez le scénario retour : depuis le manifeste anglais, revenir au manifeste français. Avez-vous eu besoin de toucher aux Page Objects ?
6. Enregistrez un parcours avec `npm run recorder` (par exemple : ouvrir « Explorer les valeurs en détail »).
   Révisez le code généré : sélecteurs ARIA uniquement, puis extrayez une `ValuesPage` sur le modèle de `ManifestoPage`.
