
var cxScale = d3.scaleLinear().domain([350, 800]).range([100, 600]);
var cyScale = d3.scaleLinear().domain([800, 250]).range([100, 600]);

var axScale = d3.scaleLinear().domain([14, 36]).range([100,600]);
var gyScale = d3.scaleLinear().domain([4.0, 1.6]).range([100,600])


var w = 700;
var h = 700;

var brushA = null;
var brushB = null;

function createBrush(selection){
  var brush = d3.brush();
  selection.append("g").call(brush);
  return {
    brush: brush
  };
}

var scatterplot_1 = d3.select("body").append("svg")
.attr("width", w)
.attr("height", h)
.attr("id","scatterplot_1");

var scatterplot_2 = d3.select("body").append("svg")
.attr("width", w)
.attr("height", h)
.attr("id","scatterplot_2");


plotbrushA = createBrush(scatterplot_1);
plotbrushB = createBrush(scatterplot_2);


scatterplot_1.selectAll("circle")
.data(scores)
.enter()
.append("circle")
.attr("fill", "green")
.attr("stroke", "black")
.attr("cx", function(d) { return cxScale(d.SATM); })
.attr("cy",     function(d) { return cyScale(d.SATV); })
.attr("r", 7)
.on("click",function(d) {

  d3.select("#satm").text(d.SATM);
  d3.select("#satv").text(d.SATV);
  d3.select("#act").text(d.ACT);
  d3.select("#gpa").text(d.GPA);
  d3.selectAll("circle").classed("highlight",false);
  d3.select(this).classed("highlight",true);

  d3.select("#scatterplot_2")
  .selectAll("circle")
  .classed("highlight", function(k){
    if (k == d) return k;
  });
});

var xAxis = scatterplot_1.append("g")
.attr("transform", "translate(0, 660)")
.call(d3.axisBottom(cxScale))

var yaxis = scatterplot_1.append("g")
.attr("transform", "translate(40, 0)")
.call(d3.axisLeft(cyScale))



scatterplot_2.selectAll("circle")
.data(scores)
.enter()
.append("circle")
.attr("fill", "green")
.attr("stroke", "black")
.attr("cx", function(d) { return axScale(d.ACT) })
.attr("cy", function(d) { return gyScale(d.GPA); })
.attr("r", 7)
.on("click",function(d) {

  d3.select("#satm").text(d.SATM);
  d3.select("#satv").text(d.SATV);
  d3.select("#act").text(d.ACT);
  d3.select("#gpa").text(d.GPA);
  d3.selectAll("circle").classed("highlight",false);
  d3.select(this).classed("highlight",true);

  d3.select("#scatterplot_1")
  .selectAll("circle")
  .classed("highlight", function(k){
    if (k == d) return k;
  });
});

var xAxis = scatterplot_2.append("g")
.attr("transform", "translate(0, 660)")
.call(d3.axisBottom(axScale))

var yaxis = scatterplot_2.append("g")
.attr("transform", "translate(40, 0)")
.call(d3.axisLeft(gyScale))


function brushing() {
  var circles = d3.select("body").selectAll("circle");
  if (brushA == null && brushB == null) {
    circles.attr("fill", "green")
    return;
  }

  function brushed(d) {
    if (brushA != null) { 
      return (cxScale(d.SATM) >= brushA[0][0]) && (cxScale(d.SATM) <= brushA[1][0]) && (cyScale(d.SATV) >= brushA[0][1]) && (cyScale(d.SATV) <= brushA[1][1]); 
    }
    else if (brushB != null) {
      return (axScale(d.ACT) >= brushB[0][0]) && (axScale(d.ACT) <= brushB[1][0]) && (gyScale(d.GPA) >= brushB[0][1]) && (gyScale(d.GPA) <= brushB[1][1]); 
    }
  }

  circles.filter(brushed).attr("fill", "red");
  circles.filter(function(d) { return !brushed(d); }).attr("fill", "white");
}

function brushed1() {
  brushA = d3.event.selection;
  brushing();
}

function brushed2() {
  brushB = d3.event.selection;
  brushing();
}

plotbrushA.brush
.on("brush", brushed1)
.on("end", brushed1);

plotbrushB.brush
.on("brush", brushed2)
.on("end", brushed2);