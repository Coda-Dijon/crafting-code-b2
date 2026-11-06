# Remplacer les doubles écrits à la main par Mockito

Les classes de doubles écrits à la main (`AllowAccessAuthorizer`, `SpyJokeRepository`, `MockNotifier`...) sont du code de test à maintenir. Les librairies de mocking permettent de les remplacer par du code déclaratif.

En Java, la librairie de référence est **[Mockito](https://site.mockito.org/)**.

```java
// Créer un mock
var notifier = mock(Notifier.class);

// Stubber une méthode (contrôler une entrée)
when(authorizer.authorize()).thenReturn(true);

// Vérifier une interaction sortante
verify(notifier, times(1)).notify(client, event);
verify(notifier, never()).notify(any(), any());
```

**Exercice** : refactorez les tests pour utiliser `Mockito` à la place des implémentations manuelles.

- Supprimez `AllowAccessAuthorizer` et `DenyAccessAuthorizer` → remplacez par `when(...).thenReturn(...)`
- Supprimez `SpyJokeRepository` → remplacez par `verify(...)`
- Supprimez `MockNotifier` → remplacez par `verify(...)` pour chaque client


Le code est disponible en [Java](java) et en [C#](csharp) (avec `Moq`).

La solution pas à pas est disponible [ici](SOLUTION.md).
