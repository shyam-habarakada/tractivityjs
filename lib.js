(function() {

  // Template forked from underscorejs.
  // See https://github.com/jashkenas/underscore/blob/master/underscore.js

  'use strict';

  // window, in the browser. no server support.
  var root = this;

  // TODO conflict detection
  var previousTractivity = root.Tractivity;

  var logging = false;

  var log = function(msg) {
    logging && console.log('[tractivity] ' + msg);
  };

  // Create a safe reference to the Tracktivity object for use below.
  var tractivity = function(obj) {
    if (obj instanceof tractivity) return obj;
    if (!(this instanceof tractivity)) return new tractivity(obj);
    this.tractivityWrapped = obj;
  };

  root.tractivity = tractivity;

  tractivity.VERSION = '0.1.0';

  tractivity.enable = function(options) {
    if(options) {
      logging = options.logging;
    }

    log('enabled');

    var getElementInfo = function(el) {
      var s;
      if(el) {
        s = el.nodeName;
        if(el.dataset.trackedId) {
          s = s + ' id=' + el.dataset.trackedId;
        } else {
          if(el.id) {
            s = s + ' id=' + el.id;
          }
        };
      } else {
        s = 'unknown';
      }
      return s;
    };

    var onMouseOver = function(e) {
      var el = e.target,
          elInfo;
      if(el.dataset.tracked === 'true') {
        elInfo = getElementInfo(e.target);
        log('mouse moved over element ' + elInfo + ' (' + e.screenX + ',' + e.screenY + ')');
      }
    };

    var onMouseDown = function(e) {
      var el = e.target,
          elInfo;
      if(el.dataset.tracked === 'true') {
        elInfo = getElementInfo(e.target);
        log('mouse down on element ' + elInfo + ' (' + e.screenX + ',' + e.screenY + ')');
      }
    }

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousedown', onMouseDown);
  }

}.call(this));
