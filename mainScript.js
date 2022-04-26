document.addEventListener('DOMContentLoaded', function(){
  drawChart();
});

function drawChart() {
  const data = [
    {name: 'main', parent: '', value:''},
    {name: 'css', parent:'main', value: 80},
    {name: 'html', parent:'main', value: 80},
    {name: 'js', parent:'main', value: 60},
    {name:'python', parent:'main', value: 40}
  ]

  const cssData = ['CSS (pure)', 'Sass(SCSS, Less)', 'CSS animations', 'UX improvments', 'DataViz design']
  const JSData = ['D3.js', 'jQuery', 'super willing to learn React and Vue']
  const HTMLData = ['HTML (pure/Twig)', 'SVG (create/update)', 'DOM Manipulation', 'DOM Structure']
  const pythonData = ['Python 3', 'Jupyter', 'Pandas', 'Numpy']

  const colors = ['#8B8098', '#AD84B3', '#D18485', '#B97198']
  const width = 400
  const height = 400

  const svg = d3.select('#ChartSkills').append('svg').attr('width', '100%').attr('height', height + 100).append('g').attr('id', 'treemap');
  const svgP = d3.select('#ChartSkills svg').append('g').attr('id', 'elements');

  // FUNCTIONS
  function appendText(arr, category, line) {
    let i = 0;
    arr.map(element => {
      i = i +1;
      let x1 = line.getAttribute('x1')
      let x2 = line.getAttribute('x2')
      let x;
      let y = line.getAttribute('y1')
      if (x1 > x2) {
        x = x2 - 20; // offset
      }
      else {
        x = parseFloat(x2) + 15 // offset
      }
      svgP.append('text')
        .classed('text-' + category, true)
        .classed('text-category', true)
        .classed('hidden', true)
        .attr('x', x)
        .attr('y', function(d) {
          return parseFloat(y - 30) + (i * 25)
        })
        .attr('text-anchor', function(d) {
          if(x < 285) {
            return 'end'
          }
          else {
            return 'start'
          }
        })
        .text(element);
    })
  }
  function goTo(anchor) {
    let loc = document.location.toString().split('#')[0];
    document.location = loc + '#part' + anchor;
    return false;
}


  // Chart
  let root = d3.stratify()
    .id(function(d) { return d.name; })
    .parentId(function(d) { return d.parent; })
    (data);
    root.sum(function(d) { return +d.value })

  let treemap = d3.treemap()
    .size([width, height])
    .padding(1)
    (root)

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("fill", function(d, i) { return colors[i]})
    .on('click', function(d) {
      goTo(d.data.name);
    });

  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .classed('text-skills', true)
      .attr("x", function(d){
        if(d.x0 > 245) {
          if(d.data.name === 'js') { return d.x0 + 50; }
          else { return d.x0 + 5; }
        }
        else { return d.x0 + 80 }
      })    // 10 offset (+ right)
      .attr("y", function(d){ return d.y0+ 110})    // 50 offset (lower)
      .text(function(d){ return d.data.name});

  // Append circles for each category
  svg.selectAll('circle')
    .data(root.leaves())
    .enter()
    .append('circle')
    .classed('circle-skill', true)
    .classed('hidden', true)
    .attr('id', function(d) {
      return d.data.name;
    })
    .attr('cx', function(d) {
      // display one way or the other depending on the position
      if(d.x0 < 245.6) {
        return d.x0 + 50
      }
      else {
        if(d.data.name === 'python') { return d.y0 + 155 }
        else { return d.x1 - 50 }
      }
    })
    .attr('cy', function(d) { return d.y0 + 100})
    .attr('r', 2)
    .style('fill', '#5b5365');

  // Apppend lines for each circles
  let circles = d3.selectAll('circle');
  circles._groups.map(circlesG => {
    circlesG.forEach(function(circ) {
      svgP.append('line')
        .classed('line-skill', true)
        .classed('hidden', true)
        .classed('line-' + circ.getAttribute('id'), true)
        .attr('x1', parseFloat(circ.getAttribute('cx')))
        .attr('y1', parseFloat(circ.getAttribute('cy')))
        .attr('x2', function() {
          if(circ.getAttribute('cx') < 250) {
            return parseFloat(circ.getAttribute('cx')) - 100; // line len
          }
          else {
            if(circ.getAttribute('id') === 'python') { return parseFloat(circ.getAttribute('cx')) + 50}
            else { return parseFloat(circ.getAttribute('cx')) + 100}
          }
          }
        )
        .attr('y2', parseFloat(circ.getAttribute('cy')))
    })
  });

  // Append texts for each line
  let lines = d3.selectAll('line');
  lines._groups.map(linesG => {
    linesG.forEach(function(line) {
      let category = line.getAttribute('class').split(' ')[2].replace('line-', '')
      let textData = [];
      switch (category) {
        case 'css':
          textData = cssData;
          break;
        case 'html':
          textData = HTMLData;
          break;
        case 'js':
          textData = JSData;
          break;
        default:
          textData = pythonData;
      }
      appendText(textData, category, line)
    })
  })

  // Display lines and text on mouseover
  svg.on('mouseover', function() {
    // First time
    d3.selectAll(' .hidden').classed('hidden', false).classed('inactive', false).classed('active', true);
    // Next time
    d3.selectAll(' .inactive').classed('inactive', false).classed('active', true)
  })
  .on('mouseout', function() {
    d3.selectAll(' .active').classed('inactive', true).classed('active', false);
  })

  // Append text bottom of page
  let svgWidth = document.getElementById('ChartSkills').getBoundingClientRect().width;
  let svgHeight = document.getElementById('ChartSkills').getBoundingClientRect().height;
  d3.select('svg').append('text').text('The rest of the time, I do yoga.').classed('extra-text', true).attr('x', svgWidth - width/1.5).attr('y', svgHeight - 30)
}
