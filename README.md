# Countable

Countable is a JavaScript function to add **live paragraph-, word- and character-counting** to an HTML element. Countable is a *zero-dependency* library and comes in at **1KB** when minified and gzipped.

**[View the Demo](http://radlikewhoa.github.io/Countable#demo)**

## Installation

The preferred method of installation is **[bower](https://github.com/bower/bower)**: `bower install Countable`.

Alternatively, you can download the latest [zipball](https://github.com/RadLikeWhoa/Countable/archive/master.zip) or copy the [script](https://raw.github.com/RadLikeWhoa/Countable/master/Countable.js) directly.

## API // EDIT

Countable enables live counting on `<input>` and `<textarea>` elements as well as elements that have the `contenteditable` attribute. Elements whose text contents cannot be edited are simply parsed once.

You can define your own callback function that Countable should use. If you don't pass such a function, the results are simply logged to the console.

```html
<script src="js/Countable.js"></script>
<script>
  var elem = document.getElementById('field')

  new Countable(elem, function (counter) {
    alert(counter.words)
  })
</script>
```

Countable takes the value from an HTML element and counts paragraphs, words and characters (with and without spaces). The callback function can receive a single parameter. This parameter is an object containing all the calculated values. In the above example, `counter` holds all numbers returned from Countable.

```javascript
counter = {
  paragraphs: 0,
  words: 0,
  characters: 0,
  all: 0
}
```

Property   | Meaning
---------- | --------------------------------------------------------------------------------------------
paragraphs | The number of paragraphs. Paragraphs can be separated by either a soft or a hard (two line breaks) return. To use hard returns, add a truthy parameter to your Countable call after the callback.
words      | The number of words. Words are split using spaces.
characters | The number of characters (without spaces). This contains all non-whitespace characters.
all        | The number of characters including whitespace. This is the total number of all characters in the element.

You can optionally change Countable's behaviour by passing an options object as the third parameter.

### Options

`Boolean` *hardReturns* — Use two returns to seperate a paragraph instead of one.

`Boolean` *stripTags* — Strip HTML tags before counting the values.

## Browser Support

Countable supports all modern browsers. Internet Explorer is supported down to version 8. The last version to support Internet Explorer 7 was 1.4.0. If you want to use the new version while still supporting IE7, you'll need to include a polyfill for `document.querySelectorAll`.

## About the Author

My name is [Sacha Schmid](https://twitter.com/sachaschmid). I'm a front-end engineer from Switzerland. I am the creator of [SSGS](http://github.com/RadLikeWhoa/SSGS) and [other open source projects](https://github.com/RadLikeWhoa).

### Contributors

* [@epmatsw](https://github.com/epmatsw)
* [@craniumslows](https://github.com/craniumslows)