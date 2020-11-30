window.onload = start;

d3.csv('starbucksdrinks.csv', function(csv) {
    console.log(csv.columns);
//    var xselect = d3.select("#xaxis")
//        .append("option")
//        .text("YO")
//        .property('value', 'dsfdhg')
    var counter = 0;
    for (var column in csv.columns) {
        if (counter > 2) {
            var xselect = d3.select("#xaxis")
                .append("option")
                .text(csv.columns[column])
                .property('value', csv.columns[column])
        }
        counter += 1;
    }
    var counter = 0;
    for (var column in csv.columns) {
        if (counter > 2) {
            var yselect = d3.select("#yaxis")
                .append("option")
                .text(csv.columns[column])
                .property('value', csv.columns[column])
        }
        counter += 1;
    }
});

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart1")
 .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("starbucksdrinks.csv", function(data) {
    
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, width])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 110])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Calories); } )
      .attr("cy", function (d) {
//        console.log(d)
        return y(d['Cholesterol (mg)']); } )
      .attr("r", 3.5)
//      .on("mouseover", tipMouseover)
//      .on("mouseout", tipMouseout)
      .style("opacity", .5)
      .style("fill", function (d) {
        if (d.Beverage_category == "Classic Espresso Drinks") {
            return "black"
        } else if (d.Beverage_category == "Signature Espresso Drinks") {
            return "orange"
        } else if (d.Beverage_category == "Tazo Tea Drinks") {
            return "magenta"
        } else if (d.Beverage_category == "Smoothies") {
            return "lime"
        } else if (d.Beverage_category == "Coffee") {
            return "brown"
        } else {
            return "blue"
        }
  })

function update(selectedGroup) {
    console.log(selectedGroup)
      var dataFilter = data.map(function(d){return {time: d.Calories, value:d[selectedGroup]} })
    }

// When the button is changed, run the updateChart function
d3.select("#xaxis").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption)
})    
    
    
/*    
  // Add the tooltip container to the vis container
  // it's invisible and its position/contents are defined during mouseover
  var tooltip = d3.select("#chart1").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // tooltip mouseover event handler
  var tipMouseover = function(d) {
      var html  = "HELLO"
      tooltip.html(html)
          .style("left", (d3.event.pageX + 15) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
        .transition()
          .duration(100) // ms
          .style("opacity", .9) // started as 0!

  };
  // tooltip mouseout event handler
  var tipMouseout = function(d) {
      tooltip.transition()
          .duration(100) // ms
          .style("opacity", 0); // don't care about position!
  };
*/

})
