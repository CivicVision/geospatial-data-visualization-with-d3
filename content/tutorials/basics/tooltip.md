+++
aliases = ["/resources/d3/tooltip/"]
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["resource", "tutorial", "basic"]
codeexample = "d3.select('body').append('div').attr('id', 'tooltip').attr('style', 'position: absolute; opacity: 0;');\n d3.select('body').append('svg').attr('width', 300).attr('height', 300);\n d3.select('svg').selectAll('circle').data(['a','b','c'])\n .join('circle')\n .attr('r', 3)\n .attr('cy', 5)\n .attr('cx', (d,i) => i*15+15)\n .on('mouseover', function(d) {\n d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d)\n })\n .on('mouseout', function() {\n d3.select('#tooltip').style('opacity', 0)\n })\n .on('mousemove', function() {\n d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')\n })\n"
date = 2019-09-01T22:00:00Z
description = "Learn how to create tooltips in d3. This post shows you actual d3 code and adds explanations to the most important aspects of tooltips in d3 and has a demo as well. "
external_css = ["https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.css"]
external_libs = ["https://unpkg.com/d3@5.9.7/dist/d3.min.js", "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.js", "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/mode/javascript/javascript.js"]
images = ["https://res.cloudinary.com/civicvision/image/upload/f_auto,q_auto,w_auto,dpr_auto,c_limit/geospatial-d3/marketing/tweets/tooltip-full.png"]
include_js = ["repl.js"]
keywords = ["d3", "map", "tooltip"]
layout = "single"
section = "d3"
tagId = 1287309
title = "How to create a simple tooltip in d3.js"
tweet = "1171067111655038977"

+++
{{< header>}}
{{< headline-h1>}}
How to create a simple tooltip in d3
{{</ headline-h1>}}
{{</ header>}}

A common question I see on stackoverflow a lot is around Tooltips.  
There are a bunch of examples out there but people sometimes confuse their intention.  
So I thought I create a short post about Tooltips for d3.

## Goal of a tooltip

The goal of the tooltip is to show information on things when you hover over them.  
And in our specific case we want the tooltip to follow the mouse.

## How do I create a tooltip in d3

First off let’s add a new element to the page.

{{< highlight js >}}
d3.select('body').append('div');
{{< / highlight >}}

\**Important here: **  
Add it to the body or an div **outside** your SVG/Canvas. This is important!

### Why?

We use the mouse position to change the position of the tooltip with `d3.event` but it gives you the **absolute** position of the mouse on the _screen_ not within your SVG.

{{< highlight js >}}
d3.select('body')
.append('div')
.attr('id', 'tooltip')
.attr('style', 'position: absolute; opacity: 0;');
{{< / highlight >}}

We also set the position of the element to `absolute` so that it is outside of the flow of the document and can overlap other elements. We set the opacity to 0 to not show the tooltip by default.

## How to hook up the tooltip to your element

Let‘s use a circle as an example.  
And let our data be `['a','b','c']`.  
We use three events to handle the tooltip.  
`mouseover` is used to handle the initial event. This is where we show the tooltip and change the content of the tooltip.

`mouseout` is used to hide the tooltip once the mouse is out of the Element.

`mousemove` is used to move the tooltip with the mouse.

{{< highlight js >}}
d3.select('svg').selectAll('circle').data(data)
.join('circle')
.attr('r', 3)
.on('mouseover', function(e) {
})
.on('mouseout', function(e) {
})
.on('mousemove', function(e) {
})
{{< / highlight >}}

Let‘s look first at the `mouseover`:

{{< highlight js >}}
on('mouseover', function(d) {
d3.select('#tooltip').style('opacity', 1).text(d)
})
{{< / highlight >}}

We‘re showing the tooltip element and setting the text to be the text of the data element that we‘re hovering over.  
In our example, if we hover over the first element the tooltip would have `a` as its text.  
You could even do it more smoothly using `transition`

{{< highlight js >}}
on('mouseover', function(d) {
d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d)
})
{{< / highlight >}}

What this will accomplish is, that the tooltip will fade in instead of appear right away.

Next up is the `mouseout`:

{{< highlight js >}}
on('mouseout', function() {
d3.select('#tooltip').style('opacity', 0)
})
{{< / highlight >}}

We‘re going to hide the tooltip once we leave that element.

And finally (which is optional) we look at `mousemove`:

{{< highlight js >}}
on('mousemove', function() {
d3.select('#tooltip')
.style('left', d3.event.pageX + 'px')
.style('top', d3.event.pageY + 'px')
})
{{< / highlight >}}

On the `mousemove` event we change the position of the tooltip to follow the mouse. Sometimes you want this, sometimes you don‘t. That‘s why it‘s optional. I usually add some padding to the position of the tooltip so that the cursor is not within the tooltip and the tooltip does not hide the element were looking at.

{{< highlight js >}}
on('mousemove', function() {
d3.select('#tooltip')
.style('left', (d3.event.pageX+10) + 'px')
.style('top', (d3.event.pageY+10) + 'px')
})
{{< / highlight >}}

This is the complete code and you can see the result below. Play around with it. It is interactive!

{{< repl >}}

<br/>
<div class="rm-area-end-of-content"></div>