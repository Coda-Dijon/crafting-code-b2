# Test Doubles
## Association de mots

Associez chaque mot à sa définition :

- `Test Double`
- `Spy`
- `Mock`
- `Fake`
- `Stub`
- `Dummy`
- `SUT`

Définitions :

- Remplace un objet dont dépend le SUT par un objet de test qui vérifie que le SUT l'utilise correctement.
- Double de test qui capture les appels sortants faits par le SUT vers un autre composant, pour vérification ultérieure.
- On remplace un composant dont dépend le SUT par un "équivalent spécifique au test".
- On remplace un composant par une implémentation allégée mais fonctionnelle.
- System Under Test — le code que l'on teste.
- On passe un objet sans implémentation comme argument d'une méthode appelée sur le SUT.
- On remplace un objet réel par un objet de test qui fournit les entrées indirectes souhaitées au SUT.

![Association de mots](img/word-association.webp)

<details>
  <summary>Correction</summary>

- `Test Double` : On remplace un composant dont dépend le SUT par un "équivalent spécifique au test".
- `Spy` : Double de test qui capture les appels sortants faits par le SUT vers un autre composant, pour vérification ultérieure.
- `Fake` : On remplace un composant par une implémentation allégée mais fonctionnelle.
- `Stub` : On remplace un objet réel par un objet de test qui fournit les entrées indirectes souhaitées au SUT.
- `Mock` : Remplace un objet dont dépend le SUT par un objet de test qui vérifie que le SUT l'utilise correctement.
- `Dummy` : On passe un objet sans implémentation comme argument d'une méthode appelée sur le SUT.
- `SUT` : System Under Test — le code que l'on teste.

</details>

---

## Les 50 nuances de Doublures de Tests
### Pourquoi des Test Doubles ?

#### Isolation

L'isolation est l'une des exigences fondamentales des tests unitaires. En pratique, le code dépend toujours d'autres composants (collaborateurs). Les Test Doubles permettent de **briser ces dépendances** pour tester le SUT seul.

![Test Double](img/test-double.webp)

#### Répétabilité

Les doubles remplacent les dépendances non déterministes, rendant les tests reproductibles :

- appels à une API externe
- accès à une base de données
- données non déterministes : aléatoires, temporelles...

#### Performance

En remplaçant des composants lourds par des équivalents légers, les tests restent **rapides**.

> Il existe plusieurs variantes de Test Doubles selon leur intention.

---

### Taxonomie des Test Doubles

| Type | Usage | Implémentation | Ce qu'on vérifie |
|---|---|---|---|
| **Dummy** | Remplir un paramètre requis, non utilisé | `null` ou vide | Rien |
| **Fake** | Remplacer une dépendance lourde | Vraie logique, simplifiée | État du SUT |
| **Stub** | Contrôler les **entrées** du SUT | Retourne des valeurs fixes | État du SUT |
| **Spy** | Capturer les **sorties** du SUT | Enregistre les appels | Sorties capturées |
| **Mock** | Vérifier les **interactions sortantes** | Vérifie les appels | Comportement |

---

### Mock vs Stub — La distinction fondamentale

C'est la confusion la plus courante. La différence tient dans la **direction de l'interaction** et dans ce qu'on vérifie :

|                | **Stub**                                             | **Mock**                                                   |
|----------------|------------------------------------------------------|------------------------------------------------------------|
| Direction      | Interaction **entrante** (le SUT reçoit des données) | Interaction **sortante** (le SUT appelle un collaborateur) |
| Question posée | Le SUT produit-il le bon résultat ?                  | Le SUT a-t-il bien invoqué la dépendance ?                 |
| Vérification   | État du SUT                                          | Comportement du SUT                                        |

> "Mocks are not stubs" — Martin Fowler

Un stub qui sert aussi à vérifier des interactions devient un mock. Ne mélangez pas les deux rôles dans un même objet.

---

### Dummy

> On passe un objet sans implémentation comme argument d'une méthode appelée sur le SUT.

Le `Dummy` est un placeholder requis par la signature mais qui n'a **aucun impact** sur le résultat.

```java
@Test
void shouldThrowWhenDividingByZero() {
    var calculator = new Calculator();
    int numerator = new Random().nextInt(); // dummy — sa valeur n'a aucun impact
    int zero = 0;

    assertThatThrownBy(() -> calculator.divide(numerator, zero))
        .isInstanceOf(IllegalArgumentException.class);
}
```

> `null` est souvent suffisant comme Dummy, sauf si le SUT le valide à l'entrée.

---

