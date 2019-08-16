+++
body_classes = "font-light font-sans content post mb-6 text-base md:text-lg leading-relaxed"
categories = ["resource"]
section = "d3"
description = "Three basic elements of SVG you should know if you want to create maps with d3. "
images = ["https://res.cloudinary.com/civicvision/image/upload/f_auto,q_auto,w_auto,dpr_auto,c_limit/geospatial-d3/marketing/website/SVG-basics.png"]
layout = ""
title = "SVG Basics for d3"

+++
# SVG Basics for d3

When you start learning or using d3 you will come across SVGs. That‘s what most people use when they create a visualization with d3. And it‘s the easier choice and the more documented one. So you need to understand a few basic concepts of SVG to make better use of d3 and learn faster.  

In this short post I will show you three elements of SVG that are worth knowing.  

## Groups

You‘ve probably come across a visualization where the person used a `g` element within their svg.  
The `g` stands for group and is an easy way to structure your svg. Especially if you have any kind of interaction or want to update your chart it‘s easier to group your svg elements into groups. You can select them easily and add just one class to the group. It makes it easy to style them as well, when you have groups.

## The path element

The most common used element with d3 is the path element. It‘s also the most flexible element. You can create almost any shape with it.  
We can do that with the `d` attribute of the path. The good thing is, you don‘t really need to know how it works. You just need to be aware that it exists and that you will use it with d3 to create custom elements. For mapping we mostly just use the path element.

## Translation

This is the part where a lot of people struggle with. And I honestly did not tried too hard to understand it for a long time but just used it the way other people were using it.  
But it’s actually quite simple. So here is a short explanation of it:  
With `transform="translate(20,20)"` you‘re moving that element 20 pixel to the right and 20 pixel to the bottom. Why? Because in the browser the coordinate system start in the top left corner of an element.  
Why is that useful?  
Because now you can move elements that have no x,y attributes. Like a group for example.  

Hope you enjoyed this short post. 
