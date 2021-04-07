const BubbleChart = (function(){
    const width = 500;
    const height = width;
    const format = d3.format(",d");

    function render({ data }) {
        const selectedVenues = Venues.getSelected();
        const root = _pack({ data });
        const color = _color(data);
        const svg = d3.select("#bubble-chart")
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .attr("text-anchor", "middle");

        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .join(
                enter => enter.append("g").attr("transform", d => `translate(${d.x + 1},${d.y + 1})`),
                update => update,
                exit => exit.remove()
            )
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

        leaf.append("circle")
            .attr("id", d => (d.leafUid = Utils.DOM.uid("leaf")).id)
            .attr("r", d => d.r)
            .attr("fill-opacity", 0.7)
            .attr("fill", d => d3.schemeTableau10[0])
            .on('click', (event, d) => {
                //console.log(d)
                const barChartData = data.find(x => x.name === d.data.name).faculty;
                barChartData.sort((a, b) => b.total - a.total)
                BarChart.render({ data: barChartData, selectedVenues });
            })

        leaf.append("clipPath")
            .attr("id", d => (d.clipUid = Utils.DOM.uid("clip")).id)
            .append("use")
            .attr("xlink:href", d => d.leafUid.href);

        leaf.append("text")
            .attr("clip-path", d => d.clipUid)
            .selectAll("tspan")
            .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
            .text(d => d);

        leaf.append("title")
            .text(d => `${d.data.name === undefined ? "" : `${d.data.name}`} [${format(d.data.total)}]`);
    }

    function _pack({ data }){
        return d3.pack()
            .size([width - 2, height - 2])
            .padding(3)
            (d3.hierarchy({children: data})
            .sum(d => d.total))
    }

    function _color(data) {
        return d3.scaleOrdinal(data.map(d => d.name), d3.schemeTableau10);
    }

    return {
        render
    }
})();