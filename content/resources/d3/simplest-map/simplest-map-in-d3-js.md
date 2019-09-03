+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["resources"]
date = "2019-09-04T00:00:00+00:00"
description = ""
draft = true
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
section = "d3"
title = "Simplest Map in d3.js"

+++
# Simplest map with d3

Most of the tutorials on the internet for building maps with d3 are very comprehensive. Almost all of them built a choropleth map. But I found in my workshops at conferences that people get overwhelmed by all the concepts they need to learn first to create their first map. 
So I thought there must be a better way to get to a map quicker and still learn the basic concepts. 

That‘s how I came up with the simplest map possible with d3. 
It may not seem like a lot but it‘s actually most of the concepts you need to understand to create a map with d3. 

## What are these concepts?

Let‘s take a look. You need to learn about d3 selections, creating elements and projections. Three concepts that‘s not too bad.
Let‘s compare this with a choropleth map:
Selections, creating elements, projections, loading data, scaling and translating a projection, data joins, scales, promises. 
That‘s a lot more and a few of those concepts are the most difficult to understand in d3. 

## Let‘s create the map in d3
Enough talking let‘s do it. 
here is the code you need to create the simplest map possible:

var width = 400;
var height = 400;
var data = [144.960930,-37.797831];
var projection = d3.geoEqualEarth();
projection.center(data).translate([200,200]);
var svg = d3.select("body").append("svg")
.attr("width",width )
.attr("height", height);
svg
  .append('circle')
  .attr('cx', projection(data)[0])
  .attr('cy', projection(data)[1])
  .attr('r',5)
  .attr('fill','blue');

You can learn all the concepts behind it in my free email course. 