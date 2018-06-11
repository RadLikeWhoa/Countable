/**
 * As `textContent` is not supported in all browsers we need to set it
 * differently depending on the browser's capabilities. This is mainly
 * needed to support IE < 9.
 *
 * @see <http://goo.gl/EIhUJ>
 */

function text (element, content) {
  if('textContent' in document.body) {
    element.textContent = content
  } else {
    element.innerText = content
  }
}

/**
 * IE uses a different way to bind event listeners to an element so we need
 * to set that based on the browser's capabilities.
 *
 * @see <http://goo.gl/B3bGc>
 */

function event (action, element, _event, callback) {
  if (action === 'add') {
    if (window.addEventListener) {
      element.addEventListener(_event, callback)
    } else if (window.attachEvent) {
      element.attachEvent(_event, callback)
    }
  } else if (action === 'remove') {
    if (window.removeEventListener) {
      element.removeEventListener(_event, callback)
    } else if (window.detachEvent) {
      element.detachEvent(_event, callback)
    }
  }
}

/**
 * Helper scripts are inserted asynchronously into the page.
 */

function async (url) {
  var g = document.createElement('script'),
      s = document.scripts[0]

  g.src = url
  s.parentNode.insertBefore(g, s)
}

/**
 * In order to adjust the bounce rate on Google Analytics, we can safely
 * assume that if a visitor stays on the site for 15 seconds, he shouldn't
 * be counted as a bounce visitor. Alternatively, a user that scrolls on the
 * page at least once is also not counted as a bounce.
 *
 * @see <http://goo.gl/nyGIK>
 */

setTimeout(function () {
  _gaq.push(['_trackEvent', 'Site', 'Read', 'The user stayed on the page for 15 seconds or longer'])
}, 15000)

function scrollAbr () {
  _gaq.push(['_trackEvent', 'Site', 'Scrolled', 'The user scrolled the page at least once'])
  event('remove', window, 'scroll', scrollAbr)
}

event('add', window, 'scroll', scrollAbr)

/**
 * We set up Countable on the demo `textarea` and make it write the counted
 * results in the relevant result fields.
 */

var fields = {
  paragraphs: document.getElementById('result__paragraphs'),
  words: document.getElementById('result__words'),
  characters: document.getElementById('result__characters'),
  all: document.getElementById('result__all')
}

Countable.on(document.getElementById('countableArea'), function (counter) {
  for (var field in fields) text(fields[field], counter[field])
})

/**
 * We load the Google Analytics snippet asynchronously and track every click
 * on the 'Download on GitHub' button.
 */

var _gaq = [['_setAccount', 'UA-39380123-1'], ['_trackPageview']]

async('http://www.google-analytics.com/ga.js')

event('add', document.getElementById('github-button'), 'click', function () {
  _gaq.push(['_trackEvent', 'Site', 'Downloads', 'The user clicked the "Download on GitHub" button'])
})

/**
 * We make use of Twitter's widgets platform to use Web Intents and to be able
 * to track Twitter actions (e.g. tweet, follow.)
 *
 * @see <http://goo.gl/gHefO>
 * @see <http://goo.gl/4NyWj>
 */

async('https://platform.twitter.com/widgets.js')

window.twttr = (function () {
  var t
  return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } })
}())

twttr.ready(function () {
  var track = function (event) {
    _gaq.push(['_trackEvent', 'Twitter', event.type])
  }

  twttr.events.bind('click', track)
  twttr.events.bind('tweet', track)
  twttr.events.bind('follow', track)
})

var val = countableArea.value
countableArea.value = ''
countableArea.focus()
countableArea.value = val
