package grades;

import java.util.List;

public interface GradeRepository {
    List<Grade> findBy(String studentId, String subject, String assignment);
    void save(Grade grade);
}
