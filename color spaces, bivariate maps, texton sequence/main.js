//////////////////////////////////////////////////////////////////////////////
// Global variables, preliminaries

var svgSize = 500;
var bands = 50;

var xScale = d3.scaleLinear().domain([0, bands]).  range([0, svgSize]);
var yScale = d3.scaleLinear().domain([-1,bands-1]).range([svgSize, 0]);

function createSvg(sel)
{
    return sel
    .append("svg")
    .attr("width", svgSize)
    .attr("height", svgSize);
}

function createRects(sel)
{
    return sel
    .append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) { return xScale(d.Col); })
    .attr("y", function(d) { return yScale(d.Row); })
    .attr("width", 10)
    .attr("height", 10);
}

function createPaths(sel)
{
    return sel
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d) {
        return "translate(" + xScale(d.Col) + "," + yScale(d.Row) + ")";
    })
    .append("path");
}

d3.selection.prototype.callReturn = function(callable)
{
    return callable(this);
};

//////////////////////////////////////////////////////////////////////////////

function glyphD(d) {
    var glyph = d3.scaleQuantize()
        .domain([d3.min(data, function(x) {return x.P}),
                 -d3.min(data, function(x) {return x.P})])
        .range(["M 0 5 L 10 5 Z M 5 0 L 5 10 M 0 0 L 10 10 M 10 0 L 0 10",
                "M 0 5 L 10 5 Z M 5 0 L 5 10 M 0 0 L 10 10",
                "M 0 5 L 10 5 Z M 5 0 L 5 10",
                "M 0 5 L 10 5",
                "M 3 5 L 8 5",
                "M 3 5 L 8 5",
                "M 0 5 L 10 5",
                "M 0 5 L 10 5 Z M 5 0 L 5 10",
                "M 0 5 L 10 5 Z M 5 0 L 5 10 M 0 0 L 10 10",
                "M 0 5 L 10 5 Z M 5 0 L 5 10 M 0 0 L 10 10 M 10 0 L 0 10"])
    return glyph(d.P);
}

function glyphStroke(d) {
    var glyphStr = d3.scaleQuantize()
    .domain([d3.min(data, function(x) {return x.P;}),
       d3.max(data, function(x) {return x.P;})])
    .range(["black", "white"])
    return glyphStr(d.P);
}


var extentP = d3.extent(data, function(d) { return d.P; });
var extentT = d3.extent(data, function(d) { return d.T; });


var colorT1_scale = d3.scaleLinear().domain([extentT[0], extentT[1]]).range(["#ffffbf", "#2c7bb6"]);

var colorP1_scale = d3.scaleLinear().domain([extentP[0], 0, -extentP[0]]).range([70,0,70])
var colorT2_scale = d3.scaleLinear().domain([extentT[0], extentT[1]]).range(["#d7191c", "#2c7bb6"]);
var hueP= d3.scaleLinear().domain([extentP[0], -extentP[0]]).range([60,300]);
var colorP2_scale = d3.scaleLinear().domain([extentT[0], extentT[1]]).range([20,80]);
var colorP1_scale_1  = d3.scaleLinear().domain([extentP[0], 0, -extentP[0]]).range([40, 80, 40]);


function colorT1(d) {
    return colorT1_scale(d.T);
}

function colorP1(d) {
    return d3.hcl(hueP(d.P), colorP1_scale(d.P), colorP1_scale_1(d.P));
}

function colorPT(d) {
    return d3.hcl(hueP(d.P), colorP1_scale(d.P), colorP2_scale(d.T));
}

function colorT2(d) {
    return colorT2_scale(d.T);
}

//////////////////////////////////////////////////////////////////////////////

//ColorLegend1 with axis
var legend_data_1 = []
for (var i=1; i<=300; ++i) {legend_data_1.push(i);}

    var legend1_range = d3.scaleLinear().domain([0,300]).range(["#ffffbf", "#2c7bb6"])
var svg = d3.select("#colorlegend-1")
.append("svg")
.attr("id", "colorlegend-1")
.attr("width", 500)
.attr("height", 50);


svg.selectAll("rect")
.data(legend_data_1)
.enter()
.append("rect")
.attr("fill", function(d){return legend1_range(d)})
.attr("width", 1)
.attr("height", 20)
.attr("x", function(d){return d+100})


