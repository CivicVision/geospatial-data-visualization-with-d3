+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["resource", "tutorial", "basic"]
keywords = ["d3", "map", "projections"]
codeexample = ""
date = "2019-09-02T23:00:00+00:00"
description = "Learn all the things that are important about projections in d3."
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
section = "d3"
title = "Projections"
aliases = [
    "/resources/d3/projection/"
]
[sitemap]
changefreq = []
tagId = 1287308
+++
# Projections

Let's talk about projections!  
We need projections to create an actual map.  
Geospatial data is usally in the form of `latitude` and `longitude` but in the browser we don't have these concepts.  
We only have `x` and `y` coordinates.

> **Goal:** Our goal is to transform geo-coordinates to screen-coordinates.

Projections are just math. And what they do is transform latitude and longitude coordinates to x and y coordinates on a flat surface (e.g. your screen).  
Learn more about projections [here](https://www.axismaps.com/guide/general/map-projections/).

And if you want to dive into the math, go over [here](http://mathworld.wolfram.com/Projection.html).

## Let's define our first projection:

{{< highlight js >}}
var projection = d3.geoNaturalEarth1();
{{< / highlight >}}
Easy, right? In d3 these are functions we can call with an array of coordinates.  
`projection([3.4, 52.3]` One important thing to remember is that in d3 we call projections with `**[longitude,latitude]**`. Read more about the way different libraries handle it [here](https://macwright.org/lonlat/).  
The result of this call is an array of x,y coordinates. E.g.:  
`[300,400]` or `[x,y]`

We got some X, Y coordinates as output, but theres something missing: the projection has no knowledge of the size or extent of our SVG element. If we don‘t provide more information to the projection function you won‘t see a thing on the screen. Because the defaults for projections are:

{{< highlight js >}}
center = \[0,0\]
transform = \[480,250\]
{{< / highlight >}}

The center of the map would be somewhere in the ocean near Africa (the 0,0 coordinate) and would only work if your element is 960x500 pixels.

We can change these defaults with the methods `scale` `center` and `translate`

The most important for us right now are `center` and `translate`. With `center` we set the center of the projection. So the point we want to be the center of our SVG.  
„The translation offset determines the pixel coordinates of the projection’s center“ ([D3 Documentation](https://github.com/d3/d3-geo#projections)).  
Or in other words we set the translation offset to half of the width and height of our svg. So that the center of our SVG element (half of width and half of height = center of the svg) corresponds to the center of the projection.

{{< highlight js >}}
var projection = d3.geoNaturalEarth1();
projection.center(\[3.4, 52.3\])
.translate(\[200,200\]);
{{< / highlight >}}

With these parameters we change the "position" of the map.

D3 comes with a long list of projections, you will find them [here](https://github.com/d3/d3-geo/blob/master/README.md#azimuthal-projections).

<br/>
<div class="rm-area-after-tutorial"></div>
