namespace Parking;

public static class ParkingFee
{
    private const int FreeMinutes = 30;
    private const int HourlyRate = 2;
    private const int DailyCap = 15;

    public static int Compute(TimeSpan parkingDuration)
    {
        var minutes = (long) parkingDuration.TotalMinutes;

        if (minutes < FreeMinutes)
        {
            return 0;
        }

        var startedHours = (minutes + 59) / 60;
        return (int) Math.Min(startedHours * HourlyRate, DailyCap);
    }
}
