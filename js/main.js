(function (document) {
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

  function event (element, event, callback) {
    if (window.addEventListener) {
      element.addEventListener(event, callback)
    } else if (window.attachEvent) {
      element.attachEvent(event, callback)
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
   * be counted as a bounce visitor.
   *
   * @see <http://goo.gl/nyGIK>
   */

  setTimeout(function () {
    _gaq.push(['_trackEvent', 'Site', 'read'])
  }, 15000);

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

  Countable.live(document.getElementById('countableArea'), function (counter) {
    for (var field in fields) text(fields[field], counter[field])
  })

  /**
   * We get the current watch count of Countable through the GitHub API and
   * display it on the button then.
   */

  async('https://api.github.com/repos/RadLikeWhoa/Countable?callback=watchCount')

  window.watchCount = function (data) {
    if (!data) return

    var counter = document.getElementById('github-watch-count'),
        watchers = data.data.watchers

    if (!counter || !watchers) return

    text(counter, watchers)
    counter.parentNode.style.display = 'inline-block'
    counter.parentNode.title = 'Countable has ' + watchers + ' stargazers on GitHub'

    try {
      delete window.watchCount
    } catch (e) {
      window.watchCount = undefined
    }
  }

  /**
   * We load the Google Analytics snippet asynchronously and track every click
   * on the 'Download on GitHub' button.
   */

  var _gaq = [['_setAccount', 'UA-39380123-1'], ['_trackPageview']]

  async('http://www.google-analytics.com/ga.js')

  event(document.getElementById('github-button'), 'click', function () {
    _gaq.push(['_trackEvent', 'Site', 'Downloads'])
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

  /**
   * As Twitter forbids the use of the count API we need to rely on topsy for
   * both the .com and the .io URL of this page.
   */

  async('http://otter.topsy.com/stats.js?callback=tweetCount&url=http://radlikewhoa.github.io/Countable/&apikey=ULDPO6D4UZ7FT2ZACMLQAAAAACA3WEW5ZNIQAAAAAAAFQGYA')
  async('http://otter.topsy.com/stats.js?callback=tweetCount&url=http://radlikewhoa.github.com/Countable/&apikey=ULDPO6D4UZ7FT2ZACMLQAAAAACA3WEW5ZNIQAAAAAAAFQGYA')

  window.callbacksCalled = []
  window.tweetsSent = 0

  window.tweetCount = function (data) {
    if (!data) return

    var counter = document.getElementById('tweet-count'),
        tweets = data.response.all

    if (!tweets) return

    tweetsSent += tweets
    callbacksCalled.push(tweets)

    if (callbacksCalled.length == 2) {
      if (tweetsSent > 0) {
        text(counter, tweetsSent)
        counter.parentNode.style.display = 'inline-block'
        counter.parentNode.title = 'There are ' + tweetsSent + ' Tweets about Countable'
      }

      try {
        delete window.tweetCount
        delete window.tweetsSent
        delete window.callbacksCalled
      } catch (e) {
        window.tweetCount = window.tweetsSent = window.callbacksCalled = undefined
      }
    }
  }

  /**
   * Prism is used on the site to do syntax highlighting. In order to make the
   * documentation more appealing, Countable-specific keywords are highlighted
   * as well and can be styled using the given class.
   *
   * @see <http://goo.gl/6DpY8>
   */

  Prism.languages.insertBefore('javascript', 'keyword', {
    'countable-class': /Countable/
  })
}(document))