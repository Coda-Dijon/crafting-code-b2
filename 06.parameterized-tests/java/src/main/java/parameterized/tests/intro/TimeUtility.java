package parameterized.tests.intro;

import java.time.LocalDateTime;

public class TimeUtility {
    public String getTimeOfDay() {
        var time = LocalDateTime.now();
        int hour = time.getHour();

        if (hour < 6) return "Night";
        if (hour < 12) return "Morning";
        if (hour < 18) return "Afternoon";
        return "Evening";
    }
}
