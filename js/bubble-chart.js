const BubbleChart = (() => {
    const container = document.querySelector("#bubble-chart");
    const width = container.clientWidth;
    const height = container.clientHeight;
    const format = d3.format(",d");

    const svg = d3.select(container)
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .attr("text-anchor", "middle");

    let selectedBubble;

    function render({ data }) {
        clear();
        BarChart.clear();

        if (!data.length) {
            return
        }
        const root = _pack({ data });
      
        const leaf = svg.selectAll("g")
            .data(root.leaves(), d => d.data.name)
            .join("g")
            .attr("id", (d, i) => `bubble${i}`)
            .attr("transform", `translate(${width/2}, ${height/2})`)
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

        leaf
            .on("click", function() {
                const bubble = d3.select(this);
                if (selectedBubble) {
                    _unSelectBubble({ selectedBubble });
                }
                selectedBubble = bubble;
                _selectBubble({ selectedBubble });
                _renderBarChart({ selectedBubble })
            })
            .on("mouseenter", function(){
                const bubble = d3.select(this);
                _mouseEvent({ bubble, enter: true })
            })
            .on("mouseleave", function() {
                const bubble = d3.select(this);
                _mouseEvent({ bubble, enter: false })
            })
        
        leaf.append("circle")
            .attr("r", d => d.r)
            .attr("stroke", Utils.Colors.WHITE)
            .attr("fill", Utils.Colors.GREY)

        leaf.append("text")
            .attr("fill", Utils.Colors.WHITE)
            .attr("text-anchor", "middle")
            .attr("dy", ".2em")
            .attr("font-size", d => d.r / 1.5)
            .text(d => format(d.data.total))

        leaf.append("title")
            .text(d => `University has ${format(d.data.total)} publication(s), click for more details.`);
    }

    function clear() {
        d3.select(container).selectAll("svg > g > *").remove();
    }

    function _pack({ data }){
        return d3.pack()
            .size([width - 50, height - 50])
            .padding(3)
            (d3.hierarchy({children: data})
            .sum(d => d.total))
    }

    function _mouseEvent({ bubble, enter }) {
        if (!selectedBubble || (selectedBubble && selectedBubble.node() != bubble.node())) {
            if (enter) {
                _selectBubble({ selectedBubble: bubble });
            } else {
                _unSelectBubble({ selectedBubble: bubble });
            }
        }
    }

    function _selectBubble({ selectedBubble }) {
        const circle = selectedBubble.select("circle");
        const text = selectedBubble.select("text");
        selectedBubble.classed("hover-state", true);
        text.attr("fill", Utils.Colors.GREY);
        circle.attr("fill", Utils.Colors.WHITE)
    }

    function _unSelectBubble({ selectedBubble }) {
        const circle = selectedBubble.select("circle");
        const text = selectedBubble.select("text");
        selectedBubble.classed("hover-state", false);
        text.attr("fill", Utils.Colors.WHITE);
        circle.attr("fill", Utils.Colors.GREY)
    }

    function _renderBarChart({ selectedBubble }) {
        BarChart.clear();
        const data = selectedBubble.datum().data
        const university = data.name;
        if (university) {
            BarChart.render({ 
                data: DataService.generateBarChartData({ 
                    university
                })
            });
        }
    }

    return {
        render,
        clear
    }
})();