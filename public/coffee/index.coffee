setTimeout ->
  speed = 1

  page = document.querySelector('#page')
  logoEl = document.querySelector('#logo')
  m = dynamic(document.querySelector('g .m'))
  v = dynamic(document.querySelector('g .v'))
  square = dynamic(document.querySelector('g .square'))
  maskMTop = dynamic(document.querySelector('#logo #mask-m .top'))
  maskMBottom = dynamic(document.querySelector('#logo #mask-m .bottom'))
  maskVBottom = dynamic(document.querySelector('#logo #mask-v .bottom'))
  maskTopTop = dynamic(document.querySelector('#logo #mask-top .top'))
  maskBottomBottom = dynamic(document.querySelector('#logo #mask-bottom .bottom'))

  support = !/Firefox\//.test(window.navigator.userAgent)
  animating = false

  # Logo animation
  animateLogo = ->
    if !support
      for el in document.querySelectorAll('#logo g')
        el.removeAttribute('mask')
      return

    animating = true

    m.css(translateY: 0, scale: 0.5)
    v.css(translateY: 40, scale: 0.5)

    anim = {
      type: dynamic.EaseInOut,
      friction: 80,
      duration: 900 * speed
    }
    m.to({
      translateY: 0,
      scale: 1
    }, anim).start()
    maskMTop.to({
      translateY: -23
    }, anim).start()
    maskMBottom.to({
      translateY: 23
    }, anim).start()

    maskVBottom.delay(160 * speed).to({
      translateY: -46
    }, anim).start()

    v.delay(160 * speed).to({
      translateY: 0,
      scale: 1
    }, anim).start()

    maskTopTop.delay(400 * speed).to({
      translateY: -46
    }, anim).start()

    maskBottomBottom.delay(400 * speed).to({
      translateY: 46
    }, anim).start()

    setTimeout ->
      animating = false
    , (400 + 900) * speed

  intro = ->
    animateLogo()

    if !support
      delay = 0
    else
      delay = 900 * speed

    setTimeout ->
      # For mobile
      document.querySelector('header').classList.add('visible')
    , delay

    selector = 'header h1, header p, header #contact'
    headerEls = Array.prototype.map.call(document.querySelectorAll(selector), (el) -> dynamic(el))
    for el in headerEls
      el.css(opacity: 0, translateY: -10)
      el.delay(delay).to({
        opacity: 1,
        translateY: 0
      }, {
        type: dynamic.Spring,
        duration: 800 * speed,
        friction: 300,
        frequency: 7
      }).start()
      delay += 50

    selector = '#content section'
    contentEls = Array.prototype.map.call(document.querySelectorAll(selector), (el) -> dynamic(el))
    for el in contentEls
      el.css(opacity: 0, translateX: -50)
      el.delay(delay).to({
        opacity: 1,
        translateX: 0
      }, {
        type: dynamic.Spring,
        duration: 800 * speed,
        friction: 300,
        frequency: 7
      }).start()
      delay += 50

    page.style.visibility = 'visible'

  # Interactions
  explode = ->
    return if animating
    spring = {
      type: dynamic.Spring,
      duration: 800,
      friction: 300,
      frequency: 7
    }

    for el in [maskTopTop, maskBottomBottom]
      el.to({
        translateY: 0
      }, {
        type: dynamic.EaseInOut,
        friction: 80,
        duration: 600
      }).start()

    m.to({
      translateY: 22,
      translateX: -40,
      scale: 1.2
    }, spring).start()
    v.to({
      translateY: -22,
      translateX: 59,
      scale: 1.2
    }, spring).start()

  collapse = ->
    return if animating
    easeInOut = {
      type: dynamic.EaseInOut,
      friction: 80,
      duration: 600
    }

    for k, el of { "-46": maskTopTop, "46": maskBottomBottom }
      el.delay(100).to({
        translateY: parseInt(k)
      }, easeInOut).start()

    for el in [m, v]
      el.to({
        translateY: 0,
        translateX: 0,
        scale: 1,
      }, easeInOut).start()

  # Event handling
  logoEl.addEventListener 'mouseover', ->
    explode()
  logoEl.addEventListener 'mouseout', ->
    collapse()

  intro()
, 1
