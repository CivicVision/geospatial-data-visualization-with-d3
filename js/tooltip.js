var code = "d3.select('body').append('div').attr('id', 'tooltip').attr('style', 'position: absolute; opacity: 0;');\n d3.select('body').append('svg').attr('width', 300).attr('height', 300);\n d3.select('svg').selectAll('circle').data(['a','b','c'])\n .join('circle')\n .attr('r', 3)\n .attr('cy', 5)\n .attr('cx', (d,i) => i*15+15)\n .on('mouseover', function(d) {\n d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d)\n })\n .on('mouseout', function() {\n d3.select('#tooltip').style('opacity', 0)\n })\n .on('mousemove', function() {\n d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')\n })";
new JavascriptRepl({
  target: document.querySelector('#code-example'),
  props: {
    files: [{name: 'index.js', content: code, type: 'js' }],
    mode: 'minimal'
  }
});
