# Test it or Die Trying (40')

Le projet contient une API Spring Boot complète pour gérer les notes étudiantes.

## L'API

| Méthode | URL                                                 | Description         |
|---------|-----------------------------------------------------|---------------------|
| `GET`   | `/students/{studentId}/grades?subject=&assignment=` | Consulter les notes |
| `POST`  | `/students/{studentId}/grades`                      | Créer une note      |

La documentation Swagger UI est disponible sur `http://localhost:8080/swagger-ui.html` après démarrage.

### Exemple — Créer une note

```json
POST /students/alice/grades
{
  "subject": "math",
  "assignment": "exam1",
  "value": 17.5
}
```

### Exemple — Consulter les notes

```
GET /students/alice/grades?subject=math&assignment=exam1
```

---

## Exercice 1 — Avec Mock (20')

Ouvrez `withMock/GradeControllerTest.java` et implémentez les 3 tests suivants :

1. `GET /students/{id}/grades` → **200** avec la liste des notes quand elles existent
2. `GET /students/{id}/grades` → **404** quand aucune note n'est trouvée
3. `POST /students/{id}/grades` → **201** et vérifie que le service a bien été appelé

**Outils à disposition :**

```java
// Annoter la classe
@WebMvcTest(GradeController.class)

// Injecter les collaborateurs
@Autowired MockMvc mockMvc;
@MockitoBean GradeService gradeService; // remplace @MockBean, déprécié

// Configurer le mock (BDDMockito)
given(gradeService.getGrades("alice", "math", "exam1"))
    .willReturn(List.of(...));

// Effectuer une requête et vérifier la réponse
mockMvc.perform(get("/students/alice/grades")
        .param("subject", "math")
        .param("assignment", "exam1"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$[0].value").value(17.5));

// Vérifier qu'une méthode a été appelée
verify(gradeService).createGrade(eq("alice"), any(GradeRequest.class));
```

---

## Exercice 2 — Sans Mock (20')

Ouvrez `withoutMock/GradeApiTest.java`. Le `FakeGradeRepository` est déjà fourni — lisez-le avant de commencer.

Implémentez les 3 mêmes cas, mais cette fois avec `@SpringBootTest` :

1. `GET /students/{id}/grades` → **200** avec les notes
2. `GET /students/{id}/grades` → **404** quand aucune note n'est trouvée
3. `POST /students/{id}/grades` → **201** et vérifie la persistance via le Fake

**Outils à disposition :**

```java
// Annoter la classe
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient

// Substituer le repository par le Fake (dans une inner class statique)
@TestConfiguration
static class Config {
    @Bean @Primary
    GradeRepository gradeRepository() { return new FakeGradeRepository(); }
}

// Injecter les collaborateurs
@Autowired RestTestClient  client;
@Autowired GradeRepository gradeRepository; // injecte le Fake

// Nettoyer l'état entre chaque test
@BeforeEach
void setUp() { ((FakeGradeRepository) gradeRepository).clear(); }

// Pré-charger des données
gradeRepository.save(new Grade("alice", "math", "exam1", 18.0));

// Effectuer une requête et vérifier la réponse
var grades = client.get()
    .uri("/students/alice/grades?subject=math&assignment=exam1")
    .exchange()
    .expectStatus().isOk()
    .expectBody(Grade[].class)
    .returnResult().getResponseBody();

assertThat(grades).hasSize(1);

// Envoyer un corps JSON
client.post()
    .uri("/students/bob/grades")
    .contentType(APPLICATION_JSON)
    .body(new GradeRequest("math", "exam1", 14.5))
    .exchange()
    .expectStatus().isCreated();
```

> Never trust a test that you have not seen failed
