+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["examples"]
codeexample = "var url = \"https://gist.githubusercontent.com/milafrerichs/78ef5702db2dc514fc2bed465d58406b/raw/f1366ee2a83a9afb1dd2427e9cbd4cd3db8d87ca/bundeslaender_simplify200.geojson\";\nd3.json(url).then(function(bb) {\n  var bbox = d3.select('#d3-map').node().getBoundingClientRect()\n  var width = bbox.width;\n  var height = bbox.height;\n  var projection = d3.geoEqualEarth();\n  projection.fitExtent([[20, 20], [width, height]], bb);\n  var geoGenerator = d3.geoPath().projection(projection);\n  var svg = d3.select(\"#d3-map\").append('svg')\n      .style(\"width\", \"100%\")\n      .style(\"height\", \"100%\");\n  svg.append('g').selectAll('path')\n  .data(bb.features)\n  .enter()\n    .append('path')\n    .attr('d', geoGenerator)\n    .attr('fill', '#088')\n    .attr('stroke', '#000');\n});"
date = "2019-09-04T02:00:00+00:00"
description = ""
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
title = "Simple Choropleth Map Example"

+++
# Simple Choropleth map

{{< repl >}}
