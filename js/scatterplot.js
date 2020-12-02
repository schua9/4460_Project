window.onload = start;

d3.csv('starbucksdrinks.csv', function(csv) {
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
  // Getting chosen x-axis and y-axis values
  XAxis = document.getElementById('xaxis').value
  YAxis = document.getElementById('yaxis').value

  //parsing data to calculate axes values
  data.forEach(function(d) {
    d[" Calcium (% DV) "] = parseFloat(d[" Calcium (% DV) "])
    d[" Dietary Fibre (g)"] = parseFloat(d[" Dietary Fibre (g)"])
    d[" Protein (g) "] = parseFloat(d[" Protein (g) "])
    d[" Sodium (mg)"] = parseFloat(d[" Sodium (mg)"])
    d[" Sugars (g)"] = parseFloat(d[" Sugars (g)"])
    d[" Total Carbohydrates (g) "] = parseFloat(d[" Total Carbohydrates (g) "])
    d[" Total Fat (g)"] = parseFloat(d[" Total Fat (g)"])
    d["Caffeine (mg)"] = parseFloat(d["Caffeine (mg)"])
    d["Calories"] = parseFloat(d["Calories"])
    d["Cholesterol (mg)"] = parseFloat(d["Cholesterol (mg)"])
    d["Iron (% DV) "] = parseFloat(d["Iron (% DV) "])
    d["Saturated Fat (g)"] = parseFloat(d["Saturated Fat (g)"])
    d["Trans Fat (g) "] = parseFloat(d["Trans Fat (g) "])
    d["Vitamin A (% DV) "] = parseFloat(d["Vitamin A (% DV) "])
    d["Vitamin C (% DV)"] = parseFloat(d["Vitamin C (% DV)"])
  });

  // Finding maximum value of chosen dropdown for x axis
  maxXAxis = d3.max(data, function(d) {
    return d[XAxis]
  })

  // Finding maximum value of chosen dropdown for y axis
  maxYAxis = d3.max(data, function(d) {
    return d[YAxis]
  })

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, maxXAxis + 5])
    .range([0, width]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, maxYAxis + 5])
    .range([height, 0]);

  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));

  // Add dots
  var circles = svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "points")
      .attr("cx", function (d) { return x(d.Calories); } )
      .attr("cy", function (d) {
        return y(d['Cholesterol (mg)']); } )
      .attr("r", 3.5)
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

  // Brushing code
  var brush = d3.brush()
    .on("brush", colorBrushed)
    .on("end", displayInfo);   

  svg.append("g")
    .call(brush);

  // Adds outline around the brushed circles
  function colorBrushed() {
    circles.attr("class", "non_brushed");
    if (d3.event.selection != null) {
      var brushSelection = d3.brushSelection(this);
      
      brushed = circles.filter(function (){
        var brushedcx = d3.select(this).attr("cx"),
            brushedcy = d3.select(this).attr("cy");

        return isBrushed(brushSelection, brushedcx, brushedcy);
      })

      brushed
        .attr("class", "brush");
    }
  }

  // Checks if the point is brushed
  function isBrushed(brushSelection, cx, cy) {
    return brushSelection[0][0] <= cx 
      && cx <= brushSelection[1][0] 
      && brushSelection[0][1] <= cy 
      && cy <= brushSelection[1][1];
  }

  // Displays the table information if user selects something
  function displayInfo() {  
    if ((document.getElementsByClassName("selection")[0].style.visibility == 'hidden' && document.getElementsByClassName("selection")[1].style.visibility == 'hidden') || !d3.event.selection) return;

    var brushedData = d3.selectAll(".brush").data();

    if (brushedData.length > 0) {
      removeTableData();
      brushedData.forEach(row => addTableData(row))
    } else {
      removeTableData();
    }
  }

  function addTableData(row) {
    showTable();

    // Getting chosen x-axis and y-axis values
    XAxes = document.getElementById('xaxis').value
    YAxes = document.getElementById('yaxis').value

    document.getElementById('XAxesData').innerHTML = XAxes

    XAxesCol = row[XAxes]

    // Order for the data to be added in
    var row_order = [row.Beverage, 
                     row.Beverage_category, 
                     row.Beverage_prep, 
                     XAxesCol];

    // if chosen axes are the same, only display x-axis column data
    // if axes are different, display two columns with chosen x-axis and y-axis data
    if (XAxes != YAxes) {
      document.getElementById('YAxesData').innerHTML = YAxes
      YAxesCol = row[YAxes]

      // Order for the data to be added in with y axes
      var row_order = [row.Beverage, 
                       row.Beverage_category, 
                       row.Beverage_prep, 
                       XAxesCol, 
                       YAxesCol];
    } else {
      document.getElementById('YAxesData').innerHTML = ''
    }
    
    // Adding data for the table row
    d3.select("table")
      .append("tr")
      .attr("class", "row_info")
      .selectAll("td")
      .data(row_order)
      .enter()
      .append("td")
      .text(d => d);
  }

  //hides the table and removes all rows
  function removeTableData() {
    hideTable();
    d3.selectAll(".row_info").remove();
  }

  //shows the table
  function showTable() {
    d3.select("table").style("visibility", "visible");
  }

  //hides the table
  function hideTable() {
    d3.select("table").style("visibility", "hidden");
  }
})
