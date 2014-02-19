var expect = chai.expect

describe('Countable', function () {
  var results = {},
      liveArea, onceArea, optionsArea

  function callback (counter) {
    results.paragraphs.innerHTML = counter.paragraphs
    results.words.innerHTML = counter.words
    results.characters.innerHTML = counter.characters
    results.all.innerHTML = counter.all
  }

  function triggerInput (element) {
    var event
    event = document.createEvent('HTMLEvents')
    event.initEvent('input', true, true)
    event.eventName = 'input'
    element.dispatchEvent(event)
  }

  before(function () {
    document.body.innerHTML = '<ul>' +
                                '<li id="paragraphs"></li>' +
                                '<li id="words"></li>' +
                                '<li id="characters"></li>' +
                                '<li id="all"></li>' +
                              '</ul>' +
                              '<textarea id="live"></textarea>' +
                              '<textarea id="once"></textarea>' +
                              '<textarea id="options"></textarea>'

    results.paragraphs = document.getElementById('paragraphs')
    results.words = document.getElementById('words')
    results.characters = document.getElementById('characters')
    results.all = document.getElementById('all')

    liveArea = document.getElementById('live')
    onceArea = document.getElementById('once')
    optionsArea = document.getElementById('options')
  })

  describe('Countable.live', function () {
    it('should enable live counting', function () {
      Countable.live(liveArea, callback)
      expect(Countable.enabled(liveArea)).to.equal(true)
    })

    it('should count initially', function () {
      expect(results.paragraphs.innerHTML).to.equal('0')
      expect(results.words.innerHTML).to.equal('0')
      expect(results.characters.innerHTML).to.equal('0')
      expect(results.all.innerHTML).to.equal('0')
    })

    it('should update counts', function () {
      liveArea.value += 'Hello world'

      triggerInput(liveArea)

      expect(results.paragraphs.innerHTML).to.equal('1')
      expect(results.words.innerHTML).to.equal('2')
      expect(results.characters.innerHTML).to.equal('10')
      expect(results.all.innerHTML).to.equal('11')
    })
  })

  describe('Countable.once', function () {
    it('should not enable live counting', function () {
      Countable.once(onceArea, callback)
      expect(Countable.enabled(onceArea)).to.equal(false)
    })

    it('should count initially', function () {
      expect(results.paragraphs.innerHTML).to.equal('0')
      expect(results.words.innerHTML).to.equal('0')
      expect(results.characters.innerHTML).to.equal('0')
      expect(results.all.innerHTML).to.equal('0')
    })

    it('should not update counts', function () {
      onceArea.value += 'Hello world'

      triggerInput(onceArea)

      expect(results.paragraphs.innerHTML).to.equal('0')
      expect(results.words.innerHTML).to.equal('0')
      expect(results.characters.innerHTML).to.equal('0')
      expect(results.all.innerHTML).to.equal('0')
    })
  })

  describe('Countable.die', function () {
    it('should kill live counting functionality', function () {
      Countable.die(liveArea)
      expect(Countable.enabled(liveArea)).to.equal(false)
    })
  })

  describe('Options', function () {
    afterEach(function () {
      optionsArea.value = ''
    })

    it('should strip HTML tags', function () {
      optionsArea.value = '<div>Hello <a href="http://google.com">world</a></div>'

      Countable.once(optionsArea, callback, { stripTags: true })

      expect(results.paragraphs.innerHTML).to.equal('1')
      expect(results.words.innerHTML).to.equal('2')
      expect(results.characters.innerHTML).to.equal('10')
      expect(results.all.innerHTML).to.equal('11')
    })

    it('should use hard returns', function () {
      optionsArea.value = 'Hello\n\nworld'

      Countable.once(optionsArea, callback, { hardReturns: true })

      expect(results.paragraphs.innerHTML).to.equal('2')
      expect(results.words.innerHTML).to.equal('2')
      expect(results.characters.innerHTML).to.equal('10')
      expect(results.all.innerHTML).to.equal('12')
    })

    it('should ignore returns', function () {
      optionsArea.value = 'Hello\nworld'

      Countable.once(optionsArea, callback, { ignoreReturns: true })

      expect(results.paragraphs.innerHTML).to.equal('2')
      expect(results.words.innerHTML).to.equal('2')
      expect(results.characters.innerHTML).to.equal('10')
      expect(results.all.innerHTML).to.equal('10')
    })
  })
})