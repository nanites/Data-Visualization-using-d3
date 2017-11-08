
function gridExtent(d) {
    return [Math.min(d.NW, d.NE, d.SW, d.SE),
            Math.max(d.NW, d.NE, d.SW, d.SE)];
}

//////////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries

var svgSize = 490;
var bands = 49;

var xScale = d3.scaleLinear().domain([0, bands]).  range([0, svgSize]);
var yScale = d3.scaleLinear().domain([-1,bands-1]).range([svgSize, 0]);

function createSvg(sel)
{
    return sel
        .append("svg")
        .attr("width", svgSize)
        .attr("height", svgSize);
}

function createGroups(data) {
    return function(sel) {
        return sel
            .append("g")
            .selectAll("rect")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function(d) {
                return "translate(" + xScale(d.Col) + "," + yScale(d.Row) + ")";
            });
    };
}

d3.selection.prototype.callReturn = function(callable)
{
    return callable(this);
};

//////////////////////////////////////////////////////////////////////////////

function polarity(d, value) {
    var result = {
        NW: d.NW < value ? 0 : 1,
        NE: d.NE < value ? 0 : 1,
        SW: d.SW < value ? 0 : 1,
        SE: d.SE < value ? 0 : 1
    };
    result.case = result.SW + result.SE * 2 + result.NE * 4 + result.NW * 8;
    return result;
}

// currentContour is a global variable which stores the value
// of the contour we are currently extracting

var currentContour;
function includesOutlineContour(d) {
    var extent = gridExtent(d);
    return currentContour >= extent[0] && currentContour <= extent[1];
}


function includesFilledContour(d) {
    // WRITE THIS PART.
    var extent = gridExtent(d);
    return currentContour >= extent[0];
}

function generateOutlineContour(d) {
    // HINT: you should set up scales which, given a contour value, go
    // along positions in the boundary of the square
    var wScale = d3.scaleLinear().domain([d.SW, d.NW]).range([0, 10]);
    var eScale = d3.scaleLinear().domain([d.SE, d.NE]).range([0, 10]);
    var nScale = d3.scaleLinear().domain([d.NW, d.NE]).range([0, 10]);
    var sScale = d3.scaleLinear().domain([d.SW, d.SE]).range([0, 10]);
    switch (polarity(d, currentContour).case) {
        case 0: return "M0 0 L0 10 L10 10 L10 0 L0 0";
        case 1: return "M" +sScale(currentContour)+ " 0 L0 " +wScale(currentContour)
        case 2: return "M" +sScale(currentContour)+ " 0 L10 " +eScale(currentContour)
        case 3: return "M0 " +wScale(currentContour)+ " L10 " +eScale(currentContour)
        case 4: return "M" +nScale(currentContour)+ " 10 L10 " +eScale(currentContour)
        case 5: return "M0 " +wScale(currentContour)+ " L" +nScale(currentContour)+ " 10 M" +sScale(currentContour)+ " 0 L10 " +eScale(currentContour)
        case 6: return "M" +sScale(currentContour)+ " 0 L" +nScale(currentContour)+" 10"
        case 7: return "M0 " +wScale(currentContour)+ " L" +nScale(currentContour)+ " 10"
        case 8: return "M" +nScale(currentContour)+ " 10 L2 " +wScale(currentContour)
        case 9: return "M" +nScale(currentContour)+ " 10 L" +sScale(currentContour)+ " 0"
        case 10: return "M0 " +wScale(currentContour)+ " L" +sScale(currentContour)+ " 0 M" +nScale(currentContour)+ " 10 L10 " +eScale(currentContour)
        case 11: return "M10 " +eScale(currentContour)+ " L" +nScale(currentContour)+ " 10"
        case 12: return "M0 " +wScale(currentContour)+ " L10 " +eScale(currentContour)
        case 13: return "M" +sScale(currentContour)+ " 0 L10 " +eScale(currentContour)
        case 14: return "M0 " +wScale(currentContour)+ " L" +sScale(currentContour)+ " 0"
        case 15: return "M0 0 L0 10 L10 10 L10 0 L0 0";
    }
}

