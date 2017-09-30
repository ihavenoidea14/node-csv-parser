const fs = require('fs');

module.exports = class Csv {

    constructor(delimiter, quote, quote_escape) {
        this.delimiter = delimiter || ',';
        this.quote = quote || '"';
        this.quote_escape  = quote_escape || '"';
    }

    write(list) {
        var csv = '', i;
        list.forEach(function (line) {
            for (i = 0, l = line.length; i < l; i++) {
                line[i] = line[i].replace(quote, quote_escape + quote);
            }
            csv += quote + line.join(quote + delimiter + quote) + quote + '\r\n';
        });
        return csv;
    }

    writeFile (file, list, callback) {
        fs.writeFile(file, write(list), callback);
    }

    parseFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        }).then(data => {
            return this._parse(data);
        }).then(data => {
            return data
        }).catch(e => {
            return e;
        });
    }

    _parse(data) {
        data = data.toString();
        return new Promise((resolve, reject) => {
            try {
                var d = this.delimiter
                  , e = this.quote_escape
                  , q = this.quote;

                var pattern = new RegExp(
                    '('+d+'|\\r?\\n|\\r|^)' +
                    '(?:'+q+'([^'+q+']*(?:'+e+q+'[^'+q+']*)*)"|' +
                    '([^'+q+d+'\\r\\n]*))'
                , 'gi');

                var csv = [[]];

                var matches = null, strMatchedValue, matchedDelimiter;

                if (e == '\\') e = '\\\\';

                while (matches = pattern.exec(data)){
                    matchedDelimiter = matches[1];

                    if (matchedDelimiter.length && matchedDelimiter !== d) {
                        csv.push([]);
                    }

                    if (matches[2]) {
                        strMatchedValue = matches[2].replace(new RegExp(e+q, 'g'), q);
                    } else {
                        strMatchedValue = matches[3];
                    }

                    csv[csv.length - 1].push(strMatchedValue);

                }

                csv.pop();

                resolve(csv);

            } catch (e) {
                reject(e);
            }
        });
    }

    mapFile(path) {
        return this.parseFile(path).then(data => {
            return this._map(data);
        });
    }

    _map(csv) {
        return new Promise((resolve, reject) => {
            try {
                let columns = csv.shift()
                    , obj
                    , obj_pool = []
                    , i = 0
                    , row = 0
                    , col_count = columns.length
                    , len;
                for (row = 0, len = csv.length; row < len; row++) {
                    if (csv[row].length != col_count) {
                        throw Error('CSV column count mismatch on line '+(row+2));
                    }
                    obj = {}
                    for (i = 0; i < col_count; i++) {
                        obj[columns[i]] = csv[row][i];
                    }
                    obj_pool.push(obj);
                }

                resolve(obj_pool);

            } catch (e) {
                reject(e);
            }
        })
    }
}
