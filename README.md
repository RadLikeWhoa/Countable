# Countable

Countable is a JavaScript function to add **live paragraph-, word- and character-counting** to an HTML element. Countable does not rely on any libraries and stays under 1KB when minified and gzipped.

[View the Demo](http://radlikewhoa.github.io/Countable#demo)

## Installation

* Install using [bower](http://github.com/twitter/bower): `bower install Countable`
* Clone the git repo: `git clone git@github.com:RadLikeWhoa/Countable.git`
* Copy the [contents of the script](https://raw.github.com/RadLikeWhoa/Countable/master/Countable.js) directly

## Usage

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
---------- | ----------------------------------------
paragraphs | The number of paragraphs. Paragraphs can be separated by either a soft or a hard (two line breaks) return. To use hard returns, add a truthy parameter to your Countable call after the callback.
words      | The number of words. Words are split using spaces.
characters | The number of characters (without spaces). This contains all non-whitespace characters.
all        | The number of characters including whitespace. This is the total number of all characters in the element.

## Browser Support

Chrome   | Safari   | Firefox   | Opera   | Internet Explorer
:------: | :------: | :-------: | :-----: | :-----------------:
Yes      | Yes      | Yes       | Yes     | 7+

## About the Author

My name is [Sacha Schmid](http://sachaschmid.ch). I'm a front-end engineer from Switzerland. I am the creator of [SSGS](http://github.com/RadLikeWhoa/SSGS) and [other open source projects](http://github.com/RadLikeWhoa).

### Contributors

* [@epmatsw](https://github.com/epmatsw)
* [@craniumslows](https://github.com/craniumslows)