function generateFilledContour(d) {
    // HINT: you should set up scales which, given a contour value, go
    // along positions in the boundary of the square
    var wScale = d3.scaleLinear().domain([d.SW, d.NW]).range([0, 10]);
    var eScale = d3.scaleLinear().domain([d.SE, d.NE]).range([0, 10]);
    var nScale = d3.scaleLinear().domain([d.NW, d.NE]).range([0, 10]);
    var sScale = d3.scaleLinear().domain([d.SW, d.SE]).range([0, 10]);
    switch (polarity(d, currentContour).case) {
        case 0: return "M0 0 L0 10 L10 10 L10 0 L0 0 Z";
        case 1: return "M0 10 L10 10 L10 0 L" +sScale(currentContour)+" 0 L0 " +wScale(currentContour) + " L0 10 Z";
        case 2: return "M0 0 L0 10 L10 10 L10 " +eScale(currentContour)+ " L" +sScale(currentContour)+ " 0 L0 0 Z";
        case 3: return "M0 10 L0 " +wScale(currentContour)+ " L10 " +eScale(currentContour)+ " L10 10 L0 10 Z";
        case 4: return "M0 0 L0 10 L" +nScale(currentContour)+ " 10 L10 " +eScale(currentContour)+ " L10 0 L0 0 Z";
        case 5: return "M0 10 L0 " +wScale(currentContour)+ " L" +nScale(currentContour)+ " 10 L0 10 M10 0 L" +sScale(currentContour)+ " 0 L10 " +eScale(currentContour)+ " L10 0 Z";
        case 6: return "M0 0 L0 10 L" +nScale(currentContour)+ " 10 L" +sScale(currentContour)+ " 0 L0 0 Z";
        case 7: return "M0 10 L" +nScale(currentContour)+ " 10 L0 " +wScale(currentContour)+ " L0 10 Z";
        case 8: return "M0 0 L0 " +wScale(currentContour)+ " L" +nScale(currentContour)+ " 10 L10 10 L10 0 L0 0 Z";
        case 9: return "M10 10 L10 0 L" +sScale(currentContour)+ " 0 L" +nScale(currentContour)+ " 10 L10 10 Z";
        case 10: return "M0 0 L0 " +wScale(currentContour)+ " L" +sScale(currentContour)+ " 0 Z M10 10 L10 " +eScale(currentContour)+ " L" +nScale(currentContour)+ " 10 Z";
        case 11: return "M10 10 L10 " +eScale(currentContour)+ " L"   +nScale(currentContour)+ " 10 L10 10 Z";
        case 12: return "M0 0 L10 0 L10 " +eScale(currentContour)+ " L0 "  +wScale(currentContour)+ " L0 0 Z";
        case 13: return "M10 0 L10 " +eScale(currentContour)+ " L" +sScale(currentContour)+ " 0 L10 0 Z";
        case 14: return "M0 0 L0 " +wScale(currentContour)+ " L" +sScale(currentContour)+ " 0 L0 0 Z";
        case 15: return "M0 0";
    }
}


function createOutlinePlot(minValue, maxValue, steps, sel)
{
    var contourScale = d3.scaleLinear().domain([1, steps]).range([minValue, maxValue]);
    for (var i=1; i<=steps; ++i) {
        currentContour = contourScale(i);
        sel.filter(includesOutlineContour).append("path")
            .attr("transform", "translate(0, 10) scale(1, -1)") // ensures that positive y points up
            .attr("d", generateOutlineContour)
            .attr("fill", "none")
            .attr("stroke", "black");
    }
}

function createFilledPlot(minValue, maxValue, steps, sel, colorScale)
{
    var contourScale = d3.scaleLinear().domain([1, steps]).range([minValue, maxValue]);
    for (var i=steps; i>=1; --i) {
        currentContour = contourScale(i);
        sel.filter(includesFilledContour).append("path")
            .attr("transform", "translate(0, 10) scale(1, -1)") // ensures that positive y points up
            .attr("d", generateFilledContour)
            .attr("fill", function(d) { return colorScale(currentContour); });
    }
}

var plot1T = d3.select("#plot1-temperature")
        .callReturn(createSvg)
        .callReturn(createGroups(temperatureCells));
var plot1P = d3.select("#plot1-pressure")
        .callReturn(createSvg)
        .callReturn(createGroups(pressureCells));

createOutlinePlot(-70, -60, 10, plot1T);
createOutlinePlot(-500, 200, 10, plot1P);

var plot2T = d3.select("#plot2-temperature")
        .callReturn(createSvg)
        .callReturn(createGroups(temperatureCells));
var plot2P = d3.select("#plot2-pressure")
        .callReturn(createSvg)
        .callReturn(createGroups(pressureCells));

createFilledPlot(-70, -60, 10, plot2T, d3.scaleLinear().domain([-70, -60]).range(["blue", "red"]));
createFilledPlot(-500, 200, 10, plot2P, d3.scaleLinear().domain([-500, 0, 500]).range(["#ca0020", "#f7f7f7", "#0571b0"]));