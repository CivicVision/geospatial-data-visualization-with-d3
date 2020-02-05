---
title: "Getting Started"
menu:
  main:
    weight: 10

---

# Getting Started

Quick start guide for getting started with mapping with d3.js in four easy steps.

<hr/>

{{< numbered-headline number="1" text="Add the library" classes="mt-0">}}

Include the JavaScript file in the `<head>` of your HTML file.
{{< highlight js >}}
<script src="https://d3js.org/d3.v5.min.js"></script>
{{</ highlight >}}

{{< numbered-headline number="2" text="Get some data">}}
Find some data to play around wiht or use your own data.  
D3.js works best with geojson and even topojson data *(you need the topojson package then though)*

Or create your own geojson using [geojson.io](https://geojson.io).

{{< numbered-headline number="3" text="Pick a projection">}}

With d3.js you can pick your projection or even create your own.  

D3 comes with a vast amount of prebuilt very common projections.  

I can recommend the EqualEarth or NaturalEarth projection.  
But it depends on your use-case and the region you want to map.  
If you want to map the United States check out the AlbersUSA projection.  

{{< numbered-headline number="4" text="Create the map">}}

Use this code and replace your data and you should be able to see a map. :) 
Want to know more about how to do it. Check out the [tutorials](/tutorials).

{{< getting-started-map >}}

<br/>
<div class="rm-area-end-of-content"></div>
