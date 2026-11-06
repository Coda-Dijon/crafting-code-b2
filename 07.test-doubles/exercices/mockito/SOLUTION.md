# Solution pas à pas

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
