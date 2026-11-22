package grades;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Grades", description = "Gestion des notes étudiantes")
@RestController
@RequestMapping("/students/{studentId}/grades")
class GradeController {

    private final GradeService gradeService;

    GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @Operation(
        summary = "Consulter les notes d'un étudiant",
        description = "Retourne les notes pour un étudiant, une matière et un devoir donnés. Retourne 404 si aucune note n'est trouvée."
    )
    @ApiResponse(responseCode = "200", description = "Notes trouvées")
    @ApiResponse(responseCode = "404", description = "Aucune note trouvée")
    @GetMapping
    ResponseEntity<List<Grade>> getGrades(
            @PathVariable String studentId,
            @RequestParam String subject,
            @RequestParam String assignment) {
        var grades = gradeService.getGrades(studentId, subject, assignment);
        if (grades.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(grades);
    }

    @Operation(
        summary = "Créer une note pour un étudiant",
        description = "Enregistre une nouvelle note pour un étudiant, une matière et un devoir."
    )
    @ApiResponse(responseCode = "201", description = "Note créée avec succès")
    @PostMapping
    ResponseEntity<Void> createGrade(
            @PathVariable String studentId,
            @RequestBody GradeRequest request) {
        gradeService.createGrade(studentId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