### [Fake](http://xunitpatterns.com/Fake%20Object.html)

> On remplace un composant par une implémentation allégée mais fonctionnelle.

Le `Fake` possède une **vraie logique** — c'est ce qui le distingue des autres doubles. Il n'est pas généré par une librairie : il s'écrit à la main.

```java
@Test
void shouldNotifyAllClientsWhenScenarioIsReceived() {
    var logs = new StringBuilder();
    var clients = List.of(
        new Client("Cliff Booth", "cliff.booth@double.com"),
        new Client("Rick Dalton", "rick.dalton@double.com")
    );

    var notifier = new FakeNotifier(logs::append);
    var handler = new ScenarioReceivedEventHandler(notifier, clients);

    handler.handle(new ScenarioReceived("The 14 fists of McCluskey"));

    assertThat(logs.toString())
        .contains("Hello : Cliff Booth, I have just received a new scenario called 'The 14 fists of McCluskey' !!!")
        .contains("Hello : Rick Dalton, I have just received a new scenario called 'The 14 fists of McCluskey' !!!");
}

static class FakeNotifier implements Notifier {
    private final Consumer<String> output;

    FakeNotifier(Consumer<String> output) { this.output = output; }

    @Override
    public void notify(Client client, ScenarioReceived scenario) {
        output.accept("Hello : " + client.name() +
            ", I have just received a new scenario called '" + scenario.title() + "' !!!");
    }
}
```

> Un `Fake` peut aussi s'utiliser en environnement de test ou de recette : au lieu d'envoyer de vraies notifications, il écrit dans les logs applicatifs.

---

### [Stub](http://xunitpatterns.com/Test%20Stub.html)

> On remplace un objet réel par un objet de test qui fournit les entrées indirectes souhaitées au SUT.

Le `Stub` **contrôle les entrées** du SUT en retournant des valeurs prédéfinies. Il aide à tester comment le SUT réagit selon les données qu'il reçoit de ses collaborateurs.

```java
@Test
void shouldDivideWhenAuthorizationIsAccepted() {
    var calculator = new Calculator(new AllowAccessAuthorizer());
    assertThat(calculator.divide(9, 3)).isEqualTo(3);
}

@Test
void shouldThrowWhenAuthorizationIsDenied() {
    var calculator = new Calculator(new DenyAccessAuthorizer());
    assertThatThrownBy(() -> calculator.divide(9, 3))
        .isInstanceOf(UnauthorizedAccessException.class);
}

static class AllowAccessAuthorizer implements Authorizer {
    @Override public boolean authorize() { return true; }
}

static class DenyAccessAuthorizer implements Authorizer {
    @Override public boolean authorize() { return false; }
}
```

> Ces deux classes peuvent être remplacées par une seule ligne avec une librairie — c'est l'objet de la pratique.

---

### [Spy](http://xunitpatterns.com/Mock%20Object.html)

> Double de test qui capture les appels sortants faits par le SUT vers un autre composant, pour vérification ultérieure.

Le `Spy` **enregistre** ce que le SUT a fait (quelles méthodes ont été appelées, avec quels arguments), pour vérification après l'exécution.

```java
@Test
void shouldSaveJokeWhenHandlingRequest() {
    var repository = new SpyJokeRepository();
    var useCase = new CreateAJokeUseCase(repository);
    var request = new CreateJokeRequest(
        "Anonymous",
        "Quelle partie du légume ne passe pas dans le mixer ? La chaise roulante"
    );

    useCase.handle(request);

    repository.shouldContain(request);
}

static class SpyJokeRepository implements JokeRepository {
    private final List<Joke> jokes = new ArrayList<>();

    @Override
    public void save(Joke joke) { jokes.add(joke); }

    public void shouldContain(CreateJokeRequest request) {
        assertThat(jokes)
            .filteredOn(j -> j.author().equals(request.author()) && j.text().equals(request.text()))
            .hasSize(1);
    }
}
```

---

### [Mock](http://xunitpatterns.com/Mock%20Object.html)

> Remplace un objet dont dépend le SUT par un objet de test qui **vérifie** que le SUT l'utilise correctement.

Le `Mock` vérifie les **interactions sortantes** : a-t-on bien appelé la bonne méthode, avec les bons arguments, le bon nombre de fois ?

