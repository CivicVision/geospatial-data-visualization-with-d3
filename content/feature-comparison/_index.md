+++
layout = "single"
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
no_index = false
categories = ["resource"]
section = "comparison"
title = "Feature Comparison of Online Mapping Libraries"
description = "An overview of features from the top mapping libraries. "
+++
{{< header>}}
  {{< headline-h1>}}
    Feature Comparison of Online Mapping Libraries
  {{</ headline-h1>}}
{{</ header>}}
{{< image "https://res.cloudinary.com/civicvision/image/upload/f_auto,q_auto,w_auto,dpr_auto,c_limit/geospatial-d3/marketing/website/comparison.jpg" "Comparison: leaflet, mapbox, openlayers, d3, google maps">}}

<iframe class="airtable-embed" src="https://airtable.com/embed/shrE5g8P4WCRG4mGj?backgroundColor=cyan" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>

<iframe class="airtable-embed" src="https://airtable.com/embed/shrdTmWwI3Or1z4t4?backgroundColor=cyan" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>

# Feature Comparison

Let’s have a closer look at these features, their availability and their easy of use.

I refer to all the libraries by their name as follow:
d3.js = D3
Mapbox GL JS = Mapbox
OpenLayers = Openlayers
Leaflet = Leaflet
Google Maps JavaScript API = Google Maps



## Projections 
Does the library support different projections? 

### D3

Does support projections. They prebuilt 13 projections you can find here but you can roll your own projection as well via
{{<support true >}}
{{<signal title="Easy of use" signal=1 value="Easy" >}}
Easy of use: Easy
Example: 
Docs:

### Mapbox
No support for other projections than the mercator projection. But a bird told me that this might be coming soon. :) 
{{<support false >}}

### OpenLayers
Does support other projections via EPSG codes. 
You need to know the EPSG code, the projection definition and use proj4 
{{<support true >}}
{{<signal title="Easy of use" signal=2 value="Medium" >}}
Easy of use: Medium
Example: https://openlayers.org/en/latest/examples/reprojection-by-code.html
Docs: https://openlayers.org/en/latest/doc/tutorials/raster-reprojection.html



### Leaflet
You can use projections in leaflet via this plugin:
https://kartena.github.io/Proj4Leaflet/
Support: Yes
Easy of use: Medium
Example: 
Docs:

### Google Maps
You can use custom projections with google maps but it is very complex.
>  A Projection implementation must provide not only a mapping from one coordinate system to another, but a bi-directional mapping. That is, you must define how to translate from Earth coordinates (LatLng objects) to the Projection class's world coordinate system, and vice versa. Google Maps uses the Mercator projection to create its maps from geographic data and convert events on the map into geographic coordinates. 

So you need to do all the heavy lifting! 

Support: Yes
Easy of use: Hard
Example: https://developers.google.com/maps/documentation/javascript/examples/map-projection-simple
Docs:

## Dynamic vector styling
Can you style your layers depending on values of your features?

### D3
Yes. And very easily. You can use standard SVG and CSS to style your map and you have full control over everything.
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Mapbox
Yes, not as easy and you don’t have full control. Check out the Mapbox Style Spec for more details how to style your layers.
Support: Yes
Easy of use: Easy
Example: 
Docs:

### OpenLayers
Yes, using the style function and the Style class you can style elements. Not as powerful as the Mapbox Style Spec and you need to write more code:
https://openlayers.org/workshop/en/vector/style.html
Support: Yes
Easy of use: Medium
Example: 
Docs:

### Leaflet
Yes, leaflet is a mix from mapbox and open layers. You can use a style function and use some default elements:
https://leafletjs.com/reference-1.5.0.html#path-option
https://leafletjs.com/examples/choropleth/
Support: Yes
Easy of use: Medium
Example: 
Docs:

### Google Maps
Similar to the other libraries using a style option:

https://developers.google.com/maps/documentation/javascript/reference/data#Data.StyleOptions
Support: Yes
Easy of use: Medium
Example: 
Docs:

