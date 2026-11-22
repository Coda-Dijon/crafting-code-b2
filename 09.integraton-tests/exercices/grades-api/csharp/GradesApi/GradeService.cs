namespace GradesApi;

public class GradeService(IGradeRepository repository)
{
    public IEnumerable<Grade> GetGrades(string studentId, string subject, string assignment) 
        => repository.FindBy(studentId, subject, assignment);

    public void CreateGrade(string studentId, GradeRequest request) 
        => repository.Save(new Grade(studentId, request.Subject, request.Assignment, request.Value));
}
