const path = require('path');
const Csv = require('./lib/csv');
const csv = new Csv();

csv.mapFile('./test/csvTest.csv').then(data => {
  console.log(data);
}).catch(e => {
  console.log(e);
})