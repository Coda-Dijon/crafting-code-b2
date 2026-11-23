# Solutions — Tests d'Intégration
## Exercice 1 — Avec Mock

### Approche

On utilise un contexte partiel (`@WebMvcTest` en Java, `WebApplicationFactory` + mock en C#) : seule la couche HTTP est chargée. Le service/repository est remplacé par un mock qui contrôle les réponses.

**Pourquoi ?** Tester que le controller traduit correctement les appels HTTP en appels métier — sans se soucier du reste de la stack.

**Risque :** Le mock peut masquer une divergence entre le contrat du test et l'implémentation réelle ("Only mock what you own").

---

### Java — `withMock/GradeControllerTest.java`

#### Étape 1 — Annoter la classe et injecter les collaborateurs

```java
@WebMvcTest(GradeController.class)  // (1) charge uniquement la couche HTTP
class GradeControllerTest {
    @Autowired MockMvc mockMvc;         // (2) client HTTP de test
    @MockitoBean GradeService gradeService; // (3) remplace le vrai service
```

- `@WebMvcTest` démarre un contexte Spring minimal : controllers, filtres, sérialisation JSON. Rien d'autre.
- `@MockitoBean` crée un mock Mockito et l'enregistre dans le contexte Spring à la place du vrai bean. Il remplace `@MockBean`, déprécié depuis Spring Boot 3.4 et supprimé dans Spring Boot 4.

---

#### Étape 2 — Test 1 : GET → 200 avec les notes

```java
    @Test
    void shouldReturn200WithGradesWhenFound() throws Exception {
        // Arrange : on programme le mock pour retourner une note
        given(gradeService.getGrades("alice", "math", "exam1"))
            .willReturn(List.of(new Grade("alice", "math", "exam1", 17.5)));

        // Act & Assert : on envoie la requête et on vérifie la réponse
        mockMvc.perform(get("/students/alice/grades")
                .param("subject", "math")
                .param("assignment", "exam1"))
            .andExpect(status().isOk())                        // HTTP 200
            .andExpect(jsonPath("$[0].value").value(17.5));    // corps JSON
    }
```

- `given(...).willReturn(...)` : syntaxe BDDMockito, équivalente à `when(...).thenReturn(...)`.
- `jsonPath("$[0].value")` : vérifie le premier élément du tableau JSON.

---

#### Étape 3 — Test 2 : GET → 404 quand aucune note

```java
    @Test
    void shouldReturn404WhenNoGradesFound() throws Exception {
        // Arrange : le mock retourne une liste vide (comportement par défaut,
        // mais on le rend explicite pour la lisibilité)
        given(gradeService.getGrades(any(), any(), any()))
            .willReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/students/unknown/grades")
                .param("subject", "math")
                .param("assignment", "exam1"))
            .andExpect(status().isNotFound()); // HTTP 404
    }
```

- `any()` : argument matcher Mockito, correspond à n'importe quelle valeur.
- On vérifie que le controller retourne bien 404 quand le service retourne une liste vide.

---

#### Étape 4 — Test 3 : POST → 201 et vérification de l'appel

```java
    @Test
    void shouldReturn201WhenCreatingGrade() throws Exception {
        // Arrange : corps de la requête JSON
        var body = """
            { "subject": "math", "assignment": "exam1", "value": 15.0 }
            """;

        // Act & Assert
        mockMvc.perform(post("/students/alice/grades")
                .contentType(APPLICATION_JSON)
                .content(body))
            .andExpect(status().isCreated()); // HTTP 201

        // Vérifier que le service a bien été appelé avec les bons arguments
        verify(gradeService).createGrade(eq("alice"), any(GradeRequest.class));
    }
}
```

- `verify(...)` : vérifie qu'une méthode du mock a été appelée exactement une fois.
- `eq("alice")` : le premier argument doit être exactement `"alice"`.
- `any(GradeRequest.class)` : le deuxième argument peut être n'importe quel `GradeRequest`.

#### Code complet

```java
package grades.withMock;

import grades.Grade;
import grades.GradeController;
import grades.GradeRequest;
import grades.GradeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GradeController.class)
class GradeControllerTest {

    @Autowired MockMvc mockMvc;
    @MockitoBean GradeService gradeService;

    @Test
    void shouldReturn200WithGradesWhenFound() throws Exception {
        given(gradeService.getGrades("alice", "math", "exam1"))
            .willReturn(List.of(new Grade("alice", "math", "exam1", 17.5)));

        mockMvc.perform(get("/students/alice/grades")
                .param("subject", "math")
                .param("assignment", "exam1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].value").value(17.5));
    }

    @Test
    void shouldReturn404WhenNoGradesFound() throws Exception {
        given(gradeService.getGrades(any(), any(), any()))
            .willReturn(List.of());

        mockMvc.perform(get("/students/unknown/grades")
                .param("subject", "math")
                .param("assignment", "exam1"))
            .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn201WhenCreatingGrade() throws Exception {
        var body = """
            { "subject": "math", "assignment": "exam1", "value": 15.0 }
            """;

        mockMvc.perform(post("/students/alice/grades")
                .contentType(APPLICATION_JSON)
                .content(body))
            .andExpect(status().isCreated());

        verify(gradeService).createGrade(eq("alice"), any(GradeRequest.class));
    }
}
```

---

### C# — `WithMock/GradeControllerTests.cs`

#### Étape 1 — Mettre en place `WebApplicationFactory` avec un mock

```csharp
public class GradeControllerTests
{
    // Helper : construit un client HTTP avec le repository mocké
    private static (HttpClient client, Mock<IGradeRepository> mock) BuildClient()
    {
        var mockRepository = new Mock<IGradeRepository>();

        var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
                builder.ConfigureTestServices(services =>
                {
                    services.RemoveAll<IGradeRepository>(); // (1) retire l'implémentation réelle
                    services.AddSingleton(mockRepository.Object); // (2) injecte le mock
                }));

        return (factory.CreateClient(), mockRepository);
    }
```

- `WebApplicationFactory<Program>` : démarre l'API en mémoire (pas de vrai serveur HTTP).
- `ConfigureTestServices` : surcharge la DI uniquement pour les tests.
- `RemoveAll` + `AddSingleton` : pattern standard pour remplacer un service enregistré.

---

#### Étape 2 — Test 1 : GET → 200 avec les notes

```csharp
    [Fact]
    public async Task GetGrades_ReturnsOkWithGrades_WhenGradesExist()
    {
        // Arrange
        var (client, mockRepository) = BuildClient();
        mockRepository
            .Setup(r => r.FindBy("alice", "math", "exam1"))
            .Returns([new Grade("alice", "math", "exam1", 17.5)]);

        // Act
        var response = await client.GetAsync("/students/alice/grades?subject=math&assignment=exam1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var grades = await response.Content.ReadFromJsonAsync<List<Grade>>();
        grades.Should().HaveCount(1);
        grades![0].Value.Should().Be(17.5);
    }
```

- `Setup(...).Returns(...)` : programme le mock Moq.
- `ReadFromJsonAsync<T>` : désérialise le corps JSON de la réponse.

---

#### Étape 3 — Test 2 : GET → 404 quand aucune note

```csharp
    [Fact]
    public async Task GetGrades_ReturnsNotFound_WhenNoGradesExist()
    {
        // Arrange
        var (client, mockRepository) = BuildClient();
        mockRepository
            .Setup(r => r.FindBy(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .Returns([]); // liste vide

        // Act
        var response = await client.GetAsync("/students/unknown/grades?subject=math&assignment=exam1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
```

- `It.IsAny<string>()` : équivalent de `any()` en Mockito.

---

#### Étape 4 — Test 3 : POST → 201 et vérification de l'appel

```csharp
    [Fact]
    public async Task CreateGrade_ReturnsCreated_AndCallsRepository()
    {
        // Arrange
        var (client, mockRepository) = BuildClient();
        var body = JsonContent.Create(new GradeRequest("math", "exam1", 15.0));

        // Act
        var response = await client.PostAsync("/students/alice/grades", body);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        mockRepository.Verify(r => r.Save(It.IsAny<Grade>()), Times.Once);
    }
}
```

- `JsonContent.Create(...)` : sérialise l'objet en JSON et positionne le `Content-Type`.
- `Verify(..., Times.Once)` : vérifie que `Save` a été appelé exactement une fois.

#### Code complet

```csharp
using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GradesApi;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using Xunit;

namespace GradesApi.Tests.WithMock;

public class GradeControllerTests
{
    private static (HttpClient client, Mock<IGradeRepository> mock) BuildClient()
    {
        var mockRepository = new Mock<IGradeRepository>();

        var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
                builder.ConfigureTestServices(services =>
                {
                    services.RemoveAll<IGradeRepository>();
                    services.AddSingleton(mockRepository.Object);
                }));

        return (factory.CreateClient(), mockRepository);
    }

    [Fact]
    public async Task GetGrades_ReturnsOkWithGrades_WhenGradesExist()
    {
        var (client, mockRepository) = BuildClient();
        mockRepository
            .Setup(r => r.FindBy("alice", "math", "exam1"))
            .Returns([new Grade("alice", "math", "exam1", 17.5)]);

        var response = await client.GetAsync("/students/alice/grades?subject=math&assignment=exam1");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var grades = await response.Content.ReadFromJsonAsync<List<Grade>>();
        grades.Should().HaveCount(1);
        grades![0].Value.Should().Be(17.5);
    }

    [Fact]
    public async Task GetGrades_ReturnsNotFound_WhenNoGradesExist()
    {
        var (client, mockRepository) = BuildClient();
        mockRepository
            .Setup(r => r.FindBy(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .Returns([]);

        var response = await client.GetAsync("/students/unknown/grades?subject=math&assignment=exam1");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateGrade_ReturnsCreated_AndCallsRepository()
    {
        var (client, mockRepository) = BuildClient();
        var body = JsonContent.Create(new GradeRequest("math", "exam1", 15.0));

        var response = await client.PostAsync("/students/alice/grades", body);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        mockRepository.Verify(r => r.Save(It.IsAny<Grade>()), Times.Once);
    }
}
```

---

## Exercice 2 — Sans Mock (avec Fake)

### Approche

On charge le contexte complet (`@SpringBootTest` / `WebApplicationFactory`) mais on remplace le repository par un **Fake en mémoire** — pas de base de données réelle. Le Fake contient une vraie logique (pas de comportement programmé à la volée) ce qui le rend plus fiable et plus lisible qu'un mock.

**Pourquoi ?** Tester le vrai wiring Spring/ASP.NET : injection de dépendances, sérialisation JSON, validation, routage. On couvre tout ce que le mock ne vérifie pas.

**Différence clé avec un mock :** le Fake peut détecter une incohérence de contrat (ex : si `GradeRepository` change de signature, le Fake refuse de compiler).

---

### Java — `withoutMock/GradeApiTest.java`

#### Étape 1 — Annoter la classe, injecter le Fake et nettoyer entre les tests

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT) // (1) contexte complet
@AutoConfigureRestTestClient // (2) configure un RestTestClient pointant sur le serveur démarré
class GradeApiTest {

