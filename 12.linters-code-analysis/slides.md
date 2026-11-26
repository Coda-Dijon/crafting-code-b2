---
layout: section
number: 12
part: Linters et analyse statique
---

# Linters et <mark>analyse statique</mark>

Automatiser la partie mécanique de la revue, pour se concentrer sur ce qui compte.

---
class: dense
---

<span class="kicker">Connexion · en binôme</span>

# Où ça se place ?

Quel outil détecterait **en premier** chacun de ces problèmes ?

| #  | Problème observé dans le code                                    | Formatter | Linter | Analyse statique | Tests | Revue humaine |
|----|------------------------------------------------------------------|-----------|--------|------------------|-------|---------------|
| 1  | Indentation incohérente (2 espaces ici, 4 ailleurs)              |           |        |                  |       |               |
| 2  | Variable déclarée mais jamais utilisée                           |           |        |                  |       |               |
| 3  | Appel à `.get()` sans vérifier si la valeur est `null`           |           |        |                  |       |               |
| 4  | Méthode de 200 lignes avec 15 niveaux d'imbrication              |           |        |                  |       |               |
| 5  | Requête SQL construite par concaténation de chaînes              |           |        |                  |       |               |
| 6  | Logique métier incorrecte (calcul de TVA erroné)                 |           |        |                  |       |               |
| 7  | Bloc `catch (Exception e) {}` qui avale silencieusement l'erreur |           |        |                  |       |               |
| 8  | Accolades manquantes après un `if`                               |           |        |                  |       |               |
| 9  | Nommage obscur : `int x2 = f(a, b) * q;`                         |           |        |                  |       |               |
| 10 | Code copié-collé 3 fois avec une légère variation                |           |        |                  |       |               |

> Certains problèmes ont plusieurs bonnes réponses : c'est le débat qui compte.

---

<span class="kicker">Concepts</span>

# Qu'est-ce qu'un linter ?

<div class="cols">
<div>

Un outil d'analyse statique qui inspecte le code **sans l'exécuter**. Il détecte :

- Les **erreurs de syntaxe** avant la compilation
- Les **mauvaises pratiques** (variables inutilisées, conditions toujours vraies...)
- Les **violations de conventions** d'équipe ou de langage

> Le terme vient de `lint`, un outil Unix des années 70 qui analysait le code C.

</div>
<div v-click>

| Sans linter                                       | Avec linter                                   |
|---------------------------------------------------|-----------------------------------------------|
| Bugs de style détectés en code review             | Détectés automatiquement avant le commit      |
| Conventions appliquées à la main                  | Le linter est la référence commune            |
| Reviewers occupés par le superficiel              | La revue se concentre sur logique et archi    |
| Les nouveaux ne connaissent pas les règles        | Le linter enseigne les conventions à la volée |

</div>
</div>

---

<span class="kicker">Concepts</span>

# Formatter, linter, analyse statique

| Outil                | Ce qu'il fait                                       | Modifie le code    | Exemples                |
|----------------------|-----------------------------------------------------|--------------------|-------------------------|
| **Formatter**        | Reformate le style (indentation, espaces, retours)  | Oui                | Prettier, Black, gofmt  |
| **Linter**           | Signale les mauvaises pratiques et erreurs logiques | Non (ou optionnel) | ESLint, Checkstyle, PMD |
| **Analyse statique** | Détecte bugs, failles de sécurité, code smells      | Non                | SonarQube, SpotBugs     |

```text
                ┌─→ Formatter ──────── reformate ──→ Code reformaté
Code source ────┼─→ Linter ─────────── signale ────→ Warnings / erreurs
                └─→ Analyse statique ─ rapport ────→ Rapport qualité
```

> La frontière est floue (SonarQube combine tout), mais la distinction conceptuelle reste utile.

---

<span class="kicker">Concepts · qualimétrie</span>

# La complexité cyclomatique

<div class="cols">
<div>

Le nombre de chemins d'exécution indépendants. Elle augmente à chaque `if`, `for`, `while`, `case`, `catch`.

```java
// Complexité = 1 (aucune branche)
public String greet(String name) {
    return "Hello, " + name;
}

// Complexité = 3 (2 branches)
public String classify(int score) {
    if (score >= 90) {           // +1
        return "Excellent";
    } else if (score >= 60) {    // +1
        return "Passable";
    }
    return "Insuffisant";
}
```

</div>
<div v-click>

| Complexité | Interprétation          | Risque   |
|------------|-------------------------|----------|
| 1–5        | Simple, facile à tester | Faible   |
| 6–10       | Modérée                 | Modéré   |
| 11–20      | Complexe                | Élevé    |
| > 20       | Impossible à tester     | Critique |

> Au-delà de 10, une méthode fait souvent trop de choses.

</div>
</div>

---

<span class="kicker">Concepts · qualimétrie</span>

# Duplication et couverture

<div class="cols">
<div>

### Duplication de code

