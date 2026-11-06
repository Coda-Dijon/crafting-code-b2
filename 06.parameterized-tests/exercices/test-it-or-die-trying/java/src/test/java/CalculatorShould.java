import org.junit.jupiter.api.Test;
import parameterized.tests.intro.Calculator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CalculatorShould {
    @Test
    void supportAdd() {
        // Arrange
        var calculator = new Calculator();

        // Act
        var result = calculator.calculate(9, 3, Calculator.ADD);

        // Assert
        assertEquals(12, result);
    }

    @Test
    void supportMultiply() {
        // Arrange
        var calculator = new Calculator();

        // Act
        var result = calculator.calculate(3, 76, Calculator.MULTIPLY);

        // Assert
        assertEquals(228, result);
    }

    @Test
    void supportDivide() {
        // Arrange
        var calculator = new Calculator();

        // Act
        var result = calculator.calculate(9, 3, Calculator.DIVIDE);

        // Assert
        assertEquals(3, result);
    }

    @Test
    void supportSubtract() {
        // Arrange
        var calculator = new Calculator();

        // Act
        var result = calculator.calculate(9, 3, Calculator.SUBTRACT);

        // Assert
        assertEquals(6, result);
    }

    @Test
    void failWhenOperatorIsNotSupported() {
        var calculator = new Calculator();
        var exception = assertThrows(IllegalArgumentException.class,
                () -> calculator.calculate(9, 3, "unsupportedOperator"));

        assertEquals("Not supported operator", exception.getMessage());
    }

    @Test
    void failWhenDividingByZero() {
        var calculator = new Calculator();
        assertThrows(ArithmeticException.class,
                () -> calculator.calculate(2, 0, Calculator.DIVIDE));
    }
}
