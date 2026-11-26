using System;
using Xunit;

namespace Parking.Tests;

public class ParkingFeeTest
{
    [Fact]
    public void ShortParkingIsFree() =>
        Assert.Equal(0, ParkingFee.Compute(TimeSpan.FromMinutes(10)));

    [Fact]
    public void FirstStartedHourCosts2Euros() =>
        Assert.Equal(2, ParkingFee.Compute(TimeSpan.FromMinutes(45)));

    [Fact]
    public void EachStartedHourIsCharged() =>
        Assert.Equal(4, ParkingFee.Compute(TimeSpan.FromMinutes(90)));

    [Fact]
    public void FeeIsCappedAt15EurosPerDay() =>
        Assert.Equal(15, ParkingFee.Compute(TimeSpan.FromHours(10)));
}