    @Autowired RestTestClient  client;          // (3) client HTTP de test
    @Autowired GradeRepository gradeRepository; // (4) injectera le Fake

    @TestConfiguration // (5) surcharge la DI uniquement pendant les tests
    static class Config {
        @Bean @Primary // @Primary pour prendre la priorité sur InMemoryGradeRepository
        GradeRepository gradeRepository() { return new FakeGradeRepository(); }
    }

    @BeforeEach
    void setUp() {
        ((FakeGradeRepository) gradeRepository).clear(); // (6) état propre avant chaque test
    }
```

- `RANDOM_PORT` : démarre un vrai serveur HTTP sur un port aléatoire, évite les conflits.
- `RestTestClient` (Spring Framework 7) remplace `TestRestTemplate`, déprécié dans Spring Boot 4.
- `@TestConfiguration` est une classe interne statique — Spring la découvre automatiquement.
- Le cast `(FakeGradeRepository)` est nécessaire car `clear()` n'est pas sur l'interface.

---

#### Étape 2 — Test 1 : GET → 200 avec les notes

```java
    @Test
    void shouldReturnGradesForStudent() {
        // Arrange : on écrit directement dans le Fake (pas de mock à programmer)
        gradeRepository.save(new Grade("alice", "math", "exam1", 18.0));

        // Act : on envoie la requête, on vérifie le statut et on récupère le corps
        var grades = client.get()
            .uri("/students/alice/grades?subject=math&assignment=exam1")
            .exchange()
            .expectStatus().isOk()
            .expectBody(Grade[].class) // on désérialise en tableau
            .returnResult()
            .getResponseBody();

        // Assert
        assertThat(grades).hasSize(1);
        assertThat(grades[0].value()).isEqualTo(18.0);
    }
```

- On pré-charge les données via `gradeRepository.save(...)` — pas de `given(...).willReturn(...)`.
- `expectStatus()` vérifie le statut HTTP, `expectBody(...)` désérialise le corps JSON.

---

#### Étape 3 — Test 2 : GET → 404 quand aucune note

```java
    @Test
    void shouldReturn404WhenNoGradesFound() {
        // Arrange : Fake vide (setUp l'a nettoyé), rien à préparer

        // Act & Assert
        client.get()
            .uri("/students/unknown/grades?subject=math&assignment=exam1")
            .exchange()
            .expectStatus().isNotFound();
    }
```

- Le Fake est vide par défaut (nettoyé dans `@BeforeEach`), donc le controller retourne 404.

---

#### Étape 4 — Test 3 : POST → 201 et vérification de la persistance

```java
    @Test
    void shouldPersistGradeWhenCreated() {
        // Arrange
        var request = new GradeRequest("math", "exam1", 14.5);

        // Act & Assert : status HTTP
        client.post()
            .uri("/students/bob/grades")
            .contentType(APPLICATION_JSON)
            .body(request)
            .exchange()
            .expectStatus().isCreated();

        // Assert : persistance réelle via le Fake (pas un verify de mock)
        assertThat(gradeRepository.findBy("bob", "math", "exam1")).hasSize(1);
    }
}
```

- On vérifie la persistance en lisant directement dans le Fake — plus expressif qu'un `verify`.
- C'est la vraie valeur du Fake : on teste le comportement observable, pas l'implémentation.

#### Code complet

```java
package grades.withoutMock;

