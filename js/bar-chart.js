const BarChart = (() => {
    const container = document.querySelector("#bar-chart");
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 30, right: 10, bottom: 0, left: 35 };
    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
    const rectGroup = svg.append("g");
    const textGroup = svg.append("g")
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif");
    const yAxis = svg.append("g");
    let selectedBar;
  
    function render({ data }) {
        if (!selectedBar) {
            selectedBar = data[0];
            selectedBar.selected = true;
        } else if (!data.find(d => d.name === selectedBar.name)) {
             delete selectedBar.selected;
             selectedBar = data[0];
             selectedBar.selected = true;
        }
        const x = _x({ data, width });
        const y = _y({ data, height });
        const format = x.tickFormat(20, data.format);

        rectGroup
          .selectAll("rect")
          .data(data, d => d.name)
          .join(   
            enter => enter.append("rect"),
            update => update,
            exit => exit.remove()
          )
            .attr("stroke", Utils.Colors.WHITE)
            .attr("fill", d => d.selected ? Utils.Colors.WHITE : Utils.Colors.GREY)
            .attr("x", x(0))
            .attr("y", (d, i) => y(i))
            .attr("width", d => x(d.total) - x(0))
            .attr("height", y.bandwidth());
        
        textGroup
          .selectAll("text")
          .data(data, d => d.name)
          .join(   
            enter => enter.append("text"),
            update => update,
            exit => exit.remove()
          )
            .attr("fill", d => d.selected ? Utils.Colors.GREY : Utils.Colors.WHITE)
            .attr("x", d => x(d.total))
            .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("dx", -8)
            .text(d => format(d.total))
          .call(text => text.filter(d => x(d.total) - x(0) < 20) // short bars
            .attr("dx", +4)
            .attr("text-anchor", "start"));

        // xAxis.call(_xAxis.bind(null, { x, data, width}));  
        yAxis.call(_yAxis.bind(null, { y, data }));                    
    }

    function clear() {
        d3.select(container).selectAll("svg > *").remove();
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

    function _xAxis({ x, data, width }, g) {
        return g.attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x).ticks(width / 80, data.format))
            .call(g => g.selectAll(".domain").remove())
    }

    function _yAxis({ y, data }, g) {
        return g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(i => data[i].initials).tickSizeOuter(0))
    }

    function _format(data) {
        return x.tickFormat(20, data.format)
    }

    return {
        render,
        clear
    }
})()