var xLegendScale = d3.scaleLinear().domain([Math.ceil(extentT[0]), Math.ceil(extentT[1])]).range([0,300]);
var xAxis = svg.append("g")
.attr("transform", "translate(100, 20)")
.attr("class", "axis-x")
.call(d3.axisBottom(xLegendScale))



//ColorLegend2 with axis
var legend_data_2 = []
for (var i=1; i<=300; ++i) {legend_data_2.push(i);}

    var legend2_range = d3.scaleLinear().domain([0,150,300]).range(["#66661F", "#CCCCCC", "#661F66"])
var svg = d3.select("#colorlegend-2")
.append("svg")
.attr("id", "colorlegend-2")
.attr("width", 500)
.attr("height", 50);


svg.selectAll("rect")
.data(legend_data_2)
.enter()
.append("rect")
.attr("fill", function(d){return legend2_range(d)})
.attr("width", 1)
.attr("height", 20)
.attr("x", function(d){return d+100})


var xLegendScale = d3.scaleLinear().domain([Math.ceil(extentP[0]), 0, -Math.ceil(extentP[0])]).range([0,150,300]);
var xAxis = svg.append("g")
.attr("transform", "translate(100, 20)")
.attr("class", "axis-x")
.call(d3.axisBottom(xLegendScale))


//ColorLegend3 with axis
var legend_data_3 = []
for (var i=1; i<=300; ++i) {legend_data_3.push(i);}
    var legend3_range = d3.scaleLinear().domain([0,150,300]).range(["#57570f", "#999999", "#F0A8F0"])
var svg = d3.select("#colorlegend-3")
.append("svg")
.attr("id", "colorlegend-3")
.attr("width", 500)
.attr("height",80);

svg.selectAll("rect")
.data(legend_data_3)
.enter()
.append("rect")
.attr("fill", function(d){return legend3_range(d)})
.attr("width", 1)
.attr("height", 20)
.attr("x", function(d){return d+100})
.attr("y", 20)


var xLegendScale = d3.scaleLinear().domain([Math.ceil(extentP[0]), 0, -Math.ceil(extentP[0])]).range([0,150,300]);
var xAxis = svg.append("g")
.attr("transform", "translate(100, 40)")
.attr("class", "axis-x")
.call(d3.axisBottom(xLegendScale))

var xLegendScale = d3.scaleLinear().domain([Math.ceil(extentT[0]), Math.ceil(extentT[1])]).range([0,300]);
var xAxis = svg.append("g")
.attr("transform", "translate(100, 20)")
.attr("class", "axis-x")
.call(d3.axisTop(xLegendScale))


//ColorLegend4 with axis
var legend_data_4 = []
for (var i=1; i<=300; ++i) {legend_data_4.push(i);}

    var legend4_range = d3.scaleLinear().domain([0,300]).range(["#d7191c", "#2c7bb6"])
var svg = d3.select("#colorlegend-4")
.append("svg")
.attr("id", "colorlegend-4")
.attr("width", 500)
.attr("height", 50);


svg.selectAll("rect")
.data(legend_data_4)
.enter()
.append("rect")
.attr("fill", function(d){return legend4_range(d)})
.attr("width", 1)
.attr("height", 20)
.attr("x", function(d){return d+100})


var xLegendScale = d3.scaleLinear().domain([Math.ceil(extentT[0]), Math.ceil(extentT[1])]).range([0,300]);
var xAxis = svg.append("g")
.attr("transform", "translate(100, 20)")
.attr("class", "axis-x")
.call(d3.axisBottom(xLegendScale))



function glyphStroke(d) {
    var glyphStr = d3.scaleQuantize()
    .domain([d3.min(data, function(x) {return x.P;}),
       d3.max(data, function(x) {return x.P;})])
    .range(["black", "white"])
    return glyphStr(d.P);
}


d3.select("#plot1-temperature")
.callReturn(createSvg)
.callReturn(createRects)
.attr("fill", colorT1);

d3.select("#plot1-pressure")
.callReturn(createSvg)
.callReturn(createRects)
.attr("fill", colorP1);

d3.select("#plot2-bivariate-color")
.callReturn(createSvg)
.callReturn(createRects)
.attr("fill", colorPT);

var bivariateSvg = d3.select("#plot3-bivariate-glyph")
.callReturn(createSvg);

bivariateSvg
.callReturn(createRects)
.attr("fill", colorT2);

bivariateSvg
.callReturn(createPaths)
.attr("d", glyphD)
.attr("stroke", glyphStroke)
.attr("stroke-width", 1);


