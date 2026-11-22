package grades;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

    private final GradeRepository repository;

    public GradeService(GradeRepository repository) {
        this.repository = repository;
    }

    public List<Grade> getGrades(String studentId, String subject, String assignment) {
        return repository.findBy(studentId, subject, assignment);
    }

    public void createGrade(String studentId, GradeRequest request) {
        repository.save(new Grade(studentId, request.subject(), request.assignment(), request.value()));
    }
}
