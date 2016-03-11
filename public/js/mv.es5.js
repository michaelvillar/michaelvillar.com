"use strict";

function createEl(template) {
  var el = document.createElement('div');
  el.innerHTML = template.trim();
  return el.firstChild;
}

function createSvgEl(template) {
  var el = createEl('\n    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + template.trim() + '</svg>\n  ');
  return el.firstChild;
}

function createLine(options) {
  var el = createSvgEl('\n    <rect x="' + options.x + '" y="' + options.y + '" width="' + options.width + '" height="' + options.height + '" fill="' + options.color + '">\n  ');
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

var contentEls = document.querySelectorAll('#logo, header > h1, header > p, #contact > *, section h2, section ul li, section > a');
function hideContent() {
  for (var i = 0; i < contentEls.length; i++) {
    var el = contentEls[i];
    el.style.visibility = 'hidden';
  }
}

function showContent() {
  var _loop2 = function _loop2(i) {
    var el = contentEls[i];
    var d = 100 + i * 10 + Math.random() * 200;
    var transform = {
      translateX: Math.random() * 10 - 5,
      translateY: Math.random() * 2 - 1
    };
    dynamics.css(el, transform);
    dynamics.setTimeout(function () {
      dynamics.css(el, {
        visibility: 'visible'
      });
    }, d);
    dynamics.setTimeout(function () {
      dynamics.css(el, {
        translateX: transform.translateX / -5,
        translateY: transform.translateY / -2.5
      });
    }, d + 100);
    dynamics.setTimeout(function () {
      dynamics.css(el, {
        translateX: 0,
        translateY: 0
      });
    }, d + 150);
  };

  for (var i = 0; i < contentEls.length; i++) {
    _loop2(i);
  }
}

// intro!
hideContent();
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
