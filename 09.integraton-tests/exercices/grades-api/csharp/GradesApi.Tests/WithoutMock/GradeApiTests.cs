using Xunit;

namespace GradesApi.Tests.WithoutMock;

// WebApplicationFactory : https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests
//
// TODO: utiliser WebApplicationFactory<Program> pour démarrer l'API
// TODO: substituer IGradeRepository par FakeGradeRepository via ConfigureTestServices
public class GradeApiTests
{
    // Exercice 2 — implémenter les 3 tests suivants :
    //
    // 1. GET /students/{id}/grades → 200 avec les notes
    // 2. GET /students/{id}/grades → 404 quand aucune note n'est trouvée
    // 3. POST /students/{id}/grades → 201 et vérifie la persistance via le Fake

    [Fact]
    public void Todo()
    {
        Assert.True(false, "Implement me!");
    }
}
