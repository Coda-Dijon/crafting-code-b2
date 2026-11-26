package parking;

import java.time.Duration;

public final class ParkingFee {
    private static final int FREE_MINUTES = 30;
    private static final int HOURLY_RATE = 2;
    private static final int DAILY_CAP = 15;

    private ParkingFee() {
    }

    public static int compute(Duration parkingDuration) {
        long minutes = parkingDuration.toMinutes();

        if (minutes < FREE_MINUTES) {
            return 0;
        }

        long startedHours = (minutes + 59) / 60;
        return (int) Math.min(startedHours * HOURLY_RATE, DAILY_CAP);
    }
}
