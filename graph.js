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
                .attr("transform", `translate(${margins.left}, ${margins.top})`);

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

// X axis
var x = d3.scaleLinear()
    .range([0, dataWidth]);
var xAxisGroup = dataArea.append("g")
    .attr("transform", `translate(0, ${dataHeight})`);

// Y axis
var y = d3.scaleLinear()
    .range([dataHeight, 0]);
var yAxisGroup = dataArea.append("g")
    .call(d3.axisLeft(y));

// formatting data
function formatData(d) {
    return {year: d.year, mean: d.mean, high: d.high, low: d.low}
}

// updates graph with new data
function updateGraph(data) {
    // updating X axis
    x.domain(d3.extent(data, function(d) { return +d.year }));
    var xAxis = d3.axisBottom(x);
    xAxis(xAxisGroup)
    // updating Y axis
    y.domain([d3.min(data, function(d) { return +d.low }),
              d3.max(data, function(d) { return +d.high })])
    var yAxis = d3.axisLeft(y);
    yAxis(yAxisGroup)

    // joining the data to each line
    var mean = dataArea.selectAll(".mean")
        .data([data]);
    var high = dataArea.selectAll(".high")
        .data([data]);
    var low = dataArea.selectAll(".low")
        .data([data]);
    
    // adding the lines if they don't exist already and updating them
    mean.enter()
        .append("path")
        .attr("class", "mean")
        .attr("fill", "none")
        .attr("stroke", "#777")
        .attr("stroke-width", 1.5)
        .merge(mean)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.mean) })
        );
    high.enter()
        .append("path")
        .attr("class", "high")
        .attr("fill", "none")
        .attr("stroke", "#a00")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.high) })
        );
    low.enter()
        .append("path")
        .attr("class", "low")
        .attr("fill", "none")
        .attr("stroke", "#00a")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.low) })
        );
}

// reading the data
d3.csv("data.csv",
       formatData, // formatting the data
       updateGraph // updating the graph
);