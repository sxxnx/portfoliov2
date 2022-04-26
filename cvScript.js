document.addEventListener('DOMContentLoaded', function(){
  drawChartEX();
});

function drawChartEX() {
  const svgEX = d3.select(" #chartEducationXP").append("svg").attr('id','Chart').attr("width", '100%').attr("height", 300);
  d3.json("*****").then(function(data) {
    svgEX.append('line').attr('class', 'timeline-base')
      .attr("x1", 0)
      .attr("y1", 100)
      .attr("x2", '92%')
      .attr("y2", 100);
    // Get the value of the svgEX to for scaleLinear
    function getLineVal(val) {
      if(val === 'max') {
        let el = document.getElementById('Chart');
        return el.getBoundingClientRect().width;
      }
      else {
        return 0;
      }
    }
    // Convert to UNIX timestamp
    function convertToTimeStamp(date) {
      let parts = date.match(/(\d{4})-(\d{2})/);
      return new Date(parts[1]+ '-'+parts[2]+'-01').getTime();
    }

    let scaleLine = d3.scaleLinear()
      .domain([1285891200000, Date.now()])
      .range([getLineVal('min') + 20 , getLineVal('max') - 100]); // OFFSET = 20

    let scaleCircle = d3.scaleLinear()
      .domain([moment.duration(3,'d').asMilliseconds(), moment.duration(10,'y').asMilliseconds()])
      .range([10, 200]);

    let allGroups = svgEX.selectAll('g').data(data);
    let group = allGroups.enter().append('g').attr('id', function(data){return 'group-' + data.id});

    group.append('circle')
      .attr('cx', function(data) {return scaleLine(convertToTimeStamp(data.startDate));})
      .attr('cy', 100)
      .attr('r', function(data) {return scaleCircle(convertToTimeStamp(data.endDate) - convertToTimeStamp(data.startDate));})
      .attr('fill-opacity', 0.5)
      .attr('class', function(data) { return('circle-category circle-' + data.category.toLowerCase())})
      .attr('id', function(data) {
        return 'circle-' + data.id
      })
      // When hover a circle
      .on('mouseover', function(d, i) {
        d3.select(this).attr('r', function(data) {return scaleCircle(convertToTimeStamp(data.endDate) - convertToTimeStamp(data.startDate)) + 20;});
        d3.select(this).classed('circle-hovered', true);
        d3.select(this.parentNode).selectAll('text').style('opacity', 1);
        d3.select(this.parentNode).selectAll('.text-place').classed('hovered', true).style('opacity', 0);
        d3.select(this.parentNode).selectAll('.text-desc').classed('hovered', true).style('opacity', 0);
        d3.select(this.parentNode).selectAll('.text-date-end').classed('hovered', true).style('opacity', 0);
      })
      // When un-hover a circle
      .on('mouseout', function(d, i){
        d3.select(this).attr('r', function(data) {return scaleCircle(convertToTimeStamp(data.endDate) - convertToTimeStamp(data.startDate));});
        d3.select(this).classed('circle-hovered', false);
        d3.select(this.parentNode).selectAll('text').style('opacity', 0);
      });

    group.append('text')
      .style('opacity', 0)
      .text(function(data) { return(data.name);})
      .attr('x', function(data) {
        let elementWitdh = this.getBoundingClientRect().width;
        // Avoid overflow
        if(scaleLine(convertToTimeStamp(data.startDate)) + elementWitdh + 5 >= getLineVal('max')) { //offset 5
          return scaleLine(convertToTimeStamp(data.startDate)) - elementWitdh;
        }
        else {
          return scaleLine(convertToTimeStamp(data.startDate));
        }
      })
      .attr('y', 150)
      .attr('class', 'text-position');

    group.append('text')
      .text(function(data) {
      // Get only YYYY-MM
      if(data.startDate.length > 7) {
        return (data.startDate.slice(0,7))
      }
      else {
        return(data.startDate)
      }
    })
    .attr('x', function(data) {
      // Get sibling to have the len and align the date
      let elementWitdh= this.getBoundingClientRect().width;
      let positionWidth = this.parentNode.querySelector('text.text-position').getBoundingClientRect().width;
      if(scaleLine(convertToTimeStamp(data.startDate)) + positionWidth >= getLineVal('max')) {
        return scaleLine(convertToTimeStamp(data.startDate)) - elementWitdh;
      }
      else {
        return scaleLine(convertToTimeStamp(data.startDate));
      }
    })
    .attr('y', 130)
    .attr('class', 'text-date')
    .style('opacity', 0);

    data.map(d => {
      let details = d3.select('#timelineChart').append('div').classed('details', true).classed('details-' + d.category.toLowerCase(), true).attr('id', 'details-' + d.id);
      details.append('i').classed('material-icons close-icon', true).text('close');
      details.append('div').classed('title', true).append('span').classed('date text-date date-title', true).text(d.startDate + '-' + d.endDate);
      details.select(' .title').append('span').classed('position-title text-position', true).text(d.name);
      details.append('div').classed('place-name text-place hovered', true).text(d.placeName);
      details.append('div')
        .attr('class', 'text-desc')
        .attr('id', 'descriptionId-'+ d.id)
        .text(function(){
          if(typeof(d.description) === 'string') {
            return d.description;
          }
          else {
            return d.description.toString()
          }
        });
      details.style('opacity', 0);
    });
  });
}
