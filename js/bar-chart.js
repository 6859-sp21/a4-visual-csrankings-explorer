const BarChart = (function() {
    const width = 500;
    const height = 500;
    const margin = { top: 30, right: 10, bottom: 0, left: 30 };
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
    const xAxis =  svg.append("g");
    const stackContainer = svg.append("g");
    const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")

    function render({ data, selectedVenues }) {
        const series = _series(data);
        const color = _color(series.map(d => d.key));
        const legendColor = _color(selectedVenues);
        const x = _x({ series, width });
        const y = _y({ data, height });

        stackContainer
            .selectAll("g")
            .data(series)
            .join(
                enter =>  {
                    return enter
                        .append("g")
                            .attr("fill", d => color(d.key))
                },
                update => {
                    console.log("SERIES UPDATE")
                    console.log(update);
                    return update;
                },
                exit => {
                    console.log("SERIES EXIT")
                    console.log(exit)
                    return exit.remove();
                }
            )
            .selectAll("rect")
                .data(d => d)
                .join(
                    enter => enter
                        .append("rect")
                            .attr("x", d => x(d[0]))
                            .attr("y", d => y(d.data.name))
                            .attr("width", d => x(d[1]) - x(d[0]))
                            .attr("height", y.bandwidth())
                        .append("title")
                            .text(d => `${d.data.name}`)
                    ,
                    update => update,
                    exit => exit.remove()
                )

        xAxis.call(_xAxis.bind(null, { x, width}));   

        const legendGroup = legend.selectAll("g")
            .data(selectedVenues)
            .join(
                enter => {
                    return enter.append("g")
                },
                update => update,
                exit => exit.remove()
            )
            .attr("transform", (d, i) => `translate(${width - 20}, ${height - (i+ 1)*11})`);
    
        legendGroup.append("rect")
            .attr("x", 12)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", legendColor);
    
        legendGroup.append("text")
            .attr("x", 0)
            .attr("y", 10)
            .text(d => Venues.getLabel(d));
                    
    }

    function _series(data) {
        const sample = data[0];
        const exclude = ['name', 'total'];
        const keys = Object.keys(sample).filter(key =>  !exclude.includes(key));
        return d3.stack()
            .keys(keys)
            (data)
            .map(d => (d.forEach(v => v.key = d.key), d))
    }

    function _y({ data, height }) {
        return d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([margin.top, height - margin.bottom])
            .padding(0.08)
    }

    function _x({ series, width } ) {
        return d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
            .range([margin.left, width - margin.right])
    }

    function _color(data) {
        return d3.scaleOrdinal()
            .domain(data)
            .range(d3.schemeTableau10.slice(1))
            .unknown("#ccc")
    }

    function _xAxis({ x, width }, g) {
        return g.attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x).ticks(width / 100, "s"))
            .call(g => g.selectAll(".domain").remove())
    }

    function _yAxis({ y }, g) {
        return g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove())
    }

    return {
        render
    }
})()