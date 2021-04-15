const BubbleChart = (() => {
    const container = document.querySelector("#bubble-chart");
    const width = container.clientWidth;
    const height = container.clientHeight;
    const format = _format(",d");
    const svg = d3.select(container)
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .attr("text-anchor", "middle");
    let selectedBubble;

    function render({ data }) {
        const root = _pack({ data });    
        const leaf = svg.selectAll("g")
            .data(root.leaves(), d => d.name)
            .join(
                enter => enter.append("g"),
                update => update.remove(),
                exit => exit.remove()
            )
            .append("g")
            .attr("transform", `translate(${width/2}, ${height/2})`)

        leaf
            .on("click", function (event, d){
                event.preventDefault();
                const g = d3.select(this);
                const currCircle = g.select("circle");
                const currText = g.select("text");
                if (selectedBubble) {
                    const prevCircle = selectedBubble.select("circle");
                    const prevText = selectedBubble.select("text");
                    _setBubbleInactiveState(selectedBubble, prevCircle, prevText);
                    delete selectedBubble.data.selected;
                    selectedBubble = g;
                    _setBubbleActiveState(g, currCircle, currText);
                    BarChart.render({ 
                        data: DataService.generateBarChartData({ 
                            university: d.data.name
                        })
                    });
                } else {
                    selectedBubble = g;
                    d.data.selected = true;
                    _setBubbleActiveState(g, currCircle, currText);
                    BarChart.render({ 
                        data: DataService.generateBarChartData({ 
                            university: d.data.name
                        })
                    });

                }
            })
            .on("mouseenter", function(event, d){
                event.preventDefault();
                const g = d3.select(this);
                if (!selectedBubble || (selectedBubble && g.node() != selectedBubble.node())) {
                    const circle = g.select("circle");
                    const text = g.select("text");
                    _setBubbleActiveState(g, circle, text);
                }
            })
            .on("mouseleave", function(event, d) {
                event.preventDefault();
                const g = d3.select(this);
                if (!selectedBubble || (selectedBubble && g.node() != selectedBubble.node())) {
                    const circle = g.select("circle");
                    const text = g.select("text");
                    _setBubbleInactiveState(g, circle, text);
                }
            })

        leaf
            .transition()
            .ease(d3.easeExpInOut)
            .duration(1000)
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
        
        const circle = leaf.append("circle");

        circle
            .attr("id", d => (d.leafUid = Utils.DOM.uid("leaf")).id)
            .attr("r", d => d.r)
            .attr("stroke", Utils.Colors.WHITE)
            .attr("fill", d => d.data.selected ? Utils.Colors.WHITE : Utils.Colors.GREY)
            
        
        circle
            .transition()
            .ease(d3.easeExpInOut)
            .duration(1000)
            .attr("r", d => d.r)

        const text = leaf.append("text");

        text
            .attr("fill", d => d.data.selected ? Utils.Colors.GREY : Utils.Colors.WHITE)
            .attr("text-anchor", "middle")
            .attr("dy", ".2em")
            .attr("font-size", d => d.r / 1.5)
            .attr("opacity", 0)
            .text(d => format(d.data.total))
        
        text
            .transition()
            .ease(d3.easeExpInOut)
            .delay(500)
            .duration(1000)
            .attr("opacity", 1)

        const tooltip = leaf.append("title");
        tooltip
            .text(d => `${format(d.data.total)} publication(s), click for details`);

        if (selectedBubble) {
            const university = selectedBubble.datum().data.name;
            if (university) {
                BarChart.render({ 
                    data: DataService.generateBarChartData({ 
                        university
                    })
                });
            }
        }
    }

    function _pack({ data }){
        return d3.pack()
            .size([width - 50, height - 50])
            .padding(3)
            (d3.hierarchy({children: data})
            .sum(d => d.total))
    }

    function _format(pattern) {
        return d3.format(pattern);
    }

    function _setBubbleActiveState(g, circle ,text) {
        g.classed("hover-state", true);
        text.attr("fill", Utils.Colors.GREY);
        circle.attr("fill", Utils.Colors.WHITE)
    }

    function _setBubbleInactiveState(g, circle, text) {
        g.classed("hover-state", false);
        text.attr("fill", Utils.Colors.WHITE);
        circle.attr("fill", Utils.Colors.GREY)
    }

    return {
        render
    }
})();