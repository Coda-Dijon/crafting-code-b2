package stub;

public class Calculator {
    private final Authorizer authorizer;

    public Calculator(Authorizer authorizer) {
        this.authorizer = authorizer;
    }

    public int divide(int numerator, int denominator) {
        if (!authorizer.authorize()) {
            throw new SecurityException("Access denied");
        }
        if (denominator == 0) {
            throw new IllegalArgumentException("Denominator can not be zero");
        }
        return numerator / denominator;
    }
}
