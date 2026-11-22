package grades;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
public class InMemoryGradeRepository implements GradeRepository {

    private final List<Grade> store = new CopyOnWriteArrayList<>();

    @Override
    public List<Grade> findBy(String studentId, String subject, String assignment) {
        return store.stream()
            .filter(g -> g.studentId().equals(studentId)
                      && g.subject().equals(subject)
                      && g.assignment().equals(assignment))
            .toList();
    }

    @Override
    public void save(Grade grade) {
        store.add(grade);
    }
}
