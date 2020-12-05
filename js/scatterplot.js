window.onload = start;

// Parsing data for dropdown
d3.csv('starbucksdrinks.csv', function(csv) {
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

// Set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#chart1")
    .attr("width", width + margin.left + margin.right + 200)
    .attr("height", height + margin.top + margin.bottom + 30)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Parsing data for data viz
d3.csv("starbucksdrinks.csv", function(data) {
  // Getting chosen x-axis and y-axis values
  XAxis = document.getElementById('xaxis').value
  YAxis = document.getElementById('yaxis').value

  // Parsing data to calculate axes values
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

// Adjusting starting X axis domain length
    var xVal = 0;
    var globalxmax = 0;
    
    function xDomain() {
        if (xVal == 0) {
            return 550;
        } else {
            return globalxmax;
        }
    }

    // Adjusting starting Y axis domain length
    var yVal = 0;
    var globalymax = 0;
    
    function yDomain() {
        if (yVal == 0) {
            return 550;
        } else {
            return globalymax;
        }
    }
    
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, xDomain() + Math.log(xDomain())])
    .range([0, 600]);

  var xAxis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 105 + 5])
    .range([height, 0]);

  var yAxis = svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
    
// Add X axis label:
var xLabel = svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - 250)
    .attr("y", height + margin.top + 30)
    .text("Cholesterol \(mg\)");

// Y axis label:
var yLabel = svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+20)
    .attr("x", -margin.top - 165)
    .text("Calories")

  // Add dots
  var circles = svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
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
  
  // Updating x axis label and x coords for circles
  function updateX(selectedGroup) {
    updateXAxis(selectedGroup)
    circles
        .transition()
        .delay(50)
        .duration(2000)
        .attr("cx", function (d) { return x(d[selectedGroup]); } )
    xLabel.text(selectedGroup) 
    }
    
    // Update X Axis Plot
    function updateXPlot() {

        // Update X axis
        x.domain([0,globalxmax])
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
      }
    
    // Helper function to find max data value for selection
    function updateXAxis(selectedGroup) {
        var max = data[0][selectedGroup]
        // Find max data value to scale axis
        for (var i = 1; i < data.length; i++) {
            if (data[i][selectedGroup] > max) {
               max = data[i][selectedGroup];
            }
            if (isNaN(data[i][selectedGroup])) {
               data[i][selectedGroup] = 0;
            }
        }
        globalxmax = max
        return max
    }

  // When the button is changed, run the updateChart function
  d3.select("#xaxis").on("change", function(d) {
      xVal = 1
    // recover the option that has been chosen
    var selectedOptionX = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateX(selectedOptionX)
    xDomain(selectedOptionX)
    updateXPlot()
    updateX(selectedOptionX)
  })
  
    
    // Update Y Axis Plot
    function updateYPlot() {
        y.domain([0,globalymax])
        yAxis.transition().duration(1000).call(d3.axisLeft(y))
    }
    
  // Updating y axis label and y coords for circles    
  function updateY(selectedGroup) {
    updateYAxis(selectedGroup)
      circles
        .transition()
        .delay(50)
        .duration(2000)
        .attr("cy", function (d) { return y(d[selectedGroup]); } )
      yLabel.text(selectedGroup)
    }
    
        // Helper function to find max data value for selection
    function updateYAxis(selectedGroup) {
        var max = data[0][selectedGroup]
        // Find max data value to scale axis
        for (var i = 1; i < data.length; i++) {
            if (data[i][selectedGroup] > max) {
               max = data[i][selectedGroup];
            }
            if (isNaN(data[i][selectedGroup])) {
               data[i][selectedGroup] = 0;
            }
        }
        globalymax = max
        return max
    }

  // When the button is changed, run the updateChart function
  d3.select("#yaxis").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOptionY = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateY(selectedOptionY)
      yDomain(selectedOptionY)
      updateYPlot()
      updateY(selectedOptionY)
  })

  // Adding legend
  var legend_attr =	[["Classic Espresso Drinks", "black"],
                ["Signature Espresso Drinks", "orange"],
                ["Tazo Tea Drinks", "magenta"],
                ["Smoothies", "lime"],
                ["Coffee", "brown"],
                ["Other", "blue"]];

  var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 200)
		.attr("width", 200)
    .attr('transform', 'translate(-30,60)');
    
  // Adding legend rectangles
  var legendRect = legend.selectAll('rect').data(legend_attr);

  legendRect
    .data(legend_attr)
    .enter()
    .append("rect")
    .attr("x", width + 50)
    .attr('y', function(d,i){ return i*15 - 50})
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) {
      return d[1];
    });

  // Adding corresponding legend text
  var legendText = legend.selectAll('text').data(legend_attr);

  legendText
    .data(legend_attr)
    .enter()
    .append("text")
    .attr("x", width + 65)
    .attr('y', function(d,i){ return i*15 - 40})
    .attr("width", 10)
    .attr("height", 10)
    .text(function(d) {
        return d[0];
    });

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
