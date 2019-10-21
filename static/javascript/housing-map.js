const small_projection = d3.geoAlbers()
const smallGeoGenerator = d3.geoPath()
.projection(small_projection);

const chart = async () => {
  const indicator = 'paying_30';


  d3.select('#tooltip').attr('style', 'position: absolute; top: 0; left: 0;')

  const chicago_communities_affordable_housing = await d3.json('http://milafrerichs.de/chicago-housing-burden/chicago.json')
  const g = d3.select('#housing-map').select('svg').select('g')
  g.selectAll('path')
  .data(chicago_communities_affordable_housing.features)
  .on('mouseover', function(d) {
    d3.select('#tooltip').style('opacity', 1);
    addTooltip(d);
  })
  .on('mouseout', function(d) {
    d3.select('#tooltip').style('opacity', 0);
  })
  .on('mousemove', function() {
    d3.select('#tooltip').style('top', (d3.event.pageY+20) + 'px').style('left', d3.event.pageX + 'px')
  })


}
function addTooltip(d) {
  d3.select('#tooltip').select('#community').text(d.properties.community)
  d3.select('#tooltip').select('#percentage-30').text(d3.format(".1%")(d.properties.paying_30/100 || 0))
  d3.select('#tooltip').select('#percentage-50').text(d3.format(".1%")(d.properties.paying_50/100 || 0))

  d3.select('#tooltip').select('#total_units').text(d.properties.total_units || 0)
  d3.select('#tooltip').select('#affordable_units').text(d.properties.affordable_units || 0)
  small_projection.fitSize([50,50], d)
  small_map = d3.select('#small-map').html('').append('svg').attr('width', 50).attr('height', 50).attr('style', 'margin: 0 auto')
  small_map.append('g').selectAll('path').data([d]).join('path').attr('d', smallGeoGenerator).attr('fill', '#ccc')
}

