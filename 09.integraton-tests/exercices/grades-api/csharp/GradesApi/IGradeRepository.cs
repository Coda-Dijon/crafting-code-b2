namespace GradesApi;

public interface IGradeRepository
{
    IEnumerable<Grade> FindBy(string studentId, string subject, string assignment);
    void Save(Grade grade);
}
