namespace GradesApi;

public record GradeRequest(
    string Subject,
    string Assignment,
    double Value
);
