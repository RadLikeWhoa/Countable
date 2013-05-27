(function (document) {
  var hasTextContent = 'textContent' in document.body,
      area = document.getElementById('countableArea'),
      fields = {
        paragraphs: document.getElementById('result__paragraphs'),
        words: document.getElementById('result__words'),
        characters: document.getElementById('result__characters'),
        all: document.getElementById('result__all')
      },
      _gaq = [['_setAccount', 'UA-39380123-1'], ['_trackPageview']],
      ajaxRequest

  // Helper function to set an elements text in different browsers

  function text (element, content) {
    hasTextContent ? element.textContent = content : element.innerText = content
  }

  // Set up Countable on the demo textarea

  Countable.live(area, function (counter) {
    for (var field in fields) text(fields[field], counter[field])
  })

  // Get the current watcher count

  try {
    ajaxRequest = new XMLHttpRequest()
  } catch (e) {
    try {
      ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP")
    } catch (e) {
      try {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP")
      } catch (e){
        return null
      }
    }
  }

  ajaxRequest.open('GET', 'https://api.github.com/repos/RadLikeWhoa/Countable', true)
  ajaxRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  ajaxRequest.send(null)

  ajaxRequest.onreadystatechange = function() {
    if (ajaxRequest.readyState !== 4) return

    var counter = document.getElementById('github-watch-count'),
        watchers = JSON.parse(ajaxRequest.responseText).watchers

    if (!counter || !watchers) return

    text(counter, watchers)
    counter.style.display = 'inline-block'
    counter.title = 'Countable has ' + watchers + ' stargazers on GitHub'
  }

  // Google Analytics

  var g = document.createElement('script'),
      s = document.scripts[0]

  g.src = '//www.google-analytics.com/ga.js'
  s.parentNode.insertBefore(g, s)
}(document))