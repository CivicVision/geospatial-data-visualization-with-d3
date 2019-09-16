+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["resource"]
codeexample = "var url = \"https://gist.githubusercontent.com/milafrerichs/78ef5702db2dc514fc2bed465d58406b/raw/f1366ee2a83a9afb1dd2427e9cbd4cd3db8d87ca/bundeslaender_simplify200.geojson\";\nd3.json(url).then(function(bb) {\n  var bbox = d3.select('#d3-map').node().getBoundingClientRect()\n  var width = bbox.width;\n  var height = bbox.height;\n  var projection = d3.geoEqualEarth();\n  projection.fitExtent([[20, 20], [width, height]], bb);\n  var geoGenerator = d3.geoPath().projection(projection);\n  var svg = d3.select(\"#d3-map\").append('svg')\n      .style(\"width\", \"100%\")\n      .style(\"height\", \"100%\");\n  svg.append('g').selectAll('path')\n  .data(bb.features)\n  .enter()\n    .append('path')\n    .attr('d', geoGenerator)\n    .attr('fill', '#088')\n    .attr('stroke', '#000');\n});"
date = ""
description = ""
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
title = ""

+++
# Simple Choropleth map with d3.js

In this tutorial we look at how to create a choropleth map with d3.

> Learnings:  
  - Loading Data  
  - Projections  
  - Fit the map  
  - Data Joins  
  - Scales


## Loading data with d3js

To load data we could use just standard `fetch` or `xmlHTTPRequests` but d3 offers us a way to do it faster and more convenient.  
Introducing `d3.json` `d3.csv` to load (Geo)JSON and CSV data. 

It not only fetches the data from a server or locally but also parses and converts it to javascript objects. 

(Collapsed geojson explanation)
(Collapsed promise explanation)

{{< highlight js >}}
d3.json('our.geojson').then(function(data) {})
{{</ highlight >}}

[Learn more about loading data](/resources/d3/loading-data/)
