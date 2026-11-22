package grades;

public record GradeRequest(
    String subject,
    String assignment,
    double value
) {}
