import * as d3 from 'd3'

var margin = { top: 100, left: 30, right: 30, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

// we use container like below instead of svg
var container = d3.select('#chart-2')

// Create our scales
var xPositionScale = d3
  .scaleLinear()
  .domain([1, 12])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([20, 100])
  .range([height, 0])

// Create a line generator
// This explains how to compute
// the points that make up the line
var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.month)
  })
  .y(function(d) {
    return yPositionScale(d.high)
  })

// Read in files
d3.csv(require('./all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  // // Draw the circles

  // // Draw the lines

  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  container
    .selectAll('.temp-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'temp-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    // .each is the D3 version of forEach in JS
    // don't use d => {}, use function(d) {}
    .each(function(d) {
      // which svg are we looking at?
      let svg = d3.select(this)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#333333')
        .attr('stroke-width', 2)
        .lower()

      svg
        .append('text')
        .text(d.key)
        .attr('font-size', 32)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

      let xAxis = d3.axisBottom(xPositionScale)
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      let yAxis = d3.axisLeft(yPositionScale)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
