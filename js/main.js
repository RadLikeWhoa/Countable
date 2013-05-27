(function (document) {
  var scr = document.scripts[0],
      hasTextContent = 'textContent' in document.body,
      area = document.getElementById('countableArea'),
      fields = {
        paragraphs: document.getElementById('result__paragraphs'),
        words: document.getElementById('result__words'),
        characters: document.getElementById('result__characters'),
        all: document.getElementById('result__all')
      },
      _gaq = [['_setAccount', 'UA-39380123-1'], ['_trackPageview']]

  // Helper function to set an elements text in different browsers

  function text (element, content) {
    hasTextContent ? element.textContent = content : element.innerText = content
  }

  // Set up Countable on the demo textarea

  Countable.live(area, function (counter) {
    for (var field in fields) text(fields[field], counter[field])
  })

  // Get the current watcher count

  window.gitHubWatchers = function (data) {
    var counter = document.getElementById('github-watch-count'),
        watchers = data.data.watchers

    if (!counter || !watchers) return

    text(counter, watchers)
    counter.style.display = 'inline-block'
    counter.title = 'Countable has ' + watchers + ' stargazers on GitHub'

    window.gitHubWatchers = undefined
  }

  var g = document.createElement('script')

  g.src = 'https://api.github.com/repos/RadLikeWhoa/Countable?callback=gitHubWatchers'
  scr.parentNode.insertBefore(g, scr)

  // Google Analytics

  ;(function () {
    var g = document.createElement('script')

    g.src = '//www.google-analytics.com/ga.js'
    scr.parentNode.insertBefore(g, scr)
  }())

  // Twitter

  window.twttr = (function () {
    var js = document.createElement('script'),
        t

    js.src = 'https://platform.twitter.com/widgets.js'
    scr.parentNode.insertBefore(js, scr)
    return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } })
  }())

  // Track twitter intent events on Google Analytics

  function track (event) {
    _gaq.push(['_trackEvent', 'Twitter', event.type])
  }

  twttr.ready(function () {
    twttr.events.bind('click', track)
    twttr.events.bind('tweet', track)
    twttr.events.bind('follow', track)
  })
}(document))