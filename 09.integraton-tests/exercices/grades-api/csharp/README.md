# Test it or Die Trying (40')

Le projet contient une API ASP.NET Core complète pour gérer les notes étudiantes.

## L'API

| Méthode | URL | Description |
|---|---|---|
| `GET` | `/students/{studentId}/grades?subject=&assignment=` | Consulter les notes |
| `POST` | `/students/{studentId}/grades` | Créer une note |

La documentation Swagger UI est disponible à la racine `http://localhost:5000` après démarrage.

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

Ouvrez `WithMock/GradeControllerTests.cs` et implémentez les 3 tests suivants :

1. `GET /students/{id}/grades` → **200** avec la liste des notes quand elles existent
2. `GET /students/{id}/grades` → **404** quand aucune note n'est trouvée
3. `POST /students/{id}/grades` → **201** et vérifie que le repository a bien été appelé

**Outils à disposition :**

```csharp
// Démarrer l'API avec le mock injecté
var mockRepository = new Mock<IGradeRepository>();

var factory = new WebApplicationFactory<Program>()
    .WithWebHostBuilder(builder =>
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<IGradeRepository>();
            services.AddSingleton(mockRepository.Object);
        }));

var client = factory.CreateClient();

// Configurer le mock (Moq)
mockRepository
    .Setup(r => r.FindBy("alice", "math", "exam1"))
    .Returns([new Grade("alice", "math", "exam1", 17.5)]);

// Envoyer une requête GET
var response = await client.GetAsync("/students/alice/grades?subject=math&assignment=exam1");
response.StatusCode.Should().Be(HttpStatusCode.OK);

// Envoyer une requête POST
var body = JsonContent.Create(new GradeRequest("math", "exam1", 15.0));
var response = await client.PostAsync("/students/alice/grades", body);
response.StatusCode.Should().Be(HttpStatusCode.Created);

// Vérifier que le repository a été appelé
mockRepository.Verify(r => r.Save(It.IsAny<Grade>()), Times.Once);
```

---

## Exercice 2 — Sans Mock (20')

Ouvrez `WithoutMock/GradeApiTests.cs`. Le `FakeGradeRepository` est déjà fourni — lisez-le avant de commencer.

Implémentez les 3 mêmes cas, mais cette fois avec `FakeGradeRepository` :

1. `GET /students/{id}/grades` → **200** avec les notes
2. `GET /students/{id}/grades` → **404** quand aucune note n'est trouvée
3. `POST /students/{id}/grades` → **201** et vérifie la persistance via le Fake

**Outils à disposition :**

```csharp
// Démarrer l'API avec le Fake injecté
var fakeRepository = new FakeGradeRepository();

var factory = new WebApplicationFactory<Program>()
    .WithWebHostBuilder(builder =>
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<IGradeRepository>();
            services.AddSingleton<IGradeRepository>(fakeRepository);
        }));

var client = factory.CreateClient();

// Pré-charger des données dans le Fake
fakeRepository.Save(new Grade("alice", "math", "exam1", 18.0));

// Vérifier la persistance après POST
var grades = fakeRepository.FindBy("bob", "math", "exam1");
grades.Should().HaveCount(1);

// Nettoyer entre les tests (utiliser IDisposable ou réinstancier le Fake par test)
fakeRepository.Clear();
```

> Never trust a test that you have not seen failed