## Default Basemaps 
Does the library ship a default basemap you can use right away. 

### D3
No. And it’s not trivial to use a basemap. 
Support: No
Example: 

### Mapbox
Yes, but you need to sign up for an API token to use it. 
Support: Yes
Easy of use: Easy
Example: 
Docs:

### OpenLayers
Yes, the default OSM street map.
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Leaflet
Yes, the default OSM street map.
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Google Maps
Yes, the default Google Map. To use google maps you need to sign  up for a API key anyway.
Support: Yes
Easy of use: Easy
Example: 
Docs:

## Use your own Basemap
Can you define a different basemap than the default? 

### D3
Yes. you can use whatever you want.
Support: Yes
Easy of use: Medium
Example: https://observablehq.com/@d3/vector-tiles
Docs:

### Mapbox
Yes. you can use whatever you want.
Support: Yes
Easy of use: Easy
Example: 
Docs:

### OL
Yes. you can use whatever you want.
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Leaflet
Yes. you can use whatever you want.
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Google Maps
No! You can only use Google Maps basemap. But you can style it.
Support: No

## Marker clustering
Are you able to cluster markers based on their location and show the amount of markers

### d3
Support: Yes
Easy of use: Hard
Example: https://bl.ocks.org/Andrew-Reid/21ff4b57267fa91dacc57ef1ccb7afb3

Docs:

### Mapbox
Support: Yes
Easy of use: Easy
Example: 
Docs:

### OpenLayers
Support: Yes
Easy of use: Easy
Example: https://openlayers.org/en/latest/examples/cluster.html
Docs:

### Leaflet
Support: Yes, via plugin
Easy of use: Easy
Example: 
Docs: https://github.com/Leaflet/Leaflet.markercluster

### Google Maps
Support: Yes
Easy of use: Easy
Example: https://developers.google.com/maps/documentation/javascript/marker-clustering
Docs:

## Custom Tooltip
### d3
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Mapbox
Support: Yes
Easy of use: Easy
Example: 
Docs:

### OpenLayers
Support: Yes
Easy of use: Easy
Example:
Docs:

### Leaflet
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Google Maps
Support: Yes
Easy of use: Easy
Example: 
Docs:

## User Drawing
### d3
Support: No 

### Mapbox
Support: Yes, via plugin
Easy of use: Easy
Example: 
Docs:

### OpenLayers
Support: Yes
Easy of use: Easy
Example: https://openlayers.org/en/latest/examples/draw-features.html
Docs:

### Leaflet
Support: Yes, via plugin
Easy of use: Easy
Example: 
Docs:

### Google Maps
Support: Yes
Easy of use: Easy
Example: https://developers.google.com/maps/documentation/javascript/examples/drawing-tools
Docs:

## Geocoder
Does the library provide a geocoder for the user to search for addresses and center on the map?

### d3
Support: No
### Mapbox
Support: Yes
Easy of use: Easy
Example: https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder/
Docs:

### OpenLayers
Support: Yes, via plugin
Example: https://github.com/jonataswalker/ol-geocoder

### Leaflet
Support: Yes, via plugin
Easy of use: Easy
Example: 
Docs: https://github.com/perliedman/leaflet-control-geocoder

### Google Maps
Support: Yes
Easy of use: Easy
Example: https://developers.google.com/maps/documentation/javascript/geocoding
Docs:

## Image Tiles
Support for integrating images via a tile server. For example satellite images from sentinel data. 

### d3
Support: Yes
Easy of use: Medium
Example: https://observablehq.com/@d3/raster-tiles-canvas
https://observablehq.com/@d3/raster-tiles
Docs:

### Mapbox
Support: Yes
Easy of use: Easy
Example: https://docs.mapbox.com/mapbox-gl-js/example/map-tiles/
Docs:

### OpenLayers
Support: Yes
Easy of use: Easy
Example: https://openlayers.org/en/latest/examples/xyz-retina.html
Docs:

