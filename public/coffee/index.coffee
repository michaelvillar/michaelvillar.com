setTimeout ->
  # Logo animation
  speed = 1

  m = dynamic(document.querySelector('g .m'))
  v = dynamic(document.querySelector('g .v'))

  m.css(translateY: 0, scale: 0.5)
  v.css(translateY: 40, scale: 0.5)

  maskMTop = dynamic(document.querySelector('#logo #mask-m .top'))
  maskMBottom = dynamic(document.querySelector('#logo #mask-m .bottom'))

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

  maskVBottom = dynamic(document.querySelector('#logo #mask-v .bottom'))

  maskVBottom.delay(160 * speed).to({
    translateY: -46
  }, anim).start()

  v.delay(160 * speed).to({
    translateY: 0,
    scale: 1
  }, anim).start()

  maskTopTop = dynamic(document.querySelector('#logo #mask-top .top'))

  maskTopTop.delay(400 * speed).to({
    translateY: -46
  }, anim).start()

  maskBottomBottom = dynamic(document.querySelector('#logo #mask-bottom .bottom'))

  maskBottomBottom.delay(400 * speed).to({
    translateY: 46
  }, anim).start()
, 1
