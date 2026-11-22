using Microsoft.AspNetCore.Mvc;

namespace GradesApi;

/// <summary>Gestion des notes étudiantes</summary>
[ApiController]
[Route("students/{studentId}/grades")]
[Produces("application/json")]
public class GradesController(GradeService gradeService) : ControllerBase
{
    /// <summary>Consulter les notes d'un étudiant</summary>
    /// <param name="studentId">Identifiant de l'étudiant</param>
    /// <param name="subject">Matière</param>
    /// <param name="assignment">Devoir</param>
    /// <returns>Liste des notes — 404 si aucune note trouvée</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Grade>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetGrades(
        [FromRoute] string studentId,
        [FromQuery] string subject,
        [FromQuery] string assignment)
    {
        var grades = gradeService.GetGrades(studentId, subject, assignment).ToList();
        return grades.Count != 0 ? Ok(grades) : NotFound();
    }

    /// <summary>Créer une note pour un étudiant</summary>
    /// <param name="studentId">Identifiant de l'étudiant</param>
    /// <param name="request">Données de la note</param>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public IActionResult CreateGrade(
        [FromRoute] string studentId,
        [FromBody] GradeRequest request)
    {
        gradeService.CreateGrade(studentId, request);
        return StatusCode(StatusCodes.Status201Created);
    }
}
