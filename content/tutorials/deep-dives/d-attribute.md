+++
body_classes = "font-light font-sans content post text-base md:text-lg leading-relaxed"
categories = ["resource", "tutorial", "deep_dive"]
tutorials = ["deep-dives"]
codeexample = ""
date = "2019-09-13T06:00:00+00:00"
description = "A short introduction into the the d attribute of path elements"
external_css = []
external_libs = []
images = []
include_js = []
keywords = []
layout = "single"
section = "d3"
title = "D Attribute"
tweet = ""
aliases = [
    "/resources/d3/d-attribute/"
]
tagId = 1287306
+++
# d attribute in path

The infamous `d` attribute in a path element for SVG is a handful. Or at least at first. Especially for mapping. 

Let‘s look at a `d` attribute for a geojson feature:

{{< highlight js >}}
const feature  = { 
  "type": "Feature", 
  "geometry": { 
    "type": "Polygon", 
    "coordinates": [ [
    [ 13.31, 52.79 ], 
    [ 13.35, 52.79 ], 
    [ 13.35, 52.80 ], 
    [ 13.31, 52.80 ], 
    [ 13.31, 52.79 ]]] 
  }
};
{{</ highlight >}}
  
{{< highlight js >}}
M2.9103830456733704e-11,282.68992037849966
L400,282.68992037849966
L400,117.31007962138392
L2.9103830456733704e-11,117.31007962138392Z
{{</ highlight >}}

Pretty daunting right?
Let‘s simplify that.
{{< highlight js >}}
M0,282L400,282L400,117L0,117Z
{{</ highlight >}}

That looks not too bad. 
Let’s break this down even further. 

## Creating a simple rectangle
Creating a rectangle is an easy example. You would not use a `path` element for it, but it‘s a good way to learn the `d` attribute. So we’re doing it anyway. 

{{< highlight js >}}
M10,10L10,20L20,20L20,10Z
{{</ highlight >}}

Pretty similar to our version above, right? 
If we take a look at what these things are, it starts to make more sense. 

### M, m (__M__ove To)
Move the current Point to x,y coordinates
`Mx,y` `M10,20`
__uppercase__: absolute 
__lowercase__: relative

### L, l (__L__ineTo)
Draw a line from the current point to the end point specified by x,y
`Lx,y` `L20,30`

### Z
Close the element. Which means the shortest straight line to the beginning of the polygon. 

## Rectangle Example
Let’s look at our rectangle example again. Now with real values.
So we start at `10,10` and then draw a line to `10,20` and from there a line to `20,20` and then to `20,10` and close the element (which would go back to `10,10`). 

If we go back to our example from the GeoJSON. It is similar: 
Start at `0,282` draw a line to `400,282` another line to `400,117` and then to `0,117`  and close the element (go back to `0,282` )

This is just a shot explanation of a simple case. The path element is capable of much more. But it is sufficient enough for us to know that much. D3 offers us great helpers, so we don’t have to deal with it directly. 

Here is a great illustrated article that goes even deeper on the [topic](https://css-tricks.com/svg-path-syntax-illustrated-guide/)
