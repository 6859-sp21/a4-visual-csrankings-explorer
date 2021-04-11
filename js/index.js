(async () => {
    await DataService.initialize();
    const venues = DataService.getVenues();
    Venues.initialize(venues);
    const selectedVenues = Venues.getSelected();
    const bubbleChartData = DataService.generateBubbleChartData({ selectedVenues });
    const years = DataService.generateTimePeriod();
    TimePeriod.initialize(years);
    BubbleChart.render({ data: bubbleChartData, selectedVenues });
})()