```java
@Test
void shouldNotifyAllClientsWhenScenarioIsReceived() {
    var clients = List.of(
        new Client("Cliff Booth", "cliff.booth@double.com"),
        new Client("Rick Dalton", "rick.dalton@double.com")
    );

    var mockNotifier = new MockNotifier();
    var handler = new ScenarioReceivedEventHandler(mockNotifier, clients);
    var event = new ScenarioReceived("The 14 fists of McCluskey");

    handler.handle(event);

    assertThat(mockNotifier.hasBeenCalledForAll(clients, event)).isTrue();
}

static class MockNotifier implements Notifier {
    private final List<Map.Entry<Client, ScenarioReceived>> calls = new ArrayList<>();

    @Override
    public void notify(Client client, ScenarioReceived scenario) {
        calls.add(Map.entry(client, scenario));
    }

    public boolean hasBeenCalledForAll(List<Client> clients, ScenarioReceived event) {
        return clients.stream()
            .allMatch(c -> calls.contains(Map.entry(c, event)));
    }
}
```

---

### Limites

> Only mock what you own.

Substituer un objet d'un système externe expose à des risques : si l'API externe change, vos mocks ne le détecteront pas — les tests passent, la prod casse.

**Règle** : ne mockez que **vos propres interfaces**. Pour les dépendances externes (librairies, APIs tierces), créez une couche d'abstraction (Adapter pattern) et mockez cette interface à vous.

![Test Doubles explained](img/test-doubles.webp)

---

## Pratique — Avec une librairie

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

**Exercice** : refactorez les tests utiliser `Mockito` à la place des implémentations manuelles.

- Supprimez `AllowAccessAuthorizer` et `DenyAccessAuthorizer` → remplacez par `when(...).thenReturn(...)`
- Supprimez `SpyJokeRepository` → remplacez par `verify(...)`
- Supprimez `MockNotifier` → remplacez par `verify(...)` pour chaque client

<details>
  <summary>Solution pas à pas</summary>

> Pour le Fake (`FakeNotifier`) : une librairie ne peut pas le remplacer — il a une vraie logique. Conservez-le.

### Stub avec Mockito

```java
@Test
void shouldDivideWhenAuthorizationIsAccepted() {
    var authorizer = mock(Authorizer.class);
    when(authorizer.authorize()).thenReturn(true);
    var calculator = new Calculator(authorizer);

    assertThat(calculator.divide(9, 3)).isEqualTo(3);
}

@Test
void shouldThrowWhenAuthorizationIsDenied() {
    var authorizer = mock(Authorizer.class);
    when(authorizer.authorize()).thenReturn(false);
    var calculator = new Calculator(authorizer);

    assertThatThrownBy(() -> calculator.divide(9, 3))
        .isInstanceOf(UnauthorizedAccessException.class);
}
```

### Spy avec Mockito

```java
@Test
void shouldSaveJokeWhenHandlingRequest() {
    var repository = mock(JokeRepository.class);
    var useCase = new CreateAJokeUseCase(repository);
    var request = new CreateJokeRequest(
        "Anonymous",
        "Quelle partie du légume ne passe pas dans le mixer ? La chaise roulante"
    );

    useCase.handle(request);

    verify(repository, times(1)).save(new Joke(request.author(), request.text()));
}
```

### Mock avec Mockito

```java
@Test
void shouldNotifyAllClientsWhenScenarioIsReceived() {
    var clients = List.of(
        new Client("Cliff Booth", "cliff.booth@double.com"),
        new Client("Rick Dalton", "rick.dalton@double.com")
    );
    var notifier = mock(Notifier.class);
    var handler = new ScenarioReceivedEventHandler(notifier, clients);
    var event = new ScenarioReceived("The 14 fists of McCluskey");

    handler.handle(event);

    clients.forEach(client ->
        verify(notifier, times(1)).notify(client, event)
    );
}
```

</details>

---

## Conclusion

Quelle est la chose la plus importante que vous avez apprise aujourd'hui sur les Test Doubles ?

- Quand préférez-vous un Stub à un Mock ?
- Dans quel cas écrire un Fake à la main plutôt que d'utiliser Mockito ?
- Que risque-t-on à mocker du code qu'on ne possède pas ?

## Ressources

- [XUnit Test Patterns — Refactoring Test Code, Gerard Meszaros](http://xunitpatterns.com/)
- [Mocks Aren't Stubs — Martin Fowler](https://martinfowler.com/articles/mocksArentStubs.html)
- [The Little Mocker — Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2014/05/14/TheLittleMocker.html)
- [Dummy vs Stub vs Spy vs Fake vs Mock](https://nirajrules.wordpress.com/2011/08/27/dummy-vs-stub-vs-spy-vs-fake-vs-mock/)
- [Mockito Documentation](https://site.mockito.org/)
