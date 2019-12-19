+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["tips"]
keywords = ["d3", "map", "promises", "tip"]
codeexample = ""
date = "2019-12-09T02:00:00+00:00"
description = "Small tip when you hit a async error"
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
section = "d3"
title = "Promises error"
+++
# Struggling to use the new Promise way of d3v5?

Have you seen this error:
`await is only valid in async function `

That means that you need to wrap your d3 code inside a function:

{{< highlight js >}}
async function map() {
	const data = await d3.json('your.geojson');
}
map();
{{</ highlight >}}
