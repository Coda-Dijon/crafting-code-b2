package grades;

public record Grade(
    String studentId,
    String subject,
    String assignment,
    double value
) {}
