/**
 * Countable is a script to allow for live paragraph-, word- and character-
 * counting on an HTML element. Usage is recommended on `input` and `textarea`
 * elements.
 *
 * @author   Sacha Schmid (http://github.com/RadLikeWhoa)
 * @version  1.0
 * @license  MIT
 */

;(function () {

  /**
   * Create a new Countable instance on an HTML element.
   *
   * @constructor
   *
   * @param    {HTMLElement}  element     The element to be used for the
   *                                      couting.
   * @param    {Function}     [callback]  The callback to receive and process
   *                                      the result. The callback should
   *                                      accept only one parameter. (default:
   *                                      logs to console)
   *
   * @example  new Countable(elem, function (counter) {
   *             alert(counter.paragraphs, counter.words, counter.characters);
   *           });
   */

  var _ = window.Countable = function (element, callback) {
    if (!element) return;

    this.element = element;
    this.callback = callback || function (counter) {
      console.log(counter);
    };

    this.init();
  };

  _.prototype = {

    /**
     * Trim leading and trailing whitespace.
     *
     * @return  {Object}  The object containing the number of paragraphs, words
     *                    and characters, all accessible by their names.
     */

    count: function () {
      var str = (this.element.value || this.element.innerText).replace(/^\s+|\s+$/, '');

      return {
        paragraphs: str ? str.replace(/\n+/g, '\n').split('\n').length : 0,
        words: str ? str.replace(/\s+/g, ' ').split(' ').length : 0,
        characters: str ? str.replace(/\s/g, '').split('').length : 0
      };
    },

    /**
     * Initiate the Countable object by calling the `count()` function and
     * adding the `input` event listener to the given element.
     */

    init: function () {
      var self = this;

      self.callback(self.count());

      self.element.addEventListener('input', function () {
        self.callback(self.count());
      });
    }

  };
}());