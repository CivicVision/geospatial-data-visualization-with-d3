+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["tips"]
keywords = ["d3", "map", "projection", "tip"]
codeexample = ""
date = "2019-12-09T02:00:00+00:00"
description = "What are the default projection params in d3.js"
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
section = "d3"
title = "Default Projection Paramameters"
tagId = 1287314
+++

# Default Projection Parameters

Have you ever wondered why your map was not centred to your coordinates?

The reason might be that you're not setting `scale` and `translate` and they use the defaults.

{{< highlight js >}}
// for example for naturalEarth
var projection = d3.geoNaturalEarth1();

projection.center()
// center = [0,0]

projections.translate()
// translate = [480,250]

projections.scale()
// scale = 175.295
{{</ highlight >}}

The parameters are different for each projection.
