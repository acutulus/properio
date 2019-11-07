'use strict';

// main nav drop downs
var dropdowns = Array.from(document.getElementsByClassName('dropdown-toggle'));
var activeMenu = null;

document.body.addEventListener('click', function (e) {
  if (activeMenu && e.target.closest('.nav-item') !== activeMenu) {
    activeMenu.classList.remove('is-visible');
  }
});

dropdowns.forEach(function (element) {
  element.addEventListener('click', function (e) {
    var tempItem = e.target.closest('.nav-item');
    if (tempItem.classList.contains('is-visible')) {
      tempItem.classList.remove("is-visible");
      return;
    }
    if (activeMenu) {
      activeMenu.classList.remove("is-visible");
    }
    activeMenu = tempItem;
    activeMenu.classList.add("is-visible");
  });
});

// header show hide

function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function later() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

var elClassHidden = 'header-nav--hidden';
var elClassScrolled = 'header-nav--scrolled';
var navElement = document.querySelector('.header-nav');
var mobileNavElement = document.querySelector('.navbar');
var removeElementClass = function removeElementClass(el, elClass) {
  return el.classList.remove(elClass);
};
var addElementClass = function addElementClass(el, elClass) {
  return el.classList.add(elClass);
};
var hasElementClass = function hasElementClass(el, elClass) {
  return el.classList.contains(elClass);
};
var lastScrollPos = 0;

var breakpoint = void 0;

function setBreakpoint() {
  var width = window.innerWidth;
  if (width > 1024) {
    breakpoint = 'large';
  } else if (width > 756) {
    breakpoint = 'medium';
  } else {
    breakpoint = 'small';
  }
  console.log('breakpoint:', breakpoint);
};

window.addEventListener('resize', function () {
  return setBreakpoint();
});
setBreakpoint();

window.addEventListener('scroll', throttle(function (e) {
  var scrollTop = document.body.scrollTop;
  var scrollDelta = scrollTop - lastScrollPos;
  var documentHeight = document.documentElement.scrollHeight;
  var viewportHeight = window.innerHeight;
  lastScrollPos = scrollTop;

  if (scrollTop > 90) {
    addElementClass(navElement, elClassScrolled);
    addElementClass(mobileNavElement, elClassScrolled);
  } else {
    removeElementClass(navElement, elClassScrolled);
    removeElementClass(mobileNavElement, elClassScrolled);
  }

  if (scrollTop <= 0) {
    removeElementClass(navElement, elClassHidden);
  } else if (scrollDelta > 0) {
    if (!hasElementClass(navElement, elClassHidden)) {
      addElementClass(navElement, elClassHidden);
    }
    if (scrollTop + viewportHeight >= documentHeight && hasElementClass(navElement, elClassHidden)) // scrolled to the very bottom; element slides in
      removeElementClass(navElement, elClassHidden);
  } else {
    removeElementClass(navElement, elClassHidden);
  }
}, 200));

// helpers

var getUrlParts = function getUrlParts() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.href;

  return url.split('?');
};

var getSearchParams = function getSearchParams(value) {
  var searchParams = new URLSearchParams(getUrlParts()[1]);
  // check if value is an array
  if (Array.isArray(value)) {
    return value.map(function (param) {
      return searchParams.get(param);
    });
  } else if (typeof value === 'string') {
    return searchParams.get(value);
  }

  return new Error('must pass an array or a string');
};
