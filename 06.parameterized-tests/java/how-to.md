# Test it or Die Trying

Le `pom.xml` contient déjà toutes les dépendances nécessaires : JUnit 5, AssertJ, Mockito.

## Calculator — Refactoring vers des tests paramétrés

Le fichier `CalculatorShould.java` contient des tests qui fonctionnent mais qui posent problème.

- Identifiez les problèmes (duplication, assertions faibles...)
- Refactorez-les en utilisant `@ParameterizedTest` avec `@CsvSource`
- Conservez les cas limites dans des tests séparés — pas de conditions dans un test paramétré

```java
// Dépendances à importer
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.assertj.core.api.Assertions.assertThat;
```

> Ne modifiez pas le code de production

## TimeUtility — Tests paramétrés sur un code couplé au temps

La classe `TimeUtility` retourne une période de la journée selon l'heure courante.

- Commencez par écrire le test le plus simple possible
  - Quel problème rencontrez-vous ?
  - Comment rendre ce code testable ?
- Identifiez les exemples à tester (cas nominaux et limites)
- Implémentez-les sous forme de `@ParameterizedTest`

```java
// Mockito est disponible pour isoler les dépendances
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
```

> Never trust a test that you have not seen fail
