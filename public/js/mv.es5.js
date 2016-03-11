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

// intro!
animateStripes();

dynamics.css(logo, {
  scale: 1
});
dynamics.animate(logo, {
  scale: 0.95
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
  dynamics.css(logoContainer, {
    scale: 1,
    translateX: Math.random() * windowWidth - windowWidth / 2,
    translateY: Math.random() * windowHeight - windowHeight / 2
  });
}, 1300);

dynamics.setTimeout(function () {
  dynamics.css(logoContainer, {
    scale: 0.75
  });
}, 1350);

dynamics.setTimeout(function () {
  introEl.style.backgroundColor = 'transparent';
  logo.style.display = 'none';
}, 1400);
