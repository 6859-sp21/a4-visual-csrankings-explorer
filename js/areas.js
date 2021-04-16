const Areas = (() => {
    let areas;
    function initialize(data) {
        areas = data;
        render();
    }

    function render() {
        const selectedAreas = document.querySelector("#selected-areas");
        const template = document.querySelector("#area-checkbox-template");
        const randomAreaIndex = Math.floor(Math.random() * areas.length);
        const header = document.createElement("h6");
        header.textContent = "Research Areas";
        selectedAreas.append(header);
        areas.forEach((area, i) => {
            const clone = template.content.cloneNode(true);
            const checkbox = clone.querySelector("input");
            checkbox.value = area;
            checkbox.checked = i === randomAreaIndex ? true : false;
            checkbox.addEventListener("change", () => {
                const selectedAreas = getSelected();
                const { fromYear, toYear } = TimePeriod.getYears();
                const bubbleChartData = DataService.generateBubbleChartData({ 
                    selectedAreas,
                    fromYear,
                    toYear 
                 });
                BubbleChart.render({ data: bubbleChartData });
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