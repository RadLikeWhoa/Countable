# Countable

Countable is a JavaScript function to add **live paragraph-, word- and character-counting** to an HTML element. Countable does not rely on any libraries and is very small in size.

[View the Demo](http://radlikewhoa.github.com/Countable#demo)

## Installation

You can install Countable in various ways.

* Install using [bower](http://github.com/twitter/bower): `bower install Countable`
* Clone the git repo: `git clone git@github.com:RadLikeWhoa/Countable.git`
* Copy the [contents of the script](https://raw.github.com/RadLikeWhoa/Countable/master/Countable.js) directly

## Usage

You can define your own callback function that Countable should use. If you don't pass such a function, the results are simply logged to the console. 

```html
<script src="js/Countable.js"></script>
<script>
  new Countable(elem, function (counter) {

    /**
     * `counters.paragraphs` holds the number of paragraphs.
     * `counters.words` holds the number of words.
     * `counters.characters` holds the number of characters (without spaces)
     * `counters.all` holds the number of characters (with spaces)
     */

    alert(counter.paragraphs, counter.words, counter.characters, counters.all);
  });
</script>
```

An optional HTML element attribute of *omit* can toggle whether or not text that contains HTML tags should count the tags in calculations. To activate this functionality set the attribute to on. 

```html
 <textarea id="countableArea" placeholder="I count html tags as characters and words"></textarea>
 <textarea id="countableArea2"omit="on" placeholder="I eat html tags"></textarea>
```



Countable takes the value from an HTML element and counts paragraphs, words and characters (without and with spaces). Those numbers are then returned in an object, accessible by a single parameter in the callback function. In the above example, `counter` holds all numbers returned from Countable.

## Browser Support

Countable has been tested in Chrome (latest), Safari (latest), Firefox (latest), Opera (latest) and Internet Explorer (7+). It is built to support both newer and older browsers. Should you find an error, please submit [an isssue](https://github.com/RadLikeWhoa/Countable/issues) describing the error, including your browser version and operating system.

## About the Author

My name is [Sacha Schmid](http://sachaschmid.ch). I'm a front-end engineer from Switzerland. I am the creator of [SSGS](http://github.com/RadLikeWhoa/SSGS) and [other open source projects](http://github.com/RadLikeWhoa).