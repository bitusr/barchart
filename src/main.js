const parsedCsv = {
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
};

const data = [
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
];

const margin = { top: 20, right: 20, bottom: 20, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select(`#wrapper`)
  .append(`svg`)
  .attr(`width`, width + margin.left + margin.right)
  .attr(`height`, height + margin.top + margin.bottom)
  .append(`g`)
  .attr(`transform`, `translate(${margin.left}, ${margin.top})`);

const xMax = d3.max(data, d => d.patents);
const xScale = d3.scaleLinear()
  .domain([0, xMax])
  .range([0, width]);

const yScale = d3.scaleBand()
  .domain(data.map(d => d.applicant))
  .range([height, 0]).padding(0.5);

const colorScale = d3.scaleOrdinal()
  .domain(data.map(d => d.applicant))
  .range(d3.schemeCategory10);

const barChart = svg.selectAll(`.bar`)
  .data(data)
  .enter().append(`rect`)
  .attr(`class`, `bar`)
  .attr(`y`, d => yScale(d.applicant))
  .attr(`width`, d => xScale(d.patents))
  .attr(`height`, 20)
  .attr(`fill`, d => colorScale(d.applicant));

svg.append(`g`)
  .attr(`transform`, `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

svg.append(`g`)
  .call(d3.axisLeft(yScale));

// const update = (data, year) => {
//   const dataByYear = data.filter(d => d.year === year);
//
//
// };
