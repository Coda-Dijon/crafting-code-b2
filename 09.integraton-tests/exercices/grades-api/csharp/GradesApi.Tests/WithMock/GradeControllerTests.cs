using Xunit;

namespace GradesApi.Tests.WithMock;

// WebApplicationFactory : https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests
//
// TODO: utiliser WebApplicationFactory<Program> pour démarrer l'API
// TODO: injecter un Mock<IGradeRepository> via ConfigureTestServices
public class GradeControllerTests
{
    // Exercice 1 — implémenter les 3 tests suivants :
    //
    // 1. GET /students/{id}/grades → 200 avec les notes quand elles existent
    // 2. GET /students/{id}/grades → 404 quand aucune note n'est trouvée
    // 3. POST /students/{id}/grades → 201 et vérifie que le repository a bien été appelé

    [Fact]
    public void Todo()
    {
        Assert.True(false, "Implement me!");
    }
}
