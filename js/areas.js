const Areas = (() => {
    let areas;
    function initialize(data) {
        areas = data;
        render();
    }

    function render() {
        const selectedAreas = document.querySelector("#selected-areas");
        const template = document.querySelector("template#area-checkbox");
        areas.forEach(area => {
            const clone = template.content.cloneNode(true);
            const checkbox = clone.querySelector("input");
            checkbox.value = area;
            checkbox.checked = true;
            checkbox.addEventListener("change", (event) => {
                const selectedAreas = getSelected();
                const { fromYear, toYear } = TimePeriod.getYears();
                const bubbleChartData = DataService.generateBubbleChartData({ selectedAreas });
                BubbleChart.render({
                    data: bubbleChartData,
                    fromYear,
                    toYear 
                });
            });
            const label = clone.querySelector("label");
            label.textContent = area;
            selectedAreas.append(clone);
        });
    }

    function getSelected() {
        return Array
        .from(document.querySelectorAll("#selected-areas input"))
        .filter(element => element.checked)
        .map(element => element.value)
    }

    return {
        initialize,
        render,
        getSelected,
    }
})()