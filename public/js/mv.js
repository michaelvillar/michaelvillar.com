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
  return el;
}

function createSvgChildEl(template) {
  return createSvgEl(template).firstChild;
}

function createLine(options) {
  let el = createSvgChildEl(`
    <rect x="${options.x}" y="${options.y}" width="${options.width}" height="${options.height}" fill="${options.color}">
  `);
  return el;
}

let introEl = document.querySelector('#intro');
let stripesEl = document.querySelector('#stripes');
let logoContainer = document.querySelector('#logo-container');
let logo = logoContainer.querySelector('svg');
let windowWidth = document.body.clientWidth;
let windowHeight = document.body.clientHeight;

// animate stripes
function animateStripes(delayEnd=false) {
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
      stripesEl.appendChild(lineEl);

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
        if (delayEnd) {
          delay += (i - 200) * 3;
        }
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
            stripesEl.removeChild(lineEl);
          }, d);
        }, d);
      }, delay);

      stripes.push(lineEl);
    })();
  }
  return stripes;
}

let totalMaskIdx = 0;
function createMasksWithStripes(width, height) {
  let masks = [[],[],[],[],[],[],[],[],[],[]];
  let maskNames = [];
  for (let i = totalMaskIdx; i < totalMaskIdx + masks.length; i++) {
    maskNames.push(`clipPath${i}`);
  }
  totalMaskIdx += masks.length;
  let maskIdx = 0;
  let x = 0;
  let y = 0;
  let stripeHeight = 8;

  while(true) {
    let w = Math.round(Math.random() * width);
    masks[maskIdx].push(`
      <rect x="${x}" y="${y}" width="${w}" height="${stripeHeight}" style="fill:white;"></rect>
    `);

    maskIdx += 1;
    if (maskIdx >= masks.length) {
      maskIdx = 0;
    }

    x += w;
    if (x > width) {
      x = 0;
      y += stripeHeight;
    }
    if (y >= height) {
      break;
    }
  }

  let str = masks.map(function(rects, i) {
    return `<clipPath id="${maskNames[i]}">
      ${rects.join('')}
    </clipPath>`;
  }).join('');

  let maskEl = createSvgEl(`<defs>${str}</defs>`);

  document.body.appendChild(maskEl);

  return maskNames;
}

function cloneAndStripeElement(element, clipPathName) {
  let el = element.cloneNode(true);
  let box = element.getBoundingClientRect();

  dynamics.css(el, {
    position: 'absolute',
    left: box.left,
    top: box.top,
    display: 'none',
  });
  document.body.appendChild(el);
  el.style['-webkit-clip-path'] = `url(#${clipPathName})`;
  el.style['clip-path'] = `url(#${clipPathName})`;
  return el;
}

let contentEls = [];
let originalContentEls = document.querySelectorAll('#header-content, #content');
(function() {
  let els = originalContentEls;
  for (let j = 0; j < els.length; j++) {
    let el = els[j];
    let box = el.getBoundingClientRect();
    let masks = createMasksWithStripes(box.width, box.height);
    for (let i = 0; i < masks.length; i++) {
      contentEls.push(cloneAndStripeElement(el, masks[i]));
    }
    el.style.visibility = 'hidden';
  }
})();

function showContent() {
  let maxDelay = 0;
  for (let i = 0; i < contentEls.length; i++) {
    let el = contentEls[i];
    let d = 100 + Math.round(Math.random() * contentEls.length) * 50;
    let transform = {
      translateX: Math.random() * 40 - 20,
    };
    dynamics.css(el, transform);
    dynamics.setTimeout(function() {
      dynamics.css(el, {
        display: '',
      });
    }, d);
    dynamics.setTimeout(function() {
      dynamics.css(el, {
        translateX: transform.translateX / -5,
      });
    }, d + 100);
    dynamics.setTimeout(function() {
      dynamics.css(el, {
        translateX: 0,
        translateY: 0,
      });
    }, d + 150);
    if (Math.round(Math.random() * 5) === 0) {
      dynamics.setTimeout(function() {
        dynamics.css(el, {
          translateX: transform.translateX / -2,
        });
      }, d + 300);
      dynamics.setTimeout(function() {
        dynamics.css(el, {
          translateX: 0,
        });
      }, d + 350);
    }
    maxDelay = Math.max(maxDelay, d + 350);
  }
  dynamics.setTimeout(function() {
    for (let i = 0; i < contentEls.length; i++) {
      document.body.removeChild(contentEls[i]);
    }
    for (let i = 0; i < originalContentEls.length; i++) {
      originalContentEls[i].style.visibility = 'visible';
    }
  }, maxDelay);
}

// intro!
animateStripes();

dynamics.css(logo, {
  scale: 1,
})
dynamics.animate(logo, {
  scale: 0.90,
}, {
  duration: 1500,
  type: dynamics.easeOut,
});

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
  introEl.style.display = 'block';
}, 1);

dynamics.setTimeout(function() {
  animateLogo();
  animateStripes(true);
}, 1000);

dynamics.setTimeout(function() {
  introEl.style.backgroundColor = 'transparent';
  dynamics.css(logoContainer, {
    scale: 1,
    translateX: Math.random() * windowWidth - windowWidth / 2,
    translateY: Math.random() * windowHeight - windowHeight / 2,
  });
  showContent();
}, 1300);

dynamics.setTimeout(function() {
  dynamics.css(logoContainer, {
    scale: 0.75,
  });
}, 1350);

dynamics.setTimeout(function() {
  logo.style.display = 'none';
}, 1400);
