> Node module to parse CoNLL-U file format as streams

Using this module you can parse CoNLL-U files as a stream of sentence objects. You can also access the low-level line parser, if you want deeper control. Example:

```js
var conllu = require('conllu-stream');

require('fs').createReadStream('ud-treebanks-v2.0/UD_English/en-ud-train.conllu')
    .pipe(conllu())
    .on('data', function(sentence) {
        console.log(sentence.toString());
    });
```


### Content

- [Install](#install)
- [Sentence Object](#sentence-object)
- [Token Object](#token-object)
  - [Sentence Boundary](#sentence-boundary)
  - [Sentence Feature](#sentence-feature)
  - [Comment](#comment)
  - [Words](#words)
- [API](#api)
  - [conllu() -> Transform Stream](#conllu---transform-stream)
- [License](#license)


### Install

```bash
npm install --save conllu-stream
```


### Sentence Object

The basic `conllu()` transform stream emits sentence objects. They are instances of `conllu.sentence.model.Sentence`. Properties:

- **type:** `'sentence'`
- **lineNumber:** the first line of the source file representing this sentence
- **lineNumberEnd:** the last line of the source file representing this sentence
- **tokens:** a map of ids and nodes (words, multiwords, empty_node)
- **structure.all:** list of ids of all nodes
- **structure.seq:** list of ids of single word nodes, excluding multiwords
- **structure.raw:** list of ids of words and multiwords in the original sentence text
- **structure.multiwords:** list of all multiwords
- **features:** key/value map of features, like `sent_id` or `text`
- **comments:** list of file comments preceeding this sentence

Methods:

- **toString():** String representation of this sentence (multiwords are breaked down into their components in brackets)
- **getSequence():** Get list of single word tokens


### Token Object

The `conllu.line.stream()` is parsing each line of the input stream and emitting token objects. These are plain JSON objects with the properties depending on the type.

#### Sentence Boundary

- **type:** `'sentence_boundary'`
- **lineNumber:** the line of the source file representing this token

#### Sentence Feature

- **type:** `'sentence_feature'`
- **lineNumber:** the line of the source file representing this token
- **key:** name of the feature, fx. `sent_id`, `text` or `newpar`
- **value:** string or boolean value of the feature, depending on the key

#### Comment

- **type:** `'comment'`
- **lineNumber:** the line of the source file representing this token
- **value:** string value of the file line

#### Words

- **type:** `'word'`, `'multiword'`, `'empty_node'` or `'unknown_node'`
- **lineNumber:** the line of the source file representing this token
- **position:** position of the word in the sentence, 1 for the first word, etc.
- **endPosition:** (only for _multiword_) when the multiword ends
- **subPosition:** (only for _empty_node_) secondary index, fx. 2 for a empty_node `5.2`
- **id:** the full id of the word, fx. `1` (_word_), `1-3` (_multiword_), `1.1` (_empty_node_)
- **form:** written text form of the word
- **lemma:** lemma related to this word
- **upostag:** Universal Dependencies POS tag, fx. `NOUN`, `VERB`, `PROPN`, etc.
- **xpostag:** Language-specific POS tag, fx. `VMFIN` for finite modal verbs in German
- **feats:** Key/value map of morphological features
- **head:** Id of word to link to in dependency tree
- **deprel:** Relation of `head` word in dependency tree
- **deps:** Enhanced dependency tree links
- **misc:** Key/value map of extra properties of this token


### API

#### conllu() -> Transform Stream

Transform stream takes conllu format as input stream and emits [sentence objects](#sentence-object) as output object stream.


### License

Code is licensed under MIT, please see [license.md file](license.md) for details.
