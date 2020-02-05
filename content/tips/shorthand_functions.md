+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["tips"]
keywords = ["d3", "map", "functions", "tip"]
codeexample = ""
date = "2019-12-09T02:00:00+00:00"
description = "Small tip for writing less boilerplate"
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
section = "d3"
title = "shorthand functions"
tweet = "1192017035603193856"
tagId = 1287317
+++
# Shorthand functions

Did you know that you can use a shorthand version for your d3 functions?  
When the function you are using expects the same input parameters you can just use the function name instead of creating your own unnamed function.

{{< highlight js >}}
//instead of
.attr('d', function(d) { return geoGenerator(d); })

//use
.attr('d', geoGenerator)
{{</ highlight >}}

<br/>
<div class="rm-area-end-of-content"></div>
