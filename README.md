# Countable

Countable is a JavaScript function to add **live paragraph-, word- and character-counting** to an HTML element. Countable is a *zero-dependency* library and comes in at **1KB** when minified and gzipped.

[**View the Demo**](http://radlikewhoa.github.io/Countable#demo)

## Installation

The preferred method of installation is [**bower**](https://github.com/bower/bower): `bower install Countable`. Alternatively, you can download the latest [zipball](https://github.com/RadLikeWhoa/Countable/archive/master.zip) or copy the [script](https://raw.github.com/RadLikeWhoa/Countable/master/Countable.js) directly.

## API

Countable is available as a Node / CommonJS module, an AMD module and as a global. All methods are accessed on the Countable object directly.

### Callbacks

The `live` and `once` method both accept a callback. The given callback is then called whenever needed with a single parameter that carries all the releavant data. `this` is bound to the current element. Take the following code for an example.

```javascript
Countable.once('#text', function (counter) {
  console.log(this, counter)
})
```

```
=> <textarea id="text"></textarea>, { all: 0, characters: 0, paragraphs: 0, words: 0 }
```

Property   | Meaning
---------- | --------------------------------------------------------------------------------------------
paragraphs | The number of paragraphs. Paragraphs can be separated by either a soft or a hard (two line breaks) return. To use hard returns, set the corresponding option (`hardReturns`).
words      | The number of words. Words are split using spaces.
characters | The number of characters (without spaces). This contains all non-whitespace characters.
all        | The number of characters including whitespace. This is the total number of all characters in the element.

### Countable#live(selector, callback, options)

Bind the callback to all elements matching a selector. The callback gets called everytime the elements value or text is changed.

```javascript
Countable.live('#text', function (counter) {
  console.log(counter)
})
```

### Countable#die(selector)

Remove the bound callback from all elements matching a selector.

```javascript
Countable.die('#text')
```

### Countable#once(selector, callback, options)

Similar to `live`, but the callback is only executed once, there are no events bound.

```javascript
Countable.once('#text', function (counter) {
  console.log(counter)
})
```

### Countable#enabled(element)

Checks if an element has the live-counting functionality bound.

```javascript
Countable.enabled(document.getElementById('text'))
```

### Options

`Boolean` `hardReturns` — Use two returns to seperate a paragraph instead of one.

`Boolean` `stripTags` — Strip HTML tags before counting the values.

## Browser Support

Countable supports all modern browsers. Internet Explorer is supported down to version 8. The last version to support Internet Explorer 7 was [1.4.2](https://github.com/RadLikeWhoa/Countable/tree/28cb82eba57a016b32fdd0970b5e8282dcc667ba).

## About the Author

My name is [Sacha Schmid](http://sachaschmid.ch) ([**@sachaschmid**](https://twitter.com/sachaschmid)). I'm a front-end engineer from Switzerland. I am the creator of [SSGS](http://github.com/RadLikeWhoa/SSGS) and [other open source projects](https://github.com/RadLikeWhoa).

Are you using Countable in a project? I'd love to see what you've achieved. Just [**send me a tweet**](https://twitter.com/sachaschmid).

### Contributors

* [@epmatsw](https://github.com/epmatsw)
* [@craniumslows](https://github.com/craniumslows)
* [@Rob--W](https://github.com/Rob--W)