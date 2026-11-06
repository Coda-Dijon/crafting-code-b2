---
layout: section
number: 6
part: Tests paramétrés
---

# Tests <mark>paramétrés</mark>

Séparer la logique de vérification des données d'entrée.

---

<span class="kicker">Connexion · en binôme</span>

# Qu'est-ce qui peut être amélioré ?

<div class="cols cols--wide-left">
<div>

```java
class CalculatorTests {
    @Test
    void shouldSupportAdd() {
        var calculator = new Calculator();
        var result = calculator.calculate(9, 3, Calculator.ADD);
        assertEquals(12, result);
    }

    @Test
    void shouldSupportMultiply() {
        var calculator = new Calculator();
        var result = calculator.calculate(3, 76, Calculator.MULTIPLY);
        assertEquals(228, result);
    }

    // ... shouldSupportDivide, shouldSupportSubtract

    @Test
    void shouldThrowWhenOperatorIsNotSupported() {
        var calculator = new Calculator();
        assertThrows(IllegalArgumentException.class,
            () -> calculator.calculate(9, 3, "unsupported"));
    }
}
```

</div>
<div v-click>

### Correction

- **Duplication** : le code d'assertion est répété dans chaque test
- **Instanciation inutile** : un nouveau `Calculator` par test, alors qu'il n'a pas d'état
- **Assertions faibles** : `assertEquals` donne peu de contexte en cas d'échec, préférer AssertJ

</div>
</div>

---

<span class="kicker">Concepts</span>

# Pourquoi paramétrer ses tests ?

Quand plusieurs tests vérifient le **même comportement** avec des données différentes, la duplication devient un problème :

- un bug dans la logique d'assertion se corrige à N endroits
- ajouter un nouveau cas exige de dupliquer un test entier
- le signal/bruit est mauvais : on voit les données, pas l'intention

> Les **tests paramétrés** séparent proprement la **logique de vérification** des **données d'entrée**.

---

<span class="kicker">Concepts · JUnit 5</span>

# Anatomie d'un test paramétré

<div class="cols">
<div>

```java
@ParameterizedTest          // ① déclare un test paramétré
@CsvSource({                // ② fournit les jeux de données
    "input1, expected1",
    "input2, expected2"
})
void shouldBehaveCorrectly(String input, String expected) {
    // ③ chaque ligne est injectée comme arguments
    assertThat(sut.process(input)).isEqualTo(expected);
}
```

</div>
<div v-click>

| Annotation      | Usage                                         |
|-----------------|-----------------------------------------------|
| `@ValueSource`  | Un seul paramètre, valeur primitive ou String |
| `@CsvSource`    | Plusieurs paramètres, données inline          |
| `@MethodSource` | Données complexes (objets, nulls, streams)    |
| `@EnumSource`   | Valeurs d'un enum                             |

</div>
</div>

---

<span class="kicker">Concepts · JUnit 5</span>

# `@ValueSource` et `@CsvSource`

<div class="cols">
<div>

### Un seul paramètre

```java
@ParameterizedTest
@ValueSource(strings = {"", " ", "\t", "\n"})
void shouldReturnTrueForBlankStrings(String input) {
    assertThat(input.isBlank()).isTrue();
}

@ParameterizedTest
@ValueSource(ints = {1, 3, 5, 7, 11, 13})
void shouldRecognizeOddNumbers(int number) {
    assertThat(number % 2).isNotEqualTo(0);
}
```

</div>
<div v-click>

### Plusieurs paramètres inline

L'équivalent de `[InlineData]` en xUnit.

```java
@ParameterizedTest
@CsvSource({
    "bonjour, BONJOUR",
    "Hello,   HELLO",
    "java,    JAVA"
})
void shouldConvertToUpperCase(String input, String expected) {
    assertThat(input.toUpperCase()).isEqualTo(expected);
}
```

> Pour passer `null`, utilisez `'null'` dans `@CsvSource`, ou préférez `@MethodSource`.

</div>
</div>

---

<span class="kicker">Concepts · JUnit 5</span>

# `@MethodSource` : données complexes

Quand `@CsvSource` ne suffit pas (objets, nulls, types non primitifs), une méthode statique fournit un `Stream<Arguments>`.

```java
static Stream<Arguments> invalidPasswords() {
    return Stream.of(
        Arguments.of(null,       "Password cannot be null"),
        Arguments.of("",         "Password cannot be empty"),
        Arguments.of("abc",      "Password must be at least 8 characters"),
        Arguments.of("abcdefgh", "Password must contain a digit")
    );
}

@ParameterizedTest
@MethodSource("invalidPasswords")
void shouldRejectInvalidPassword(String password, String expectedMessage) {
    assertThatThrownBy(() -> PasswordValidator.validate(password))
        .hasMessage(expectedMessage);
}
```

