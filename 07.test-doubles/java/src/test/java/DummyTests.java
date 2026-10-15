import dummy.Calculator;
import org.junit.jupiter.api.Test;

import java.util.Random;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DummyTests {
    private final Calculator calculator = new Calculator();

    @Test
    void shouldThrowWhenDividingByZero() {
        int numerator = new Random().nextInt(); // dummy — sa valeur n'a aucun impact sur le résultat
        int zero = 0;

        assertThatThrownBy(() -> calculator.divide(numerator, zero))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
