+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["resource", "tutorial", "advanced"]
keywords = ["d3", "map", "update"]
codeexample = ""
date = "2019-09-03T02:00:00+00:00"
description = "How v5 helps clean up your updating code"
external_css = []
external_libs = []
images = []
include_js = []
layout = "single"
section = "d3"
title = "Updating your chart in d3.js"
tagId = 1287307
+++
# Updating your chart

Updating your d3 chart used to be a bit confusing for most people.

The data pattern takes some time to understand properly and when I teach d3 courses people always got trip up on it.

But d3 version 5 just made it a **whole lot easier** to use and understand.

There is a new method: `join`
And with it we don't need to use `enter` and `exit` directly anymore. These were the methods with the most confusion.

But you still can use them. You pass them to the `join` method to have more fine grain control.

Let‘s take a look at how it works.

## Before:

{{< highlight js >}}
circles = d3.select('svg').selectAll('circle').data([1,2,3,4])
circles.enter().append('circle')
circles.exit().remove()
circles.merge().attr('r', (d) => d)
{{< / highlight >}}

## After

{{< highlight js >}}
circles = d3.select('svg').selectAll('circle').data([1,2,3,4])
circles.join('circle').attr('r', (d) => d)
{{< / highlight >}}

**What?** Pretty great, right?
That means less boilerplate code. I used to write the _enter, append, exit, remove_ code a lot of times. So it‘s great that this is now gone. The  `join` method will call `append` and `remove` internally.

But what if you want to animate the remove?
You still can. It‘s just a little different:
{{< highlight js >}}
circles = d3.select('svg').selectAll('circle').data([1,2,3,4])
circles.join(
  enter =>   
    enter.append('circle').attr('fill', 'green'),   
  exit => exit.attr('fill', 'brown').call(
    exit =>   
      exit.transition(svg.transition().duration(750))
    .remove()
    )
)
{{< / highlight >}}

This looks a little crazy. But is kinda genius. The uses-cases for these animations and changes are rare, so most people will benefit greatly from this change and the others just need to learn a little bit different syntax.

<br/>
<div class="rm-area-after-tutorial"></div>
