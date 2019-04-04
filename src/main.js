const dummyData = {
  2000: [
    {applicant: "Bob", patents: 12},
    {applicant: "Robin", patents: 25},
    {applicant: "Anne", patents: 28},
    {applicant: "Mark", patents: 16},
    {applicant: "Joe", patents: 59},
    {applicant: "Eve", patents: 34},
    {applicant: "Karen", patents: 21},
    {applicant: "Kirsty", patents: 25},
    {applicant: "Chris", patents: 30},
    {applicant: "Lisa", patents: 47},
    {applicant: "Tom", patents: 5},
    {applicant: "Charles", patents: 77},
    {applicant: "Mary", patents: 29},
    {applicant: "Yolanda", patents: 87},
  ],
  2001: [
    {applicant: "Bob", patents: 33},
    {applicant: "Robin", patents: 12},
    {applicant: "Anne", patents: 41},
    {applicant: "Mark", patents: 16},
    {applicant: "Joe", patents: 59},
    {applicant: "Eve", patents: 38},
    {applicant: "Karen", patents: 21},
    {applicant: "Kirsty", patents: 25},
    {applicant: "Chris", patents: 30},
    {applicant: "Lisa", patents: 47},
    {applicant: "Tom", patents: 5},
    {applicant: "Charles", patents: 13},
    {applicant: "Mary", patents: 29},
    {applicant: "Yolanda", patents: 120},
  ],
  2002: [
    {applicant: "Bob", patents: 500},
    {applicant: "Robin", patents: 2500},
    {applicant: "Anne", patents: 300},
    {applicant: "Mark", patents: 1600},
    {applicant: "Joe", patents: 5900},
    {applicant: "Eve", patents: 1100},
    {applicant: "Karen", patents: 2100},
    {applicant: "Kirsty", patents: 250},
    {applicant: "Chris", patents: 800},
    {applicant: "Lisa", patents: 470},
    {applicant: "Tom", patents: 50},
    {applicant: "Charles", patents: 6700},
    {applicant: "Mary", patents: 2900},
    {applicant: "Yolanda", patents: 2200},
  ],
};

const margin = { top: 20, right: 40, bottom: 20, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select(`#wrapper`)
  .append(`svg`)
  .attr(`width`, width + margin.left + margin.right)
  .attr(`height`, height + margin.top + margin.bottom)
  .append(`g`)
  .attr(`transform`, `translate(${margin.left}, ${margin.top})`);

const t = d3.transition().duration(1000);

const xScale = d3.scaleLinear()
  .range([0, width]);

const yScale = d3.scaleBand()
  .range([height, 0]).padding(0.5);

const colorScale = d3.scaleOrdinal()
  .range(d3.schemeCategory10);

svg.append(`g`)
  .attr(`id`, `x-axis`)
  .attr(`transform`, `translate(0, ${height})`);

svg.append(`g`)
  .attr(`id`, `y-axis`);

const update = (allData, year) => {
  const sortedData = Object.values(allData[year]).sort((a, b) => a.patents - b.patents);
  const data = sortedData.slice(sortedData.length - 10);

  xScale.domain([0, d3.max(data, d => +d.patents)]);
  yScale.domain(data.map(d => d.applicant));
  colorScale.domain(data.map(d => d.applicant));

  let bar = svg.selectAll(`.bar`)
    .data(data, d => d.applicant);

  bar.exit().remove();

  bar.transition(t)
    .attr(`transform`, d => `translate(0, ${yScale(d.applicant)})`);

  const barEnter = bar.enter()
    .append(`g`)
    .attr(`class`, `bar`)
    .attr(`transform`, d => `translate(0, ${yScale(d.applicant)})`);

  barEnter.append(`rect`)
    .attr(`height`, 30)
    .attr(`fill`, d => colorScale(d.applicant))
    .attr(`width`, d => xScale(+d.patents));

  barEnter.append(`text`)
    .attr(`text-anchor`, `end`)
    .attr(`font-size`, `12px`)
    .attr(`fill`, `#fff`)
    .attr('y', 20)
    .text(d => d.patents)
    .attr('x', d => xScale(+d.patents) - 10);

  bar = barEnter.merge(bar);

  bar.select(`rect`)
    .attr(`width`, d => xScale(+d.patents));

  bar.select(`text`)
    .text(d => d.patents)
    .attr('x', d => xScale(+d.patents) - 10)
    .transition().duration(1500)
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

const generateData = (number, fn) => [...Array(number)].forEach((it, i) => fn(it, i));

const convertData = (acc, d) => {
  const startYear = 2000;
  generateData(20, (it, i) => {
    const year = startYear + i;
    acc[year] = { ...acc[year] };
    acc[year][d[`Applicant`]] = { applicant: d[`Applicant`], patents: d[year] };
  });
  return acc;
};

const SELECT_YEAR_ELEMENT = document.querySelector(`#year-control`);

d3.tsv(`../data/test_data.csv`)
  .then(result => {
    const parsedData = result.reduce(convertData, {});
    SELECT_YEAR_ELEMENT.addEventListener(`change`, evt => {
      if (!evt.target.value) update(dummyData, 2000);
      else update(dummyData, evt.target.value);
    });
    update(dummyData, 2000);
  })
  .catch(err => console.error(err));