---

<span class="kicker">Concepts</span>

# Règle d'or : jamais de conditions dans un test paramétré

<div class="cols">
<div>

```java
// ❌ Branchement dans le test
@ParameterizedTest
@CsvSource({
    "9, 3, add,    12, ''",
    "2, 0, divide, '', ArithmeticException"
})
void shouldCalculate(int a, int b, String op,
                     Integer expected, String exceptionType) {
    if (exceptionType.isEmpty()) {
        assertThat(calculator.calculate(a, b, op))
            .isEqualTo(expected);
    } else {
        assertThrows(ArithmeticException.class,
            () -> calculator.calculate(a, b, op));
    }
}
```

Un test avec une condition teste **deux comportements différents**.

</div>
<div v-click>

```java
// ✅ Deux tests, chacun avec une intention claire
@ParameterizedTest
@CsvSource({"9, 3, add, 12", "3, 76, multiply, 228"})
void shouldReturnCorrectResult(int a, int b,
                               String op, int expected) {
    assertThat(calculator.calculate(a, b, op))
        .isEqualTo(expected);
}

@Test
void shouldThrowWhenDividingByZero() {
    assertThatThrownBy(() -> calculator.calculate(2, 0, "divide"))
        .isInstanceOf(ArithmeticException.class);
}
```

</div>
</div>

---

<span class="kicker">Démo · refactoring pas à pas</span>

# Étapes 1 et 2 : préparer l'extraction

> Traitez votre code de test avec le même soin que votre code de production.

<div class="cols">
<div>

**Étape 1** : extraire les variables

```java
@Test
void shouldSupportAdd() {
    var calculator = new Calculator();
    int a = 9, b = 3;
    var operator = Calculator.ADD;
    int expected = 12;

    var result = calculator.calculate(a, b, operator);

    assertThat(result).isEqualTo(expected);
}
```

</div>
<div v-click>

**Étape 2** : partager l'instance et extraire une méthode

```java
class CalculatorTests {
    private final Calculator calculator = new Calculator();

    private void shouldSupportOperation(
            int a, int b, String operator, int expected) {
        assertThat(calculator.calculate(a, b, operator))
            .isEqualTo(expected);
    }
}
```

</div>
</div>

---

<span class="kicker">Démo · refactoring pas à pas</span>

# Étapes 3 et 4 : paramétrer, garder les cas limites à part

```java
class CalculatorTests {
    private final Calculator calculator = new Calculator();

    @ParameterizedTest
    @CsvSource({
        "9,  3,  add,      12",
        "3,  76, multiply, 228",
        "9,  3,  divide,   3",
        "9,  3,  subtract, 6"
    })
    void shouldSupportOperation(int a, int b, String operator, int expected) {
        assertThat(calculator.calculate(a, b, operator)).isEqualTo(expected);
    }

    @Test
    void shouldThrowWhenOperatorIsNotSupported() {
        assertThatThrownBy(() -> calculator.calculate(1, 3, "unsupported"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Not supported operator");
    }
}
```

---

<span class="kicker">Pratique concrète · en binôme</span>

# Test it or Die Trying

<div class="cols">
<div>

### Calculator

- Identifiez les problèmes de `CalculatorShould` (duplication, assertions faibles...)
- Refactorez avec `@ParameterizedTest` et `@CsvSource`
- Gardez les cas limites dans des tests séparés

> Ne modifiez pas le code de production.

</div>
<div v-click>

### TimeUtility

- Écrivez le test le plus simple possible : quel problème rencontrez-vous ?
- Comment rendre ce code **testable** ?
- Identifiez les exemples (cas nominaux et limites) et implémentez-les en `@ParameterizedTest`

> Never trust a test that you have not seen fail.

</div>
</div>

<Exercise path="06.parameterized-tests/exercices/test-it-or-die-trying" />

---

<span class="kicker">Conclusions · en groupe</span>

# Qu'avez-vous appris ?

- Qu'avez-vous appris sur les tests paramétrés ?
- Dans quels cas est-ce une bonne idée ? Dans quels cas vaut-il mieux rester sur des **tests séparés** ?
- Comment cela impacte-t-il la **maintenabilité** et la **lisibilité** de la suite de tests ?

### Ressources

- [JUnit 5 : guide des tests paramétrés](https://junit.org/junit5/docs/current/user-guide/#writing-tests-parameterized-tests)
- [AssertJ](https://assertj.github.io/doc/)
- [Unit Testing : Principles, Practices and Patterns](https://www.manning.com/books/unit-testing), Vladimir Khorikov
