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
   */

  var _liveElements = []

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
    var output = []
    var counter = 0
    var length = string.length
    var value
    var extra

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
    var nodes = Object.prototype.toString.call(elements)
    var elementsValid = elements && (((nodes === '[object NodeList]' || nodes === '[object HTMLCollection]') && elements.length) || (elements.nodeType === 1))
    var callbackValid = callback && typeof callback === 'function'

    if (!elementsValid) console.warn('Countable: No valid elements were found')
    if (!callbackValid) console.warn('Countable: Not a valid callback function')

    return elementsValid && callbackValid
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
    var original = '' + ('value' in element ? element.value : element.innerText || element.textContent)
    var trimmed

    /**
     * The initial implementation to allow for HTML tags stripping was created
     * @craniumslows while the current one was created by @Rob--W.
     *
     * @see <http://goo.gl/Exmlr>
     * @see <http://goo.gl/gFQQh>
     */

    if (options.stripTags) original = original.replace(/<\/?[a-z][^>]*>/gi, '')
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
      all: _decode(!options.ignoreReturns ? original : original.replace(/[\n\r]/g, '')).length
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
   *
   * Some methods accept an optional options parameter. This includes the
   * following options.
   *
   * {Boolean}  hardReturns      Use two returns to seperate a paragraph
   *                             instead of one. (default: false)
   * {Boolean}  stripTags        Strip HTML tags before counting the values.
   *                             (default: false)
   * {Boolean}  ignoreReturns    Ignore returns when calculating the `all`
   *                             property. (default: false)
   * {Boolean}  ignoreZeroWidth  Ignore zero-width space characters. (default:
   *                             true)
   */

  var Countable = {

    /**
     * The `on` method binds the counting handler to all given elements. The
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
     *                                 behaviour.
     *
     * @return  {Object}    Returns the Countable object to allow for chaining.
     */

    on: function (elements, callback, options) {
      if (!_validateArguments(elements, callback)) return

      var options = options || {}
      var bind = function (element) {
        var handler = function () {
          callback.call(element, _count(element, options))
        }

        _liveElements.push({ element: element, handler: handler })

        handler()

        element.addEventListener('input', handler, false)
      }

      _loop(elements, bind)

      return this
    },

    /**
     * The `off` method removes the Countable functionality from all given
     * elements.
     *
     * @param   {Nodes}  elements  All elements whose Countable functionality
     *                             should be unbound.
     *
     * @return  {Object}  Returns the Countable object to allow for chaining.
     */

    off: function (elements) {
      if (!_validateArguments(elements, function () {})) return

      _loop(elements, function (element) {
        var liveElement

        _loop(_liveElements, function (live) {
          if (live.element === element) liveElement = live
        })

        if (!liveElement) return

        element.removeEventListener('input', liveElement.handler, false)

        _liveElements.splice(_liveElements.indexOf(liveElement), 1)
      })

      return this
    },

    /**
     * The `count` method works mostly like the `live` method, but no events are
     * bound, the functionality is only executed once.
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
     *                                 behaviour.
     *
     * @return  {Object}    Returns the Countable object to allow for chaining.
     */

    count: function (elements, callback, options) {
      if (!_validateArguments(elements, callback)) return

      var options = options || {}

      _loop(elements, function (element) {
        callback.call(element, _count(element, options))
      })

      return this
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
      return _liveElements.filter(function (el) { return el.element === element }).length > 0
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
