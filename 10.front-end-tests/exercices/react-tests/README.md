# Test it or Die Trying : tests front-end

Une petite application React (compteur + formulaire de contact) testée à tous les étages : Vitest pour l'unitaire, Playwright pour les composants, l'intégration, l'E2E et l'accessibilité.

## Lancer les tests

```bash
# Installer les dépendances (première fois)
npm install
npx playwright install

# Tests unitaires (Vitest)
npm run test:unit

# Tests Playwright (composants + intégration + e2e)
npm run test:e2e

# Tous les tests
npm test

# Mode UI Playwright : debug visuel
npx playwright test --ui

# Mettre à jour les snapshots
npx playwright test tests/components --update-snapshots

# Enregistrer un parcours avec Playwright Codegen
npm run recorder
```

## Structure du projet

```
react-tests/
├── src/
│   ├── App.tsx              # Composant principal (ARIA : aria-expanded, aria-controls)
│   ├── Form.tsx             # Formulaire (ARIA : htmlFor/id, role="status", aria-live)
│   └── utils/
│       ├── validation.ts    # Logique pure, testée avec Vitest
│       └── validation.test.ts
├── tests/
│   ├── components/          # Snapshot tests (rendu visuel)
│   ├── integration/         # Tests avec mock réseau
│   ├── e2e/                 # Tests de bout en bout
│   └── accessibility/       # Tests d'accessibilité (axe-core)
├── playwright.config.ts
└── vite.config.ts           # Inclut la config Vitest
```

## À vous de jouer

1. Lancer `npm run test:unit` : tous les tests Vitest passent ?
2. Lancer `npm run test:e2e` : tous les tests Playwright passent ?
3. Modifier `Form.tsx` : supprimer l'attribut `role="status"` du `<p>` de statut.
   Quel(s) test(s) échoue(nt) ? Pourquoi ?
4. Ajouter un champ `telephone` au formulaire avec son label.
   Écrire le test d'intégration correspondant avec `getByLabel`.
5. Inspecter le test généré par le recorder (`recorded.spec.ts`).
   Quels sélecteurs utilisés sont fragiles ? Les remplacer par des sélecteurs ARIA.
6. Ajouter les tests d'accessibilité avec `@axe-core/playwright` (un `describe` par référentiel : RGAA, WCAG).
