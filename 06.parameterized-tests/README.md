# Tests Paramétrés

## Qu'est-ce qui peut être amélioré ?

Observez les tests ci-dessous. En binôme, identifiez ce qui peut être amélioré.

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

    @Test
    void shouldSupportDivide() {
        var calculator = new Calculator();
        var result = calculator.calculate(9, 3, Calculator.DIVIDE);
        assertEquals(3, result);
    }

    @Test
    void shouldSupportSubtract() {
        var calculator = new Calculator();
        var result = calculator.calculate(9, 3, Calculator.SUBTRACT);
        assertEquals(6, result);
    }

    @Test
    void shouldThrowWhenOperatorIsNotSupported() {
        var calculator = new Calculator();
        assertThrows(IllegalArgumentException.class,
            () -> calculator.calculate(9, 3, "unsupported"));
    }
}
```

<details>
  <summary>Correction</summary>

- **Duplication** : le code d'assertion est répété dans chaque test
- **Instanciation inutile** : un nouveau `Calculator` est créé par test, alors qu'il n'a pas d'état
- **Assertions faibles** : `assertEquals` donne peu de contexte en cas d'échec — préférer AssertJ

</details>

---

## Tests Paramétrés avec JUnit 5

### Pourquoi paramétrer ses tests ?

Quand plusieurs tests vérifient le **même comportement** avec des données différentes, la duplication devient un problème :

- un bug dans la logique d'assertion se corrige à N endroits
- ajouter un nouveau cas exige de dupliquer un test entier
- le signal/bruit est mauvais : on voit les données, pas l'intention

Les **tests paramétrés** permettent de séparer proprement la **logique de vérification** des **données d'entrée**.

---

### Anatomie d'un test paramétré JUnit 5

```java
@ParameterizedTest          // ① déclare un test paramétré
@CsvSource({                // ② fournit les jeux de données
    "input1, expected1",
    "input2, expected2"
})
void shouldBehaveCorrectly(String input, String expected) {
    // ③ le framework injecte chaque ligne comme arguments
    assertThat(sut.process(input)).isEqualTo(expected);
}
```

JUnit 5 propose plusieurs **sources de données** selon la complexité des cas :

| Annotation      | Usage                                         |
|-----------------|-----------------------------------------------|
| `@ValueSource`  | Un seul paramètre, valeur primitive ou String |
| `@CsvSource`    | Plusieurs paramètres, données inline          |
| `@MethodSource` | Données complexes (objets, nulls, streams)    |
| `@EnumSource`   | Passer des valeurs d'un enum                  |

---

### `@ValueSource` — un seul paramètre

Utile pour tester un comportement sur une liste de valeurs simples.

```java
@ParameterizedTest
@ValueSource(strings = {"", " ", "\t", "\n"})
void shouldReturnTrueForBlankStrings(String input) {
    assertThat(input.isBlank()).isTrue();
}
```

```java
@ParameterizedTest
@ValueSource(ints = {1, 3, 5, 7, 11, 13})
void shouldRecognizeOddNumbers(int number) {
    assertThat(number % 2).isNotEqualTo(0);
}
```

---

### `@CsvSource` — plusieurs paramètres inline

L'équivalent direct de `[InlineData]` en xUnit. Chaque ligne est un jeu de données.

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

> Pour passer une valeur `null`, utilisez la chaîne littérale `'null'` dans `@CsvSource`, ou préférez `@MethodSource`.

---

### `@MethodSource` — données complexes

Quand `@CsvSource` ne suffit pas (objets, nulls, types non primitifs), on délègue la fourniture des données à une méthode statique qui retourne un `Stream<Arguments>`.

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

### Règle d'or : jamais de conditions dans un test paramétré

Il peut être tentant de gérer plusieurs comportements dans un seul test paramétré :

```java
// ❌ À éviter : branchement dans le test
@ParameterizedTest
@CsvSource({
    "9, 3, add,         12,   ''",
    "2, 0, divide,      '',   ArithmeticException"
})
void shouldCalculate(int a, int b, String op, Integer expected, String exceptionType) {
    if (exceptionType.isEmpty()) {
        assertThat(calculator.calculate(a, b, op)).isEqualTo(expected);
    } else {
        assertThrows(ArithmeticException.class, () -> calculator.calculate(a, b, op));
    }
}
```

Un test avec une condition teste en réalité **deux comportements différents**. Séparez-les :

```java
// ✅ Deux tests distincts, chacun avec une intention claire
@ParameterizedTest
@CsvSource({"9, 3, add, 12", "3, 76, multiply, 228"})
void shouldReturnCorrectResult(int a, int b, String op, int expected) {
    assertThat(calculator.calculate(a, b, op)).isEqualTo(expected);
}

@Test
void shouldThrowWhenDividingByZero() {
    assertThatThrownBy(() -> calculator.calculate(2, 0, "divide"))
        .isInstanceOf(ArithmeticException.class);
}
```

---

### Demo — Refactoring pas à pas

En partant des tests de la section **précédente**, refactorons-les ensemble en `@ParameterizedTest`.

<details>
  <summary>Déroulé pas à pas</summary>

> Traitez votre code de test avec le même soin que votre code de production.

**Étape 1** — Extraire les variables pour préparer l'extraction de méthode

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

**Étape 2** — Partager l'instance et extraire une méthode helper

```java
class CalculatorTests {
    private final Calculator calculator = new Calculator();

    private void shouldSupportOperation(int a, int b, String operator, int expected) {
        assertThat(calculator.calculate(a, b, operator)).isEqualTo(expected);
    }
}
```

**Étape 3** — Transformer en `@ParameterizedTest` avec `@CsvSource`

```java
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
```

**Étape 4** — Garder les cas limites séparés (pas de conditions !)

```java
@Test
void shouldThrowWhenOperatorIsNotSupported() {
    assertThatThrownBy(() -> calculator.calculate(1, 3, "unsupported"))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Not supported operator");
}
```

**Résultat final :**

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

</details>

---

## Test it or Die Trying

- [Java](java/how-to.md)

## Conclusion

- Qu'avez-vous appris sur les tests paramétrés ?
- Dans quels cas est-ce une bonne idée ? Dans quels cas vaut-il mieux rester sur des tests séparés ?
- Comment cela impacte-t-il la **maintenabilité** et la **lisibilité** de la suite de tests ?

## Ressources

- [JUnit 5 — Guide des tests paramétrés](https://junit.org/junit5/docs/current/user-guide/#writing-tests-parameterized-tests)
- [AssertJ — Documentation](https://assertj.github.io/doc/)
- [Unit Testing - Principles, Practices and Patterns — Vladimir Khorikov](../05.unit-tests/resources/unit-testing-principles-practices-patterns.pdf)
