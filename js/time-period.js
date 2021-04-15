const TimePeriod = (() => {
    function render({ years }) {
        const startYear = years[0];
        const endYear = years[years.length - 1];
        const fromYear = Math.max(endYear - 5, startYear);
        const toYear = endYear;
        const fromSelect = _createSelect({ name: 'from-year'})
        _populateSelect({
            select: fromSelect,
            selected: fromYear,
            values: years
        });
        const toSelect = _createSelect({ name: 'to-year'})
        _populateSelect({
            select: toSelect,
            selected: toYear,
            values: years
        });
        const fromSelectLabel = _createLabel({
            forElement: 'from-year',
            text: "US universities sized by faculty's academic publications from"
        });
        const toSelectLabel = _createLabel({
            forElement: 'to-year',
            text: "to"
        });
        const timePeriod = document.querySelector("#time-period");
        timePeriod.append(fromSelectLabel);
        timePeriod.append(fromSelect);
        timePeriod.append(toSelectLabel);
        timePeriod.append(toSelect)
    }
    function getYears() {
        return {
            fromYear: parseInt(document.querySelector("select[name='from-year']").value),
            toYear: parseInt(document.querySelector("select[name='to-year']").value)
        }
    }
    function _createSelect({ name }) {
        const select = document.createElement("select");
        select.name = name;
        select.classList.add("form-control");
        select.classList.add('w-auto');
        select.addEventListener("change", _selectListener)
        return select;
    }
    function _populateSelect({ select, selected, values }) {
        values.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.text = value;
            if (value === selected) {
                option.selected = true;  
            }
            select.append(option);
        });
    }
    function _createLabel({ forElement, text }) {
        const label = document.createElement("label");
        label.htmlFor = forElement;
        label.textContent = text;
        return label;
    }
    function _selectListener(event) {
        const { fromYear, toYear } = getYears();
        if (toYear < fromYear) {
            alert(`Please enter a valid year range.`);
            return;
        }
        const selectedAreas = Areas.getSelected();
        const bubbleChartData = DataService.generateBubbleChartData({ 
            selectedAreas, 
            fromYear, 
            toYear 
        });
        BubbleChart.render({ data: bubbleChartData, selectedAreas });
    }
    return {
        render,
        getYears
    }
})();