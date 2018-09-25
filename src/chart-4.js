import * as d3 from 'd3'

var margin = { top: 30, left: 100, right: 100, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create our scales
var xPositionScale = d3
  .scaleLinear()
  .domain([20, 100])
  .range([0, width])

var yPositionScale = d3
  .scalePoint()
  .range([height, 0])
  .padding(0.5)

// Read in files
d3.csv(require('./all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Put your data here
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  var cityNames = nested.map(d => d.key)
  yPositionScale.domain(cityNames)

  svg
    .selectAll('.city-data')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', d => `translate(0,${yPositionScale(d.key)})`)
    .each(function(d) {
      let g = d3.select(this)
      let datapoints = d.values

      let maxHigh = d3.max(datapoints, d => +d.high)
      let minHigh = d3.min(datapoints, d => +d.high)
      // if you forget the + sign
      // D3 will always think you're taking about strings

      g.append('circle')
        .attr('r', 6)
        .attr('fill', 'pink')
        .attr('cy', 0)
        .attr('cx', xPositionScale(maxHigh))

      g.append('circle')
        .attr('r', 6)
        .attr('fill', 'lightblue')
        .attr('cy', 0)
        .attr('cx', xPositionScale(minHigh))

      g.append('line')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xPositionScale(minHigh))
        .attr('x2', xPositionScale(maxHigh))
        .attr('stroke', '#333333')
        .lower()

      g.append('text')
        .text(d.key)
        .attr('font-size', 11)
        .attr('x', 0)
        .attr('y', 0)
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'end')
        .attr('dx', -5)
    })

  var xAxis = d3.axisBottom(xPositionScale).tickSize(-height)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.selectAll('.x-axis line').attr('stroke-dasharray', '1 3')
  svg.selectAll('.x-axis path').remove()

  // var yAxis = d3.axisLeft(yPositionScale)
  // svg
  //   .append('g')
  //   .attr('class', 'axis y-axis')
  //   .call(yAxis)

  // svg.selectAll('.y-axis path, .y-axis line').remove()
}
