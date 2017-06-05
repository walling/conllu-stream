'use strict';

var pumpify  = require('pumpify');
var line     = require('./line');
var sentence = require('./sentence');

function parseConlluStream() {
    return pumpify.obj(line.stream(), sentence.stream());
}

exports.stream = parseConlluStream;