import grades.Grade;
import grades.GradeRepository;
import grades.GradeRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.web.servlet.client.RestTestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
class GradeApiTest {

    @Autowired RestTestClient client;
    @Autowired GradeRepository gradeRepository;

    @TestConfiguration
    static class Config {
        @Bean @Primary
        GradeRepository gradeRepository() { return new FakeGradeRepository(); }
    }

    @BeforeEach
    void setUp() {
        ((FakeGradeRepository) gradeRepository).clear();
    }

    @Test
    void shouldReturnGradesForStudent() {
        gradeRepository.save(new Grade("alice", "math", "exam1", 18.0));

        var grades = client.get()
            .uri("/students/alice/grades?subject=math&assignment=exam1")
            .exchange()
            .expectStatus().isOk()
            .expectBody(Grade[].class)
            .returnResult()
            .getResponseBody();

        assertThat(grades).hasSize(1);
        assertThat(grades[0].value()).isEqualTo(18.0);
    }

    @Test
    void shouldReturn404WhenNoGradesFound() {
        client.get()
            .uri("/students/unknown/grades?subject=math&assignment=exam1")
            .exchange()
            .expectStatus().isNotFound();
    }

    @Test
    void shouldPersistGradeWhenCreated() {
        var request = new GradeRequest("math", "exam1", 14.5);

        client.post()
            .uri("/students/bob/grades")
            .contentType(APPLICATION_JSON)
            .body(request)
            .exchange()
            .expectStatus().isCreated();

        assertThat(gradeRepository.findBy("bob", "math", "exam1")).hasSize(1);
    }
}
```

---

### C# — `WithoutMock/GradeApiTests.cs`

#### Étape 1 — Mettre en place `WebApplicationFactory` avec le Fake

```csharp
public class GradeApiTests
{
    // Helper : construit un client HTTP avec le Fake injecté
    private static (HttpClient client, FakeGradeRepository fake) BuildClient()
    {
        var fakeRepository = new FakeGradeRepository();

        var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
                builder.ConfigureTestServices(services =>
                {
                    services.RemoveAll<IGradeRepository>(); // retire l'implémentation réelle
                    services.AddSingleton<IGradeRepository>(fakeRepository); // injecte le Fake
                }));

