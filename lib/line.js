'use strict';

var split = require('split2');
var field = require('./field');

function parseLine(line, lineNumber) {
    line = line.trim();

    if (!line) {
        return { type : 'sentence_boundary', lineNumber : lineNumber };
    }

    var sentenceFeature = line.match(/^#\s*(newdoc id|newpar id|sent_id|text|text_\w{2,3})\s*=\s*/);
    if (sentenceFeature) {
        return {
            type      : 'sentence_feature',
            lineNumber : lineNumber,
            key        : sentenceFeature[1],
            value      : line.substring(sentenceFeature[0].length)
        };
    }

    sentenceFeature = line.match(/^#\s*(newdoc|newpar)$/);
    if (sentenceFeature) {
        return {
            type      : 'sentence_feature',
            lineNumber : lineNumber,
            key        : sentenceFeature[1],
            value      : true
        };
    }

    if (line[0] === '#') {
        return { type : 'comment', lineNumber : lineNumber, value : line.substring(1).trim() };
    }

    var fields = line.split('\t');
    var id     = fields[0].trim();
    var type, idSplit;

    if (/^\d+$/.test(id)) {
        type   = 'word';
    } else if (/^\d+\-\d+$/.test(id)) {
        type   = 'multiword';
        idSplit = id.split('-');
    } else if (/^\d+\.\d+$/.test(id)) {
        type   = 'empty_node';
        idSplit = id.split('.');
    } else {
        type   = 'unknown_node';
    }

    return {
        type        : type,
        lineNumber  : lineNumber,
        position    : (idSplit ? idSplit[0] : id) | 0,
        endPosition : type === 'multiword'  ? (idSplit[1] | 0) : null,
        subPosition : type === 'empty_node' ? (idSplit[1] | 0) : null,
        id          : id,
        form        : field.parse(fields[1]),
        lemma       : field.parse(fields[2]),
        upostag     : field.parse(fields[3]),
        xpostag     : field.parse(fields[4]),
        feats       : field.parseMap(fields[5]),
        head        : field.parse(fields[6]),
        deprel      : field.parse(fields[7]),
        deps        : field.parseMap(fields[8], ':'),
        misc        : field.parseMap(fields[9])
    };
}

function parseLineStream() {
    var lineNumber = 0;
    return split(function(line) {
        return parseLine(line, ++lineNumber);
    });
}

exports.parse  = parseLine;
exports.stream = parseLineStream;
