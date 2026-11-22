package grades.withoutMock;

import grades.Grade;
import grades.GradeRepository;

import java.util.ArrayList;
import java.util.List;

public class FakeGradeRepository implements GradeRepository {

    private final List<Grade> store = new ArrayList<>();

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

    public void clear() {
        store.clear();
    }
}
