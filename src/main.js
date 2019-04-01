const dummyData = {
  1920: [
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
  1930: [
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
  1940: [
    {applicant: "Bob", patents: 5},
    {applicant: "Robin", patents: 25},
    {applicant: "Anne", patents: 3},
    {applicant: "Mark", patents: 16},
    {applicant: "Joe", patents: 59},
    {applicant: "Eve", patents: 11},
    {applicant: "Karen", patents: 21},
    {applicant: "Kirsty", patents: 25},
    {applicant: "Chris", patents: 8},
    {applicant: "Lisa", patents: 47},
    {applicant: "Tom", patents: 5},
    {applicant: "Charles", patents: 67},
    {applicant: "Mary", patents: 29},
    {applicant: "Yolanda", patents: 22},
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
  const sortedData = allData[year].sort((a, b) => a.patents - b.patents);
  const data = sortedData.slice(sortedData.length - 10);

  xScale.domain([0, d3.max(data, d => d.patents)]);
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
    .attr(`height`, 23)
    .attr(`fill`, d => colorScale(d.applicant))
    .attr(`width`, d => xScale(d.patents));

  barEnter.append(`text`)
    .attr(`text-anchor`, `end`)
    .attr(`font-size`, `12px`)
    .attr(`fill`, `#fff`)
    .attr('y', 16)
    .text(d => d.patents)
    .attr('x', d => xScale(d.patents) - 10);

  bar = barEnter.merge(bar);

  bar.select(`rect`)
    .attr(`width`, d => xScale(d.patents));

  bar.select(`text`)
    .text(d => d.patents)
    .attr('x', d => xScale(d.patents) - 6);

  d3.select(`#x-axis`).call(d3.axisBottom(xScale));

  d3.select(`#y-axis`).call(d3.axisLeft(yScale));
};

document.querySelector(`#year-control`).addEventListener(`change`, evt => {
  if (!evt.target.value) update(dummyData, 1920);
  else update(dummyData, evt.target.value);
});

update(dummyData, 1920);
