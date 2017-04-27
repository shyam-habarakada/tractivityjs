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

  var logging = false;

  var log = function(msg) {
    logging && console.log('[tractivity] ' + msg);
  };

  var trackedElementClass = 'tracked',
      trackedElements = [],
      trackedElementsById = {};

  var parse = function(node) {
    var a = node.querySelectorAll(trackedElementClass);
    a.forEach(function(el) {
      // TODO
    })
  }

  root.tractivity = tractivity;

  tractivity.VERSION = '0.1.0';

  /*
   Public Interface
   */

  tractivity.enable = function(options) {
    if(options) {
      logging = options.logging;
      trackedElementClass = options.trackedElementClass || 'tracked';
    }

    var tracked = function(el) {
      return el.classList.contains(trackedElementClass);
    };

    var getElementId = function(el) {
      // allow overriding via data-tracked-id attribute
      return el.dataset.trackedId || el.id || '';
    };


    var getElementInfo = function(el) {
      return el.nodeName + ' id=' + getElementId(el);
    };

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
    }

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousedown', onMouseDown);

    log('enabled');
  }

}.call(this));
