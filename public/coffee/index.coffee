setTimeout ->
  speed = 1

  logoEl = document.querySelector('#logo')
  m = dynamic(document.querySelector('g .m'))
  v = dynamic(document.querySelector('g .v'))
  square = dynamic(document.querySelector('g .square'))
  maskMTop = dynamic(document.querySelector('#logo #mask-m .top'))
  maskMBottom = dynamic(document.querySelector('#logo #mask-m .bottom'))
  maskVBottom = dynamic(document.querySelector('#logo #mask-v .bottom'))
  maskTopTop = dynamic(document.querySelector('#logo #mask-top .top'))
  maskBottomBottom = dynamic(document.querySelector('#logo #mask-bottom .bottom'))

  animating = false

  # Logo animation
  init = ->
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

  init()
, 1
