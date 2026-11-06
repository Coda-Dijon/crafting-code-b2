import org.junit.jupiter.api.Test;
import stub.Authorizer;
import stub.Calculator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class StubTests {
    @Test
    void shouldDivideWhenAuthorizationIsAccepted() {
        var calculator = new Calculator(new AllowAccessAuthorizer());

        assertThat(calculator.divide(9, 3)).isEqualTo(3);
    }

    @Test
    void shouldThrowWhenAuthorizationIsDenied() {
        var calculator = new Calculator(new DenyAccessAuthorizer());

        assertThatThrownBy(() -> calculator.divide(9, 3))
                .isInstanceOf(SecurityException.class);
    }

    static class AllowAccessAuthorizer implements Authorizer {
        @Override
        public boolean authorize() { return true; }
    }

    static class DenyAccessAuthorizer implements Authorizer {
        @Override
        public boolean authorize() { return false; }
    }
}
