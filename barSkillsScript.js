document.addEventListener('DOMContentLoaded', function(){
  const dataHTML = [
    {name: 'HTML', value:3.8},
    {name: 'SVG Creation', value: 3.6},
    {name: 'SVG Update', value: 3.4},
    {name: 'DOM Structure/Front End Architecture', value: 3.4},
    {name:'Twig', value: 2.1}
  ]
  const dataCSS = [
    {name: 'CSS', value:3.8},
    {name: 'SCSS', value: 3.6},
    {name: 'Designing Charts', value: 3.5},
    {name: 'CSS Animations', value: 3},
    {name:'UX Improvments', value: 3}
  ]
  const dataJS = [
    {name: 'D3.js', value:3.6},
    {name: 'jQuery', value: 3.4},
    {name: 'Node', value: 1.9},
    {name: 'Angular', value: 1.5},
    {name:'React', value: 1.2}
  ]
  const dataPython = [
    {name: 'Python 3', value:2.7},
    {name: 'Jupyter', value: 2.5},
    {name: 'Numpy', value: 2},
    {name: 'Matplotlib', value: 2},
    {name:'Pandas', value: 2}
  ]
  drawChartBar(dataHTML, 'chartHTML');
  drawChartBar(dataCSS, 'chartCSS');
  drawChartBar(dataJS, 'chartJS');
  drawChartBar(dataPython, 'chartPython');
});

function drawChartBar(dataset, id) {
  const colors = ['#E597FA', '#B096F0', '#92C8E4', '#CBED76', '#F2D87D']
  const width = 800
  const height = 400
  const identifier = id.replace('chart', '');
  const containerw = document.getElementById(id).getBoundingClientRect().width;

  console.log(containerw)

  const svgWrapper = d3.select('#' + id).append('svg').attr('width', '100%').attr('height', height).attr('viewBox', '0 0 '+ containerw +' '+ height );
  const plot = svgWrapper.append('g').attr('id', 'plot' + identifier);

  const x = d3.scaleLinear();
  const y = d3.scaleBand();

  x.range([0, width]).domain([0,4]);
  y.range([0, height]).domain(dataset.map(d => d.name)).padding(0.5);

  const xTicks = 4;
  const xAxis = d3.axisBottom()
        .scale(x)
        .ticks(0)

  const yAxis = d3.axisLeft()
        .scale(y)
        .tickPadding(8);

  // CHART
  const ticksVal = [
    {name: '', value: 0},
    {name:'learning', value: 1},
    {name: 'did some stuff', value: 2},
    {name: 'did a lot', value:3},
    {name: 'almost created it', value: 4}
  ]
  const tickPosition = width / xTicks;
  const tickHeight = 5;

  plot
    .append('g')
    .attr('class', 'axis x');

  plot
    .append('g')
    .attr('class', 'axis y')

  plot.append('g')
    .attr('class', 'bars')
    .selectAll('.bar')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('fill', function(d, i) {
      return colors[i]
    });

  plot.selectAll(' .bar')
    .attr('y', function(d) {
      return y(d.name)
    })
    .attr('height', y.bandwidth())
    .transition() // animation when loaded (cannot be seen exept on refresh but still cool)
    .duration(2000)
    .attr('x', x(0))
    .attr('width', dataset => x(dataset.value) - x(0));

  // Draw axes
  plot.select('.axis.x')
    .attr('transform', 'translate(0, ' + parseFloat(height - 20) + ')') //20 = offset
    .call(xAxis)
    .select('.domain').remove();

  plot.select('.axis.x').append('path')
    .classed('domainX', true)
    .attr('d', 'M0,0 L'+ tickPosition + ', 0 L'+ tickPosition +',' + tickHeight +
    ' L ' + tickPosition +',' + -height +
    'L' + tickPosition + ',0 L' + tickPosition * 2 +',0 L' + tickPosition * 2 + ',' + tickHeight +
    'L'+ tickPosition * 2 +',' + -height +
    'L'+ tickPosition * 2 +',0 L' + tickPosition * 3 + ',0 L'+ tickPosition * 3 + ',' + tickHeight +
    'L' + tickPosition * 3 + ',' + -height +
    'L' + tickPosition * 3 + ',0 L' + tickPosition * 4 + ',0 L' + tickPosition * 4 +',' + tickHeight +
    'L' + tickPosition * 4 + ',' + -height +
    'L' + tickPosition * 4 + ',0');

  plot.select('.axis.y')
    .attr('transform', 'translate(0, -20)') //20 = offset
    .call(yAxis);

  plot
    .append('g')
    .attr('class', 'labels')
    .selectAll('.label')
    .data(dataset)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', 10)
    .attr('y', dataset => y(dataset.name) + y.bandwidth() / 2)
    .attr('dy', '0.35em')
    .text(dataset => dataset.name);

  plot
    .append('g')
    .classed('ticks-text', true)
    .selectAll('.ticks-label')
    .data(ticksVal)
    .enter()
    .append('text')
    .classed('ticks-label', true)
    .attr('x', ticksVal => x(ticksVal.value) - 30)
    .attr('y', height)
    .text(ticksVal => ticksVal.name)

  d3.select('#' + id).append('a').attr('href', '#projects').classed('link-in', true).text('See my projects');
}