        return (factory.CreateClient(), fakeRepository);
    }
```

- On retourne à la fois le client HTTP **et** le Fake pour pouvoir le manipuler directement dans les tests.
- `AddSingleton` avec l'instance : on passe le même objet au conteneur DI et au test — même référence.

---

#### Étape 2 — Test 1 : GET → 200 avec les notes

```csharp
    [Fact]
    public async Task GetGrades_ReturnsOkWithGrades_WhenGradesExist()
    {
        // Arrange
        var (client, fake) = BuildClient();
        fake.Save(new Grade("alice", "math", "exam1", 18.0)); // pré-chargement

        // Act
        var response = await client.GetAsync("/students/alice/grades?subject=math&assignment=exam1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var grades = await response.Content.ReadFromJsonAsync<List<Grade>>();
        grades.Should().HaveCount(1);
        grades![0].Value.Should().Be(18.0);
    }
```

---

#### Étape 3 — Test 2 : GET → 404 quand aucune note

```csharp
    [Fact]
    public async Task GetGrades_ReturnsNotFound_WhenNoGradesExist()
    {
        // Arrange : Fake vide par défaut, rien à préparer
        var (client, _) = BuildClient();

        // Act
        var response = await client.GetAsync("/students/unknown/grades?subject=math&assignment=exam1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
```

- Le Fake est instancié vide à chaque test (dans `BuildClient`) — pas besoin de `Clear()` explicite.

---

#### Étape 4 — Test 3 : POST → 201 et vérification de la persistance

```csharp
    [Fact]
    public async Task CreateGrade_ReturnsCreated_AndPersistsGrade()
    {
        // Arrange
        var (client, fake) = BuildClient();
        var body = JsonContent.Create(new GradeRequest("math", "exam1", 14.5));

        // Act
        var response = await client.PostAsync("/students/bob/grades", body);

        // Assert : status HTTP
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        // Assert : persistance réelle via le Fake
        var grades = fake.FindBy("bob", "math", "exam1").ToList();
        grades.Should().HaveCount(1);
        grades[0].Value.Should().Be(14.5);
    }
}
```

- On vérifie la persistance en lisant dans le Fake — pas de `Verify` de mock.

#### Code complet

```csharp
using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GradesApi;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Xunit;

namespace GradesApi.Tests.WithoutMock;

public class GradeApiTests
{
    private static (HttpClient client, FakeGradeRepository fake) BuildClient()
    {
        var fakeRepository = new FakeGradeRepository();

        var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
                builder.ConfigureTestServices(services =>
                {
                    services.RemoveAll<IGradeRepository>();
                    services.AddSingleton<IGradeRepository>(fakeRepository);
                }));

        return (factory.CreateClient(), fakeRepository);
    }

    [Fact]
    public async Task GetGrades_ReturnsOkWithGrades_WhenGradesExist()
    {
        var (client, fake) = BuildClient();
        fake.Save(new Grade("alice", "math", "exam1", 18.0));

        var response = await client.GetAsync("/students/alice/grades?subject=math&assignment=exam1");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var grades = await response.Content.ReadFromJsonAsync<List<Grade>>();
        grades.Should().HaveCount(1);
        grades![0].Value.Should().Be(18.0);
    }

    [Fact]
    public async Task GetGrades_ReturnsNotFound_WhenNoGradesExist()
    {
        var (client, _) = BuildClient();

        var response = await client.GetAsync("/students/unknown/grades?subject=math&assignment=exam1");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateGrade_ReturnsCreated_AndPersistsGrade()
    {
        var (client, fake) = BuildClient();
        var body = JsonContent.Create(new GradeRequest("math", "exam1", 14.5));

        var response = await client.PostAsync("/students/bob/grades", body);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var grades = fake.FindBy("bob", "math", "exam1").ToList();
        grades.Should().HaveCount(1);
        grades[0].Value.Should().Be(14.5);
    }
}
```

---

## Récapitulatif — Quand choisir quoi ?

| Critère                     | Exercice 1 — Mock    | Exercice 2 — Fake        |
|-----------------------------|----------------------|--------------------------|
| **Contexte Spring/ASP.NET** | Partiel (slice HTTP) | Complet                  |
| **Vitesse**                 | Rapide               | Plus lent                |
| **Ce qu'on teste**          | Controller seul      | Stack complète           |
| **Wiring DI**               | Non vérifié          | Vérifié                  |
| **Sérialisation JSON**      | Vérifié              | Vérifié                  |
| **Persistance**             | Simulée (verify)     | Observée (état du Fake)  |
| **Risque**                  | Divergence mock/réel | Code du Fake à maintenir |

> **Règle pratique :** utilisez le mock pour tester les comportements HTTP du controller (status codes, shape JSON). Utilisez le Fake pour valider que la stack fonctionne bout-en-bout.

### Question de réflexion

> Que se passe-t-il si la signature de `GradeRepository` / `IGradeRepository` change ?
> - **Exercice 1 (mock)** : le test compile toujours — Mockito/Moq s'adapte silencieusement. Le changement de contrat passe inaperçu.
> - **Exercice 2 (fake)** : le `FakeGradeRepository` refuse de compiler. Le test devient le premier rempart contre la régression.
