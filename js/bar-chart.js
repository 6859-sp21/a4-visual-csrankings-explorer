const BarChart = (() => {
    const container = document.querySelector("#bar-chart");
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 30, right: 10, bottom: 0, left: 35 };
    const format = d3.format(",d");

    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    const rectGroup = svg.append("g")
        .attr("id", "rectGroup");
    
    const textGroup = svg.append("g")
        .attr("id", "textGroup")
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif");

    const yAxis = svg.append("g");

    let selectedBar;
  
    function render({ data }) {
        const x = _x({ data, width });
        const y = _y({ data, height });

        const rect = rectGroup
          .selectAll("rect")
          .data(data, d => d.name)
          .join(   
            enter => enter.append("rect"),
            update => update,
            exit => exit.remove()
          )
            .attr("id", (d, i) => `rect${i}`)
            .attr("stroke", Utils.Colors.WHITE)
            .attr("fill", Utils.Colors.GREY)
            .attr("x", x(0))
            .attr("y", (d, i) => y(i))
            .attr("width", d => x(d.total) - x(0))
            .attr("height", y.bandwidth())
        
        rect
            .on("click", function() {
                const bar = d3.select(this);
                if (selectedBar) {
                    _unSelectBar({ selectedBar });
                }
                selectedBar = bar;
                _selectBar({ selectedBar });
                _openFacultyWebsite({ selectedBar });
            })
            .on("mouseenter", (event) => {
                _mouseEvent({ event, enter: true })

            })
            .on("mouseleave", (event) => {
                _mouseEvent({ event, enter: false })
            });

        rect
            .append("title")
            .text(d => `Faculty member has ${format(d.total)} publication(s), click to visit faculty member's website.`);

        textGroup
          .selectAll("text")
          .data(data, d => d.name)
          .join(   
            enter => enter.append("text"),
            update => update,
            exit => exit.remove()
          )
            .attr("id", (d, i) => `text${i}`)
            .attr("fill", Utils.Colors.WHITE)
            .attr("x", d => x(d.total))
            .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("dx", -8)
            .text(d => d.total)
          .call(text => text.filter(d => x(d.total) - x(0) < 20) // short bars
            .attr("dx", +4)
            .attr("text-anchor", "start"));

        yAxis.call(_yAxis.bind(null, { y, data }));

        _renderFacultyDetails();
    }

    function clear() {
        d3.select(container).selectAll("svg > g > *").remove();
        const facultyDetails = document.querySelector("#faculty-details");
        if (facultyDetails) {
            facultyDetails.remove();
        }
    }

    function _renderFacultyDetails() {
        const template = document.querySelector("#faculty-details-template");
        const clone = template.content.cloneNode(true);
        container.parentElement.prepend(clone);
    }

    function _openFacultyWebsite({ selectedBar }) {
        const data = selectedBar.datum();
        const facultyInfo = DataService.getFacultyInfo(data.name)[0];
        window.open(facultyInfo.homepage, "_blank");
    }

    function _mouseEvent({ event, enter }) {
        const bar = d3.select(event.target);
        if (!selectedBar || (selectedBar && selectedBar.node() != bar.node())) {
            if (enter) {
                _selectBar({ selectedBar: bar });
            } else {
                _unSelectBar({ selectedBar: bar });
            }
        }
    }

    function _selectBar({ selectedBar }) {
        selectedBar.attr("fill", Utils.Colors.WHITE);
        selectedBar.classed("hover-state", true);
        const id = selectedBar.attr("id").split("rect")[1];
        const textLabel = textGroup.select(`#text${id}`);
        textLabel.attr("fill", Utils.Colors.GREY);
    }

    function _unSelectBar({ selectedBar }) {
        selectedBar.attr("fill", Utils.Colors.GREY);
        selectedBar.classed("hover-state", false);
        const id = selectedBar.attr("id").split("rect")[1];
        const textLabel = textGroup.select(`#text${id}`);
        textLabel.attr("fill", Utils.Colors.WHITE);
    }

    function _y({ data, height }) {
        return d3.scaleBand()
            .domain(d3.range(data.length))
            .rangeRound([margin.top, height - margin.bottom])
            .padding(0.1)
    }

    function _x({ data, width } ) {
        return d3.scaleLinear()
            .domain([0, d3.max(data, d => d.total)])
            .range([margin.left, width - margin.right])
    }

    function _yAxis({ y, data }, g) {
        return g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(i => data[i].initials).tickSizeOuter(0))
    }

    return {
        render,
        clear
    }
})()