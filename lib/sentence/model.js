'use strict';

function Sentence(lineNumber) {
    this.type           = 'sentence';
    this.lineNumber     = lineNumber;
    this.lineNumberEnd  = lineNumber;
    this.tokens         = {};
    this.structure      = { all : [], seq : [], raw : [], multiwords : [] };
    this.features       = {};
    this.comments       = [];
    this.emitted        = false;
}

Sentence.prototype.toString = function() {
    var self = this;

    return self.structure.raw.map(function(id) {
        var word = self.tokens[id];
        var form = (word.form || '_').replace(/ /g, '_');

        if (word.type === 'multiword') {
            var subForms = [];
            for (var i = word.position; i <= word.endPosition; i++) {
                subForms.push(self.tokens[''+i].form);
            }
            form += ' [' + subForms.join(' ') + ']';
        }

        return form;
    }).join(' ');
};

Sentence.prototype.getSequence = function() {
    var self = this;

    return self.structure.seq.map(function(id) {
        return self.tokens[id];
    });
};

Sentence.prototype._emit = function() {
    var self = this;

    if (!self.structure.all.length) {
        return;
    }

    if (self.emitted) {
        return self;
    }

    if (self.structure.multiwords.length > 0) {
        var precedingRanges = {};
        self.structure.multiwords.forEach(function(id) {
            var word = self.tokens[id];
            for (var position = word.position; position <= word.endPosition; position++) {
                precedingRanges[''+position] = true;
            }
        });

        self.structure.raw = self.structure.raw.filter(function(id) {
            var word = self.tokens[id];
            return word.type === 'multiword' || !precedingRanges[word.position];
        });
    }

    self.emitted = true;
    return self;
};

exports.Sentence = Sentence;
