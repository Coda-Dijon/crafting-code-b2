package grades.withoutMock;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.fail;

// TODO: ajouter @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GradeApiTest {

    // TODO: @Autowired TestRestTemplate restTemplate;
    // TODO: @Autowired GradeRepository gradeRepository;

    // TODO: ajouter @TestConfiguration pour substituer GradeRepository par FakeGradeRepository (@Bean @Primary)

    // TODO: ajouter @BeforeEach pour appeler ((FakeGradeRepository) gradeRepository).clear()

    // Exercice 2 — implémenter les 3 tests suivants :
    //
    // 1. GET /students/{id}/grades → 200 avec les notes
    // 2. GET /students/{id}/grades → 404 quand aucune note n'est trouvée
    // 3. POST /students/{id}/grades → 201 et vérifie la persistance via le Fake

    @Test
    void todo() {
        fail("Implement me!");
    }
}
