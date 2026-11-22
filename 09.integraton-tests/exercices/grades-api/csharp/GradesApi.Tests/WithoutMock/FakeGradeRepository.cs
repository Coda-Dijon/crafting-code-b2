namespace GradesApi.Tests.WithoutMock;

public class FakeGradeRepository : IGradeRepository
{
    private readonly List<Grade> _store = [];

    public IEnumerable<Grade> FindBy(string studentId, string subject, string assignment) 
        => _store.Where(g => g.StudentId == studentId
                             && g.Subject == subject
                             && g.Assignment == assignment);

    public void Save(Grade grade) => _store.Add(grade);

    public void Clear() => _store.Clear();
}
