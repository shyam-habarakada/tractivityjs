(function() {

  // Template forked from underscorejs.
  // See https://github.com/jashkenas/underscore/blob/master/underscore.js

  // window, in the browser. no server support.
  var root = this || {};

  // TODO conflict detection
  var previousTractivity = root.Tractivity;

  var log = function(msg) {
    console.log('[tractivity] ' + msg);
  };

  // Create a safe reference to the Tracktivity object for use below.
  var tractivity = function(obj) {
    if (obj instanceof tractivity) return obj;
    if (!(this instanceof tractivity)) return new tractivity(obj);
    this.tractivityWrapped = obj;
  };

  root.tractivity = tractivity;

  // Current version.
  tractivity.VERSION = '0.1.0';

  tractivity.enable = function() {
    log('enabled');
  }

}());
