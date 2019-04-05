const loop = (number, fn) => [...Array(number)].forEach((it, i) => fn(it, i));

const convertData = (acc, d) => {
  const startYear = 2000;
  loop(20, (it, i) => {
    const year = startYear + i;
    acc[year] = { ...acc[year] };
    acc[year][d[`Applicant`]] = { applicant: d[`Applicant`], patents: d[year] };
  });
  return acc;
};
