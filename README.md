# Countable

[![Build Status](http://img.shields.io/travis/RadLikeWhoa/Countable.svg)](https://travis-ci.org/RadLikeWhoa/Countable)
[![Code Climate](https://codeclimate.com/github/RadLikeWhoa/Countable/badges/gpa.svg)](https://codeclimate.com/github/RadLikeWhoa/Countable)
[![Latest Tag](http://img.shields.io/github/tag/RadLikeWhoa/Countable.svg)](https://github.com/RadLikeWhoa/Countable/tags)
[![License](http://img.shields.io/badge/license-MIT-orange.svg)](https://github.com/RadLikeWhoa/Countable/blob/master/LICENSE.md)

Countable is a JavaScript function to add **live paragraph-, word- and character-counting** to an HTML element. Countable is a *zero-dependency* library and comes in at **1KB** when minified and gzipped.

[**View the Demo**](http://radlikewhoa.github.io/Countable#demo)

## Installation

The preferred method of installation is [**npm**](https://www.npmjs.com/) or [**yarn**](https://yarnpkg.com/).

```
npm i --save-dev countable
yarn add --dev countable
```

Alternatively, you can download the latest [zipball](https://github.com/RadLikeWhoa/Countable/archive/master.zip) or copy the [script](https://raw.github.com/RadLikeWhoa/Countable/master/Countable.js) directly.

## Usage

Countable is available as a Node / CommonJS module, an AMD module and as a global. All methods are accessed on the Countable object directly.

### Callbacks

The `on` and `count` methods both accept a callback. The given callback is then called whenever needed with a single parameter that carries all the relevant data. `this` is bound to the current element. Take the following code for an example.

```javascript
Countable.count(document.getElementById('text'), counter => console.log(this, counter))
```

```
=> <textarea id="text"></textarea>, { all: 0, characters: 0, paragraphs: 0, words: 0 }
```

Property   | Meaning
---------- | --------------------------------------------------------------------------------------------
paragraphs | The number of paragraphs. Paragraphs can be separated by either a soft or a hard (two line breaks) return. To use hard returns, set the corresponding option (`hardReturns`).
sentences  | The number of sentences. Sentences are separated by a sentence-terminating character.
words      | The number of words. Words are split using spaces.
characters | The number of characters (without spaces). This contains all non-whitespace characters.
all        | The number of characters including whitespace. This is the total number of all characters in the element.

### Countable.on(elements, callback, options)

Bind the callback to all given elements. The callback gets called every time the element's value or text is changed.

```javascript
Countable.on(area, counter => console.log(counter))
```

### Countable.off(elements)

Remove the bound callback from all given elements.

```javascript
Countable.off(area)
```

### Countable.count(elements, callback, options)

Similar to `Countable.on()`, but the callback is only executed once, there are no events bound.

```javascript
Countable.once(area, counter => console.log(counter))
```

### Countable.enabled(elements)

Checks the live-counting functionality is bound to the given.

```javascript
Countable.enabled(area)
```

### Options

`Countable.on()` and `Countable.count()` both accept a third argument, an options object that allows you to change how Countable treats certain aspects of your element's text.

```javascript
{
  hardReturns: false,
  stripTags: false,
  ignore: []
}
```

By default, paragraphs are split by a single return (a soft return). By setting `hardReturns` to true, Countable splits paragraphs after two returns.

Depending on your application and audience, you might need to strip HTML tags from the text before counting it. You can do this by setting `stripTags` to true.

Sometimes it is desirable to ignore certain characters. These can be included in an array and passed using the `ignore` option.

## Browser Support

Countable supports all modern browsers. Full ES5 support is expected, as are some ES6 features, namely `let` and `const`.
