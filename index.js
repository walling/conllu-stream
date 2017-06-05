'use strict';

var field    = require('./lib/field');
var line     = require('./lib/line');
var sentence = require('./lib/sentence');
var conllu   = require('./lib/conllu');

function conlluStream() {
    return conllu.stream();
}

exports = module.exports = conlluStream;
exports.field            = field;
exports.line             = line;
exports.sentence         = sentence;
