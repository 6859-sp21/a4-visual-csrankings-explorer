const Venues = (() => {
    let venues;
    function initialize(data) {
        venues = data;
        render();
    }

    function render() {
        const selectedVenues = document.querySelector("#selected-venues");
        const heading = document.createElement('h5');
        heading.textContent = "Selected Venues";
        selectedVenues.append(heading);
        const template = document.querySelector("#venue-checkbox");
        Object.keys(venues).forEach(venue => {
            const clone = template.content.cloneNode(true);
            const checkbox = clone.querySelector("input");
            checkbox.value = venue;
            checkbox.checked = true;
            checkbox.addEventListener("change", (event) => {
                const selectedVenues = getSelected();
                const bubbleChartData = DataService.generateBubbleChartData({ selectedVenues });
                BubbleChart.render({ data: bubbleChartData, selectedVenues });
            })
            const label = clone.querySelector("label");
            label.textContent = getLabel(venue);
            selectedVenues.append(clone);
        });
    }

    function getSelected() {
        return Array
        .from(document.querySelectorAll("#selected-venues input"))
        .filter(element => element.checked)
        .map(element => element.value)
    }

    function getLabel(venue) {
        return venues[venue]
    }

    return {
        initialize,
        render,
        getSelected,
        getLabel
    }
})()