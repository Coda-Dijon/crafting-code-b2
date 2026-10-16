## Anti-patterns
### Anti-pattern 1 — Fuite d'implémentation dans les tests

```java
// ❌ Le test reproduit l'algorithme au lieu d'affirmer une valeur concrète
@Test
void discount_of_3_products_should_be_3_percent() {
    var products = List.of(new Product("P1"), new Product("P2"), new Product("P3"));
    var discount = PriceEngine.calculateDiscount(products.toArray(new Product[0]));

    assertThat(discount).isEqualTo(products.size() * 0.01); // ← on re-code la logique métier ici
}
```

<details>
  <summary>Solution</summary>

```java
// ✅ La valeur attendue est hardcodée — c'est ce qu'on veut vérifier
@Test
void discount_of_3_products_should_be_3_percent() {
    var products = List.of(new Product("P1"), new Product("P2"), new Product("P3"));
    var discount = PriceEngine.calculateDiscount(products.toArray(new Product[0]));

    assertThat(discount).isEqualTo(0.03);
}
```

Les valeurs "hardcodées" dans les tests sont une **bonne pratique** : elles représentent le résultat attendu du cas de test, pas une duplication de la logique.

</details>

### Anti-pattern 2 — Tester la librairie externe plutôt que notre code

```java
// ❌ Le SUT est un mock — on teste Mockito, pas notre code
@Test
void it_should_call_search_on_repository_with_the_given_text() {
    var todoRepositoryMock = mock(TodoRepository.class);

    when(todoRepositoryMock.search(searchedText)).thenReturn(searchResults);

    var result = todoRepositoryMock.search(searchedText); // ← on appelle le mock, pas le service !

    assertThat(result).isEqualTo(searchResults);
    verify(todoRepositoryMock, times(1)).search(searchedText);
}
```

<details>
  <summary>Solution</summary>

```java
// ✅ On appelle le vrai SUT (TodoService), le mock sert uniquement de stub pour le repository
@Test
void it_should_call_search_on_repository_with_the_given_text() {
    var todoRepositoryMock = mock(TodoRepository.class);
    var todoService = new TodoService(todoRepositoryMock); // ← le vrai SUT

    when(todoRepositoryMock.search(searchedText)).thenReturn(searchResults);

    var result = todoService.search(searchedText); // ← on appelle le service

    assertThat(result).isEqualTo(searchResults);
    verify(todoRepositoryMock, times(1)).search(searchedText);
}
```

> Ne jamais utiliser un mock comme SUT. Le mock est une dépendance du SUT, pas le sujet du test.

</details>

---

### Anti-pattern 3 — Un assert par test sur un même comportement

```java
// ❌ 4 tests distincts pour vérifier un seul comportement : "ajouter un commentaire"
@Test
void it_should_return_a_Right_for_valid_comment() { ... }

@Test
void it_should_add_a_comment_with_the_given_text() { ... }

@Test
void it_should_add_a_comment_with_the_given_author() { ... }

@Test
void it_should_add_a_comment_with_the_date_of_the_day() { ... } // sans assertion !
```

Les tests doivent être **orientés comportement**, pas orientés données.

<details>
  <summary>Solution</summary>

```java
// ✅ Un test par comportement, plusieurs assertions si elles vérifient le même scénario
@Nested
class add_a_new_comment {
    @Test
    void in_the_article_including_given_text_and_author() {
        var updatedArticle = article.addComment(text, author);

        assertThat(updatedArticle.isRight()).isTrue();
        assertComment(updatedArticle.get().getComments().head(), text, author);
    }

    @Test
    void in_an_article_containing_existing_ones() { ... }
}
```

</details>

---

### Anti-pattern 4 — Noms techniques au lieu de noms métier

```java
// ❌ Que signifie "Right" ? Que signifie "Left" pour un non-initié ?
void it_should_return_a_Right_for_valid_comment() { ... }
void it_should_return_a_Left_when_adding_existing_comment() { ... }
```

```java
// ❌ Qu'est-ce qu'un "valid comment" ?
void it_should_return_a_Right_for_valid_comment() { ... }
```

<details>
  <summary>Solution</summary>

```java
// ✅ Noms orientés comportement métier
class Blog_should {
    @Nested
    class add_a_new_comment {
        void in_the_article_including_given_text_and_author() { ... }
        void in_an_article_containing_existing_ones() { ... }
    }

    @Nested
    class return_an_error {
        void when_adding_an_existing_comment() { ... }
    }
}
```

Un expert métier doit pouvoir lire le nom d'un test et comprendre ce qui est vérifié.

</details>

---

### Anti-pattern 5 — Test sans assertion

```java
// ❌ Ce test passe toujours — il ne vérifie rien
@Test
void it_should_add_a_comment_with_the_date_of_the_day() {
    var article = new Article("Lorem Ipsum", "...");
    var result = article.addComment("Amazing article !!!", "Pablo Escobar");
    // ← pas d'assertion
}
```

> Un test sans assertion n'a aucune valeur. Voir un test **échouer** est aussi important que de le voir **réussir**.

---

### Anti-pattern 6 — Duplication dans les tests

```java
// ❌ L'instanciation de Article est répétée dans chaque test
@Test
void it_should_add_a_comment_with_the_given_text() {
    var article = new Article("Lorem Ipsum", "consectetur adipiscing elit...");
    ...
}

@Test
void it_should_add_a_comment_with_the_given_author() {
    var article = new Article("Lorem Ipsum", "consectetur adipiscing elit..."); // dupliqué
    ...
}
```

<details>
  <summary>Solution</summary>

```java
// ✅ Centraliser les données dans @BeforeEach ou des TestDataBuilders
class Blog_should {
    private Article article;

    @BeforeEach
    void init() {
        article = new Article(
            "Lorem Ipsum",
            "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
        );
    }
    ...
}
```

> Si vos modèles changent, vous n'avez qu'un seul endroit à mettre à jour.

</details>

---

### Anti-pattern 7 — Commenter les tests en échec

```java
// ❌ Ne jamais commenter un test qui échoue
// @Test
// void it_should_add_a_comment_with_the_date_of_the_day() { ... }
```

Un test en échec est un **signal** — pas un bruit à faire taire. Appliquez toujours l'une de ces règles :

| Situation                             | Action                    |
|---------------------------------------|---------------------------|
| Le test a détecté une régression      | **Corrigez le code**      |
| L'hypothèse du test n'est plus valide | **Supprimez le test**     |
| Le comportement a légitimement changé | **Mettez à jour le test** |

---

### Anti-pattern 8 — La course aux 100% de couverture

Atteindre 100% de couverture de code ne garantit **pas** la qualité des tests.

```java
// Les 2 versions ont la même couverture de test, mais la 2e masque un cas non testé
public static boolean isLong(String s) {
    if (s.length() > 5) return true; // ← branche non couverte par les tests
    return false;
}

// Refactorisé : 100% de line coverage avec le même test incomplet
public static boolean isLong(String s) {
    return s.length() > 5;
}
```

> Préférez la **Branch Coverage** à la Line Coverage. Et utilisez le **Mutation Testing** pour mesurer la vraie qualité de vos tests.