Un taux élevé est un **code smell** majeur :

- Un bug corrigé à un endroit... oublié aux 3 autres
- Évolution difficile et risquée
- Signal : extraire une abstraction commune

</div>
<div v-click>

### Couverture de tests

Le **pourcentage de lignes / branches** exercées par les tests. Nécessaire, mais pas suffisant :

> 100 % de couverture ne signifie pas que les tests sont bons, seulement qu'ils s'exécutent.

</div>
</div>

---

<span class="kicker">Concepts</span>

# SonarQube / SonarCloud

<div class="cols">
<div>

| Catégorie             | Description                                      |
|-----------------------|--------------------------------------------------|
| **Bugs**              | Erreurs probables à l'exécution (null pointer…)  |
| **Vulnerabilities**   | Failles (injection SQL, secrets exposés…)        |
| **Code Smells**       | Mauvaises pratiques qui dégradent la maintenance |
| **Duplication**       | Blocs de code dupliqués                          |
| **Coverage**          | Couverture de tests (lancés en CI)               |
| **Security Hotspots** | Code sensible qui mérite une revue humaine       |

</div>
<div v-click>

### Quality Gate

Les seuils minimaux pour qu'un build soit "sain" :

```text
✅ Coverage on new code ≥ 80%
✅ Duplicated lines on new code ≤ 3%
✅ No new bugs
✅ No new vulnerabilities
❌ Reliability rating ≥ A
```

> Quality Gate en échec → pipeline bloqué. C'est la règle, pas une suggestion.

</div>
</div>

---

<span class="kicker">Démo · SonarCloud</span>

# Jurassic Code

Explorons le projet [Jurassic Code sur SonarCloud](https://sonarcloud.io/project/overview?id=ythirion_jurassic-code) :

- Combien de **code smells** sont détectés ?
- Quelle est la **complexité cyclomatique** maximale ?
- Y a-t-il des **hotspots de sécurité** ?
- Le **Quality Gate** est-il passé ?

---

<span class="kicker">Concepts · feedback en temps réel</span>

# Ramener l'analyse dans l'IDE

<div class="cols">
<div>

### [SonarQube for IDE](https://www.sonarsource.com/products/sonarqube/ide/)

- IntelliJ, VS Code, Eclipse, Visual Studio
- Analyse en temps réel, même hors connexion
- Se **connecte à SonarCloud** pour partager les règles du CI
- Explique chaque règle avec des exemples de correction

```text
⚠️ squid:S2259 — NullPointerException
"user" can be null here.

if (user.getName().equals("admin")) { ... }
     ^^^^
```

</div>
<div v-click>

### [CodeScene](https://plugins.jetbrains.com/plugin/25401-codescene)

Analyse l'**historique git** pour identifier les zones à risque.

| Fonctionnalité             | Ce que ça détecte                                  |
|----------------------------|----------------------------------------------------|
| **Hotspots**               | Fichiers souvent modifiés ET complexes             |
| **Code Health**            | Score basé sur les code smells pondérés            |
| **Couplage temporel**      | Fichiers modifiés ensemble → couplage caché        |
| **Knowledge distribution** | Zones maîtrisées par une seule personne            |

> Un fichier complexe rarement touché est moins risqué qu'un fichier simple modifié tous les jours.

</div>
</div>

---

<span class="kicker">Pratique concrète · en binôme</span>

# Gift Registry avec SonarQube for IDE

<div class="cols">
<div>

### Étape 1 : explorer

1. Installez **SonarQube for IDE**
2. Ouvrez le projet dans le langage de votre choix (C#, Java, TypeScript)
3. Identifiez les problèmes signalés, sans lancer les tests
4. Pour chacun : comprenez la règle, lisez l'explication, proposez une correction

</div>
<div v-click>

### Étape 2 : corriger et observer

Corrigez les problèmes un à un et observez la réaction du linter en temps réel.

> Le linter a-t-il détecté des problèmes que la revue manuelle aurait manqués ?

</div>
</div>

<Exercise path="12.linters-code-analysis/exercices/gift-registry" />

---
class: dense
---

<span class="kicker">Ressources</span>

# Pour aller plus loin

- [SonarQube Rules : catalogue complet](https://rules.sonarsource.com/)
- [SonarQube for IDE : documentation](https://docs.sonarsource.com/sonarqube-for-ide/)
- [CodeScene : How It Works](https://codescene.com/product/how-it-works)
- [Your Code as a Crime Scene](https://pragprog.com/titles/atcrime2/your-code-as-a-crime-scene-second-edition/), Adam Tornhill
- [Checkstyle](https://checkstyle.sourceforge.io/) · [ESLint](https://eslint.org/) · [PMD](https://pmd.github.io/)
- [Cyclomatic Complexity](https://martinfowler.com/bliki/CyclomaticComplexity.html), Martin Fowler
- [Static Analysis](https://en.wikipedia.org/wiki/Static_program_analysis), Wikipedia
