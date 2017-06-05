'use strict';

var querystring = require('querystring');

function parseField(value) {
    value = value && value.trim();
    return (value === '_' ? '' : value) || null;
}

function parseMap(value, separator) {
    var map = querystring.parse(parseField(value), '|', separator);
    for (var key in map) {
        if (map[key] === 'Yes') {
            map[key] = true;
        } else if (map[key] === 'No') {
            map[key] = false;
        } else if (/,/.test(map[key])) {
            map[key] = map[key].split(',');
        }
    }
    return map;
}

exports.parse    = parseField;
exports.parseMap = parseMap;
