// default city/cities
let cities = ["toronto", "new_york"];

// dimensions
const width = 600;
const height = 400;

const margins = {top: 30, right: 150, bottom: 50, left: 80};
const dataWidth = width - margins.left - margins.right;
const dataHeight = height - margins.top - margins.bottom;

const labelMargin = 30;

const legendLMargin = 30;
const legendTMargin = 10;

const legendLineSpace = 20;
const legendCircleR = 5;
const legendTextLMargin = 10;


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
    .text("Temperature");

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

// legend
let legend = d3.legendColor()
    .shape("circle")
    .shapePadding(10)
    .scale(colours);
let legendGroup = svg.append("g")
    .attr("transform", `translate(${margins.left + dataWidth + legendLMargin}, ${legendTMargin})`);

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
    // getting min and max of each city, then the min and max of all of those, to get the overall extent of the data
    x.domain(d3.extent(data.flatMap(city => d3.extent(city.data, d => +d.year))));
    let xAxis = d3.axisBottom(x)
        .tickFormat(d3.format("d")); // to remove thousand separators for years
    xAxis(xAxisGroup);

    // updating Y axis
    y.domain(d3.extent(data.flatMap(city => d3.extent(city.data, d => +d.mean))));
    let yAxis = d3.axisLeft(y);
    yAxis(yAxisGroup);

    // updating colour scheme
    colours.domain(data.map(city => city.name));
    
    // updating legend
    let circles = legendGroup.selectAll("circle")
        .data(cities.map(idToName));
    let text = legendGroup.selectAll("text")
        .data(cities.map(idToName));
    
    circles.exit().remove();
    text.exit().remove();
    
    circles.enter()
        .append("circle")
        .attr("cx", legendCircleR)
        .attr("r", legendCircleR)
        .merge(circles)
            .attr("cy", (d, i) => legendLineSpace * i + legendCircleR)
            .attr("fill", colours);
    
    text.enter()
        .append("text")
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .attr("x", legendCircleR * 2 + legendTextLMargin)
        .merge(text)
            .attr("y", (d, i) => legendLineSpace * i + legendCircleR)
            .text(city => city);

    // joining the data to each line
    let mean = dataArea.selectAll(".mean")
        .data(data);
    
    // removing lines that are no longer needed
    mean.exit().remove();

    mean.attr("stroke", d => colours(d.name))
    .attr("d", d => lineGen(d.data));
    
    // adding the lines if they don't exist already and updating them
    mean.enter()
        .append("path")
        .attr("class", "mean")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke", d => colours(d.name))
        .attr("d", d => lineGen(d.data));
}

// converts from city id to city name
function idToName(id) {
    return id.split("_").map(word => word.charAt(0).toUpperCase() + word.substr(1)).join(" ")
}

// reading the data
let allData = [];

for (let i in cities) {
    d3.csv(`${cities[i]}.csv`, formatData).then(function(d) { // storing the data
        allData.push({name: idToName(cities[i]), data: d});

        // if all cities are loaded
        if (+i === (cities.length - 1)) {
            updateGraph(allData);
        }
    });
}
