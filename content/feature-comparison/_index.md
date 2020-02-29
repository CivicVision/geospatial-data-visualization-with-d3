+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["resource"]
date = 2019-06-26T00:00:00Z
description = "An overview of features from the top mapping libraries. "
layout = "single"
no_index = false
section = "comparison"
title = "Feature Comparison of Online Mapping Libraries"

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
{{<table "projections" >}}

### D3

{{<detail "d3" "projection" >}}

### Mapbox

{{<detail "mapbox" "projection" >}}

### OpenLayers

{{<detail "openlayers" "projection" >}}

### Leaflet

{{<detail "leaflet" "projection" >}}

### Google Maps

{{<detail "googlemaps" "projection" >}}

## Dynamic vector styling

Can you style your layers depending on values of your features?

{{<table "vector_styling" >}}

### D3

{{<detail "d3" "vector_styling" >}}

### Mapbox

{{<detail "mapbox" "vector_styling" >}}

### OpenLayers

{{<detail "openlayers" "vector_styling" >}}

### Leaflet

{{<detail "leaflet" "vector_styling" >}}

### Google Maps

{{<detail "googlemaps" "vector_styling" >}}

## Default Basemaps

Does the library ship a default basemap you can use right away.
{{<table "default_basemap" >}}

### D3

{{<detail "d3" "default_basemap" >}}

### Mapbox

{{<detail "mapbox" "default_basemap" >}}

### OpenLayers

{{<detail "openlayers" "default_basemap" >}}

### Leaflet

{{<detail "leaflet" "default_basemap" >}}

### Google Maps

{{<detail "googlemaps" "default_basemap" >}}

## Use your own Basemap

Can you define a different basemap than the default?

{{<table "own_basemap" >}}

### D3

{{<detail "d3" "own_basemap" >}}

### Mapbox

{{<detail "mapbox" "own_basemap" >}}

### OpenLayers

{{<detail "openlayers" "own_basemap" >}}

### Leaflet

{{<detail "leaflet" "own_basemap" >}}

### Google Maps

{{<detail "googlemaps" "own_basemap" >}}

## Marker clustering

Are you able to cluster markers based on their location and show the amount of markers

{{<table "marker_clustering" >}}

### d3

{{<detail "d3" "marker_clustering" >}}

### Mapbox

{{<detail "mapbox" "marker_clustering" >}}

### OpenLayers

{{<detail "openlayers" "marker_clustering" >}}

### Leaflet

{{<detail "leaflet" "marker_clustering" >}}

### Google Maps

{{<detail "googlemaps" "marker_clustering" >}}

## Custom Tooltip

{{<table "custom_tooltip" >}}

### d3

{{<detail "d3" "custom_tooltip" >}}

### Mapbox

{{<detail "mapbox" "custom_tooltip" >}}

### OpenLayers

{{<detail "openlayers" "custom_tooltip" >}}

### Leaflet

{{<detail "leaflet" "custom_tooltip" >}}

### Google Maps

{{<detail "googlemaps" "custom_tooltip" >}}

## User Drawing

{{<table "user_drawing" >}}

### d3

{{<detail "d3" "user_drawing" >}}

### Mapbox

{{<detail "mapbox" "user_drawing" >}}

### OpenLayers

{{<detail "openlayers" "user_drawing" >}}

### Leaflet

{{<detail "leaflet" "user_drawing" >}}

### Google Maps

{{<detail "googlemaps" "user_drawing" >}}

## Geocoder

Does the library provide a geocoder for the user to search for addresses and center on the map?
{{<table "geocoder" >}}

### d3

{{<detail "d3" "geocoder" >}}

### Mapbox

{{<detail "mapbox" "geocoder" >}}

### OpenLayers

{{<detail "openlayers" "geocoder" >}}

### Leaflet

{{<detail "leaflet" "geocoder" >}}

### Google Maps

{{<detail "googlemaps" "geocoder" >}}

## Image Tiles

Support for integrating images via a tile server. For example satellite images from sentinel data.
{{<table "image_tiles" >}}

### d3

{{<detail "d3" "image_tiles" >}}

### Mapbox

{{<detail "mapbox" "image_tiles" >}}

### OpenLayers

{{<detail "openlayers" "image_tiles" >}}

### Leaflet

{{<detail "leaflet" "image_tiles" >}}

### Google Maps

{{<detail "googlemaps" "image_tiles" >}}

## Raster data

Display single raster images. Can you add single images like geotiffs to you map?

{{<table "raster_data" >}}

### d3

{{<detail "d3" "raster_data" >}}

### Mapbox

{{<detail "mapbox" "raster_data" >}}

### OpenLayers

{{<detail "openlayers" "raster_data" >}}

### Leaflet

{{<detail "leaflet" "raster_data" >}}

### Google Maps

{{<detail "googlemaps" "raster_data" >}}

## Raster Styling

Can you style raster images within the library? For example on a pixel basis for raster tiles.
{{<table "raster_styling" >}}

### d3

{{<detail "d3" "raster_styling" >}}

### Mapbox

{{<detail "mapbox" "raster_styling" >}}

### OpenLayers

{{<detail "openlayers" "raster_styling" >}}

### Leaflet

{{<detail "leaflet" "raster_styling" >}}

### Google Maps

{{<detail "googlemaps" "raster_styling" >}}

## Heatmap

Can you display a heatmap? Can you change the weight?

{{<table "heatmap" >}}

### d3

{{<detail "d3" "heatmap" >}}

### Mapbox

{{<detail "mapbox" "heatmap" >}}

### OpenLayers

{{<detail "openlayers" "heatmap" >}}

### Leaflet

{{<detail "leaflet" "heatmap" >}}

### Google Maps

{{<detail "googlemaps" "heatmap" >}}

## OGC Services (WMS, WFS)

Can you integrate OGC Services like WMS (Web Mapping Service) or a WFS?

{{<table "ogc_services" >}}

### d3

{{<detail "d3" "ogc_services" >}}

### Mapbox

{{<detail "mapbox" "ogc_services" >}}

### OpenLayers

{{<detail "openlayers" "ogc_services" >}}

### Leaflet

{{<detail "leaflet" "ogc_services" >}}

### Google Maps

{{<detail "googlemaps" "ogc_services" >}}

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

<div class="rm-area-end-of-content"></div>