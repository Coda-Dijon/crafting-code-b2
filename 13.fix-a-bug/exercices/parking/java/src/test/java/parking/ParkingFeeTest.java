package parking;

import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class ParkingFeeTest {
    @Test
    void short_parking_is_free() {
        assertThat(ParkingFee.compute(Duration.ofMinutes(10))).isZero();
    }

    @Test
    void first_started_hour_costs_2_euros() {
        assertThat(ParkingFee.compute(Duration.ofMinutes(45))).isEqualTo(2);
    }

    @Test
    void each_started_hour_is_charged() {
        assertThat(ParkingFee.compute(Duration.ofMinutes(90))).isEqualTo(4);
    }

    @Test
    void fee_is_capped_at_15_euros_per_day() {
        assertThat(ParkingFee.compute(Duration.ofHours(10))).isEqualTo(15);
    }
}
