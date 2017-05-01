(function() {

  'use strict';

  // Template forked from underscorejs.
  // See https://github.com/jashkenas/underscore/blob/master/underscore.js

  // Root is window. No server support.
  var root = this;

  // TODO conflict detection
  var previousTractivity = root.Tractivity;

  // Create a safe reference to the Tracktivity object for use below.
  var tractivity = function(obj) {
    if (obj instanceof tractivity) return obj;
    if (!(this instanceof tractivity)) return new tractivity(obj);
    this.tractivityWrapped = obj;
  };

  // internal state
  var DEFAULT_LOGGING = false,
      DEFAULT_SCROLL_TIMEOUT = 1000,
      DEFAULT_TRACKED_CLASS = 'tracked',
      logging = DEFAULT_LOGGING,
      trackedElementClass = DEFAULT_TRACKED_CLASS,
      trackedElements = [],
      trackedElementsById = {},
      scrollEndedTimer,
      scrollEndedTimeout = DEFAULT_SCROLL_TIMEOUT;

  var log = function(msg) {
    logging && console.log('[tractivity] ' + msg);
  };

  var getElementInfo = function(el) {
    return el.nodeName + ' id=' + getElementId(el);
  };

  var getElementId = function(el) {
    // allow overriding via data-tracked-id attribute
    return el.dataset.trackedId || el.id || '';
  };

  var tracked = function(el) {
    return el.classList.contains(trackedElementClass);
  };

  var elementVisible = function(el) {
    var rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom > 0;
  };

  var parse = function(node) {
    var a = node.querySelectorAll('.' + trackedElementClass);
    a.forEach(function(el) {
      var elId = getElementId(el);
      // if we haven't seen this tracked element before
      if(!trackedElementsById[elId]) {
        trackedElements.push(el);
        trackedElementsById[elId] = el;
      }
    })
  };
  // TODO garbage collect when tracked elements are removed from the document.

  var whenScrollEnded = function() {
    log('scroll ended');
    trackedElements.forEach(function(el) {
      if(elementVisible(el)) {
        log('element ' + getElementId(el) + ' seen after ' + performance.now() + 'ms');
      }
    })
  };

  root.tractivity = tractivity;

  tractivity.VERSION = '0.1.0';

  /* Enable tractivityjs. Available options are,
   *
   * logging: true turns on console logging
   * trackedElementClass: string override the default CSS class that marks trackable elements
   * scrollEndedTimeout: delay before an element is considered as seen
   *
   */
  tractivity.enable = function(options) {
    if(options) {
      logging = options.logging || DEFAULT_LOGGING;
      trackedElementClass = options.trackedElementClass || DEFAULT_TRACKED_CLASS;
      scrollEndedTimeout = options.scrollEndedTimeout || DEFAULT_SCROLL_TIMEOUT;
    }

    var onMouseOver = function(e) {
      var el = e.target,
          elInfo;
      if(tracked(el)) {
        elInfo = getElementInfo(e.target);
        log('mouse moved over element ' + elInfo + ' after ' + performance.now() + 'ms');
      }
    };

    var onMouseDown = function(e) {
      var el = e.target,
          elInfo;
      if(tracked(el)) {
        elInfo = getElementInfo(e.target);
        log('mouse down on element ' + elInfo +  ' after ' + performance.now() + 'ms');
      }
    };

    var onScroll = function(e) {
      if(scrollEndedTimer !== null) {
        clearTimeout(scrollEndedTimer);
      }
      scrollEndedTimer = setTimeout(whenScrollEnded, scrollEndedTimeout);
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousedown', onMouseDown);

    window.addEventListener('scroll', onScroll);

    log('enabled');

    parse(document.body);
    whenScrollEnded();
  }

  /* Parse a newly added DOM sub-tree for trackable elements. A node value of
   * null will cause the entire DOM tree to be parsed.
   */
  tractivity.parse = function(node) {
    if(!node) {
      node = document.body;
    }
    log('parsing ' + getElementInfo(node));
    parse(node);
    whenScrollEnded();
  }

}.call(this));
