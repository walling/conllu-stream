'use strict';

var through  = require('through2');
var model    = require('./model');
var Sentence = model.Sentence;

function parseSentence(sentence, lineObject) {
    if (!(sentence instanceof Sentence)) {
        throw new Error('Invalid Sentence object: ' + Object.prototype.toString.call(sentence));
    }

    if (!lineObject || !lineObject.type) {
        throw new Error('Invalid line object: ' + Object.prototype.toString.call(lineObject));
    }

    if (lineObject.type === 'sentence_boundary') {
        return sentence._emit();
    }

    sentence.lineNumberEnd = lineObject.lineNumber;

    if (lineObject.type === 'sentence_feature') {
        sentence.features[lineObject.key] = lineObject.value;
        return;
    }

    if (lineObject.type === 'comment') {
        sentence.comments.push(lineObject.value);
        return;
    }

    sentence.tokens[lineObject.id] = lineObject;
    sentence.structure.all.push(lineObject.id);

    if (lineObject.type === 'word') {
        sentence.structure.seq.push(lineObject.id);
        sentence.structure.raw.push(lineObject.id);
    }

    if (lineObject.type === 'multiword') {
        sentence.structure.raw.push(lineObject.id);
        sentence.structure.multiwords.push(lineObject.id);
    }
}

function parseSentenceStream() {
    var sentence = new Sentence(1);

    return through.obj(function(lineObject, encoding, callback) {
        var emitSentence = parseSentence(sentence, lineObject);
        if (emitSentence) {
            sentence = new Sentence(lineObject.lineNumber);
        }
        callback(undefined, emitSentence);
    }, function(callback) {
        callback(undefined, sentence._emit());
    });
}

exports.model  = model;
exports.parse  = parseSentence;
exports.stream = parseSentenceStream;
