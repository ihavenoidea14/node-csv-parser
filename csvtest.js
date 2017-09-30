const path = require('path');
const Csv = require('./lib/csv');
const csv = new Csv();

csv.parseFile('./test/csvTest.csv').then(data => {
  console.log(data);
});