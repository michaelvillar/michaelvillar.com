"use strict";

function createEl(template) {
  let el = document.createElement('div');
  el.innerHTML = template.trim();
  return el.firstChild;
}

function createSvgEl(template) {
  let el = createEl(`
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${template.trim()}</svg>
  `);
  return el.firstChild;
}

function createLine(options) {
  let el = createSvgEl(`
    <rect x="${options.x}" y="${options.y}" width="${options.width}" height="${options.height}" fill="${options.color}">
  `);
  return el;
}

let backgroundEl = document.querySelector('#stripes');
let windowWidth = document.body.clientWidth;
let windowHeight = document.body.clientHeight;

// animate strips
function animateStrips(delayEnd=false) {
  let stripes = [];
  for (let i = 0; i < 300; i++) {
    (function() {
      let color;
      if (i < 200) {
        color = tinycolor('#101214');
      } else {
        color = tinycolor(`hsl(${Math.round(Math.random() * 360)}, 80%, 65%)`);
      }
      let width = Math.round(windowWidth / 10 + Math.random() * windowWidth / 10) * (i < 200 ? 3 : 1);
      let options = {
        x: Math.round((windowWidth + width) * Math.random() - width),
        y: Math.round(windowHeight * Math.random()),
        width: width,
        height: Math.round(Math.random() * 10 + 10) * (i < 200 ? 3 : 1),
        color: color.toRgbString(),
      };
      let lineEl = createLine(options);
      lineEl.style.display = 'none';
      backgroundEl.appendChild(lineEl);

      let delay;
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

      dynamics.setTimeout(function() {
        lineEl.style.display = 'block';

        let d = Math.random() * 20
        if (i < 200 && !delayEnd) {
          d += i * 2;
        }
        dynamics.setTimeout(function() {
          options.x += Math.random() * 100 - 50;
          options.y += Math.random() * 20 - 10;
          lineEl.setAttribute('x', options.x);
          lineEl.setAttribute('y', options.y);

          if(delayEnd && i < 200) {
            lineEl.setAttribute('width', options.width / 2);
            lineEl.setAttribute('height', options.height / 5);
          } else {
            lineEl.setAttribute('height', options.height / 2);
          }

          let d = 100;
          if(delayEnd && i < 200) {
            d += i;
          }
          dynamics.setTimeout(function() {
            backgroundEl.removeChild(lineEl);
          }, d);
        }, d);
      }, delay);

      stripes.push(lineEl);
    })();
  }
  return stripes;
}

animateStrips();

// animate logo
let logo = document.querySelector('#logo-container svg');
dynamics.css(logo, {
  scale: 1,
})
dynamics.animate(logo, {
  scale: 0.95,
}, {
  duration: 1500,
  type: dynamics.easeOut,
});

let logoContainer = document.querySelector('#logo-container');
function animateLogo() {
  dynamics.css(logoContainer, {
    scale: 0.5,
    translateX: Math.random() * 100 - 50,
  });

  dynamics.setTimeout(function() {
    dynamics.css(logoContainer, {
      translateX: 10,
      scale: 0.55,
    });
  }, 100);

  dynamics.setTimeout(function() {
    dynamics.css(logoContainer, {
      translateX: 0,
      scale: 0.5,
    });
  }, 150);
};

animateLogo();

dynamics.setTimeout(function() {
  document.querySelector('#intro').style.display = 'block';
}, 1);

dynamics.setTimeout(function() {
  animateLogo();
  let stripes = animateStrips(true);

  dynamics.setTimeout(function() {
    dynamics.css(logoContainer, {
      scale: 1,
      translateX: Math.random() * windowWidth - windowWidth / 2,
      translateY: Math.random() * windowHeight - windowHeight / 2,
    });
  }, 300);

  dynamics.setTimeout(function() {
    dynamics.css(logoContainer, {
      scale: 0.75,
    });
  }, 350);

  dynamics.setTimeout(function() {
    document.querySelector('#intro').style.backgroundColor = 'transparent';
    logo.style.display = 'none';
  }, 400);
}, 1000);
