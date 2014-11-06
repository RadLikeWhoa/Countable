var expect = chai.expect

describe('Countable', function () {
  var paragraphs, words, characters, all,
      areaContainer, area

  function callback (counter) {
    paragraphs.innerHTML = counter.paragraphs
    words.innerHTML = counter.words
    characters.innerHTML = counter.characters
    all.innerHTML = counter.all
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
                                '<li id="words"></li>' +
                                '<li id="characters"></li>' +
                                '<li id="all"></li>' +
                              '</ul>' +
                              '<textarea id="area"></textarea>'

    paragraphs = document.getElementById('paragraphs')
    words = document.getElementById('words')
    characters = document.getElementById('characters')
    all = document.getElementById('all')

    area = document.getElementById('area')
  })

  beforeEach(function () {
    area.value = ''
  })

  describe('Countable.live', function () {
    it('should enable live counting', function () {
      Countable.live(area, callback)
      expect(Countable.enabled(area)).to.equal(true)
    })

    it('should count initially', function () {
      expect(paragraphs.innerHTML).to.equal('0')
      expect(words.innerHTML).to.equal('0')
      expect(characters.innerHTML).to.equal('0')
      expect(all.innerHTML).to.equal('0')
    })

    it('should update counts', function () {
      area.value = 'Hello world'

      triggerInput()

      expect(paragraphs.innerHTML).to.equal('1')
      expect(words.innerHTML).to.equal('2')
      expect(characters.innerHTML).to.equal('10')
      expect(all.innerHTML).to.equal('11')
    })

    it('should kill live counting', function () {
      Countable.die(area)
      expect(Countable.enabled(area)).to.equal(false)
    })
  })

  describe('Countable.once', function () {
    it('should not enable live counting', function () {
      Countable.once(area, callback)
      expect(Countable.enabled(area)).to.equal(false)
    })

    it('should count initially', function () {
      expect(paragraphs.innerHTML).to.equal('0')
      expect(words.innerHTML).to.equal('0')
      expect(characters.innerHTML).to.equal('0')
      expect(all.innerHTML).to.equal('0')
    })

    it('should not update counts', function () {
      area.value = 'Hello world'

      triggerInput()

      expect(paragraphs.innerHTML).to.equal('0')
      expect(words.innerHTML).to.equal('0')
      expect(characters.innerHTML).to.equal('0')
      expect(all.innerHTML).to.equal('0')
    })

    it('should be aliased as count', function () {
      area.value = 'Hello world'

      Countable.count(area, callback)

      expect(paragraphs.innerHTML).to.equal('1')
      expect(words.innerHTML).to.equal('2')
      expect(characters.innerHTML).to.equal('10')
      expect(all.innerHTML).to.equal('11')
    })
  })

  describe('Options', function () {
    beforeEach(function () {
      area.value = ''
    })

    it('should strip HTML tags', function () {
      area.value = '<div>Hello <a href="http://google.com">world</a></div>'

      Countable.once(area, callback, { stripTags: true })

      expect(paragraphs.innerHTML).to.equal('1')
      expect(words.innerHTML).to.equal('2')
      expect(characters.innerHTML).to.equal('10')
      expect(all.innerHTML).to.equal('11')
    })

    it('should use hard returns', function () {
      area.value = 'Hello\n\nworld'

      Countable.once(area, callback, { hardReturns: true })

      expect(paragraphs.innerHTML).to.equal('2')
      expect(words.innerHTML).to.equal('2')
      expect(characters.innerHTML).to.equal('10')
      expect(all.innerHTML).to.equal('12')
    })

    it('should ignore returns', function () {
      area.value = 'Hello\nworld'

      Countable.once(area, callback, { ignoreReturns: true })

      expect(paragraphs.innerHTML).to.equal('2')
      expect(words.innerHTML).to.equal('2')
      expect(characters.innerHTML).to.equal('10')
      expect(all.innerHTML).to.equal('10')
    })

    it('should not ignore zero-width characters', function () {
      area.value = '\u200B\u200B\u200B\u200B\u200B'

      Countable.once(area, callback, { ignoreZeroWidth: false })

      expect(paragraphs.innerHTML).to.equal('1')
      expect(words.innerHTML).to.equal('1')
      expect(characters.innerHTML).to.equal('5')
      expect(all.innerHTML).to.equal('5')
    })
  })
})