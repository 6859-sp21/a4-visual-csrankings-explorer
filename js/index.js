(async function(){
    await DataService.initialize();
    const venues = DataService.getVenues();
    Venues.initialize(venues);
    const bubbleChartData = DataService.generateData();
    BubbleChart.render({ data: bubbleChartData });
})()