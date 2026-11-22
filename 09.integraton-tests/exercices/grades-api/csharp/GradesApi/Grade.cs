namespace GradesApi;

public record Grade(
    string StudentId,
    string Subject,
    string Assignment,
    double Value
);
