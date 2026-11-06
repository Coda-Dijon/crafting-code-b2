package dummy;

public class Calculator {
    public int divide(int numerator, int denominator) {
        if (denominator == 0) {
            throw new IllegalArgumentException("Denominator can not be zero");
        }
        return numerator / denominator;
    }
}
