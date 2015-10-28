/**
 * Countable is a script to allow for live paragraph-, word- and character-
 * counting on an HTML element.
 *
 * @author   Sacha Schmid (<https://github.com/RadLikeWhoa>)
 * @version  2.1.1
 * @license  MIT
 * @see      <http://radlikewhoa.github.io/Countable/>
 */

/**
 * Note: For the purpose of this internal documentation, arguments of the type
 * {Nodes} are to be interpreted as either {NodeList} or {Element}.
 */

;(function (global) {
  'use strict'

  /**
   * @private
   *
   * `_liveElements` holds all elements that have the live-counting
   * functionality bound to them.
   *
   * `_event` holds the event to handle the live counting, based on the
   * browser's capabilities.
   */

  var _liveElements = [],
      _event = 'oninput' in document ? 'input' : 'keyup'

  /**
   * IE9 is a special case. It does not fire an 'input' event when
   * characters are deleted (via DEL key, BACKSPACE key, and CUT).
   * If we want support for those actions we need to use the 'keyup'
   * event instead.
   * more info: http://www.matts411.com/post/internet-explorer-9-oninput/
   */

  if (navigator.userAgent.match(/MSIE 9.0/)) {
    _event = 'keyup'
  }

  /**
   * `String.trim()` polyfill for non-supporting browsers. This is the
   * recommended polyfill on MDN.
   *
   * @see     <http://goo.gl/uYveB>
   * @see     <http://goo.gl/xjIxJ>
   *
   * @return  {String}  The original string with leading and trailing
   *                    whitespace removed.
   */

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '')
    }
  }

  /**
   * `ucs2decode` function from the punycode.js library.
   *
   * Creates an array containing the decimal code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally, this
   * function will convert a pair of surrogate halves (each of which UCS-2
   * exposes as separate characters) into a single code point, matching
   * UTF-16.
   *
   * @see     <http://goo.gl/8M09r>
   * @see     <http://goo.gl/u4UUC>
   *
   * @param   {String}  string   The Unicode input string (UCS-2).
   *
   * @return  {Array}   The new array of code points.
   */

  function _decode (string) {
    var output = [],
        counter = 0,
        length = string.length,
        value, extra

    while (counter < length) {
      value = string.charCodeAt(counter++)

      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // High surrogate, and there is a next character.
        extra = string.charCodeAt(counter++)

        if ((extra & 0xFC00) == 0xDC00) {
          // Low surrogate.
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000)
        } else {
          // unmatched surrogate; only append this code unit, in case the next
          // code unit is the high surrogate of a surrogate pair
          output.push(value, extra)
          counter--
        }
      } else {
        output.push(value)
      }
    }

    return output
  }

  /**
   * `_validateArguments` validates the arguments given to each function call.
   * Errors are logged to the console as warnings, but Countable fails
   * silently.
   *
   * @private
   *
   * @param   {Nodes}     elements  The (collection of) element(s) to
   *                                validate.
   *
   * @param   {Function}  callback  The callback function to validate.
   *
   * @return  {Boolean}   Returns whether all arguments are vaild.
   */

  function _validateArguments (elements, callback) {
    var elementsValid = elements && ((Object.prototype.toString.call(elements) === '[object NodeList]' && elements.length) || (elements.nodeType === 1)),
        callbackValid = callback && typeof callback === 'function'

    if ('console' in window && 'warn' in console) {
      if (!elementsValid) console.warn('Countable: No valid elements were found')
      if (!callbackValid) console.warn('Countable: "' + callback + '" is not a valid callback function')
    }

    return elementsValid && callbackValid
  }

  /**
   * `_extendDefaults` is a function to extend a set of default options with
   * the ones given in the function call. Available options are described
   * below.
   *
   * {Boolean}  hardReturns      Use two returns to seperate a paragraph
   *                             instead of one.
   * {Boolean}  stripTags        Strip HTML tags before counting the values.
   * {Boolean}  ignoreReturns    Ignore returns when calculating the `all`
   *                             property.
   * {Boolean}  ignoreZeroWidth  Ignore zero-width space characters.
   *
   * @private
   *
   * @param   {Object}  options  Countable allows the options described above.
   *                             They can be used in a function call to
   *                             override the default behaviour.
   *
   * @return  {Object}  The new options object.
   */

  function _extendDefaults (options) {
    var defaults = {
      hardReturns: false,
      stripTags: false,
      ignoreReturns: false,
      ignoreZeroWidth: true
    }

    for (var prop in options) {
      if (defaults.hasOwnProperty(prop)) defaults[prop] = options[prop]
    }

    return defaults
  }

  /**
   * `_count` trims an element's value, optionally strips HTML tags and counts
   * paragraphs, sentences, words, characters and characters plus spaces.
   *
   * @private
   *
   * @param   {Element}  element  The element whose value is to be counted.
   *
   * @param   {Object}   options  The options to use for the counting.
   *
   * @return  {Object}   The object containing the number of paragraphs,
   *                     sentences, words, characters and characters plus
   *                     spaces.
   */

  function _count (element, options) {
    var original = 'value' in element ? element.value : element.innerText || element.textContent,
        trimmed

    /**
     * The initial implementation to allow for HTML tags stripping was created
     * @craniumslows while the current one was created by @Rob--W.
     *
     * @see <http://goo.gl/Exmlr>
     * @see <http://goo.gl/gFQQh>
     */

    if (options.stripTags) {

      // Block elements as defined by https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
      // 'br' is actually an inline element but must be
      // treated as a block element in order to count words separated by a <br>.
      var blockLikeElements = ['address','article','aside','blockquote','canvas',
      'dd','div','dl','fieldset','figcaption','figure','footer','form','h1',
      'h2', 'h3','h4','h5','h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav',
      'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tfoot', 'ul',
      'video', 'br']

      blockLikeElements.forEach(function(element) {
        original = original.replace(new RegExp('<\s*/?\s*' + element + '\s*/?\s*>', 'gi'), ' ')
      })

      original = original.replace(/<\/?[a-z][^>]*>/gi, '')

      // From: http://dev.w3.org/html5/html-author/charref
      var whitespaceEntities = {
        '&Tab;': '\u0009',
        '&#x00009;': '\u0009',
        '&#9;': '\u0009',
        '&NewLine;': '\u000A',
        '&#x0000A;': '\u000A',
        '&#10;': '\u000A',
        '&nbsp;': '\u00A0',
        '&NonBreakingSpace;': '\u00A0',
        '&#x000A0;': '\u00A0',
        '&#160;': '\u00A0',
        '&ensp;': '\u2002',
        '&#x02002;': '\u2002',
        '&#8194;': '\u2002',
        '&emsp;': '\u2003',
        '&#x02003;': '\u2003',
        '&#8195;': '\u2003',
        '&emsp13;': '\u2004',
        '&#x02004;': '\u2004',
        '&#8196;': '\u2004',
        '&emsp14;': '\u2005',
        '&#x02005;': '\u2005',
        '&#8197;': '\u2005',
        '&numsp;': '\u2007',
        '&#x02007;': '\u2007',
        '&#8199;': '\u2007',
        '&puncsp;': '\u2008',
        '&#x02008;': '\u2008',
        '&#8200;': '\u2008',
        '&thinsp;': '\u2009',
        '&ThinSpace;': '\u2009',
        '&#x02009;': '\u2009',
        '&#8201;': '\u2009',
        '&hairsp;': '\u200A',
        '&VeryThinSpace;': '\u200A',
        '&#x0200A;': '\u200A',
        '&#8202;': '\u200A'
      }

      for (var entity in whitespaceEntities) {
        if (whitespaceEntities.hasOwnProperty(entity)) {
          original = original.replace(new RegExp(entity, 'gi'), whitespaceEntities[entity])
        }
      }
    }

    if (options.ignoreZeroWidth) original = original.replace(/[\u200B]+/, '')

    trimmed = original.trim()

    /**
     * Most of the performance improvements are based on the works of @epmatsw.
     *
     * @see <http://goo.gl/SWOLB>
     */

    return {
      paragraphs: trimmed ? (trimmed.match(options.hardReturns ? /\n{2,}/g : /\n+/g) || []).length + 1 : 0,
      sentences: trimmed ? (trimmed.match(/[.?!…]+./g) || []).length + 1 : 0,
      words: trimmed ? (trimmed.replace(/['";:,.?¿\-!¡]+/g, '').match(/\S+/g) || []).length : 0,
      characters: trimmed ? _decode(trimmed.replace(/\s/g, '')).length : 0,
      all: _decode(options.ignoreReturns ? original.replace(/[\n\r]/g, '') : original).length
    }
  }

  /**
   * `_loop` is a helper function to iterate over a collection, e.g. a NodeList
   * or an Array. The callback receives the current element as the single
   * parameter.
   *
   * @private
   *
   * @param  {Array}     which     The collection to iterate over.
   *
   * @param  {Function}  callback  The callback function to call on each
   *                               iteration.
   */

  function _loop (which, callback) {
    var len = which.length

    if (typeof len !== 'undefined') {
      while (len--) {
        callback(which[len])
      }
    } else {
      callback(which)
    }
  }

  /**
   * This is the main object that will later be exposed to other scripts. It
   * holds all the public methods that can be used to enable the Countable
   * functionality.
   */

  var Countable = {

    /**
     * The `live` method binds the counting handler to all given elements. The
     * event is either `oninput` or `onkeydown`, based on the capabilities of
     * the browser.
     *
     * @param   {Nodes}     elements   All elements that should receive the
     *                                 Countable functionality.
     *
     * @param   {Function}  callback   The callback to fire whenever the
     *                                 element's value changes. The callback is
     *                                 called with the relevant element bound
     *                                 to `this` and the counted values as the
     *                                 single parameter.
     *
     * @param   {Object}    [options]  An object to modify Countable's
     *                                 behaviour. Refer to `_extendDefaults`
     *                                 for a list of available options.
     *
     * @return  {Object}    Returns the Countable object to allow for chaining.
     */

    live: function (elements, callback, options) {
      var ops = _extendDefaults(options),
          bind = function (element) {
            var handler = function () {
                  callback.call(element, _count(element, ops))
                }

            _liveElements.push({ element: element, handler: handler })

            handler()

            if (element.addEventListener) {
              element.addEventListener(_event, handler, false)
            } else if (element.attachEvent) {
              element.attachEvent('on' + _event, handler)
            }
          }

      if (!_validateArguments(elements, callback)) return

      if (elements.length) {
        _loop(elements, bind)
      } else {
        bind(elements)
      }

      return this
    },

    /**
     * The `die` method removes the Countable functionality from all given
     * elements.
     *
     * @param   {Nodes}  elements  All elements whose Countable functionality
     *                             should be unbound.
     *
     * @return  {Object}  Returns the Countable object to allow for chaining.
     */

    die: function (elements) {
      if (!_validateArguments(elements, function () {})) return

      _loop(elements, function (element) {
        var liveElement

        _loop(_liveElements, function (live) {
          if (live.element === element) liveElement = live
        })

        if (!liveElement) return

        if (element.removeEventListener) {
          element.removeEventListener(_event, liveElement.handler, false)
        } else if (element.detachEvent) {
          element.detachEvent('on' + _event, liveElement.handler)
        }

        _liveElements.splice(_liveElements.indexOf(liveElement), 1)
      })

      return this
    },

    /**
     * The `once` method works mostly like the `live` method, but no events are
     * bound, the functionality is only executed once.
     *
     * @alias   Countable.count
     *
     * @param   {Nodes}     elements   All elements that should receive the
     *                                 Countable functionality.
     *
     * @param   {Function}  callback   The callback to fire whenever the
     *                                 element's value changes. The callback is
     *                                 called with the relevant element bound
     *                                 to `this` and the counted values as the
     *                                 single parameter.
     *
     * @param   {Object}    [options]  An object to modify Countable's
     *                                 behaviour. Refer to `_extendDefaults`
     *                                 for a list of available options.
     *
     * @return  {Object}    Returns the Countable object to allow for chaining.
     */

    once: function (elements, callback, options) {
      if (!_validateArguments(elements, callback)) return

      _loop(elements, function (element) {
        callback.call(element, _count(element, _extendDefaults(options)))
      })

      return this
    },

    count: function (elements, callback, options) {
      return this.once(elements, callback, options)
    },

    /**
     * The `enabled` method checks if the live-counting functionality is bound
     * to an element.
     *
     * @param   {Element}  element  A single Element.
     *
     * @return  {Boolean}  A boolean value representing whether Countable
     *                     functionality is bound to the given element.
     */

    enabled: function (element) {
      var isEnabled = false

      if (element && element.nodeType === 1) {
        _loop(_liveElements, function (live) {
          if (live.element === element) isEnabled = true
        })
      }

      return isEnabled
    }

  }

  /**
   * Expose Countable depending on the module system used across the
   * application. (Node / CommonJS, AMD, global)
   */

  if (typeof exports === 'object') {
    module.exports = Countable
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return Countable })
  } else {
    global.Countable = Countable
  }
}(this));
