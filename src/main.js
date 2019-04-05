const margin = { top: 20, right: 40, bottom: 20, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select(`#wrapper`)
  .append(`svg`)
  .attr(`width`, width + margin.left + margin.right)
  .attr(`height`, height + margin.top + margin.bottom)
  .append(`g`)
  .attr(`transform`, `translate(${margin.left}, ${margin.top})`);

const xScale = d3.scaleLinear()
  .range([0, width]);

const yScale = d3.scaleBand()
  .range([height, 0]).padding(0.5);

svg.append(`g`)
  .attr(`id`, `x-axis`)
  .attr(`transform`, `translate(0, ${height})`);

svg.append(`g`)
  .attr(`id`, `y-axis`);

const update = (allData, year) => {
  const sortedData = Object.values(allData[year]).sort((a, b) => a.patents - b.patents);
  const data = sortedData.slice(sortedData.length - NUMBER_OF_APPLICANTS);

  xScale.domain([0, d3.max(data, d => +d.patents)]);
  yScale.domain(data.map(d => d.applicant));

  let bar = svg.selectAll(`.bar`)
    .data(data, d => d.applicant);

  bar.exit().remove();

  // TODO add easings ==================================================================================================
  bar.transition().duration(600)
    .attr(`transform`, d => `translate(0, ${yScale(d.applicant)})`);

  const barEnter = bar.enter()
    .append(`g`)
    .attr(`class`, `bar`)
    .attr(`transform`, d => `translate(0, ${yScale(d.applicant)})`)
    .on(`mouseover`, function(d, i) {
      d3.select(this).select(`rect`).attr(`fill`, HOVER_BAR_COLOR)
    })
    .on(`mouseout`, function(d, i) {
      d3.select(this).select(`rect`).attr(`fill`, DEFAULT_BAR_COLOR)
    });

  barEnter.append(`rect`)
    .attr(`height`, 30)
    .attr(`fill`, d => DEFAULT_BAR_COLOR)
    .transition().duration(600)
    .attr(`width`, d => xScale(+d.patents));

  barEnter.append(`text`)
    .attr(`text-anchor`, `end`)
    .attr(`font-size`, `14px`)
    .attr(`fill`, `#ffffff`)
    .attr('y', 20)
    .text(d => d.patents)
    .transition().duration(600)
    .attr('x', d => xScale(+d.patents) - 10);

  bar = barEnter.merge(bar);

  bar.select(`rect`)
    .transition().duration(600)
    .attr(`width`, d => xScale(+d.patents));

  bar.select(`text`)
    .text(d => d.patents)
    .transition().duration(600)
    .attr('x', d => xScale(+d.patents) - 10)
    // .attrTween(`text`, function(d) {
    //   // console.log(this.textContent, d.patents)
    //   const interpolator = d3.interpolateRound(+this.textContent, +d.patents);
    //   return function (t) {
    //     console.log(t, interpolator(t))
    //     return interpolator(t);
    //   }
    // });

  d3.select(`#x-axis`).call(d3.axisBottom(xScale));

  d3.select(`#y-axis`).call(d3.axisLeft(yScale));
};

d3.tsv(`../data/test_data.csv`)
  .then(result => {
    const parsedData = result.reduce(convertData, {});

    SELECT_YEAR_ELEMENT.addEventListener(`change`, evt => {
      if (!evt.target.value) update(DUMMY_DATA, 2000);
      else update(DUMMY_DATA, evt.target.value);
    });

    LOOP_ELEMENT.addEventListener(`click`, evt => {
      let year = 2000;
      let index = 0;
      const interval = d3.interval(() => {
        if (year > 2005) interval.stop();
        else {
          SELECT_YEAR_ELEMENT.selectedIndex = index;
          update(DUMMY_DATA, year);
        }
        year++;
        index++;
      }, 1500);

    });

    update(DUMMY_DATA, 2000);
  })
  .catch(err => console.error(err));
