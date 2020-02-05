+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["tips"]
keywords = ["d3", "map", "events", "tip"]
codeexample = ""
date = "2019-12-09T02:00:00+00:00"
description = "Small tip for selecting the active element for events"
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
section = "d3"
title = "d3 events tips"
tagId = 1287313

+++
# d3 Events select current element

If you need to select the current element in d3 on a mouseover for example. D3 makes it very easy. 
Just use `d3.select(this)`

{{< highlight js >}}
d3.select('circle')
.on('mouseover', () => d3.select(this))
{{</ highlight >}}

<br/>
<div class="rm-area-end-of-content"></div>
