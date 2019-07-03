+++
include_js = ["mapbox-d3.js"]
external_libs = ["https://unpkg.com/mapbox-gl@0.49.0", "https://unpkg.com/d3@5.9.7/dist/d3.min.js"]
external_css = ["https://unpkg.com/mapbox-gl@0.49.0/dist/mapbox-gl.css"]
layout = "single"
body_classes = "font-sans post mb-6 text-lg leading-relaxed"
+++
{{< header>}}
  {{< headline-h1>}}
    Comparison of Mapbox GL.js vs D3.js
  {{</ headline-h1>}}
{{</ header>}}

<div class="flex h-64 mb-8">
  <div class="w-1/2">
    <div id="map" class="h-full"></div>
  </div>
  <div class="w-1/2">
    <div id="d3-map" class="h-full"></div>
  </div>
</div>

When you want to create an online-map from your data you have a ton of options available.  
When I teach d3 or talk to people what tools they're using the questions that comes up a lot is: __"How do d3 and mapboxGL compare?".__  
That is the question that I want to answer on this site.  
I'm not only comparing the two libraries on a conceptiual basis but on a code basis as well.  

# Conceptional
Let's start with the conecptiual stuff. D3.js and mapboxGL.js are conceptionally very different. Mapbox is a library to create so-called "Slippy-Maps" and is in good company with Leaflet, OpenLayers, GoogleMaps.

> Slippy Map is, in general, a term referring to modern web maps which let you zoom and pan around (the map slips around when you drag the mouse).

This quote from OpenStreetMap explains it very well :)  
Although using this definition d3 maps can be slippy maps as well. You can add zoom and pan to them.  

> A core component of Slippy Maps is that the images should be served as tiles on a grid. Tiling images is an efficient way to browse large amounts of raster and vector map data that would be much too large to render as a single map image. 

This explanation from the Planet Developer Resource "Slippy Maps 101" is more technical but brings it more to the point. These maps (used to) load images from a server and tile them to make them faster to load. Nowadays vector tiles have replaced the images, but they still get served as tiles to load and render faster. 

# Code
Let's look at some code. Or to be exact the complete code to render above maps. Mapbox map is on the left. The d3 map on the right. 

## Mapbox GL.js
{{< highlight js "linenos=table,linenostart=1" >}}
var url = "https://gist.githubusercontent.com/milafrerichs/78ef5702db2dc514fc2bed465d58406b/raw/f1366ee2a83a9afb1dd2427e9cbd4cd3db8d87ca/bundeslaender_simplify200.geojson";
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
var map = new mapboxgl.Map({
  container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [13.79,53.545], 
    zoom: 5
  });
  map.on('load', function () {
    map.addSource('bb', { type: 'geojson', data: url });
    map.addLayer({
      'id': 'berlin',
      'type': 'fill',
      'source': 'bb',
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.8
      }
    });
    map.addLayer({
      'id': 'berlin-stroke',
      'type': 'line',
      'source': 'bb',
      'paint': {
        'line-width': 1,
        'line-color': '#000',
      }
    });
});
{{< / highlight >}}
## D3
{{< highlight js "linenos=table,linenostart=1" >}}
var url = "https://gist.githubusercontent.com/milafrerichs/78ef5702db2dc514fc2bed465d58406b/raw/f1366ee2a83a9afb1dd2427e9cbd4cd3db8d87ca/bundeslaender_simplify200.geojson";
var bb = await d3.json(url);
var bbox = d3.select('#d3-map').node().getBoundingClientRect()
var width = bbox.width;
var height = bbox.height;
var projection = d3.geoEqualEarth();
projection.fitExtent([[20, 20], [width, height]], bb);
var geoGenerator = d3.geoPath().projection(projection);
var svg = d3.select("#d3-map").append('svg')
    .style("width", "100%")
    .style("height", "100%");
svg.append('g').selectAll('path')
.data(bb.features)
.enter()
  .append('path')
  .attr('d', geoGenerator)
  .attr('fill', '#088')
  .attr('stroke', '#000');
{{< / highlight >}}

# Amount of Code
The first difference you see is that the code for mapbox is almost twice as long as the d3 code. Which is a bit suprising. But the reason is that the styling takes a lot of effort and is formatted in a readable way.  

__Winner: D3__

# Ease of Setup
Both are relatively easy to setup. You either download their code and integrate it. Or use a CDN like I did on this page:

### Mapbox setup:

{{< highlight html "linenos=table,linenostart=1" >}}
<script src="https://unpkg.com/mapbox-gl@0.49.0" type="text/javascript"></script>
<link href="https://unpkg.com/mapbox-gl@0.49.0/dist/mapbox-gl.css" rel="stylesheet" type="text/css">
{{< / highlight >}}

### D3 setup:

{{< highlight html "linenos=table,linenostart=1" >}}
<script src="https://unpkg.com/d3@5.9.7/dist/d3.min.js" type="text/javascript"></script>
{{< / highlight >}}


__Winner: Even__

# Basemap
The biggest visible difference is the lack of a basemap for d3. But I made this on purpose. The power of d3 is that it does not include a basemap my default. You want the data to be the center of your map, not the basemap.  
This is one of the more important pieces, you choose the libraries based on your needs and d3 and mapbox serve different needs. Mapbox and other basemap-based libraries shine when you need more information than just the data. For example street locations, more labels, etc.

__Winner: Mapbox__

# Projections
The second big difference is the projection of these maps. Mapbox uses Mercator as their default, wehereas in D3 you choose the projection yourself. 

__Winner: D3__

# Styling

Mapbox styling is done via [Mapbox Style Spec]() while D3 styling is done via normal SVG attributes and CSS.
As you might have noticed we needed to create two layers in mapbox to style the fill as well as the stroke/outline of the feature.  
{{< highlight js "linenos=table,hl_lines=4 13,linenostart=11" >}}
    map.addLayer({
      'id': 'berlin',
      'type': 'fill',
      'source': 'bb',
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.8
      }
    });
    map.addLayer({
      'id': 'berlin-stroke',
      'type': 'line',
      'source': 'bb',
      'paint': {
        'line-width': 1,
        'line-color': '#000',
      }
    });
{{</ highlight >}}
In d3 we only need two lines of code.  
{{< highlight js "linenos=table,linenostart=17" >}}
  .attr('fill', '#088')
  .attr('stroke', '#000');
{{</ highlight >}}
__Winner: D3__

# Centering the map
While mapbox GL.js relies on you, the creator to set the zoom, center and so forth in advance, d3.js allows you to use your data to set the extent. In mapbox this is more difficult and I did not include this in the main section. I might extent this post to include it.

__Winner: D3__

# Concepts you need to learn

## Mapbox
mapbox, sources, layers, mapbox style spec

## D3
SVG, CSS, d3
__Winner: mapbox__

# Customization
