[![Build Status](https://travis-ci.org/AladdiX/rawdraftjs-to-tree.svg?branch=master)](https://travis-ci.org/AladdiX/rawdraftjs-to-tree)

# rawdraftjs-to-tree

Converts a RawDraftContentState to a tree

TL;DR This library is supposed to give full flexibility for generating renderable output from a `RawDraftContentState`. It provides a more processable format: a tree.

An example of how HTML would be generated out of the tree lives [here](https://github.com/AladdiX/rawdraftjs-to-tree/blob/master/example/convert-to-html.js).


## Installation

```
npm install rawdraftjs-to-tree --save
```

## Usage

```javascript
import getContentTree from 'rawdraftjs-to-tree';

const tree = getContentTree(contentState);
```

Where `contentState` is instance of `RawDraftContentState`.

The output, in this case, `tree` will be a JSON following [this schema](https://github.com/AladdiX/rawdraftjs-to-tree/blob/master/schema.json).

And then what ?

Using the output tree you can go creative on what your final output is: good old HTML, React components or generate something else.



> *Maybe in our world there lives a happy little tree over there* 🌲 🌳
>  
> *- Bob Ross*
