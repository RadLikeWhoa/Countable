var expect = chai.expect

describe('Countable', function () {
  var paragraphs, sentences, words, characters, all,
      areaContainer, area

  function callback (counter) {
    paragraphs.innerHTML = counter.paragraphs
    sentences.innerHTML = counter.sentences
    words.innerHTML = counter.words
    characters.innerHTML = counter.characters
    all.innerHTML = counter.all
  }

  function check (values) {
    expect(paragraphs.innerHTML).to.equal(values[0])
    expect(sentences.innerHTML).to.equal(values[1])
    expect(words.innerHTML).to.equal(values[2])
    expect(characters.innerHTML).to.equal(values[3])
    expect(all.innerHTML).to.equal(values[4])
  }

  function triggerInput () {
    var event = document.createEvent('HTMLEvents')
    event.initEvent('input', true, true)
    event.eventName = 'input'
    area.dispatchEvent(event)
  }

  before(function () {
    document.body.innerHTML = '<ul>' +
                                '<li id="paragraphs"></li>' +
                                '<li id="sentences"></li>' +
                                '<li id="words"></li>' +
                                '<li id="characters"></li>' +
                                '<li id="all"></li>' +
                              '</ul>' +
                              '<textarea id="area"></textarea>'

    paragraphs = document.getElementById('paragraphs')
    sentences = document.getElementById('sentences')
    words = document.getElementById('words')
    characters = document.getElementById('characters')
    all = document.getElementById('all')

    area = document.getElementsByTagName('textarea')[0]
  })

  beforeEach(function () {
    area.value = ''
  })

  describe('Countable.on', function () {
    it('should enable live counting', function () {
      Countable.on(area, callback)
      expect(Countable.enabled(area)).to.equal(true)
    })

    it('should count initially', function () {
      check([ '0', '0', '0', '0', '0' ])
    })

    it('should update counts', function () {
      area.value = 'Hello world'
      triggerInput()
      check([ '1', '1', '2', '10', '11' ])
    })

    it('should disable live counting', function () {
      Countable.off(area)
      expect(Countable.enabled(area)).to.equal(false)
    })
  })

  describe('Countable.count', function () {
    it('should not enable live counting', function () {
      Countable.count(area, callback)
      expect(Countable.enabled(area)).to.equal(false)
    })

    it('should count initially', function () {
      check([ '0', '0', '0', '0', '0' ])
    })

    it('should not update counts', function () {
      area.value = 'Hello world'
      triggerInput()
      check([ '0', '0', '0', '0', '0' ])
    })

		it('should work on strings', function () {
			Countable.count('Hello world', callback)
			check([ '1', '1', '2', '10', '11' ])
		})
  })

  describe('Options', function () {
    beforeEach(function () {
      area.value = ''
    })

    it('should strip HTML tags', function () {
      area.value = '<div>Hello <a href="http://google.com">world</a></div>'
      Countable.count(area, callback, { stripTags: true })
      check([ '1', '1', '2', '10', '11' ])
    })

    it('should use hard returns', function () {
      area.value = 'Hello\n\nworld'
      Countable.count(area, callback, { hardReturns: true })
      check([ '2', '1', '2', '10', '12' ])
    })

    it('should ignore given characters', function () {
      area.value = 'Hello\nworld'
      Countable.count(area, callback, { ignore: [ '\n', 'w', 'D' ] })
      check([ '1', '1', '1', '9', '9' ])
    })
  })
})
