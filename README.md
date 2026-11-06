![Crafting Code](public/crafting-code.webp)

[![Publish Slides](https://github.com/Coda-Dijon/crafting-code-b2/actions/workflows/slides.yml/badge.svg)](https://github.com/Coda-Dijon/crafting-code-b2/actions/workflows/slides.yml)

Les slides en ligne : **https://coda-dijon.github.io/crafting-code-b2**

## Objectifs pédagogiques
- Comprendre les origines, valeurs et pratiques du `Software Craftsmanship`
- Aligner les solutions techniques sur les problèmes métiers en utilisant des outils comme l'`Example Mapping` et l'`Event Storming`
- Analyser la `pyramide de tests` et créer une stratégie adaptée au contexte technique
- Pratiquer le `T.D.D` en appliquant des baby-steps et en optimisant les boucles de feedback
- Utiliser des `linters` et outils de `qualimétrie` pour évaluer et améliorer la qualité du code
- Configurer et optimiser des pipelines `CI/CD` pour automatiser les tests, la qualimétrie et le déploiement, en garantissant la qualité et la rapidité de livraison
- Diagnostiquer et `corriger des bugs` de manière structurée, en utilisant des outils adaptés
- Itérer sur du `code legacy` en créant une roadmap de refactoring sécurisée par des tests
- Collaborer activement en `pair programming` et `mob programming` pour co-construire des solutions techniques robustes, partager les connaissances en temps réel, et résoudre des défis complexes en s'appuyant sur l'intelligence collective
- Lier `qualité` du code et `éco-conception` pour réduire la dette technique et l'empreinte environnementale

## Organisation du dépôt

Le cours est un deck [Slidev](https://sli.dev). `slides.md` contient la couverture et importe, dans l'ordre, les slides de chaque partie.
Chaque partie a son dossier, avec ses slides (`slides.md`), ses images (`img/`) et ses exercices (`exercices/`) :

| Dossier                    | Partie                       | Exercices                                                                                                                                                                                                       |
|----------------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `01.craft`                 | Artisanat logiciel           | [Craft ou pas Craft ?](01.craft/exercices/craft-ou-pas-craft)                                                                                                                                                   |
| `02.code-quality`          | Et si on parlait qualité ?   | [Identifier les tests](02.code-quality/exercices/identifier-les-tests)                                                                                                                                          |
| `03.pair-programming`      | Pair Programming             | [Yatzy](03.pair-programming/exercices/yatzy)                                                                                                                                                                    |
| `04.code-review`           | Code Review                  | [Code Avengers](04.code-review/exercices/code-avengers)                                                                                                                                                         |
| `05.unit-tests`            | Tests unitaires              | [Test it or Die Trying](05.unit-tests/exercices/test-it-or-die-trying)                                                                                                                                          |
| `06.parameterized-tests`   | Tests paramétrés             | [Test it or Die Trying](06.parameterized-tests/exercices/test-it-or-die-trying)                                                                                                                                 |
| `07.test-doubles`          | Test Doubles                 | [Mockito](07.test-doubles/exercices/mockito)                                                                                                                                                                    |
| `08.clean-tests`           | Clean Tests                  | [Anti-patterns](08.clean-tests/exercices/anti-patterns)                                                                                                                                                         |
| `09.integraton-tests`      | Tests d'intégration          | [Grades API](09.integraton-tests/exercices/grades-api)                                                                                                                                                          |
| `10.front-end-tests`       | Tests front-end              | [React Tests](10.front-end-tests/exercices/react-tests)                                                                                                                                                         |
| `11.tdd`                   | TDD Inside-Out               | [Bouchonnois](11.tdd/exercices/bouchonnois), [CodaBuzz](11.tdd/exercices/codabuzz), [Roman Numerals](11.tdd/exercices/roman-numerals), [Mars Rover](11.tdd/exercices/mars-rover)                                |
| `12.linters-code-analysis` | Linters et analyse statique  | [Gift Registry](12.linters-code-analysis/exercices/gift-registry)                                                                                                                                               |
| `13.fix-a-bug`             | Corriger un bug              | [Shopping Cart](13.fix-a-bug/exercices/shopping-cart)                                                                                                                                                           |
| `14.legacy-code`           | Code legacy                  | [Trip Service](14.legacy-code/exercices/trip-service)                                                                                                                                                           |
| `15.ci-cd`                 | CI / CD                      | [Pipeline Yahtzee](15.ci-cd/exercices/yatzee)                                                                                                                                                                   |
| `16.green-crafting`        | Green crafting               | [Cinema API](16.green-crafting/exercices/cinema-api)                                                                                                                                                            |

Les évaluations sont dans [`evals/`](evals) et les oraux dans [`oral/`](oral).

Le thème (`theme/`) est celui du cours [50 nuances de T.D.D](https://github.com/Coda-Dijon/50-nuances-tdd-m1) (thème Signal, complété par `theme/styles/course.css` pour les éléments Markdown du cours).

## Lancer les slides en local

Prérequis : Node.js 20 ou plus.

```bash
npm install

# Serveur de développement (http://localhost:3030)
npm run dev

# Site statique dans dist/
npm run build

# Export PDF (nécessite playwright-chromium)
npm run export
```

Le déploiement sur GitHub Pages est fait par `.github/workflows/slides.yml` à chaque push sur `main`. L'URL du site (`SITE_URL`) et le dépôt des exercices (`VITE_REPO_URL`) y sont paramétrés : la base des slides est déduite de `SITE_URL`, et les encarts « Exercice » (composant `components/Exercise.vue`) pointent vers `VITE_REPO_URL`.

En présentation : `→` / `Espace` pour avancer, `o` pour la vue d'ensemble, `p` pour le mode présentateur (notes et slide suivante).
