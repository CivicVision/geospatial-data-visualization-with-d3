+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["tips"]
keywords = ["d3", "map", "events", "tip"]
codeexample = ""
date = "2019-12-09T02:00:00+00:00"
description = "Small tip for your bubble maps."
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
section = "d3"
title = "Bubble Map Radius"
tagId = 1287312

+++
# Bubble Map Radius Tip for d3.js

If you create bubble maps in d3.js and you use a `circle` SVG element be sure to use the right scale for your radius.  
Since we can only change the radius of a `circle` we need to use the squareroot scale to scale the area rather than the radius.
{{< highlight js >}}
var sqrtScale = d3.scaleSqrt()
  .domain([0, 100])
  .range([0, 20]);
{{</ highlight >}}

Read more about the specifics on [Robert Kosara's blog](https://eagereyes.org/blog/2008/linear-vs-quadratic-change)
