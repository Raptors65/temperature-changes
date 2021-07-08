// dimensions
const width = 460;
const height = 400;

const margins = {top: 30, right: 30, bottom: 50, left: 80};
const dataWidth = width - margins.left - margins.right;
const dataHeight = height - margins.top - margins.bottom;

const labelMargin = 30;

const titleY = 10;


var svg = d3.select("#canvas").append("svg")
            .attr("width", width)
            .attr("height", height);

var dataArea = svg.append("g")
                .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// title
svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("x", width / 2)
    .attr("y", titleY)
    .attr("font-weight", "bold")
    .text("Toronto");

// X axis label
svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("x", dataWidth / 2 + margins.left)
    .attr("y", dataHeight + margins.top + labelMargin)
    .text("Year");

// Y axis label
svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "auto")
    .attr("x", margins.left - labelMargin)
    .attr("y", dataHeight / 2 + margins.top)
    .attr("transform", `rotate(-90, ${margins.left - labelMargin}, ${dataHeight / 2 + margins.top})`)
    .text("Temp");

//Read the data
d3.csv("data.csv",

    // When reading the csv, I must format variables:
    function(d){
        return {year: d.year, mean: d.mean, high: d.high, low: d.low}
    },

    // Now I can use this dataset:
    function(data) {
        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d.year; }))
            .range([0, dataWidth]);
        dataArea.append("g")
            .attr("transform", "translate(0," + dataHeight + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.mean; })])
            .range([dataHeight, 0]);
        dataArea.append("g")
            .call(d3.axisLeft(y));

        // Add the line
        dataArea.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.year) })
                .y(function(d) { return y(d.mean) })
            );

})