### Leaflet
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Google Maps
Support: Yes
Easy of use: Easy
Example: https://developers.google.com/maps/documentation/javascript/examples/maptype-image-overlay
Docs:

## Raster data
Display single raster images. Can you add single images like geotiffs to you map?

### d3
Support: Yes, via geotiff
Easy of use: Medium
Example: https://observablehq.com/@lenninlasd/isobands-d3-geotiffjs
Docs:

### Mapbox
Support: Yes
Easy of use: Easy
Example: https://docs.mapbox.com/mapbox-gl-js/example/image-on-a-map/

### OpenLayers
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Leaflet
Support: Yes
Easy of use: Easy
Example: 
Docs:

### Google Maps 
Support: Yes
Easy of use: Hard
Example: https://developers.google.com/maps/documentation/javascript/examples/overlay-simple

## Raster Styling
Can you style raster images within the library? For example on a pixel basis for raster tiles.

### d3
Support: Yes
Easy of use: Medium
Example via geotiff: https://observablehq.com/@d3/geotiff-contours-ii
Docs:

### Mapbox
Support: No


### OpenLayers
Support: Yes
Easy of use: Easy
Example: https://openlayers.org/en/latest/examples/raster.html
Docs:

### Leaflet
Support: Yes, via geotiff
Easy of use: Hard
Example: http://geoexamples.com/d3-raster-tools-docs/code_samples/leaflet-raster-page.html
Docs:

### Google Maps
Support: No

## Heatmap 
Can you display a heatmap? Can you change the weight? 

### d3
Support: Yes
Easy of use: Medium
Example: https://bl.ocks.org/patricksurry/803a131d4c34fde54b9fbb074341daa5
https://www.visualcinnamon.com/2013/07/self-organizing-maps-creating-hexagonal.html

### Mapbox
Support: Yes
Easy of use: Easy
Example: https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/
Docs:

### OpenLayers
Support: Yes
Easy of use: Easy
Example: https://openlayers.org/en/latest/examples/heatmap-earthquakes.html
Docs:

### Leaflet
Support: Yes, via plugin
Easy of use: Easy
Example: 
Docs: https://github.com/Leaflet/Leaflet.heat

### Google Maps
Support: Yes
Easy of use: Easy
Example: https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap
Docs:

## OGC Services (WMS, WFS)
Can you integrate OGC Services like WMS (Web Mapping Service) or a WFS? 
### d3
Support: No

### Mapbox
Support: Kind of, Only WMS via direct url
Easy of use: Medium
Example: https://docs.mapbox.com/mapbox-gl-js/example/wms/

### OpenLayers
Support: Yes
Easy of use: Easy
Example WFS: https://openlayers.org/en/latest/examples/vector-wfs-getfeature.html
Example WMS: https://openlayers.org/en/latest/examples/wms-tiled.html
Docs:

### Leaflet
Support: Yes
Easy of use: Easy
Example WMS: https://github.com/heigeo/leaflet.wms
Example WFS: https://github.com/Flexberry/Leaflet-WFST
Docs:

### Google Maps
Support: No

## Company support
### d3
No direct company support. But the creator works full-time on d3 and other visualization tools like observable. 

### Mapbox
Yes, company provides basic support. You can pay them for better support. 

### OpenLayers
Yes, there are external companies who provide support and they employ core contributors. 

### Leaflet
Unknown

### Google Maps
Yes, company offers support.


## Open Source Code License
Is the code open source? And does the library state a license?

### d3
Open License: BSD 3-Clause "New" or "Revised" License

### Mapbox
No Open Source License specified:
Copyright (c) 2016, Mapbox
All rights reserved.

### OpenLayers
Yes: BSD 2-Clause License

### Leaflet
No open source license specified:
Copyright (c) 2010-2018, Vladimir Agafonkin
Copyright (c) 2010-2011, CloudMade
All rights reserved.

### Google Maps
No, closed source