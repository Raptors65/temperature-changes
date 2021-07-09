const cities = ["toronto", "new_york"];

// dimensions
const width = 460;
const height = 400;

const margins = {top: 30, right: 30, bottom: 50, left: 80};
const dataWidth = width - margins.left - margins.right;
const dataHeight = height - margins.top - margins.bottom;

const labelMargin = 30;

// creating the graph area
let svg = d3.select("#canvas").append("svg")
            .attr("width", width)
            .attr("height", height);

let dataArea = svg.append("g")
                .attr("transform", `translate(${margins.left}, ${margins.top})`);

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
let x = d3.scaleLinear()
    .range([0, dataWidth]);
let xAxisGroup = dataArea.append("g")
    .attr("transform", `translate(0, ${dataHeight})`);

// Y axis
let y = d3.scaleLinear()
    .range([dataHeight, 0]);
let yAxisGroup = dataArea.append("g")
    .call(d3.axisLeft(y));

// colour scheme
let colours = d3.scaleOrdinal(d3.schemeCategory10);

// line generator
let lineGen = d3.line()
    .x(d => x(+d.year))
    .y(d => y(+d.mean));

// formatting data
function formatData(d) {
    return {year: +d.year, mean: +d.mean};
}

// updates graph with new data
function updateGraph(data) {
    // updating X axis
    x.domain(d3.extent(data.flatMap(function(city) {
        return d3.extent(city.data, d => +d.year)
    })));
    let xAxis = d3.axisBottom(x);
    xAxis(xAxisGroup)

    // updating Y axis
    y.domain(d3.extent(data.flatMap(function(city) {
        return d3.extent(city.data, d => +d.mean)
    })));
    let yAxis = d3.axisLeft(y);
    yAxis(yAxisGroup)

    // updating colour scheme
    colours.domain(data.map(city => city.name))

    // joining the data to each line
    let mean = dataArea.selectAll(".mean")
        .data(data);
    
    // adding the lines if they don't exist already and updating them
    mean.enter()
        .append("path")
        .attr("class", "mean")
        .attr("fill", "none")
        .attr("stroke", d => colours(d.name))
        .attr("stroke-width", 1.5)
        .merge(mean)
        .attr("d", function(d) { return lineGen(d.data);});
}

// reading the data
let allData = [];
// this counter is necessary because d3.csv is async
let citiesLoaded = 0;

for (let city of cities) {
    d3.csv(`${city}.csv`,
        formatData, // formatting the data
        function(d) { // storing the data
            allData.push({name: city, data: d});
            citiesLoaded++;

            // if all cities are loaded
            if (citiesLoaded === cities.length) {
                updateGraph(allData);
            }
        }
    );
}
