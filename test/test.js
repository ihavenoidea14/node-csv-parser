const test = require('ava');
const path = require('path');
const Csv = require('../lib/csv');
const csv = new Csv();

test('It parses', async t => {

    const input = [
        [ 'id', 'col1', 'col2' ],
        [ '1', 'foo', 'foo,bar' ],
        [ '2', 'foo "bar"', 'foo' ]
    ];

    let data = await csv.parseFile(path.resolve(path.join(__dirname, 'csvTest.csv')));

    t.deepEqual(data, input);

});

test('It maps', async t => {

        const input = [
            { id: '1', col1: 'foo', col2: 'foo,bar' },
            { id: '2', col1: 'foo "bar"', col2: 'foo' }
        ];

        let data = await csv.mapFile(path.resolve(path.join(__dirname, 'csvTest.csv')));

        t.deepEqual(data, input);

    });
