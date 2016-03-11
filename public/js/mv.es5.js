"use strict";

function createEl(template) {
  var el = document.createElement('div');
  el.innerHTML = template.trim();
  return el.firstChild;
}

function createSvgEl(template) {
  var el = createEl('\n    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + template.trim() + '</svg>\n  ');
  return el;
}

function createSvgChildEl(template) {
  return createSvgEl(template).firstChild;
}

function createLine(options) {
  var el = createSvgChildEl('\n    <rect x="' + options.x + '" y="' + options.y + '" width="' + options.width + '" height="' + options.height + '" fill="' + options.color + '">\n  ');
  return el;
}

var introEl = document.querySelector('#intro');
var stripesEl = document.querySelector('#stripes');
var logoContainer = document.querySelector('#logo-container');
var logo = logoContainer.querySelector('svg');
var windowWidth = document.body.clientWidth;
var windowHeight = document.body.clientHeight;

// animate stripes
function animateStripes() {
  var delayEnd = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

  var stripes = [];

  var _loop = function _loop(i) {
    (function () {
      var color = undefined;
      if (i < 200) {
        color = tinycolor('#101214');
      } else {
        color = tinycolor('hsl(' + Math.round(Math.random() * 360) + ', 80%, 65%)');
      }
      var width = Math.round(windowWidth / 10 + Math.random() * windowWidth / 10) * (i < 200 ? 3 : 1);
      var options = {
        x: Math.round((windowWidth + width) * Math.random() - width),
        y: Math.round(windowHeight * Math.random()),
        width: width,
        height: Math.round(Math.random() * 10 + 10) * (i < 200 ? 3 : 1),
        color: color.toRgbString()
      };
      var lineEl = createLine(options);
      lineEl.style.display = 'none';
      stripesEl.appendChild(lineEl);

      var delay = undefined;
      if (i < 200) {
        if (delayEnd) {
          delay = i * 2;
        } else {
          delay = 0;
        }
        lineEl.setAttribute('data-black', true);
      } else {
        delay = Math.random() * 300;
        if (delayEnd) {
          delay += (i - 200) * 3;
        }
      }

      dynamics.setTimeout(function () {
        lineEl.style.display = 'block';

        var d = Math.random() * 20;
        if (i < 200 && !delayEnd) {
          d += i * 2;
        }
        dynamics.setTimeout(function () {
          options.x += Math.random() * 100 - 50;
          options.y += Math.random() * 20 - 10;
          lineEl.setAttribute('x', options.x);
          lineEl.setAttribute('y', options.y);

          if (delayEnd && i < 200) {
            lineEl.setAttribute('width', options.width / 2);
            lineEl.setAttribute('height', options.height / 5);
          } else {
            lineEl.setAttribute('height', options.height / 2);
          }

          var d = 100;
          if (delayEnd && i < 200) {
            d += i;
          }
          dynamics.setTimeout(function () {
            stripesEl.removeChild(lineEl);
          }, d);
        }, d);
      }, delay);

      stripes.push(lineEl);
    })();
  };

  for (var i = 0; i < 300; i++) {
    _loop(i);
  }
  return stripes;
}

var totalMaskIdx = 0;
function createMasksWithStripes(width, height) {
  var masks = [[], [], [], [], [], [], [], [], [], []];
  var maskNames = [];
  for (var i = totalMaskIdx; i < totalMaskIdx + masks.length; i++) {
    maskNames.push('clipPath' + i);
  }
  totalMaskIdx += masks.length;
  var maskIdx = 0;
  var x = 0;
  var y = 0;
  var stripeHeight = 10;

  while (true) {
    var w = Math.max(stripeHeight * 10, Math.round(Math.random() * width));
    masks[maskIdx].push('\n      <rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + stripeHeight + '" style="fill:white;"></rect>\n    ');

    maskIdx += 1;
    if (maskIdx >= masks.length) {
      maskIdx = 0;
    }

    x += w;
    if (x > width) {
      x = 0;
      y += stripeHeight;
      stripeHeight = Math.round(Math.random() * 10 + 5);
    }
    if (y >= height) {
      break;
    }
  }

  var str = masks.map(function (rects, i) {
    return '<clipPath id="' + maskNames[i] + '">\n      ' + rects.join('') + '\n    </clipPath>';
  }).join('');

  var maskEl = createSvgEl('<defs>' + str + '</defs>');

  document.body.appendChild(maskEl);

  return maskNames;
}

function cloneAndStripeElement(element, clipPathName) {
  var el = element.cloneNode(true);
  var box = element.getBoundingClientRect();

  dynamics.css(el, {
    position: 'absolute',
    left: box.left,
    top: box.top,
    display: 'none'
  });
  document.body.appendChild(el);
  el.style['-webkit-clip-path'] = 'url(#' + clipPathName + ')';
  el.style['clip-path'] = 'url(#' + clipPathName + ')';
  return el;
}

var contentEls = [];
var originalContentEls = document.querySelectorAll('#header-content, #content');
var coloredElements = [];
(function () {
  var els = originalContentEls;
  for (var j = 0; j < els.length; j++) {
    var el = els[j];
    var box = el.getBoundingClientRect();
    var masks = createMasksWithStripes(box.width, box.height);
    for (var i = 0; i < masks.length; i++) {
      var clonedEl = cloneAndStripeElement(el, masks[i]);
      contentEls.push(clonedEl);
      if (i % 2 === 0) {
        var childrenEls = clonedEl.querySelectorAll('*');
        for (var k = 0; k < childrenEls.length; k++) {
          var color = tinycolor('hsl(' + Math.round(Math.random() * 360) + ', 80%, 65%)');
          var rgb = color.toRgbString();
          dynamics.css(childrenEls[k], {
            color: rgb,
            fill: rgb
          });
          coloredElements.push(childrenEls[k]);
        }
      }
    }
    el.style.visibility = 'hidden';
  }
})();

function showContent() {
  var maxDelay = 0;

  var _loop2 = function _loop2(i) {
    var el = contentEls[i];
    var d = 100 + Math.round(Math.random() * contentEls.length) * 50;
    var transform = {
      translateX: Math.random() * 40 - 20
    };
    dynamics.css(el, transform);
    dynamics.setTimeout(function () {
      dynamics.css(el, {
        display: ''
      });
    }, d);
    dynamics.setTimeout(function () {
      dynamics.css(el, {
        translateX: transform.translateX / -5
      });
    }, d + 100);
    dynamics.setTimeout(function () {
      dynamics.css(el, {
        translateX: 0,
        translateY: 0
      });
    }, d + 150);
    if (Math.round(Math.random() * 5) === 0) {
      dynamics.setTimeout(function () {
        dynamics.css(el, {
          translateX: transform.translateX / -2
        });
      }, d + 300);
      dynamics.setTimeout(function () {
        dynamics.css(el, {
          translateX: 0
        });
      }, d + 350);
    }
    maxDelay = Math.max(maxDelay, d + 350);
  };

  for (var i = 0; i < contentEls.length; i++) {
    _loop2(i);
  }

  var _loop3 = function _loop3(_i) {
    var d = 400 + Math.random() * 1000;
    dynamics.setTimeout(function () {
      dynamics.css(coloredElements[_i], {
        color: '',
        fill: ''
      });
    }, d);
    maxDelay = Math.max(maxDelay, d);
  };

  for (var _i = 0; _i < coloredElements.length; _i++) {
    _loop3(_i);
  }
  dynamics.setTimeout(function () {
    for (var _i2 = 0; _i2 < contentEls.length; _i2++) {
      document.body.removeChild(contentEls[_i2]);
    }
    for (var _i3 = 0; _i3 < originalContentEls.length; _i3++) {
      originalContentEls[_i3].style.visibility = 'visible';
    }
  }, maxDelay);
}

// intro!
animateStripes();

dynamics.css(logo, {
  scale: 1
});
dynamics.animate(logo, {
  scale: 0.90
}, {
  duration: 1500,
  type: dynamics.easeOut
});

function animateLogo() {
  dynamics.css(logoContainer, {
    scale: 0.5,
    translateX: Math.random() * 100 - 50
  });

  dynamics.setTimeout(function () {
    dynamics.css(logoContainer, {
      translateX: 10,
      scale: 0.55
    });
  }, 100);

  dynamics.setTimeout(function () {
    dynamics.css(logoContainer, {
      translateX: 0,
      scale: 0.5
    });
  }, 150);
};

animateLogo();

dynamics.setTimeout(function () {
  introEl.style.display = 'block';
}, 1);

dynamics.setTimeout(function () {
  animateLogo();
  animateStripes(true);
}, 1000);

dynamics.setTimeout(function () {
  introEl.style.backgroundColor = 'transparent';
  dynamics.css(logoContainer, {
    scale: 1,
    translateX: Math.random() * windowWidth - windowWidth / 2,
    translateY: Math.random() * windowHeight - windowHeight / 2
  });
  showContent();
}, 1300);

dynamics.setTimeout(function () {
  dynamics.css(logoContainer, {
    scale: 0.75
  });
}, 1350);

dynamics.setTimeout(function () {
  logo.style.display = 'none';
}, 1400);
