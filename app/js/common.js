(function () {
  // Custom JS

  // forEach polyfill for IE
  if ('NodeList' in window && !NodeList.prototype.forEach) {
    console.info('polyfill for IE11');
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  window.addEventListener('load', function () {
    // ----------------------------------------------
    //		common functions
    // ----------------------------------------------
    function getEl(className) {
      return document.querySelector(className);
    }

    function getAllEl(className) {
      return document.querySelectorAll(className);
    }

    function createEl(type) {
      return document.createElement(type);
    }

    // ----------------------------------------------
    //		humburger menu
    // ----------------------------------------------
    function toggleMenu() {
      const toggleLine = getEl('.toggle-menu__line');
      const mainMenu = getEl('.main-menu');

      toggleLine.classList.toggle('toggle-menu__line_active');
      mainMenu.classList.toggle('main-menu_active');
    }

    const toggleBtn = getEl('.toggle-menu');
    toggleBtn.onclick = () => toggleMenu();

    // ----------------------------------------------
    //		header slider
    //    https://github.com/ganlanyuan/tiny-slider
    // ----------------------------------------------
    const slider = tns({
      container: '.header-slider',
      viewportMax: 500,
      items: 3,
      slideBy: 'page',
      speed: 400,
      mouseDrag: true,
      nav: false,
      controlsContainer: '.header-controls-btns',
      prevButton: '.header-controls-btns__prev',
      nextButton: '.header-controls-btns__next',
      responsive: {
        768: {
          controls: true,
          items: 3,
        },
        480: {
          items: 2,
        },
        320: {
          controls: false,
          gutter: 110,
          items: 1,
        },
        0: {
          items: 1,
        },
      },
    });

    // ----------------------------------------------
    //		section pricing slider
    // ----------------------------------------------
    // add nav dots
    function addNavDots(itemClass, containerClass) {
      const count = getAllEl(itemClass).length;
      const container = getEl(containerClass);

      for (let i = 0; i < count; i++) {
        let dot = createEl('div');
        dot.className = `${containerClass.slice(1)}__dot`;
        container.appendChild(dot);
      }
    }

    addNavDots('.pricing-slider__item', '.pricing-nav-container');

    // add slider
    const pricingSlider = tns({
      container: '.pricing-slider',
      items: 1,
      slideBy: 'page',
      speed: 400,
      mouseDrag: true,
      controls: true,
      nav: true,
      navPosition: 'bottom',
      navContainer: '.pricing-nav-container',
      controlsContainer: '.pricing-controls-btns',
      prevButton: '.pricing-controls-btns__prev',
      nextButton: '.pricing-controls-btns__next',
    });

    // ----------------------------------------------
    //		section review slider
    // ----------------------------------------------
    // add nav dots
    addNavDots('.review-slider__item', '.review-nav-container');

    // add slider
    const reviewSlider = tns({
      container: '.review-slider',
      items: 1,
      slideBy: 1,
      loop: false,
      // autoHeight: true,
      speed: 400,
      touch: false,
      controls: false,
      nav: true,
      navPosition: 'bottom',
      navContainer: '.review-nav-container',
    });

    // events on icon click
    function swapElClasses(firstEl, secondEl) {
      const buffer = firstEl.classList.toString();
      firstEl.className = secondEl.classList.toString();
      secondEl.className = buffer;
    }

    const activeSliredItem = '.review-slider__item.tns-slide-active';

    function showQuote(element) {
      const elAttr = element.getAttribute('data-for');
      const curQuote = getEl(
        `${activeSliredItem} blockquote[data-for="${elAttr}"]`
      );
      const activeQuote = getEl(
        `${activeSliredItem} .review__blockquote_active`
      );

      // setTimeout(() => {
      activeQuote.classList.remove('review__blockquote_active');
      curQuote.classList.add('review__blockquote_active');
      // }, 250);
    }

    function onIconClick(element) {
      const topElement = getEl(`${activeSliredItem} .review-list__item_third`);

      if (window.matchMedia('(min-width: 481px)').matches) {
        swapElClasses(element, topElement);
      }
      showQuote(element);
    }

    function onActiveSlide() {
      const reviewItems = getAllEl(`${activeSliredItem} .review-list__item`);

      reviewItems.forEach(
        (element) => (element.onclick = () => onIconClick(element))
      );
    }

    reviewSlider.events.on('indexChanged', () => onActiveSlide());
    onActiveSlide();

    // ----------------------------------------------
    //		section sponsors slider
    // ----------------------------------------------
    const sponsorsSlider = tns({
      container: '.sponsors-slider',
      // viewportMax: 740,
      items: 4,
      slideBy: 1,
      speed: 400,
      mouseDrag: true,
      nav: false,
      controlsContainer: '.sponsors-controls-btns',
      prevButton: '.sponsors-controls-btns__prev',
      nextButton: '.sponsors-controls-btns__next',
      responsive: {
        1200: {
          items: 4,
        },
        992: {
          items: 3,
        },
        769: {
          items: 4,
        },
        480: {
          items: 3,
        },
        320: {
          items: 2,
        },
        0: {
          items: 1,
        },
      },
    });

    // ----------------------------------------------
    //		section FAQ spoilers
    // ----------------------------------------------
    function toggleSpoiler(title) {
      const text = title.previousElementSibling;

      title.classList.toggle('spoilers__title_active');
      text.classList.toggle('spoilers__text_active');
    }

    const spoilerTitles = getAllEl('.spoilers__title');
    spoilerTitles.forEach((el) => {
      el.onclick = () => toggleSpoiler(el);
    });

    // ----------------------------------------------
    //		section FAQ categories count
    // ----------------------------------------------
    function countSpoilerItems(filter) {
      const filters = getAllEl(filter);

      filters.forEach((element) => {
        const elFor = element.getAttribute('for');
        const spoiler = getEl('.' + elFor + '.spoilers');
        const categoryCount = getEl(
          `.categories__filter[for="${elFor}"] > .categories__count`
        );

        if (spoiler === null) {
          categoryCount.innerHTML = '(0)';
          return;
        }

        const count = spoiler.children.length;
        categoryCount.innerHTML = `(${count})`;
      });
    }

    countSpoilerItems('.categories__filter');

    // ----------------------------------------------
    //		smooth scroll when clicking an anchor link
    // ----------------------------------------------
    const root = (() => {
      if ('scrollingElement' in document) return document.scrollingElement;
      const html = document.documentElement;
      const start = html.scrollTop;
      html.scrollTop = start + 1;
      const end = html.scrollTop;
      html.scrollTop = start;
      return end > start ? html : document.body;
    })();

    const ease = (duration, elapsed, start, end) =>
      Math.round(end * (-Math.pow(2, (-10 * elapsed) / duration) + 1) + start);

    const getCoordinates = (hash) => {
      const start = root.scrollTop;
      const delta = (() => {
        if (hash.length < 2) return -start;
        const target = getEl(hash);
        if (!target) return;
        const top = target.getBoundingClientRect().top;
        const max = root.scrollHeight - window.innerHeight;
        return start + top < max ? top : max - start;
      })();
      if (delta)
        return new Map([
          ['start', start],
          ['delta', delta],
        ]);
    };

    const scroll = (link) => {
      const hash = link.getAttribute('href');
      const coordinates = getCoordinates(hash);
      if (!coordinates) return;

      const tick = (timestamp) => {
        progress.set('elapsed', timestamp - start);

        let progressValues = [];
        let coordinatesValues = [];

        progress.forEach(element => {
          progressValues.push(element);
        });

        coordinates.forEach(element => {
          coordinatesValues.push(element);
        });

        root.scrollTop = ease(...progressValues, ...coordinatesValues);

        progress.get('elapsed') < progress.get('duration')
          ? requestAnimationFrame(tick)
          : complete(hash, coordinates);
      };

      const progress = new Map([['duration', 800]]);
      const start = performance.now();
      requestAnimationFrame(tick);
    };

    const complete = (hash, coordinates) => {
      history.pushState(null, null, hash);
      root.scrollTop = coordinates.get('start') + coordinates.get('delta');
    };

    const attachHandler = (links, index) => {
      const link = links.item(index);
      link.addEventListener('click', (event) => {
        event.preventDefault();
        scroll(link);
      });
      if (index) return attachHandler(links, index - 1);
    };

    const links = getAllEl('a[href^="#"]');
    const last = links.length - 1;
    if (last < 0) return;
    attachHandler(links, last);

    // ----------------------------------------------
    //		scroll to top
    // ----------------------------------------------
    function toggleBtnToTop() {
      const pos = window.pageYOffset;

      if (pos > 1100) {
        toTop.style.display = 'flex';
      } else {
        toTop.style.display = 'none';
      }
    }

    const toTop = getEl('.to-top');

    window.onscroll = function () {
      toggleBtnToTop();
    };
  });
})();
