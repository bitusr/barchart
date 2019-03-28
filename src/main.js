const dummyData = {
  1920: [
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
    {applicant: "Stacy", patents: 20},
    {applicant: "Charles", patents: 13},
    {applicant: "Mary", patents: 29},
    {applicant: "Yolanda", patents: 90},
  ],
  1930: [
    {applicant: "Bob", patents: 12},
    {applicant: "Robin", patents: 12},
    {applicant: "Joe", patents: 59},
    {applicant: "Yolanda", patents: 90},
    {applicant: "Anne", patents: 41},
    {applicant: "Mark", patents: 16},
    {applicant: "Eve", patents: 38},
    {applicant: "Karen", patents: 21},
    {applicant: "Kirsty", patents: 25},
    {applicant: "Stacy", patents: 11},
    {applicant: "Chris", patents: 30},
    {applicant: "Lisa", patents: 47},
    {applicant: "Tom", patents: 5},
    {applicant: "Charles", patents: 54},
    {applicant: "Mary", patents: 29},
  ],
  1940: [
    {applicant: "Yolanda", patents: 80},
    {applicant: "Robin", patents: 110},
    {applicant: "Joe", patents: 13},
    {applicant: "Anne", patents: 41},
    {applicant: "Lisa", patents: 47},
    {applicant: "Charles", patents: 54},
    {applicant: "Mark", patents: 16},
    {applicant: "Eve", patents: 38},
    {applicant: "Karen", patents: 21},
    {applicant: "Kirsty", patents: 25},
    {applicant: "Stacy", patents: 11},
    {applicant: "Bob", patents: 12},
    {applicant: "Chris", patents: 30},
    {applicant: "Tom", patents: 5},
    {applicant: "Mary", patents: 29},
  ],
};

const margin = { top: 20, right: 20, bottom: 20, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select(`#wrapper`)
  .append(`svg`)
  .attr(`width`, width + margin.left + margin.right)
  .attr(`height`, height + margin.top + margin.bottom)
  .append(`g`)
  .attr(`transform`, `translate(${margin.left}, ${margin.top})`);

const t = d3.transition().duration(1500);

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
  const data = allData[year].sort((a, b) => a.patents - b.patents);

  xScale.domain([0, d3.max(data, d => d.patents)]);
  yScale.domain(data.map(d => d.applicant));
  colorScale.domain(data.map(d => d.applicant));

  let bars = svg.selectAll(`.bar`)
    .data(data);

  bars.exit()
    .transition(t)
    .attr(`width`, 0)
    .remove();

  const enter = bars.enter().append(`rect`)
    .attr(`class`, `bar`)
    .attr(`y`, d => yScale(d.applicant))
    .attr(`width`, d => xScale(d.patents))
    .attr(`height`, 20)
    .attr(`fill`, d => colorScale(d.applicant));

  bars = enter.merge(bars)
    .attr(`fill`, d => colorScale(d.applicant))
    .transition(t)
    .attr(`width`, d => xScale(d.patents));

  d3.select(`#x-axis`).call(d3.axisBottom(xScale));

  d3.select(`#y-axis`).call(d3.axisLeft(yScale));
};

document.querySelector(`#year-control`).addEventListener(`change`, evt => {
  if (!evt.target.value) update(dummyData, 1920);
  else update(dummyData, evt.target.value);
});

update(dummyData, 1920);
