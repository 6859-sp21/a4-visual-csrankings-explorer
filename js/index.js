(async () => {
    await DataService.initialize();
    const areas = DataService.getAreas();
    Areas.initialize(areas);
    const selectedAreas = Areas.getSelected();
    const currentYear = (new Date()).getFullYear();
    const bubbleChartData = DataService.generateBubbleChartData({
        selectedAreas,
        fromYear: currentYear - 5,
        toYear: currentYear
    });
    const years = DataService.generateTimePeriod();
    TimePeriod.render({ years });
    BubbleChart.render({ data: bubbleChartData, selectedAreas });
})()