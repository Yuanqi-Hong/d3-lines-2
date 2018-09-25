import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 100, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create our scales
var xPositionScale = d3
  .scaleLinear()
  .domain([1, 12])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([20, 100])
  .range([height, 0])

var line = d3
  .line()
  .x(d => xPositionScale(d.month))
  .y(d => yPositionScale(d.high))

// Read in files
d3.csv(require('./all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Draw the circles
  svg
    .selectAll('.temp-circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'temp-circle')
    .attr('r', 3)
    .attr('cx', function(d) {
      return xPositionScale(d.month)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.high)
    })

  // D3 version of groupby
  // here we'll have 6 things to graph
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  // we got 6 elements in our nested
  // so we'll have 6 paths
  // here's how we draw multiple lines in one graph
  svg
    .selectAll('.temp-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'temp-line')
    // .classed('temp-line', true)
    // is another way of doing .attr('class', 'temp-line')
    .attr('d', d => line(d.values))
    .attr('fill', 'none')
    .attr('stroke', '#333333')
    .attr('stroke-width', 2)
    .lower()

  svg
    .selectAll('.city-label')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'city-label')
    .attr('x', xPositionScale(12))
    .attr('y', function(d) {
      // Go through the data for that city
      // and only pull out December
      var decData = d.values.find(d => d.month == 12)
      // == vs ===
      // 12 == '12' true
      // 12 === '12' false
      return yPositionScale(decData.high)
    })
    .text(d => d.key)
    .attr('font-size', 11)
    .attr('dx', 5) // offset 5px to the right
    .attr('dy', d => {
      if (d.key == 'Lima') {
        return -3 // if you're Lima we push you up a bit so that you don't bump into Melbourne
      } else {
        return 0
      }
    })
    .attr('alignment-baseline', 'middle')

  var xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
