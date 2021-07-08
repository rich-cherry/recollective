/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 646:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
/**
 * Reads the content property on the documentElement ::before pseudo element
 * for a string of ordered, comma-separated, breakpoint names.
 *
 * @returns An ordered array of strings representing the breakpoint names
 *
 */
function readCSSBreakpoints() {
    return window
        .getComputedStyle(document.documentElement, ':before')
        .getPropertyValue('content')
        .replace(/"/g, '')
        .split(',');
}
/**
 * Reads the content property on the documentElement ::after pseudo element
 * for a string of the current breakpoint name. This value is updated using
 * dynamically using media queries and should match a value found in
 * the ::before pseudo element.
 *
 * @returns A string representing the current breakpoint name
 *
 */
function readCSSCurrentBreakpoint() {
    return window
        .getComputedStyle(document.documentElement, ':after')
        .getPropertyValue('content')
        .replace(/"/g, '');
}
var callbacks = [];
var cssBreakpoints = readCSSBreakpoints();
var CSSBreakpoint = /** @class */ (function () {
    function CSSBreakpoint(cssBreakpoint) {
        this.cssBreakpoint = cssBreakpoint;
    }
    Object.defineProperty(CSSBreakpoint.prototype, "value", {
        get: function () {
            return this.cssBreakpoint;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks whether this breakpoint is at least the input breakpoint
     *
     * @param breakpointName - The input breakpoint name
     * @returns Whether this breakpoint is the same or greater than the input breakpoint
     *
     */
    CSSBreakpoint.prototype.min = function (breakpointName) {
        var comparison = cssBreakpoints.indexOf(this.value) - cssBreakpoints.indexOf(breakpointName);
        return comparison >= 0;
    };
    /**
     * Checks whether this breakpoint is at most the input breakpoint
     *
     * @param breakpointName - The input breakpoint name
     * @returns Whether this breakpoint is the same or less than the input breakpoint
     *
     */
    CSSBreakpoint.prototype.max = function (breakpointName) {
        var comparison = cssBreakpoints.indexOf(this.value) - cssBreakpoints.indexOf(breakpointName);
        return comparison <= 0;
    };
    /**
     * Checks whether this breakpoint is at within the input breakpoint start
     * and input breakpoint end, inclusive
     *
     * @param breakpointNameStart - The starting input breakpoint name
     * @param breakpointNameEnd - The ending input breakpoint name
     * @returns Whether this breakpoint is the same or greater than the starting input
     *          breakpoint and the same or less than the ending input breakpoint
     *
     */
    CSSBreakpoint.prototype.range = function (breakpointNameStart, breakpointNameEnd) {
        var indexCurrent = cssBreakpoints.indexOf(this.value);
        var indexStart = cssBreakpoints.indexOf(breakpointNameStart);
        var indexEnd = cssBreakpoints.indexOf(breakpointNameEnd);
        return indexStart <= indexCurrent && indexCurrent <= indexEnd;
    };
    /**
     * Checks whether this breakpoint is one of the input breakpoints
     *
     * @param breakpointNames - One or more input breakpoint names
     * @returns Whether this breakpoint is one of the input breakpoints
     *
     */
    CSSBreakpoint.prototype.is = function () {
        var _this = this;
        var breakpointNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            breakpointNames[_i] = arguments[_i];
        }
        return breakpointNames.some(function (breakpoint) { return breakpoint === _this.value; });
    };
    return CSSBreakpoint;
}());
var breakpoints = {
    previous: new CSSBreakpoint(readCSSCurrentBreakpoint()),
    current: new CSSBreakpoint(readCSSCurrentBreakpoint()),
};
/**
 * Gets the breakpoints
 *
 * @returns The current and previous breakpoint
 *
 */
function get() {
    return breakpoints;
}
__webpack_unused_export__ = get;
/**
 * Adds an event listener to be called when a breakpoint changes
 *
 * @param callback - The function to be called when a breakpoint changes
 *
 */
function onChange(callback) {
    if (callbacks.indexOf(callback) === -1) {
        callbacks.push(callback);
    }
}
exports.z2 = onChange;
/**
 * Removes an event listener to be called when a breakpoint changes
 *
 * @param callback - The function to be removed from the set of event listeners
 *
 */
function offChange(callback) {
    var index = callbacks.indexOf(callback);
    if (index !== -1) {
        callbacks.splice(index, 1);
    }
}
exports.F = offChange;
var currentMin = function (breakpointName) { return breakpoints.current.min(breakpointName); };
exports.VV = currentMin;
var currentMax = function (breakpointName) { return breakpoints.current.max(breakpointName); };
exports.Fp = currentMax;
var currentRange = function (breakpointNameStart, breakpointNameEnd) { return breakpoints.current.range(breakpointNameStart, breakpointNameEnd); };
__webpack_unused_export__ = currentRange;
var currentIs = function () {
    var _a;
    var breakpointNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        breakpointNames[_i] = arguments[_i];
    }
    return (_a = breakpoints.current).is.apply(_a, breakpointNames);
};
__webpack_unused_export__ = currentIs;
/*
 * document.styleSheets is considered experimental technology; however,
 * the majority of current browsers implement this functionality.
 *
 * One drawback is under certain conditions, stylesheets may become
 * available due to security rules in the browser and we must be able to
 * fallback gracefully.
 */
var styleSheetList = document.styleSheets;
var mediaLists = Object.keys(styleSheetList).reduce(function (accumulator, key) {
    var stylesheet = styleSheetList[key];
    if (!stylesheet.href || stylesheet.href.indexOf('theme') === -1) {
        return accumulator;
    }
    try {
        var cssRules = stylesheet.cssRules;
        for (var i = 0; i < cssRules.length; i++) {
            var cssRule = stylesheet.cssRules[i];
            if (!(cssRule instanceof CSSMediaRule)) {
                continue;
            }
            for (var j = 0; j < cssRules.length; j++) {
                var cssMediaCssRule = cssRule.cssRules[j];
                if (!(cssMediaCssRule instanceof CSSStyleRule)) {
                    continue;
                }
                if (cssMediaCssRule.selectorText && cssMediaCssRule.selectorText.indexOf('html::after') !== -1) {
                    accumulator.push(cssRule.media);
                }
            }
        }
    }
    catch (_a) {
        return accumulator;
    }
    return accumulator;
}, []);
/*
 * Use window.matchMedia when stylesheets are accessible in the browser.
 * matchMedia is theoretically more performant than listening to every resize
 * event because it only fires when a media query boundary is crossed.
 *
 * If stylesheets aren't available, revert back to using the resize event.
 */
if (mediaLists.length > 0) {
    mediaLists.forEach(function (mediaList) {
        var mql = window.matchMedia(mediaList.mediaText);
        mql.addListener(function () {
            var cssCurrentBreakpoint = readCSSCurrentBreakpoint();
            if (breakpoints.current.value !== cssCurrentBreakpoint) {
                breakpoints.previous = breakpoints.current;
                breakpoints.current = new CSSBreakpoint(cssCurrentBreakpoint);
                callbacks.forEach(function (callback) { return callback(breakpoints); });
            }
        });
    });
}
else {
    window.addEventListener('resize', function () {
        var cssCurrentBreakpoint = readCSSCurrentBreakpoint();
        if (breakpoints.current.value !== cssCurrentBreakpoint) {
            breakpoints.previous = breakpoints.current;
            breakpoints.current = new CSSBreakpoint(cssCurrentBreakpoint);
            callbacks.forEach(function (callback) { return callback(breakpoints); });
        }
    });
}


/***/ }),

/***/ 766:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = true;
var EventHandler = /** @class */ (function () {
    function EventHandler() {
        this.events = [];
    }
    EventHandler.prototype.register = function (el, event, listener) {
        if (!el || !event || !listener)
            return null;
        this.events.push({ el: el, event: event, listener: listener });
        el.addEventListener(event, listener);
        return { el: el, event: event, listener: listener };
    };
    EventHandler.prototype.unregister = function (_a) {
        var el = _a.el, event = _a.event, listener = _a.listener;
        if (!el || !event || !listener)
            return null;
        this.events = this.events.filter(function (e) { return el !== e.el
            || event !== e.event || listener !== e.listener; });
        el.removeEventListener(event, listener);
        return { el: el, event: event, listener: listener };
    };
    EventHandler.prototype.unregisterAll = function () {
        this.events.forEach(function (_a) {
            var el = _a.el, event = _a.event, listener = _a.listener;
            return el.removeEventListener(event, listener);
        });
        this.events = [];
    };
    return EventHandler;
}());
exports.Z = EventHandler;


/***/ }),

/***/ 43:
/***/ (function() {

/**
 * Currency Helpers
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */
Shopify.currencyHelper = function () {
  var moneyFormat = '${{amount}}'; // eslint-disable-line no-template-curly-in-string

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }

    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);
      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1".concat(thousands));
      var centsAmount = parts[1] ? decimal + parts[1] : '';
      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;

      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;

      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;

      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;

      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;

      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;

      default:
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
}();

/***/ }),

/***/ 741:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * matchesSelector v2.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  /*global define: false, module: false */
  'use strict';
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory() {
  'use strict';

  var matchesMethod = ( function() {
    var ElemProto = window.Element.prototype;
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0; i < prefixes.length; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  return function matchesSelector( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  };

}));


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( true ) {
    // AMD - RequireJS
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  // copy over to avoid interference if .off() in listener
  listeners = listeners.slice(0);
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  for ( var i=0; i < listeners.length; i++ ) {
    var listener = listeners[i]
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
  }

  return this;
};

proto.allOff = function() {
  delete this._events;
  delete this._onceEvents;
};

return EvEmitter;

}));


/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Fizzy UI utils v2.0.7
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(741)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( matchesSelector ) {
      return factory( window, matchesSelector );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, matchesSelector ) {

'use strict';

var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- makeArray ----- //

var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    return obj;
  }
  // return empty array if undefined or null. #6
  if ( obj === null || obj === undefined ) {
    return [];
  }

  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  if ( isArrayLike ) {
    // convert nodeList to array
    return arraySlice.call( obj );
  }

  // array of single index
  return [ obj ];
};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = ary.indexOf( obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem.parentNode && elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  elems.forEach( function( elem ) {
    // check that elem is an actual element
    if ( !( elem instanceof HTMLElement ) ) {
      return;
    }
    // add elem if no selector
    if ( !selector ) {
      ffElems.push( elem );
      return;
    }
    // filter & find items if we have a selector
    // filter
    if ( matchesSelector( elem, selector ) ) {
      ffElems.push( elem );
    }
    // find children
    var childElems = elem.querySelectorAll( selector );
    // concat childElems to filterFound array
    for ( var i=0; i < childElems.length; i++ ) {
      ffElems.push( childElems[i] );
    }
  });

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  threshold = threshold || 100;
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    clearTimeout( timeout );

    var args = arguments;
    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold );
  };
};

// ----- docReady ----- //

utils.docReady = function( callback ) {
  var readyState = document.readyState;
  if ( readyState == 'complete' || readyState == 'interactive' ) {
    // do async to allow for other scripts to run. metafizzy/flickity#441
    setTimeout( callback );
  } else {
    document.addEventListener( 'DOMContentLoaded', callback );
  }
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via [data-namespace] or .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-options
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  utils.docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var dataAttr = 'data-' + dashedNamespace;
    var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
    var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
    var elems = utils.makeArray( dataAttrElems )
      .concat( utils.makeArray( jsDashElems ) );
    var dataOptionsAttr = dataAttr + '-options';
    var jQuery = window.jQuery;

    elems.forEach( function( elem ) {
      var attr = elem.getAttribute( dataAttr ) ||
        elem.getAttribute( dataOptionsAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
          ': ' + error );
        }
        return;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('namespace')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    });

  });
};

// -----  ----- //

return utils;

}));


/***/ }),

/***/ 541:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Flickity asNavFor v2.0.1
 * enable asNavFor for Flickity
 */

/*jshint browser: true, undef: true, unused: true, strict: true*/

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(442),
      __webpack_require__(47)
    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( Flickity, utils ) {

'use strict';

// -------------------------- asNavFor prototype -------------------------- //

// Flickity.defaults.asNavFor = null;

Flickity.createMethods.push('_createAsNavFor');

var proto = Flickity.prototype;

proto._createAsNavFor = function() {
  this.on( 'activate', this.activateAsNavFor );
  this.on( 'deactivate', this.deactivateAsNavFor );
  this.on( 'destroy', this.destroyAsNavFor );

  var asNavForOption = this.options.asNavFor;
  if ( !asNavForOption ) {
    return;
  }
  // HACK do async, give time for other flickity to be initalized
  var _this = this;
  setTimeout( function initNavCompanion() {
    _this.setNavCompanion( asNavForOption );
  });
};

proto.setNavCompanion = function( elem ) {
  elem = utils.getQueryElement( elem );
  var companion = Flickity.data( elem );
  // stop if no companion or companion is self
  if ( !companion || companion == this ) {
    return;
  }

  this.navCompanion = companion;
  // companion select
  var _this = this;
  this.onNavCompanionSelect = function() {
    _this.navCompanionSelect();
  };
  companion.on( 'select', this.onNavCompanionSelect );
  // click
  this.on( 'staticClick', this.onNavStaticClick );

  this.navCompanionSelect( true );
};

proto.navCompanionSelect = function( isInstant ) {
  if ( !this.navCompanion ) {
    return;
  }
  // select slide that matches first cell of slide
  var selectedCell = this.navCompanion.selectedCells[0];
  var firstIndex = this.navCompanion.cells.indexOf( selectedCell );
  var lastIndex = firstIndex + this.navCompanion.selectedCells.length - 1;
  var selectIndex = Math.floor( lerp( firstIndex, lastIndex,
    this.navCompanion.cellAlign ) );
  this.selectCell( selectIndex, false, isInstant );
  // set nav selected class
  this.removeNavSelectedElements();
  // stop if companion has more cells than this one
  if ( selectIndex >= this.cells.length ) {
    return;
  }

  var selectedCells = this.cells.slice( firstIndex, lastIndex + 1 );
  this.navSelectedElements = selectedCells.map( function( cell ) {
    return cell.element;
  });
  this.changeNavSelectedClass('add');
};

function lerp( a, b, t ) {
  return ( b - a ) * t + a;
}

proto.changeNavSelectedClass = function( method ) {
  this.navSelectedElements.forEach( function( navElem ) {
    navElem.classList[ method ]('is-nav-selected');
  });
};

proto.activateAsNavFor = function() {
  this.navCompanionSelect( true );
};

proto.removeNavSelectedElements = function() {
  if ( !this.navSelectedElements ) {
    return;
  }
  this.changeNavSelectedClass('remove');
  delete this.navSelectedElements;
};

proto.onNavStaticClick = function( event, pointer, cellElement, cellIndex ) {
  if ( typeof cellIndex == 'number' ) {
    this.navCompanion.selectCell( cellIndex );
  }
};

proto.deactivateAsNavFor = function() {
  this.removeNavSelectedElements();
};

proto.destroyAsNavFor = function() {
  if ( !this.navCompanion ) {
    return;
  }
  this.navCompanion.off( 'select', this.onNavCompanionSelect );
  this.off( 'staticClick', this.onNavStaticClick );
  delete this.navCompanion;
};

// -----  ----- //

return Flickity;

}));


/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Flickity fade v1.0.0
 * Fade between Flickity slides
 */

/* jshint browser: true, undef: true, unused: true */

( function( window, factory ) {
  // universal module definition
  /*globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(442),
      __webpack_require__(47),
    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( this, function factory( Flickity, utils ) {

// ---- Slide ---- //

var Slide = Flickity.Slide;

var slideUpdateTarget = Slide.prototype.updateTarget;
Slide.prototype.updateTarget = function() {
  slideUpdateTarget.apply( this, arguments );
  if ( !this.parent.options.fade ) {
    return;
  }
  // position cells at selected target
  var slideTargetX = this.target - this.x;
  var firstCellX = this.cells[0].x;
  this.cells.forEach( function( cell ) {
    var targetX = cell.x - firstCellX - slideTargetX;
    cell.renderPosition( targetX );
  });
};

Slide.prototype.setOpacity = function( alpha ) {
  this.cells.forEach( function( cell ) {
    cell.element.style.opacity = alpha;
  });
};

// ---- Flickity ---- //

var proto = Flickity.prototype;

Flickity.createMethods.push('_createFade');

proto._createFade = function() {
  this.fadeIndex = this.selectedIndex;
  this.prevSelectedIndex = this.selectedIndex;
  this.on( 'select', this.onSelectFade );
  this.on( 'dragEnd', this.onDragEndFade );
  this.on( 'settle', this.onSettleFade );
  this.on( 'activate', this.onActivateFade );
  this.on( 'deactivate', this.onDeactivateFade );
};

var updateSlides = proto.updateSlides;
proto.updateSlides = function() {
  updateSlides.apply( this, arguments );
  if ( !this.options.fade ) {
    return;
  }
  // set initial opacity
  this.slides.forEach( function( slide, i ) {
    var alpha = i == this.selectedIndex ? 1 : 0;
    slide.setOpacity( alpha );
  }, this );
};

/* ---- events ---- */

proto.onSelectFade = function() {
  // in case of resize, keep fadeIndex within current count
  this.fadeIndex = Math.min( this.prevSelectedIndex, this.slides.length - 1 );
  this.prevSelectedIndex = this.selectedIndex;
};

proto.onSettleFade = function() {
  delete this.didDragEnd;
  if ( !this.options.fade ) {
    return;
  }
  // set full and 0 opacity on selected & faded slides
  this.selectedSlide.setOpacity( 1 );
  var fadedSlide = this.slides[ this.fadeIndex ];
  if ( fadedSlide && this.fadeIndex != this.selectedIndex ) {
    this.slides[ this.fadeIndex ].setOpacity( 0 );
  }
};

proto.onDragEndFade = function() {
  // set flag
  this.didDragEnd = true;
};

proto.onActivateFade = function() {
  if ( this.options.fade ) {
    this.element.classList.add('is-fade');
  }
};

proto.onDeactivateFade = function() {
  if ( !this.options.fade ) {
    return;
  }
  this.element.classList.remove('is-fade');
  // reset opacity
  this.slides.forEach( function( slide ) {
    slide.setOpacity('');
  });
};

/* ---- position & fading ---- */

var positionSlider = proto.positionSlider;
proto.positionSlider = function() {
  if ( !this.options.fade ) {
    positionSlider.apply( this, arguments );
    return;
  }

  this.fadeSlides();
  this.dispatchScrollEvent();
};

var positionSliderAtSelected = proto.positionSliderAtSelected;
proto.positionSliderAtSelected = function() {
  if ( this.options.fade ) {
    // position fade slider at origin
    this.setTranslateX( 0 );
  }
  positionSliderAtSelected.apply( this, arguments );
};

proto.fadeSlides = function() {
  if ( this.slides.length < 2 ) {
    return;
  }
  // get slides to fade-in & fade-out
  var indexes = this.getFadeIndexes();
  var fadeSlideA = this.slides[ indexes.a ];
  var fadeSlideB = this.slides[ indexes.b ];
  var distance = this.wrapDifference( fadeSlideA.target, fadeSlideB.target );
  var progress = this.wrapDifference( fadeSlideA.target, -this.x );
  progress = progress / distance;

  fadeSlideA.setOpacity( 1 - progress );
  fadeSlideB.setOpacity( progress );

  // hide previous slide
  var fadeHideIndex = indexes.a;
  if ( this.isDragging ) {
    fadeHideIndex = progress > 0.5 ? indexes.a : indexes.b;
  }
  var isNewHideIndex = this.fadeHideIndex != undefined &&
    this.fadeHideIndex != fadeHideIndex &&
    this.fadeHideIndex != indexes.a &&
    this.fadeHideIndex != indexes.b;
  if ( isNewHideIndex ) {
    // new fadeHideSlide set, hide previous
    this.slides[ this.fadeHideIndex ].setOpacity( 0 );
  }
  this.fadeHideIndex = fadeHideIndex;
};

proto.getFadeIndexes = function() {
  if ( !this.isDragging && !this.didDragEnd ) {
    return {
      a: this.fadeIndex,
      b: this.selectedIndex,
    };
  }
  if ( this.options.wrapAround ) {
    return this.getFadeDragWrapIndexes();
  } else {
    return this.getFadeDragLimitIndexes();
  }
};

proto.getFadeDragWrapIndexes = function() {
  var distances = this.slides.map( function( slide, i ) {
    return this.getSlideDistance( -this.x, i );
  }, this );
  var absDistances = distances.map( function( distance ) {
    return Math.abs( distance );
  });
  var minDistance = Math.min.apply( Math, absDistances );
  var closestIndex = absDistances.indexOf( minDistance );
  var distance = distances[ closestIndex ];
  var len = this.slides.length;

  var delta = distance >= 0 ? 1 : -1;
  return {
    a: closestIndex,
    b: utils.modulo( closestIndex + delta, len ),
  };
};

proto.getFadeDragLimitIndexes = function() {
  // calculate closest previous slide
  var dragIndex = 0;
  for ( var i=0; i < this.slides.length - 1; i++ ) {
    var slide = this.slides[i];
    if ( -this.x < slide.target ) {
      break;
    }
    dragIndex = i;
  }
  return {
    a: dragIndex,
    b: dragIndex + 1,
  };
};

proto.wrapDifference = function( a, b ) {
  var diff = b - a;

  if ( !this.options.wrapAround ) {
    return diff;
  }

  var diffPlus = diff + this.slideableWidth;
  var diffMinus = diff - this.slideableWidth;
  if ( Math.abs( diffPlus ) < Math.abs( diff ) ) {
    diff = diffPlus;
  }
  if ( Math.abs( diffMinus ) < Math.abs( diff ) ) {
    diff = diffMinus;
  }
  return diff;
};

// ---- wrapAround ---- //

var _getWrapShiftCells = proto._getWrapShiftCells;
proto._getWrapShiftCells = function() {
  if ( !this.options.fade ) {
    _getWrapShiftCells.apply( this, arguments );
  }
};

var shiftWrapCells = proto.shiftWrapCells;
proto.shiftWrapCells = function() {
  if ( !this.options.fade ) {
    shiftWrapCells.apply( this, arguments );
  }
};

return Flickity;

}));


/***/ }),

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Flickity imagesLoaded v2.0.0
 * enables imagesLoaded option for Flickity
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(442),
      __webpack_require__(564)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, imagesLoaded ) {
      return factory( window, Flickity, imagesLoaded );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, imagesLoaded ) {
'use strict';

Flickity.createMethods.push('_createImagesLoaded');

var proto = Flickity.prototype;

proto._createImagesLoaded = function() {
  this.on( 'activate', this.imagesLoaded );
};

proto.imagesLoaded = function() {
  if ( !this.options.imagesLoaded ) {
    return;
  }
  var _this = this;
  function onImagesLoadedProgress( instance, image ) {
    var cell = _this.getParentCell( image.img );
    _this.cellSizeChange( cell && cell.element );
    if ( !_this.options.freeScroll ) {
      _this.positionSliderAtSelected();
    }
  }
  imagesLoaded( this.slider ).on( 'progress', onImagesLoadedProgress );
};

return Flickity;

}));


/***/ }),

/***/ 566:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Flickity sync v2.0.0
 * enable sync for Flickity
 */

/*jshint browser: true, undef: true, unused: true, strict: true*/

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(442),
      __webpack_require__(47)
    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( Flickity, utils ) {

'use strict';

// -------------------------- sync prototype -------------------------- //

// Flickity.defaults.sync = false;

Flickity.createMethods.push('_createSync');

Flickity.prototype._createSync = function() {
  this.syncers = {};
  var syncOption = this.options.sync;

  this.on( 'destroy', this.unsyncAll );

  if ( !syncOption ) {
    return;
  }
  // HACK do async, give time for other flickity to be initalized
  var _this = this;
  setTimeout( function initSyncCompanion() {
    _this.sync( syncOption );
  });
};

/**
 * sync
 * @param {Element} or {String} elem
 */
Flickity.prototype.sync = function( elem ) {
  elem = utils.getQueryElement( elem );
  var companion = Flickity.data( elem );
  if ( !companion ) {
    return;
  }
  // two hearts, that beat as one
  this._syncCompanion( companion );
  companion._syncCompanion( this );
};

/**
 * @param {Flickity} companion
 */
Flickity.prototype._syncCompanion = function( companion ) {
  var _this = this;
  function syncListener() {
    var index = _this.selectedIndex;
    // do not select if already selected, prevent infinite loop
    if ( companion.selectedIndex != index ) {
      companion.select( index );
    }
  }
  this.on( 'select', syncListener );
  // keep track of all synced flickities
  // hold on to listener to unsync
  this.syncers[ companion.guid ] = {
    flickity: companion,
    listener: syncListener
  };
};

/**
 * unsync
 * @param {Element} or {String} elem
 */
Flickity.prototype.unsync = function( elem ) {
  elem = utils.getQueryElement( elem );
  var companion = Flickity.data( elem );
  this._unsync( companion );
};

/**
 * @param {Flickity} companion
 */
Flickity.prototype._unsync = function( companion ) {
  if ( !companion ) {
    return;
  }
  // I love you but I've chosen darkness
  this._unsyncCompanion( companion );
  companion._unsyncCompanion( this );
};

/**
 * @param {Flickity} companion
 */
Flickity.prototype._unsyncCompanion = function( companion ) {
  var id = companion.guid;
  var syncer = this.syncers[ id ];
  this.off( 'select', syncer.listener );
  delete this.syncers[ id ];
};

Flickity.prototype.unsyncAll = function() {
  for ( var id in this.syncers ) {
    var syncer = this.syncers[ id ];
    this._unsync( syncer.flickity );
  }
};

// -----  ----- //

return Flickity;

}));


/***/ }),

/***/ 597:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// add, remove cell
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(47),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, utils ) {
      return factory( window, Flickity, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, utils ) {

'use strict';

// append cells to a document fragment
function getCellsFragment( cells ) {
  var fragment = document.createDocumentFragment();
  cells.forEach( function( cell ) {
    fragment.appendChild( cell.element );
  } );
  return fragment;
}

// -------------------------- add/remove cell prototype -------------------------- //

var proto = Flickity.prototype;

/**
 * Insert, prepend, or append cells
 * @param {[Element, Array, NodeList]} elems - Elements to insert
 * @param {Integer} index - Zero-based number to insert
 */
proto.insert = function( elems, index ) {
  var cells = this._makeCells( elems );
  if ( !cells || !cells.length ) {
    return;
  }
  var len = this.cells.length;
  // default to append
  index = index === undefined ? len : index;
  // add cells with document fragment
  var fragment = getCellsFragment( cells );
  // append to slider
  var isAppend = index == len;
  if ( isAppend ) {
    this.slider.appendChild( fragment );
  } else {
    var insertCellElement = this.cells[ index ].element;
    this.slider.insertBefore( fragment, insertCellElement );
  }
  // add to this.cells
  if ( index === 0 ) {
    // prepend, add to start
    this.cells = cells.concat( this.cells );
  } else if ( isAppend ) {
    // append, add to end
    this.cells = this.cells.concat( cells );
  } else {
    // insert in this.cells
    var endCells = this.cells.splice( index, len - index );
    this.cells = this.cells.concat( cells ).concat( endCells );
  }

  this._sizeCells( cells );
  this.cellChange( index, true );
};

proto.append = function( elems ) {
  this.insert( elems, this.cells.length );
};

proto.prepend = function( elems ) {
  this.insert( elems, 0 );
};

/**
 * Remove cells
 * @param {[Element, Array, NodeList]} elems - ELements to remove
 */
proto.remove = function( elems ) {
  var cells = this.getCells( elems );
  if ( !cells || !cells.length ) {
    return;
  }

  var minCellIndex = this.cells.length - 1;
  // remove cells from collection & DOM
  cells.forEach( function( cell ) {
    cell.remove();
    var index = this.cells.indexOf( cell );
    minCellIndex = Math.min( index, minCellIndex );
    utils.removeFrom( this.cells, cell );
  }, this );

  this.cellChange( minCellIndex, true );
};

/**
 * logic to be run after a cell's size changes
 * @param {Element} elem - cell's element
 */
proto.cellSizeChange = function( elem ) {
  var cell = this.getCell( elem );
  if ( !cell ) {
    return;
  }
  cell.getSize();

  var index = this.cells.indexOf( cell );
  this.cellChange( index );
};

/**
 * logic any time a cell is changed: added, removed, or size changed
 * @param {Integer} changedCellIndex - index of the changed cell, optional
 * @param {Boolean} isPositioningSlider - Positions slider after selection
 */
proto.cellChange = function( changedCellIndex, isPositioningSlider ) {
  var prevSelectedElem = this.selectedElement;
  this._positionCells( changedCellIndex );
  this._getWrapShiftCells();
  this.setGallerySize();
  // update selectedIndex
  // try to maintain position & select previous selected element
  var cell = this.getCell( prevSelectedElem );
  if ( cell ) {
    this.selectedIndex = this.getCellSlideIndex( cell );
  }
  this.selectedIndex = Math.min( this.slides.length - 1, this.selectedIndex );

  this.emitEvent( 'cellChange', [ changedCellIndex ] );
  // position slider
  this.select( this.selectedIndex );
  // do not position slider after lazy load
  if ( isPositioningSlider ) {
    this.positionSliderAtSelected();
  }
};

// -----  ----- //

return Flickity;

} ) );


/***/ }),

/***/ 880:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// animate
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(47),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( utils ) {
      return factory( window, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, utils ) {

'use strict';

// -------------------------- animate -------------------------- //

var proto = {};

proto.startAnimation = function() {
  if ( this.isAnimating ) {
    return;
  }

  this.isAnimating = true;
  this.restingFrames = 0;
  this.animate();
};

proto.animate = function() {
  this.applyDragForce();
  this.applySelectedAttraction();

  var previousX = this.x;

  this.integratePhysics();
  this.positionSlider();
  this.settle( previousX );
  // animate next frame
  if ( this.isAnimating ) {
    var _this = this;
    requestAnimationFrame( function animateFrame() {
      _this.animate();
    } );
  }
};

proto.positionSlider = function() {
  var x = this.x;
  // wrap position around
  if ( this.options.wrapAround && this.cells.length > 1 ) {
    x = utils.modulo( x, this.slideableWidth );
    x -= this.slideableWidth;
    this.shiftWrapCells( x );
  }

  this.setTranslateX( x, this.isAnimating );
  this.dispatchScrollEvent();
};

proto.setTranslateX = function( x, is3d ) {
  x += this.cursorPosition;
  // reverse if right-to-left and using transform
  x = this.options.rightToLeft ? -x : x;
  var translateX = this.getPositionValue( x );
  // use 3D transforms for hardware acceleration on iOS
  // but use 2D when settled, for better font-rendering
  this.slider.style.transform = is3d ?
    'translate3d(' + translateX + ',0,0)' : 'translateX(' + translateX + ')';
};

proto.dispatchScrollEvent = function() {
  var firstSlide = this.slides[0];
  if ( !firstSlide ) {
    return;
  }
  var positionX = -this.x - firstSlide.target;
  var progress = positionX / this.slidesWidth;
  this.dispatchEvent( 'scroll', null, [ progress, positionX ] );
};

proto.positionSliderAtSelected = function() {
  if ( !this.cells.length ) {
    return;
  }
  this.x = -this.selectedSlide.target;
  this.velocity = 0; // stop wobble
  this.positionSlider();
};

proto.getPositionValue = function( position ) {
  if ( this.options.percentPosition ) {
    // percent position, round to 2 digits, like 12.34%
    return ( Math.round( ( position / this.size.innerWidth ) * 10000 ) * 0.01 ) + '%';
  } else {
    // pixel positioning
    return Math.round( position ) + 'px';
  }
};

proto.settle = function( previousX ) {
  // keep track of frames where x hasn't moved
  var isResting = !this.isPointerDown &&
      Math.round( this.x * 100 ) == Math.round( previousX * 100 );
  if ( isResting ) {
    this.restingFrames++;
  }
  // stop animating if resting for 3 or more frames
  if ( this.restingFrames > 2 ) {
    this.isAnimating = false;
    delete this.isFreeScrolling;
    // render position with translateX when settled
    this.positionSlider();
    this.dispatchEvent( 'settle', null, [ this.selectedIndex ] );
  }
};

proto.shiftWrapCells = function( x ) {
  // shift before cells
  var beforeGap = this.cursorPosition + x;
  this._shiftCells( this.beforeShiftCells, beforeGap, -1 );
  // shift after cells
  var afterGap = this.size.innerWidth - ( x + this.slideableWidth + this.cursorPosition );
  this._shiftCells( this.afterShiftCells, afterGap, 1 );
};

proto._shiftCells = function( cells, gap, shift ) {
  for ( var i = 0; i < cells.length; i++ ) {
    var cell = cells[i];
    var cellShift = gap > 0 ? shift : 0;
    cell.wrapShift( cellShift );
    gap -= cell.size.outerWidth;
  }
};

proto._unshiftCells = function( cells ) {
  if ( !cells || !cells.length ) {
    return;
  }
  for ( var i = 0; i < cells.length; i++ ) {
    cells[i].wrapShift( 0 );
  }
};

// -------------------------- physics -------------------------- //

proto.integratePhysics = function() {
  this.x += this.velocity;
  this.velocity *= this.getFrictionFactor();
};

proto.applyForce = function( force ) {
  this.velocity += force;
};

proto.getFrictionFactor = function() {
  return 1 - this.options[ this.isFreeScrolling ? 'freeScrollFriction' : 'friction' ];
};

proto.getRestingPosition = function() {
  // my thanks to Steven Wittens, who simplified this math greatly
  return this.x + this.velocity / ( 1 - this.getFrictionFactor() );
};

proto.applyDragForce = function() {
  if ( !this.isDraggable || !this.isPointerDown ) {
    return;
  }
  // change the position to drag position by applying force
  var dragVelocity = this.dragX - this.x;
  var dragForce = dragVelocity - this.velocity;
  this.applyForce( dragForce );
};

proto.applySelectedAttraction = function() {
  // do not attract if pointer down or no slides
  var dragDown = this.isDraggable && this.isPointerDown;
  if ( dragDown || this.isFreeScrolling || !this.slides.length ) {
    return;
  }
  var distance = this.selectedSlide.target * -1 - this.x;
  var force = distance * this.options.selectedAttraction;
  this.applyForce( force );
};

return proto;

} ) );


/***/ }),

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Flickity.Cell
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(131),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( getSize ) {
      return factory( window, getSize );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, getSize ) {

'use strict';

function Cell( elem, parent ) {
  this.element = elem;
  this.parent = parent;

  this.create();
}

var proto = Cell.prototype;

proto.create = function() {
  this.element.style.position = 'absolute';
  this.element.setAttribute( 'aria-hidden', 'true' );
  this.x = 0;
  this.shift = 0;
};

proto.destroy = function() {
  // reset style
  this.unselect();
  this.element.style.position = '';
  var side = this.parent.originSide;
  this.element.style[ side ] = '';
  this.element.removeAttribute('aria-hidden');
};

proto.getSize = function() {
  this.size = getSize( this.element );
};

proto.setPosition = function( x ) {
  this.x = x;
  this.updateTarget();
  this.renderPosition( x );
};

// setDefaultTarget v1 method, backwards compatibility, remove in v3
proto.updateTarget = proto.setDefaultTarget = function() {
  var marginProperty = this.parent.originSide == 'left' ? 'marginLeft' : 'marginRight';
  this.target = this.x + this.size[ marginProperty ] +
    this.size.width * this.parent.cellAlign;
};

proto.renderPosition = function( x ) {
  // render position of cell with in slider
  var side = this.parent.originSide;
  this.element.style[ side ] = this.parent.getPositionValue( x );
};

proto.select = function() {
  this.element.classList.add('is-selected');
  this.element.removeAttribute('aria-hidden');
};

proto.unselect = function() {
  this.element.classList.remove('is-selected');
  this.element.setAttribute( 'aria-hidden', 'true' );
};

/**
 * @param {Integer} shift - 0, 1, or -1
 */
proto.wrapShift = function( shift ) {
  this.shift = shift;
  this.renderPosition( this.x + this.parent.slideableWidth * shift );
};

proto.remove = function() {
  this.element.parentNode.removeChild( this.element );
};

return Cell;

} ) );


/***/ }),

/***/ 690:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// drag
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(842),
      __webpack_require__(47),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, Unidragger, utils ) {
      return factory( window, Flickity, Unidragger, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, Unidragger, utils ) {

'use strict';

// ----- defaults ----- //

utils.extend( Flickity.defaults, {
  draggable: '>1',
  dragThreshold: 3,
} );

// ----- create ----- //

Flickity.createMethods.push('_createDrag');

// -------------------------- drag prototype -------------------------- //

var proto = Flickity.prototype;
utils.extend( proto, Unidragger.prototype );
proto._touchActionValue = 'pan-y';

// --------------------------  -------------------------- //

var isTouch = 'createTouch' in document;
var isTouchmoveScrollCanceled = false;

proto._createDrag = function() {
  this.on( 'activate', this.onActivateDrag );
  this.on( 'uiChange', this._uiChangeDrag );
  this.on( 'deactivate', this.onDeactivateDrag );
  this.on( 'cellChange', this.updateDraggable );
  // TODO updateDraggable on resize? if groupCells & slides change
  // HACK - add seemingly innocuous handler to fix iOS 10 scroll behavior
  // #457, RubaXa/Sortable#973
  if ( isTouch && !isTouchmoveScrollCanceled ) {
    window.addEventListener( 'touchmove', function() {} );
    isTouchmoveScrollCanceled = true;
  }
};

proto.onActivateDrag = function() {
  this.handles = [ this.viewport ];
  this.bindHandles();
  this.updateDraggable();
};

proto.onDeactivateDrag = function() {
  this.unbindHandles();
  this.element.classList.remove('is-draggable');
};

proto.updateDraggable = function() {
  // disable dragging if less than 2 slides. #278
  if ( this.options.draggable == '>1' ) {
    this.isDraggable = this.slides.length > 1;
  } else {
    this.isDraggable = this.options.draggable;
  }
  if ( this.isDraggable ) {
    this.element.classList.add('is-draggable');
  } else {
    this.element.classList.remove('is-draggable');
  }
};

// backwards compatibility
proto.bindDrag = function() {
  this.options.draggable = true;
  this.updateDraggable();
};

proto.unbindDrag = function() {
  this.options.draggable = false;
  this.updateDraggable();
};

proto._uiChangeDrag = function() {
  delete this.isFreeScrolling;
};

// -------------------------- pointer events -------------------------- //

proto.pointerDown = function( event, pointer ) {
  if ( !this.isDraggable ) {
    this._pointerDownDefault( event, pointer );
    return;
  }
  var isOkay = this.okayPointerDown( event );
  if ( !isOkay ) {
    return;
  }

  this._pointerDownPreventDefault( event );
  this.pointerDownFocus( event );
  // blur
  if ( document.activeElement != this.element ) {
    // do not blur if already focused
    this.pointerDownBlur();
  }

  // stop if it was moving
  this.dragX = this.x;
  this.viewport.classList.add('is-pointer-down');
  // track scrolling
  this.pointerDownScroll = getScrollPosition();
  window.addEventListener( 'scroll', this );

  this._pointerDownDefault( event, pointer );
};

// default pointerDown logic, used for staticClick
proto._pointerDownDefault = function( event, pointer ) {
  // track start event position
  // Safari 9 overrides pageX and pageY. These values needs to be copied. #779
  this.pointerDownPointer = {
    pageX: pointer.pageX,
    pageY: pointer.pageY,
  };
  // bind move and end events
  this._bindPostStartEvents( event );
  this.dispatchEvent( 'pointerDown', event, [ pointer ] );
};

var focusNodes = {
  INPUT: true,
  TEXTAREA: true,
  SELECT: true,
};

proto.pointerDownFocus = function( event ) {
  var isFocusNode = focusNodes[ event.target.nodeName ];
  if ( !isFocusNode ) {
    this.focus();
  }
};

proto._pointerDownPreventDefault = function( event ) {
  var isTouchStart = event.type == 'touchstart';
  var isTouchPointer = event.pointerType == 'touch';
  var isFocusNode = focusNodes[ event.target.nodeName ];
  if ( !isTouchStart && !isTouchPointer && !isFocusNode ) {
    event.preventDefault();
  }
};

// ----- move ----- //

proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > this.options.dragThreshold;
};

// ----- up ----- //

proto.pointerUp = function( event, pointer ) {
  delete this.isTouchScrolling;
  this.viewport.classList.remove('is-pointer-down');
  this.dispatchEvent( 'pointerUp', event, [ pointer ] );
  this._dragPointerUp( event, pointer );
};

proto.pointerDone = function() {
  window.removeEventListener( 'scroll', this );
  delete this.pointerDownScroll;
};

// -------------------------- dragging -------------------------- //

proto.dragStart = function( event, pointer ) {
  if ( !this.isDraggable ) {
    return;
  }
  this.dragStartPosition = this.x;
  this.startAnimation();
  window.removeEventListener( 'scroll', this );
  this.dispatchEvent( 'dragStart', event, [ pointer ] );
};

proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.dispatchEvent( 'pointerMove', event, [ pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  if ( !this.isDraggable ) {
    return;
  }
  event.preventDefault();

  this.previousDragX = this.dragX;
  // reverse if right-to-left
  var direction = this.options.rightToLeft ? -1 : 1;
  if ( this.options.wrapAround ) {
    // wrap around move. #589
    moveVector.x %= this.slideableWidth;
  }
  var dragX = this.dragStartPosition + moveVector.x * direction;

  if ( !this.options.wrapAround && this.slides.length ) {
    // slow drag
    var originBound = Math.max( -this.slides[0].target, this.dragStartPosition );
    dragX = dragX > originBound ? ( dragX + originBound ) * 0.5 : dragX;
    var endBound = Math.min( -this.getLastSlide().target, this.dragStartPosition );
    dragX = dragX < endBound ? ( dragX + endBound ) * 0.5 : dragX;
  }

  this.dragX = dragX;

  this.dragMoveTime = new Date();
  this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
};

proto.dragEnd = function( event, pointer ) {
  if ( !this.isDraggable ) {
    return;
  }
  if ( this.options.freeScroll ) {
    this.isFreeScrolling = true;
  }
  // set selectedIndex based on where flick will end up
  var index = this.dragEndRestingSelect();

  if ( this.options.freeScroll && !this.options.wrapAround ) {
    // if free-scroll & not wrap around
    // do not free-scroll if going outside of bounding slides
    // so bounding slides can attract slider, and keep it in bounds
    var restingX = this.getRestingPosition();
    this.isFreeScrolling = -restingX > this.slides[0].target &&
      -restingX < this.getLastSlide().target;
  } else if ( !this.options.freeScroll && index == this.selectedIndex ) {
    // boost selection if selected index has not changed
    index += this.dragEndBoostSelect();
  }
  delete this.previousDragX;
  // apply selection
  // TODO refactor this, selecting here feels weird
  // HACK, set flag so dragging stays in correct direction
  this.isDragSelect = this.options.wrapAround;
  this.select( index );
  delete this.isDragSelect;
  this.dispatchEvent( 'dragEnd', event, [ pointer ] );
};

proto.dragEndRestingSelect = function() {
  var restingX = this.getRestingPosition();
  // how far away from selected slide
  var distance = Math.abs( this.getSlideDistance( -restingX, this.selectedIndex ) );
  // get closet resting going up and going down
  var positiveResting = this._getClosestResting( restingX, distance, 1 );
  var negativeResting = this._getClosestResting( restingX, distance, -1 );
  // use closer resting for wrap-around
  var index = positiveResting.distance < negativeResting.distance ?
    positiveResting.index : negativeResting.index;
  return index;
};

/**
 * given resting X and distance to selected cell
 * get the distance and index of the closest cell
 * @param {Number} restingX - estimated post-flick resting position
 * @param {Number} distance - distance to selected cell
 * @param {Integer} increment - +1 or -1, going up or down
 * @returns {Object} - { distance: {Number}, index: {Integer} }
 */
proto._getClosestResting = function( restingX, distance, increment ) {
  var index = this.selectedIndex;
  var minDistance = Infinity;
  var condition = this.options.contain && !this.options.wrapAround ?
    // if contain, keep going if distance is equal to minDistance
    function( dist, minDist ) {
      return dist <= minDist;
    } : function( dist, minDist ) {
      return dist < minDist;
    };
  while ( condition( distance, minDistance ) ) {
    // measure distance to next cell
    index += increment;
    minDistance = distance;
    distance = this.getSlideDistance( -restingX, index );
    if ( distance === null ) {
      break;
    }
    distance = Math.abs( distance );
  }
  return {
    distance: minDistance,
    // selected was previous index
    index: index - increment,
  };
};

/**
 * measure distance between x and a slide target
 * @param {Number} x - horizontal position
 * @param {Integer} index - slide index
 * @returns {Number} - slide distance
 */
proto.getSlideDistance = function( x, index ) {
  var len = this.slides.length;
  // wrap around if at least 2 slides
  var isWrapAround = this.options.wrapAround && len > 1;
  var slideIndex = isWrapAround ? utils.modulo( index, len ) : index;
  var slide = this.slides[ slideIndex ];
  if ( !slide ) {
    return null;
  }
  // add distance for wrap-around slides
  var wrap = isWrapAround ? this.slideableWidth * Math.floor( index/len ) : 0;
  return x - ( slide.target + wrap );
};

proto.dragEndBoostSelect = function() {
  // do not boost if no previousDragX or dragMoveTime
  if ( this.previousDragX === undefined || !this.dragMoveTime ||
    // or if drag was held for 100 ms
    new Date() - this.dragMoveTime > 100 ) {
    return 0;
  }

  var distance = this.getSlideDistance( -this.dragX, this.selectedIndex );
  var delta = this.previousDragX - this.dragX;
  if ( distance > 0 && delta > 0 ) {
    // boost to next if moving towards the right, and positive velocity
    return 1;
  } else if ( distance < 0 && delta < 0 ) {
    // boost to previous if moving towards the left, and negative velocity
    return -1;
  }
  return 0;
};

// ----- staticClick ----- //

proto.staticClick = function( event, pointer ) {
  // get clickedCell, if cell was clicked
  var clickedCell = this.getParentCell( event.target );
  var cellElem = clickedCell && clickedCell.element;
  var cellIndex = clickedCell && this.cells.indexOf( clickedCell );
  this.dispatchEvent( 'staticClick', event, [ pointer, cellElem, cellIndex ] );
};

// ----- scroll ----- //

proto.onscroll = function() {
  var scroll = getScrollPosition();
  var scrollMoveX = this.pointerDownScroll.x - scroll.x;
  var scrollMoveY = this.pointerDownScroll.y - scroll.y;
  // cancel click/tap if scroll is too much
  if ( Math.abs( scrollMoveX ) > 3 || Math.abs( scrollMoveY ) > 3 ) {
    this._pointerDone();
  }
};

// ----- utils ----- //

function getScrollPosition() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset,
  };
}

// -----  ----- //

return Flickity;

} ) );


/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Flickity main
/* eslint-disable max-params */
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(158),
      __webpack_require__(131),
      __webpack_require__(47),
      __webpack_require__(229),
      __webpack_require__(714),
      __webpack_require__(880),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( EvEmitter, getSize, utils, Cell, Slide, animatePrototype ) {
      return factory( window, EvEmitter, getSize, utils, Cell, Slide, animatePrototype );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var _Flickity; }

}( window, function factory( window, EvEmitter, getSize,
    utils, Cell, Slide, animatePrototype ) {

/* eslint-enable max-params */
'use strict';

// vars
var jQuery = window.jQuery;
var getComputedStyle = window.getComputedStyle;
var console = window.console;

function moveElements( elems, toElem ) {
  elems = utils.makeArray( elems );
  while ( elems.length ) {
    toElem.appendChild( elems.shift() );
  }
}

// -------------------------- Flickity -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Flickity intances
var instances = {};

function Flickity( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for Flickity: ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // do not initialize twice on same element
  if ( this.element.flickityGUID ) {
    var instance = instances[ this.element.flickityGUID ];
    if ( instance ) instance.option( options );
    return instance;
  }

  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }
  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // kick things off
  this._create();
}

Flickity.defaults = {
  accessibility: true,
  // adaptiveHeight: false,
  cellAlign: 'center',
  // cellSelector: undefined,
  // contain: false,
  freeScrollFriction: 0.075, // friction when free-scrolling
  friction: 0.28, // friction when selecting
  namespaceJQueryEvents: true,
  // initialIndex: 0,
  percentPosition: true,
  resize: true,
  selectedAttraction: 0.025,
  setGallerySize: true,
  // watchCSS: false,
  // wrapAround: false
};

// hash of methods triggered on _create()
Flickity.createMethods = [];

var proto = Flickity.prototype;
// inherit EventEmitter
utils.extend( proto, EvEmitter.prototype );

proto._create = function() {
  // add id for Flickity.data
  var id = this.guid = ++GUID;
  this.element.flickityGUID = id; // expando
  instances[ id ] = this; // associate via id
  // initial properties
  this.selectedIndex = 0;
  // how many frames slider has been in same position
  this.restingFrames = 0;
  // initial physics properties
  this.x = 0;
  this.velocity = 0;
  this.originSide = this.options.rightToLeft ? 'right' : 'left';
  // create viewport & slider
  this.viewport = document.createElement('div');
  this.viewport.className = 'flickity-viewport';
  this._createSlider();

  if ( this.options.resize || this.options.watchCSS ) {
    window.addEventListener( 'resize', this );
  }

  // add listeners from on option
  for ( var eventName in this.options.on ) {
    var listener = this.options.on[ eventName ];
    this.on( eventName, listener );
  }

  Flickity.createMethods.forEach( function( method ) {
    this[ method ]();
  }, this );

  if ( this.options.watchCSS ) {
    this.watchCSS();
  } else {
    this.activate();
  }

};

/**
 * set options
 * @param {Object} opts - options to extend
 */
proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

proto.activate = function() {
  if ( this.isActive ) {
    return;
  }
  this.isActive = true;
  this.element.classList.add('flickity-enabled');
  if ( this.options.rightToLeft ) {
    this.element.classList.add('flickity-rtl');
  }

  this.getSize();
  // move initial cell elements so they can be loaded as cells
  var cellElems = this._filterFindCellElements( this.element.children );
  moveElements( cellElems, this.slider );
  this.viewport.appendChild( this.slider );
  this.element.appendChild( this.viewport );
  // get cells from children
  this.reloadCells();

  if ( this.options.accessibility ) {
    // allow element to focusable
    this.element.tabIndex = 0;
    // listen for key presses
    this.element.addEventListener( 'keydown', this );
  }

  this.emitEvent('activate');
  this.selectInitialIndex();
  // flag for initial activation, for using initialIndex
  this.isInitActivated = true;
  // ready event. #493
  this.dispatchEvent('ready');
};

// slider positions the cells
proto._createSlider = function() {
  // slider element does all the positioning
  var slider = document.createElement('div');
  slider.className = 'flickity-slider';
  slider.style[ this.originSide ] = 0;
  this.slider = slider;
};

proto._filterFindCellElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.cellSelector );
};

// goes through all children
proto.reloadCells = function() {
  // collection of item elements
  this.cells = this._makeCells( this.slider.children );
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
};

/**
 * turn elements into Flickity.Cells
 * @param {[Array, NodeList, HTMLElement]} elems - elements to make into cells
 * @returns {Array} items - collection of new Flickity Cells
 */
proto._makeCells = function( elems ) {
  var cellElems = this._filterFindCellElements( elems );

  // create new Flickity for collection
  var cells = cellElems.map( function( cellElem ) {
    return new Cell( cellElem, this );
  }, this );

  return cells;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.getLastSlide = function() {
  return this.slides[ this.slides.length - 1 ];
};

// positions all cells
proto.positionCells = function() {
  // size all cells
  this._sizeCells( this.cells );
  // position all cells
  this._positionCells( 0 );
};

/**
 * position certain cells
 * @param {Integer} index - which cell to start with
 */
proto._positionCells = function( index ) {
  index = index || 0;
  // also measure maxCellHeight
  // start 0 if positioning all cells
  this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
  var cellX = 0;
  // get cellX
  if ( index > 0 ) {
    var startCell = this.cells[ index - 1 ];
    cellX = startCell.x + startCell.size.outerWidth;
  }
  var len = this.cells.length;
  for ( var i = index; i < len; i++ ) {
    var cell = this.cells[i];
    cell.setPosition( cellX );
    cellX += cell.size.outerWidth;
    this.maxCellHeight = Math.max( cell.size.outerHeight, this.maxCellHeight );
  }
  // keep track of cellX for wrap-around
  this.slideableWidth = cellX;
  // slides
  this.updateSlides();
  // contain slides target
  this._containSlides();
  // update slidesWidth
  this.slidesWidth = len ? this.getLastSlide().target - this.slides[0].target : 0;
};

/**
 * cell.getSize() on multiple cells
 * @param {Array} cells - cells to size
 */
proto._sizeCells = function( cells ) {
  cells.forEach( function( cell ) {
    cell.getSize();
  } );
};

// --------------------------  -------------------------- //

proto.updateSlides = function() {
  this.slides = [];
  if ( !this.cells.length ) {
    return;
  }

  var slide = new Slide( this );
  this.slides.push( slide );
  var isOriginLeft = this.originSide == 'left';
  var nextMargin = isOriginLeft ? 'marginRight' : 'marginLeft';

  var canCellFit = this._getCanCellFit();

  this.cells.forEach( function( cell, i ) {
    // just add cell if first cell in slide
    if ( !slide.cells.length ) {
      slide.addCell( cell );
      return;
    }

    var slideWidth = ( slide.outerWidth - slide.firstMargin ) +
      ( cell.size.outerWidth - cell.size[ nextMargin ] );

    if ( canCellFit.call( this, i, slideWidth ) ) {
      slide.addCell( cell );
    } else {
      // doesn't fit, new slide
      slide.updateTarget();

      slide = new Slide( this );
      this.slides.push( slide );
      slide.addCell( cell );
    }
  }, this );
  // last slide
  slide.updateTarget();
  // update .selectedSlide
  this.updateSelectedSlide();
};

proto._getCanCellFit = function() {
  var groupCells = this.options.groupCells;
  if ( !groupCells ) {
    return function() {
      return false;
    };
  } else if ( typeof groupCells == 'number' ) {
    // group by number. 3 -> [0,1,2], [3,4,5], ...
    var number = parseInt( groupCells, 10 );
    return function( i ) {
      return ( i % number ) !== 0;
    };
  }
  // default, group by width of slide
  // parse '75%
  var percentMatch = typeof groupCells == 'string' &&
    groupCells.match( /^(\d+)%$/ );
  var percent = percentMatch ? parseInt( percentMatch[1], 10 ) / 100 : 1;
  return function( i, slideWidth ) {
    /* eslint-disable-next-line no-invalid-this */
    return slideWidth <= ( this.size.innerWidth + 1 ) * percent;
  };
};

// alias _init for jQuery plugin .flickity()
proto._init =
proto.reposition = function() {
  this.positionCells();
  this.positionSliderAtSelected();
};

proto.getSize = function() {
  this.size = getSize( this.element );
  this.setCellAlign();
  this.cursorPosition = this.size.innerWidth * this.cellAlign;
};

var cellAlignShorthands = {
  // cell align, then based on origin side
  center: {
    left: 0.5,
    right: 0.5,
  },
  left: {
    left: 0,
    right: 1,
  },
  right: {
    right: 0,
    left: 1,
  },
};

proto.setCellAlign = function() {
  var shorthand = cellAlignShorthands[ this.options.cellAlign ];
  this.cellAlign = shorthand ? shorthand[ this.originSide ] : this.options.cellAlign;
};

proto.setGallerySize = function() {
  if ( this.options.setGallerySize ) {
    var height = this.options.adaptiveHeight && this.selectedSlide ?
      this.selectedSlide.height : this.maxCellHeight;
    this.viewport.style.height = height + 'px';
  }
};

proto._getWrapShiftCells = function() {
  // only for wrap-around
  if ( !this.options.wrapAround ) {
    return;
  }
  // unshift previous cells
  this._unshiftCells( this.beforeShiftCells );
  this._unshiftCells( this.afterShiftCells );
  // get before cells
  // initial gap
  var gapX = this.cursorPosition;
  var cellIndex = this.cells.length - 1;
  this.beforeShiftCells = this._getGapCells( gapX, cellIndex, -1 );
  // get after cells
  // ending gap between last cell and end of gallery viewport
  gapX = this.size.innerWidth - this.cursorPosition;
  // start cloning at first cell, working forwards
  this.afterShiftCells = this._getGapCells( gapX, 0, 1 );
};

proto._getGapCells = function( gapX, cellIndex, increment ) {
  // keep adding cells until the cover the initial gap
  var cells = [];
  while ( gapX > 0 ) {
    var cell = this.cells[ cellIndex ];
    if ( !cell ) {
      break;
    }
    cells.push( cell );
    cellIndex += increment;
    gapX -= cell.size.outerWidth;
  }
  return cells;
};

// ----- contain ----- //

// contain cell targets so no excess sliding
proto._containSlides = function() {
  if ( !this.options.contain || this.options.wrapAround || !this.cells.length ) {
    return;
  }
  var isRightToLeft = this.options.rightToLeft;
  var beginMargin = isRightToLeft ? 'marginRight' : 'marginLeft';
  var endMargin = isRightToLeft ? 'marginLeft' : 'marginRight';
  var contentWidth = this.slideableWidth - this.getLastCell().size[ endMargin ];
  // content is less than gallery size
  var isContentSmaller = contentWidth < this.size.innerWidth;
  // bounds
  var beginBound = this.cursorPosition + this.cells[0].size[ beginMargin ];
  var endBound = contentWidth - this.size.innerWidth * ( 1 - this.cellAlign );
  // contain each cell target
  this.slides.forEach( function( slide ) {
    if ( isContentSmaller ) {
      // all cells fit inside gallery
      slide.target = contentWidth * this.cellAlign;
    } else {
      // contain to bounds
      slide.target = Math.max( slide.target, beginBound );
      slide.target = Math.min( slide.target, endBound );
    }
  }, this );
};

// -----  ----- //

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
proto.dispatchEvent = function( type, event, args ) {
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery && this.$element ) {
    // default trigger with type if no event
    type += this.options.namespaceJQueryEvents ? '.flickity' : '';
    var $event = type;
    if ( event ) {
      // create jQuery event
      var jQEvent = new jQuery.Event( event );
      jQEvent.type = type;
      $event = jQEvent;
    }
    this.$element.trigger( $event, args );
  }
};

// -------------------------- select -------------------------- //

/**
 * @param {Integer} index - index of the slide
 * @param {Boolean} isWrap - will wrap-around to last/first if at the end
 * @param {Boolean} isInstant - will immediately set position at selected cell
 */
proto.select = function( index, isWrap, isInstant ) {
  if ( !this.isActive ) {
    return;
  }
  index = parseInt( index, 10 );
  this._wrapSelect( index );

  if ( this.options.wrapAround || isWrap ) {
    index = utils.modulo( index, this.slides.length );
  }
  // bail if invalid index
  if ( !this.slides[ index ] ) {
    return;
  }
  var prevIndex = this.selectedIndex;
  this.selectedIndex = index;
  this.updateSelectedSlide();
  if ( isInstant ) {
    this.positionSliderAtSelected();
  } else {
    this.startAnimation();
  }
  if ( this.options.adaptiveHeight ) {
    this.setGallerySize();
  }
  // events
  this.dispatchEvent( 'select', null, [ index ] );
  // change event if new index
  if ( index != prevIndex ) {
    this.dispatchEvent( 'change', null, [ index ] );
  }
  // old v1 event name, remove in v3
  this.dispatchEvent('cellSelect');
};

// wraps position for wrapAround, to move to closest slide. #113
proto._wrapSelect = function( index ) {
  var len = this.slides.length;
  var isWrapping = this.options.wrapAround && len > 1;
  if ( !isWrapping ) {
    return index;
  }
  var wrapIndex = utils.modulo( index, len );
  // go to shortest
  var delta = Math.abs( wrapIndex - this.selectedIndex );
  var backWrapDelta = Math.abs( ( wrapIndex + len ) - this.selectedIndex );
  var forewardWrapDelta = Math.abs( ( wrapIndex - len ) - this.selectedIndex );
  if ( !this.isDragSelect && backWrapDelta < delta ) {
    index += len;
  } else if ( !this.isDragSelect && forewardWrapDelta < delta ) {
    index -= len;
  }
  // wrap position so slider is within normal area
  if ( index < 0 ) {
    this.x -= this.slideableWidth;
  } else if ( index >= len ) {
    this.x += this.slideableWidth;
  }
};

proto.previous = function( isWrap, isInstant ) {
  this.select( this.selectedIndex - 1, isWrap, isInstant );
};

proto.next = function( isWrap, isInstant ) {
  this.select( this.selectedIndex + 1, isWrap, isInstant );
};

proto.updateSelectedSlide = function() {
  var slide = this.slides[ this.selectedIndex ];
  // selectedIndex could be outside of slides, if triggered before resize()
  if ( !slide ) {
    return;
  }
  // unselect previous selected slide
  this.unselectSelectedSlide();
  // update new selected slide
  this.selectedSlide = slide;
  slide.select();
  this.selectedCells = slide.cells;
  this.selectedElements = slide.getCellElements();
  // HACK: selectedCell & selectedElement is first cell in slide, backwards compatibility
  // Remove in v3?
  this.selectedCell = slide.cells[0];
  this.selectedElement = this.selectedElements[0];
};

proto.unselectSelectedSlide = function() {
  if ( this.selectedSlide ) {
    this.selectedSlide.unselect();
  }
};

proto.selectInitialIndex = function() {
  var initialIndex = this.options.initialIndex;
  // already activated, select previous selectedIndex
  if ( this.isInitActivated ) {
    this.select( this.selectedIndex, false, true );
    return;
  }
  // select with selector string
  if ( initialIndex && typeof initialIndex == 'string' ) {
    var cell = this.queryCell( initialIndex );
    if ( cell ) {
      this.selectCell( initialIndex, false, true );
      return;
    }
  }

  var index = 0;
  // select with number
  if ( initialIndex && this.slides[ initialIndex ] ) {
    index = initialIndex;
  }
  // select instantly
  this.select( index, false, true );
};

/**
 * select slide from number or cell element
 * @param {[Element, Number]} value - zero-based index or element to select
 * @param {Boolean} isWrap - enables wrapping around for extra index
 * @param {Boolean} isInstant - disables slide animation
 */
proto.selectCell = function( value, isWrap, isInstant ) {
  // get cell
  var cell = this.queryCell( value );
  if ( !cell ) {
    return;
  }

  var index = this.getCellSlideIndex( cell );
  this.select( index, isWrap, isInstant );
};

proto.getCellSlideIndex = function( cell ) {
  // get index of slides that has cell
  for ( var i = 0; i < this.slides.length; i++ ) {
    var slide = this.slides[i];
    var index = slide.cells.indexOf( cell );
    if ( index != -1 ) {
      return i;
    }
  }
};

// -------------------------- get cells -------------------------- //

/**
 * get Flickity.Cell, given an Element
 * @param {Element} elem - matching cell element
 * @returns {Flickity.Cell} cell - matching cell
 */
proto.getCell = function( elem ) {
  // loop through cells to get the one that matches
  for ( var i = 0; i < this.cells.length; i++ ) {
    var cell = this.cells[i];
    if ( cell.element == elem ) {
      return cell;
    }
  }
};

/**
 * get collection of Flickity.Cells, given Elements
 * @param {[Element, Array, NodeList]} elems - multiple elements
 * @returns {Array} cells - Flickity.Cells
 */
proto.getCells = function( elems ) {
  elems = utils.makeArray( elems );
  var cells = [];
  elems.forEach( function( elem ) {
    var cell = this.getCell( elem );
    if ( cell ) {
      cells.push( cell );
    }
  }, this );
  return cells;
};

/**
 * get cell elements
 * @returns {Array} cellElems
 */
proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  } );
};

/**
 * get parent cell from an element
 * @param {Element} elem - child element
 * @returns {Flickit.Cell} cell - parent cell
 */
proto.getParentCell = function( elem ) {
  // first check if elem is cell
  var cell = this.getCell( elem );
  if ( cell ) {
    return cell;
  }
  // try to get parent cell elem
  elem = utils.getParent( elem, '.flickity-slider > *' );
  return this.getCell( elem );
};

/**
 * get cells adjacent to a slide
 * @param {Integer} adjCount - number of adjacent slides
 * @param {Integer} index - index of slide to start
 * @returns {Array} cells - array of Flickity.Cells
 */
proto.getAdjacentCellElements = function( adjCount, index ) {
  if ( !adjCount ) {
    return this.selectedSlide.getCellElements();
  }
  index = index === undefined ? this.selectedIndex : index;

  var len = this.slides.length;
  if ( 1 + ( adjCount * 2 ) >= len ) {
    return this.getCellElements();
  }

  var cellElems = [];
  for ( var i = index - adjCount; i <= index + adjCount; i++ ) {
    var slideIndex = this.options.wrapAround ? utils.modulo( i, len ) : i;
    var slide = this.slides[ slideIndex ];
    if ( slide ) {
      cellElems = cellElems.concat( slide.getCellElements() );
    }
  }
  return cellElems;
};

/**
 * select slide from number or cell element
 * @param {[Element, String, Number]} selector - element, selector string, or index
 * @returns {Flickity.Cell} - matching cell
 */
proto.queryCell = function( selector ) {
  if ( typeof selector == 'number' ) {
    // use number as index
    return this.cells[ selector ];
  }
  if ( typeof selector == 'string' ) {
    // do not select invalid selectors from hash: #123, #/. #791
    if ( selector.match( /^[#.]?[\d/]/ ) ) {
      return;
    }
    // use string as selector, get element
    selector = this.element.querySelector( selector );
  }
  // get cell from element
  return this.getCell( selector );
};

// -------------------------- events -------------------------- //

proto.uiChange = function() {
  this.emitEvent('uiChange');
};

// keep focus on element when child UI elements are clicked
proto.childUIPointerDown = function( event ) {
  // HACK iOS does not allow touch events to bubble up?!
  if ( event.type != 'touchstart' ) {
    event.preventDefault();
  }
  this.focus();
};

// ----- resize ----- //

proto.onresize = function() {
  this.watchCSS();
  this.resize();
};

utils.debounceMethod( Flickity, 'onresize', 150 );

proto.resize = function() {
  if ( !this.isActive ) {
    return;
  }
  this.getSize();
  // wrap values
  if ( this.options.wrapAround ) {
    this.x = utils.modulo( this.x, this.slideableWidth );
  }
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
  this.emitEvent('resize');
  // update selected index for group slides, instant
  // TODO: position can be lost between groups of various numbers
  var selectedElement = this.selectedElements && this.selectedElements[0];
  this.selectCell( selectedElement, false, true );
};

// watches the :after property, activates/deactivates
proto.watchCSS = function() {
  var watchOption = this.options.watchCSS;
  if ( !watchOption ) {
    return;
  }

  var afterContent = getComputedStyle( this.element, ':after' ).content;
  // activate if :after { content: 'flickity' }
  if ( afterContent.indexOf('flickity') != -1 ) {
    this.activate();
  } else {
    this.deactivate();
  }
};

// ----- keydown ----- //

// go previous/next if left/right keys pressed
proto.onkeydown = function( event ) {
  // only work if element is in focus
  var isNotFocused = document.activeElement && document.activeElement != this.element;
  if ( !this.options.accessibility || isNotFocused ) {
    return;
  }

  var handler = Flickity.keyboardHandlers[ event.keyCode ];
  if ( handler ) {
    handler.call( this );
  }
};

Flickity.keyboardHandlers = {
  // left arrow
  37: function() {
    var leftMethod = this.options.rightToLeft ? 'next' : 'previous';
    this.uiChange();
    this[ leftMethod ]();
  },
  // right arrow
  39: function() {
    var rightMethod = this.options.rightToLeft ? 'previous' : 'next';
    this.uiChange();
    this[ rightMethod ]();
  },
};

// ----- focus ----- //

proto.focus = function() {
  // TODO remove scrollTo once focus options gets more support
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus ...
  //    #Browser_compatibility
  var prevScrollY = window.pageYOffset;
  this.element.focus({ preventScroll: true });
  // hack to fix scroll jump after focus, #76
  if ( window.pageYOffset != prevScrollY ) {
    window.scrollTo( window.pageXOffset, prevScrollY );
  }
};

// -------------------------- destroy -------------------------- //

// deactivate all Flickity functionality, but keep stuff available
proto.deactivate = function() {
  if ( !this.isActive ) {
    return;
  }
  this.element.classList.remove('flickity-enabled');
  this.element.classList.remove('flickity-rtl');
  this.unselectSelectedSlide();
  // destroy cells
  this.cells.forEach( function( cell ) {
    cell.destroy();
  } );
  this.element.removeChild( this.viewport );
  // move child elements back into element
  moveElements( this.slider.children, this.element );
  if ( this.options.accessibility ) {
    this.element.removeAttribute('tabIndex');
    this.element.removeEventListener( 'keydown', this );
  }
  // set flags
  this.isActive = false;
  this.emitEvent('deactivate');
};

proto.destroy = function() {
  this.deactivate();
  window.removeEventListener( 'resize', this );
  this.allOff();
  this.emitEvent('destroy');
  if ( jQuery && this.$element ) {
    jQuery.removeData( this.element, 'flickity' );
  }
  delete this.element.flickityGUID;
  delete instances[ this.guid ];
};

// -------------------------- prototype -------------------------- //

utils.extend( proto, animatePrototype );

// -------------------------- extras -------------------------- //

/**
 * get Flickity instance from element
 * @param {[Element, String]} elem - element or selector string
 * @returns {Flickity} - Flickity instance
 */
Flickity.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.flickityGUID;
  return id && instances[ id ];
};

utils.htmlInit( Flickity, 'flickity' );

if ( jQuery && jQuery.bridget ) {
  jQuery.bridget( 'flickity', Flickity );
}

// set internal jQuery, for Webpack + jQuery v3, #478
Flickity.setJQuery = function( jq ) {
  jQuery = jq;
};

Flickity.Cell = Cell;
Flickity.Slide = Slide;

return Flickity;

} ) );


/***/ }),

/***/ 442:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Flickity v2.2.2
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2021 Metafizzy
 */

( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(690),
      __webpack_require__(410),
      __webpack_require__(573),
      __webpack_require__(516),
      __webpack_require__(597),
      __webpack_require__(227),
    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

} )( window, function factory( Flickity ) {
  return Flickity;
} );


/***/ }),

/***/ 227:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// lazyload
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(47),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, utils ) {
      return factory( window, Flickity, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, utils ) {
'use strict';

Flickity.createMethods.push('_createLazyload');
var proto = Flickity.prototype;

proto._createLazyload = function() {
  this.on( 'select', this.lazyLoad );
};

proto.lazyLoad = function() {
  var lazyLoad = this.options.lazyLoad;
  if ( !lazyLoad ) {
    return;
  }
  // get adjacent cells, use lazyLoad option for adjacent count
  var adjCount = typeof lazyLoad == 'number' ? lazyLoad : 0;
  var cellElems = this.getAdjacentCellElements( adjCount );
  // get lazy images in those cells
  var lazyImages = [];
  cellElems.forEach( function( cellElem ) {
    var lazyCellImages = getCellLazyImages( cellElem );
    lazyImages = lazyImages.concat( lazyCellImages );
  } );
  // load lazy images
  lazyImages.forEach( function( img ) {
    new LazyLoader( img, this );
  }, this );
};

function getCellLazyImages( cellElem ) {
  // check if cell element is lazy image
  if ( cellElem.nodeName == 'IMG' ) {
    var lazyloadAttr = cellElem.getAttribute('data-flickity-lazyload');
    var srcAttr = cellElem.getAttribute('data-flickity-lazyload-src');
    var srcsetAttr = cellElem.getAttribute('data-flickity-lazyload-srcset');
    if ( lazyloadAttr || srcAttr || srcsetAttr ) {
      return [ cellElem ];
    }
  }
  // select lazy images in cell
  var lazySelector = 'img[data-flickity-lazyload], ' +
    'img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]';
  var imgs = cellElem.querySelectorAll( lazySelector );
  return utils.makeArray( imgs );
}

// -------------------------- LazyLoader -------------------------- //

/**
 * class to handle loading images
 * @param {Image} img - Image element
 * @param {Flickity} flickity - Flickity instance
 */
function LazyLoader( img, flickity ) {
  this.img = img;
  this.flickity = flickity;
  this.load();
}

LazyLoader.prototype.handleEvent = utils.handleEvent;

LazyLoader.prototype.load = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  // get src & srcset
  var src = this.img.getAttribute('data-flickity-lazyload') ||
    this.img.getAttribute('data-flickity-lazyload-src');
  var srcset = this.img.getAttribute('data-flickity-lazyload-srcset');
  // set src & serset
  this.img.src = src;
  if ( srcset ) {
    this.img.setAttribute( 'srcset', srcset );
  }
  // remove attr
  this.img.removeAttribute('data-flickity-lazyload');
  this.img.removeAttribute('data-flickity-lazyload-src');
  this.img.removeAttribute('data-flickity-lazyload-srcset');
};

LazyLoader.prototype.onload = function( event ) {
  this.complete( event, 'flickity-lazyloaded' );
};

LazyLoader.prototype.onerror = function( event ) {
  this.complete( event, 'flickity-lazyerror' );
};

LazyLoader.prototype.complete = function( event, className ) {
  // unbind events
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );

  var cell = this.flickity.getParentCell( this.img );
  var cellElem = cell && cell.element;
  this.flickity.cellSizeChange( cellElem );

  this.img.classList.add( className );
  this.flickity.dispatchEvent( 'lazyLoad', event, cellElem );
};

// -----  ----- //

Flickity.LazyLoader = LazyLoader;

return Flickity;

} ) );


/***/ }),

/***/ 573:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// page dots
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(704),
      __webpack_require__(47),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, Unipointer, utils ) {
      return factory( window, Flickity, Unipointer, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, Unipointer, utils ) {

// -------------------------- PageDots -------------------------- //

'use strict';

function PageDots( parent ) {
  this.parent = parent;
  this._create();
}

PageDots.prototype = Object.create( Unipointer.prototype );

PageDots.prototype._create = function() {
  // create holder element
  this.holder = document.createElement('ol');
  this.holder.className = 'flickity-page-dots';
  // create dots, array of elements
  this.dots = [];
  // events
  this.handleClick = this.onClick.bind( this );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PageDots.prototype.activate = function() {
  this.setDots();
  this.holder.addEventListener( 'click', this.handleClick );
  this.bindStartEvent( this.holder );
  // add to DOM
  this.parent.element.appendChild( this.holder );
};

PageDots.prototype.deactivate = function() {
  this.holder.removeEventListener( 'click', this.handleClick );
  this.unbindStartEvent( this.holder );
  // remove from DOM
  this.parent.element.removeChild( this.holder );
};

PageDots.prototype.setDots = function() {
  // get difference between number of slides and number of dots
  var delta = this.parent.slides.length - this.dots.length;
  if ( delta > 0 ) {
    this.addDots( delta );
  } else if ( delta < 0 ) {
    this.removeDots( -delta );
  }
};

PageDots.prototype.addDots = function( count ) {
  var fragment = document.createDocumentFragment();
  var newDots = [];
  var length = this.dots.length;
  var max = length + count;

  for ( var i = length; i < max; i++ ) {
    var dot = document.createElement('li');
    dot.className = 'dot';
    dot.setAttribute( 'aria-label', 'Page dot ' + ( i + 1 ) );
    fragment.appendChild( dot );
    newDots.push( dot );
  }

  this.holder.appendChild( fragment );
  this.dots = this.dots.concat( newDots );
};

PageDots.prototype.removeDots = function( count ) {
  // remove from this.dots collection
  var removeDots = this.dots.splice( this.dots.length - count, count );
  // remove from DOM
  removeDots.forEach( function( dot ) {
    this.holder.removeChild( dot );
  }, this );
};

PageDots.prototype.updateSelected = function() {
  // remove selected class on previous
  if ( this.selectedDot ) {
    this.selectedDot.className = 'dot';
    this.selectedDot.removeAttribute('aria-current');
  }
  // don't proceed if no dots
  if ( !this.dots.length ) {
    return;
  }
  this.selectedDot = this.dots[ this.parent.selectedIndex ];
  this.selectedDot.className = 'dot is-selected';
  this.selectedDot.setAttribute( 'aria-current', 'step' );
};

PageDots.prototype.onTap = // old method name, backwards-compatible
PageDots.prototype.onClick = function( event ) {
  var target = event.target;
  // only care about dot clicks
  if ( target.nodeName != 'LI' ) {
    return;
  }

  this.parent.uiChange();
  var index = this.dots.indexOf( target );
  this.parent.select( index );
};

PageDots.prototype.destroy = function() {
  this.deactivate();
  this.allOff();
};

Flickity.PageDots = PageDots;

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pageDots: true,
} );

Flickity.createMethods.push('_createPageDots');

var proto = Flickity.prototype;

proto._createPageDots = function() {
  if ( !this.options.pageDots ) {
    return;
  }
  this.pageDots = new PageDots( this );
  // events
  this.on( 'activate', this.activatePageDots );
  this.on( 'select', this.updateSelectedPageDots );
  this.on( 'cellChange', this.updatePageDots );
  this.on( 'resize', this.updatePageDots );
  this.on( 'deactivate', this.deactivatePageDots );
};

proto.activatePageDots = function() {
  this.pageDots.activate();
};

proto.updateSelectedPageDots = function() {
  this.pageDots.updateSelected();
};

proto.updatePageDots = function() {
  this.pageDots.setDots();
};

proto.deactivatePageDots = function() {
  this.pageDots.deactivate();
};

// -----  ----- //

Flickity.PageDots = PageDots;

return Flickity;

} ) );


/***/ }),

/***/ 516:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// player & autoPlay
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(158),
      __webpack_require__(47),
      __webpack_require__(217),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( EvEmitter, utils, Flickity ) {
      return factory( EvEmitter, utils, Flickity );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( EvEmitter, utils, Flickity ) {

'use strict';

// -------------------------- Player -------------------------- //

function Player( parent ) {
  this.parent = parent;
  this.state = 'stopped';
  // visibility change event handler
  this.onVisibilityChange = this.visibilityChange.bind( this );
  this.onVisibilityPlay = this.visibilityPlay.bind( this );
}

Player.prototype = Object.create( EvEmitter.prototype );

// start play
Player.prototype.play = function() {
  if ( this.state == 'playing' ) {
    return;
  }
  // do not play if page is hidden, start playing when page is visible
  var isPageHidden = document.hidden;
  if ( isPageHidden ) {
    document.addEventListener( 'visibilitychange', this.onVisibilityPlay );
    return;
  }

  this.state = 'playing';
  // listen to visibility change
  document.addEventListener( 'visibilitychange', this.onVisibilityChange );
  // start ticking
  this.tick();
};

Player.prototype.tick = function() {
  // do not tick if not playing
  if ( this.state != 'playing' ) {
    return;
  }

  var time = this.parent.options.autoPlay;
  // default to 3 seconds
  time = typeof time == 'number' ? time : 3000;
  var _this = this;
  // HACK: reset ticks if stopped and started within interval
  this.clear();
  this.timeout = setTimeout( function() {
    _this.parent.next( true );
    _this.tick();
  }, time );
};

Player.prototype.stop = function() {
  this.state = 'stopped';
  this.clear();
  // remove visibility change event
  document.removeEventListener( 'visibilitychange', this.onVisibilityChange );
};

Player.prototype.clear = function() {
  clearTimeout( this.timeout );
};

Player.prototype.pause = function() {
  if ( this.state == 'playing' ) {
    this.state = 'paused';
    this.clear();
  }
};

Player.prototype.unpause = function() {
  // re-start play if paused
  if ( this.state == 'paused' ) {
    this.play();
  }
};

// pause if page visibility is hidden, unpause if visible
Player.prototype.visibilityChange = function() {
  var isPageHidden = document.hidden;
  this[ isPageHidden ? 'pause' : 'unpause' ]();
};

Player.prototype.visibilityPlay = function() {
  this.play();
  document.removeEventListener( 'visibilitychange', this.onVisibilityPlay );
};

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pauseAutoPlayOnHover: true,
} );

Flickity.createMethods.push('_createPlayer');
var proto = Flickity.prototype;

proto._createPlayer = function() {
  this.player = new Player( this );

  this.on( 'activate', this.activatePlayer );
  this.on( 'uiChange', this.stopPlayer );
  this.on( 'pointerDown', this.stopPlayer );
  this.on( 'deactivate', this.deactivatePlayer );
};

proto.activatePlayer = function() {
  if ( !this.options.autoPlay ) {
    return;
  }
  this.player.play();
  this.element.addEventListener( 'mouseenter', this );
};

// Player API, don't hate the ... thanks I know where the door is

proto.playPlayer = function() {
  this.player.play();
};

proto.stopPlayer = function() {
  this.player.stop();
};

proto.pausePlayer = function() {
  this.player.pause();
};

proto.unpausePlayer = function() {
  this.player.unpause();
};

proto.deactivatePlayer = function() {
  this.player.stop();
  this.element.removeEventListener( 'mouseenter', this );
};

// ----- mouseenter/leave ----- //

// pause auto-play on hover
proto.onmouseenter = function() {
  if ( !this.options.pauseAutoPlayOnHover ) {
    return;
  }
  this.player.pause();
  this.element.addEventListener( 'mouseleave', this );
};

// resume auto-play on hover off
proto.onmouseleave = function() {
  this.player.unpause();
  this.element.removeEventListener( 'mouseleave', this );
};

// -----  ----- //

Flickity.Player = Player;

return Flickity;

} ) );


/***/ }),

/***/ 410:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// prev/next buttons
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(704),
      __webpack_require__(47),
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, Unipointer, utils ) {
      return factory( window, Flickity, Unipointer, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, Unipointer, utils ) {
'use strict';

var svgURI = 'http://www.w3.org/2000/svg';

// -------------------------- PrevNextButton -------------------------- //

function PrevNextButton( direction, parent ) {
  this.direction = direction;
  this.parent = parent;
  this._create();
}

PrevNextButton.prototype = Object.create( Unipointer.prototype );

PrevNextButton.prototype._create = function() {
  // properties
  this.isEnabled = true;
  this.isPrevious = this.direction == -1;
  var leftDirection = this.parent.options.rightToLeft ? 1 : -1;
  this.isLeft = this.direction == leftDirection;

  var element = this.element = document.createElement('button');
  element.className = 'flickity-button flickity-prev-next-button';
  element.className += this.isPrevious ? ' previous' : ' next';
  // prevent button from submitting form http://stackoverflow.com/a/10836076/182183
  element.setAttribute( 'type', 'button' );
  // init as disabled
  this.disable();

  element.setAttribute( 'aria-label', this.isPrevious ? 'Previous' : 'Next' );

  // create arrow
  var svg = this.createSVG();
  element.appendChild( svg );
  // events
  this.parent.on( 'select', this.update.bind( this ) );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PrevNextButton.prototype.activate = function() {
  this.bindStartEvent( this.element );
  this.element.addEventListener( 'click', this );
  // add to DOM
  this.parent.element.appendChild( this.element );
};

PrevNextButton.prototype.deactivate = function() {
  // remove from DOM
  this.parent.element.removeChild( this.element );
  // click events
  this.unbindStartEvent( this.element );
  this.element.removeEventListener( 'click', this );
};

PrevNextButton.prototype.createSVG = function() {
  var svg = document.createElementNS( svgURI, 'svg' );
  svg.setAttribute( 'class', 'flickity-button-icon' );
  svg.setAttribute( 'viewBox', '0 0 100 100' );
  var path = document.createElementNS( svgURI, 'path' );
  var pathMovements = getArrowMovements( this.parent.options.arrowShape );
  path.setAttribute( 'd', pathMovements );
  path.setAttribute( 'class', 'arrow' );
  // rotate arrow
  if ( !this.isLeft ) {
    path.setAttribute( 'transform', 'translate(100, 100) rotate(180) ' );
  }
  svg.appendChild( path );
  return svg;
};

// get SVG path movmement
function getArrowMovements( shape ) {
  // use shape as movement if string
  if ( typeof shape == 'string' ) {
    return shape;
  }
  // create movement string
  return 'M ' + shape.x0 + ',50' +
    ' L ' + shape.x1 + ',' + ( shape.y1 + 50 ) +
    ' L ' + shape.x2 + ',' + ( shape.y2 + 50 ) +
    ' L ' + shape.x3 + ',50 ' +
    ' L ' + shape.x2 + ',' + ( 50 - shape.y2 ) +
    ' L ' + shape.x1 + ',' + ( 50 - shape.y1 ) +
    ' Z';
}

PrevNextButton.prototype.handleEvent = utils.handleEvent;

PrevNextButton.prototype.onclick = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.parent.uiChange();
  var method = this.isPrevious ? 'previous' : 'next';
  this.parent[ method ]();
};

// -----  ----- //

PrevNextButton.prototype.enable = function() {
  if ( this.isEnabled ) {
    return;
  }
  this.element.disabled = false;
  this.isEnabled = true;
};

PrevNextButton.prototype.disable = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.element.disabled = true;
  this.isEnabled = false;
};

PrevNextButton.prototype.update = function() {
  // index of first or last slide, if previous or next
  var slides = this.parent.slides;
  // enable is wrapAround and at least 2 slides
  if ( this.parent.options.wrapAround && slides.length > 1 ) {
    this.enable();
    return;
  }
  var lastIndex = slides.length ? slides.length - 1 : 0;
  var boundIndex = this.isPrevious ? 0 : lastIndex;
  var method = this.parent.selectedIndex == boundIndex ? 'disable' : 'enable';
  this[ method ]();
};

PrevNextButton.prototype.destroy = function() {
  this.deactivate();
  this.allOff();
};

// -------------------------- Flickity prototype -------------------------- //

utils.extend( Flickity.defaults, {
  prevNextButtons: true,
  arrowShape: {
    x0: 10,
    x1: 60, y1: 50,
    x2: 70, y2: 40,
    x3: 30,
  },
} );

Flickity.createMethods.push('_createPrevNextButtons');
var proto = Flickity.prototype;

proto._createPrevNextButtons = function() {
  if ( !this.options.prevNextButtons ) {
    return;
  }

  this.prevButton = new PrevNextButton( -1, this );
  this.nextButton = new PrevNextButton( 1, this );

  this.on( 'activate', this.activatePrevNextButtons );
};

proto.activatePrevNextButtons = function() {
  this.prevButton.activate();
  this.nextButton.activate();
  this.on( 'deactivate', this.deactivatePrevNextButtons );
};

proto.deactivatePrevNextButtons = function() {
  this.prevButton.deactivate();
  this.nextButton.deactivate();
  this.off( 'deactivate', this.deactivatePrevNextButtons );
};

// --------------------------  -------------------------- //

Flickity.PrevNextButton = PrevNextButton;

return Flickity;

} ) );


/***/ }),

/***/ 714:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// slide
( function( window, factory ) {
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory() {
'use strict';

function Slide( parent ) {
  this.parent = parent;
  this.isOriginLeft = parent.originSide == 'left';
  this.cells = [];
  this.outerWidth = 0;
  this.height = 0;
}

var proto = Slide.prototype;

proto.addCell = function( cell ) {
  this.cells.push( cell );
  this.outerWidth += cell.size.outerWidth;
  this.height = Math.max( cell.size.outerHeight, this.height );
  // first cell stuff
  if ( this.cells.length == 1 ) {
    this.x = cell.x; // x comes from first cell
    var beginMargin = this.isOriginLeft ? 'marginLeft' : 'marginRight';
    this.firstMargin = cell.size[ beginMargin ];
  }
};

proto.updateTarget = function() {
  var endMargin = this.isOriginLeft ? 'marginRight' : 'marginLeft';
  var lastCell = this.getLastCell();
  var lastMargin = lastCell ? lastCell.size[ endMargin ] : 0;
  var slideWidth = this.outerWidth - ( this.firstMargin + lastMargin );
  this.target = this.x + this.firstMargin + slideWidth * this.parent.cellAlign;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.select = function() {
  this.cells.forEach( function( cell ) {
    cell.select();
  } );
};

proto.unselect = function() {
  this.cells.forEach( function( cell ) {
    cell.unselect();
  } );
};

proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  } );
};

return Slide;

} ) );


/***/ }),

/***/ 422:
/***/ (function(module) {

// get successful control from form and assemble into object
// http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2

// types which indicate a submit action and are not successful controls
// these will be ignored
var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;

// node names which could be successful controls
var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;

// Matches bracket notation.
var brackets = /(\[[^\[\]]*\])/g;

// serializes form fields
// @param form MUST be an HTMLForm element
// @param options is an optional argument to configure the serialization. Default output
// with no options specified is a url encoded string
//    - hash: [true | false] Configure the output type. If true, the output will
//    be a js object.
//    - serializer: [function] Optional serializer function to override the default one.
//    The function takes 3 arguments (result, key, value) and should return new result
//    hash and url encoded str serializers are provided with this module
//    - disabled: [true | false]. If true serialize disabled fields.
//    - empty: [true | false]. If true serialize empty fields
function serialize(form, options) {
    if (typeof options != 'object') {
        options = { hash: !!options };
    }
    else if (options.hash === undefined) {
        options.hash = true;
    }

    var result = (options.hash) ? {} : '';
    var serializer = options.serializer || ((options.hash) ? hash_serializer : str_serialize);

    var elements = form && form.elements ? form.elements : [];

    //Object store each radio and set if it's empty or not
    var radio_store = Object.create(null);

    for (var i=0 ; i<elements.length ; ++i) {
        var element = elements[i];

        // ingore disabled fields
        if ((!options.disabled && element.disabled) || !element.name) {
            continue;
        }
        // ignore anyhting that is not considered a success field
        if (!k_r_success_contrls.test(element.nodeName) ||
            k_r_submitter.test(element.type)) {
            continue;
        }

        var key = element.name;
        var val = element.value;

        // we can't just use element.value for checkboxes cause some browsers lie to us
        // they say "on" for value when the box isn't checked
        if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
            val = undefined;
        }

        // If we want empty elements
        if (options.empty) {
            // for checkbox
            if (element.type === 'checkbox' && !element.checked) {
                val = '';
            }

            // for radio
            if (element.type === 'radio') {
                if (!radio_store[element.name] && !element.checked) {
                    radio_store[element.name] = false;
                }
                else if (element.checked) {
                    radio_store[element.name] = true;
                }
            }

            // if options empty is true, continue only if its radio
            if (val == undefined && element.type == 'radio') {
                continue;
            }
        }
        else {
            // value-less fields are ignored unless options.empty is true
            if (!val) {
                continue;
            }
        }

        // multi select boxes
        if (element.type === 'select-multiple') {
            val = [];

            var selectOptions = element.options;
            var isSelectedOptions = false;
            for (var j=0 ; j<selectOptions.length ; ++j) {
                var option = selectOptions[j];
                var allowedEmpty = options.empty && !option.value;
                var hasValue = (option.value || allowedEmpty);
                if (option.selected && hasValue) {
                    isSelectedOptions = true;

                    // If using a hash serializer be sure to add the
                    // correct notation for an array in the multi-select
                    // context. Here the name attribute on the select element
                    // might be missing the trailing bracket pair. Both names
                    // "foo" and "foo[]" should be arrays.
                    if (options.hash && key.slice(key.length - 2) !== '[]') {
                        result = serializer(result, key + '[]', option.value);
                    }
                    else {
                        result = serializer(result, key, option.value);
                    }
                }
            }

            // Serialize if no selected options and options.empty is true
            if (!isSelectedOptions && options.empty) {
                result = serializer(result, key, '');
            }

            continue;
        }

        result = serializer(result, key, val);
    }

    // Check for all empty radio buttons and serialize them with key=""
    if (options.empty) {
        for (var key in radio_store) {
            if (!radio_store[key]) {
                result = serializer(result, key, '');
            }
        }
    }

    return result;
}

function parse_keys(string) {
    var keys = [];
    var prefix = /^([^\[\]]*)/;
    var children = new RegExp(brackets);
    var match = prefix.exec(string);

    if (match[1]) {
        keys.push(match[1]);
    }

    while ((match = children.exec(string)) !== null) {
        keys.push(match[1]);
    }

    return keys;
}

function hash_assign(result, keys, value) {
    if (keys.length === 0) {
        result = value;
        return result;
    }

    var key = keys.shift();
    var between = key.match(/^\[(.+?)\]$/);

    if (key === '[]') {
        result = result || [];

        if (Array.isArray(result)) {
            result.push(hash_assign(null, keys, value));
        }
        else {
            // This might be the result of bad name attributes like "[][foo]",
            // in this case the original `result` object will already be
            // assigned to an object literal. Rather than coerce the object to
            // an array, or cause an exception the attribute "_values" is
            // assigned as an array.
            result._values = result._values || [];
            result._values.push(hash_assign(null, keys, value));
        }

        return result;
    }

    // Key is an attribute name and can be assigned directly.
    if (!between) {
        result[key] = hash_assign(result[key], keys, value);
    }
    else {
        var string = between[1];
        // +var converts the variable into a number
        // better than parseInt because it doesn't truncate away trailing
        // letters and actually fails if whole thing is not a number
        var index = +string;

        // If the characters between the brackets is not a number it is an
        // attribute name and can be assigned directly.
        if (isNaN(index)) {
            result = result || {};
            result[string] = hash_assign(result[string], keys, value);
        }
        else {
            result = result || [];
            result[index] = hash_assign(result[index], keys, value);
        }
    }

    return result;
}

// Object/hash encoding serializer.
function hash_serializer(result, key, value) {
    var matches = key.match(brackets);

    // Has brackets? Use the recursive assignment function to walk the keys,
    // construct any missing objects in the result tree and make the assignment
    // at the end of the chain.
    if (matches) {
        var keys = parse_keys(key);
        hash_assign(result, keys, value);
    }
    else {
        // Non bracket notation can make assignments directly.
        var existing = result[key];

        // If the value has been assigned already (for instance when a radio and
        // a checkbox have the same name attribute) convert the previous value
        // into an array before pushing into it.
        //
        // NOTE: If this requirement were removed all hash creation and
        // assignment could go through `hash_assign`.
        if (existing) {
            if (!Array.isArray(existing)) {
                result[key] = [ existing ];
            }

            result[key].push(value);
        }
        else {
            result[key] = value;
        }
    }

    return result;
}

// urlform encoding serializer
function str_serialize(result, key, value) {
    // encode newlines as \r\n cause the html spec says so
    value = value.replace(/(\r)?\n/g, '\r\n');
    value = encodeURIComponent(value);

    // spaces should be '+' rather than '%20'.
    value = value.replace(/%20/g, '+');
    return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
}

module.exports = serialize;


/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */
/* globals console: false */

( function( window, factory ) {
  /* jshint strict: false */ /* globals define, module */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

})( window, function factory() {
'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') == -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console == 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

var measurementsLength = measurements.length;

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}

// -------------------------- getStyle -------------------------- //

/**
 * getStyle, get style of element, check for Firefox bug
 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function getStyle( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    logError( 'Style returned ' + style +
      '. Are you running this code in a hidden iframe on Firefox? ' +
      'See https://bit.ly/getsizebug1' );
  }
  return style;
}

// -------------------------- setup -------------------------- //

var isSetup = false;

var isBoxSizeOuter;

/**
 * setup
 * check isBoxSizerOuter
 * do on first getSize() rather than on page load for Firefox bug
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  // -------------------------- box sizing -------------------------- //

  /**
   * Chrome & Safari measure the outer-width on style.width on border-box elems
   * IE11 & Firefox<29 measures the inner-width
   */
  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style.boxSizing = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );
  // round value for browser zoom. desandro/masonry#928
  isBoxSizeOuter = Math.round( getStyleSize( style.width ) ) == 200;
  getSize.isBoxSizeOuter = isBoxSizeOuter;

  body.removeChild( div );
}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem == 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display == 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

  // get all measurements
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

return getSize;

});


/***/ }),

/***/ 564:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(158)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( EvEmitter ) {
      return factory( window, EvEmitter );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

})( typeof window !== 'undefined' ? window : this,

// --------------------------  factory -------------------------- //

function factory( window, EvEmitter ) {

'use strict';

var $ = window.jQuery;
var console = window.console;

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
function makeArray( obj ) {
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    return obj;
  }

  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  if ( isArrayLike ) {
    // convert nodeList to array
    return arraySlice.call( obj );
  }

  // array of single index
  return [ obj ];
}

// -------------------------- imagesLoaded -------------------------- //

/**
 * @param {Array, Element, NodeList, String} elem
 * @param {Object or Function} options - if function, use as callback
 * @param {Function} onAlways - callback function
 */
function ImagesLoaded( elem, options, onAlways ) {
  // coerce ImagesLoaded() without new, to be new ImagesLoaded()
  if ( !( this instanceof ImagesLoaded ) ) {
    return new ImagesLoaded( elem, options, onAlways );
  }
  // use elem as selector string
  var queryElem = elem;
  if ( typeof elem == 'string' ) {
    queryElem = document.querySelectorAll( elem );
  }
  // bail if bad element
  if ( !queryElem ) {
    console.error( 'Bad element for imagesLoaded ' + ( queryElem || elem ) );
    return;
  }

  this.elements = makeArray( queryElem );
  this.options = extend( {}, this.options );
  // shift arguments if no options set
  if ( typeof options == 'function' ) {
    onAlways = options;
  } else {
    extend( this.options, options );
  }

  if ( onAlways ) {
    this.on( 'always', onAlways );
  }

  this.getImages();

  if ( $ ) {
    // add jQuery Deferred object
    this.jqDeferred = new $.Deferred();
  }

  // HACK check async to allow time to bind listeners
  setTimeout( this.check.bind( this ) );
}

ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

ImagesLoaded.prototype.options = {};

ImagesLoaded.prototype.getImages = function() {
  this.images = [];

  // filter & find items if we have an item selector
  this.elements.forEach( this.addElementImages, this );
};

/**
 * @param {Node} element
 */
ImagesLoaded.prototype.addElementImages = function( elem ) {
  // filter siblings
  if ( elem.nodeName == 'IMG' ) {
    this.addImage( elem );
  }
  // get background image on element
  if ( this.options.background === true ) {
    this.addElementBackgroundImages( elem );
  }

  // find children
  // no non-element nodes, #143
  var nodeType = elem.nodeType;
  if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
    return;
  }
  var childImgs = elem.querySelectorAll('img');
  // concat childElems to filterFound array
  for ( var i=0; i < childImgs.length; i++ ) {
    var img = childImgs[i];
    this.addImage( img );
  }

  // get child background images
  if ( typeof this.options.background == 'string' ) {
    var children = elem.querySelectorAll( this.options.background );
    for ( i=0; i < children.length; i++ ) {
      var child = children[i];
      this.addElementBackgroundImages( child );
    }
  }
};

var elementNodeTypes = {
  1: true,
  9: true,
  11: true
};

ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    // Firefox returns null if in a hidden iframe https://bugzil.la/548397
    return;
  }
  // get url inside url("...")
  var reURL = /url\((['"])?(.*?)\1\)/gi;
  var matches = reURL.exec( style.backgroundImage );
  while ( matches !== null ) {
    var url = matches && matches[2];
    if ( url ) {
      this.addBackground( url, elem );
    }
    matches = reURL.exec( style.backgroundImage );
  }
};

/**
 * @param {Image} img
 */
ImagesLoaded.prototype.addImage = function( img ) {
  var loadingImage = new LoadingImage( img );
  this.images.push( loadingImage );
};

ImagesLoaded.prototype.addBackground = function( url, elem ) {
  var background = new Background( url, elem );
  this.images.push( background );
};

ImagesLoaded.prototype.check = function() {
  var _this = this;
  this.progressedCount = 0;
  this.hasAnyBroken = false;
  // complete if no images
  if ( !this.images.length ) {
    this.complete();
    return;
  }

  function onProgress( image, elem, message ) {
    // HACK - Chrome triggers event before object properties have changed. #83
    setTimeout( function() {
      _this.progress( image, elem, message );
    });
  }

  this.images.forEach( function( loadingImage ) {
    loadingImage.once( 'progress', onProgress );
    loadingImage.check();
  });
};

ImagesLoaded.prototype.progress = function( image, elem, message ) {
  this.progressedCount++;
  this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
  // progress event
  this.emitEvent( 'progress', [ this, image, elem ] );
  if ( this.jqDeferred && this.jqDeferred.notify ) {
    this.jqDeferred.notify( this, image );
  }
  // check if completed
  if ( this.progressedCount == this.images.length ) {
    this.complete();
  }

  if ( this.options.debug && console ) {
    console.log( 'progress: ' + message, image, elem );
  }
};

ImagesLoaded.prototype.complete = function() {
  var eventName = this.hasAnyBroken ? 'fail' : 'done';
  this.isComplete = true;
  this.emitEvent( eventName, [ this ] );
  this.emitEvent( 'always', [ this ] );
  if ( this.jqDeferred ) {
    var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
    this.jqDeferred[ jqMethod ]( this );
  }
};

// --------------------------  -------------------------- //

function LoadingImage( img ) {
  this.img = img;
}

LoadingImage.prototype = Object.create( EvEmitter.prototype );

LoadingImage.prototype.check = function() {
  // If complete is true and browser supports natural sizes,
  // try to check for image status manually.
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    // report based on naturalWidth
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    return;
  }

  // If none of the checks above matched, simulate loading on detached element.
  this.proxyImage = new Image();
  this.proxyImage.addEventListener( 'load', this );
  this.proxyImage.addEventListener( 'error', this );
  // bind to image as well for Firefox. #191
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.proxyImage.src = this.img.src;
};

LoadingImage.prototype.getIsImageComplete = function() {
  // check for non-zero, non-undefined naturalWidth
  // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
  return this.img.complete && this.img.naturalWidth;
};

LoadingImage.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.img, message ] );
};

// ----- events ----- //

// trigger specified handler for event type
LoadingImage.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

LoadingImage.prototype.onload = function() {
  this.confirm( true, 'onload' );
  this.unbindEvents();
};

LoadingImage.prototype.onerror = function() {
  this.confirm( false, 'onerror' );
  this.unbindEvents();
};

LoadingImage.prototype.unbindEvents = function() {
  this.proxyImage.removeEventListener( 'load', this );
  this.proxyImage.removeEventListener( 'error', this );
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

// -------------------------- Background -------------------------- //

function Background( url, element ) {
  this.url = url;
  this.element = element;
  this.img = new Image();
}

// inherit LoadingImage prototype
Background.prototype = Object.create( LoadingImage.prototype );

Background.prototype.check = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.img.src = this.url;
  // check if image is already complete
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    this.unbindEvents();
  }
};

Background.prototype.unbindEvents = function() {
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

Background.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.element, message ] );
};

// -------------------------- jQuery -------------------------- //

ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
  jQuery = jQuery || window.jQuery;
  if ( !jQuery ) {
    return;
  }
  // set local variable
  $ = jQuery;
  // $().imagesLoaded()
  $.fn.imagesLoaded = function( options, callback ) {
    var instance = new ImagesLoaded( this, options, callback );
    return instance.jqDeferred.promise( $(this) );
  };
};
// try making plugin
ImagesLoaded.makeJQueryPlugin();

// --------------------------  -------------------------- //

return ImagesLoaded;

});


/***/ }),

/***/ 405:
/***/ (function(module) {

module.exports = debounce;

function debounce(fn, delay, atStart, guarantee) {
  var timeout;
  var args;
  var self;

  return function debounced() {
    self = this;
    args = Array.prototype.slice.call(arguments);

    if (timeout && (atStart || guarantee)) {
      return;
    } else if (!atStart) {
      clear();

      timeout = setTimeout(run, delay);
      return timeout;
    }

    timeout = setTimeout(clear, delay);
    fn.apply(self, args);

    function run() {
      clear();
      fn.apply(self, args);
    }

    function clear() {
      clearTimeout(timeout);
      timeout = null;
    }
  };
}


/***/ }),

/***/ 411:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! PhotoSwipe Default UI - 4.1.3 - 2019-01-08
* http://photoswipe.com
* Copyright (c) 2019 Dmitry Semenov; */
/**
*
* UI on top of main sliding area (caption, arrows, close button, etc.).
* Built just using public methods/properties of PhotoSwipe.
* 
*/
(function (root, factory) { 
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
})(this, function () {

	'use strict';



var PhotoSwipeUI_Default =
 function(pswp, framework) {

	var ui = this;
	var _overlayUIUpdated = false,
		_controlsVisible = true,
		_fullscrenAPI,
		_controls,
		_captionContainer,
		_fakeCaptionContainer,
		_indexIndicator,
		_shareButton,
		_shareModal,
		_shareModalHidden = true,
		_initalCloseOnScrollValue,
		_isIdle,
		_listen,

		_loadingIndicator,
		_loadingIndicatorHidden,
		_loadingIndicatorTimeout,

		_galleryHasOneSlide,

		_options,
		_defaultUIOptions = {
			barsSize: {top:44, bottom:'auto'},
			closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'], 
			timeToIdle: 4000, 
			timeToIdleOutside: 1000,
			loadingIndicatorDelay: 1000, // 2s
			
			addCaptionHTMLFn: function(item, captionEl /*, isFake */) {
				if(!item.title) {
					captionEl.children[0].innerHTML = '';
					return false;
				}
				captionEl.children[0].innerHTML = item.title;
				return true;
			},

			closeEl:true,
			captionEl: true,
			fullscreenEl: true,
			zoomEl: true,
			shareEl: true,
			counterEl: true,
			arrowEl: true,
			preloaderEl: true,

			tapToClose: false,
			tapToToggleControls: true,

			clickToCloseNonZoomable: true,

			shareButtons: [
				{id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
				{id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
				{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/'+
													'?url={{url}}&media={{image_url}}&description={{text}}'},
				{id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
			],
			getImageURLForShare: function( /* shareButtonData */ ) {
				return pswp.currItem.src || '';
			},
			getPageURLForShare: function( /* shareButtonData */ ) {
				return window.location.href;
			},
			getTextForShare: function( /* shareButtonData */ ) {
				return pswp.currItem.title || '';
			},
				
			indexIndicatorSep: ' / ',
			fitControlsWidth: 1200

		},
		_blockControlsTap,
		_blockControlsTapTimeout;



	var _onControlsTap = function(e) {
			if(_blockControlsTap) {
				return true;
			}


			e = e || window.event;

			if(_options.timeToIdle && _options.mouseUsed && !_isIdle) {
				// reset idle timer
				_onIdleMouseMove();
			}


			var target = e.target || e.srcElement,
				uiElement,
				clickedClass = target.getAttribute('class') || '',
				found;

			for(var i = 0; i < _uiElements.length; i++) {
				uiElement = _uiElements[i];
				if(uiElement.onTap && clickedClass.indexOf('pswp__' + uiElement.name ) > -1 ) {
					uiElement.onTap();
					found = true;

				}
			}

			if(found) {
				if(e.stopPropagation) {
					e.stopPropagation();
				}
				_blockControlsTap = true;

				// Some versions of Android don't prevent ghost click event 
				// when preventDefault() was called on touchstart and/or touchend.
				// 
				// This happens on v4.3, 4.2, 4.1, 
				// older versions strangely work correctly, 
				// but just in case we add delay on all of them)	
				var tapDelay = framework.features.isOldAndroid ? 600 : 30;
				_blockControlsTapTimeout = setTimeout(function() {
					_blockControlsTap = false;
				}, tapDelay);
			}

		},
		_fitControlsInViewport = function() {
			return !pswp.likelyTouchDevice || _options.mouseUsed || screen.width > _options.fitControlsWidth;
		},
		_togglePswpClass = function(el, cName, add) {
			framework[ (add ? 'add' : 'remove') + 'Class' ](el, 'pswp__' + cName);
		},

		// add class when there is just one item in the gallery
		// (by default it hides left/right arrows and 1ofX counter)
		_countNumItems = function() {
			var hasOneSlide = (_options.getNumItemsFn() === 1);

			if(hasOneSlide !== _galleryHasOneSlide) {
				_togglePswpClass(_controls, 'ui--one-slide', hasOneSlide);
				_galleryHasOneSlide = hasOneSlide;
			}
		},
		_toggleShareModalClass = function() {
			_togglePswpClass(_shareModal, 'share-modal--hidden', _shareModalHidden);
		},
		_toggleShareModal = function() {

			_shareModalHidden = !_shareModalHidden;
			
			
			if(!_shareModalHidden) {
				_toggleShareModalClass();
				setTimeout(function() {
					if(!_shareModalHidden) {
						framework.addClass(_shareModal, 'pswp__share-modal--fade-in');
					}
				}, 30);
			} else {
				framework.removeClass(_shareModal, 'pswp__share-modal--fade-in');
				setTimeout(function() {
					if(_shareModalHidden) {
						_toggleShareModalClass();
					}
				}, 300);
			}
			
			if(!_shareModalHidden) {
				_updateShareURLs();
			}
			return false;
		},

		_openWindowPopup = function(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			pswp.shout('shareLinkClick', e, target);

			if(!target.href) {
				return false;
			}

			if( target.hasAttribute('download') ) {
				return true;
			}

			window.open(target.href, 'pswp_share', 'scrollbars=yes,resizable=yes,toolbar=no,'+
										'location=yes,width=550,height=420,top=100,left=' + 
										(window.screen ? Math.round(screen.width / 2 - 275) : 100)  );

			if(!_shareModalHidden) {
				_toggleShareModal();
			}
			
			return false;
		},
		_updateShareURLs = function() {
			var shareButtonOut = '',
				shareButtonData,
				shareURL,
				image_url,
				page_url,
				share_text;

			for(var i = 0; i < _options.shareButtons.length; i++) {
				shareButtonData = _options.shareButtons[i];

				image_url = _options.getImageURLForShare(shareButtonData);
				page_url = _options.getPageURLForShare(shareButtonData);
				share_text = _options.getTextForShare(shareButtonData);

				shareURL = shareButtonData.url.replace('{{url}}', encodeURIComponent(page_url) )
									.replace('{{image_url}}', encodeURIComponent(image_url) )
									.replace('{{raw_image_url}}', image_url )
									.replace('{{text}}', encodeURIComponent(share_text) );

				shareButtonOut += '<a href="' + shareURL + '" target="_blank" '+
									'class="pswp__share--' + shareButtonData.id + '"' +
									(shareButtonData.download ? 'download' : '') + '>' + 
									shareButtonData.label + '</a>';

				if(_options.parseShareButtonOut) {
					shareButtonOut = _options.parseShareButtonOut(shareButtonData, shareButtonOut);
				}
			}
			_shareModal.children[0].innerHTML = shareButtonOut;
			_shareModal.children[0].onclick = _openWindowPopup;

		},
		_hasCloseClass = function(target) {
			for(var  i = 0; i < _options.closeElClasses.length; i++) {
				if( framework.hasClass(target, 'pswp__' + _options.closeElClasses[i]) ) {
					return true;
				}
			}
		},
		_idleInterval,
		_idleTimer,
		_idleIncrement = 0,
		_onIdleMouseMove = function() {
			clearTimeout(_idleTimer);
			_idleIncrement = 0;
			if(_isIdle) {
				ui.setIdle(false);
			}
		},
		_onMouseLeaveWindow = function(e) {
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;
			if (!from || from.nodeName === 'HTML') {
				clearTimeout(_idleTimer);
				_idleTimer = setTimeout(function() {
					ui.setIdle(true);
				}, _options.timeToIdleOutside);
			}
		},
		_setupFullscreenAPI = function() {
			if(_options.fullscreenEl && !framework.features.isOldAndroid) {
				if(!_fullscrenAPI) {
					_fullscrenAPI = ui.getFullscreenAPI();
				}
				if(_fullscrenAPI) {
					framework.bind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
					ui.updateFullscreen();
					framework.addClass(pswp.template, 'pswp--supports-fs');
				} else {
					framework.removeClass(pswp.template, 'pswp--supports-fs');
				}
			}
		},
		_setupLoadingIndicator = function() {
			// Setup loading indicator
			if(_options.preloaderEl) {
			
				_toggleLoadingIndicator(true);

				_listen('beforeChange', function() {

					clearTimeout(_loadingIndicatorTimeout);

					// display loading indicator with delay
					_loadingIndicatorTimeout = setTimeout(function() {

						if(pswp.currItem && pswp.currItem.loading) {

							if( !pswp.allowProgressiveImg() || (pswp.currItem.img && !pswp.currItem.img.naturalWidth)  ) {
								// show preloader if progressive loading is not enabled, 
								// or image width is not defined yet (because of slow connection)
								_toggleLoadingIndicator(false); 
								// items-controller.js function allowProgressiveImg
							}
							
						} else {
							_toggleLoadingIndicator(true); // hide preloader
						}

					}, _options.loadingIndicatorDelay);
					
				});
				_listen('imageLoadComplete', function(index, item) {
					if(pswp.currItem === item) {
						_toggleLoadingIndicator(true);
					}
				});

			}
		},
		_toggleLoadingIndicator = function(hide) {
			if( _loadingIndicatorHidden !== hide ) {
				_togglePswpClass(_loadingIndicator, 'preloader--active', !hide);
				_loadingIndicatorHidden = hide;
			}
		},
		_applyNavBarGaps = function(item) {
			var gap = item.vGap;

			if( _fitControlsInViewport() ) {
				
				var bars = _options.barsSize; 
				if(_options.captionEl && bars.bottom === 'auto') {
					if(!_fakeCaptionContainer) {
						_fakeCaptionContainer = framework.createEl('pswp__caption pswp__caption--fake');
						_fakeCaptionContainer.appendChild( framework.createEl('pswp__caption__center') );
						_controls.insertBefore(_fakeCaptionContainer, _captionContainer);
						framework.addClass(_controls, 'pswp__ui--fit');
					}
					if( _options.addCaptionHTMLFn(item, _fakeCaptionContainer, true) ) {

						var captionSize = _fakeCaptionContainer.clientHeight;
						gap.bottom = parseInt(captionSize,10) || 44;
					} else {
						gap.bottom = bars.top; // if no caption, set size of bottom gap to size of top
					}
				} else {
					gap.bottom = bars.bottom === 'auto' ? 0 : bars.bottom;
				}
				
				// height of top bar is static, no need to calculate it
				gap.top = bars.top;
			} else {
				gap.top = gap.bottom = 0;
			}
		},
		_setupIdle = function() {
			// Hide controls when mouse is used
			if(_options.timeToIdle) {
				_listen('mouseUsed', function() {
					
					framework.bind(document, 'mousemove', _onIdleMouseMove);
					framework.bind(document, 'mouseout', _onMouseLeaveWindow);

					_idleInterval = setInterval(function() {
						_idleIncrement++;
						if(_idleIncrement === 2) {
							ui.setIdle(true);
						}
					}, _options.timeToIdle / 2);
				});
			}
		},
		_setupHidingControlsDuringGestures = function() {

			// Hide controls on vertical drag
			_listen('onVerticalDrag', function(now) {
				if(_controlsVisible && now < 0.95) {
					ui.hideControls();
				} else if(!_controlsVisible && now >= 0.95) {
					ui.showControls();
				}
			});

			// Hide controls when pinching to close
			var pinchControlsHidden;
			_listen('onPinchClose' , function(now) {
				if(_controlsVisible && now < 0.9) {
					ui.hideControls();
					pinchControlsHidden = true;
				} else if(pinchControlsHidden && !_controlsVisible && now > 0.9) {
					ui.showControls();
				}
			});

			_listen('zoomGestureEnded', function() {
				pinchControlsHidden = false;
				if(pinchControlsHidden && !_controlsVisible) {
					ui.showControls();
				}
			});

		};



	var _uiElements = [
		{ 
			name: 'caption', 
			option: 'captionEl',
			onInit: function(el) {  
				_captionContainer = el; 
			} 
		},
		{ 
			name: 'share-modal', 
			option: 'shareEl',
			onInit: function(el) {  
				_shareModal = el;
			},
			onTap: function() {
				_toggleShareModal();
			} 
		},
		{ 
			name: 'button--share', 
			option: 'shareEl',
			onInit: function(el) { 
				_shareButton = el;
			},
			onTap: function() {
				_toggleShareModal();
			} 
		},
		{ 
			name: 'button--zoom', 
			option: 'zoomEl',
			onTap: pswp.toggleDesktopZoom
		},
		{ 
			name: 'counter', 
			option: 'counterEl',
			onInit: function(el) {  
				_indexIndicator = el;
			} 
		},
		{ 
			name: 'button--close', 
			option: 'closeEl',
			onTap: pswp.close
		},
		{ 
			name: 'button--arrow--left', 
			option: 'arrowEl',
			onTap: pswp.prev
		},
		{ 
			name: 'button--arrow--right', 
			option: 'arrowEl',
			onTap: pswp.next
		},
		{ 
			name: 'button--fs', 
			option: 'fullscreenEl',
			onTap: function() {  
				if(_fullscrenAPI.isFullscreen()) {
					_fullscrenAPI.exit();
				} else {
					_fullscrenAPI.enter();
				}
			} 
		},
		{ 
			name: 'preloader', 
			option: 'preloaderEl',
			onInit: function(el) {  
				_loadingIndicator = el;
			} 
		}

	];

	var _setupUIElements = function() {
		var item,
			classAttr,
			uiElement;

		var loopThroughChildElements = function(sChildren) {
			if(!sChildren) {
				return;
			}

			var l = sChildren.length;
			for(var i = 0; i < l; i++) {
				item = sChildren[i];
				classAttr = item.className;

				for(var a = 0; a < _uiElements.length; a++) {
					uiElement = _uiElements[a];

					if(classAttr.indexOf('pswp__' + uiElement.name) > -1  ) {

						if( _options[uiElement.option] ) { // if element is not disabled from options
							
							framework.removeClass(item, 'pswp__element--disabled');
							if(uiElement.onInit) {
								uiElement.onInit(item);
							}
							
							//item.style.display = 'block';
						} else {
							framework.addClass(item, 'pswp__element--disabled');
							//item.style.display = 'none';
						}
					}
				}
			}
		};
		loopThroughChildElements(_controls.children);

		var topBar =  framework.getChildByClass(_controls, 'pswp__top-bar');
		if(topBar) {
			loopThroughChildElements( topBar.children );
		}
	};


	

	ui.init = function() {

		// extend options
		framework.extend(pswp.options, _defaultUIOptions, true);

		// create local link for fast access
		_options = pswp.options;

		// find pswp__ui element
		_controls = framework.getChildByClass(pswp.scrollWrap, 'pswp__ui');

		// create local link
		_listen = pswp.listen;


		_setupHidingControlsDuringGestures();

		// update controls when slides change
		_listen('beforeChange', ui.update);

		// toggle zoom on double-tap
		_listen('doubleTap', function(point) {
			var initialZoomLevel = pswp.currItem.initialZoomLevel;
			if(pswp.getZoomLevel() !== initialZoomLevel) {
				pswp.zoomTo(initialZoomLevel, point, 333);
			} else {
				pswp.zoomTo(_options.getDoubleTapZoom(false, pswp.currItem), point, 333);
			}
		});

		// Allow text selection in caption
		_listen('preventDragEvent', function(e, isDown, preventObj) {
			var t = e.target || e.srcElement;
			if(
				t && 
				t.getAttribute('class') && e.type.indexOf('mouse') > -1 && 
				( t.getAttribute('class').indexOf('__caption') > 0 || (/(SMALL|STRONG|EM)/i).test(t.tagName) ) 
			) {
				preventObj.prevent = false;
			}
		});

		// bind events for UI
		_listen('bindEvents', function() {
			framework.bind(_controls, 'pswpTap click', _onControlsTap);
			framework.bind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);

			if(!pswp.likelyTouchDevice) {
				framework.bind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);
			}
		});

		// unbind events for UI
		_listen('unbindEvents', function() {
			if(!_shareModalHidden) {
				_toggleShareModal();
			}

			if(_idleInterval) {
				clearInterval(_idleInterval);
			}
			framework.unbind(document, 'mouseout', _onMouseLeaveWindow);
			framework.unbind(document, 'mousemove', _onIdleMouseMove);
			framework.unbind(_controls, 'pswpTap click', _onControlsTap);
			framework.unbind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);
			framework.unbind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);

			if(_fullscrenAPI) {
				framework.unbind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
				if(_fullscrenAPI.isFullscreen()) {
					_options.hideAnimationDuration = 0;
					_fullscrenAPI.exit();
				}
				_fullscrenAPI = null;
			}
		});


		// clean up things when gallery is destroyed
		_listen('destroy', function() {
			if(_options.captionEl) {
				if(_fakeCaptionContainer) {
					_controls.removeChild(_fakeCaptionContainer);
				}
				framework.removeClass(_captionContainer, 'pswp__caption--empty');
			}

			if(_shareModal) {
				_shareModal.children[0].onclick = null;
			}
			framework.removeClass(_controls, 'pswp__ui--over-close');
			framework.addClass( _controls, 'pswp__ui--hidden');
			ui.setIdle(false);
		});
		

		if(!_options.showAnimationDuration) {
			framework.removeClass( _controls, 'pswp__ui--hidden');
		}
		_listen('initialZoomIn', function() {
			if(_options.showAnimationDuration) {
				framework.removeClass( _controls, 'pswp__ui--hidden');
			}
		});
		_listen('initialZoomOut', function() {
			framework.addClass( _controls, 'pswp__ui--hidden');
		});

		_listen('parseVerticalMargin', _applyNavBarGaps);
		
		_setupUIElements();

		if(_options.shareEl && _shareButton && _shareModal) {
			_shareModalHidden = true;
		}

		_countNumItems();

		_setupIdle();

		_setupFullscreenAPI();

		_setupLoadingIndicator();
	};

	ui.setIdle = function(isIdle) {
		_isIdle = isIdle;
		_togglePswpClass(_controls, 'ui--idle', isIdle);
	};

	ui.update = function() {
		// Don't update UI if it's hidden
		if(_controlsVisible && pswp.currItem) {
			
			ui.updateIndexIndicator();

			if(_options.captionEl) {
				_options.addCaptionHTMLFn(pswp.currItem, _captionContainer);

				_togglePswpClass(_captionContainer, 'caption--empty', !pswp.currItem.title);
			}

			_overlayUIUpdated = true;

		} else {
			_overlayUIUpdated = false;
		}

		if(!_shareModalHidden) {
			_toggleShareModal();
		}

		_countNumItems();
	};

	ui.updateFullscreen = function(e) {

		if(e) {
			// some browsers change window scroll position during the fullscreen
			// so PhotoSwipe updates it just in case
			setTimeout(function() {
				pswp.setScrollOffset( 0, framework.getScrollY() );
			}, 50);
		}
		
		// toogle pswp--fs class on root element
		framework[ (_fullscrenAPI.isFullscreen() ? 'add' : 'remove') + 'Class' ](pswp.template, 'pswp--fs');
	};

	ui.updateIndexIndicator = function() {
		if(_options.counterEl) {
			_indexIndicator.innerHTML = (pswp.getCurrentIndex()+1) + 
										_options.indexIndicatorSep + 
										_options.getNumItemsFn();
		}
	};
	
	ui.onGlobalTap = function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;

		if(_blockControlsTap) {
			return;
		}

		if(e.detail && e.detail.pointerType === 'mouse') {

			// close gallery if clicked outside of the image
			if(_hasCloseClass(target)) {
				pswp.close();
				return;
			}

			if(framework.hasClass(target, 'pswp__img')) {
				if(pswp.getZoomLevel() === 1 && pswp.getZoomLevel() <= pswp.currItem.fitRatio) {
					if(_options.clickToCloseNonZoomable) {
						pswp.close();
					}
				} else {
					pswp.toggleDesktopZoom(e.detail.releasePoint);
				}
			}
			
		} else {

			// tap anywhere (except buttons) to toggle visibility of controls
			if(_options.tapToToggleControls) {
				if(_controlsVisible) {
					ui.hideControls();
				} else {
					ui.showControls();
				}
			}

			// tap to close gallery
			if(_options.tapToClose && (framework.hasClass(target, 'pswp__img') || _hasCloseClass(target)) ) {
				pswp.close();
				return;
			}
			
		}
	};
	ui.onMouseOver = function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;

		// add class when mouse is over an element that should close the gallery
		_togglePswpClass(_controls, 'ui--over-close', _hasCloseClass(target));
	};

	ui.hideControls = function() {
		framework.addClass(_controls,'pswp__ui--hidden');
		_controlsVisible = false;
	};

	ui.showControls = function() {
		_controlsVisible = true;
		if(!_overlayUIUpdated) {
			ui.update();
		}
		framework.removeClass(_controls,'pswp__ui--hidden');
	};

	ui.supportsFullscreen = function() {
		var d = document;
		return !!(d.exitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen || d.msExitFullscreen);
	};

	ui.getFullscreenAPI = function() {
		var dE = document.documentElement,
			api,
			tF = 'fullscreenchange';

		if (dE.requestFullscreen) {
			api = {
				enterK: 'requestFullscreen',
				exitK: 'exitFullscreen',
				elementK: 'fullscreenElement',
				eventK: tF
			};

		} else if(dE.mozRequestFullScreen ) {
			api = {
				enterK: 'mozRequestFullScreen',
				exitK: 'mozCancelFullScreen',
				elementK: 'mozFullScreenElement',
				eventK: 'moz' + tF
			};

			

		} else if(dE.webkitRequestFullscreen) {
			api = {
				enterK: 'webkitRequestFullscreen',
				exitK: 'webkitExitFullscreen',
				elementK: 'webkitFullscreenElement',
				eventK: 'webkit' + tF
			};

		} else if(dE.msRequestFullscreen) {
			api = {
				enterK: 'msRequestFullscreen',
				exitK: 'msExitFullscreen',
				elementK: 'msFullscreenElement',
				eventK: 'MSFullscreenChange'
			};
		}

		if(api) {
			api.enter = function() { 
				// disable close-on-scroll in fullscreen
				_initalCloseOnScrollValue = _options.closeOnScroll; 
				_options.closeOnScroll = false; 

				if(this.enterK === 'webkitRequestFullscreen') {
					pswp.template[this.enterK]( Element.ALLOW_KEYBOARD_INPUT );
				} else {
					return pswp.template[this.enterK](); 
				}
			};
			api.exit = function() { 
				_options.closeOnScroll = _initalCloseOnScrollValue;

				return document[this.exitK](); 

			};
			api.isFullscreen = function() { return document[this.elementK]; };
		}

		return api;
	};



};
return PhotoSwipeUI_Default;


});


/***/ }),

/***/ 832:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! PhotoSwipe - v4.1.3 - 2019-01-08
* http://photoswipe.com
* Copyright (c) 2019 Dmitry Semenov; */
(function (root, factory) { 
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
})(this, function () {

	'use strict';
	var PhotoSwipe = function(template, UiClass, items, options){

/*>>framework-bridge*/
/**
 *
 * Set of generic functions used by gallery.
 * 
 * You're free to modify anything here as long as functionality is kept.
 * 
 */
var framework = {
	features: null,
	bind: function(target, type, listener, unbind) {
		var methodName = (unbind ? 'remove' : 'add') + 'EventListener';
		type = type.split(' ');
		for(var i = 0; i < type.length; i++) {
			if(type[i]) {
				target[methodName]( type[i], listener, false);
			}
		}
	},
	isArray: function(obj) {
		return (obj instanceof Array);
	},
	createEl: function(classes, tag) {
		var el = document.createElement(tag || 'div');
		if(classes) {
			el.className = classes;
		}
		return el;
	},
	getScrollY: function() {
		var yOffset = window.pageYOffset;
		return yOffset !== undefined ? yOffset : document.documentElement.scrollTop;
	},
	unbind: function(target, type, listener) {
		framework.bind(target,type,listener,true);
	},
	removeClass: function(el, className) {
		var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, ''); 
	},
	addClass: function(el, className) {
		if( !framework.hasClass(el,className) ) {
			el.className += (el.className ? ' ' : '') + className;
		}
	},
	hasClass: function(el, className) {
		return el.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className);
	},
	getChildByClass: function(parentEl, childClassName) {
		var node = parentEl.firstChild;
		while(node) {
			if( framework.hasClass(node, childClassName) ) {
				return node;
			}
			node = node.nextSibling;
		}
	},
	arraySearch: function(array, value, key) {
		var i = array.length;
		while(i--) {
			if(array[i][key] === value) {
				return i;
			} 
		}
		return -1;
	},
	extend: function(o1, o2, preventOverwrite) {
		for (var prop in o2) {
			if (o2.hasOwnProperty(prop)) {
				if(preventOverwrite && o1.hasOwnProperty(prop)) {
					continue;
				}
				o1[prop] = o2[prop];
			}
		}
	},
	easing: {
		sine: {
			out: function(k) {
				return Math.sin(k * (Math.PI / 2));
			},
			inOut: function(k) {
				return - (Math.cos(Math.PI * k) - 1) / 2;
			}
		},
		cubic: {
			out: function(k) {
				return --k * k * k + 1;
			}
		}
		/*
			elastic: {
				out: function ( k ) {

					var s, a = 0.1, p = 0.4;
					if ( k === 0 ) return 0;
					if ( k === 1 ) return 1;
					if ( !a || a < 1 ) { a = 1; s = p / 4; }
					else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
					return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

				},
			},
			back: {
				out: function ( k ) {
					var s = 1.70158;
					return --k * k * ( ( s + 1 ) * k + s ) + 1;
				}
			}
		*/
	},

	/**
	 * 
	 * @return {object}
	 * 
	 * {
	 *  raf : request animation frame function
	 *  caf : cancel animation frame function
	 *  transfrom : transform property key (with vendor), or null if not supported
	 *  oldIE : IE8 or below
	 * }
	 * 
	 */
	detectFeatures: function() {
		if(framework.features) {
			return framework.features;
		}
		var helperEl = framework.createEl(),
			helperStyle = helperEl.style,
			vendor = '',
			features = {};

		// IE8 and below
		features.oldIE = document.all && !document.addEventListener;

		features.touch = 'ontouchstart' in window;

		if(window.requestAnimationFrame) {
			features.raf = window.requestAnimationFrame;
			features.caf = window.cancelAnimationFrame;
		}

		features.pointerEvent = !!(window.PointerEvent) || navigator.msPointerEnabled;

		// fix false-positive detection of old Android in new IE
		// (IE11 ua string contains "Android 4.0")
		
		if(!features.pointerEvent) { 

			var ua = navigator.userAgent;

			// Detect if device is iPhone or iPod and if it's older than iOS 8
			// http://stackoverflow.com/a/14223920
			// 
			// This detection is made because of buggy top/bottom toolbars
			// that don't trigger window.resize event.
			// For more info refer to _isFixedPosition variable in core.js

			if (/iP(hone|od)/.test(navigator.platform)) {
				var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
				if(v && v.length > 0) {
					v = parseInt(v[1], 10);
					if(v >= 1 && v < 8 ) {
						features.isOldIOSPhone = true;
					}
				}
			}

			// Detect old Android (before KitKat)
			// due to bugs related to position:fixed
			// http://stackoverflow.com/questions/7184573/pick-up-the-android-version-in-the-browser-by-javascript
			
			var match = ua.match(/Android\s([0-9\.]*)/);
			var androidversion =  match ? match[1] : 0;
			androidversion = parseFloat(androidversion);
			if(androidversion >= 1 ) {
				if(androidversion < 4.4) {
					features.isOldAndroid = true; // for fixed position bug & performance
				}
				features.androidVersion = androidversion; // for touchend bug
			}	
			features.isMobileOpera = /opera mini|opera mobi/i.test(ua);

			// p.s. yes, yes, UA sniffing is bad, propose your solution for above bugs.
		}
		
		var styleChecks = ['transform', 'perspective', 'animationName'],
			vendors = ['', 'webkit','Moz','ms','O'],
			styleCheckItem,
			styleName;

		for(var i = 0; i < 4; i++) {
			vendor = vendors[i];

			for(var a = 0; a < 3; a++) {
				styleCheckItem = styleChecks[a];

				// uppercase first letter of property name, if vendor is present
				styleName = vendor + (vendor ? 
										styleCheckItem.charAt(0).toUpperCase() + styleCheckItem.slice(1) : 
										styleCheckItem);
			
				if(!features[styleCheckItem] && styleName in helperStyle ) {
					features[styleCheckItem] = styleName;
				}
			}

			if(vendor && !features.raf) {
				vendor = vendor.toLowerCase();
				features.raf = window[vendor+'RequestAnimationFrame'];
				if(features.raf) {
					features.caf = window[vendor+'CancelAnimationFrame'] || 
									window[vendor+'CancelRequestAnimationFrame'];
				}
			}
		}
			
		if(!features.raf) {
			var lastTime = 0;
			features.raf = function(fn) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { fn(currTime + timeToCall); }, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
			features.caf = function(id) { clearTimeout(id); };
		}

		// Detect SVG support
		features.svg = !!document.createElementNS && 
						!!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

		framework.features = features;

		return features;
	}
};

framework.detectFeatures();

// Override addEventListener for old versions of IE
if(framework.features.oldIE) {

	framework.bind = function(target, type, listener, unbind) {
		
		type = type.split(' ');

		var methodName = (unbind ? 'detach' : 'attach') + 'Event',
			evName,
			_handleEv = function() {
				listener.handleEvent.call(listener);
			};

		for(var i = 0; i < type.length; i++) {
			evName = type[i];
			if(evName) {

				if(typeof listener === 'object' && listener.handleEvent) {
					if(!unbind) {
						listener['oldIE' + evName] = _handleEv;
					} else {
						if(!listener['oldIE' + evName]) {
							return false;
						}
					}

					target[methodName]( 'on' + evName, listener['oldIE' + evName]);
				} else {
					target[methodName]( 'on' + evName, listener);
				}

			}
		}
	};
	
}

/*>>framework-bridge*/

/*>>core*/
//function(template, UiClass, items, options)

var self = this;

/**
 * Static vars, don't change unless you know what you're doing.
 */
var DOUBLE_TAP_RADIUS = 25, 
	NUM_HOLDERS = 3;

/**
 * Options
 */
var _options = {
	allowPanToNext:true,
	spacing: 0.12,
	bgOpacity: 1,
	mouseUsed: false,
	loop: true,
	pinchToClose: true,
	closeOnScroll: true,
	closeOnVerticalDrag: true,
	verticalDragRange: 0.75,
	hideAnimationDuration: 333,
	showAnimationDuration: 333,
	showHideOpacity: false,
	focus: true,
	escKey: true,
	arrowKeys: true,
	mainScrollEndFriction: 0.35,
	panEndFriction: 0.35,
	isClickableElement: function(el) {
        return el.tagName === 'A';
    },
    getDoubleTapZoom: function(isMouseClick, item) {
    	if(isMouseClick) {
    		return 1;
    	} else {
    		return item.initialZoomLevel < 0.7 ? 1 : 1.33;
    	}
    },
    maxSpreadZoom: 1.33,
	modal: true,

	// not fully implemented yet
	scaleMode: 'fit' // TODO
};
framework.extend(_options, options);


/**
 * Private helper variables & functions
 */

var _getEmptyPoint = function() { 
		return {x:0,y:0}; 
	};

var _isOpen,
	_isDestroying,
	_closedByScroll,
	_currentItemIndex,
	_containerStyle,
	_containerShiftIndex,
	_currPanDist = _getEmptyPoint(),
	_startPanOffset = _getEmptyPoint(),
	_panOffset = _getEmptyPoint(),
	_upMoveEvents, // drag move, drag end & drag cancel events array
	_downEvents, // drag start events array
	_globalEventHandlers,
	_viewportSize = {},
	_currZoomLevel,
	_startZoomLevel,
	_translatePrefix,
	_translateSufix,
	_updateSizeInterval,
	_itemsNeedUpdate,
	_currPositionIndex = 0,
	_offset = {},
	_slideSize = _getEmptyPoint(), // size of slide area, including spacing
	_itemHolders,
	_prevItemIndex,
	_indexDiff = 0, // difference of indexes since last content update
	_dragStartEvent,
	_dragMoveEvent,
	_dragEndEvent,
	_dragCancelEvent,
	_transformKey,
	_pointerEventEnabled,
	_isFixedPosition = true,
	_likelyTouchDevice,
	_modules = [],
	_requestAF,
	_cancelAF,
	_initalClassName,
	_initalWindowScrollY,
	_oldIE,
	_currentWindowScrollY,
	_features,
	_windowVisibleSize = {},
	_renderMaxResolution = false,
	_orientationChangeTimeout,


	// Registers PhotoSWipe module (History, Controller ...)
	_registerModule = function(name, module) {
		framework.extend(self, module.publicMethods);
		_modules.push(name);
	},

	_getLoopedId = function(index) {
		var numSlides = _getNumItems();
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	
	// Micro bind/trigger
	_listeners = {},
	_listen = function(name, fn) {
		if(!_listeners[name]) {
			_listeners[name] = [];
		}
		return _listeners[name].push(fn);
	},
	_shout = function(name) {
		var listeners = _listeners[name];

		if(listeners) {
			var args = Array.prototype.slice.call(arguments);
			args.shift();

			for(var i = 0; i < listeners.length; i++) {
				listeners[i].apply(self, args);
			}
		}
	},

	_getCurrentTime = function() {
		return new Date().getTime();
	},
	_applyBgOpacity = function(opacity) {
		_bgOpacity = opacity;
		self.bg.style.opacity = opacity * _options.bgOpacity;
	},

	_applyZoomTransform = function(styleObj,x,y,zoom,item) {
		if(!_renderMaxResolution || (item && item !== self.currItem) ) {
			zoom = zoom / (item ? item.fitRatio : self.currItem.fitRatio);	
		}
			
		styleObj[_transformKey] = _translatePrefix + x + 'px, ' + y + 'px' + _translateSufix + ' scale(' + zoom + ')';
	},
	_applyCurrentZoomPan = function( allowRenderResolution ) {
		if(_currZoomElementStyle) {

			if(allowRenderResolution) {
				if(_currZoomLevel > self.currItem.fitRatio) {
					if(!_renderMaxResolution) {
						_setImageSize(self.currItem, false, true);
						_renderMaxResolution = true;
					}
				} else {
					if(_renderMaxResolution) {
						_setImageSize(self.currItem);
						_renderMaxResolution = false;
					}
				}
			}
			

			_applyZoomTransform(_currZoomElementStyle, _panOffset.x, _panOffset.y, _currZoomLevel);
		}
	},
	_applyZoomPanToItem = function(item) {
		if(item.container) {

			_applyZoomTransform(item.container.style, 
								item.initialPosition.x, 
								item.initialPosition.y, 
								item.initialZoomLevel,
								item);
		}
	},
	_setTranslateX = function(x, elStyle) {
		elStyle[_transformKey] = _translatePrefix + x + 'px, 0px' + _translateSufix;
	},
	_moveMainScroll = function(x, dragging) {

		if(!_options.loop && dragging) {
			var newSlideIndexOffset = _currentItemIndex + (_slideSize.x * _currPositionIndex - x) / _slideSize.x,
				delta = Math.round(x - _mainScrollPos.x);

			if( (newSlideIndexOffset < 0 && delta > 0) || 
				(newSlideIndexOffset >= _getNumItems() - 1 && delta < 0) ) {
				x = _mainScrollPos.x + delta * _options.mainScrollEndFriction;
			} 
		}
		
		_mainScrollPos.x = x;
		_setTranslateX(x, _containerStyle);
	},
	_calculatePanOffset = function(axis, zoomLevel) {
		var m = _midZoomPoint[axis] - _offset[axis];
		return _startPanOffset[axis] + _currPanDist[axis] + m - m * ( zoomLevel / _startZoomLevel );
	},
	
	_equalizePoints = function(p1, p2) {
		p1.x = p2.x;
		p1.y = p2.y;
		if(p2.id) {
			p1.id = p2.id;
		}
	},
	_roundPoint = function(p) {
		p.x = Math.round(p.x);
		p.y = Math.round(p.y);
	},

	_mouseMoveTimeout = null,
	_onFirstMouseMove = function() {
		// Wait until mouse move event is fired at least twice during 100ms
		// We do this, because some mobile browsers trigger it on touchstart
		if(_mouseMoveTimeout ) { 
			framework.unbind(document, 'mousemove', _onFirstMouseMove);
			framework.addClass(template, 'pswp--has_mouse');
			_options.mouseUsed = true;
			_shout('mouseUsed');
		}
		_mouseMoveTimeout = setTimeout(function() {
			_mouseMoveTimeout = null;
		}, 100);
	},

	_bindEvents = function() {
		framework.bind(document, 'keydown', self);

		if(_features.transform) {
			// don't bind click event in browsers that don't support transform (mostly IE8)
			framework.bind(self.scrollWrap, 'click', self);
		}
		

		if(!_options.mouseUsed) {
			framework.bind(document, 'mousemove', _onFirstMouseMove);
		}

		framework.bind(window, 'resize scroll orientationchange', self);

		_shout('bindEvents');
	},

	_unbindEvents = function() {
		framework.unbind(window, 'resize scroll orientationchange', self);
		framework.unbind(window, 'scroll', _globalEventHandlers.scroll);
		framework.unbind(document, 'keydown', self);
		framework.unbind(document, 'mousemove', _onFirstMouseMove);

		if(_features.transform) {
			framework.unbind(self.scrollWrap, 'click', self);
		}

		if(_isDragging) {
			framework.unbind(window, _upMoveEvents, self);
		}

		clearTimeout(_orientationChangeTimeout);

		_shout('unbindEvents');
	},
	
	_calculatePanBounds = function(zoomLevel, update) {
		var bounds = _calculateItemSize( self.currItem, _viewportSize, zoomLevel );
		if(update) {
			_currPanBounds = bounds;
		}
		return bounds;
	},
	
	_getMinZoomLevel = function(item) {
		if(!item) {
			item = self.currItem;
		}
		return item.initialZoomLevel;
	},
	_getMaxZoomLevel = function(item) {
		if(!item) {
			item = self.currItem;
		}
		return item.w > 0 ? _options.maxSpreadZoom : 1;
	},

	// Return true if offset is out of the bounds
	_modifyDestPanOffset = function(axis, destPanBounds, destPanOffset, destZoomLevel) {
		if(destZoomLevel === self.currItem.initialZoomLevel) {
			destPanOffset[axis] = self.currItem.initialPosition[axis];
			return true;
		} else {
			destPanOffset[axis] = _calculatePanOffset(axis, destZoomLevel); 

			if(destPanOffset[axis] > destPanBounds.min[axis]) {
				destPanOffset[axis] = destPanBounds.min[axis];
				return true;
			} else if(destPanOffset[axis] < destPanBounds.max[axis] ) {
				destPanOffset[axis] = destPanBounds.max[axis];
				return true;
			}
		}
		return false;
	},

	_setupTransforms = function() {

		if(_transformKey) {
			// setup 3d transforms
			var allow3dTransform = _features.perspective && !_likelyTouchDevice;
			_translatePrefix = 'translate' + (allow3dTransform ? '3d(' : '(');
			_translateSufix = _features.perspective ? ', 0px)' : ')';	
			return;
		}

		// Override zoom/pan/move functions in case old browser is used (most likely IE)
		// (so they use left/top/width/height, instead of CSS transform)
	
		_transformKey = 'left';
		framework.addClass(template, 'pswp--ie');

		_setTranslateX = function(x, elStyle) {
			elStyle.left = x + 'px';
		};
		_applyZoomPanToItem = function(item) {

			var zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
				s = item.container.style,
				w = zoomRatio * item.w,
				h = zoomRatio * item.h;

			s.width = w + 'px';
			s.height = h + 'px';
			s.left = item.initialPosition.x + 'px';
			s.top = item.initialPosition.y + 'px';

		};
		_applyCurrentZoomPan = function() {
			if(_currZoomElementStyle) {

				var s = _currZoomElementStyle,
					item = self.currItem,
					zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
					w = zoomRatio * item.w,
					h = zoomRatio * item.h;

				s.width = w + 'px';
				s.height = h + 'px';


				s.left = _panOffset.x + 'px';
				s.top = _panOffset.y + 'px';
			}
			
		};
	},

	_onKeyDown = function(e) {
		var keydownAction = '';
		if(_options.escKey && e.keyCode === 27) { 
			keydownAction = 'close';
		} else if(_options.arrowKeys) {
			if(e.keyCode === 37) {
				keydownAction = 'prev';
			} else if(e.keyCode === 39) { 
				keydownAction = 'next';
			}
		}

		if(keydownAction) {
			// don't do anything if special key pressed to prevent from overriding default browser actions
			// e.g. in Chrome on Mac cmd+arrow-left returns to previous page
			if( !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey ) {
				if(e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				} 
				self[keydownAction]();
			}
		}
	},

	_onGlobalClick = function(e) {
		if(!e) {
			return;
		}

		// don't allow click event to pass through when triggering after drag or some other gesture
		if(_moved || _zoomStarted || _mainScrollAnimating || _verticalDragInitiated) {
			e.preventDefault();
			e.stopPropagation();
		}
	},

	_updatePageScrollOffset = function() {
		self.setScrollOffset(0, framework.getScrollY());		
	};
	


	



// Micro animation engine
var _animations = {},
	_numAnimations = 0,
	_stopAnimation = function(name) {
		if(_animations[name]) {
			if(_animations[name].raf) {
				_cancelAF( _animations[name].raf );
			}
			_numAnimations--;
			delete _animations[name];
		}
	},
	_registerStartAnimation = function(name) {
		if(_animations[name]) {
			_stopAnimation(name);
		}
		if(!_animations[name]) {
			_numAnimations++;
			_animations[name] = {};
		}
	},
	_stopAllAnimations = function() {
		for (var prop in _animations) {

			if( _animations.hasOwnProperty( prop ) ) {
				_stopAnimation(prop);
			} 
			
		}
	},
	_animateProp = function(name, b, endProp, d, easingFn, onUpdate, onComplete) {
		var startAnimTime = _getCurrentTime(), t;
		_registerStartAnimation(name);

		var animloop = function(){
			if ( _animations[name] ) {
				
				t = _getCurrentTime() - startAnimTime; // time diff
				//b - beginning (start prop)
				//d - anim duration

				if ( t >= d ) {
					_stopAnimation(name);
					onUpdate(endProp);
					if(onComplete) {
						onComplete();
					}
					return;
				}
				onUpdate( (endProp - b) * easingFn(t/d) + b );

				_animations[name].raf = _requestAF(animloop);
			}
		};
		animloop();
	};
	


var publicMethods = {

	// make a few local variables and functions public
	shout: _shout,
	listen: _listen,
	viewportSize: _viewportSize,
	options: _options,

	isMainScrollAnimating: function() {
		return _mainScrollAnimating;
	},
	getZoomLevel: function() {
		return _currZoomLevel;
	},
	getCurrentIndex: function() {
		return _currentItemIndex;
	},
	isDragging: function() {
		return _isDragging;
	},	
	isZooming: function() {
		return _isZooming;
	},
	setScrollOffset: function(x,y) {
		_offset.x = x;
		_currentWindowScrollY = _offset.y = y;
		_shout('updateScrollOffset', _offset);
	},
	applyZoomPan: function(zoomLevel,panX,panY,allowRenderResolution) {
		_panOffset.x = panX;
		_panOffset.y = panY;
		_currZoomLevel = zoomLevel;
		_applyCurrentZoomPan( allowRenderResolution );
	},

	init: function() {

		if(_isOpen || _isDestroying) {
			return;
		}

		var i;

		self.framework = framework; // basic functionality
		self.template = template; // root DOM element of PhotoSwipe
		self.bg = framework.getChildByClass(template, 'pswp__bg');

		_initalClassName = template.className;
		_isOpen = true;
				
		_features = framework.detectFeatures();
		_requestAF = _features.raf;
		_cancelAF = _features.caf;
		_transformKey = _features.transform;
		_oldIE = _features.oldIE;
		
		self.scrollWrap = framework.getChildByClass(template, 'pswp__scroll-wrap');
		self.container = framework.getChildByClass(self.scrollWrap, 'pswp__container');

		_containerStyle = self.container.style; // for fast access

		// Objects that hold slides (there are only 3 in DOM)
		self.itemHolders = _itemHolders = [
			{el:self.container.children[0] , wrap:0, index: -1},
			{el:self.container.children[1] , wrap:0, index: -1},
			{el:self.container.children[2] , wrap:0, index: -1}
		];

		// hide nearby item holders until initial zoom animation finishes (to avoid extra Paints)
		_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'none';

		_setupTransforms();

		// Setup global events
		_globalEventHandlers = {
			resize: self.updateSize,

			// Fixes: iOS 10.3 resize event
			// does not update scrollWrap.clientWidth instantly after resize
			// https://github.com/dimsemenov/PhotoSwipe/issues/1315
			orientationchange: function() {
				clearTimeout(_orientationChangeTimeout);
				_orientationChangeTimeout = setTimeout(function() {
					if(_viewportSize.x !== self.scrollWrap.clientWidth) {
						self.updateSize();
					}
				}, 500);
			},
			scroll: _updatePageScrollOffset,
			keydown: _onKeyDown,
			click: _onGlobalClick
		};

		// disable show/hide effects on old browsers that don't support CSS animations or transforms, 
		// old IOS, Android and Opera mobile. Blackberry seems to work fine, even older models.
		var oldPhone = _features.isOldIOSPhone || _features.isOldAndroid || _features.isMobileOpera;
		if(!_features.animationName || !_features.transform || oldPhone) {
			_options.showAnimationDuration = _options.hideAnimationDuration = 0;
		}

		// init modules
		for(i = 0; i < _modules.length; i++) {
			self['init' + _modules[i]]();
		}
		
		// init
		if(UiClass) {
			var ui = self.ui = new UiClass(self, framework);
			ui.init();
		}

		_shout('firstUpdate');
		_currentItemIndex = _currentItemIndex || _options.index || 0;
		// validate index
		if( isNaN(_currentItemIndex) || _currentItemIndex < 0 || _currentItemIndex >= _getNumItems() ) {
			_currentItemIndex = 0;
		}
		self.currItem = _getItemAt( _currentItemIndex );

		
		if(_features.isOldIOSPhone || _features.isOldAndroid) {
			_isFixedPosition = false;
		}
		
		template.setAttribute('aria-hidden', 'false');
		if(_options.modal) {
			if(!_isFixedPosition) {
				template.style.position = 'absolute';
				template.style.top = framework.getScrollY() + 'px';
			} else {
				template.style.position = 'fixed';
			}
		}

		if(_currentWindowScrollY === undefined) {
			_shout('initialLayout');
			_currentWindowScrollY = _initalWindowScrollY = framework.getScrollY();
		}
		
		// add classes to root element of PhotoSwipe
		var rootClasses = 'pswp--open ';
		if(_options.mainClass) {
			rootClasses += _options.mainClass + ' ';
		}
		if(_options.showHideOpacity) {
			rootClasses += 'pswp--animate_opacity ';
		}
		rootClasses += _likelyTouchDevice ? 'pswp--touch' : 'pswp--notouch';
		rootClasses += _features.animationName ? ' pswp--css_animation' : '';
		rootClasses += _features.svg ? ' pswp--svg' : '';
		framework.addClass(template, rootClasses);

		self.updateSize();

		// initial update
		_containerShiftIndex = -1;
		_indexDiff = null;
		for(i = 0; i < NUM_HOLDERS; i++) {
			_setTranslateX( (i+_containerShiftIndex) * _slideSize.x, _itemHolders[i].el.style);
		}

		if(!_oldIE) {
			framework.bind(self.scrollWrap, _downEvents, self); // no dragging for old IE
		}	

		_listen('initialZoomInEnd', function() {
			self.setContent(_itemHolders[0], _currentItemIndex-1);
			self.setContent(_itemHolders[2], _currentItemIndex+1);

			_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'block';

			if(_options.focus) {
				// focus causes layout, 
				// which causes lag during the animation, 
				// that's why we delay it untill the initial zoom transition ends
				template.focus();
			}
			 

			_bindEvents();
		});

		// set content for center slide (first time)
		self.setContent(_itemHolders[1], _currentItemIndex);
		
		self.updateCurrItem();

		_shout('afterInit');

		if(!_isFixedPosition) {

			// On all versions of iOS lower than 8.0, we check size of viewport every second.
			// 
			// This is done to detect when Safari top & bottom bars appear, 
			// as this action doesn't trigger any events (like resize). 
			// 
			// On iOS8 they fixed this.
			// 
			// 10 Nov 2014: iOS 7 usage ~40%. iOS 8 usage 56%.
			
			_updateSizeInterval = setInterval(function() {
				if(!_numAnimations && !_isDragging && !_isZooming && (_currZoomLevel === self.currItem.initialZoomLevel)  ) {
					self.updateSize();
				}
			}, 1000);
		}

		framework.addClass(template, 'pswp--visible');
	},

	// Close the gallery, then destroy it
	close: function() {
		if(!_isOpen) {
			return;
		}

		_isOpen = false;
		_isDestroying = true;
		_shout('close');
		_unbindEvents();

		_showOrHide(self.currItem, null, true, self.destroy);
	},

	// destroys the gallery (unbinds events, cleans up intervals and timeouts to avoid memory leaks)
	destroy: function() {
		_shout('destroy');

		if(_showOrHideTimeout) {
			clearTimeout(_showOrHideTimeout);
		}
		
		template.setAttribute('aria-hidden', 'true');
		template.className = _initalClassName;

		if(_updateSizeInterval) {
			clearInterval(_updateSizeInterval);
		}

		framework.unbind(self.scrollWrap, _downEvents, self);

		// we unbind scroll event at the end, as closing animation may depend on it
		framework.unbind(window, 'scroll', self);

		_stopDragUpdateLoop();

		_stopAllAnimations();

		_listeners = null;
	},

	/**
	 * Pan image to position
	 * @param {Number} x     
	 * @param {Number} y     
	 * @param {Boolean} force Will ignore bounds if set to true.
	 */
	panTo: function(x,y,force) {
		if(!force) {
			if(x > _currPanBounds.min.x) {
				x = _currPanBounds.min.x;
			} else if(x < _currPanBounds.max.x) {
				x = _currPanBounds.max.x;
			}

			if(y > _currPanBounds.min.y) {
				y = _currPanBounds.min.y;
			} else if(y < _currPanBounds.max.y) {
				y = _currPanBounds.max.y;
			}
		}
		
		_panOffset.x = x;
		_panOffset.y = y;
		_applyCurrentZoomPan();
	},
	
	handleEvent: function (e) {
		e = e || window.event;
		if(_globalEventHandlers[e.type]) {
			_globalEventHandlers[e.type](e);
		}
	},


	goTo: function(index) {

		index = _getLoopedId(index);

		var diff = index - _currentItemIndex;
		_indexDiff = diff;

		_currentItemIndex = index;
		self.currItem = _getItemAt( _currentItemIndex );
		_currPositionIndex -= diff;
		
		_moveMainScroll(_slideSize.x * _currPositionIndex);
		

		_stopAllAnimations();
		_mainScrollAnimating = false;

		self.updateCurrItem();
	},
	next: function() {
		self.goTo( _currentItemIndex + 1);
	},
	prev: function() {
		self.goTo( _currentItemIndex - 1);
	},

	// update current zoom/pan objects
	updateCurrZoomItem: function(emulateSetContent) {
		if(emulateSetContent) {
			_shout('beforeChange', 0);
		}

		// itemHolder[1] is middle (current) item
		if(_itemHolders[1].el.children.length) {
			var zoomElement = _itemHolders[1].el.children[0];
			if( framework.hasClass(zoomElement, 'pswp__zoom-wrap') ) {
				_currZoomElementStyle = zoomElement.style;
			} else {
				_currZoomElementStyle = null;
			}
		} else {
			_currZoomElementStyle = null;
		}
		
		_currPanBounds = self.currItem.bounds;	
		_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;

		_panOffset.x = _currPanBounds.center.x;
		_panOffset.y = _currPanBounds.center.y;

		if(emulateSetContent) {
			_shout('afterChange');
		}
	},


	invalidateCurrItems: function() {
		_itemsNeedUpdate = true;
		for(var i = 0; i < NUM_HOLDERS; i++) {
			if( _itemHolders[i].item ) {
				_itemHolders[i].item.needsUpdate = true;
			}
		}
	},

	updateCurrItem: function(beforeAnimation) {

		if(_indexDiff === 0) {
			return;
		}

		var diffAbs = Math.abs(_indexDiff),
			tempHolder;

		if(beforeAnimation && diffAbs < 2) {
			return;
		}


		self.currItem = _getItemAt( _currentItemIndex );
		_renderMaxResolution = false;
		
		_shout('beforeChange', _indexDiff);

		if(diffAbs >= NUM_HOLDERS) {
			_containerShiftIndex += _indexDiff + (_indexDiff > 0 ? -NUM_HOLDERS : NUM_HOLDERS);
			diffAbs = NUM_HOLDERS;
		}
		for(var i = 0; i < diffAbs; i++) {
			if(_indexDiff > 0) {
				tempHolder = _itemHolders.shift();
				_itemHolders[NUM_HOLDERS-1] = tempHolder; // move first to last

				_containerShiftIndex++;
				_setTranslateX( (_containerShiftIndex+2) * _slideSize.x, tempHolder.el.style);
				self.setContent(tempHolder, _currentItemIndex - diffAbs + i + 1 + 1);
			} else {
				tempHolder = _itemHolders.pop();
				_itemHolders.unshift( tempHolder ); // move last to first

				_containerShiftIndex--;
				_setTranslateX( _containerShiftIndex * _slideSize.x, tempHolder.el.style);
				self.setContent(tempHolder, _currentItemIndex + diffAbs - i - 1 - 1);
			}
			
		}

		// reset zoom/pan on previous item
		if(_currZoomElementStyle && Math.abs(_indexDiff) === 1) {

			var prevItem = _getItemAt(_prevItemIndex);
			if(prevItem.initialZoomLevel !== _currZoomLevel) {
				_calculateItemSize(prevItem , _viewportSize );
				_setImageSize(prevItem);
				_applyZoomPanToItem( prevItem ); 				
			}

		}

		// reset diff after update
		_indexDiff = 0;

		self.updateCurrZoomItem();

		_prevItemIndex = _currentItemIndex;

		_shout('afterChange');
		
	},



	updateSize: function(force) {
		
		if(!_isFixedPosition && _options.modal) {
			var windowScrollY = framework.getScrollY();
			if(_currentWindowScrollY !== windowScrollY) {
				template.style.top = windowScrollY + 'px';
				_currentWindowScrollY = windowScrollY;
			}
			if(!force && _windowVisibleSize.x === window.innerWidth && _windowVisibleSize.y === window.innerHeight) {
				return;
			}
			_windowVisibleSize.x = window.innerWidth;
			_windowVisibleSize.y = window.innerHeight;

			//template.style.width = _windowVisibleSize.x + 'px';
			template.style.height = _windowVisibleSize.y + 'px';
		}



		_viewportSize.x = self.scrollWrap.clientWidth;
		_viewportSize.y = self.scrollWrap.clientHeight;

		_updatePageScrollOffset();

		_slideSize.x = _viewportSize.x + Math.round(_viewportSize.x * _options.spacing);
		_slideSize.y = _viewportSize.y;

		_moveMainScroll(_slideSize.x * _currPositionIndex);

		_shout('beforeResize'); // even may be used for example to switch image sources


		// don't re-calculate size on inital size update
		if(_containerShiftIndex !== undefined) {

			var holder,
				item,
				hIndex;

			for(var i = 0; i < NUM_HOLDERS; i++) {
				holder = _itemHolders[i];
				_setTranslateX( (i+_containerShiftIndex) * _slideSize.x, holder.el.style);

				hIndex = _currentItemIndex+i-1;

				if(_options.loop && _getNumItems() > 2) {
					hIndex = _getLoopedId(hIndex);
				}

				// update zoom level on items and refresh source (if needsUpdate)
				item = _getItemAt( hIndex );

				// re-render gallery item if `needsUpdate`,
				// or doesn't have `bounds` (entirely new slide object)
				if( item && (_itemsNeedUpdate || item.needsUpdate || !item.bounds) ) {

					self.cleanSlide( item );
					
					self.setContent( holder, hIndex );

					// if "center" slide
					if(i === 1) {
						self.currItem = item;
						self.updateCurrZoomItem(true);
					}

					item.needsUpdate = false;

				} else if(holder.index === -1 && hIndex >= 0) {
					// add content first time
					self.setContent( holder, hIndex );
				}
				if(item && item.container) {
					_calculateItemSize(item, _viewportSize);
					_setImageSize(item);
					_applyZoomPanToItem( item );
				}
				
			}
			_itemsNeedUpdate = false;
		}	

		_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;
		_currPanBounds = self.currItem.bounds;

		if(_currPanBounds) {
			_panOffset.x = _currPanBounds.center.x;
			_panOffset.y = _currPanBounds.center.y;
			_applyCurrentZoomPan( true );
		}
		
		_shout('resize');
	},
	
	// Zoom current item to
	zoomTo: function(destZoomLevel, centerPoint, speed, easingFn, updateFn) {
		/*
			if(destZoomLevel === 'fit') {
				destZoomLevel = self.currItem.fitRatio;
			} else if(destZoomLevel === 'fill') {
				destZoomLevel = self.currItem.fillRatio;
			}
		*/

		if(centerPoint) {
			_startZoomLevel = _currZoomLevel;
			_midZoomPoint.x = Math.abs(centerPoint.x) - _panOffset.x ;
			_midZoomPoint.y = Math.abs(centerPoint.y) - _panOffset.y ;
			_equalizePoints(_startPanOffset, _panOffset);
		}

		var destPanBounds = _calculatePanBounds(destZoomLevel, false),
			destPanOffset = {};

		_modifyDestPanOffset('x', destPanBounds, destPanOffset, destZoomLevel);
		_modifyDestPanOffset('y', destPanBounds, destPanOffset, destZoomLevel);

		var initialZoomLevel = _currZoomLevel;
		var initialPanOffset = {
			x: _panOffset.x,
			y: _panOffset.y
		};

		_roundPoint(destPanOffset);

		var onUpdate = function(now) {
			if(now === 1) {
				_currZoomLevel = destZoomLevel;
				_panOffset.x = destPanOffset.x;
				_panOffset.y = destPanOffset.y;
			} else {
				_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
				_panOffset.x = (destPanOffset.x - initialPanOffset.x) * now + initialPanOffset.x;
				_panOffset.y = (destPanOffset.y - initialPanOffset.y) * now + initialPanOffset.y;
			}

			if(updateFn) {
				updateFn(now);
			}

			_applyCurrentZoomPan( now === 1 );
		};

		if(speed) {
			_animateProp('customZoomTo', 0, 1, speed, easingFn || framework.easing.sine.inOut, onUpdate);
		} else {
			onUpdate(1);
		}
	}


};


/*>>core*/

/*>>gestures*/
/**
 * Mouse/touch/pointer event handlers.
 * 
 * separated from @core.js for readability
 */

var MIN_SWIPE_DISTANCE = 30,
	DIRECTION_CHECK_OFFSET = 10; // amount of pixels to drag to determine direction of swipe

var _gestureStartTime,
	_gestureCheckSpeedTime,

	// pool of objects that are used during dragging of zooming
	p = {}, // first point
	p2 = {}, // second point (for zoom gesture)
	delta = {},
	_currPoint = {},
	_startPoint = {},
	_currPointers = [],
	_startMainScrollPos = {},
	_releaseAnimData,
	_posPoints = [], // array of points during dragging, used to determine type of gesture
	_tempPoint = {},

	_isZoomingIn,
	_verticalDragInitiated,
	_oldAndroidTouchEndTimeout,
	_currZoomedItemIndex = 0,
	_centerPoint = _getEmptyPoint(),
	_lastReleaseTime = 0,
	_isDragging, // at least one pointer is down
	_isMultitouch, // at least two _pointers are down
	_zoomStarted, // zoom level changed during zoom gesture
	_moved,
	_dragAnimFrame,
	_mainScrollShifted,
	_currentPoints, // array of current touch points
	_isZooming,
	_currPointsDistance,
	_startPointsDistance,
	_currPanBounds,
	_mainScrollPos = _getEmptyPoint(),
	_currZoomElementStyle,
	_mainScrollAnimating, // true, if animation after swipe gesture is running
	_midZoomPoint = _getEmptyPoint(),
	_currCenterPoint = _getEmptyPoint(),
	_direction,
	_isFirstMove,
	_opacityChanged,
	_bgOpacity,
	_wasOverInitialZoom,

	_isEqualPoints = function(p1, p2) {
		return p1.x === p2.x && p1.y === p2.y;
	},
	_isNearbyPoints = function(touch0, touch1) {
		return Math.abs(touch0.x - touch1.x) < DOUBLE_TAP_RADIUS && Math.abs(touch0.y - touch1.y) < DOUBLE_TAP_RADIUS;
	},
	_calculatePointsDistance = function(p1, p2) {
		_tempPoint.x = Math.abs( p1.x - p2.x );
		_tempPoint.y = Math.abs( p1.y - p2.y );
		return Math.sqrt(_tempPoint.x * _tempPoint.x + _tempPoint.y * _tempPoint.y);
	},
	_stopDragUpdateLoop = function() {
		if(_dragAnimFrame) {
			_cancelAF(_dragAnimFrame);
			_dragAnimFrame = null;
		}
	},
	_dragUpdateLoop = function() {
		if(_isDragging) {
			_dragAnimFrame = _requestAF(_dragUpdateLoop);
			_renderMovement();
		}
	},
	_canPan = function() {
		return !(_options.scaleMode === 'fit' && _currZoomLevel ===  self.currItem.initialZoomLevel);
	},
	
	// find the closest parent DOM element
	_closestElement = function(el, fn) {
	  	if(!el || el === document) {
	  		return false;
	  	}

	  	// don't search elements above pswp__scroll-wrap
	  	if(el.getAttribute('class') && el.getAttribute('class').indexOf('pswp__scroll-wrap') > -1 ) {
	  		return false;
	  	}

	  	if( fn(el) ) {
	  		return el;
	  	}

	  	return _closestElement(el.parentNode, fn);
	},

	_preventObj = {},
	_preventDefaultEventBehaviour = function(e, isDown) {
	    _preventObj.prevent = !_closestElement(e.target, _options.isClickableElement);

		_shout('preventDragEvent', e, isDown, _preventObj);
		return _preventObj.prevent;

	},
	_convertTouchToPoint = function(touch, p) {
		p.x = touch.pageX;
		p.y = touch.pageY;
		p.id = touch.identifier;
		return p;
	},
	_findCenterOfPoints = function(p1, p2, pCenter) {
		pCenter.x = (p1.x + p2.x) * 0.5;
		pCenter.y = (p1.y + p2.y) * 0.5;
	},
	_pushPosPoint = function(time, x, y) {
		if(time - _gestureCheckSpeedTime > 50) {
			var o = _posPoints.length > 2 ? _posPoints.shift() : {};
			o.x = x;
			o.y = y; 
			_posPoints.push(o);
			_gestureCheckSpeedTime = time;
		}
	},

	_calculateVerticalDragOpacityRatio = function() {
		var yOffset = _panOffset.y - self.currItem.initialPosition.y; // difference between initial and current position
		return 1 -  Math.abs( yOffset / (_viewportSize.y / 2)  );
	},

	
	// points pool, reused during touch events
	_ePoint1 = {},
	_ePoint2 = {},
	_tempPointsArr = [],
	_tempCounter,
	_getTouchPoints = function(e) {
		// clean up previous points, without recreating array
		while(_tempPointsArr.length > 0) {
			_tempPointsArr.pop();
		}

		if(!_pointerEventEnabled) {
			if(e.type.indexOf('touch') > -1) {

				if(e.touches && e.touches.length > 0) {
					_tempPointsArr[0] = _convertTouchToPoint(e.touches[0], _ePoint1);
					if(e.touches.length > 1) {
						_tempPointsArr[1] = _convertTouchToPoint(e.touches[1], _ePoint2);
					}
				}
				
			} else {
				_ePoint1.x = e.pageX;
				_ePoint1.y = e.pageY;
				_ePoint1.id = '';
				_tempPointsArr[0] = _ePoint1;//_ePoint1;
			}
		} else {
			_tempCounter = 0;
			// we can use forEach, as pointer events are supported only in modern browsers
			_currPointers.forEach(function(p) {
				if(_tempCounter === 0) {
					_tempPointsArr[0] = p;
				} else if(_tempCounter === 1) {
					_tempPointsArr[1] = p;
				}
				_tempCounter++;

			});
		}
		return _tempPointsArr;
	},

	_panOrMoveMainScroll = function(axis, delta) {

		var panFriction,
			overDiff = 0,
			newOffset = _panOffset[axis] + delta[axis],
			startOverDiff,
			dir = delta[axis] > 0,
			newMainScrollPosition = _mainScrollPos.x + delta.x,
			mainScrollDiff = _mainScrollPos.x - _startMainScrollPos.x,
			newPanPos,
			newMainScrollPos;

		// calculate fdistance over the bounds and friction
		if(newOffset > _currPanBounds.min[axis] || newOffset < _currPanBounds.max[axis]) {
			panFriction = _options.panEndFriction;
			// Linear increasing of friction, so at 1/4 of viewport it's at max value. 
			// Looks not as nice as was expected. Left for history.
			// panFriction = (1 - (_panOffset[axis] + delta[axis] + panBounds.min[axis]) / (_viewportSize[axis] / 4) );
		} else {
			panFriction = 1;
		}
		
		newOffset = _panOffset[axis] + delta[axis] * panFriction;

		// move main scroll or start panning
		if(_options.allowPanToNext || _currZoomLevel === self.currItem.initialZoomLevel) {


			if(!_currZoomElementStyle) {
				
				newMainScrollPos = newMainScrollPosition;

			} else if(_direction === 'h' && axis === 'x' && !_zoomStarted ) {
				
				if(dir) {
					if(newOffset > _currPanBounds.min[axis]) {
						panFriction = _options.panEndFriction;
						overDiff = _currPanBounds.min[axis] - newOffset;
						startOverDiff = _currPanBounds.min[axis] - _startPanOffset[axis];
					}
					
					// drag right
					if( (startOverDiff <= 0 || mainScrollDiff < 0) && _getNumItems() > 1 ) {
						newMainScrollPos = newMainScrollPosition;
						if(mainScrollDiff < 0 && newMainScrollPosition > _startMainScrollPos.x) {
							newMainScrollPos = _startMainScrollPos.x;
						}
					} else {
						if(_currPanBounds.min.x !== _currPanBounds.max.x) {
							newPanPos = newOffset;
						}
						
					}

				} else {

					if(newOffset < _currPanBounds.max[axis] ) {
						panFriction =_options.panEndFriction;
						overDiff = newOffset - _currPanBounds.max[axis];
						startOverDiff = _startPanOffset[axis] - _currPanBounds.max[axis];
					}

					if( (startOverDiff <= 0 || mainScrollDiff > 0) && _getNumItems() > 1 ) {
						newMainScrollPos = newMainScrollPosition;

						if(mainScrollDiff > 0 && newMainScrollPosition < _startMainScrollPos.x) {
							newMainScrollPos = _startMainScrollPos.x;
						}

					} else {
						if(_currPanBounds.min.x !== _currPanBounds.max.x) {
							newPanPos = newOffset;
						}
					}

				}


				//
			}

			if(axis === 'x') {

				if(newMainScrollPos !== undefined) {
					_moveMainScroll(newMainScrollPos, true);
					if(newMainScrollPos === _startMainScrollPos.x) {
						_mainScrollShifted = false;
					} else {
						_mainScrollShifted = true;
					}
				}

				if(_currPanBounds.min.x !== _currPanBounds.max.x) {
					if(newPanPos !== undefined) {
						_panOffset.x = newPanPos;
					} else if(!_mainScrollShifted) {
						_panOffset.x += delta.x * panFriction;
					}
				}

				return newMainScrollPos !== undefined;
			}

		}

		if(!_mainScrollAnimating) {
			
			if(!_mainScrollShifted) {
				if(_currZoomLevel > self.currItem.fitRatio) {
					_panOffset[axis] += delta[axis] * panFriction;
				
				}
			}

			
		}
		
	},

	// Pointerdown/touchstart/mousedown handler
	_onDragStart = function(e) {

		// Allow dragging only via left mouse button.
		// As this handler is not added in IE8 - we ignore e.which
		// 
		// http://www.quirksmode.org/js/events_properties.html
		// https://developer.mozilla.org/en-US/docs/Web/API/event.button
		if(e.type === 'mousedown' && e.button > 0  ) {
			return;
		}

		if(_initialZoomRunning) {
			e.preventDefault();
			return;
		}

		if(_oldAndroidTouchEndTimeout && e.type === 'mousedown') {
			return;
		}

		if(_preventDefaultEventBehaviour(e, true)) {
			e.preventDefault();
		}



		_shout('pointerDown');

		if(_pointerEventEnabled) {
			var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
			if(pointerIndex < 0) {
				pointerIndex = _currPointers.length;
			}
			_currPointers[pointerIndex] = {x:e.pageX, y:e.pageY, id: e.pointerId};
		}
		


		var startPointsList = _getTouchPoints(e),
			numPoints = startPointsList.length;

		_currentPoints = null;

		_stopAllAnimations();

		// init drag
		if(!_isDragging || numPoints === 1) {

			

			_isDragging = _isFirstMove = true;
			framework.bind(window, _upMoveEvents, self);

			_isZoomingIn = 
				_wasOverInitialZoom = 
				_opacityChanged = 
				_verticalDragInitiated = 
				_mainScrollShifted = 
				_moved = 
				_isMultitouch = 
				_zoomStarted = false;

			_direction = null;

			_shout('firstTouchStart', startPointsList);

			_equalizePoints(_startPanOffset, _panOffset);

			_currPanDist.x = _currPanDist.y = 0;
			_equalizePoints(_currPoint, startPointsList[0]);
			_equalizePoints(_startPoint, _currPoint);

			//_equalizePoints(_startMainScrollPos, _mainScrollPos);
			_startMainScrollPos.x = _slideSize.x * _currPositionIndex;

			_posPoints = [{
				x: _currPoint.x,
				y: _currPoint.y
			}];

			_gestureCheckSpeedTime = _gestureStartTime = _getCurrentTime();

			//_mainScrollAnimationEnd(true);
			_calculatePanBounds( _currZoomLevel, true );
			
			// Start rendering
			_stopDragUpdateLoop();
			_dragUpdateLoop();
			
		}

		// init zoom
		if(!_isZooming && numPoints > 1 && !_mainScrollAnimating && !_mainScrollShifted) {
			_startZoomLevel = _currZoomLevel;
			_zoomStarted = false; // true if zoom changed at least once

			_isZooming = _isMultitouch = true;
			_currPanDist.y = _currPanDist.x = 0;

			_equalizePoints(_startPanOffset, _panOffset);

			_equalizePoints(p, startPointsList[0]);
			_equalizePoints(p2, startPointsList[1]);

			_findCenterOfPoints(p, p2, _currCenterPoint);

			_midZoomPoint.x = Math.abs(_currCenterPoint.x) - _panOffset.x;
			_midZoomPoint.y = Math.abs(_currCenterPoint.y) - _panOffset.y;
			_currPointsDistance = _startPointsDistance = _calculatePointsDistance(p, p2);
		}


	},

	// Pointermove/touchmove/mousemove handler
	_onDragMove = function(e) {

		e.preventDefault();

		if(_pointerEventEnabled) {
			var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
			if(pointerIndex > -1) {
				var p = _currPointers[pointerIndex];
				p.x = e.pageX;
				p.y = e.pageY; 
			}
		}

		if(_isDragging) {
			var touchesList = _getTouchPoints(e);
			if(!_direction && !_moved && !_isZooming) {

				if(_mainScrollPos.x !== _slideSize.x * _currPositionIndex) {
					// if main scroll position is shifted – direction is always horizontal
					_direction = 'h';
				} else {
					var diff = Math.abs(touchesList[0].x - _currPoint.x) - Math.abs(touchesList[0].y - _currPoint.y);
					// check the direction of movement
					if(Math.abs(diff) >= DIRECTION_CHECK_OFFSET) {
						_direction = diff > 0 ? 'h' : 'v';
						_currentPoints = touchesList;
					}
				}
				
			} else {
				_currentPoints = touchesList;
			}
		}	
	},
	// 
	_renderMovement =  function() {

		if(!_currentPoints) {
			return;
		}

		var numPoints = _currentPoints.length;

		if(numPoints === 0) {
			return;
		}

		_equalizePoints(p, _currentPoints[0]);

		delta.x = p.x - _currPoint.x;
		delta.y = p.y - _currPoint.y;

		if(_isZooming && numPoints > 1) {
			// Handle behaviour for more than 1 point

			_currPoint.x = p.x;
			_currPoint.y = p.y;
		
			// check if one of two points changed
			if( !delta.x && !delta.y && _isEqualPoints(_currentPoints[1], p2) ) {
				return;
			}

			_equalizePoints(p2, _currentPoints[1]);


			if(!_zoomStarted) {
				_zoomStarted = true;
				_shout('zoomGestureStarted');
			}
			
			// Distance between two points
			var pointsDistance = _calculatePointsDistance(p,p2);

			var zoomLevel = _calculateZoomLevel(pointsDistance);

			// slightly over the of initial zoom level
			if(zoomLevel > self.currItem.initialZoomLevel + self.currItem.initialZoomLevel / 15) {
				_wasOverInitialZoom = true;
			}

			// Apply the friction if zoom level is out of the bounds
			var zoomFriction = 1,
				minZoomLevel = _getMinZoomLevel(),
				maxZoomLevel = _getMaxZoomLevel();

			if ( zoomLevel < minZoomLevel ) {
				
				if(_options.pinchToClose && !_wasOverInitialZoom && _startZoomLevel <= self.currItem.initialZoomLevel) {
					// fade out background if zooming out
					var minusDiff = minZoomLevel - zoomLevel;
					var percent = 1 - minusDiff / (minZoomLevel / 1.2);

					_applyBgOpacity(percent);
					_shout('onPinchClose', percent);
					_opacityChanged = true;
				} else {
					zoomFriction = (minZoomLevel - zoomLevel) / minZoomLevel;
					if(zoomFriction > 1) {
						zoomFriction = 1;
					}
					zoomLevel = minZoomLevel - zoomFriction * (minZoomLevel / 3);
				}
				
			} else if ( zoomLevel > maxZoomLevel ) {
				// 1.5 - extra zoom level above the max. E.g. if max is x6, real max 6 + 1.5 = 7.5
				zoomFriction = (zoomLevel - maxZoomLevel) / ( minZoomLevel * 6 );
				if(zoomFriction > 1) {
					zoomFriction = 1;
				}
				zoomLevel = maxZoomLevel + zoomFriction * minZoomLevel;
			}

			if(zoomFriction < 0) {
				zoomFriction = 0;
			}

			// distance between touch points after friction is applied
			_currPointsDistance = pointsDistance;

			// _centerPoint - The point in the middle of two pointers
			_findCenterOfPoints(p, p2, _centerPoint);
		
			// paning with two pointers pressed
			_currPanDist.x += _centerPoint.x - _currCenterPoint.x;
			_currPanDist.y += _centerPoint.y - _currCenterPoint.y;
			_equalizePoints(_currCenterPoint, _centerPoint);

			_panOffset.x = _calculatePanOffset('x', zoomLevel);
			_panOffset.y = _calculatePanOffset('y', zoomLevel);

			_isZoomingIn = zoomLevel > _currZoomLevel;
			_currZoomLevel = zoomLevel;
			_applyCurrentZoomPan();

		} else {

			// handle behaviour for one point (dragging or panning)

			if(!_direction) {
				return;
			}

			if(_isFirstMove) {
				_isFirstMove = false;

				// subtract drag distance that was used during the detection direction  

				if( Math.abs(delta.x) >= DIRECTION_CHECK_OFFSET) {
					delta.x -= _currentPoints[0].x - _startPoint.x;
				}
				
				if( Math.abs(delta.y) >= DIRECTION_CHECK_OFFSET) {
					delta.y -= _currentPoints[0].y - _startPoint.y;
				}
			}

			_currPoint.x = p.x;
			_currPoint.y = p.y;

			// do nothing if pointers position hasn't changed
			if(delta.x === 0 && delta.y === 0) {
				return;
			}

			if(_direction === 'v' && _options.closeOnVerticalDrag) {
				if(!_canPan()) {
					_currPanDist.y += delta.y;
					_panOffset.y += delta.y;

					var opacityRatio = _calculateVerticalDragOpacityRatio();

					_verticalDragInitiated = true;
					_shout('onVerticalDrag', opacityRatio);

					_applyBgOpacity(opacityRatio);
					_applyCurrentZoomPan();
					return ;
				}
			}

			_pushPosPoint(_getCurrentTime(), p.x, p.y);

			_moved = true;
			_currPanBounds = self.currItem.bounds;
			
			var mainScrollChanged = _panOrMoveMainScroll('x', delta);
			if(!mainScrollChanged) {
				_panOrMoveMainScroll('y', delta);

				_roundPoint(_panOffset);
				_applyCurrentZoomPan();
			}

		}

	},
	
	// Pointerup/pointercancel/touchend/touchcancel/mouseup event handler
	_onDragRelease = function(e) {

		if(_features.isOldAndroid ) {

			if(_oldAndroidTouchEndTimeout && e.type === 'mouseup') {
				return;
			}

			// on Android (v4.1, 4.2, 4.3 & possibly older) 
			// ghost mousedown/up event isn't preventable via e.preventDefault,
			// which causes fake mousedown event
			// so we block mousedown/up for 600ms
			if( e.type.indexOf('touch') > -1 ) {
				clearTimeout(_oldAndroidTouchEndTimeout);
				_oldAndroidTouchEndTimeout = setTimeout(function() {
					_oldAndroidTouchEndTimeout = 0;
				}, 600);
			}
			
		}

		_shout('pointerUp');

		if(_preventDefaultEventBehaviour(e, false)) {
			e.preventDefault();
		}

		var releasePoint;

		if(_pointerEventEnabled) {
			var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
			
			if(pointerIndex > -1) {
				releasePoint = _currPointers.splice(pointerIndex, 1)[0];

				if(navigator.msPointerEnabled) {
					var MSPOINTER_TYPES = {
						4: 'mouse', // event.MSPOINTER_TYPE_MOUSE
						2: 'touch', // event.MSPOINTER_TYPE_TOUCH 
						3: 'pen' // event.MSPOINTER_TYPE_PEN
					};
					releasePoint.type = MSPOINTER_TYPES[e.pointerType];

					if(!releasePoint.type) {
						releasePoint.type = e.pointerType || 'mouse';
					}
				} else {
					releasePoint.type = e.pointerType || 'mouse';
				}

			}
		}

		var touchList = _getTouchPoints(e),
			gestureType,
			numPoints = touchList.length;

		if(e.type === 'mouseup') {
			numPoints = 0;
		}

		// Do nothing if there were 3 touch points or more
		if(numPoints === 2) {
			_currentPoints = null;
			return true;
		}

		// if second pointer released
		if(numPoints === 1) {
			_equalizePoints(_startPoint, touchList[0]);
		}				


		// pointer hasn't moved, send "tap release" point
		if(numPoints === 0 && !_direction && !_mainScrollAnimating) {
			if(!releasePoint) {
				if(e.type === 'mouseup') {
					releasePoint = {x: e.pageX, y: e.pageY, type:'mouse'};
				} else if(e.changedTouches && e.changedTouches[0]) {
					releasePoint = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, type:'touch'};
				}		
			}

			_shout('touchRelease', e, releasePoint);
		}

		// Difference in time between releasing of two last touch points (zoom gesture)
		var releaseTimeDiff = -1;

		// Gesture completed, no pointers left
		if(numPoints === 0) {
			_isDragging = false;
			framework.unbind(window, _upMoveEvents, self);

			_stopDragUpdateLoop();

			if(_isZooming) {
				// Two points released at the same time
				releaseTimeDiff = 0;
			} else if(_lastReleaseTime !== -1) {
				releaseTimeDiff = _getCurrentTime() - _lastReleaseTime;
			}
		}
		_lastReleaseTime = numPoints === 1 ? _getCurrentTime() : -1;
		
		if(releaseTimeDiff !== -1 && releaseTimeDiff < 150) {
			gestureType = 'zoom';
		} else {
			gestureType = 'swipe';
		}

		if(_isZooming && numPoints < 2) {
			_isZooming = false;

			// Only second point released
			if(numPoints === 1) {
				gestureType = 'zoomPointerUp';
			}
			_shout('zoomGestureEnded');
		}

		_currentPoints = null;
		if(!_moved && !_zoomStarted && !_mainScrollAnimating && !_verticalDragInitiated) {
			// nothing to animate
			return;
		}
	
		_stopAllAnimations();

		
		if(!_releaseAnimData) {
			_releaseAnimData = _initDragReleaseAnimationData();
		}
		
		_releaseAnimData.calculateSwipeSpeed('x');


		if(_verticalDragInitiated) {

			var opacityRatio = _calculateVerticalDragOpacityRatio();

			if(opacityRatio < _options.verticalDragRange) {
				self.close();
			} else {
				var initalPanY = _panOffset.y,
					initialBgOpacity = _bgOpacity;

				_animateProp('verticalDrag', 0, 1, 300, framework.easing.cubic.out, function(now) {
					
					_panOffset.y = (self.currItem.initialPosition.y - initalPanY) * now + initalPanY;

					_applyBgOpacity(  (1 - initialBgOpacity) * now + initialBgOpacity );
					_applyCurrentZoomPan();
				});

				_shout('onVerticalDrag', 1);
			}

			return;
		}


		// main scroll 
		if(  (_mainScrollShifted || _mainScrollAnimating) && numPoints === 0) {
			var itemChanged = _finishSwipeMainScrollGesture(gestureType, _releaseAnimData);
			if(itemChanged) {
				return;
			}
			gestureType = 'zoomPointerUp';
		}

		// prevent zoom/pan animation when main scroll animation runs
		if(_mainScrollAnimating) {
			return;
		}
		
		// Complete simple zoom gesture (reset zoom level if it's out of the bounds)  
		if(gestureType !== 'swipe') {
			_completeZoomGesture();
			return;
		}
	
		// Complete pan gesture if main scroll is not shifted, and it's possible to pan current image
		if(!_mainScrollShifted && _currZoomLevel > self.currItem.fitRatio) {
			_completePanGesture(_releaseAnimData);
		}
	},


	// Returns object with data about gesture
	// It's created only once and then reused
	_initDragReleaseAnimationData  = function() {
		// temp local vars
		var lastFlickDuration,
			tempReleasePos;

		// s = this
		var s = {
			lastFlickOffset: {},
			lastFlickDist: {},
			lastFlickSpeed: {},
			slowDownRatio:  {},
			slowDownRatioReverse:  {},
			speedDecelerationRatio:  {},
			speedDecelerationRatioAbs:  {},
			distanceOffset:  {},
			backAnimDestination: {},
			backAnimStarted: {},
			calculateSwipeSpeed: function(axis) {
				

				if( _posPoints.length > 1) {
					lastFlickDuration = _getCurrentTime() - _gestureCheckSpeedTime + 50;
					tempReleasePos = _posPoints[_posPoints.length-2][axis];
				} else {
					lastFlickDuration = _getCurrentTime() - _gestureStartTime; // total gesture duration
					tempReleasePos = _startPoint[axis];
				}
				s.lastFlickOffset[axis] = _currPoint[axis] - tempReleasePos;
				s.lastFlickDist[axis] = Math.abs(s.lastFlickOffset[axis]);
				if(s.lastFlickDist[axis] > 20) {
					s.lastFlickSpeed[axis] = s.lastFlickOffset[axis] / lastFlickDuration;
				} else {
					s.lastFlickSpeed[axis] = 0;
				}
				if( Math.abs(s.lastFlickSpeed[axis]) < 0.1 ) {
					s.lastFlickSpeed[axis] = 0;
				}
				
				s.slowDownRatio[axis] = 0.95;
				s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
				s.speedDecelerationRatio[axis] = 1;
			},

			calculateOverBoundsAnimOffset: function(axis, speed) {
				if(!s.backAnimStarted[axis]) {

					if(_panOffset[axis] > _currPanBounds.min[axis]) {
						s.backAnimDestination[axis] = _currPanBounds.min[axis];
						
					} else if(_panOffset[axis] < _currPanBounds.max[axis]) {
						s.backAnimDestination[axis] = _currPanBounds.max[axis];
					}

					if(s.backAnimDestination[axis] !== undefined) {
						s.slowDownRatio[axis] = 0.7;
						s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
						if(s.speedDecelerationRatioAbs[axis] < 0.05) {

							s.lastFlickSpeed[axis] = 0;
							s.backAnimStarted[axis] = true;

							_animateProp('bounceZoomPan'+axis,_panOffset[axis], 
								s.backAnimDestination[axis], 
								speed || 300, 
								framework.easing.sine.out, 
								function(pos) {
									_panOffset[axis] = pos;
									_applyCurrentZoomPan();
								}
							);

						}
					}
				}
			},

			// Reduces the speed by slowDownRatio (per 10ms)
			calculateAnimOffset: function(axis) {
				if(!s.backAnimStarted[axis]) {
					s.speedDecelerationRatio[axis] = s.speedDecelerationRatio[axis] * (s.slowDownRatio[axis] + 
												s.slowDownRatioReverse[axis] - 
												s.slowDownRatioReverse[axis] * s.timeDiff / 10);

					s.speedDecelerationRatioAbs[axis] = Math.abs(s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis]);
					s.distanceOffset[axis] = s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis] * s.timeDiff;
					_panOffset[axis] += s.distanceOffset[axis];

				}
			},

			panAnimLoop: function() {
				if ( _animations.zoomPan ) {
					_animations.zoomPan.raf = _requestAF(s.panAnimLoop);

					s.now = _getCurrentTime();
					s.timeDiff = s.now - s.lastNow;
					s.lastNow = s.now;
					
					s.calculateAnimOffset('x');
					s.calculateAnimOffset('y');

					_applyCurrentZoomPan();
					
					s.calculateOverBoundsAnimOffset('x');
					s.calculateOverBoundsAnimOffset('y');


					if (s.speedDecelerationRatioAbs.x < 0.05 && s.speedDecelerationRatioAbs.y < 0.05) {

						// round pan position
						_panOffset.x = Math.round(_panOffset.x);
						_panOffset.y = Math.round(_panOffset.y);
						_applyCurrentZoomPan();
						
						_stopAnimation('zoomPan');
						return;
					}
				}

			}
		};
		return s;
	},

	_completePanGesture = function(animData) {
		// calculate swipe speed for Y axis (paanning)
		animData.calculateSwipeSpeed('y');

		_currPanBounds = self.currItem.bounds;
		
		animData.backAnimDestination = {};
		animData.backAnimStarted = {};

		// Avoid acceleration animation if speed is too low
		if(Math.abs(animData.lastFlickSpeed.x) <= 0.05 && Math.abs(animData.lastFlickSpeed.y) <= 0.05 ) {
			animData.speedDecelerationRatioAbs.x = animData.speedDecelerationRatioAbs.y = 0;

			// Run pan drag release animation. E.g. if you drag image and release finger without momentum.
			animData.calculateOverBoundsAnimOffset('x');
			animData.calculateOverBoundsAnimOffset('y');
			return true;
		}

		// Animation loop that controls the acceleration after pan gesture ends
		_registerStartAnimation('zoomPan');
		animData.lastNow = _getCurrentTime();
		animData.panAnimLoop();
	},


	_finishSwipeMainScrollGesture = function(gestureType, _releaseAnimData) {
		var itemChanged;
		if(!_mainScrollAnimating) {
			_currZoomedItemIndex = _currentItemIndex;
		}


		
		var itemsDiff;

		if(gestureType === 'swipe') {
			var totalShiftDist = _currPoint.x - _startPoint.x,
				isFastLastFlick = _releaseAnimData.lastFlickDist.x < 10;

			// if container is shifted for more than MIN_SWIPE_DISTANCE, 
			// and last flick gesture was in right direction
			if(totalShiftDist > MIN_SWIPE_DISTANCE && 
				(isFastLastFlick || _releaseAnimData.lastFlickOffset.x > 20) ) {
				// go to prev item
				itemsDiff = -1;
			} else if(totalShiftDist < -MIN_SWIPE_DISTANCE && 
				(isFastLastFlick || _releaseAnimData.lastFlickOffset.x < -20) ) {
				// go to next item
				itemsDiff = 1;
			}
		}

		var nextCircle;

		if(itemsDiff) {
			
			_currentItemIndex += itemsDiff;

			if(_currentItemIndex < 0) {
				_currentItemIndex = _options.loop ? _getNumItems()-1 : 0;
				nextCircle = true;
			} else if(_currentItemIndex >= _getNumItems()) {
				_currentItemIndex = _options.loop ? 0 : _getNumItems()-1;
				nextCircle = true;
			}

			if(!nextCircle || _options.loop) {
				_indexDiff += itemsDiff;
				_currPositionIndex -= itemsDiff;
				itemChanged = true;
			}
			

			
		}

		var animateToX = _slideSize.x * _currPositionIndex;
		var animateToDist = Math.abs( animateToX - _mainScrollPos.x );
		var finishAnimDuration;


		if(!itemChanged && animateToX > _mainScrollPos.x !== _releaseAnimData.lastFlickSpeed.x > 0) {
			// "return to current" duration, e.g. when dragging from slide 0 to -1
			finishAnimDuration = 333; 
		} else {
			finishAnimDuration = Math.abs(_releaseAnimData.lastFlickSpeed.x) > 0 ? 
									animateToDist / Math.abs(_releaseAnimData.lastFlickSpeed.x) : 
									333;

			finishAnimDuration = Math.min(finishAnimDuration, 400);
			finishAnimDuration = Math.max(finishAnimDuration, 250);
		}

		if(_currZoomedItemIndex === _currentItemIndex) {
			itemChanged = false;
		}
		
		_mainScrollAnimating = true;
		
		_shout('mainScrollAnimStart');

		_animateProp('mainScroll', _mainScrollPos.x, animateToX, finishAnimDuration, framework.easing.cubic.out, 
			_moveMainScroll,
			function() {
				_stopAllAnimations();
				_mainScrollAnimating = false;
				_currZoomedItemIndex = -1;
				
				if(itemChanged || _currZoomedItemIndex !== _currentItemIndex) {
					self.updateCurrItem();
				}
				
				_shout('mainScrollAnimComplete');
			}
		);

		if(itemChanged) {
			self.updateCurrItem(true);
		}

		return itemChanged;
	},

	_calculateZoomLevel = function(touchesDistance) {
		return  1 / _startPointsDistance * touchesDistance * _startZoomLevel;
	},

	// Resets zoom if it's out of bounds
	_completeZoomGesture = function() {
		var destZoomLevel = _currZoomLevel,
			minZoomLevel = _getMinZoomLevel(),
			maxZoomLevel = _getMaxZoomLevel();

		if ( _currZoomLevel < minZoomLevel ) {
			destZoomLevel = minZoomLevel;
		} else if ( _currZoomLevel > maxZoomLevel ) {
			destZoomLevel = maxZoomLevel;
		}

		var destOpacity = 1,
			onUpdate,
			initialOpacity = _bgOpacity;

		if(_opacityChanged && !_isZoomingIn && !_wasOverInitialZoom && _currZoomLevel < minZoomLevel) {
			//_closedByScroll = true;
			self.close();
			return true;
		}

		if(_opacityChanged) {
			onUpdate = function(now) {
				_applyBgOpacity(  (destOpacity - initialOpacity) * now + initialOpacity );
			};
		}

		self.zoomTo(destZoomLevel, 0, 200,  framework.easing.cubic.out, onUpdate);
		return true;
	};


_registerModule('Gestures', {
	publicMethods: {

		initGestures: function() {

			// helper function that builds touch/pointer/mouse events
			var addEventNames = function(pref, down, move, up, cancel) {
				_dragStartEvent = pref + down;
				_dragMoveEvent = pref + move;
				_dragEndEvent = pref + up;
				if(cancel) {
					_dragCancelEvent = pref + cancel;
				} else {
					_dragCancelEvent = '';
				}
			};

			_pointerEventEnabled = _features.pointerEvent;
			if(_pointerEventEnabled && _features.touch) {
				// we don't need touch events, if browser supports pointer events
				_features.touch = false;
			}

			if(_pointerEventEnabled) {
				if(navigator.msPointerEnabled) {
					// IE10 pointer events are case-sensitive
					addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
				} else {
					addEventNames('pointer', 'down', 'move', 'up', 'cancel');
				}
			} else if(_features.touch) {
				addEventNames('touch', 'start', 'move', 'end', 'cancel');
				_likelyTouchDevice = true;
			} else {
				addEventNames('mouse', 'down', 'move', 'up');	
			}

			_upMoveEvents = _dragMoveEvent + ' ' + _dragEndEvent  + ' ' +  _dragCancelEvent;
			_downEvents = _dragStartEvent;

			if(_pointerEventEnabled && !_likelyTouchDevice) {
				_likelyTouchDevice = (navigator.maxTouchPoints > 1) || (navigator.msMaxTouchPoints > 1);
			}
			// make variable public
			self.likelyTouchDevice = _likelyTouchDevice; 
			
			_globalEventHandlers[_dragStartEvent] = _onDragStart;
			_globalEventHandlers[_dragMoveEvent] = _onDragMove;
			_globalEventHandlers[_dragEndEvent] = _onDragRelease; // the Kraken

			if(_dragCancelEvent) {
				_globalEventHandlers[_dragCancelEvent] = _globalEventHandlers[_dragEndEvent];
			}

			// Bind mouse events on device with detected hardware touch support, in case it supports multiple types of input.
			if(_features.touch) {
				_downEvents += ' mousedown';
				_upMoveEvents += ' mousemove mouseup';
				_globalEventHandlers.mousedown = _globalEventHandlers[_dragStartEvent];
				_globalEventHandlers.mousemove = _globalEventHandlers[_dragMoveEvent];
				_globalEventHandlers.mouseup = _globalEventHandlers[_dragEndEvent];
			}

			if(!_likelyTouchDevice) {
				// don't allow pan to next slide from zoomed state on Desktop
				_options.allowPanToNext = false;
			}
		}

	}
});


/*>>gestures*/

/*>>show-hide-transition*/
/**
 * show-hide-transition.js:
 *
 * Manages initial opening or closing transition.
 *
 * If you're not planning to use transition for gallery at all,
 * you may set options hideAnimationDuration and showAnimationDuration to 0,
 * and just delete startAnimation function.
 * 
 */


var _showOrHideTimeout,
	_showOrHide = function(item, img, out, completeFn) {

		if(_showOrHideTimeout) {
			clearTimeout(_showOrHideTimeout);
		}

		_initialZoomRunning = true;
		_initialContentSet = true;
		
		// dimensions of small thumbnail {x:,y:,w:}.
		// Height is optional, as calculated based on large image.
		var thumbBounds; 
		if(item.initialLayout) {
			thumbBounds = item.initialLayout;
			item.initialLayout = null;
		} else {
			thumbBounds = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
		}

		var duration = out ? _options.hideAnimationDuration : _options.showAnimationDuration;

		var onComplete = function() {
			_stopAnimation('initialZoom');
			if(!out) {
				_applyBgOpacity(1);
				if(img) {
					img.style.display = 'block';
				}
				framework.addClass(template, 'pswp--animated-in');
				_shout('initialZoom' + (out ? 'OutEnd' : 'InEnd'));
			} else {
				self.template.removeAttribute('style');
				self.bg.removeAttribute('style');
			}

			if(completeFn) {
				completeFn();
			}
			_initialZoomRunning = false;
		};

		// if bounds aren't provided, just open gallery without animation
		if(!duration || !thumbBounds || thumbBounds.x === undefined) {

			_shout('initialZoom' + (out ? 'Out' : 'In') );

			_currZoomLevel = item.initialZoomLevel;
			_equalizePoints(_panOffset,  item.initialPosition );
			_applyCurrentZoomPan();

			template.style.opacity = out ? 0 : 1;
			_applyBgOpacity(1);

			if(duration) {
				setTimeout(function() {
					onComplete();
				}, duration);
			} else {
				onComplete();
			}

			return;
		}

		var startAnimation = function() {
			var closeWithRaf = _closedByScroll,
				fadeEverything = !self.currItem.src || self.currItem.loadError || _options.showHideOpacity;
			
			// apply hw-acceleration to image
			if(item.miniImg) {
				item.miniImg.style.webkitBackfaceVisibility = 'hidden';
			}

			if(!out) {
				_currZoomLevel = thumbBounds.w / item.w;
				_panOffset.x = thumbBounds.x;
				_panOffset.y = thumbBounds.y - _initalWindowScrollY;

				self[fadeEverything ? 'template' : 'bg'].style.opacity = 0.001;
				_applyCurrentZoomPan();
			}

			_registerStartAnimation('initialZoom');
			
			if(out && !closeWithRaf) {
				framework.removeClass(template, 'pswp--animated-in');
			}

			if(fadeEverything) {
				if(out) {
					framework[ (closeWithRaf ? 'remove' : 'add') + 'Class' ](template, 'pswp--animate_opacity');
				} else {
					setTimeout(function() {
						framework.addClass(template, 'pswp--animate_opacity');
					}, 30);
				}
			}

			_showOrHideTimeout = setTimeout(function() {

				_shout('initialZoom' + (out ? 'Out' : 'In') );
				

				if(!out) {

					// "in" animation always uses CSS transitions (instead of rAF).
					// CSS transition work faster here, 
					// as developer may also want to animate other things, 
					// like ui on top of sliding area, which can be animated just via CSS
					
					_currZoomLevel = item.initialZoomLevel;
					_equalizePoints(_panOffset,  item.initialPosition );
					_applyCurrentZoomPan();
					_applyBgOpacity(1);

					if(fadeEverything) {
						template.style.opacity = 1;
					} else {
						_applyBgOpacity(1);
					}

					_showOrHideTimeout = setTimeout(onComplete, duration + 20);
				} else {

					// "out" animation uses rAF only when PhotoSwipe is closed by browser scroll, to recalculate position
					var destZoomLevel = thumbBounds.w / item.w,
						initialPanOffset = {
							x: _panOffset.x,
							y: _panOffset.y
						},
						initialZoomLevel = _currZoomLevel,
						initalBgOpacity = _bgOpacity,
						onUpdate = function(now) {
							
							if(now === 1) {
								_currZoomLevel = destZoomLevel;
								_panOffset.x = thumbBounds.x;
								_panOffset.y = thumbBounds.y  - _currentWindowScrollY;
							} else {
								_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
								_panOffset.x = (thumbBounds.x - initialPanOffset.x) * now + initialPanOffset.x;
								_panOffset.y = (thumbBounds.y - _currentWindowScrollY - initialPanOffset.y) * now + initialPanOffset.y;
							}
							
							_applyCurrentZoomPan();
							if(fadeEverything) {
								template.style.opacity = 1 - now;
							} else {
								_applyBgOpacity( initalBgOpacity - now * initalBgOpacity );
							}
						};

					if(closeWithRaf) {
						_animateProp('initialZoom', 0, 1, duration, framework.easing.cubic.out, onUpdate, onComplete);
					} else {
						onUpdate(1);
						_showOrHideTimeout = setTimeout(onComplete, duration + 20);
					}
				}
			
			}, out ? 25 : 90); // Main purpose of this delay is to give browser time to paint and
					// create composite layers of PhotoSwipe UI parts (background, controls, caption, arrows).
					// Which avoids lag at the beginning of scale transition.
		};
		startAnimation();

		
	};

/*>>show-hide-transition*/

/*>>items-controller*/
/**
*
* Controller manages gallery items, their dimensions, and their content.
* 
*/

var _items,
	_tempPanAreaSize = {},
	_imagesToAppendPool = [],
	_initialContentSet,
	_initialZoomRunning,
	_controllerDefaultOptions = {
		index: 0,
		errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
		forceProgressiveLoading: false, // TODO
		preload: [1,1],
		getNumItemsFn: function() {
			return _items.length;
		}
	};


var _getItemAt,
	_getNumItems,
	_initialIsLoop,
	_getZeroBounds = function() {
		return {
			center:{x:0,y:0}, 
			max:{x:0,y:0}, 
			min:{x:0,y:0}
		};
	},
	_calculateSingleItemPanBounds = function(item, realPanElementW, realPanElementH ) {
		var bounds = item.bounds;

		// position of element when it's centered
		bounds.center.x = Math.round((_tempPanAreaSize.x - realPanElementW) / 2);
		bounds.center.y = Math.round((_tempPanAreaSize.y - realPanElementH) / 2) + item.vGap.top;

		// maximum pan position
		bounds.max.x = (realPanElementW > _tempPanAreaSize.x) ? 
							Math.round(_tempPanAreaSize.x - realPanElementW) : 
							bounds.center.x;
		
		bounds.max.y = (realPanElementH > _tempPanAreaSize.y) ? 
							Math.round(_tempPanAreaSize.y - realPanElementH) + item.vGap.top : 
							bounds.center.y;
		
		// minimum pan position
		bounds.min.x = (realPanElementW > _tempPanAreaSize.x) ? 0 : bounds.center.x;
		bounds.min.y = (realPanElementH > _tempPanAreaSize.y) ? item.vGap.top : bounds.center.y;
	},
	_calculateItemSize = function(item, viewportSize, zoomLevel) {

		if (item.src && !item.loadError) {
			var isInitial = !zoomLevel;
			
			if(isInitial) {
				if(!item.vGap) {
					item.vGap = {top:0,bottom:0};
				}
				// allows overriding vertical margin for individual items
				_shout('parseVerticalMargin', item);
			}


			_tempPanAreaSize.x = viewportSize.x;
			_tempPanAreaSize.y = viewportSize.y - item.vGap.top - item.vGap.bottom;

			if (isInitial) {
				var hRatio = _tempPanAreaSize.x / item.w;
				var vRatio = _tempPanAreaSize.y / item.h;

				item.fitRatio = hRatio < vRatio ? hRatio : vRatio;
				//item.fillRatio = hRatio > vRatio ? hRatio : vRatio;

				var scaleMode = _options.scaleMode;

				if (scaleMode === 'orig') {
					zoomLevel = 1;
				} else if (scaleMode === 'fit') {
					zoomLevel = item.fitRatio;
				}

				if (zoomLevel > 1) {
					zoomLevel = 1;
				}

				item.initialZoomLevel = zoomLevel;
				
				if(!item.bounds) {
					// reuse bounds object
					item.bounds = _getZeroBounds(); 
				}
			}

			if(!zoomLevel) {
				return;
			}

			_calculateSingleItemPanBounds(item, item.w * zoomLevel, item.h * zoomLevel);

			if (isInitial && zoomLevel === item.initialZoomLevel) {
				item.initialPosition = item.bounds.center;
			}

			return item.bounds;
		} else {
			item.w = item.h = 0;
			item.initialZoomLevel = item.fitRatio = 1;
			item.bounds = _getZeroBounds();
			item.initialPosition = item.bounds.center;

			// if it's not image, we return zero bounds (content is not zoomable)
			return item.bounds;
		}
		
	},

	


	_appendImage = function(index, item, baseDiv, img, preventAnimation, keepPlaceholder) {
		

		if(item.loadError) {
			return;
		}

		if(img) {

			item.imageAppended = true;
			_setImageSize(item, img, (item === self.currItem && _renderMaxResolution) );
			
			baseDiv.appendChild(img);

			if(keepPlaceholder) {
				setTimeout(function() {
					if(item && item.loaded && item.placeholder) {
						item.placeholder.style.display = 'none';
						item.placeholder = null;
					}
				}, 500);
			}
		}
	},
	


	_preloadImage = function(item) {
		item.loading = true;
		item.loaded = false;
		var img = item.img = framework.createEl('pswp__img', 'img');
		var onComplete = function() {
			item.loading = false;
			item.loaded = true;

			if(item.loadComplete) {
				item.loadComplete(item);
			} else {
				item.img = null; // no need to store image object
			}
			img.onload = img.onerror = null;
			img = null;
		};
		img.onload = onComplete;
		img.onerror = function() {
			item.loadError = true;
			onComplete();
		};		

		img.src = item.src;// + '?a=' + Math.random();

		return img;
	},
	_checkForError = function(item, cleanUp) {
		if(item.src && item.loadError && item.container) {

			if(cleanUp) {
				item.container.innerHTML = '';
			}

			item.container.innerHTML = _options.errorMsg.replace('%url%',  item.src );
			return true;
			
		}
	},
	_setImageSize = function(item, img, maxRes) {
		if(!item.src) {
			return;
		}

		if(!img) {
			img = item.container.lastChild;
		}

		var w = maxRes ? item.w : Math.round(item.w * item.fitRatio),
			h = maxRes ? item.h : Math.round(item.h * item.fitRatio);
		
		if(item.placeholder && !item.loaded) {
			item.placeholder.style.width = w + 'px';
			item.placeholder.style.height = h + 'px';
		}

		img.style.width = w + 'px';
		img.style.height = h + 'px';
	},
	_appendImagesPool = function() {

		if(_imagesToAppendPool.length) {
			var poolItem;

			for(var i = 0; i < _imagesToAppendPool.length; i++) {
				poolItem = _imagesToAppendPool[i];
				if( poolItem.holder.index === poolItem.index ) {
					_appendImage(poolItem.index, poolItem.item, poolItem.baseDiv, poolItem.img, false, poolItem.clearPlaceholder);
				}
			}
			_imagesToAppendPool = [];
		}
	};
	


_registerModule('Controller', {

	publicMethods: {

		lazyLoadItem: function(index) {
			index = _getLoopedId(index);
			var item = _getItemAt(index);

			if(!item || ((item.loaded || item.loading) && !_itemsNeedUpdate)) {
				return;
			}

			_shout('gettingData', index, item);

			if (!item.src) {
				return;
			}

			_preloadImage(item);
		},
		initController: function() {
			framework.extend(_options, _controllerDefaultOptions, true);
			self.items = _items = items;
			_getItemAt = self.getItemAt;
			_getNumItems = _options.getNumItemsFn; //self.getNumItems;



			_initialIsLoop = _options.loop;
			if(_getNumItems() < 3) {
				_options.loop = false; // disable loop if less then 3 items
			}

			_listen('beforeChange', function(diff) {

				var p = _options.preload,
					isNext = diff === null ? true : (diff >= 0),
					preloadBefore = Math.min(p[0], _getNumItems() ),
					preloadAfter = Math.min(p[1], _getNumItems() ),
					i;


				for(i = 1; i <= (isNext ? preloadAfter : preloadBefore); i++) {
					self.lazyLoadItem(_currentItemIndex+i);
				}
				for(i = 1; i <= (isNext ? preloadBefore : preloadAfter); i++) {
					self.lazyLoadItem(_currentItemIndex-i);
				}
			});

			_listen('initialLayout', function() {
				self.currItem.initialLayout = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
			});

			_listen('mainScrollAnimComplete', _appendImagesPool);
			_listen('initialZoomInEnd', _appendImagesPool);



			_listen('destroy', function() {
				var item;
				for(var i = 0; i < _items.length; i++) {
					item = _items[i];
					// remove reference to DOM elements, for GC
					if(item.container) {
						item.container = null; 
					}
					if(item.placeholder) {
						item.placeholder = null;
					}
					if(item.img) {
						item.img = null;
					}
					if(item.preloader) {
						item.preloader = null;
					}
					if(item.loadError) {
						item.loaded = item.loadError = false;
					}
				}
				_imagesToAppendPool = null;
			});
		},


		getItemAt: function(index) {
			if (index >= 0) {
				return _items[index] !== undefined ? _items[index] : false;
			}
			return false;
		},

		allowProgressiveImg: function() {
			// 1. Progressive image loading isn't working on webkit/blink 
			//    when hw-acceleration (e.g. translateZ) is applied to IMG element.
			//    That's why in PhotoSwipe parent element gets zoom transform, not image itself.
			//    
			// 2. Progressive image loading sometimes blinks in webkit/blink when applying animation to parent element.
			//    That's why it's disabled on touch devices (mainly because of swipe transition)
			//    
			// 3. Progressive image loading sometimes doesn't work in IE (up to 11).

			// Don't allow progressive loading on non-large touch devices
			return _options.forceProgressiveLoading || !_likelyTouchDevice || _options.mouseUsed || screen.width > 1200; 
			// 1200 - to eliminate touch devices with large screen (like Chromebook Pixel)
		},

		setContent: function(holder, index) {

			if(_options.loop) {
				index = _getLoopedId(index);
			}

			var prevItem = self.getItemAt(holder.index);
			if(prevItem) {
				prevItem.container = null;
			}
	
			var item = self.getItemAt(index),
				img;
			
			if(!item) {
				holder.el.innerHTML = '';
				return;
			}

			// allow to override data
			_shout('gettingData', index, item);

			holder.index = index;
			holder.item = item;

			// base container DIV is created only once for each of 3 holders
			var baseDiv = item.container = framework.createEl('pswp__zoom-wrap'); 

			

			if(!item.src && item.html) {
				if(item.html.tagName) {
					baseDiv.appendChild(item.html);
				} else {
					baseDiv.innerHTML = item.html;
				}
			}

			_checkForError(item);

			_calculateItemSize(item, _viewportSize);
			
			if(item.src && !item.loadError && !item.loaded) {

				item.loadComplete = function(item) {

					// gallery closed before image finished loading
					if(!_isOpen) {
						return;
					}

					// check if holder hasn't changed while image was loading
					if(holder && holder.index === index ) {
						if( _checkForError(item, true) ) {
							item.loadComplete = item.img = null;
							_calculateItemSize(item, _viewportSize);
							_applyZoomPanToItem(item);

							if(holder.index === _currentItemIndex) {
								// recalculate dimensions
								self.updateCurrZoomItem();
							}
							return;
						}
						if( !item.imageAppended ) {
							if(_features.transform && (_mainScrollAnimating || _initialZoomRunning) ) {
								_imagesToAppendPool.push({
									item:item,
									baseDiv:baseDiv,
									img:item.img,
									index:index,
									holder:holder,
									clearPlaceholder:true
								});
							} else {
								_appendImage(index, item, baseDiv, item.img, _mainScrollAnimating || _initialZoomRunning, true);
							}
						} else {
							// remove preloader & mini-img
							if(!_initialZoomRunning && item.placeholder) {
								item.placeholder.style.display = 'none';
								item.placeholder = null;
							}
						}
					}

					item.loadComplete = null;
					item.img = null; // no need to store image element after it's added

					_shout('imageLoadComplete', index, item);
				};

				if(framework.features.transform) {
					
					var placeholderClassName = 'pswp__img pswp__img--placeholder'; 
					placeholderClassName += (item.msrc ? '' : ' pswp__img--placeholder--blank');

					var placeholder = framework.createEl(placeholderClassName, item.msrc ? 'img' : '');
					if(item.msrc) {
						placeholder.src = item.msrc;
					}
					
					_setImageSize(item, placeholder);

					baseDiv.appendChild(placeholder);
					item.placeholder = placeholder;

				}
				

				

				if(!item.loading) {
					_preloadImage(item);
				}


				if( self.allowProgressiveImg() ) {
					// just append image
					if(!_initialContentSet && _features.transform) {
						_imagesToAppendPool.push({
							item:item, 
							baseDiv:baseDiv, 
							img:item.img, 
							index:index, 
							holder:holder
						});
					} else {
						_appendImage(index, item, baseDiv, item.img, true, true);
					}
				}
				
			} else if(item.src && !item.loadError) {
				// image object is created every time, due to bugs of image loading & delay when switching images
				img = framework.createEl('pswp__img', 'img');
				img.style.opacity = 1;
				img.src = item.src;
				_setImageSize(item, img);
				_appendImage(index, item, baseDiv, img, true);
			}
			

			if(!_initialContentSet && index === _currentItemIndex) {
				_currZoomElementStyle = baseDiv.style;
				_showOrHide(item, (img ||item.img) );
			} else {
				_applyZoomPanToItem(item);
			}

			holder.el.innerHTML = '';
			holder.el.appendChild(baseDiv);
		},

		cleanSlide: function( item ) {
			if(item.img ) {
				item.img.onload = item.img.onerror = null;
			}
			item.loaded = item.loading = item.img = item.imageAppended = false;
		}

	}
});

/*>>items-controller*/

/*>>tap*/
/**
 * tap.js:
 *
 * Displatches tap and double-tap events.
 * 
 */

var tapTimer,
	tapReleasePoint = {},
	_dispatchTapEvent = function(origEvent, releasePoint, pointerType) {		
		var e = document.createEvent( 'CustomEvent' ),
			eDetail = {
				origEvent:origEvent, 
				target:origEvent.target, 
				releasePoint: releasePoint, 
				pointerType:pointerType || 'touch'
			};

		e.initCustomEvent( 'pswpTap', true, true, eDetail );
		origEvent.target.dispatchEvent(e);
	};

_registerModule('Tap', {
	publicMethods: {
		initTap: function() {
			_listen('firstTouchStart', self.onTapStart);
			_listen('touchRelease', self.onTapRelease);
			_listen('destroy', function() {
				tapReleasePoint = {};
				tapTimer = null;
			});
		},
		onTapStart: function(touchList) {
			if(touchList.length > 1) {
				clearTimeout(tapTimer);
				tapTimer = null;
			}
		},
		onTapRelease: function(e, releasePoint) {
			if(!releasePoint) {
				return;
			}

			if(!_moved && !_isMultitouch && !_numAnimations) {
				var p0 = releasePoint;
				if(tapTimer) {
					clearTimeout(tapTimer);
					tapTimer = null;

					// Check if taped on the same place
					if ( _isNearbyPoints(p0, tapReleasePoint) ) {
						_shout('doubleTap', p0);
						return;
					}
				}

				if(releasePoint.type === 'mouse') {
					_dispatchTapEvent(e, releasePoint, 'mouse');
					return;
				}

				var clickedTagName = e.target.tagName.toUpperCase();
				// avoid double tap delay on buttons and elements that have class pswp__single-tap
				if(clickedTagName === 'BUTTON' || framework.hasClass(e.target, 'pswp__single-tap') ) {
					_dispatchTapEvent(e, releasePoint);
					return;
				}

				_equalizePoints(tapReleasePoint, p0);

				tapTimer = setTimeout(function() {
					_dispatchTapEvent(e, releasePoint);
					tapTimer = null;
				}, 300);
			}
		}
	}
});

/*>>tap*/

/*>>desktop-zoom*/
/**
 *
 * desktop-zoom.js:
 *
 * - Binds mousewheel event for paning zoomed image.
 * - Manages "dragging", "zoomed-in", "zoom-out" classes.
 *   (which are used for cursors and zoom icon)
 * - Adds toggleDesktopZoom function.
 * 
 */

var _wheelDelta;
	
_registerModule('DesktopZoom', {

	publicMethods: {

		initDesktopZoom: function() {

			if(_oldIE) {
				// no zoom for old IE (<=8)
				return;
			}

			if(_likelyTouchDevice) {
				// if detected hardware touch support, we wait until mouse is used,
				// and only then apply desktop-zoom features
				_listen('mouseUsed', function() {
					self.setupDesktopZoom();
				});
			} else {
				self.setupDesktopZoom(true);
			}

		},

		setupDesktopZoom: function(onInit) {

			_wheelDelta = {};

			var events = 'wheel mousewheel DOMMouseScroll';
			
			_listen('bindEvents', function() {
				framework.bind(template, events,  self.handleMouseWheel);
			});

			_listen('unbindEvents', function() {
				if(_wheelDelta) {
					framework.unbind(template, events, self.handleMouseWheel);
				}
			});

			self.mouseZoomedIn = false;

			var hasDraggingClass,
				updateZoomable = function() {
					if(self.mouseZoomedIn) {
						framework.removeClass(template, 'pswp--zoomed-in');
						self.mouseZoomedIn = false;
					}
					if(_currZoomLevel < 1) {
						framework.addClass(template, 'pswp--zoom-allowed');
					} else {
						framework.removeClass(template, 'pswp--zoom-allowed');
					}
					removeDraggingClass();
				},
				removeDraggingClass = function() {
					if(hasDraggingClass) {
						framework.removeClass(template, 'pswp--dragging');
						hasDraggingClass = false;
					}
				};

			_listen('resize' , updateZoomable);
			_listen('afterChange' , updateZoomable);
			_listen('pointerDown', function() {
				if(self.mouseZoomedIn) {
					hasDraggingClass = true;
					framework.addClass(template, 'pswp--dragging');
				}
			});
			_listen('pointerUp', removeDraggingClass);

			if(!onInit) {
				updateZoomable();
			}
			
		},

		handleMouseWheel: function(e) {

			if(_currZoomLevel <= self.currItem.fitRatio) {
				if( _options.modal ) {

					if (!_options.closeOnScroll || _numAnimations || _isDragging) {
						e.preventDefault();
					} else if(_transformKey && Math.abs(e.deltaY) > 2) {
						// close PhotoSwipe
						// if browser supports transforms & scroll changed enough
						_closedByScroll = true;
						self.close();
					}

				}
				return true;
			}

			// allow just one event to fire
			e.stopPropagation();

			// https://developer.mozilla.org/en-US/docs/Web/Events/wheel
			_wheelDelta.x = 0;

			if('deltaX' in e) {
				if(e.deltaMode === 1 /* DOM_DELTA_LINE */) {
					// 18 - average line height
					_wheelDelta.x = e.deltaX * 18;
					_wheelDelta.y = e.deltaY * 18;
				} else {
					_wheelDelta.x = e.deltaX;
					_wheelDelta.y = e.deltaY;
				}
			} else if('wheelDelta' in e) {
				if(e.wheelDeltaX) {
					_wheelDelta.x = -0.16 * e.wheelDeltaX;
				}
				if(e.wheelDeltaY) {
					_wheelDelta.y = -0.16 * e.wheelDeltaY;
				} else {
					_wheelDelta.y = -0.16 * e.wheelDelta;
				}
			} else if('detail' in e) {
				_wheelDelta.y = e.detail;
			} else {
				return;
			}

			_calculatePanBounds(_currZoomLevel, true);

			var newPanX = _panOffset.x - _wheelDelta.x,
				newPanY = _panOffset.y - _wheelDelta.y;

			// only prevent scrolling in nonmodal mode when not at edges
			if (_options.modal ||
				(
				newPanX <= _currPanBounds.min.x && newPanX >= _currPanBounds.max.x &&
				newPanY <= _currPanBounds.min.y && newPanY >= _currPanBounds.max.y
				) ) {
				e.preventDefault();
			}

			// TODO: use rAF instead of mousewheel?
			self.panTo(newPanX, newPanY);
		},

		toggleDesktopZoom: function(centerPoint) {
			centerPoint = centerPoint || {x:_viewportSize.x/2 + _offset.x, y:_viewportSize.y/2 + _offset.y };

			var doubleTapZoomLevel = _options.getDoubleTapZoom(true, self.currItem);
			var zoomOut = _currZoomLevel === doubleTapZoomLevel;
			
			self.mouseZoomedIn = !zoomOut;

			self.zoomTo(zoomOut ? self.currItem.initialZoomLevel : doubleTapZoomLevel, centerPoint, 333);
			framework[ (!zoomOut ? 'add' : 'remove') + 'Class'](template, 'pswp--zoomed-in');
		}

	}
});


/*>>desktop-zoom*/

/*>>history*/
/**
 *
 * history.js:
 *
 * - Back button to close gallery.
 * 
 * - Unique URL for each slide: example.com/&pid=1&gid=3
 *   (where PID is picture index, and GID and gallery index)
 *   
 * - Switch URL when slides change.
 * 
 */


var _historyDefaultOptions = {
	history: true,
	galleryUID: 1
};

var _historyUpdateTimeout,
	_hashChangeTimeout,
	_hashAnimCheckTimeout,
	_hashChangedByScript,
	_hashChangedByHistory,
	_hashReseted,
	_initialHash,
	_historyChanged,
	_closedFromURL,
	_urlChangedOnce,
	_windowLoc,

	_supportsPushState,

	_getHash = function() {
		return _windowLoc.hash.substring(1);
	},
	_cleanHistoryTimeouts = function() {

		if(_historyUpdateTimeout) {
			clearTimeout(_historyUpdateTimeout);
		}

		if(_hashAnimCheckTimeout) {
			clearTimeout(_hashAnimCheckTimeout);
		}
	},

	// pid - Picture index
	// gid - Gallery index
	_parseItemIndexFromURL = function() {
		var hash = _getHash(),
			params = {};

		if(hash.length < 5) { // pid=1
			return params;
		}

		var i, vars = hash.split('&');
		for (i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');	
			if(pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}
		if(_options.galleryPIDs) {
			// detect custom pid in hash and search for it among the items collection
			var searchfor = params.pid;
			params.pid = 0; // if custom pid cannot be found, fallback to the first item
			for(i = 0; i < _items.length; i++) {
				if(_items[i].pid === searchfor) {
					params.pid = i;
					break;
				}
			}
		} else {
			params.pid = parseInt(params.pid,10)-1;
		}
		if( params.pid < 0 ) {
			params.pid = 0;
		}
		return params;
	},
	_updateHash = function() {

		if(_hashAnimCheckTimeout) {
			clearTimeout(_hashAnimCheckTimeout);
		}


		if(_numAnimations || _isDragging) {
			// changing browser URL forces layout/paint in some browsers, which causes noticable lag during animation
			// that's why we update hash only when no animations running
			_hashAnimCheckTimeout = setTimeout(_updateHash, 500);
			return;
		}
		
		if(_hashChangedByScript) {
			clearTimeout(_hashChangeTimeout);
		} else {
			_hashChangedByScript = true;
		}


		var pid = (_currentItemIndex + 1);
		var item = _getItemAt( _currentItemIndex );
		if(item.hasOwnProperty('pid')) {
			// carry forward any custom pid assigned to the item
			pid = item.pid;
		}
		var newHash = _initialHash + '&'  +  'gid=' + _options.galleryUID + '&' + 'pid=' + pid;

		if(!_historyChanged) {
			if(_windowLoc.hash.indexOf(newHash) === -1) {
				_urlChangedOnce = true;
			}
			// first time - add new hisory record, then just replace
		}

		var newURL = _windowLoc.href.split('#')[0] + '#' +  newHash;

		if( _supportsPushState ) {

			if('#' + newHash !== window.location.hash) {
				history[_historyChanged ? 'replaceState' : 'pushState']('', document.title, newURL);
			}

		} else {
			if(_historyChanged) {
				_windowLoc.replace( newURL );
			} else {
				_windowLoc.hash = newHash;
			}
		}
		
		

		_historyChanged = true;
		_hashChangeTimeout = setTimeout(function() {
			_hashChangedByScript = false;
		}, 60);
	};



	

_registerModule('History', {

	

	publicMethods: {
		initHistory: function() {

			framework.extend(_options, _historyDefaultOptions, true);

			if( !_options.history ) {
				return;
			}


			_windowLoc = window.location;
			_urlChangedOnce = false;
			_closedFromURL = false;
			_historyChanged = false;
			_initialHash = _getHash();
			_supportsPushState = ('pushState' in history);


			if(_initialHash.indexOf('gid=') > -1) {
				_initialHash = _initialHash.split('&gid=')[0];
				_initialHash = _initialHash.split('?gid=')[0];
			}
			

			_listen('afterChange', self.updateURL);
			_listen('unbindEvents', function() {
				framework.unbind(window, 'hashchange', self.onHashChange);
			});


			var returnToOriginal = function() {
				_hashReseted = true;
				if(!_closedFromURL) {

					if(_urlChangedOnce) {
						history.back();
					} else {

						if(_initialHash) {
							_windowLoc.hash = _initialHash;
						} else {
							if (_supportsPushState) {

								// remove hash from url without refreshing it or scrolling to top
								history.pushState('', document.title,  _windowLoc.pathname + _windowLoc.search );
							} else {
								_windowLoc.hash = '';
							}
						}
					}
					
				}

				_cleanHistoryTimeouts();
			};


			_listen('unbindEvents', function() {
				if(_closedByScroll) {
					// if PhotoSwipe is closed by scroll, we go "back" before the closing animation starts
					// this is done to keep the scroll position
					returnToOriginal();
				}
			});
			_listen('destroy', function() {
				if(!_hashReseted) {
					returnToOriginal();
				}
			});
			_listen('firstUpdate', function() {
				_currentItemIndex = _parseItemIndexFromURL().pid;
			});

			

			
			var index = _initialHash.indexOf('pid=');
			if(index > -1) {
				_initialHash = _initialHash.substring(0, index);
				if(_initialHash.slice(-1) === '&') {
					_initialHash = _initialHash.slice(0, -1);
				}
			}
			

			setTimeout(function() {
				if(_isOpen) { // hasn't destroyed yet
					framework.bind(window, 'hashchange', self.onHashChange);
				}
			}, 40);
			
		},
		onHashChange: function() {

			if(_getHash() === _initialHash) {

				_closedFromURL = true;
				self.close();
				return;
			}
			if(!_hashChangedByScript) {

				_hashChangedByHistory = true;
				self.goTo( _parseItemIndexFromURL().pid );
				_hashChangedByHistory = false;
			}
			
		},
		updateURL: function() {

			// Delay the update of URL, to avoid lag during transition, 
			// and to not to trigger actions like "refresh page sound" or "blinking favicon" to often
			
			_cleanHistoryTimeouts();
			

			if(_hashChangedByHistory) {
				return;
			}

			if(!_historyChanged) {
				_updateHash(); // first time
			} else {
				_historyUpdateTimeout = setTimeout(_updateHash, 800);
			}
		}
	
	}
});


/*>>history*/
	framework.extend(self, publicMethods); };
	return PhotoSwipe;
});

/***/ }),

/***/ 443:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"object"==typeof navigator&&function(e,t){ true?module.exports=t():0}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function i(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),e}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}function l(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],i=!0,a=!1,r=void 0;try{for(var o,s=e[Symbol.iterator]();!(i=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);i=!0);}catch(e){a=!0,r=e}finally{try{i||null==s.return||s.return()}finally{if(a)throw r}}return n}(e,t)||u(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(e){return function(e){if(Array.isArray(e))return d(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||u(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e,t){if(e){if("string"==typeof e)return d(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?d(e,t):void 0}}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function h(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function m(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){m(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var g={addCSS:!0,thumbWidth:15,watch:!0};function y(e,t){return function(){return Array.from(document.querySelectorAll(t)).includes(this)}.call(e,t)}var b=function(e){return null!=e?e.constructor:null},v=function(e,t){return!!(e&&t&&e instanceof t)},w=function(e){return null==e},k=function(e){return b(e)===Object},T=function(e){return b(e)===String},C=function(e){return Array.isArray(e)},A=function(e){return v(e,NodeList)},S=T,P=C,E=A,N=function(e){return v(e,Element)},M=function(e){return v(e,Event)},x=function(e){return w(e)||(T(e)||C(e)||A(e))&&!e.length||k(e)&&!Object.keys(e).length};function I(e,t){if(1>t){var n=function(e){var t="".concat(e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return t?Math.max(0,(t[1]?t[1].length:0)-(t[2]?+t[2]:0)):0}(t);return parseFloat(e.toFixed(n))}return Math.round(e/t)*t}var L,O,_,j=function(){function e(t,n){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,e),N(t)?this.element=t:S(t)&&(this.element=document.querySelector(t)),N(this.element)&&x(this.element.rangeTouch)&&(this.config=f({},g,{},n),this.init())}return function(e,t,n){t&&h(e.prototype,t),n&&h(e,n)}(e,[{key:"init",value:function(){e.enabled&&(this.config.addCSS&&(this.element.style.userSelect="none",this.element.style.webKitUserSelect="none",this.element.style.touchAction="manipulation"),this.listeners(!0),this.element.rangeTouch=this)}},{key:"destroy",value:function(){e.enabled&&(this.config.addCSS&&(this.element.style.userSelect="",this.element.style.webKitUserSelect="",this.element.style.touchAction=""),this.listeners(!1),this.element.rangeTouch=null)}},{key:"listeners",value:function(e){var t=this,n=e?"addEventListener":"removeEventListener";["touchstart","touchmove","touchend"].forEach((function(e){t.element[n](e,(function(e){return t.set(e)}),!1)}))}},{key:"get",value:function(t){if(!e.enabled||!M(t))return null;var n,i=t.target,a=t.changedTouches[0],r=parseFloat(i.getAttribute("min"))||0,o=parseFloat(i.getAttribute("max"))||100,s=parseFloat(i.getAttribute("step"))||1,l=i.getBoundingClientRect(),c=100/l.width*(this.config.thumbWidth/2)/100;return 0>(n=100/l.width*(a.clientX-l.left))?n=0:100<n&&(n=100),50>n?n-=(100-2*n)*c:50<n&&(n+=2*(n-50)*c),r+I(n/100*(o-r),s)}},{key:"set",value:function(t){e.enabled&&M(t)&&!t.target.disabled&&(t.preventDefault(),t.target.value=this.get(t),function(e,t){if(e&&t){var n=new Event(t,{bubbles:!0});e.dispatchEvent(n)}}(t.target,"touchend"===t.type?"change":"input"))}}],[{key:"setup",value:function(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},i=null;if(x(t)||S(t)?i=Array.from(document.querySelectorAll(S(t)?t:'input[type="range"]')):N(t)?i=[t]:E(t)?i=Array.from(t):P(t)&&(i=t.filter(N)),x(i))return null;var a=f({},g,{},n);if(S(t)&&a.watch){var r=new MutationObserver((function(n){Array.from(n).forEach((function(n){Array.from(n.addedNodes).forEach((function(n){N(n)&&y(n,t)&&new e(n,a)}))}))}));r.observe(document.body,{childList:!0,subtree:!0})}return i.map((function(t){return new e(t,n)}))}},{key:"enabled",get:function(){return"ontouchstart"in document.documentElement}}]),e}(),D=function(e){return null!=e?e.constructor:null},q=function(e,t){return Boolean(e&&t&&e instanceof t)},H=function(e){return null==e},F=function(e){return D(e)===Object},R=function(e){return D(e)===String},V=function(e){return D(e)===Function},B=function(e){return Array.isArray(e)},U=function(e){return q(e,NodeList)},W=function(e){return H(e)||(R(e)||B(e)||U(e))&&!e.length||F(e)&&!Object.keys(e).length},z=H,K=F,Y=function(e){return D(e)===Number&&!Number.isNaN(e)},Q=R,X=function(e){return D(e)===Boolean},$=V,J=B,G=U,Z=function(t){return null!==t&&"object"===e(t)&&1===t.nodeType&&"object"===e(t.style)&&"object"===e(t.ownerDocument)},ee=function(e){return q(e,Event)},te=function(e){return q(e,KeyboardEvent)},ne=function(e){return q(e,TextTrack)||!H(e)&&R(e.kind)},ie=function(e){return q(e,Promise)&&V(e.then)},ae=function(e){if(q(e,window.URL))return!0;if(!R(e))return!1;var t=e;e.startsWith("http://")&&e.startsWith("https://")||(t="http://".concat(e));try{return!W(new URL(t).hostname)}catch(e){return!1}},re=W,oe=(L=document.createElement("span"),O={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},_=Object.keys(O).find((function(e){return void 0!==L.style[e]})),!!Q(_)&&O[_]);function se(e,t){setTimeout((function(){try{e.hidden=!0,e.offsetHeight,e.hidden=!1}catch(e){}}),t)}var le={isIE:
/* @cc_on!@ */
!!document.documentMode,isEdge:window.navigator.userAgent.includes("Edge"),isWebkit:"WebkitAppearance"in document.documentElement.style&&!/Edge/.test(navigator.userAgent),isIPhone:/(iPhone|iPod)/gi.test(navigator.platform),isIos:/(iPad|iPhone|iPod)/gi.test(navigator.platform)};function ce(e,t){return t.split(".").reduce((function(e,t){return e&&e[t]}),e)}function ue(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];if(!n.length)return e;var r=n.shift();return K(r)?(Object.keys(r).forEach((function(t){K(r[t])?(Object.keys(e).includes(t)||Object.assign(e,a({},t,{})),ue(e[t],r[t])):Object.assign(e,a({},t,r[t]))})),ue.apply(void 0,[e].concat(n))):e}function de(e,t){var n=e.length?e:[e];Array.from(n).reverse().forEach((function(e,n){var i=n>0?t.cloneNode(!0):t,a=e.parentNode,r=e.nextSibling;i.appendChild(e),r?a.insertBefore(i,r):a.appendChild(i)}))}function he(e,t){Z(e)&&!re(t)&&Object.entries(t).filter((function(e){var t=l(e,2)[1];return!z(t)})).forEach((function(t){var n=l(t,2),i=n[0],a=n[1];return e.setAttribute(i,a)}))}function me(e,t,n){var i=document.createElement(e);return K(t)&&he(i,t),Q(n)&&(i.innerText=n),i}function pe(e,t,n,i){Z(t)&&t.appendChild(me(e,n,i))}function fe(e){G(e)||J(e)?Array.from(e).forEach(fe):Z(e)&&Z(e.parentNode)&&e.parentNode.removeChild(e)}function ge(e){if(Z(e))for(var t=e.childNodes.length;t>0;)e.removeChild(e.lastChild),t-=1}function ye(e,t){return Z(t)&&Z(t.parentNode)&&Z(e)?(t.parentNode.replaceChild(e,t),e):null}function be(e,t){if(!Q(e)||re(e))return{};var n={},i=ue({},t);return e.split(",").forEach((function(e){var t=e.trim(),a=t.replace(".",""),r=t.replace(/[[\]]/g,"").split("="),o=l(r,1)[0],s=r.length>1?r[1].replace(/["']/g,""):"";switch(t.charAt(0)){case".":Q(i.class)?n.class="".concat(i.class," ").concat(a):n.class=a;break;case"#":n.id=t.replace("#","");break;case"[":n[o]=s}})),ue(i,n)}function ve(e,t){if(Z(e)){var n=t;X(n)||(n=!e.hidden),e.hidden=n}}function we(e,t,n){if(G(e))return Array.from(e).map((function(e){return we(e,t,n)}));if(Z(e)){var i="toggle";return void 0!==n&&(i=n?"add":"remove"),e.classList[i](t),e.classList.contains(t)}return!1}function ke(e,t){return Z(e)&&e.classList.contains(t)}function Te(e,t){var n=Element.prototype;return(n.matches||n.webkitMatchesSelector||n.mozMatchesSelector||n.msMatchesSelector||function(){return Array.from(document.querySelectorAll(t)).includes(this)}).call(e,t)}function Ce(e){return this.elements.container.querySelectorAll(e)}function Ae(e){return this.elements.container.querySelector(e)}function Se(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];Z(e)&&(e.focus({preventScroll:!0}),t&&we(e,this.config.classNames.tabFocus))}var Pe,Ee={"audio/ogg":"vorbis","audio/wav":"1","video/webm":"vp8, vorbis","video/mp4":"avc1.42E01E, mp4a.40.2","video/ogg":"theora"},Ne={audio:"canPlayType"in document.createElement("audio"),video:"canPlayType"in document.createElement("video"),check:function(e,t,n){var i=le.isIPhone&&n&&Ne.playsinline,a=Ne[e]||"html5"!==t;return{api:a,ui:a&&Ne.rangeInput&&("video"!==e||!le.isIPhone||i)}},pip:!(le.isIPhone||!$(me("video").webkitSetPresentationMode)&&(!document.pictureInPictureEnabled||me("video").disablePictureInPicture)),airplay:$(window.WebKitPlaybackTargetAvailabilityEvent),playsinline:"playsInline"in document.createElement("video"),mime:function(e){if(re(e))return!1;var t=l(e.split("/"),1)[0],n=e;if(!this.isHTML5||t!==this.type)return!1;Object.keys(Ee).includes(n)&&(n+='; codecs="'.concat(Ee[e],'"'));try{return Boolean(n&&this.media.canPlayType(n).replace(/no/,""))}catch(e){return!1}},textTracks:"textTracks"in document.createElement("video"),rangeInput:(Pe=document.createElement("input"),Pe.type="range","range"===Pe.type),touch:"ontouchstart"in document.documentElement,transitions:!1!==oe,reducedMotion:"matchMedia"in window&&window.matchMedia("(prefers-reduced-motion)").matches},Me=function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){return e=!0,null}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(e){}return e}();function xe(e,t,n){var i=this,a=arguments.length>3&&void 0!==arguments[3]&&arguments[3],r=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],o=arguments.length>5&&void 0!==arguments[5]&&arguments[5];if(e&&"addEventListener"in e&&!re(t)&&$(n)){var s=t.split(" "),l=o;Me&&(l={passive:r,capture:o}),s.forEach((function(t){i&&i.eventListeners&&a&&i.eventListeners.push({element:e,type:t,callback:n,options:l}),e[a?"addEventListener":"removeEventListener"](t,n,l)}))}}function Ie(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2?arguments[2]:void 0,i=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],a=arguments.length>4&&void 0!==arguments[4]&&arguments[4];xe.call(this,e,t,n,!0,i,a)}function Le(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2?arguments[2]:void 0,i=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],a=arguments.length>4&&void 0!==arguments[4]&&arguments[4];xe.call(this,e,t,n,!1,i,a)}function Oe(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",i=arguments.length>2?arguments[2]:void 0,a=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=arguments.length>4&&void 0!==arguments[4]&&arguments[4],o=function o(){Le(e,n,o,a,r);for(var s=arguments.length,l=new Array(s),c=0;c<s;c++)l[c]=arguments[c];i.apply(t,l)};xe.call(this,e,n,o,!0,a,r)}function _e(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};if(Z(e)&&!re(t)){var a=new CustomEvent(t,{bubbles:n,detail:o(o({},i),{},{plyr:this})});e.dispatchEvent(a)}}function je(){this&&this.eventListeners&&(this.eventListeners.forEach((function(e){var t=e.element,n=e.type,i=e.callback,a=e.options;t.removeEventListener(n,i,a)})),this.eventListeners=[])}function De(){var e=this;return new Promise((function(t){return e.ready?setTimeout(t,0):Ie.call(e,e.elements.container,"ready",t)})).then((function(){}))}function qe(e){ie(e)&&e.then(null,(function(){}))}function He(e){return!!(J(e)||Q(e)&&e.includes(":"))&&(J(e)?e:e.split(":")).map(Number).every(Y)}function Fe(e){if(!J(e)||!e.every(Y))return null;var t=l(e,2),n=t[0],i=t[1],a=function e(t,n){return 0===n?t:e(n,t%n)}(n,i);return[n/a,i/a]}function Re(e){var t=function(e){return He(e)?e.split(":").map(Number):null},n=t(e);if(null===n&&(n=t(this.config.ratio)),null===n&&!re(this.embed)&&J(this.embed.ratio)&&(n=this.embed.ratio),null===n&&this.isHTML5){var i=this.media;n=Fe([i.videoWidth,i.videoHeight])}return n}function Ve(e){if(!this.isVideo)return{};var t=this.elements.wrapper,n=Re.call(this,e),i=l(J(n)?n:[0,0],2),a=100/i[0]*i[1];if(t.style.paddingBottom="".concat(a,"%"),this.isVimeo&&!this.config.vimeo.premium&&this.supported.ui){var r=100/this.media.offsetWidth*parseInt(window.getComputedStyle(this.media).paddingBottom,10),o=(r-a)/(r/50);this.fullscreen.active?t.style.paddingBottom=null:this.media.style.transform="translateY(-".concat(o,"%)")}else this.isHTML5&&t.classList.toggle(this.config.classNames.videoFixedRatio,null!==n);return{padding:a,ratio:n}}var Be={getSources:function(){var e=this;return this.isHTML5?Array.from(this.media.querySelectorAll("source")).filter((function(t){var n=t.getAttribute("type");return!!re(n)||Ne.mime.call(e,n)})):[]},getQualityOptions:function(){return this.config.quality.forced?this.config.quality.options:Be.getSources.call(this).map((function(e){return Number(e.getAttribute("size"))})).filter(Boolean)},setup:function(){if(this.isHTML5){var e=this;e.options.speed=e.config.speed.options,re(this.config.ratio)||Ve.call(e),Object.defineProperty(e.media,"quality",{get:function(){var t=Be.getSources.call(e).find((function(t){return t.getAttribute("src")===e.source}));return t&&Number(t.getAttribute("size"))},set:function(t){if(e.quality!==t){if(e.config.quality.forced&&$(e.config.quality.onChange))e.config.quality.onChange(t);else{var n=Be.getSources.call(e).find((function(e){return Number(e.getAttribute("size"))===t}));if(!n)return;var i=e.media,a=i.currentTime,r=i.paused,o=i.preload,s=i.readyState,l=i.playbackRate;e.media.src=n.getAttribute("src"),("none"!==o||s)&&(e.once("loadedmetadata",(function(){e.speed=l,e.currentTime=a,r||qe(e.play())})),e.media.load())}_e.call(e,e.media,"qualitychange",!1,{quality:t})}}})}},cancelRequests:function(){this.isHTML5&&(fe(Be.getSources.call(this)),this.media.setAttribute("src",this.config.blankVideo),this.media.load(),this.debug.log("Cancelled network requests"))}};function Ue(e){return J(e)?e.filter((function(t,n){return e.indexOf(t)===n})):e}function We(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];return re(e)?e:e.toString().replace(/{(\d+)}/g,(function(e,t){return n[t].toString()}))}var ze=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";return e.replace(new RegExp(t.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g,"\\$1"),"g"),n.toString())},Ke=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return e.toString().replace(/\w\S*/g,(function(e){return e.charAt(0).toUpperCase()+e.substr(1).toLowerCase()}))};function Ye(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=e.toString();return t=ze(t,"-"," "),t=ze(t,"_"," "),t=Ke(t),ze(t," ","")}function Qe(e){var t=document.createElement("div");return t.appendChild(e),t.innerHTML}var Xe={pip:"PIP",airplay:"AirPlay",html5:"HTML5",vimeo:"Vimeo",youtube:"YouTube"},$e=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(re(e)||re(t))return"";var n=ce(t.i18n,e);if(re(n))return Object.keys(Xe).includes(e)?Xe[e]:"";var i={"{seektime}":t.seekTime,"{title}":t.title};return Object.entries(i).forEach((function(e){var t=l(e,2),i=t[0],a=t[1];n=ze(n,i,a)})),n},Je=function(){function e(n){var i=this;t(this,e),a(this,"get",(function(t){if(!e.supported||!i.enabled)return null;var n=window.localStorage.getItem(i.key);if(re(n))return null;var a=JSON.parse(n);return Q(t)&&t.length?a[t]:a})),a(this,"set",(function(t){if(e.supported&&i.enabled&&K(t)){var n=i.get();re(n)&&(n={}),ue(n,t),window.localStorage.setItem(i.key,JSON.stringify(n))}})),this.enabled=n.config.storage.enabled,this.key=n.config.storage.key}return i(e,null,[{key:"supported",get:function(){try{if(!("localStorage"in window))return!1;var e="___test";return window.localStorage.setItem(e,e),window.localStorage.removeItem(e),!0}catch(e){return!1}}}]),e}();function Ge(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"text";return new Promise((function(n,i){try{var a=new XMLHttpRequest;if(!("withCredentials"in a))return;a.addEventListener("load",(function(){if("text"===t)try{n(JSON.parse(a.responseText))}catch(e){n(a.responseText)}else n(a.response)})),a.addEventListener("error",(function(){throw new Error(a.status)})),a.open("GET",e,!0),a.responseType=t,a.send()}catch(e){i(e)}}))}function Ze(e,t){if(Q(e)){var n="cache",i=Q(t),a=function(){return null!==document.getElementById(t)},r=function(e,t){e.innerHTML=t,i&&a()||document.body.insertAdjacentElement("afterbegin",e)};if(!i||!a()){var o=Je.supported,s=document.createElement("div");if(s.setAttribute("hidden",""),i&&s.setAttribute("id",t),o){var l=window.localStorage.getItem("".concat(n,"-").concat(t));if(null!==l){var c=JSON.parse(l);r(s,c.content)}}Ge(e).then((function(e){re(e)||(o&&window.localStorage.setItem("".concat(n,"-").concat(t),JSON.stringify({content:e})),r(s,e))})).catch((function(){}))}}}var et=function(e){return Math.trunc(e/60/60%60,10)},tt=function(e){return Math.trunc(e/60%60,10)},nt=function(e){return Math.trunc(e%60,10)};function it(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!Y(e))return it(void 0,t,n);var i=function(e){return"0".concat(e).slice(-2)},a=et(e),r=tt(e),o=nt(e);return a=t||a>0?"".concat(a,":"):"","".concat(n&&e>0?"-":"").concat(a).concat(i(r),":").concat(i(o))}var at={getIconUrl:function(){var e=new URL(this.config.iconUrl,window.location).host!==window.location.host||le.isIE&&!window.svg4everybody;return{url:this.config.iconUrl,cors:e}},findElements:function(){try{return this.elements.controls=Ae.call(this,this.config.selectors.controls.wrapper),this.elements.buttons={play:Ce.call(this,this.config.selectors.buttons.play),pause:Ae.call(this,this.config.selectors.buttons.pause),restart:Ae.call(this,this.config.selectors.buttons.restart),rewind:Ae.call(this,this.config.selectors.buttons.rewind),fastForward:Ae.call(this,this.config.selectors.buttons.fastForward),mute:Ae.call(this,this.config.selectors.buttons.mute),pip:Ae.call(this,this.config.selectors.buttons.pip),airplay:Ae.call(this,this.config.selectors.buttons.airplay),settings:Ae.call(this,this.config.selectors.buttons.settings),captions:Ae.call(this,this.config.selectors.buttons.captions),fullscreen:Ae.call(this,this.config.selectors.buttons.fullscreen)},this.elements.progress=Ae.call(this,this.config.selectors.progress),this.elements.inputs={seek:Ae.call(this,this.config.selectors.inputs.seek),volume:Ae.call(this,this.config.selectors.inputs.volume)},this.elements.display={buffer:Ae.call(this,this.config.selectors.display.buffer),currentTime:Ae.call(this,this.config.selectors.display.currentTime),duration:Ae.call(this,this.config.selectors.display.duration)},Z(this.elements.progress)&&(this.elements.display.seekTooltip=this.elements.progress.querySelector(".".concat(this.config.classNames.tooltip))),!0}catch(e){return this.debug.warn("It looks like there is a problem with your custom controls HTML",e),this.toggleNativeControls(!0),!1}},createIcon:function(e,t){var n="http://www.w3.org/2000/svg",i=at.getIconUrl.call(this),a="".concat(i.cors?"":i.url,"#").concat(this.config.iconPrefix),r=document.createElementNS(n,"svg");he(r,ue(t,{"aria-hidden":"true",focusable:"false"}));var o=document.createElementNS(n,"use"),s="".concat(a,"-").concat(e);return"href"in o&&o.setAttributeNS("http://www.w3.org/1999/xlink","href",s),o.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",s),r.appendChild(o),r},createLabel:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=$e(e,this.config),i=o(o({},t),{},{class:[t.class,this.config.classNames.hidden].filter(Boolean).join(" ")});return me("span",i,n)},createBadge:function(e){if(re(e))return null;var t=me("span",{class:this.config.classNames.menu.value});return t.appendChild(me("span",{class:this.config.classNames.menu.badge},e)),t},createButton:function(e,t){var n=this,i=ue({},t),a=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").toString();return(e=Ye(e)).charAt(0).toLowerCase()+e.slice(1)}(e),r={element:"button",toggle:!1,label:null,icon:null,labelPressed:null,iconPressed:null};switch(["element","icon","label"].forEach((function(e){Object.keys(i).includes(e)&&(r[e]=i[e],delete i[e])})),"button"!==r.element||Object.keys(i).includes("type")||(i.type="button"),Object.keys(i).includes("class")?i.class.split(" ").some((function(e){return e===n.config.classNames.control}))||ue(i,{class:"".concat(i.class," ").concat(this.config.classNames.control)}):i.class=this.config.classNames.control,e){case"play":r.toggle=!0,r.label="play",r.labelPressed="pause",r.icon="play",r.iconPressed="pause";break;case"mute":r.toggle=!0,r.label="mute",r.labelPressed="unmute",r.icon="volume",r.iconPressed="muted";break;case"captions":r.toggle=!0,r.label="enableCaptions",r.labelPressed="disableCaptions",r.icon="captions-off",r.iconPressed="captions-on";break;case"fullscreen":r.toggle=!0,r.label="enterFullscreen",r.labelPressed="exitFullscreen",r.icon="enter-fullscreen",r.iconPressed="exit-fullscreen";break;case"play-large":i.class+=" ".concat(this.config.classNames.control,"--overlaid"),a="play",r.label="play",r.icon="play";break;default:re(r.label)&&(r.label=a),re(r.icon)&&(r.icon=e)}var o=me(r.element);return r.toggle?(o.appendChild(at.createIcon.call(this,r.iconPressed,{class:"icon--pressed"})),o.appendChild(at.createIcon.call(this,r.icon,{class:"icon--not-pressed"})),o.appendChild(at.createLabel.call(this,r.labelPressed,{class:"label--pressed"})),o.appendChild(at.createLabel.call(this,r.label,{class:"label--not-pressed"}))):(o.appendChild(at.createIcon.call(this,r.icon)),o.appendChild(at.createLabel.call(this,r.label))),ue(i,be(this.config.selectors.buttons[a],i)),he(o,i),"play"===a?(J(this.elements.buttons[a])||(this.elements.buttons[a]=[]),this.elements.buttons[a].push(o)):this.elements.buttons[a]=o,o},createRange:function(e,t){var n=me("input",ue(be(this.config.selectors.inputs[e]),{type:"range",min:0,max:100,step:.01,value:0,autocomplete:"off",role:"slider","aria-label":$e(e,this.config),"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":0},t));return this.elements.inputs[e]=n,at.updateRangeFill.call(this,n),j.setup(n),n},createProgress:function(e,t){var n=me("progress",ue(be(this.config.selectors.display[e]),{min:0,max:100,value:0,role:"progressbar","aria-hidden":!0},t));if("volume"!==e){n.appendChild(me("span",null,"0"));var i={played:"played",buffer:"buffered"}[e],a=i?$e(i,this.config):"";n.innerText="% ".concat(a.toLowerCase())}return this.elements.display[e]=n,n},createTime:function(e,t){var n=be(this.config.selectors.display[e],t),i=me("div",ue(n,{class:"".concat(n.class?n.class:""," ").concat(this.config.classNames.display.time," ").trim(),"aria-label":$e(e,this.config)}),"00:00");return this.elements.display[e]=i,i},bindMenuItemShortcuts:function(e,t){var n=this;Ie.call(this,e,"keydown keyup",(function(i){if([32,38,39,40].includes(i.which)&&(i.preventDefault(),i.stopPropagation(),"keydown"!==i.type)){var a,r=Te(e,'[role="menuitemradio"]');if(!r&&[32,39].includes(i.which))at.showMenuPanel.call(n,t,!0);else 32!==i.which&&(40===i.which||r&&39===i.which?(a=e.nextElementSibling,Z(a)||(a=e.parentNode.firstElementChild)):(a=e.previousElementSibling,Z(a)||(a=e.parentNode.lastElementChild)),Se.call(n,a,!0))}}),!1),Ie.call(this,e,"keyup",(function(e){13===e.which&&at.focusFirstMenuItem.call(n,null,!0)}))},createMenuItem:function(e){var t=this,n=e.value,i=e.list,a=e.type,r=e.title,o=e.badge,s=void 0===o?null:o,l=e.checked,c=void 0!==l&&l,u=be(this.config.selectors.inputs[a]),d=me("button",ue(u,{type:"button",role:"menuitemradio",class:"".concat(this.config.classNames.control," ").concat(u.class?u.class:"").trim(),"aria-checked":c,value:n})),h=me("span");h.innerHTML=r,Z(s)&&h.appendChild(s),d.appendChild(h),Object.defineProperty(d,"checked",{enumerable:!0,get:function(){return"true"===d.getAttribute("aria-checked")},set:function(e){e&&Array.from(d.parentNode.children).filter((function(e){return Te(e,'[role="menuitemradio"]')})).forEach((function(e){return e.setAttribute("aria-checked","false")})),d.setAttribute("aria-checked",e?"true":"false")}}),this.listeners.bind(d,"click keyup",(function(e){if(!te(e)||32===e.which){switch(e.preventDefault(),e.stopPropagation(),d.checked=!0,a){case"language":t.currentTrack=Number(n);break;case"quality":t.quality=n;break;case"speed":t.speed=parseFloat(n)}at.showMenuPanel.call(t,"home",te(e))}}),a,!1),at.bindMenuItemShortcuts.call(this,d,a),i.appendChild(d)},formatTime:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(!Y(e))return e;var n=et(this.duration)>0;return it(e,n,t)},updateTimeDisplay:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];Z(e)&&Y(t)&&(e.innerText=at.formatTime(t,n))},updateVolume:function(){this.supported.ui&&(Z(this.elements.inputs.volume)&&at.setRange.call(this,this.elements.inputs.volume,this.muted?0:this.volume),Z(this.elements.buttons.mute)&&(this.elements.buttons.mute.pressed=this.muted||0===this.volume))},setRange:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;Z(e)&&(e.value=t,at.updateRangeFill.call(this,e))},updateProgress:function(e){var t=this;if(this.supported.ui&&ee(e)){var n,i,a=0;if(e)switch(e.type){case"timeupdate":case"seeking":case"seeked":n=this.currentTime,i=this.duration,a=0===n||0===i||Number.isNaN(n)||Number.isNaN(i)?0:(n/i*100).toFixed(2),"timeupdate"===e.type&&at.setRange.call(this,this.elements.inputs.seek,a);break;case"playing":case"progress":!function(e,n){var i=Y(n)?n:0,a=Z(e)?e:t.elements.display.buffer;if(Z(a)){a.value=i;var r=a.getElementsByTagName("span")[0];Z(r)&&(r.childNodes[0].nodeValue=i)}}(this.elements.display.buffer,100*this.buffered)}}},updateRangeFill:function(e){var t=ee(e)?e.target:e;if(Z(t)&&"range"===t.getAttribute("type")){if(Te(t,this.config.selectors.inputs.seek)){t.setAttribute("aria-valuenow",this.currentTime);var n=at.formatTime(this.currentTime),i=at.formatTime(this.duration),a=$e("seekLabel",this.config);t.setAttribute("aria-valuetext",a.replace("{currentTime}",n).replace("{duration}",i))}else if(Te(t,this.config.selectors.inputs.volume)){var r=100*t.value;t.setAttribute("aria-valuenow",r),t.setAttribute("aria-valuetext","".concat(r.toFixed(1),"%"))}else t.setAttribute("aria-valuenow",t.value);le.isWebkit&&t.style.setProperty("--value","".concat(t.value/t.max*100,"%"))}},updateSeekTooltip:function(e){var t=this;if(this.config.tooltips.seek&&Z(this.elements.inputs.seek)&&Z(this.elements.display.seekTooltip)&&0!==this.duration){var n="".concat(this.config.classNames.tooltip,"--visible"),i=function(e){return we(t.elements.display.seekTooltip,n,e)};if(this.touch)i(!1);else{var a=0,r=this.elements.progress.getBoundingClientRect();if(ee(e))a=100/r.width*(e.pageX-r.left);else{if(!ke(this.elements.display.seekTooltip,n))return;a=parseFloat(this.elements.display.seekTooltip.style.left,10)}a<0?a=0:a>100&&(a=100),at.updateTimeDisplay.call(this,this.elements.display.seekTooltip,this.duration/100*a),this.elements.display.seekTooltip.style.left="".concat(a,"%"),ee(e)&&["mouseenter","mouseleave"].includes(e.type)&&i("mouseenter"===e.type)}}},timeUpdate:function(e){var t=!Z(this.elements.display.duration)&&this.config.invertTime;at.updateTimeDisplay.call(this,this.elements.display.currentTime,t?this.duration-this.currentTime:this.currentTime,t),e&&"timeupdate"===e.type&&this.media.seeking||at.updateProgress.call(this,e)},durationUpdate:function(){if(this.supported.ui&&(this.config.invertTime||!this.currentTime)){if(this.duration>=Math.pow(2,32))return ve(this.elements.display.currentTime,!0),void ve(this.elements.progress,!0);Z(this.elements.inputs.seek)&&this.elements.inputs.seek.setAttribute("aria-valuemax",this.duration);var e=Z(this.elements.display.duration);!e&&this.config.displayDuration&&this.paused&&at.updateTimeDisplay.call(this,this.elements.display.currentTime,this.duration),e&&at.updateTimeDisplay.call(this,this.elements.display.duration,this.duration),at.updateSeekTooltip.call(this)}},toggleMenuButton:function(e,t){ve(this.elements.settings.buttons[e],!t)},updateSetting:function(e,t,n){var i=this.elements.settings.panels[e],a=null,r=t;if("captions"===e)a=this.currentTrack;else{if(a=re(n)?this[e]:n,re(a)&&(a=this.config[e].default),!re(this.options[e])&&!this.options[e].includes(a))return void this.debug.warn("Unsupported value of '".concat(a,"' for ").concat(e));if(!this.config[e].options.includes(a))return void this.debug.warn("Disabled value of '".concat(a,"' for ").concat(e))}if(Z(r)||(r=i&&i.querySelector('[role="menu"]')),Z(r)){this.elements.settings.buttons[e].querySelector(".".concat(this.config.classNames.menu.value)).innerHTML=at.getLabel.call(this,e,a);var o=r&&r.querySelector('[value="'.concat(a,'"]'));Z(o)&&(o.checked=!0)}},getLabel:function(e,t){switch(e){case"speed":return 1===t?$e("normal",this.config):"".concat(t,"&times;");case"quality":if(Y(t)){var n=$e("qualityLabel.".concat(t),this.config);return n.length?n:"".concat(t,"p")}return Ke(t);case"captions":return st.getLabel.call(this);default:return null}},setQualityMenu:function(e){var t=this;if(Z(this.elements.settings.panels.quality)){var n="quality",i=this.elements.settings.panels.quality.querySelector('[role="menu"]');J(e)&&(this.options.quality=Ue(e).filter((function(e){return t.config.quality.options.includes(e)})));var a=!re(this.options.quality)&&this.options.quality.length>1;if(at.toggleMenuButton.call(this,n,a),ge(i),at.checkMenu.call(this),a){var r=function(e){var n=$e("qualityBadge.".concat(e),t.config);return n.length?at.createBadge.call(t,n):null};this.options.quality.sort((function(e,n){var i=t.config.quality.options;return i.indexOf(e)>i.indexOf(n)?1:-1})).forEach((function(e){at.createMenuItem.call(t,{value:e,list:i,type:n,title:at.getLabel.call(t,"quality",e),badge:r(e)})})),at.updateSetting.call(this,n,i)}}},setCaptionsMenu:function(){var e=this;if(Z(this.elements.settings.panels.captions)){var t="captions",n=this.elements.settings.panels.captions.querySelector('[role="menu"]'),i=st.getTracks.call(this),a=Boolean(i.length);if(at.toggleMenuButton.call(this,t,a),ge(n),at.checkMenu.call(this),a){var r=i.map((function(t,i){return{value:i,checked:e.captions.toggled&&e.currentTrack===i,title:st.getLabel.call(e,t),badge:t.language&&at.createBadge.call(e,t.language.toUpperCase()),list:n,type:"language"}}));r.unshift({value:-1,checked:!this.captions.toggled,title:$e("disabled",this.config),list:n,type:"language"}),r.forEach(at.createMenuItem.bind(this)),at.updateSetting.call(this,t,n)}}},setSpeedMenu:function(){var e=this;if(Z(this.elements.settings.panels.speed)){var t="speed",n=this.elements.settings.panels.speed.querySelector('[role="menu"]');this.options.speed=this.options.speed.filter((function(t){return t>=e.minimumSpeed&&t<=e.maximumSpeed}));var i=!re(this.options.speed)&&this.options.speed.length>1;at.toggleMenuButton.call(this,t,i),ge(n),at.checkMenu.call(this),i&&(this.options.speed.forEach((function(i){at.createMenuItem.call(e,{value:i,list:n,type:t,title:at.getLabel.call(e,"speed",i)})})),at.updateSetting.call(this,t,n))}},checkMenu:function(){var e=this.elements.settings.buttons,t=!re(e)&&Object.values(e).some((function(e){return!e.hidden}));ve(this.elements.settings.menu,!t)},focusFirstMenuItem:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(!this.elements.settings.popup.hidden){var n=e;Z(n)||(n=Object.values(this.elements.settings.panels).find((function(e){return!e.hidden})));var i=n.querySelector('[role^="menuitem"]');Se.call(this,i,t)}},toggleMenu:function(e){var t=this.elements.settings.popup,n=this.elements.buttons.settings;if(Z(t)&&Z(n)){var i=t.hidden,a=i;if(X(e))a=e;else if(te(e)&&27===e.which)a=!1;else if(ee(e)){var r=$(e.composedPath)?e.composedPath()[0]:e.target,o=t.contains(r);if(o||!o&&e.target!==n&&a)return}n.setAttribute("aria-expanded",a),ve(t,!a),we(this.elements.container,this.config.classNames.menu.open,a),a&&te(e)?at.focusFirstMenuItem.call(this,null,!0):a||i||Se.call(this,n,te(e))}},getMenuSize:function(e){var t=e.cloneNode(!0);t.style.position="absolute",t.style.opacity=0,t.removeAttribute("hidden"),e.parentNode.appendChild(t);var n=t.scrollWidth,i=t.scrollHeight;return fe(t),{width:n,height:i}},showMenuPanel:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=this.elements.container.querySelector("#plyr-settings-".concat(this.id,"-").concat(t));if(Z(i)){var a=i.parentNode,r=Array.from(a.children).find((function(e){return!e.hidden}));if(Ne.transitions&&!Ne.reducedMotion){a.style.width="".concat(r.scrollWidth,"px"),a.style.height="".concat(r.scrollHeight,"px");var o=at.getMenuSize.call(this,i),s=function t(n){n.target===a&&["width","height"].includes(n.propertyName)&&(a.style.width="",a.style.height="",Le.call(e,a,oe,t))};Ie.call(this,a,oe,s),a.style.width="".concat(o.width,"px"),a.style.height="".concat(o.height,"px")}ve(r,!0),ve(i,!1),at.focusFirstMenuItem.call(this,i,n)}},setDownloadUrl:function(){var e=this.elements.buttons.download;Z(e)&&e.setAttribute("href",this.download)},create:function(e){var t=this,n=at.bindMenuItemShortcuts,i=at.createButton,a=at.createProgress,r=at.createRange,o=at.createTime,s=at.setQualityMenu,l=at.setSpeedMenu,c=at.showMenuPanel;this.elements.controls=null,J(this.config.controls)&&this.config.controls.includes("play-large")&&this.elements.container.appendChild(i.call(this,"play-large"));var u=me("div",be(this.config.selectors.controls.wrapper));this.elements.controls=u;var d={class:"plyr__controls__item"};return Ue(J(this.config.controls)?this.config.controls:[]).forEach((function(s){if("restart"===s&&u.appendChild(i.call(t,"restart",d)),"rewind"===s&&u.appendChild(i.call(t,"rewind",d)),"play"===s&&u.appendChild(i.call(t,"play",d)),"fast-forward"===s&&u.appendChild(i.call(t,"fast-forward",d)),"progress"===s){var l=me("div",{class:"".concat(d.class," plyr__progress__container")}),h=me("div",be(t.config.selectors.progress));if(h.appendChild(r.call(t,"seek",{id:"plyr-seek-".concat(e.id)})),h.appendChild(a.call(t,"buffer")),t.config.tooltips.seek){var m=me("span",{class:t.config.classNames.tooltip},"00:00");h.appendChild(m),t.elements.display.seekTooltip=m}t.elements.progress=h,l.appendChild(t.elements.progress),u.appendChild(l)}if("current-time"===s&&u.appendChild(o.call(t,"currentTime",d)),"duration"===s&&u.appendChild(o.call(t,"duration",d)),"mute"===s||"volume"===s){var p=t.elements.volume;if(Z(p)&&u.contains(p)||(p=me("div",ue({},d,{class:"".concat(d.class," plyr__volume").trim()})),t.elements.volume=p,u.appendChild(p)),"mute"===s&&p.appendChild(i.call(t,"mute")),"volume"===s&&!le.isIos){var f={max:1,step:.05,value:t.config.volume};p.appendChild(r.call(t,"volume",ue(f,{id:"plyr-volume-".concat(e.id)})))}}if("captions"===s&&u.appendChild(i.call(t,"captions",d)),"settings"===s&&!re(t.config.settings)){var g=me("div",ue({},d,{class:"".concat(d.class," plyr__menu").trim(),hidden:""}));g.appendChild(i.call(t,"settings",{"aria-haspopup":!0,"aria-controls":"plyr-settings-".concat(e.id),"aria-expanded":!1}));var y=me("div",{class:"plyr__menu__container",id:"plyr-settings-".concat(e.id),hidden:""}),b=me("div"),v=me("div",{id:"plyr-settings-".concat(e.id,"-home")}),w=me("div",{role:"menu"});v.appendChild(w),b.appendChild(v),t.elements.settings.panels.home=v,t.config.settings.forEach((function(i){var a=me("button",ue(be(t.config.selectors.buttons.settings),{type:"button",class:"".concat(t.config.classNames.control," ").concat(t.config.classNames.control,"--forward"),role:"menuitem","aria-haspopup":!0,hidden:""}));n.call(t,a,i),Ie.call(t,a,"click",(function(){c.call(t,i,!1)}));var r=me("span",null,$e(i,t.config)),o=me("span",{class:t.config.classNames.menu.value});o.innerHTML=e[i],r.appendChild(o),a.appendChild(r),w.appendChild(a);var s=me("div",{id:"plyr-settings-".concat(e.id,"-").concat(i),hidden:""}),l=me("button",{type:"button",class:"".concat(t.config.classNames.control," ").concat(t.config.classNames.control,"--back")});l.appendChild(me("span",{"aria-hidden":!0},$e(i,t.config))),l.appendChild(me("span",{class:t.config.classNames.hidden},$e("menuBack",t.config))),Ie.call(t,s,"keydown",(function(e){37===e.which&&(e.preventDefault(),e.stopPropagation(),c.call(t,"home",!0))}),!1),Ie.call(t,l,"click",(function(){c.call(t,"home",!1)})),s.appendChild(l),s.appendChild(me("div",{role:"menu"})),b.appendChild(s),t.elements.settings.buttons[i]=a,t.elements.settings.panels[i]=s})),y.appendChild(b),g.appendChild(y),u.appendChild(g),t.elements.settings.popup=y,t.elements.settings.menu=g}if("pip"===s&&Ne.pip&&u.appendChild(i.call(t,"pip",d)),"airplay"===s&&Ne.airplay&&u.appendChild(i.call(t,"airplay",d)),"download"===s){var k=ue({},d,{element:"a",href:t.download,target:"_blank"});t.isHTML5&&(k.download="");var T=t.config.urls.download;!ae(T)&&t.isEmbed&&ue(k,{icon:"logo-".concat(t.provider),label:t.provider}),u.appendChild(i.call(t,"download",k))}"fullscreen"===s&&u.appendChild(i.call(t,"fullscreen",d))})),this.isHTML5&&s.call(this,Be.getQualityOptions.call(this)),l.call(this),u},inject:function(){var e=this;if(this.config.loadSprite){var t=at.getIconUrl.call(this);t.cors&&Ze(t.url,"sprite-plyr")}this.id=Math.floor(1e4*Math.random());var n=null;this.elements.controls=null;var i={id:this.id,seektime:this.config.seekTime,title:this.config.title},a=!0;$(this.config.controls)&&(this.config.controls=this.config.controls.call(this,i)),this.config.controls||(this.config.controls=[]),Z(this.config.controls)||Q(this.config.controls)?n=this.config.controls:(n=at.create.call(this,{id:this.id,seektime:this.config.seekTime,speed:this.speed,quality:this.quality,captions:st.getLabel.call(this)}),a=!1);var r,o;if(a&&Q(this.config.controls)&&(r=n,Object.entries(i).forEach((function(e){var t=l(e,2),n=t[0],i=t[1];r=ze(r,"{".concat(n,"}"),i)})),n=r),Q(this.config.selectors.controls.container)&&(o=document.querySelector(this.config.selectors.controls.container)),Z(o)||(o=this.elements.container),o[Z(n)?"insertAdjacentElement":"insertAdjacentHTML"]("afterbegin",n),Z(this.elements.controls)||at.findElements.call(this),!re(this.elements.buttons)){var s=function(t){var n=e.config.classNames.controlPressed;Object.defineProperty(t,"pressed",{enumerable:!0,get:function(){return ke(t,n)},set:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];we(t,n,e)}})};Object.values(this.elements.buttons).filter(Boolean).forEach((function(e){J(e)||G(e)?Array.from(e).filter(Boolean).forEach(s):s(e)}))}if(le.isEdge&&se(o),this.config.tooltips.controls){var c=this.config,u=c.classNames,d=c.selectors,h="".concat(d.controls.wrapper," ").concat(d.labels," .").concat(u.hidden),m=Ce.call(this,h);Array.from(m).forEach((function(t){we(t,e.config.classNames.hidden,!1),we(t,e.config.classNames.tooltip,!0)}))}}};function rt(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=e;if(t){var i=document.createElement("a");i.href=n,n=i.href}try{return new URL(n)}catch(e){return null}}function ot(e){var t=new URLSearchParams;return K(e)&&Object.entries(e).forEach((function(e){var n=l(e,2),i=n[0],a=n[1];t.set(i,a)})),t}var st={setup:function(){if(this.supported.ui)if(!this.isVideo||this.isYouTube||this.isHTML5&&!Ne.textTracks)J(this.config.controls)&&this.config.controls.includes("settings")&&this.config.settings.includes("captions")&&at.setCaptionsMenu.call(this);else{if(Z(this.elements.captions)||(this.elements.captions=me("div",be(this.config.selectors.captions)),function(e,t){Z(e)&&Z(t)&&t.parentNode.insertBefore(e,t.nextSibling)}(this.elements.captions,this.elements.wrapper)),le.isIE&&window.URL){var e=this.media.querySelectorAll("track");Array.from(e).forEach((function(e){var t=e.getAttribute("src"),n=rt(t);null!==n&&n.hostname!==window.location.href.hostname&&["http:","https:"].includes(n.protocol)&&Ge(t,"blob").then((function(t){e.setAttribute("src",window.URL.createObjectURL(t))})).catch((function(){fe(e)}))}))}var t=Ue((navigator.languages||[navigator.language||navigator.userLanguage||"en"]).map((function(e){return e.split("-")[0]}))),n=(this.storage.get("language")||this.config.captions.language||"auto").toLowerCase();if("auto"===n)n=l(t,1)[0];var i=this.storage.get("captions");if(X(i)||(i=this.config.captions.active),Object.assign(this.captions,{toggled:!1,active:i,language:n,languages:t}),this.isHTML5){var a=this.config.captions.update?"addtrack removetrack":"removetrack";Ie.call(this,this.media.textTracks,a,st.update.bind(this))}setTimeout(st.update.bind(this),0)}},update:function(){var e=this,t=st.getTracks.call(this,!0),n=this.captions,i=n.active,a=n.language,r=n.meta,o=n.currentTrackNode,s=Boolean(t.find((function(e){return e.language===a})));this.isHTML5&&this.isVideo&&t.filter((function(e){return!r.get(e)})).forEach((function(t){e.debug.log("Track added",t),r.set(t,{default:"showing"===t.mode}),"showing"===t.mode&&(t.mode="hidden"),Ie.call(e,t,"cuechange",(function(){return st.updateCues.call(e)}))})),(s&&this.language!==a||!t.includes(o))&&(st.setLanguage.call(this,a),st.toggle.call(this,i&&s)),we(this.elements.container,this.config.classNames.captions.enabled,!re(t)),J(this.config.controls)&&this.config.controls.includes("settings")&&this.config.settings.includes("captions")&&at.setCaptionsMenu.call(this)},toggle:function(e){var t=this,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(this.supported.ui){var i=this.captions.toggled,a=this.config.classNames.captions.active,r=z(e)?!i:e;if(r!==i){if(n||(this.captions.active=r,this.storage.set({captions:r})),!this.language&&r&&!n){var o=st.getTracks.call(this),s=st.findTrack.call(this,[this.captions.language].concat(c(this.captions.languages)),!0);return this.captions.language=s.language,void st.set.call(this,o.indexOf(s))}this.elements.buttons.captions&&(this.elements.buttons.captions.pressed=r),we(this.elements.container,a,r),this.captions.toggled=r,at.updateSetting.call(this,"captions"),_e.call(this,this.media,r?"captionsenabled":"captionsdisabled")}setTimeout((function(){r&&t.captions.toggled&&(t.captions.currentTrackNode.mode="hidden")}))}},set:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=st.getTracks.call(this);if(-1!==e)if(Y(e))if(e in n){if(this.captions.currentTrack!==e){this.captions.currentTrack=e;var i=n[e],a=i||{},r=a.language;this.captions.currentTrackNode=i,at.updateSetting.call(this,"captions"),t||(this.captions.language=r,this.storage.set({language:r})),this.isVimeo&&this.embed.enableTextTrack(r),_e.call(this,this.media,"languagechange")}st.toggle.call(this,!0,t),this.isHTML5&&this.isVideo&&st.updateCues.call(this)}else this.debug.warn("Track not found",e);else this.debug.warn("Invalid caption argument",e);else st.toggle.call(this,!1,t)},setLanguage:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(Q(e)){var n=e.toLowerCase();this.captions.language=n;var i=st.getTracks.call(this),a=st.findTrack.call(this,[n]);st.set.call(this,i.indexOf(a),t)}else this.debug.warn("Invalid language argument",e)},getTracks:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=Array.from((this.media||{}).textTracks||[]);return n.filter((function(n){return!e.isHTML5||t||e.captions.meta.has(n)})).filter((function(e){return["captions","subtitles"].includes(e.kind)}))},findTrack:function(e){var t,n=this,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=st.getTracks.call(this),r=function(e){return Number((n.captions.meta.get(e)||{}).default)},o=Array.from(a).sort((function(e,t){return r(t)-r(e)}));return e.every((function(e){return!(t=o.find((function(t){return t.language===e})))})),t||(i?o[0]:void 0)},getCurrentTrack:function(){return st.getTracks.call(this)[this.currentTrack]},getLabel:function(e){var t=e;return!ne(t)&&Ne.textTracks&&this.captions.toggled&&(t=st.getCurrentTrack.call(this)),ne(t)?re(t.label)?re(t.language)?$e("enabled",this.config):e.language.toUpperCase():t.label:$e("disabled",this.config)},updateCues:function(e){if(this.supported.ui)if(Z(this.elements.captions))if(z(e)||Array.isArray(e)){var t=e;if(!t){var n=st.getCurrentTrack.call(this);t=Array.from((n||{}).activeCues||[]).map((function(e){return e.getCueAsHTML()})).map(Qe)}var i=t.map((function(e){return e.trim()})).join("\n");if(i!==this.elements.captions.innerHTML){ge(this.elements.captions);var a=me("span",be(this.config.selectors.caption));a.innerHTML=i,this.elements.captions.appendChild(a),_e.call(this,this.media,"cuechange")}}else this.debug.warn("updateCues: Invalid input",e);else this.debug.warn("No captions element to render to")}},lt={enabled:!0,title:"",debug:!1,autoplay:!1,autopause:!0,playsinline:!0,seekTime:10,volume:1,muted:!1,duration:null,displayDuration:!0,invertTime:!0,toggleInvert:!0,ratio:null,clickToPlay:!0,hideControls:!0,resetOnEnd:!1,disableContextMenu:!0,loadSprite:!0,iconPrefix:"plyr",iconUrl:"https://cdn.plyr.io/3.6.4/plyr.svg",blankVideo:"https://cdn.plyr.io/static/blank.mp4",quality:{default:576,options:[4320,2880,2160,1440,1080,720,576,480,360,240],forced:!1,onChange:null},loop:{active:!1},speed:{selected:1,options:[.5,.75,1,1.25,1.5,1.75,2,4]},keyboard:{focused:!0,global:!1},tooltips:{controls:!1,seek:!0},captions:{active:!1,language:"auto",update:!1},fullscreen:{enabled:!0,fallback:!0,iosNative:!1},storage:{enabled:!0,key:"plyr"},controls:["play-large","play","progress","current-time","mute","volume","captions","settings","pip","airplay","fullscreen"],settings:["captions","quality","speed"],i18n:{restart:"Restart",rewind:"Rewind {seektime}s",play:"Play",pause:"Pause",fastForward:"Forward {seektime}s",seek:"Seek",seekLabel:"{currentTime} of {duration}",played:"Played",buffered:"Buffered",currentTime:"Current time",duration:"Duration",volume:"Volume",mute:"Mute",unmute:"Unmute",enableCaptions:"Enable captions",disableCaptions:"Disable captions",download:"Download",enterFullscreen:"Enter fullscreen",exitFullscreen:"Exit fullscreen",frameTitle:"Player for {title}",captions:"Captions",settings:"Settings",pip:"PIP",menuBack:"Go back to previous menu",speed:"Speed",normal:"Normal",quality:"Quality",loop:"Loop",start:"Start",end:"End",all:"All",reset:"Reset",disabled:"Disabled",enabled:"Enabled",advertisement:"Ad",qualityBadge:{2160:"4K",1440:"HD",1080:"HD",720:"HD",576:"SD",480:"SD"}},urls:{download:null,vimeo:{sdk:"https://player.vimeo.com/api/player.js",iframe:"https://player.vimeo.com/video/{0}?{1}",api:"https://vimeo.com/api/oembed.json?url={0}"},youtube:{sdk:"https://www.youtube.com/iframe_api",api:"https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}"},googleIMA:{sdk:"https://imasdk.googleapis.com/js/sdkloader/ima3.js"}},listeners:{seek:null,play:null,pause:null,restart:null,rewind:null,fastForward:null,mute:null,volume:null,captions:null,download:null,fullscreen:null,pip:null,airplay:null,speed:null,quality:null,loop:null,language:null},events:["ended","progress","stalled","playing","waiting","canplay","canplaythrough","loadstart","loadeddata","loadedmetadata","timeupdate","volumechange","play","pause","error","seeking","seeked","emptied","ratechange","cuechange","download","enterfullscreen","exitfullscreen","captionsenabled","captionsdisabled","languagechange","controlshidden","controlsshown","ready","statechange","qualitychange","adsloaded","adscontentpause","adscontentresume","adstarted","adsmidpoint","adscomplete","adsallcomplete","adsimpression","adsclick"],selectors:{editable:"input, textarea, select, [contenteditable]",container:".plyr",controls:{container:null,wrapper:".plyr__controls"},labels:"[data-plyr]",buttons:{play:'[data-plyr="play"]',pause:'[data-plyr="pause"]',restart:'[data-plyr="restart"]',rewind:'[data-plyr="rewind"]',fastForward:'[data-plyr="fast-forward"]',mute:'[data-plyr="mute"]',captions:'[data-plyr="captions"]',download:'[data-plyr="download"]',fullscreen:'[data-plyr="fullscreen"]',pip:'[data-plyr="pip"]',airplay:'[data-plyr="airplay"]',settings:'[data-plyr="settings"]',loop:'[data-plyr="loop"]'},inputs:{seek:'[data-plyr="seek"]',volume:'[data-plyr="volume"]',speed:'[data-plyr="speed"]',language:'[data-plyr="language"]',quality:'[data-plyr="quality"]'},display:{currentTime:".plyr__time--current",duration:".plyr__time--duration",buffer:".plyr__progress__buffer",loop:".plyr__progress__loop",volume:".plyr__volume--display"},progress:".plyr__progress",captions:".plyr__captions",caption:".plyr__caption"},classNames:{type:"plyr--{0}",provider:"plyr--{0}",video:"plyr__video-wrapper",embed:"plyr__video-embed",videoFixedRatio:"plyr__video-wrapper--fixed-ratio",embedContainer:"plyr__video-embed__container",poster:"plyr__poster",posterEnabled:"plyr__poster-enabled",ads:"plyr__ads",control:"plyr__control",controlPressed:"plyr__control--pressed",playing:"plyr--playing",paused:"plyr--paused",stopped:"plyr--stopped",loading:"plyr--loading",hover:"plyr--hover",tooltip:"plyr__tooltip",cues:"plyr__cues",hidden:"plyr__sr-only",hideControls:"plyr--hide-controls",isIos:"plyr--is-ios",isTouch:"plyr--is-touch",uiSupported:"plyr--full-ui",noTransition:"plyr--no-transition",display:{time:"plyr__time"},menu:{value:"plyr__menu__value",badge:"plyr__badge",open:"plyr--menu-open"},captions:{enabled:"plyr--captions-enabled",active:"plyr--captions-active"},fullscreen:{enabled:"plyr--fullscreen-enabled",fallback:"plyr--fullscreen-fallback"},pip:{supported:"plyr--pip-supported",active:"plyr--pip-active"},airplay:{supported:"plyr--airplay-supported",active:"plyr--airplay-active"},tabFocus:"plyr__tab-focus",previewThumbnails:{thumbContainer:"plyr__preview-thumb",thumbContainerShown:"plyr__preview-thumb--is-shown",imageContainer:"plyr__preview-thumb__image-container",timeContainer:"plyr__preview-thumb__time-container",scrubbingContainer:"plyr__preview-scrubbing",scrubbingContainerShown:"plyr__preview-scrubbing--is-shown"}},attributes:{embed:{provider:"data-plyr-provider",id:"data-plyr-embed-id"}},ads:{enabled:!1,publisherId:"",tagUrl:""},previewThumbnails:{enabled:!1,src:""},vimeo:{byline:!1,portrait:!1,title:!1,speed:!0,transparent:!1,customControls:!0,referrerPolicy:null,premium:!1},youtube:{rel:0,showinfo:0,iv_load_policy:3,modestbranding:1,customControls:!0,noCookie:!1}},ct="picture-in-picture",ut="inline",dt={html5:"html5",youtube:"youtube",vimeo:"vimeo"},ht="audio",mt="video";var pt=function(){},ft=function(){function e(){var n=arguments.length>0&&void 0!==arguments[0]&&arguments[0];t(this,e),this.enabled=window.console&&n,this.enabled&&this.log("Debugging enabled")}return i(e,[{key:"log",get:function(){return this.enabled?Function.prototype.bind.call(console.log,console):pt}},{key:"warn",get:function(){return this.enabled?Function.prototype.bind.call(console.warn,console):pt}},{key:"error",get:function(){return this.enabled?Function.prototype.bind.call(console.error,console):pt}}]),e}(),gt=function(){function e(n){var i=this;t(this,e),a(this,"onChange",(function(){if(i.enabled){var e=i.player.elements.buttons.fullscreen;Z(e)&&(e.pressed=i.active);var t=i.target===i.player.media?i.target:i.player.elements.container;_e.call(i.player,t,i.active?"enterfullscreen":"exitfullscreen",!0)}})),a(this,"toggleFallback",(function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e?i.scrollPosition={x:window.scrollX||0,y:window.scrollY||0}:window.scrollTo(i.scrollPosition.x,i.scrollPosition.y),document.body.style.overflow=e?"hidden":"",we(i.target,i.player.config.classNames.fullscreen.fallback,e),le.isIos){var t=document.head.querySelector('meta[name="viewport"]'),n="viewport-fit=cover";t||(t=document.createElement("meta")).setAttribute("name","viewport");var a=Q(t.content)&&t.content.includes(n);e?(i.cleanupViewport=!a,a||(t.content+=",".concat(n))):i.cleanupViewport&&(t.content=t.content.split(",").filter((function(e){return e.trim()!==n})).join(","))}i.onChange()})),a(this,"trapFocus",(function(e){if(!le.isIos&&i.active&&"Tab"===e.key&&9===e.keyCode){var t=document.activeElement,n=Ce.call(i.player,"a[href], button:not(:disabled), input:not(:disabled), [tabindex]"),a=l(n,1)[0],r=n[n.length-1];t!==r||e.shiftKey?t===a&&e.shiftKey&&(r.focus(),e.preventDefault()):(a.focus(),e.preventDefault())}})),a(this,"update",(function(){var t;i.enabled?(t=i.forceFallback?"Fallback (forced)":e.native?"Native":"Fallback",i.player.debug.log("".concat(t," fullscreen enabled"))):i.player.debug.log("Fullscreen not supported and fallback disabled");we(i.player.elements.container,i.player.config.classNames.fullscreen.enabled,i.enabled)})),a(this,"enter",(function(){i.enabled&&(le.isIos&&i.player.config.fullscreen.iosNative?i.player.isVimeo?i.player.embed.requestFullscreen():i.target.webkitEnterFullscreen():!e.native||i.forceFallback?i.toggleFallback(!0):i.prefix?re(i.prefix)||i.target["".concat(i.prefix,"Request").concat(i.property)]():i.target.requestFullscreen({navigationUI:"hide"}))})),a(this,"exit",(function(){if(i.enabled)if(le.isIos&&i.player.config.fullscreen.iosNative)i.target.webkitExitFullscreen(),qe(i.player.play());else if(!e.native||i.forceFallback)i.toggleFallback(!1);else if(i.prefix){if(!re(i.prefix)){var t="moz"===i.prefix?"Cancel":"Exit";document["".concat(i.prefix).concat(t).concat(i.property)]()}}else(document.cancelFullScreen||document.exitFullscreen).call(document)})),a(this,"toggle",(function(){i.active?i.exit():i.enter()})),this.player=n,this.prefix=e.prefix,this.property=e.property,this.scrollPosition={x:0,y:0},this.forceFallback="force"===n.config.fullscreen.fallback,this.player.elements.fullscreen=n.config.fullscreen.container&&function(e,t){return(Element.prototype.closest||function(){var e=this;do{if(Te.matches(e,t))return e;e=e.parentElement||e.parentNode}while(null!==e&&1===e.nodeType);return null}).call(e,t)}(this.player.elements.container,n.config.fullscreen.container),Ie.call(this.player,document,"ms"===this.prefix?"MSFullscreenChange":"".concat(this.prefix,"fullscreenchange"),(function(){i.onChange()})),Ie.call(this.player,this.player.elements.container,"dblclick",(function(e){Z(i.player.elements.controls)&&i.player.elements.controls.contains(e.target)||i.player.listeners.proxy(e,i.toggle,"fullscreen")})),Ie.call(this,this.player.elements.container,"keydown",(function(e){return i.trapFocus(e)})),this.update()}return i(e,[{key:"usingNative",get:function(){return e.native&&!this.forceFallback}},{key:"enabled",get:function(){return(e.native||this.player.config.fullscreen.fallback)&&this.player.config.fullscreen.enabled&&this.player.supported.ui&&this.player.isVideo}},{key:"active",get:function(){if(!this.enabled)return!1;if(!e.native||this.forceFallback)return ke(this.target,this.player.config.classNames.fullscreen.fallback);var t=this.prefix?document["".concat(this.prefix).concat(this.property,"Element")]:document.fullscreenElement;return t&&t.shadowRoot?t===this.target.getRootNode().host:t===this.target}},{key:"target",get:function(){return le.isIos&&this.player.config.fullscreen.iosNative?this.player.media:this.player.elements.fullscreen||this.player.elements.container}}],[{key:"native",get:function(){return!!(document.fullscreenEnabled||document.webkitFullscreenEnabled||document.mozFullScreenEnabled||document.msFullscreenEnabled)}},{key:"prefix",get:function(){if($(document.exitFullscreen))return"";var e="";return["webkit","moz","ms"].some((function(t){return!(!$(document["".concat(t,"ExitFullscreen")])&&!$(document["".concat(t,"CancelFullScreen")]))&&(e=t,!0)})),e}},{key:"property",get:function(){return"moz"===this.prefix?"FullScreen":"Fullscreen"}}]),e}();function yt(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return new Promise((function(n,i){var a=new Image,r=function(){delete a.onload,delete a.onerror,(a.naturalWidth>=t?n:i)(a)};Object.assign(a,{onload:r,onerror:r,src:e})}))}var bt={addStyleHook:function(){we(this.elements.container,this.config.selectors.container.replace(".",""),!0),we(this.elements.container,this.config.classNames.uiSupported,this.supported.ui)},toggleNativeControls:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];e&&this.isHTML5?this.media.setAttribute("controls",""):this.media.removeAttribute("controls")},build:function(){var e=this;if(this.listeners.media(),!this.supported.ui)return this.debug.warn("Basic support only for ".concat(this.provider," ").concat(this.type)),void bt.toggleNativeControls.call(this,!0);Z(this.elements.controls)||(at.inject.call(this),this.listeners.controls()),bt.toggleNativeControls.call(this),this.isHTML5&&st.setup.call(this),this.volume=null,this.muted=null,this.loop=null,this.quality=null,this.speed=null,at.updateVolume.call(this),at.timeUpdate.call(this),bt.checkPlaying.call(this),we(this.elements.container,this.config.classNames.pip.supported,Ne.pip&&this.isHTML5&&this.isVideo),we(this.elements.container,this.config.classNames.airplay.supported,Ne.airplay&&this.isHTML5),we(this.elements.container,this.config.classNames.isIos,le.isIos),we(this.elements.container,this.config.classNames.isTouch,this.touch),this.ready=!0,setTimeout((function(){_e.call(e,e.media,"ready")}),0),bt.setTitle.call(this),this.poster&&bt.setPoster.call(this,this.poster,!1).catch((function(){})),this.config.duration&&at.durationUpdate.call(this)},setTitle:function(){var e=$e("play",this.config);if(Q(this.config.title)&&!re(this.config.title)&&(e+=", ".concat(this.config.title)),Array.from(this.elements.buttons.play||[]).forEach((function(t){t.setAttribute("aria-label",e)})),this.isEmbed){var t=Ae.call(this,"iframe");if(!Z(t))return;var n=re(this.config.title)?"video":this.config.title,i=$e("frameTitle",this.config);t.setAttribute("title",i.replace("{title}",n))}},togglePoster:function(e){we(this.elements.container,this.config.classNames.posterEnabled,e)},setPoster:function(e){var t=this,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return n&&this.poster?Promise.reject(new Error("Poster already set")):(this.media.setAttribute("data-poster",e),this.elements.poster.removeAttribute("hidden"),De.call(this).then((function(){return yt(e)})).catch((function(n){throw e===t.poster&&bt.togglePoster.call(t,!1),n})).then((function(){if(e!==t.poster)throw new Error("setPoster cancelled by later call to setPoster")})).then((function(){return Object.assign(t.elements.poster.style,{backgroundImage:"url('".concat(e,"')"),backgroundSize:""}),bt.togglePoster.call(t,!0),e})))},checkPlaying:function(e){var t=this;we(this.elements.container,this.config.classNames.playing,this.playing),we(this.elements.container,this.config.classNames.paused,this.paused),we(this.elements.container,this.config.classNames.stopped,this.stopped),Array.from(this.elements.buttons.play||[]).forEach((function(e){Object.assign(e,{pressed:t.playing}),e.setAttribute("aria-label",$e(t.playing?"pause":"play",t.config))})),ee(e)&&"timeupdate"===e.type||bt.toggleControls.call(this)},checkLoading:function(e){var t=this;this.loading=["stalled","waiting"].includes(e.type),clearTimeout(this.timers.loading),this.timers.loading=setTimeout((function(){we(t.elements.container,t.config.classNames.loading,t.loading),bt.toggleControls.call(t)}),this.loading?250:0)},toggleControls:function(e){var t=this.elements.controls;if(t&&this.config.hideControls){var n=this.touch&&this.lastSeekTime+2e3>Date.now();this.toggleControls(Boolean(e||this.loading||this.paused||t.pressed||t.hover||n))}},migrateStyles:function(){var e=this;Object.values(o({},this.media.style)).filter((function(e){return!re(e)&&Q(e)&&e.startsWith("--plyr")})).forEach((function(t){e.elements.container.style.setProperty(t,e.media.style.getPropertyValue(t)),e.media.style.removeProperty(t)})),re(this.media.style)&&this.media.removeAttribute("style")}},vt=function(){function e(n){var i=this;t(this,e),a(this,"firstTouch",(function(){var e=i.player,t=e.elements;e.touch=!0,we(t.container,e.config.classNames.isTouch,!0)})),a(this,"setTabFocus",(function(e){var t=i.player,n=t.elements;if(clearTimeout(i.focusTimer),"keydown"!==e.type||9===e.which){"keydown"===e.type&&(i.lastKeyDown=e.timeStamp);var a,r=e.timeStamp-i.lastKeyDown<=20;if("focus"!==e.type||r)a=t.config.classNames.tabFocus,we(Ce.call(t,".".concat(a)),a,!1),"focusout"!==e.type&&(i.focusTimer=setTimeout((function(){var e=document.activeElement;n.container.contains(e)&&we(document.activeElement,t.config.classNames.tabFocus,!0)}),10))}})),a(this,"global",(function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=i.player;t.config.keyboard.global&&xe.call(t,window,"keydown keyup",i.handleKey,e,!1),xe.call(t,document.body,"click",i.toggleMenu,e),Oe.call(t,document.body,"touchstart",i.firstTouch),xe.call(t,document.body,"keydown focus blur focusout",i.setTabFocus,e,!1,!0)})),a(this,"container",(function(){var e=i.player,t=e.config,n=e.elements,a=e.timers;!t.keyboard.global&&t.keyboard.focused&&Ie.call(e,n.container,"keydown keyup",i.handleKey,!1),Ie.call(e,n.container,"mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen",(function(t){var i=n.controls;i&&"enterfullscreen"===t.type&&(i.pressed=!1,i.hover=!1);var r=0;["touchstart","touchmove","mousemove"].includes(t.type)&&(bt.toggleControls.call(e,!0),r=e.touch?3e3:2e3),clearTimeout(a.controls),a.controls=setTimeout((function(){return bt.toggleControls.call(e,!1)}),r)}));var r=function(t){if(!t)return Ve.call(e);var i=n.container.getBoundingClientRect(),a=i.width,r=i.height;return Ve.call(e,"".concat(a,":").concat(r))},o=function(){clearTimeout(a.resized),a.resized=setTimeout(r,50)};Ie.call(e,n.container,"enterfullscreen exitfullscreen",(function(t){var i=e.fullscreen,a=i.target,s=i.usingNative;if(a===n.container&&(e.isEmbed||!re(e.config.ratio))){var c="enterfullscreen"===t.type,u=r(c);u.padding;!function(t,n,i){if(e.isVimeo&&!e.config.vimeo.premium){var a=e.elements.wrapper.firstChild,r=l(t,2)[1],o=l(Re.call(e),2),s=o[0],c=o[1];a.style.maxWidth=i?"".concat(r/c*s,"px"):null,a.style.margin=i?"0 auto":null}}(u.ratio,0,c),c&&setTimeout((function(){return se(n.container)}),100),s||(c?Ie.call(e,window,"resize",o):Le.call(e,window,"resize",o))}}))})),a(this,"media",(function(){var e=i.player,t=e.elements;if(Ie.call(e,e.media,"timeupdate seeking seeked",(function(t){return at.timeUpdate.call(e,t)})),Ie.call(e,e.media,"durationchange loadeddata loadedmetadata",(function(t){return at.durationUpdate.call(e,t)})),Ie.call(e,e.media,"ended",(function(){e.isHTML5&&e.isVideo&&e.config.resetOnEnd&&(e.restart(),e.pause())})),Ie.call(e,e.media,"progress playing seeking seeked",(function(t){return at.updateProgress.call(e,t)})),Ie.call(e,e.media,"volumechange",(function(t){return at.updateVolume.call(e,t)})),Ie.call(e,e.media,"playing play pause ended emptied timeupdate",(function(t){return bt.checkPlaying.call(e,t)})),Ie.call(e,e.media,"waiting canplay seeked playing",(function(t){return bt.checkLoading.call(e,t)})),e.supported.ui&&e.config.clickToPlay&&!e.isAudio){var n=Ae.call(e,".".concat(e.config.classNames.video));if(!Z(n))return;Ie.call(e,t.container,"click",(function(a){([t.container,n].includes(a.target)||n.contains(a.target))&&(e.touch&&e.config.hideControls||(e.ended?(i.proxy(a,e.restart,"restart"),i.proxy(a,(function(){qe(e.play())}),"play")):i.proxy(a,(function(){qe(e.togglePlay())}),"play")))}))}e.supported.ui&&e.config.disableContextMenu&&Ie.call(e,t.wrapper,"contextmenu",(function(e){e.preventDefault()}),!1),Ie.call(e,e.media,"volumechange",(function(){e.storage.set({volume:e.volume,muted:e.muted})})),Ie.call(e,e.media,"ratechange",(function(){at.updateSetting.call(e,"speed"),e.storage.set({speed:e.speed})})),Ie.call(e,e.media,"qualitychange",(function(t){at.updateSetting.call(e,"quality",null,t.detail.quality)})),Ie.call(e,e.media,"ready qualitychange",(function(){at.setDownloadUrl.call(e)}));var a=e.config.events.concat(["keyup","keydown"]).join(" ");Ie.call(e,e.media,a,(function(n){var i=n.detail,a=void 0===i?{}:i;"error"===n.type&&(a=e.media.error),_e.call(e,t.container,n.type,!0,a)}))})),a(this,"proxy",(function(e,t,n){var a=i.player,r=a.config.listeners[n],o=!0;$(r)&&(o=r.call(a,e)),!1!==o&&$(t)&&t.call(a,e)})),a(this,"bind",(function(e,t,n,a){var r=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],o=i.player,s=o.config.listeners[a],l=$(s);Ie.call(o,e,t,(function(e){return i.proxy(e,n,a)}),r&&!l)})),a(this,"controls",(function(){var e=i.player,t=e.elements,n=le.isIE?"change":"input";if(t.buttons.play&&Array.from(t.buttons.play).forEach((function(t){i.bind(t,"click",(function(){qe(e.togglePlay())}),"play")})),i.bind(t.buttons.restart,"click",e.restart,"restart"),i.bind(t.buttons.rewind,"click",(function(){e.lastSeekTime=Date.now(),e.rewind()}),"rewind"),i.bind(t.buttons.fastForward,"click",(function(){e.lastSeekTime=Date.now(),e.forward()}),"fastForward"),i.bind(t.buttons.mute,"click",(function(){e.muted=!e.muted}),"mute"),i.bind(t.buttons.captions,"click",(function(){return e.toggleCaptions()})),i.bind(t.buttons.download,"click",(function(){_e.call(e,e.media,"download")}),"download"),i.bind(t.buttons.fullscreen,"click",(function(){e.fullscreen.toggle()}),"fullscreen"),i.bind(t.buttons.pip,"click",(function(){e.pip="toggle"}),"pip"),i.bind(t.buttons.airplay,"click",e.airplay,"airplay"),i.bind(t.buttons.settings,"click",(function(t){t.stopPropagation(),t.preventDefault(),at.toggleMenu.call(e,t)}),null,!1),i.bind(t.buttons.settings,"keyup",(function(t){var n=t.which;[13,32].includes(n)&&(13!==n?(t.preventDefault(),t.stopPropagation(),at.toggleMenu.call(e,t)):at.focusFirstMenuItem.call(e,null,!0))}),null,!1),i.bind(t.settings.menu,"keydown",(function(t){27===t.which&&at.toggleMenu.call(e,t)})),i.bind(t.inputs.seek,"mousedown mousemove",(function(e){var n=t.progress.getBoundingClientRect(),i=100/n.width*(e.pageX-n.left);e.currentTarget.setAttribute("seek-value",i)})),i.bind(t.inputs.seek,"mousedown mouseup keydown keyup touchstart touchend",(function(t){var n=t.currentTarget,i=t.keyCode?t.keyCode:t.which,a="play-on-seeked";if(!te(t)||39===i||37===i){e.lastSeekTime=Date.now();var r=n.hasAttribute(a),o=["mouseup","touchend","keyup"].includes(t.type);r&&o?(n.removeAttribute(a),qe(e.play())):!o&&e.playing&&(n.setAttribute(a,""),e.pause())}})),le.isIos){var a=Ce.call(e,'input[type="range"]');Array.from(a).forEach((function(e){return i.bind(e,n,(function(e){return se(e.target)}))}))}i.bind(t.inputs.seek,n,(function(t){var n=t.currentTarget,i=n.getAttribute("seek-value");re(i)&&(i=n.value),n.removeAttribute("seek-value"),e.currentTime=i/n.max*e.duration}),"seek"),i.bind(t.progress,"mouseenter mouseleave mousemove",(function(t){return at.updateSeekTooltip.call(e,t)})),i.bind(t.progress,"mousemove touchmove",(function(t){var n=e.previewThumbnails;n&&n.loaded&&n.startMove(t)})),i.bind(t.progress,"mouseleave touchend click",(function(){var t=e.previewThumbnails;t&&t.loaded&&t.endMove(!1,!0)})),i.bind(t.progress,"mousedown touchstart",(function(t){var n=e.previewThumbnails;n&&n.loaded&&n.startScrubbing(t)})),i.bind(t.progress,"mouseup touchend",(function(t){var n=e.previewThumbnails;n&&n.loaded&&n.endScrubbing(t)})),le.isWebkit&&Array.from(Ce.call(e,'input[type="range"]')).forEach((function(t){i.bind(t,"input",(function(t){return at.updateRangeFill.call(e,t.target)}))})),e.config.toggleInvert&&!Z(t.display.duration)&&i.bind(t.display.currentTime,"click",(function(){0!==e.currentTime&&(e.config.invertTime=!e.config.invertTime,at.timeUpdate.call(e))})),i.bind(t.inputs.volume,n,(function(t){e.volume=t.target.value}),"volume"),i.bind(t.controls,"mouseenter mouseleave",(function(n){t.controls.hover=!e.touch&&"mouseenter"===n.type})),t.fullscreen&&Array.from(t.fullscreen.children).filter((function(e){return!e.contains(t.container)})).forEach((function(n){i.bind(n,"mouseenter mouseleave",(function(n){t.controls.hover=!e.touch&&"mouseenter"===n.type}))})),i.bind(t.controls,"mousedown mouseup touchstart touchend touchcancel",(function(e){t.controls.pressed=["mousedown","touchstart"].includes(e.type)})),i.bind(t.controls,"focusin",(function(){var n=e.config,a=e.timers;we(t.controls,n.classNames.noTransition,!0),bt.toggleControls.call(e,!0),setTimeout((function(){we(t.controls,n.classNames.noTransition,!1)}),0);var r=i.touch?3e3:4e3;clearTimeout(a.controls),a.controls=setTimeout((function(){return bt.toggleControls.call(e,!1)}),r)})),i.bind(t.inputs.volume,"wheel",(function(t){var n=t.webkitDirectionInvertedFromDevice,i=l([t.deltaX,-t.deltaY].map((function(e){return n?-e:e})),2),a=i[0],r=i[1],o=Math.sign(Math.abs(a)>Math.abs(r)?a:r);e.increaseVolume(o/50);var s=e.media.volume;(1===o&&s<1||-1===o&&s>0)&&t.preventDefault()}),"volume",!1)})),this.player=n,this.lastKey=null,this.focusTimer=null,this.lastKeyDown=null,this.handleKey=this.handleKey.bind(this),this.toggleMenu=this.toggleMenu.bind(this),this.setTabFocus=this.setTabFocus.bind(this),this.firstTouch=this.firstTouch.bind(this)}return i(e,[{key:"handleKey",value:function(e){var t=this.player,n=t.elements,i=e.keyCode?e.keyCode:e.which,a="keydown"===e.type,r=a&&i===this.lastKey;if(!(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)&&Y(i)){if(a){var o=document.activeElement;if(Z(o)){var s=t.config.selectors.editable;if(o!==n.inputs.seek&&Te(o,s))return;if(32===e.which&&Te(o,'button, [role^="menuitem"]'))return}switch([32,37,38,39,40,48,49,50,51,52,53,54,56,57,67,70,73,75,76,77,79].includes(i)&&(e.preventDefault(),e.stopPropagation()),i){case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:r||(t.currentTime=t.duration/10*(i-48));break;case 32:case 75:r||qe(t.togglePlay());break;case 38:t.increaseVolume(.1);break;case 40:t.decreaseVolume(.1);break;case 77:r||(t.muted=!t.muted);break;case 39:t.forward();break;case 37:t.rewind();break;case 70:t.fullscreen.toggle();break;case 67:r||t.toggleCaptions();break;case 76:t.loop=!t.loop}27===i&&!t.fullscreen.usingNative&&t.fullscreen.active&&t.fullscreen.toggle(),this.lastKey=i}else this.lastKey=null}}},{key:"toggleMenu",value:function(e){at.toggleMenu.call(this.player,e)}}]),e}();"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self&&self;var wt=function(e,t){return e(t={exports:{}},t.exports),t.exports}((function(e,t){e.exports=function(){var e=function(){},t={},n={},i={};function a(e,t){e=e.push?e:[e];var a,r,o,s=[],l=e.length,c=l;for(a=function(e,n){n.length&&s.push(e),--c||t(s)};l--;)r=e[l],(o=n[r])?a(r,o):(i[r]=i[r]||[]).push(a)}function r(e,t){if(e){var a=i[e];if(n[e]=t,a)for(;a.length;)a[0](e,t),a.splice(0,1)}}function o(t,n){t.call&&(t={success:t}),n.length?(t.error||e)(n):(t.success||e)(t)}function s(t,n,i,a){var r,o,l=document,c=i.async,u=(i.numRetries||0)+1,d=i.before||e,h=t.replace(/[\?|#].*$/,""),m=t.replace(/^(css|img)!/,"");a=a||0,/(^css!|\.css$)/.test(h)?((o=l.createElement("link")).rel="stylesheet",o.href=m,(r="hideFocus"in o)&&o.relList&&(r=0,o.rel="preload",o.as="style")):/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(h)?(o=l.createElement("img")).src=m:((o=l.createElement("script")).src=t,o.async=void 0===c||c),o.onload=o.onerror=o.onbeforeload=function(e){var l=e.type[0];if(r)try{o.sheet.cssText.length||(l="e")}catch(e){18!=e.code&&(l="e")}if("e"==l){if((a+=1)<u)return s(t,n,i,a)}else if("preload"==o.rel&&"style"==o.as)return o.rel="stylesheet";n(t,l,e.defaultPrevented)},!1!==d(t,o)&&l.head.appendChild(o)}function l(e,t,n){var i,a,r=(e=e.push?e:[e]).length,o=r,l=[];for(i=function(e,n,i){if("e"==n&&l.push(e),"b"==n){if(!i)return;l.push(e)}--r||t(l)},a=0;a<o;a++)s(e[a],i,n)}function c(e,n,i){var a,s;if(n&&n.trim&&(a=n),s=(a?i:n)||{},a){if(a in t)throw"LoadJS";t[a]=!0}function c(t,n){l(e,(function(e){o(s,e),t&&o({success:t,error:n},e),r(a,e)}),s)}if(s.returnPromise)return new Promise(c);c()}return c.ready=function(e,t){return a(e,(function(e){o(t,e)})),c},c.done=function(e){r(e,[])},c.reset=function(){t={},n={},i={}},c.isDefined=function(e){return e in t},c}()}));function kt(e){return new Promise((function(t,n){wt(e,{success:t,error:n})}))}function Tt(e){e&&!this.embed.hasPlayed&&(this.embed.hasPlayed=!0),this.media.paused===e&&(this.media.paused=!e,_e.call(this,this.media,e?"play":"pause"))}var Ct={setup:function(){var e=this;we(e.elements.wrapper,e.config.classNames.embed,!0),e.options.speed=e.config.speed.options,Ve.call(e),K(window.Vimeo)?Ct.ready.call(e):kt(e.config.urls.vimeo.sdk).then((function(){Ct.ready.call(e)})).catch((function(t){e.debug.warn("Vimeo SDK (player.js) failed to load",t)}))},ready:function(){var e=this,t=this,n=t.config.vimeo,i=n.premium,a=n.referrerPolicy,r=s(n,["premium","referrerPolicy"]);i&&Object.assign(r,{controls:!1,sidedock:!1});var c=ot(o({loop:t.config.loop.active,autoplay:t.autoplay,muted:t.muted,gesture:"media",playsinline:!this.config.fullscreen.iosNative},r)),u=t.media.getAttribute("src");re(u)&&(u=t.media.getAttribute(t.config.attributes.embed.id));var d,h=re(d=u)?null:Y(Number(d))?d:d.match(/^.*(vimeo.com\/|video\/)(\d+).*/)?RegExp.$2:d,m=me("iframe"),p=We(t.config.urls.vimeo.iframe,h,c);if(m.setAttribute("src",p),m.setAttribute("allowfullscreen",""),m.setAttribute("allow",["autoplay","fullscreen","picture-in-picture"].join("; ")),re(a)||m.setAttribute("referrerPolicy",a),i||!n.customControls)m.setAttribute("data-poster",t.poster),t.media=ye(m,t.media);else{var f=me("div",{class:t.config.classNames.embedContainer,"data-poster":t.poster});f.appendChild(m),t.media=ye(f,t.media)}n.customControls||Ge(We(t.config.urls.vimeo.api,p)).then((function(e){!re(e)&&e.thumbnail_url&&bt.setPoster.call(t,e.thumbnail_url).catch((function(){}))})),t.embed=new window.Vimeo.Player(m,{autopause:t.config.autopause,muted:t.muted}),t.media.paused=!0,t.media.currentTime=0,t.supported.ui&&t.embed.disableTextTrack(),t.media.play=function(){return Tt.call(t,!0),t.embed.play()},t.media.pause=function(){return Tt.call(t,!1),t.embed.pause()},t.media.stop=function(){t.pause(),t.currentTime=0};var g=t.media.currentTime;Object.defineProperty(t.media,"currentTime",{get:function(){return g},set:function(e){var n=t.embed,i=t.media,a=t.paused,r=t.volume,o=a&&!n.hasPlayed;i.seeking=!0,_e.call(t,i,"seeking"),Promise.resolve(o&&n.setVolume(0)).then((function(){return n.setCurrentTime(e)})).then((function(){return o&&n.pause()})).then((function(){return o&&n.setVolume(r)})).catch((function(){}))}});var y=t.config.speed.selected;Object.defineProperty(t.media,"playbackRate",{get:function(){return y},set:function(e){t.embed.setPlaybackRate(e).then((function(){y=e,_e.call(t,t.media,"ratechange")})).catch((function(){t.options.speed=[1]}))}});var b=t.config.volume;Object.defineProperty(t.media,"volume",{get:function(){return b},set:function(e){t.embed.setVolume(e).then((function(){b=e,_e.call(t,t.media,"volumechange")}))}});var v=t.config.muted;Object.defineProperty(t.media,"muted",{get:function(){return v},set:function(e){var n=!!X(e)&&e;t.embed.setVolume(n?0:t.config.volume).then((function(){v=n,_e.call(t,t.media,"volumechange")}))}});var w,k=t.config.loop;Object.defineProperty(t.media,"loop",{get:function(){return k},set:function(e){var n=X(e)?e:t.config.loop.active;t.embed.setLoop(n).then((function(){k=n}))}}),t.embed.getVideoUrl().then((function(e){w=e,at.setDownloadUrl.call(t)})).catch((function(t){e.debug.warn(t)})),Object.defineProperty(t.media,"currentSrc",{get:function(){return w}}),Object.defineProperty(t.media,"ended",{get:function(){return t.currentTime===t.duration}}),Promise.all([t.embed.getVideoWidth(),t.embed.getVideoHeight()]).then((function(n){var i=l(n,2),a=i[0],r=i[1];t.embed.ratio=[a,r],Ve.call(e)})),t.embed.setAutopause(t.config.autopause).then((function(e){t.config.autopause=e})),t.embed.getVideoTitle().then((function(n){t.config.title=n,bt.setTitle.call(e)})),t.embed.getCurrentTime().then((function(e){g=e,_e.call(t,t.media,"timeupdate")})),t.embed.getDuration().then((function(e){t.media.duration=e,_e.call(t,t.media,"durationchange")})),t.embed.getTextTracks().then((function(e){t.media.textTracks=e,st.setup.call(t)})),t.embed.on("cuechange",(function(e){var n=e.cues,i=(void 0===n?[]:n).map((function(e){return function(e){var t=document.createDocumentFragment(),n=document.createElement("div");return t.appendChild(n),n.innerHTML=e,t.firstChild.innerText}(e.text)}));st.updateCues.call(t,i)})),t.embed.on("loaded",(function(){(t.embed.getPaused().then((function(e){Tt.call(t,!e),e||_e.call(t,t.media,"playing")})),Z(t.embed.element)&&t.supported.ui)&&t.embed.element.setAttribute("tabindex",-1)})),t.embed.on("bufferstart",(function(){_e.call(t,t.media,"waiting")})),t.embed.on("bufferend",(function(){_e.call(t,t.media,"playing")})),t.embed.on("play",(function(){Tt.call(t,!0),_e.call(t,t.media,"playing")})),t.embed.on("pause",(function(){Tt.call(t,!1)})),t.embed.on("timeupdate",(function(e){t.media.seeking=!1,g=e.seconds,_e.call(t,t.media,"timeupdate")})),t.embed.on("progress",(function(e){t.media.buffered=e.percent,_e.call(t,t.media,"progress"),1===parseInt(e.percent,10)&&_e.call(t,t.media,"canplaythrough"),t.embed.getDuration().then((function(e){e!==t.media.duration&&(t.media.duration=e,_e.call(t,t.media,"durationchange"))}))})),t.embed.on("seeked",(function(){t.media.seeking=!1,_e.call(t,t.media,"seeked")})),t.embed.on("ended",(function(){t.media.paused=!0,_e.call(t,t.media,"ended")})),t.embed.on("error",(function(e){t.media.error=e,_e.call(t,t.media,"error")})),n.customControls&&setTimeout((function(){return bt.build.call(t)}),0)}};function At(e){e&&!this.embed.hasPlayed&&(this.embed.hasPlayed=!0),this.media.paused===e&&(this.media.paused=!e,_e.call(this,this.media,e?"play":"pause"))}function St(e){return e.noCookie?"https://www.youtube-nocookie.com":"http:"===window.location.protocol?"http://www.youtube.com":void 0}var Pt={setup:function(){var e=this;if(we(this.elements.wrapper,this.config.classNames.embed,!0),K(window.YT)&&$(window.YT.Player))Pt.ready.call(this);else{var t=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=function(){$(t)&&t(),Pt.ready.call(e)},kt(this.config.urls.youtube.sdk).catch((function(t){e.debug.warn("YouTube API failed to load",t)}))}},getTitle:function(e){var t=this;Ge(We(this.config.urls.youtube.api,e)).then((function(e){if(K(e)){var n=e.title,i=e.height,a=e.width;t.config.title=n,bt.setTitle.call(t),t.embed.ratio=[a,i]}Ve.call(t)})).catch((function(){Ve.call(t)}))},ready:function(){var e=this,t=e.config.youtube,n=e.media&&e.media.getAttribute("id");if(re(n)||!n.startsWith("youtube-")){var i=e.media.getAttribute("src");re(i)&&(i=e.media.getAttribute(this.config.attributes.embed.id));var a,r,o=re(a=i)?null:a.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?RegExp.$2:a,s=me("div",{id:(r=e.provider,"".concat(r,"-").concat(Math.floor(1e4*Math.random()))),"data-poster":t.customControls?e.poster:void 0});if(e.media=ye(s,e.media),t.customControls){var l=function(e){return"https://i.ytimg.com/vi/".concat(o,"/").concat(e,"default.jpg")};yt(l("maxres"),121).catch((function(){return yt(l("sd"),121)})).catch((function(){return yt(l("hq"))})).then((function(t){return bt.setPoster.call(e,t.src)})).then((function(t){t.includes("maxres")||(e.elements.poster.style.backgroundSize="cover")})).catch((function(){}))}e.embed=new window.YT.Player(e.media,{videoId:o,host:St(t),playerVars:ue({},{autoplay:e.config.autoplay?1:0,hl:e.config.hl,controls:e.supported.ui&&t.customControls?0:1,disablekb:1,playsinline:e.config.fullscreen.iosNative?0:1,cc_load_policy:e.captions.active?1:0,cc_lang_pref:e.config.captions.language,widget_referrer:window?window.location.href:null},t),events:{onError:function(t){if(!e.media.error){var n=t.data,i={2:"The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.",5:"The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",100:"The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.",101:"The owner of the requested video does not allow it to be played in embedded players.",150:"The owner of the requested video does not allow it to be played in embedded players."}[n]||"An unknown error occured";e.media.error={code:n,message:i},_e.call(e,e.media,"error")}},onPlaybackRateChange:function(t){var n=t.target;e.media.playbackRate=n.getPlaybackRate(),_e.call(e,e.media,"ratechange")},onReady:function(n){if(!$(e.media.play)){var i=n.target;Pt.getTitle.call(e,o),e.media.play=function(){At.call(e,!0),i.playVideo()},e.media.pause=function(){At.call(e,!1),i.pauseVideo()},e.media.stop=function(){i.stopVideo()},e.media.duration=i.getDuration(),e.media.paused=!0,e.media.currentTime=0,Object.defineProperty(e.media,"currentTime",{get:function(){return Number(i.getCurrentTime())},set:function(t){e.paused&&!e.embed.hasPlayed&&e.embed.mute(),e.media.seeking=!0,_e.call(e,e.media,"seeking"),i.seekTo(t)}}),Object.defineProperty(e.media,"playbackRate",{get:function(){return i.getPlaybackRate()},set:function(e){i.setPlaybackRate(e)}});var a=e.config.volume;Object.defineProperty(e.media,"volume",{get:function(){return a},set:function(t){a=t,i.setVolume(100*a),_e.call(e,e.media,"volumechange")}});var r=e.config.muted;Object.defineProperty(e.media,"muted",{get:function(){return r},set:function(t){var n=X(t)?t:r;r=n,i[n?"mute":"unMute"](),i.setVolume(100*a),_e.call(e,e.media,"volumechange")}}),Object.defineProperty(e.media,"currentSrc",{get:function(){return i.getVideoUrl()}}),Object.defineProperty(e.media,"ended",{get:function(){return e.currentTime===e.duration}});var s=i.getAvailablePlaybackRates();e.options.speed=s.filter((function(t){return e.config.speed.options.includes(t)})),e.supported.ui&&t.customControls&&e.media.setAttribute("tabindex",-1),_e.call(e,e.media,"timeupdate"),_e.call(e,e.media,"durationchange"),clearInterval(e.timers.buffering),e.timers.buffering=setInterval((function(){e.media.buffered=i.getVideoLoadedFraction(),(null===e.media.lastBuffered||e.media.lastBuffered<e.media.buffered)&&_e.call(e,e.media,"progress"),e.media.lastBuffered=e.media.buffered,1===e.media.buffered&&(clearInterval(e.timers.buffering),_e.call(e,e.media,"canplaythrough"))}),200),t.customControls&&setTimeout((function(){return bt.build.call(e)}),50)}},onStateChange:function(n){var i=n.target;switch(clearInterval(e.timers.playing),e.media.seeking&&[1,2].includes(n.data)&&(e.media.seeking=!1,_e.call(e,e.media,"seeked")),n.data){case-1:_e.call(e,e.media,"timeupdate"),e.media.buffered=i.getVideoLoadedFraction(),_e.call(e,e.media,"progress");break;case 0:At.call(e,!1),e.media.loop?(i.stopVideo(),i.playVideo()):_e.call(e,e.media,"ended");break;case 1:t.customControls&&!e.config.autoplay&&e.media.paused&&!e.embed.hasPlayed?e.media.pause():(At.call(e,!0),_e.call(e,e.media,"playing"),e.timers.playing=setInterval((function(){_e.call(e,e.media,"timeupdate")}),50),e.media.duration!==i.getDuration()&&(e.media.duration=i.getDuration(),_e.call(e,e.media,"durationchange")));break;case 2:e.muted||e.embed.unMute(),At.call(e,!1);break;case 3:_e.call(e,e.media,"waiting")}_e.call(e,e.elements.container,"statechange",!1,{code:n.data})}}})}}},Et={setup:function(){this.media?(we(this.elements.container,this.config.classNames.type.replace("{0}",this.type),!0),we(this.elements.container,this.config.classNames.provider.replace("{0}",this.provider),!0),this.isEmbed&&we(this.elements.container,this.config.classNames.type.replace("{0}","video"),!0),this.isVideo&&(this.elements.wrapper=me("div",{class:this.config.classNames.video}),de(this.media,this.elements.wrapper),this.elements.poster=me("div",{class:this.config.classNames.poster,hidden:""}),this.elements.wrapper.appendChild(this.elements.poster)),this.isHTML5?Be.setup.call(this):this.isYouTube?Pt.setup.call(this):this.isVimeo&&Ct.setup.call(this)):this.debug.warn("No media element found!")}},Nt=function(){function e(n){var i=this;t(this,e),a(this,"load",(function(){i.enabled&&(K(window.google)&&K(window.google.ima)?i.ready():kt(i.player.config.urls.googleIMA.sdk).then((function(){i.ready()})).catch((function(){i.trigger("error",new Error("Google IMA SDK failed to load"))})))})),a(this,"ready",(function(){var e;i.enabled||((e=i).manager&&e.manager.destroy(),e.elements.displayContainer&&e.elements.displayContainer.destroy(),e.elements.container.remove()),i.startSafetyTimer(12e3,"ready()"),i.managerPromise.then((function(){i.clearSafetyTimer("onAdsManagerLoaded()")})),i.listeners(),i.setupIMA()})),a(this,"setupIMA",(function(){i.elements.container=me("div",{class:i.player.config.classNames.ads}),i.player.elements.container.appendChild(i.elements.container),google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED),google.ima.settings.setLocale(i.player.config.ads.language),google.ima.settings.setDisableCustomPlaybackForIOS10Plus(i.player.config.playsinline),i.elements.displayContainer=new google.ima.AdDisplayContainer(i.elements.container,i.player.media),i.loader=new google.ima.AdsLoader(i.elements.displayContainer),i.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,(function(e){return i.onAdsManagerLoaded(e)}),!1),i.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,(function(e){return i.onAdError(e)}),!1),i.requestAds()})),a(this,"requestAds",(function(){var e=i.player.elements.container;try{var t=new google.ima.AdsRequest;t.adTagUrl=i.tagUrl,t.linearAdSlotWidth=e.offsetWidth,t.linearAdSlotHeight=e.offsetHeight,t.nonLinearAdSlotWidth=e.offsetWidth,t.nonLinearAdSlotHeight=e.offsetHeight,t.forceNonLinearFullSlot=!1,t.setAdWillPlayMuted(!i.player.muted),i.loader.requestAds(t)}catch(e){i.onAdError(e)}})),a(this,"pollCountdown",(function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(!e)return clearInterval(i.countdownTimer),void i.elements.container.removeAttribute("data-badge-text");var t=function(){var e=it(Math.max(i.manager.getRemainingTime(),0)),t="".concat($e("advertisement",i.player.config)," - ").concat(e);i.elements.container.setAttribute("data-badge-text",t)};i.countdownTimer=setInterval(t,100)})),a(this,"onAdsManagerLoaded",(function(e){if(i.enabled){var t=new google.ima.AdsRenderingSettings;t.restoreCustomPlaybackStateOnAdBreakComplete=!0,t.enablePreloading=!0,i.manager=e.getAdsManager(i.player,t),i.cuePoints=i.manager.getCuePoints(),i.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,(function(e){return i.onAdError(e)})),Object.keys(google.ima.AdEvent.Type).forEach((function(e){i.manager.addEventListener(google.ima.AdEvent.Type[e],(function(e){return i.onAdEvent(e)}))})),i.trigger("loaded")}})),a(this,"addCuePoints",(function(){re(i.cuePoints)||i.cuePoints.forEach((function(e){if(0!==e&&-1!==e&&e<i.player.duration){var t=i.player.elements.progress;if(Z(t)){var n=100/i.player.duration*e,a=me("span",{class:i.player.config.classNames.cues});a.style.left="".concat(n.toString(),"%"),t.appendChild(a)}}}))})),a(this,"onAdEvent",(function(e){var t=i.player.elements.container,n=e.getAd(),a=e.getAdData();switch(function(e){_e.call(i.player,i.player.media,"ads".concat(e.replace(/_/g,"").toLowerCase()))}(e.type),e.type){case google.ima.AdEvent.Type.LOADED:i.trigger("loaded"),i.pollCountdown(!0),n.isLinear()||(n.width=t.offsetWidth,n.height=t.offsetHeight);break;case google.ima.AdEvent.Type.STARTED:i.manager.setVolume(i.player.volume);break;case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:i.player.ended?i.loadAds():i.loader.contentComplete();break;case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:i.pauseContent();break;case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:i.pollCountdown(),i.resumeContent();break;case google.ima.AdEvent.Type.LOG:a.adError&&i.player.debug.warn("Non-fatal ad error: ".concat(a.adError.getMessage()))}})),a(this,"onAdError",(function(e){i.cancel(),i.player.debug.warn("Ads error",e)})),a(this,"listeners",(function(){var e,t=i.player.elements.container;i.player.on("canplay",(function(){i.addCuePoints()})),i.player.on("ended",(function(){i.loader.contentComplete()})),i.player.on("timeupdate",(function(){e=i.player.currentTime})),i.player.on("seeked",(function(){var t=i.player.currentTime;re(i.cuePoints)||i.cuePoints.forEach((function(n,a){e<n&&n<t&&(i.manager.discardAdBreak(),i.cuePoints.splice(a,1))}))})),window.addEventListener("resize",(function(){i.manager&&i.manager.resize(t.offsetWidth,t.offsetHeight,google.ima.ViewMode.NORMAL)}))})),a(this,"play",(function(){var e=i.player.elements.container;i.managerPromise||i.resumeContent(),i.managerPromise.then((function(){i.manager.setVolume(i.player.volume),i.elements.displayContainer.initialize();try{i.initialized||(i.manager.init(e.offsetWidth,e.offsetHeight,google.ima.ViewMode.NORMAL),i.manager.start()),i.initialized=!0}catch(e){i.onAdError(e)}})).catch((function(){}))})),a(this,"resumeContent",(function(){i.elements.container.style.zIndex="",i.playing=!1,qe(i.player.media.play())})),a(this,"pauseContent",(function(){i.elements.container.style.zIndex=3,i.playing=!0,i.player.media.pause()})),a(this,"cancel",(function(){i.initialized&&i.resumeContent(),i.trigger("error"),i.loadAds()})),a(this,"loadAds",(function(){i.managerPromise.then((function(){i.manager&&i.manager.destroy(),i.managerPromise=new Promise((function(e){i.on("loaded",e),i.player.debug.log(i.manager)})),i.initialized=!1,i.requestAds()})).catch((function(){}))})),a(this,"trigger",(function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];var r=i.events[e];J(r)&&r.forEach((function(e){$(e)&&e.apply(i,n)}))})),a(this,"on",(function(e,t){return J(i.events[e])||(i.events[e]=[]),i.events[e].push(t),i})),a(this,"startSafetyTimer",(function(e,t){i.player.debug.log("Safety timer invoked from: ".concat(t)),i.safetyTimer=setTimeout((function(){i.cancel(),i.clearSafetyTimer("startSafetyTimer()")}),e)})),a(this,"clearSafetyTimer",(function(e){z(i.safetyTimer)||(i.player.debug.log("Safety timer cleared from: ".concat(e)),clearTimeout(i.safetyTimer),i.safetyTimer=null)})),this.player=n,this.config=n.config.ads,this.playing=!1,this.initialized=!1,this.elements={container:null,displayContainer:null},this.manager=null,this.loader=null,this.cuePoints=null,this.events={},this.safetyTimer=null,this.countdownTimer=null,this.managerPromise=new Promise((function(e,t){i.on("loaded",e),i.on("error",t)})),this.load()}return i(e,[{key:"enabled",get:function(){var e=this.config;return this.player.isHTML5&&this.player.isVideo&&e.enabled&&(!re(e.publisherId)||ae(e.tagUrl))}},{key:"tagUrl",get:function(){var e=this.config;if(ae(e.tagUrl))return e.tagUrl;var t={AV_PUBLISHERID:"58c25bb0073ef448b1087ad6",AV_CHANNELID:"5a0458dc28a06145e4519d21",AV_URL:window.location.hostname,cb:Date.now(),AV_WIDTH:640,AV_HEIGHT:480,AV_CDIM2:e.publisherId};return"".concat("https://go.aniview.com/api/adserver6/vast/","?").concat(ot(t))}}]),e}(),Mt=function(e,t){var n={};return e>t.width/t.height?(n.width=t.width,n.height=1/e*t.width):(n.height=t.height,n.width=e*t.height),n},xt=function(){function e(n){var i=this;t(this,e),a(this,"load",(function(){i.player.elements.display.seekTooltip&&(i.player.elements.display.seekTooltip.hidden=i.enabled),i.enabled&&i.getThumbnails().then((function(){i.enabled&&(i.render(),i.determineContainerAutoSizing(),i.loaded=!0)}))})),a(this,"getThumbnails",(function(){return new Promise((function(e){var t=i.player.config.previewThumbnails.src;if(re(t))throw new Error("Missing previewThumbnails.src config attribute");var n=function(){i.thumbnails.sort((function(e,t){return e.height-t.height})),i.player.debug.log("Preview thumbnails",i.thumbnails),e()};if($(t))t((function(e){i.thumbnails=e,n()}));else{var a=(Q(t)?[t]:t).map((function(e){return i.getThumbnail(e)}));Promise.all(a).then(n)}}))})),a(this,"getThumbnail",(function(e){return new Promise((function(t){Ge(e).then((function(n){var a,r,o={frames:(a=n,r=[],a.split(/\r\n\r\n|\n\n|\r\r/).forEach((function(e){var t={};e.split(/\r\n|\n|\r/).forEach((function(e){if(Y(t.startTime)){if(!re(e.trim())&&re(t.text)){var n=e.trim().split("#xywh="),i=l(n,1);if(t.text=i[0],n[1]){var a=l(n[1].split(","),4);t.x=a[0],t.y=a[1],t.w=a[2],t.h=a[3]}}}else{var r=e.match(/([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/);r&&(t.startTime=60*Number(r[1]||0)*60+60*Number(r[2])+Number(r[3])+Number("0.".concat(r[4])),t.endTime=60*Number(r[6]||0)*60+60*Number(r[7])+Number(r[8])+Number("0.".concat(r[9])))}})),t.text&&r.push(t)})),r),height:null,urlPrefix:""};o.frames[0].text.startsWith("/")||o.frames[0].text.startsWith("http://")||o.frames[0].text.startsWith("https://")||(o.urlPrefix=e.substring(0,e.lastIndexOf("/")+1));var s=new Image;s.onload=function(){o.height=s.naturalHeight,o.width=s.naturalWidth,i.thumbnails.push(o),t()},s.src=o.urlPrefix+o.frames[0].text}))}))})),a(this,"startMove",(function(e){if(i.loaded&&ee(e)&&["touchmove","mousemove"].includes(e.type)&&i.player.media.duration){if("touchmove"===e.type)i.seekTime=i.player.media.duration*(i.player.elements.inputs.seek.value/100);else{var t=i.player.elements.progress.getBoundingClientRect(),n=100/t.width*(e.pageX-t.left);i.seekTime=i.player.media.duration*(n/100),i.seekTime<0&&(i.seekTime=0),i.seekTime>i.player.media.duration-1&&(i.seekTime=i.player.media.duration-1),i.mousePosX=e.pageX,i.elements.thumb.time.innerText=it(i.seekTime)}i.showImageAtCurrentTime()}})),a(this,"endMove",(function(){i.toggleThumbContainer(!1,!0)})),a(this,"startScrubbing",(function(e){(z(e.button)||!1===e.button||0===e.button)&&(i.mouseDown=!0,i.player.media.duration&&(i.toggleScrubbingContainer(!0),i.toggleThumbContainer(!1,!0),i.showImageAtCurrentTime()))})),a(this,"endScrubbing",(function(){i.mouseDown=!1,Math.ceil(i.lastTime)===Math.ceil(i.player.media.currentTime)?i.toggleScrubbingContainer(!1):Oe.call(i.player,i.player.media,"timeupdate",(function(){i.mouseDown||i.toggleScrubbingContainer(!1)}))})),a(this,"listeners",(function(){i.player.on("play",(function(){i.toggleThumbContainer(!1,!0)})),i.player.on("seeked",(function(){i.toggleThumbContainer(!1)})),i.player.on("timeupdate",(function(){i.lastTime=i.player.media.currentTime}))})),a(this,"render",(function(){i.elements.thumb.container=me("div",{class:i.player.config.classNames.previewThumbnails.thumbContainer}),i.elements.thumb.imageContainer=me("div",{class:i.player.config.classNames.previewThumbnails.imageContainer}),i.elements.thumb.container.appendChild(i.elements.thumb.imageContainer);var e=me("div",{class:i.player.config.classNames.previewThumbnails.timeContainer});i.elements.thumb.time=me("span",{},"00:00"),e.appendChild(i.elements.thumb.time),i.elements.thumb.container.appendChild(e),Z(i.player.elements.progress)&&i.player.elements.progress.appendChild(i.elements.thumb.container),i.elements.scrubbing.container=me("div",{class:i.player.config.classNames.previewThumbnails.scrubbingContainer}),i.player.elements.wrapper.appendChild(i.elements.scrubbing.container)})),a(this,"destroy",(function(){i.elements.thumb.container&&i.elements.thumb.container.remove(),i.elements.scrubbing.container&&i.elements.scrubbing.container.remove()})),a(this,"showImageAtCurrentTime",(function(){i.mouseDown?i.setScrubbingContainerSize():i.setThumbContainerSizeAndPos();var e=i.thumbnails[0].frames.findIndex((function(e){return i.seekTime>=e.startTime&&i.seekTime<=e.endTime})),t=e>=0,n=0;i.mouseDown||i.toggleThumbContainer(t),t&&(i.thumbnails.forEach((function(t,a){i.loadedImages.includes(t.frames[e].text)&&(n=a)})),e!==i.showingThumb&&(i.showingThumb=e,i.loadImage(n)))})),a(this,"loadImage",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=i.showingThumb,n=i.thumbnails[e],a=n.urlPrefix,r=n.frames[t],o=n.frames[t].text,s=a+o;if(i.currentImageElement&&i.currentImageElement.dataset.filename===o)i.showImage(i.currentImageElement,r,e,t,o,!1),i.currentImageElement.dataset.index=t,i.removeOldImages(i.currentImageElement);else{i.loadingImage&&i.usingSprites&&(i.loadingImage.onload=null);var l=new Image;l.src=s,l.dataset.index=t,l.dataset.filename=o,i.showingThumbFilename=o,i.player.debug.log("Loading image: ".concat(s)),l.onload=function(){return i.showImage(l,r,e,t,o,!0)},i.loadingImage=l,i.removeOldImages(l)}})),a(this,"showImage",(function(e,t,n,a,r){var o=!(arguments.length>5&&void 0!==arguments[5])||arguments[5];i.player.debug.log("Showing thumb: ".concat(r,". num: ").concat(a,". qual: ").concat(n,". newimg: ").concat(o)),i.setImageSizeAndOffset(e,t),o&&(i.currentImageContainer.appendChild(e),i.currentImageElement=e,i.loadedImages.includes(r)||i.loadedImages.push(r)),i.preloadNearby(a,!0).then(i.preloadNearby(a,!1)).then(i.getHigherQuality(n,e,t,r))})),a(this,"removeOldImages",(function(e){Array.from(i.currentImageContainer.children).forEach((function(t){if("img"===t.tagName.toLowerCase()){var n=i.usingSprites?500:1e3;if(t.dataset.index!==e.dataset.index&&!t.dataset.deleting){t.dataset.deleting=!0;var a=i.currentImageContainer;setTimeout((function(){a.removeChild(t),i.player.debug.log("Removing thumb: ".concat(t.dataset.filename))}),n)}}}))})),a(this,"preloadNearby",(function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return new Promise((function(n){setTimeout((function(){var a=i.thumbnails[0].frames[e].text;if(i.showingThumbFilename===a){var r;r=t?i.thumbnails[0].frames.slice(e):i.thumbnails[0].frames.slice(0,e).reverse();var o=!1;r.forEach((function(e){var t=e.text;if(t!==a&&!i.loadedImages.includes(t)){o=!0,i.player.debug.log("Preloading thumb filename: ".concat(t));var r=i.thumbnails[0].urlPrefix+t,s=new Image;s.src=r,s.onload=function(){i.player.debug.log("Preloaded thumb filename: ".concat(t)),i.loadedImages.includes(t)||i.loadedImages.push(t),n()}}})),o||n()}}),300)}))})),a(this,"getHigherQuality",(function(e,t,n,a){if(e<i.thumbnails.length-1){var r=t.naturalHeight;i.usingSprites&&(r=n.h),r<i.thumbContainerHeight&&setTimeout((function(){i.showingThumbFilename===a&&(i.player.debug.log("Showing higher quality thumb for: ".concat(a)),i.loadImage(e+1))}),300)}})),a(this,"toggleThumbContainer",(function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=i.player.config.classNames.previewThumbnails.thumbContainerShown;i.elements.thumb.container.classList.toggle(n,e),!e&&t&&(i.showingThumb=null,i.showingThumbFilename=null)})),a(this,"toggleScrubbingContainer",(function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=i.player.config.classNames.previewThumbnails.scrubbingContainerShown;i.elements.scrubbing.container.classList.toggle(t,e),e||(i.showingThumb=null,i.showingThumbFilename=null)})),a(this,"determineContainerAutoSizing",(function(){(i.elements.thumb.imageContainer.clientHeight>20||i.elements.thumb.imageContainer.clientWidth>20)&&(i.sizeSpecifiedInCSS=!0)})),a(this,"setThumbContainerSizeAndPos",(function(){if(i.sizeSpecifiedInCSS){if(i.elements.thumb.imageContainer.clientHeight>20&&i.elements.thumb.imageContainer.clientWidth<20){var e=Math.floor(i.elements.thumb.imageContainer.clientHeight*i.thumbAspectRatio);i.elements.thumb.imageContainer.style.width="".concat(e,"px")}else if(i.elements.thumb.imageContainer.clientHeight<20&&i.elements.thumb.imageContainer.clientWidth>20){var t=Math.floor(i.elements.thumb.imageContainer.clientWidth/i.thumbAspectRatio);i.elements.thumb.imageContainer.style.height="".concat(t,"px")}}else{var n=Math.floor(i.thumbContainerHeight*i.thumbAspectRatio);i.elements.thumb.imageContainer.style.height="".concat(i.thumbContainerHeight,"px"),i.elements.thumb.imageContainer.style.width="".concat(n,"px")}i.setThumbContainerPos()})),a(this,"setThumbContainerPos",(function(){var e=i.player.elements.progress.getBoundingClientRect(),t=i.player.elements.container.getBoundingClientRect(),n=i.elements.thumb.container,a=t.left-e.left+10,r=t.right-e.left-n.clientWidth-10,o=i.mousePosX-e.left-n.clientWidth/2;o<a&&(o=a),o>r&&(o=r),n.style.left="".concat(o,"px")})),a(this,"setScrubbingContainerSize",(function(){var e=Mt(i.thumbAspectRatio,{width:i.player.media.clientWidth,height:i.player.media.clientHeight}),t=e.width,n=e.height;i.elements.scrubbing.container.style.width="".concat(t,"px"),i.elements.scrubbing.container.style.height="".concat(n,"px")})),a(this,"setImageSizeAndOffset",(function(e,t){if(i.usingSprites){var n=i.thumbContainerHeight/t.h;e.style.height="".concat(e.naturalHeight*n,"px"),e.style.width="".concat(e.naturalWidth*n,"px"),e.style.left="-".concat(t.x*n,"px"),e.style.top="-".concat(t.y*n,"px")}})),this.player=n,this.thumbnails=[],this.loaded=!1,this.lastMouseMoveTime=Date.now(),this.mouseDown=!1,this.loadedImages=[],this.elements={thumb:{},scrubbing:{}},this.load()}return i(e,[{key:"enabled",get:function(){return this.player.isHTML5&&this.player.isVideo&&this.player.config.previewThumbnails.enabled}},{key:"currentImageContainer",get:function(){return this.mouseDown?this.elements.scrubbing.container:this.elements.thumb.imageContainer}},{key:"usingSprites",get:function(){return Object.keys(this.thumbnails[0].frames[0]).includes("w")}},{key:"thumbAspectRatio",get:function(){return this.usingSprites?this.thumbnails[0].frames[0].w/this.thumbnails[0].frames[0].h:this.thumbnails[0].width/this.thumbnails[0].height}},{key:"thumbContainerHeight",get:function(){return this.mouseDown?Mt(this.thumbAspectRatio,{width:this.player.media.clientWidth,height:this.player.media.clientHeight}).height:this.sizeSpecifiedInCSS?this.elements.thumb.imageContainer.clientHeight:Math.floor(this.player.media.clientWidth/this.thumbAspectRatio/4)}},{key:"currentImageElement",get:function(){return this.mouseDown?this.currentScrubbingImageElement:this.currentThumbnailImageElement},set:function(e){this.mouseDown?this.currentScrubbingImageElement=e:this.currentThumbnailImageElement=e}}]),e}(),It={insertElements:function(e,t){var n=this;Q(t)?pe(e,this.media,{src:t}):J(t)&&t.forEach((function(t){pe(e,n.media,t)}))},change:function(e){var t=this;ce(e,"sources.length")?(Be.cancelRequests.call(this),this.destroy.call(this,(function(){t.options.quality=[],fe(t.media),t.media=null,Z(t.elements.container)&&t.elements.container.removeAttribute("class");var n=e.sources,i=e.type,a=l(n,1)[0],r=a.provider,o=void 0===r?dt.html5:r,s=a.src,c="html5"===o?i:"div",u="html5"===o?{}:{src:s};Object.assign(t,{provider:o,type:i,supported:Ne.check(i,o,t.config.playsinline),media:me(c,u)}),t.elements.container.appendChild(t.media),X(e.autoplay)&&(t.config.autoplay=e.autoplay),t.isHTML5&&(t.config.crossorigin&&t.media.setAttribute("crossorigin",""),t.config.autoplay&&t.media.setAttribute("autoplay",""),re(e.poster)||(t.poster=e.poster),t.config.loop.active&&t.media.setAttribute("loop",""),t.config.muted&&t.media.setAttribute("muted",""),t.config.playsinline&&t.media.setAttribute("playsinline","")),bt.addStyleHook.call(t),t.isHTML5&&It.insertElements.call(t,"source",n),t.config.title=e.title,Et.setup.call(t),t.isHTML5&&Object.keys(e).includes("tracks")&&It.insertElements.call(t,"track",e.tracks),(t.isHTML5||t.isEmbed&&!t.supported.ui)&&bt.build.call(t),t.isHTML5&&t.media.load(),re(e.previewThumbnails)||(Object.assign(t.config.previewThumbnails,e.previewThumbnails),t.previewThumbnails&&t.previewThumbnails.loaded&&(t.previewThumbnails.destroy(),t.previewThumbnails=null),t.config.previewThumbnails.enabled&&(t.previewThumbnails=new xt(t))),t.fullscreen.update()}),!0)):this.debug.warn("Invalid source format")}};var Lt,Ot=function(){function e(n,i){var r=this;if(t(this,e),a(this,"play",(function(){return $(r.media.play)?(r.ads&&r.ads.enabled&&r.ads.managerPromise.then((function(){return r.ads.play()})).catch((function(){return qe(r.media.play())})),r.media.play()):null})),a(this,"pause",(function(){return r.playing&&$(r.media.pause)?r.media.pause():null})),a(this,"togglePlay",(function(e){return(X(e)?e:!r.playing)?r.play():r.pause()})),a(this,"stop",(function(){r.isHTML5?(r.pause(),r.restart()):$(r.media.stop)&&r.media.stop()})),a(this,"restart",(function(){r.currentTime=0})),a(this,"rewind",(function(e){r.currentTime-=Y(e)?e:r.config.seekTime})),a(this,"forward",(function(e){r.currentTime+=Y(e)?e:r.config.seekTime})),a(this,"increaseVolume",(function(e){var t=r.media.muted?0:r.volume;r.volume=t+(Y(e)?e:0)})),a(this,"decreaseVolume",(function(e){r.increaseVolume(-e)})),a(this,"airplay",(function(){Ne.airplay&&r.media.webkitShowPlaybackTargetPicker()})),a(this,"toggleControls",(function(e){if(r.supported.ui&&!r.isAudio){var t=ke(r.elements.container,r.config.classNames.hideControls),n=void 0===e?void 0:!e,i=we(r.elements.container,r.config.classNames.hideControls,n);if(i&&J(r.config.controls)&&r.config.controls.includes("settings")&&!re(r.config.settings)&&at.toggleMenu.call(r,!1),i!==t){var a=i?"controlshidden":"controlsshown";_e.call(r,r.media,a)}return!i}return!1})),a(this,"on",(function(e,t){Ie.call(r,r.elements.container,e,t)})),a(this,"once",(function(e,t){Oe.call(r,r.elements.container,e,t)})),a(this,"off",(function(e,t){Le(r.elements.container,e,t)})),a(this,"destroy",(function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(r.ready){var n=function(){document.body.style.overflow="",r.embed=null,t?(Object.keys(r.elements).length&&(fe(r.elements.buttons.play),fe(r.elements.captions),fe(r.elements.controls),fe(r.elements.wrapper),r.elements.buttons.play=null,r.elements.captions=null,r.elements.controls=null,r.elements.wrapper=null),$(e)&&e()):(je.call(r),Be.cancelRequests.call(r),ye(r.elements.original,r.elements.container),_e.call(r,r.elements.original,"destroyed",!0),$(e)&&e.call(r.elements.original),r.ready=!1,setTimeout((function(){r.elements=null,r.media=null}),200))};r.stop(),clearTimeout(r.timers.loading),clearTimeout(r.timers.controls),clearTimeout(r.timers.resized),r.isHTML5?(bt.toggleNativeControls.call(r,!0),n()):r.isYouTube?(clearInterval(r.timers.buffering),clearInterval(r.timers.playing),null!==r.embed&&$(r.embed.destroy)&&r.embed.destroy(),n()):r.isVimeo&&(null!==r.embed&&r.embed.unload().then(n),setTimeout(n,200))}})),a(this,"supports",(function(e){return Ne.mime.call(r,e)})),this.timers={},this.ready=!1,this.loading=!1,this.failed=!1,this.touch=Ne.touch,this.media=n,Q(this.media)&&(this.media=document.querySelectorAll(this.media)),(window.jQuery&&this.media instanceof jQuery||G(this.media)||J(this.media))&&(this.media=this.media[0]),this.config=ue({},lt,e.defaults,i||{},function(){try{return JSON.parse(r.media.getAttribute("data-plyr-config"))}catch(e){return{}}}()),this.elements={container:null,fullscreen:null,captions:null,buttons:{},display:{},progress:{},inputs:{},settings:{popup:null,menu:null,panels:{},buttons:{}}},this.captions={active:null,currentTrack:-1,meta:new WeakMap},this.fullscreen={active:!1},this.options={speed:[],quality:[]},this.debug=new ft(this.config.debug),this.debug.log("Config",this.config),this.debug.log("Support",Ne),!z(this.media)&&Z(this.media))if(this.media.plyr)this.debug.warn("Target already setup");else if(this.config.enabled)if(Ne.check().api){var o=this.media.cloneNode(!0);o.autoplay=!1,this.elements.original=o;var s=this.media.tagName.toLowerCase(),l=null,c=null;switch(s){case"div":if(l=this.media.querySelector("iframe"),Z(l)){if(c=rt(l.getAttribute("src")),this.provider=function(e){return/^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(e)?dt.youtube:/^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(e)?dt.vimeo:null}(c.toString()),this.elements.container=this.media,this.media=l,this.elements.container.className="",c.search.length){var u=["1","true"];u.includes(c.searchParams.get("autoplay"))&&(this.config.autoplay=!0),u.includes(c.searchParams.get("loop"))&&(this.config.loop.active=!0),this.isYouTube?(this.config.playsinline=u.includes(c.searchParams.get("playsinline")),this.config.youtube.hl=c.searchParams.get("hl")):this.config.playsinline=!0}}else this.provider=this.media.getAttribute(this.config.attributes.embed.provider),this.media.removeAttribute(this.config.attributes.embed.provider);if(re(this.provider)||!Object.values(dt).includes(this.provider))return void this.debug.error("Setup failed: Invalid provider");this.type=mt;break;case"video":case"audio":this.type=s,this.provider=dt.html5,this.media.hasAttribute("crossorigin")&&(this.config.crossorigin=!0),this.media.hasAttribute("autoplay")&&(this.config.autoplay=!0),(this.media.hasAttribute("playsinline")||this.media.hasAttribute("webkit-playsinline"))&&(this.config.playsinline=!0),this.media.hasAttribute("muted")&&(this.config.muted=!0),this.media.hasAttribute("loop")&&(this.config.loop.active=!0);break;default:return void this.debug.error("Setup failed: unsupported type")}this.supported=Ne.check(this.type,this.provider,this.config.playsinline),this.supported.api?(this.eventListeners=[],this.listeners=new vt(this),this.storage=new Je(this),this.media.plyr=this,Z(this.elements.container)||(this.elements.container=me("div",{tabindex:0}),de(this.media,this.elements.container)),bt.migrateStyles.call(this),bt.addStyleHook.call(this),Et.setup.call(this),this.config.debug&&Ie.call(this,this.elements.container,this.config.events.join(" "),(function(e){r.debug.log("event: ".concat(e.type))})),this.fullscreen=new gt(this),(this.isHTML5||this.isEmbed&&!this.supported.ui)&&bt.build.call(this),this.listeners.container(),this.listeners.global(),this.config.ads.enabled&&(this.ads=new Nt(this)),this.isHTML5&&this.config.autoplay&&this.once("canplay",(function(){return qe(r.play())})),this.lastSeekTime=0,this.config.previewThumbnails.enabled&&(this.previewThumbnails=new xt(this))):this.debug.error("Setup failed: no support")}else this.debug.error("Setup failed: no support");else this.debug.error("Setup failed: disabled by config");else this.debug.error("Setup failed: no suitable element passed")}return i(e,[{key:"toggleCaptions",value:function(e){st.toggle.call(this,e,!1)}},{key:"isHTML5",get:function(){return this.provider===dt.html5}},{key:"isEmbed",get:function(){return this.isYouTube||this.isVimeo}},{key:"isYouTube",get:function(){return this.provider===dt.youtube}},{key:"isVimeo",get:function(){return this.provider===dt.vimeo}},{key:"isVideo",get:function(){return this.type===mt}},{key:"isAudio",get:function(){return this.type===ht}},{key:"playing",get:function(){return Boolean(this.ready&&!this.paused&&!this.ended)}},{key:"paused",get:function(){return Boolean(this.media.paused)}},{key:"stopped",get:function(){return Boolean(this.paused&&0===this.currentTime)}},{key:"ended",get:function(){return Boolean(this.media.ended)}},{key:"currentTime",set:function(e){if(this.duration){var t=Y(e)&&e>0;this.media.currentTime=t?Math.min(e,this.duration):0,this.debug.log("Seeking to ".concat(this.currentTime," seconds"))}},get:function(){return Number(this.media.currentTime)}},{key:"buffered",get:function(){var e=this.media.buffered;return Y(e)?e:e&&e.length&&this.duration>0?e.end(0)/this.duration:0}},{key:"seeking",get:function(){return Boolean(this.media.seeking)}},{key:"duration",get:function(){var e=parseFloat(this.config.duration),t=(this.media||{}).duration,n=Y(t)&&t!==1/0?t:0;return e||n}},{key:"volume",set:function(e){var t=e;Q(t)&&(t=Number(t)),Y(t)||(t=this.storage.get("volume")),Y(t)||(t=this.config.volume),t>1&&(t=1),t<0&&(t=0),this.config.volume=t,this.media.volume=t,!re(e)&&this.muted&&t>0&&(this.muted=!1)},get:function(){return Number(this.media.volume)}},{key:"muted",set:function(e){var t=e;X(t)||(t=this.storage.get("muted")),X(t)||(t=this.config.muted),this.config.muted=t,this.media.muted=t},get:function(){return Boolean(this.media.muted)}},{key:"hasAudio",get:function(){return!this.isHTML5||(!!this.isAudio||(Boolean(this.media.mozHasAudio)||Boolean(this.media.webkitAudioDecodedByteCount)||Boolean(this.media.audioTracks&&this.media.audioTracks.length)))}},{key:"speed",set:function(e){var t=this,n=null;Y(e)&&(n=e),Y(n)||(n=this.storage.get("speed")),Y(n)||(n=this.config.speed.selected);var i=this.minimumSpeed,a=this.maximumSpeed;n=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:255;return Math.min(Math.max(e,t),n)}(n,i,a),this.config.speed.selected=n,setTimeout((function(){t.media.playbackRate=n}),0)},get:function(){return Number(this.media.playbackRate)}},{key:"minimumSpeed",get:function(){return this.isYouTube?Math.min.apply(Math,c(this.options.speed)):this.isVimeo?.5:.0625}},{key:"maximumSpeed",get:function(){return this.isYouTube?Math.max.apply(Math,c(this.options.speed)):this.isVimeo?2:16}},{key:"quality",set:function(e){var t=this.config.quality,n=this.options.quality;if(n.length){var i=[!re(e)&&Number(e),this.storage.get("quality"),t.selected,t.default].find(Y),a=!0;if(!n.includes(i)){var r=function(e,t){return J(e)&&e.length?e.reduce((function(e,n){return Math.abs(n-t)<Math.abs(e-t)?n:e})):null}(n,i);this.debug.warn("Unsupported quality option: ".concat(i,", using ").concat(r," instead")),i=r,a=!1}t.selected=i,this.media.quality=i,a&&this.storage.set({quality:i})}},get:function(){return this.media.quality}},{key:"loop",set:function(e){var t=X(e)?e:this.config.loop.active;this.config.loop.active=t,this.media.loop=t},get:function(){return Boolean(this.media.loop)}},{key:"source",set:function(e){It.change.call(this,e)},get:function(){return this.media.currentSrc}},{key:"download",get:function(){var e=this.config.urls.download;return ae(e)?e:this.source},set:function(e){ae(e)&&(this.config.urls.download=e,at.setDownloadUrl.call(this))}},{key:"poster",set:function(e){this.isVideo?bt.setPoster.call(this,e,!1).catch((function(){})):this.debug.warn("Poster can only be set for video")},get:function(){return this.isVideo?this.media.getAttribute("poster")||this.media.getAttribute("data-poster"):null}},{key:"ratio",get:function(){if(!this.isVideo)return null;var e=Fe(Re.call(this));return J(e)?e.join(":"):e},set:function(e){this.isVideo?Q(e)&&He(e)?(this.config.ratio=e,Ve.call(this)):this.debug.error("Invalid aspect ratio specified (".concat(e,")")):this.debug.warn("Aspect ratio can only be set for video")}},{key:"autoplay",set:function(e){var t=X(e)?e:this.config.autoplay;this.config.autoplay=t},get:function(){return Boolean(this.config.autoplay)}},{key:"currentTrack",set:function(e){st.set.call(this,e,!1)},get:function(){var e=this.captions,t=e.toggled,n=e.currentTrack;return t?n:-1}},{key:"language",set:function(e){st.setLanguage.call(this,e,!1)},get:function(){return(st.getCurrentTrack.call(this)||{}).language}},{key:"pip",set:function(e){if(Ne.pip){var t=X(e)?e:!this.pip;$(this.media.webkitSetPresentationMode)&&this.media.webkitSetPresentationMode(t?ct:ut),$(this.media.requestPictureInPicture)&&(!this.pip&&t?this.media.requestPictureInPicture():this.pip&&!t&&document.exitPictureInPicture())}},get:function(){return Ne.pip?re(this.media.webkitPresentationMode)?this.media===document.pictureInPictureElement:this.media.webkitPresentationMode===ct:null}}],[{key:"supported",value:function(e,t,n){return Ne.check(e,t,n)}},{key:"loadSprite",value:function(e,t){return Ze(e,t)}},{key:"setup",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=null;return Q(t)?i=Array.from(document.querySelectorAll(t)):G(t)?i=Array.from(t):J(t)&&(i=t.filter(Z)),re(i)?null:i.map((function(t){return new e(t,n)}))}}]),e}();return Ot.defaults=(Lt=lt,JSON.parse(JSON.stringify(Lt))),Ot}));
//# sourceMappingURL=plyr.min.js.map


/***/ }),

/***/ 277:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */

(function (name, definition) {
  if ( true && module.exports) module.exports = definition()
  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  else {}
})('$script', function () {
  var doc = document
    , head = doc.getElementsByTagName('head')[0]
    , s = 'string'
    , f = false
    , push = 'push'
    , readyState = 'readyState'
    , onreadystatechange = 'onreadystatechange'
    , list = {}
    , ids = {}
    , delay = {}
    , scripts = {}
    , scriptpath
    , urlArgs

  function every(ar, fn) {
    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1
  }
  function each(ar, fn) {
    every(ar, function (el) {
      fn(el)
      return 1
    })
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = 1
        done && done()
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
        }
      }
    }
    setTimeout(function () {
      each(paths, function loading(path, force) {
        if (path === null) return callback()
        
        if (!force && !/^https?:\/\//.test(path) && scriptpath) {
          path = (path.indexOf('.js') === -1) ? scriptpath + path + '.js' : scriptpath + path;
        }
        
        if (scripts[path]) {
          if (id) ids[id] = 1
          return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true) }, 0)
        }

        scripts[path] = 1
        if (id) ids[id] = 1
        create(path, callback)
      })
    }, 0)
    return $script
  }

  function create(path, fn) {
    var el = doc.createElement('script'), loaded
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
      el.onload = el[onreadystatechange] = null
      loaded = 1
      scripts[path] = 2
      fn()
    }
    el.async = 1
    el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
    head.insertBefore(el, head.lastChild)
  }

  $script.get = create

  $script.order = function (scripts, id, done) {
    (function callback(s) {
      s = scripts.shift()
      !scripts.length ? $script(s, id, done) : $script(s, callback)
    }())
  }

  $script.path = function (p) {
    scriptpath = p
  }
  $script.urlArgs = function (str) {
    urlArgs = str;
  }
  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps]
    var missing = [];
    !each(deps, function (dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function (dep) {return list[dep]}) ?
      ready() : !function (key) {
      delay[key] = delay[key] || []
      delay[key][push](ready)
      req && req(missing)
    }(deps.join('|'))
    return $script
  }

  $script.done = function (idOrDone) {
    $script([null], idOrDone)
  }

  return $script
});


/***/ }),

/***/ 842:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Unidragger v2.3.1
 * Draggable base class
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(704)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Unipointer ) {
      return factory( window, Unipointer );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Unipointer ) {

'use strict';

// -------------------------- Unidragger -------------------------- //

function Unidragger() {}

// inherit Unipointer & EvEmitter
var proto = Unidragger.prototype = Object.create( Unipointer.prototype );

// ----- bind start ----- //

proto.bindHandles = function() {
  this._bindHandles( true );
};

proto.unbindHandles = function() {
  this._bindHandles( false );
};

/**
 * Add or remove start event
 * @param {Boolean} isAdd
 */
proto._bindHandles = function( isAdd ) {
  // munge isAdd, default to true
  isAdd = isAdd === undefined ? true : isAdd;
  // bind each handle
  var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';
  var touchAction = isAdd ? this._touchActionValue : '';
  for ( var i=0; i < this.handles.length; i++ ) {
    var handle = this.handles[i];
    this._bindStartEvent( handle, isAdd );
    handle[ bindMethod ]( 'click', this );
    // touch-action: none to override browser touch gestures. metafizzy/flickity#540
    if ( window.PointerEvent ) {
      handle.style.touchAction = touchAction;
    }
  }
};

// prototype so it can be overwriteable by Flickity
proto._touchActionValue = 'none';

// ----- start event ----- //

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerDown = function( event, pointer ) {
  var isOkay = this.okayPointerDown( event );
  if ( !isOkay ) {
    return;
  }
  // track start event position
  // Safari 9 overrides pageX and pageY. These values needs to be copied. flickity#842
  this.pointerDownPointer = {
    pageX: pointer.pageX,
    pageY: pointer.pageY,
  };

  event.preventDefault();
  this.pointerDownBlur();
  // bind move and end events
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// nodes that have text fields
var cursorNodes = {
  TEXTAREA: true,
  INPUT: true,
  SELECT: true,
  OPTION: true,
};

// input types that do not have text fields
var clickTypes = {
  radio: true,
  checkbox: true,
  button: true,
  submit: true,
  image: true,
  file: true,
};

// dismiss inputs with text fields. flickity#403, flickity#404
proto.okayPointerDown = function( event ) {
  var isCursorNode = cursorNodes[ event.target.nodeName ];
  var isClickType = clickTypes[ event.target.type ];
  var isOkay = !isCursorNode || isClickType;
  if ( !isOkay ) {
    this._pointerReset();
  }
  return isOkay;
};

// kludge to blur previously focused input
proto.pointerDownBlur = function() {
  var focused = document.activeElement;
  // do not blur body for IE10, metafizzy/flickity#117
  var canBlur = focused && focused.blur && focused != document.body;
  if ( canBlur ) {
    focused.blur();
  }
};

// ----- move event ----- //

/**
 * drag move
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

// base pointer move logic
proto._dragPointerMove = function( event, pointer ) {
  var moveVector = {
    x: pointer.pageX - this.pointerDownPointer.pageX,
    y: pointer.pageY - this.pointerDownPointer.pageY
  };
  // start drag if pointer has moved far enough to start drag
  if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
    this._dragStart( event, pointer );
  }
  return moveVector;
};

// condition if pointer has moved far enough to start drag
proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
};

// ----- end event ----- //

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
  this._dragPointerUp( event, pointer );
};

proto._dragPointerUp = function( event, pointer ) {
  if ( this.isDragging ) {
    this._dragEnd( event, pointer );
  } else {
    // pointer didn't move enough for drag to start
    this._staticClick( event, pointer );
  }
};

// -------------------------- drag -------------------------- //

// dragStart
proto._dragStart = function( event, pointer ) {
  this.isDragging = true;
  // prevent clicks
  this.isPreventingClicks = true;
  this.dragStart( event, pointer );
};

proto.dragStart = function( event, pointer ) {
  this.emitEvent( 'dragStart', [ event, pointer ] );
};

// dragMove
proto._dragMove = function( event, pointer, moveVector ) {
  // do not drag if not dragging yet
  if ( !this.isDragging ) {
    return;
  }

  this.dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  event.preventDefault();
  this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
};

// dragEnd
proto._dragEnd = function( event, pointer ) {
  // set flags
  this.isDragging = false;
  // re-enable clicking async
  setTimeout( function() {
    delete this.isPreventingClicks;
  }.bind( this ) );

  this.dragEnd( event, pointer );
};

proto.dragEnd = function( event, pointer ) {
  this.emitEvent( 'dragEnd', [ event, pointer ] );
};

// ----- onclick ----- //

// handle all clicks and prevent clicks when dragging
proto.onclick = function( event ) {
  if ( this.isPreventingClicks ) {
    event.preventDefault();
  }
};

// ----- staticClick ----- //

// triggered after pointer down & up with no/tiny movement
proto._staticClick = function( event, pointer ) {
  // ignore emulated mouse up clicks
  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
    return;
  }

  this.staticClick( event, pointer );

  // set flag for emulated clicks 300ms after touchend
  if ( event.type != 'mouseup' ) {
    this.isIgnoringMouseUp = true;
    // reset flag after 300ms
    setTimeout( function() {
      delete this.isIgnoringMouseUp;
    }.bind( this ), 400 );
  }
};

proto.staticClick = function( event, pointer ) {
  this.emitEvent( 'staticClick', [ event, pointer ] );
};

// ----- utils ----- //

Unidragger.getPointerPoint = Unipointer.getPointerPoint;

// -----  ----- //

return Unidragger;

}));


/***/ }),

/***/ 704:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Unipointer v2.3.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*global define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(158)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( EvEmitter ) {
      return factory( window, EvEmitter );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, EvEmitter ) {

'use strict';

function noop() {}

function Unipointer() {}

// inherit EvEmitter
var proto = Unipointer.prototype = Object.create( EvEmitter.prototype );

proto.bindStartEvent = function( elem ) {
  this._bindStartEvent( elem, true );
};

proto.unbindStartEvent = function( elem ) {
  this._bindStartEvent( elem, false );
};

/**
 * Add or remove start event
 * @param {Boolean} isAdd - remove if falsey
 */
proto._bindStartEvent = function( elem, isAdd ) {
  // munge isAdd, default to true
  isAdd = isAdd === undefined ? true : isAdd;
  var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';

  // default to mouse events
  var startEvent = 'mousedown';
  if ( window.PointerEvent ) {
    // Pointer Events
    startEvent = 'pointerdown';
  } else if ( 'ontouchstart' in window ) {
    // Touch Events. iOS Safari
    startEvent = 'touchstart';
  }
  elem[ bindMethod ]( startEvent, this );
};

// trigger handler methods for events
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// returns the touch that we're keeping track of
proto.getTouch = function( touches ) {
  for ( var i=0; i < touches.length; i++ ) {
    var touch = touches[i];
    if ( touch.identifier == this.pointerIdentifier ) {
      return touch;
    }
  }
};

// ----- start event ----- //

proto.onmousedown = function( event ) {
  // dismiss clicks from right or middle buttons
  var button = event.button;
  if ( button && ( button !== 0 && button !== 1 ) ) {
    return;
  }
  this._pointerDown( event, event );
};

proto.ontouchstart = function( event ) {
  this._pointerDown( event, event.changedTouches[0] );
};

proto.onpointerdown = function( event ) {
  this._pointerDown( event, event );
};

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto._pointerDown = function( event, pointer ) {
  // dismiss right click and other pointers
  // button = 0 is okay, 1-4 not
  if ( event.button || this.isPointerDown ) {
    return;
  }

  this.isPointerDown = true;
  // save pointer identifier to match up touch events
  this.pointerIdentifier = pointer.pointerId !== undefined ?
    // pointerId for pointer events, touch.indentifier for touch events
    pointer.pointerId : pointer.identifier;

  this.pointerDown( event, pointer );
};

proto.pointerDown = function( event, pointer ) {
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// hash of events to be bound after start event
var postStartEvents = {
  mousedown: [ 'mousemove', 'mouseup' ],
  touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
  pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
};

proto._bindPostStartEvents = function( event ) {
  if ( !event ) {
    return;
  }
  // get proper events to match start event
  var events = postStartEvents[ event.type ];
  // bind events to node
  events.forEach( function( eventName ) {
    window.addEventListener( eventName, this );
  }, this );
  // save these arguments
  this._boundPointerEvents = events;
};

proto._unbindPostStartEvents = function() {
  // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
  if ( !this._boundPointerEvents ) {
    return;
  }
  this._boundPointerEvents.forEach( function( eventName ) {
    window.removeEventListener( eventName, this );
  }, this );

  delete this._boundPointerEvents;
};

// ----- move event ----- //

proto.onmousemove = function( event ) {
  this._pointerMove( event, event );
};

proto.onpointermove = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerMove( event, event );
  }
};

proto.ontouchmove = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerMove( event, touch );
  }
};

/**
 * pointer move
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerMove = function( event, pointer ) {
  this.pointerMove( event, pointer );
};

// public
proto.pointerMove = function( event, pointer ) {
  this.emitEvent( 'pointerMove', [ event, pointer ] );
};

// ----- end event ----- //


proto.onmouseup = function( event ) {
  this._pointerUp( event, event );
};

proto.onpointerup = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerUp( event, event );
  }
};

proto.ontouchend = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerUp( event, touch );
  }
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerUp = function( event, pointer ) {
  this._pointerDone();
  this.pointerUp( event, pointer );
};

// public
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
};

// ----- pointer done ----- //

// triggered on pointer up & pointer cancel
proto._pointerDone = function() {
  this._pointerReset();
  this._unbindPostStartEvents();
  this.pointerDone();
};

proto._pointerReset = function() {
  // reset properties
  this.isPointerDown = false;
  delete this.pointerIdentifier;
};

proto.pointerDone = noop;

// ----- pointer cancel ----- //

proto.onpointercancel = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerCancel( event, event );
  }
};

proto.ontouchcancel = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerCancel( event, touch );
  }
};

/**
 * pointer cancel
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerCancel = function( event, pointer ) {
  this._pointerDone();
  this.pointerCancel( event, pointer );
};

// public
proto.pointerCancel = function( event, pointer ) {
  this.emitEvent( 'pointerCancel', [ event, pointer ] );
};

// -----  ----- //

// utility function for getting x/y coords from event
Unipointer.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX,
    y: pointer.pageY
  };
};

// -----  ----- //

return Unipointer;

}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
!function() {
"use strict";

// EXTERNAL MODULE: ./source/scripts/helpers/globals.js
var globals = __webpack_require__(43);
;// CONCATENATED MODULE: ./node_modules/@pixelunion/rimg/dist/index.es.js
/*!
 * @pixelunion/rimg v2.2.0
 * (c) 2019 Pixel Union
 */
/**
 * The default template render function. Turns a template string into an image
 * URL.
 *
 * @param {String} template
 * @param {Size} size
 * @returns {String}
 */
function defaultTemplateRender(template, size) {
  return template.replace('{size}', size.width + 'x' + size.height);
}

/**
 * @type Settings
 */
var defaults = {
  scale: 1,
  template: false,
  templateRender: defaultTemplateRender,
  max: { width: Infinity, height: Infinity },
  round: 32,
  placeholder: false,
  crop: null
};

/**
 * Get a data attribute value from an element, with a default fallback and
 * sanitization step.
 *
 * @param {Element} el
 *
 * @param {String} name
 *        The data attribute name.
 *
 * @param {Object} options
 *        An object holding fallback values if the data attribute does not
 *        exist. If this object doesn't have the property, we further fallback
 *        to our defaults.
 *
 * @param {Function} [sanitize]
 *        A function to sanitize the data attribute value with.
 *
 * @returns {String|*}
 */
function getData(el, name, options, sanitize) {
  var attr = 'data-rimg-' + name;
  if (!el.hasAttribute(attr)) return options[name] || defaults[name];

  var value = el.getAttribute(attr);

  return sanitize ? sanitize(value) : value;
}

/**
 * Sanitize data attributes that represent a size (in the form of `10x10`).
 *
 * @param {String} value
 * @returns {Object} An object with `width` and `height` properties.
 */
function parseSize(value) {
  value = value.split('x');
  return { width: parseInt(value[0], 10), height: parseInt(value[1], 10) };
}

/**
 * Sanitize crop values to ensure they are valid, or null
 *
 * @param {String} value
 * @returns {Object} Shopify crop parameter ('top', 'center', 'bottom', 'left', 'right') or null, if an unsupported value is found
 */
function processCropValue(value) {
  switch (value) {
    case 'top':
    case 'center':
    case 'bottom':
    case 'left':
    case 'right':
      return value;
    default:
      return null;
  }
}

/**
 * Loads information about an element.
 *
 * Options can be set on the element itself using data attributes, or through
 * the `options` parameter. Data attributes take priority.
 *
 * @param {HTMLElement} el
 * @param {Settings} options
 * @returns {Item}
 */
function parseItem(el) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var isImage = el.hasAttribute('data-rimg-template');

  /**
   * @typedef {Settings} Item
   */
  return {
    el: el,

    // Type of element
    isImage: isImage,
    isBackgroundImage: isImage && el.tagName !== 'IMG',

    // Image scale
    scale: getData(el, 'scale', options),

    // Device density
    density: window.devicePixelRatio || 1,

    // Image template URL
    template: getData(el, 'template', options),
    templateRender: options.templateRender || defaults.templateRender,

    // Maximum image dimensions
    max: getData(el, 'max', options, parseSize),

    // Round image dimensions to the nearest multiple
    round: getData(el, 'round', options),

    // Placeholder image dimensions
    placeholder: getData(el, 'placeholder', options, parseSize),

    // Crop value; null if image is uncropped, otherwise equal to the Shopify crop parameter ('center', 'top', etc.)
    crop: getData(el, 'crop', options, processCropValue)
  };
}

/**
 * Round to the nearest multiple.
 *
 * This is so we don't tax the image server too much.
 *
 * @param {Number} size The size, in pixels.
 * @param {Number} [multiple] The multiple to round to the nearest.
 * @param {Number} [maxLimit] Maximum allowed value - value to return if rounded multiple is above this limit
 * @returns {Number}
 */
function roundSize(size) {
  var multiple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 32;
  var maxLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;

  return size === 0 ? multiple : Math.min(Math.ceil(size / multiple) * multiple, maxLimit);
}

/**
 * Get the size of an element.
 *
 * If it is too small, it's parent element is checked, and so on. This helps
 * avoid the situation where an element doesn't have a size yet or is positioned
 * out of the layout.
 *
 * @param {HTMLElement} el
 * @return {Object} size
 * @return {Number} size.width The width, in pixels.
 * @return {Number} size.height The height, in pixels.
 */
function getElementSize(el) {
  var size = { width: 0, height: 0 };

  while (el) {
    size.width = el.offsetWidth;
    size.height = el.offsetHeight;
    if (size.width > 20 && size.height > 20) break;
    el = el.parentNode;
  }

  return size;
}

/**
 * Trigger a custom event.
 *
 * Note: this approach is deprecated, but still required to support older
 * browsers such as IE 10.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
 *
 * @param {HTMLElement} el
 *        The element to trigger the event on.
 *
 * @param {String} name
 *        The event name.
 *
 * @returns {Boolean}
 *          True if the event was canceled.
 */
function trigger(el, name) {
  var event = document.createEvent('Event');
  event.initEvent(name, true, true);
  return !el.dispatchEvent(event);
}

/**
 * Return the maximum supported density of the image, given the container.
 *
 * @param {Item} item
 * @param {Size} size
 */
function supportedDensity(item, size) {
  return Math.min(Math.min(Math.max(item.max.width / size.width, 1), item.density), Math.min(Math.max(item.max.height / size.height, 1), item.density)).toFixed(2);
}

/**
 * Set the image URL on the element. Supports background images and `srcset`.
 *
 * @param {Item} item
 * @param {Size} size
 * @param {Boolean} isPlaceholder
 */
function setImage(item, size, isPlaceholder, onLoad) {
  var render = item.templateRender;
  var density = isPlaceholder ? 1 : supportedDensity(item, size);
  var round = isPlaceholder ? 1 : item.round;

  // Calculate the final display size, taking into account the image's
  // maximum dimensions.
  var targetWidth = size.width * density;
  var targetHeight = size.height * density;

  var displaySize = void 0;

  if (item.crop) {
    displaySize = {
      width: roundSize(targetWidth, round, item.max.width),
      height: roundSize(targetHeight, round, item.max.height)
    };
  } else {
    // Shopify serves images clamped by the requested dimensions (fitted to the smallest dimension).
    // To get the desired and expected pixel density we need to request cover dimensions (fitted to largest dimension).
    // This isn't a problem with cropped images which are served at the exact dimension requested.
    var containerAspectRatio = size.width / size.height;
    var imageAspectRatio = item.max.width / item.max.height;

    if (containerAspectRatio > imageAspectRatio) {
      // fit width
      displaySize = {
        width: roundSize(targetWidth, round, item.max.width),
        height: roundSize(targetWidth / imageAspectRatio, round, item.max.height)
      };
    } else {
      // fit height
      displaySize = {
        width: roundSize(targetHeight * imageAspectRatio, round, item.max.width),
        height: roundSize(targetHeight, round, item.max.height)
      };
    }
  }

  var url = render(item.template, displaySize);

  // On load callback
  var image = new Image();
  image.onload = onLoad;
  image.src = url;

  // Set image
  if (item.isBackgroundImage) {
    item.el.style.backgroundImage = 'url(\'' + url + '\')';
  } else {
    item.el.setAttribute('srcset', url + ' ' + density + 'x');
  }
}

/**
 * Load the image, set loaded status, and trigger the load event.
 *
 * @fires rimg:load
 * @fires rimg:error
 * @param {Item} item
 * @param {Size} size
 */
function loadFullImage(item, size) {
  var el = item.el;

  setImage(item, size, false, function (event) {
    if (event.type === 'load') {
      el.setAttribute('data-rimg', 'loaded');
    } else {
      el.setAttribute('data-rimg', 'error');
      trigger(el, 'rimg:error');
    }

    trigger(el, 'rimg:load');
  });
}

/**
 * Load in a responsive image.
 *
 * Sets the image's `srcset` attribute to the final image URLs, calculated based
 * on the actual size the image is being shown at.
 *
 * @fires rimg:loading
 *        The image URLs have been set and we are waiting for them to load.
 *
 * @fires rimg:loaded
 *        The final image has loaded.
 *
 * @fires rimg:error
 *        The final image failed loading.
 *
 * @param {Item} item
 */
function loadImage(item) {
  var el = item.el;

  // Already loaded?
  var status = el.getAttribute('data-rimg');
  if (status === 'loading' || status === 'loaded') return;

  // Is the SVG loaded?
  // In Firefox, el.complete always returns true so we also check el.naturalWidth,
  // which equals 0 until the image loads
  if (el.naturalWidth == 0 && el.complete && !item.isBackgroundImage) {
    // Wait for the load event, then call load image
    el.addEventListener('load', function cb() {
      el.removeEventListener('load', cb);
      loadImage(item);
    });

    return;
  }

  // Trigger loading event, and stop if cancelled
  if (trigger(el, 'rimg:loading')) return;

  // Mark as loading
  el.setAttribute('data-rimg', 'loading');

  // Get element size. This is used as the ideal display size.
  var size = getElementSize(item.el);

  size.width *= item.scale;
  size.height *= item.scale;

  if (item.placeholder) {
    // Load a placeholder image first, followed by the full image. Force the
    // element to keep its dimensions while it loads. If the image is smaller
    // than the element size, use the image's size. Density is taken into account
    // for HiDPI devices to avoid blurry images.
    if (!item.isBackgroundImage) {
      el.setAttribute('width', Math.min(Math.floor(item.max.width / item.density), size.width));
      el.setAttribute('height', Math.min(Math.floor(item.max.height / item.density), size.height));
    }

    setImage(item, item.placeholder, true, function () {
      return loadFullImage(item, size);
    });
  } else {
    loadFullImage(item, size);
  }
}

/**
 * Prepare an element to be displayed on the screen.
 *
 * Images have special logic applied to them to swap out the different sources.
 *
 * @fires rimg:enter
 *        The element is entering the viewport.
 *
 * @param {HTMLElement} el
 * @param {Settings} options
 */
function load(el, options) {
  if (!el) return;
  trigger(el, 'rimg:enter');

  var item = parseItem(el, options);

  if (item.isImage) {
    if (!item.isBackgroundImage) {
      el.setAttribute('data-rimg-template-svg', el.getAttribute('srcset'));
    }

    loadImage(item);
  }
}

/**
 * Reset an element's state so that its image can be recalculated.
 *
 * @fires rimg:update
 *        The element is being updated.
 *
 * @param {HTMLElement} el
 * @param {Settings} options
 */
function update(el, options) {
  if (!el) return;
  trigger(el, 'rimg:update');

  var item = parseItem(el, options);

  if (item.isImage) {
    if (!item.isBackgroundImage) {
      el.setAttribute('data-rimg', 'lazy');
      el.setAttribute('srcset', el.getAttribute('data-rimg-template-svg'));
    }

    loadImage(item);
  }
}

/**
 * Returns true if the element is within the viewport.
 * @param {HTMLElement} el
 * @returns {Boolean}
 */
function inViewport(el) {
  if (!el.offsetWidth || !el.offsetHeight || !el.getClientRects().length) {
    return false;
  }

  var root = document.documentElement;
  var width = Math.min(root.clientWidth, window.innerWidth);
  var height = Math.min(root.clientHeight, window.innerHeight);
  var rect = el.getBoundingClientRect();

  return rect.bottom >= 0 && rect.right >= 0 && rect.top <= height && rect.left <= width;
}

/**
 * @typedef {Object} Size
 * @property {Number} width
 * @property {Number} height
 */

/**
 * A function to turn a template string into a URL.
 *
 * @callback TemplateRenderer
 * @param {String} template
 * @param {Size} size
 * @returns {String}
 */

/**
 * @typedef {Object} Settings
 *
 * @property {String} [template]
 *           A template string used to generate URLs for an image. This allows us to
 *           dynamically load images with sizes to match the container's size.
 *
 * @property {TemplateRenderer} [templateRender]
 *           A function to turn a template string into a URL.
 *
 * @property {Size} [max]
 *           The maximum available size for the image. This ensures we don't
 *           try to load an image larger than is possible.
 * 
 * @property {Number} [scale]
 *           A number to scale the final image dimensions by. 
 *           Only applies to lazy-loaded images. Defaults to 1.
 *
 * @property {Number} [round]
 *           Round image dimensions to the nearest multiple. This is intended to
 *           tax the image server less by lowering the number of possible image
 *           sizes requested.
 *
 * @property {Size} [placeholder]
 *           The size of the lo-fi image to load before the full image.
 * 
 * @property {String} [crop]
 *           Crop value; null if image is uncropped, otherwise equal 
 *           to the Shopify crop parameter ('center', 'top', etc.).
 */

/**
 * Initialize the responsive image handler.
 *
 * @param {String|HTMLElement|NodeList} selector
 *        The CSS selector, element, or elements to track for lazy-loading.
 *
 * @param {Settings} options
 *
 * @returns {PublicApi}
 */
function rimg() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg="lazy"]';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Intersections
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        io.unobserve(entry.target);
        load(entry.target, options);
      }
    });
  }, {
    // Watch the viewport, with 20% vertical margins
    rootMargin: '20% 0px'
  });

  /**
   * @typedef {Object} PublicApi
   */
  var api = {
    /**
     * Track a new selector, element, or nodelist for lazy-loading.
     * @type Function
     * @param {String|HTMLElement|NodeList} selector
     */
    track: function track() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg="lazy"]';

      var els = querySelector(selector);

      for (var i = 0; i < els.length; i++) {
        // If an element is already in the viewport, load it right away. This
        // fixes a race-condition with dynamically added elements.
        if (inViewport(els[i])) {
          load(els[i], options);
        } else {
          io.observe(els[i]);
        }
      }
    },


    /**
     * Update element(s) that have already been loaded to force their images
     * to be recalculated.
     * @type Function
     * @param {String|HTMLElement|NodeList} selector
     */
    update: function update$$1() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg="loaded"]';

      var els = querySelector(selector);
      for (var i = 0; i < els.length; i++) {
        update(els[i], options);
      }
    },


    /**
     * Stop tracking element(s) for lazy-loading.
     * @type Function
     * @param {String|HTMLElement|NodeList} selector
     */
    untrack: function untrack() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg]';

      var els = querySelector(selector);
      for (var i = 0; i < els.length; i++) {
        io.unobserve(els[i]);
      }
    },


    /**
     * Manually load images.
     * @type Function
     * @param {String|HTMLElement|NodeList} selector
     */
    load: function load$$1() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg]';

      var els = querySelector(selector);
      for (var i = 0; i < els.length; i++) {
        load(els[i], options);
      }
    },


    /**
     * Unload all event handlers and observers.
     * @type Function
     */
    unload: function unload() {
      io.disconnect();
    }
  };

  // Add initial elements
  api.track(selector);

  return api;
}

/**
 * Finds a group of elements on the page.
 *
 * @param {String|HTMLElement|NodeList} selector
 * @returns {Object} An array-like object.
 */
function querySelector(selector) {
  if (typeof selector === 'string') {
    return document.querySelectorAll(selector);
  }

  if (selector instanceof HTMLElement) {
    return [selector];
  }

  if (selector instanceof NodeList) {
    return selector;
  }

  return [];
}

/* harmony default export */ var index_es = (rimg);

;// CONCATENATED MODULE: ./node_modules/@pixelunion/rimg-shopify/dist/index.es.js
/*!
 * @pixelunion/rimg-shopify v2.5.2
 * (c) 2020 Pixel Union
 */


/**
 * Polyfill for Element.matches().
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;

    while (--i >= 0 && matches.item(i) !== this) {}

    return i > -1;
  };
}

var state = {
  init: init,
  watch: watch,
  unwatch: unwatch,
  load: index_es_load
};

function init() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg="lazy"]';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  state.selector = selector;
  state.instance = index_es(selector, options);
  state.loadedWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); // Listen for Shopify theme editor events

  document.addEventListener('shopify:section:load', function (event) {
    return watch(event.target);
  });
  window.addEventListener('resize', function () {
    return _update();
  });
  document.addEventListener('shopify:section:unload', function (event) {
    return unwatch(event.target);
  }); // Listen for custom events to allow themes to hook into rimg

  document.addEventListener('theme:rimg:watch', function (event) {
    return watch(event.target);
  });
  document.addEventListener('theme:rimg:unwatch', function (event) {
    return unwatch(event.target);
  }); // Support custom events triggered through jQuery
  // See: https://github.com/jquery/jquery/issues/3347

  if (window.jQuery) {
    jQuery(document).on({
      'theme:rimg:watch': function themeRimgWatch(event) {
        return watch(event.target);
      },
      'theme:rimg:unwatch': function themeRimgUnwatch(event) {
        return unwatch(event.target);
      }
    });
  }
}
/**
 * Track an element, and its children.
 *
 * @param {HTMLElement} el
 */


function watch(el) {
  // Track element
  if (typeof el.matches === 'function' && el.matches(state.selector)) {
    state.instance.track(el);
  } // Track element's children


  state.instance.track(el.querySelectorAll(state.selector));
}
/**
 * Untrack an element, and its children
 *
 * @param {HTMLElement} el
 * @private
 */


function unwatch(el) {
  // Untrack element's children
  state.instance.untrack(el.querySelectorAll(state.selector)); // Untrack element

  if (typeof el.matches === 'function' && el.matches(state.selector)) {
    state.instance.untrack(el);
  }
}
/**
 * Manually load an image
 *
 * @param {HTMLElement} el
 */


function index_es_load(el) {
  // Load element
  if (typeof el.matches === 'function' && el.matches(state.selector)) {
    state.instance.load(el);
  } // Load element's children


  state.instance.load(el.querySelectorAll(state.selector));
}
/**
 * Update an element, and its children.
 *
 * @param {HTMLElement} el
 */


function _update() {
  var currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); // Return if we're not 2x smaller, or larger than the existing loading size

  if (currentWidth / state.loadedWidth > 0.5 && currentWidth / state.loadedWidth < 2) {
    return;
  }

  state.loadedWidth = currentWidth;
  state.instance.update();
}

/* harmony default export */ var dist_index_es = (state);

;// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-sections-manager/dist/shopify-sections-manager.es.js

/*!
 * @pixelunion/shopify-sections-manager v1.0.0
 * (c) 2021 Pixel Union
 */

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function triggerInstanceEvent(instance, eventName) {
  if (instance && instance[eventName]) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    instance[eventName].apply(instance, args);
  }
}

function loadData(el) {
  var dataEl = el.querySelector('[data-section-data]');
  if (!dataEl) return {};

  // Load data from attribute, or innerHTML
  var data = dataEl.getAttribute('data-section-data') || dataEl.innerHTML;

  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn('Sections: invalid section data found. ' + error.message);
    return {};
  }
}

var ShopifySectionsManager = function () {
  function ShopifySectionsManager() {
    classCallCheck(this, ShopifySectionsManager);

    this.handlers = {};
    this.instances = {};
    this._onSectionEvent = this._onSectionEvent.bind(this);

    document.addEventListener('shopify:section:load', this._onSectionEvent);
    document.addEventListener('shopify:section:unload', this._onSectionEvent);
    document.addEventListener('shopify:section:select', this._onSectionEvent);
    document.addEventListener('shopify:section:deselect', this._onSectionEvent);
    document.addEventListener('shopify:section:reorder', this._onSectionEvent);
    document.addEventListener('shopify:block:select', this._onSectionEvent);
    document.addEventListener('shopify:block:deselect', this._onSectionEvent);
  }

  /**
   * Stop listening for section events, and unbind all handlers.
   */


  createClass(ShopifySectionsManager, [{
    key: 'unbind',
    value: function unbind() {
      document.removeEventListener('shopify:section:load', this._onSectionEvent);
      document.removeEventListener('shopify:section:unload', this._onSectionEvent);
      document.removeEventListener('shopify:section:select', this._onSectionEvent);
      document.removeEventListener('shopify:section:deselect', this._onSectionEvent);
      document.removeEventListener('shopify:section:reorder', this._onSectionEvent);
      document.removeEventListener('shopify:block:select', this._onSectionEvent);
      document.removeEventListener('shopify:block:deselect', this._onSectionEvent);

      // Unload all instances
      for (var i = 0; i < this.instances.length; i++) {
        triggerInstanceEvent(this.instances[i], 'onSectionUnload');
      }

      this.handlers = {};
      this.instances = {};
    }

    /**
     * Register a section handler.
     *
     * @param {string} type
     *        The section type to handle. The handler will be called for all
     *        sections with this type.
     *
     * @param {function} handler
     *        The handler function is passed information about a specific section
     *        instance. The handler is expected to return an object that will be
     *        associated with the section instance.
     *
     *        Section handlers are passed an object with the following parameters:
     *          {string} id
     *          An ID that maps to a specific section instance. Typically the
     *          section's filename for static sections, or a generated ID for
     *          dynamic sections.
     *
     *          {string} type
     *          The section type, as supplied when registered.
     *
     *          {Element} el
     *          The root DOM element for the section instance.
     *
     *          {Object} data
     *          Data loaded from the section script element. Defaults to an
     *          empty object.
     *
     *          {Function} postMessage
     *          A function that can be called to pass messages between sections.
     *          The function should be called with a message "name", and
     *          optionally some data.
     */

  }, {
    key: 'register',
    value: function register(type, handler) {
      if (this.handlers[type]) {
        console.warn('Sections: section handler already exists of type \'' + type + '\'.');
      }

      // Store the section handler
      this.handlers[type] = handler;

      // Init sections for this type
      this._initSections(type);
    }

    /**
     * Initialize sections already on the page.
     */

  }, {
    key: '_initSections',
    value: function _initSections(type) {
      // Fetch all existing sections of our type on the page
      var dataEls = document.querySelectorAll('[data-section-type="' + type + '"]');
      if (!dataEls) return;

      // Create an instance for each section
      for (var i = 0; i < dataEls.length; i++) {
        var dataEl = dataEls[i];
        var el = dataEl.parentNode;

        // Get instance ID
        var idEl = el.querySelector('[data-section-id]');

        if (!idEl) {
          console.warn('Sections: unable to find section id for \'' + type + '\'.', el);
          return;
        }

        var sectionId = idEl.getAttribute('data-section-id');
        if (!sectionId) {
          console.warn('Sections: unable to find section id for \'' + type + '\'.', el);
          return;
        }

        this._createInstance(sectionId, el);
      }
    }
  }, {
    key: '_onSectionEvent',
    value: function _onSectionEvent(event) {
      var el = event.target;
      var sectionId = event.detail.sectionId;
      var blockId = event.detail.blockId;
      var instance = this.instances[sectionId];

      switch (event.type) {
        case 'shopify:section:load':
          this._createInstance(sectionId, el);
          break;

        case 'shopify:section:unload':
          triggerInstanceEvent(instance, 'onSectionUnload', { el: el, id: sectionId });
          delete this.instances[sectionId];
          break;

        case 'shopify:section:select':
          triggerInstanceEvent(instance, 'onSectionSelect', { el: el, id: sectionId });
          break;

        case 'shopify:section:deselect':
          triggerInstanceEvent(instance, 'onSectionDeselect', { el: el, id: sectionId });
          break;

        case 'shopify:section:reorder':
          triggerInstanceEvent(instance, 'onSectionReorder', { el: el, id: sectionId });
          break;

        case 'shopify:block:select':
          triggerInstanceEvent(instance, 'onSectionBlockSelect', { el: el, id: blockId });
          break;

        case 'shopify:block:deselect':
          triggerInstanceEvent(instance, 'onSectionBlockDeselect', { el: el, id: blockId });
          break;

        default:
          break;
      }
    }
  }, {
    key: '_postMessage',
    value: function _postMessage(name, data) {
      var _this = this;

      Object.keys(this.instances).forEach(function (id) {
        triggerInstanceEvent(_this.instances[id], 'onSectionMessage', name, data);
      });
    }
  }, {
    key: '_createInstance',
    value: function _createInstance(id, el) {
      var typeEl = el.querySelector('[data-section-type]');
      if (!typeEl) return;

      var type = typeEl.getAttribute('data-section-type');
      if (!type) return;

      var handler = this.handlers[type];
      if (!handler) {
        console.warn('Sections: unable to find section handler for type \'' + type + '\'.');
        return;
      }

      var data = loadData(el);
      var postMessage = this._postMessage.bind(this);

      this.instances[id] = handler({ id: id, type: type, el: el, data: data, postMessage: postMessage });
    }
  }]);
  return ShopifySectionsManager;
}();

/* harmony default export */ var shopify_sections_manager_es = (ShopifySectionsManager);

;// CONCATENATED MODULE: ./node_modules/@pixelunion/pxs-video/dist/index.es.js

/*!
 * @pixelunion/pxs-video v1.0.6
 * (c) 2021 Pixel Union
 */

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var script = createCommonjsModule(function (module) {
/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */

(function (name, definition) {
  if ( module.exports) module.exports = definition();
  else this[name] = definition();
})('$script', function () {
  var doc = document
    , head = doc.getElementsByTagName('head')[0]
    , f = false
    , push = 'push'
    , readyState = 'readyState'
    , onreadystatechange = 'onreadystatechange'
    , list = {}
    , delay = {}
    , scripts = {}
    , scriptpath
    , urlArgs;

  function every(ar, fn) {
    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1
  }
  function each(ar, fn) {
    every(ar, function (el) {
      fn(el);
      return 1
    });
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths];
    var idOrDoneIsDone = idOrDone && idOrDone.call
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length;
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = 1;
        done && done();
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = []);
        }
      }
    }
    setTimeout(function () {
      each(paths, function loading(path, force) {
        if (path === null) return callback()
        
        if (!force && !/^https?:\/\//.test(path) && scriptpath) {
          path = (path.indexOf('.js') === -1) ? scriptpath + path + '.js' : scriptpath + path;
        }
        
        if (scripts[path]) {
          return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true); }, 0)
        }

        scripts[path] = 1;
        create(path, callback);
      });
    }, 0);
    return $script
  }

  function create(path, fn) {
    var el = doc.createElement('script'), loaded;
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
      el.onload = el[onreadystatechange] = null;
      loaded = 1;
      scripts[path] = 2;
      fn();
    };
    el.async = 1;
    el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
    head.insertBefore(el, head.lastChild);
  }

  $script.get = create;

  $script.order = function (scripts, id, done) {
    (function callback(s) {
      s = scripts.shift();
      !scripts.length ? $script(s, id, done) : $script(s, callback);
    }());
  };

  $script.path = function (p) {
    scriptpath = p;
  };
  $script.urlArgs = function (str) {
    urlArgs = str;
  };
  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps];
    var missing = [];
    !each(deps, function (dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function (dep) {return list[dep]}) ?
      ready() : !function (key) {
      delay[key] = delay[key] || [];
      delay[key][push](ready);
      req && req(missing);
    }(deps.join('|'));
    return $script
  };

  $script.done = function (idOrDone) {
    $script([null], idOrDone);
  };

  return $script
});
});

var api = 'https://www.youtube.com/iframe_api';
var apiLoadedCallbacks = [];
var apiLoaded = false;

window.onYouTubeIframeAPIReady = function () {
  apiLoadedCallbacks.forEach(function (apiLoadedCallback) {
    return apiLoadedCallback();
  });
  apiLoadedCallbacks = [];
  apiLoaded = true;
};

var Youtube = /*#__PURE__*/function () {
  function Youtube(el, id, options) {
    _classCallCheck(this, Youtube);

    this.el = el;
    this.id = id;
    this.startMuted = options.startMuted;
    this.loopVideo = options.loopVideo;
    this.iframeEl = document.createElement('div');
    this.el.appendChild(this.iframeEl);
    this.onApiLoaded = this._onApiLoaded.bind(this);
    this.isReady = false;
    this.onReady = this._onReady.bind(this);
    this.onReadyCallback = null;
    this.playerState = null;
    this.onStateChange = this._onStateChange.bind(this);
    this.onPlayCallback = null;
    this.onPlayError = null;

    if (apiLoaded) {
      this._onApiLoaded();
    } else {
      apiLoadedCallbacks.push(this.onApiLoaded);
      script(api);
    }
  }

  _createClass(Youtube, [{
    key: "play",
    value: function play() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.onPlayCallback = resolve;
        _this.onPlayError = reject;

        if (_this.isReady) {
          _this.player.playVideo();
        } else {
          _this.onReadyCallback = function () {
            _this.player.playVideo();
          };
        }
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      this.player.pauseVideo();
    }
  }, {
    key: "unload",
    value: function unload() {
      this.player.destroy();
    }
  }, {
    key: "_onApiLoaded",
    value: function _onApiLoaded() {
      var playerVars = {
        modestbranding: true,
        showinfo: false,
        controls: false,
        loop: this.loopVideo,
        mute: this.startMuted,
        rel: 0
      };

      if (this.loopVideo) {
        // This is required to allow 'loop' to work based on the YouTube api
        playerVars.playlist = this.id;
      }

      this.player = new YT.Player(this.iframeEl, {
        videoId: this.id,
        playerVars: playerVars,
        events: {
          onReady: this.onReady,
          onStateChange: this.onStateChange
        }
      });
    }
  }, {
    key: "_onReady",
    value: function _onReady() {
      this.isReady = true;

      if (this.onReadyCallback) {
        this.onReadyCallback();
      }
    }
  }, {
    key: "_onStateChange",
    value: function _onStateChange(event) {
      var state = event.data;

      if (this.onPlayCallback) {
        if (state === YT.PlayerState.PLAYING) {
          this.onPlayCallback();
          this.onPlayCallback = null;
          this.onPlayError = null;
        } else if (this.playerState === YT.PlayerState.BUFFERING && (state === YT.PlayerState.UNSTARTED || state === YT.PlayerState.PAUSED)) {
          this.onPlayError();
          this.onPlayCallback = null;
          this.onPlayError = null;
        }
      }

      this.playerState = state;
    }
  }]);

  return Youtube;
}();

var api$1 = 'https://player.vimeo.com/api/player.js';
var thumbnailApi = 'http://vimeo.com/api/v2/video/{id}.json';
var apiLoaded$1 = false;

var VimeoPlayer = /*#__PURE__*/function () {
  function VimeoPlayer(section, el, id, options) {
    var _this = this;

    _classCallCheck(this, VimeoPlayer);

    this.section = section;
    this.el = el;
    this.id = id;
    this.startMuted = options.startMuted;
    this.loopVideo = options.loopVideo;
    this.coverImage = this.section.querySelector('[data-vimeo-image]');
    this.onApiLoaded = this._onApiLoaded.bind(this);
    this.isReady = false;
    this.onReady = this._onReady.bind(this);
    this.onReadyCallback = null;
    this.onPlayCallback = null;
    this.startedPlaying = false;
    this.onProgress = this._onProgress.bind(this);

    if (apiLoaded$1) {
      this._onApiLoaded();
    } else {
      script(api$1, this.onApiLoaded);
    }

    if (this.coverImage) {
      // Add the cover image for vimeo videos
      fetch(thumbnailApi.replace('{id}', this.id)).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this.coverImage.setAttribute('src', data[0].thumbnail_large);
      });
    }
  }

  _createClass(VimeoPlayer, [{
    key: "play",
    value: function play() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.onPlayCallback = resolve;
        _this2.onPlayError = reject;

        if (_this2.isReady) {
          _this2.player.play().then(function () {
            _this2.player.on('progress', _this2.onProgress);
          })["catch"](function (error) {
            _this2.player.off('progress', _this2.onProgress);

            _this2.onPlayError();
          });
        } else {
          _this2.onReadyCallback = function () {
            _this2.player.play().then(function () {
              _this2.player.on('progress', _this2.onProgress);
            })["catch"](function (error) {
              _this2.player.off('progress', _this2.onProgress);

              _this2.onPlayError();
            });
          };
        }
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      this.player.pause()["catch"]();
    }
  }, {
    key: "unload",
    value: function unload() {
      this.player.unload()["catch"]();
    }
  }, {
    key: "_onApiLoaded",
    value: function _onApiLoaded() {
      var _this3 = this;

      this.player = new window.Vimeo.Player(this.el, {
        id: this.id,
        muted: this.startMuted,
        loop: this.loopVideo
      });
      this.player.ready().then(function () {
        _this3._onReady();
      })["catch"](function () {
        _this3.onPlayError();
      });
      apiLoaded$1 = true;
    }
  }, {
    key: "_onReady",
    value: function _onReady() {
      this.isReady = true;

      if (this.onReadyCallback) {
        this.onReadyCallback();
      }
    }
  }, {
    key: "_onProgress",
    value: function _onProgress() {
      this.startedPlaying = true;
      this.player.off('progress', this.onProgress);

      if (this.onPlayCallback) {
        this.onPlayCallback();
        this.onPlayCallback = null;
      }
    }
  }]);

  return VimeoPlayer;
}();

var loadPlyrStyles = null;

var HTML5Video = /*#__PURE__*/function () {
  function HTML5Video(section, el, options) {
    var _this = this;

    _classCallCheck(this, HTML5Video);

    this.section = section;
    this.videoElement = el.querySelector('[data-html5-video]');
    this.startMuted = options.startMuted;
    this.loopVideo = options.loopVideo;
    this.aspectRatio = options.aspectRatio;
    this.setupVideo = this.setupVideo.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.unload = this.unload.bind(this);

    if (!(loadPlyrStyles instanceof Promise)) {
      loadPlyrStyles = new Promise(function (resolve) {
        var stylesheet = document.createElement('link');
        stylesheet.setAttribute('rel', 'stylesheet');
        stylesheet.href = 'https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css';
        stylesheet.onload = resolve;
        document.body.appendChild(stylesheet);
      });
    }

    window.Shopify.loadFeatures([{
      name: 'video-ui',
      version: '1.0',
      onLoad: function onLoad() {
        return loadPlyrStyles.then(function () {
          return _this.setupVideo();
        });
      }
    }]);
  }

  _createClass(HTML5Video, [{
    key: "setupVideo",
    value: function setupVideo() {
      if (!Shopify.Plyr) {
        return;
      }

      this.player = new Shopify.Plyr(this.videoElement, {
        muted: this.startMuted,
        loop: {
          active: this.loopVideo
        },
        ratio: this.aspectRatio
      });
    }
  }, {
    key: "play",
    value: function play() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2.player) {
          _this2.player.play();

          resolve();
        }
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      this.player.pause();
    }
  }, {
    key: "unload",
    value: function unload() {
      if (this.player) {
        this.player.destroy();
      }
    }
  }]);

  return HTML5Video;
}();

var Video = /*#__PURE__*/function () {
  function Video(section) {
    var _this = this;

    _classCallCheck(this, Video);

    this.el = section.el;
    this.settings = section.data;
    this.playButton = this.el.querySelector('[data-video-play-button]');
    this.videoEl = this.el.querySelector('[data-video]');
    this.video = null;
    this.playButtonClicked = false;
    var autoplay = this.settings.autoplay || false;
    var startMuted = this.settings.startMuted != null ? this.settings.startMuted : true;
    var loopVideo = this.settings.loopVideo || false;
    var aspectRatio = this.settings.aspectRatio;
    var type = this.videoEl.getAttribute('data-video');
    var id = this.videoEl.getAttribute('data-video-id');

    switch (type) {
      case 'youtube':
        this.video = new Youtube(this.videoEl, id, {
          startMuted: startMuted,
          loopVideo: loopVideo
        });
        break;

      case 'vimeo':
        this.video = new VimeoPlayer(this.el, this.videoEl, id, {
          startMuted: startMuted,
          loopVideo: loopVideo
        });
        break;

      case 'html5':
        this.video = new HTML5Video(this.el, this.videoEl, {
          startMuted: startMuted,
          loopVideo: loopVideo,
          aspectRatio: aspectRatio
        });
        break;

      default:
        this.video = null;
        break;
    }

    this._play = this._play.bind(this);

    if (this.playButton) {
      this.onPlayButtonClick = function () {
        _this.playButtonClicked = true;

        _this._play();
      };

      this.playButton.addEventListener('click', this.onPlayButtonClick);
    }

    if (!this.viewportIsMobile() && autoplay) {
      // Set up autoplay for when the video is in the viewport
      this.observer = new IntersectionObserver(function (entries) {
        var isIntersecting = entries[0].isIntersecting;

        if (isIntersecting) {
          _this._play();

          _this.observer.unobserve(_this.videoEl);
        }
      });
      this.observer.observe(this.videoEl);
    }
  }

  _createClass(Video, [{
    key: "_play",
    value: function _play() {
      var _this2 = this;

      this.el.dataset.videoLoading = true;
      this.video.play().then(function () {
        _this2.el.dataset.videoTransitioning = true;
        setTimeout(function () {
          _this2.el.dataset.videoLoading = false;
          _this2.el.dataset.videoTransitioning = false;
          _this2.el.dataset.videoPlaying = true; // This is for accessibility, the video should receive focus after playing.

          if (_this2.playButtonClicked) {
            _this2.videoEl.focus();
          }
        }, 200);
      })["catch"](function () {
        // We should pause the video in case it does start
        // playing underneath the overlay
        _this2.video.pause();

        _this2.el.dataset.videoLoading = false;
        _this2.el.dataset.videoPlaying = false;
      });
    } // This method can be overridden by the theme if the breakpoint is different than 720.

  }, {
    key: "viewportIsMobile",
    value: function viewportIsMobile() {
      return window.innerWidth < 720;
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.playButton) {
        this.playButton.removeEventListener('click', this.onPlayClick);
      }

      if (this.video) {
        this.video.unload();
      }
    }
  }]);

  return Video;
}();

/* harmony default export */ var pxs_video_dist_index_es = (Video);

;// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-variants-ui/dist/index.es.js
/*!
 * @pixelunion/shopify-variants v3.1.2
 * (c) 2021 Pixel Union
 */
function index_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var valueElementType = {
  select: 'option',
  radio: 'input[type="radio"]'
};

function getOptions(optionsEls) {
  var select = [];
  var radio = [];

  for (var i = 0; i < optionsEls.length; i++) {
    var optionEl = optionsEls[i];
    var wrappers = optionEl.matches('[data-variant-option-value-wrapper]') ? [optionEl] : Array.prototype.slice.call(optionEl.querySelectorAll('[data-variant-option-value-wrapper]'));
    var values = optionEl.matches('[data-variant-option-value]') ? [optionEl] : Array.prototype.slice.call(optionEl.querySelectorAll('[data-variant-option-value]'));
    if (!values.length) break;
    var option = {
      option: optionEl,
      wrappers: wrappers,
      values: values
    };

    if (values[0].matches(valueElementType.select)) {
      select.push(option);
    } else if (values[0].matches(valueElementType.radio)) {
      radio.push(option);
    }
  }

  return {
    select: select,
    radio: radio
  };
}

function getOptionsState(product, selectOptions, radioOptions) {
  var options = product.options.map(function () {
    return false;
  });
  selectOptions.forEach(function (_ref) {
    var option = _ref.option;

    if (option.value !== '') {
      options[parseInt(option.dataset.variantOptionIndex, 10)] = option.value;
    }
  });
  radioOptions.forEach(function (_ref2) {
    var values = _ref2.values;
    values.forEach(function (value) {
      if (value.checked) {
        options[parseInt(value.dataset.variantOptionValueIndex, 10)] = value.value;
      }
    });
  });
  return options;
}

function getVariantFromOptionsState(variants, optionsState) {
  for (var i = 0; i < variants.length; i++) {
    var variant = variants[i];
    var isVariant = variant.options.every(function (option, index) {
      return option === optionsState[index];
    });
    if (isVariant) return variant; // We found the variant
  }

  return false;
}

function _getVariant(variants, options) {
  return variants.find(function (variant) {
    return variant.options.every(function (option, index) {
      return option === options[index];
    });
  });
}

function _setOptionsMap(product, optionsState, optionsMap, option1) {
  var option2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var option3 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var options = [option1, option2, option3].filter(function (option) {
    return !!option;
  });

  var variant = _getVariant(product.variants, options);

  var variantOptionMatches = options.filter(function (option, index) {
    return option === optionsState[index];
  }).length;
  var isCurrentVariant = variantOptionMatches === product.options.length;
  var isNeighbor = variantOptionMatches === product.options.length - 1;

  for (var i = 0; i < options.length; i++) {
    var option = options[i];

    if (option) {
      var _optionsMap$i$option = optionsMap[i][option],
          setByCurrentVariant = _optionsMap$i$option.setByCurrentVariant,
          setByNeighbor = _optionsMap$i$option.setByNeighbor,
          accessible = _optionsMap$i$option.accessible,
          available = _optionsMap$i$option.available;

      if (variant) {
        accessible = variant.available || accessible; // The current variant is always
        // the priority for option availability

        if (isCurrentVariant) {
          setByCurrentVariant = true;
          available = variant.available;
        } else if (!setByCurrentVariant && isNeighbor) {
          // If the variant is a neighbor
          // And the option doesn't belong to the variant
          // Use its availability information for the option
          // If multiple neighbors exist, prefer true
          available = setByNeighbor ? available || variant.available : variant.available;
          setByNeighbor = true;
        }
      } else if (isCurrentVariant) {
        // Catch case where current variant doesn't exist
        // Ensure availability is false
        setByCurrentVariant = true;
        available = false;
      } else if (!setByCurrentVariant && isNeighbor) {
        // Catch case where neighbor doesn't exist
        // Ensure availability is false
        // If multiple neighbors exist, prefer true
        available = setByNeighbor ? available : false;
        setByNeighbor = true;
      } // If the option isn't set by either
      // the current variant or a neighbor
      // default to general accessibility


      if (!setByCurrentVariant && !setByNeighbor) {
        available = accessible;
      }

      optionsMap[i][option] = {
        setByCurrentVariant: setByCurrentVariant,
        setByNeighbor: setByNeighbor,
        accessible: accessible,
        available: available
      };
    }
  }

  return optionsMap;
}

function getOptionsMap(product, optionsState) {
  var optionsMap = product.options.map(function () {
    return {};
  });

  for (var i = 0; i < product.options.length; i++) {
    for (var j = 0; j < product.variants.length; j++) {
      var variant = product.variants[j];
      var option = variant.options[i];
      optionsMap[i][option] = {
        setByCurrentVariant: false,
        setByNeighbor: false,
        accessible: false,
        available: false
      };
    }
  }

  var option1Values = optionsMap.length >= 1 ? Object.keys(optionsMap[0]) : [];
  var option2Values = optionsMap.length >= 2 ? Object.keys(optionsMap[1]) : [];
  var option3Values = optionsMap.length >= 3 ? Object.keys(optionsMap[2]) : [];
  option1Values.forEach(function (option1Value) {
    option2Values.forEach(function (option2Value) {
      option3Values.forEach(function (option3Value) {
        optionsMap = _setOptionsMap(product, optionsState, optionsMap, option1Value, option2Value, option3Value);
      });

      if (!option3Values.length) {
        optionsMap = _setOptionsMap(product, optionsState, optionsMap, option1Value, option2Value);
      }
    });

    if (!option2Values.length) {
      optionsMap = _setOptionsMap(product, optionsState, optionsMap, option1Value);
    }
  });
  return optionsMap;
}

var Variants = /*#__PURE__*/function () {
  function Variants(product, variantsEl, optionsEls, config) {
    var _this = this;

    index_es_classCallCheck(this, Variants);

    this.config = _objectSpread2({
      disableUnavailableOptions: true,
      removeUnavailableOptions: false
    }, config);
    this.events = [];
    this.callbacks = [];
    this.product = product;
    this.variantsEl = variantsEl;

    var _getOptions = getOptions(optionsEls);

    this.selectOptions = _getOptions.select;
    this.radioOptions = _getOptions.radio;
    this.previousVariant = this.currentVariant;

    this.onChangeFn = function () {
      return _this._updateOptions();
    };

    this.selectOptions.forEach(function (_ref) {
      var option = _ref.option;
      option.addEventListener('change', _this.onChangeFn);

      _this.events.push({
        el: option,
        fn: _this.onChangeFn
      });
    });
    this.radioOptions.forEach(function (_ref2) {
      var values = _ref2.values;
      values.forEach(function (value) {
        value.addEventListener('change', _this.onChangeFn);

        _this.events.push({
          el: value,
          fn: _this.onChangeFn
        });
      });
    });

    this._updateOptions();
  }

  index_es_createClass(Variants, [{
    key: "onVariantChange",
    value: function onVariantChange(callback) {
      if (this.callbacks.indexOf(callback) >= 0) return;
      this.callbacks.push(callback);
    }
  }, {
    key: "offVariantChange",
    value: function offVariantChange(callback) {
      var index = this.callbacks.indexOf(callback);
      if (index === -1) return;
      this.callbacks.splice(index, 1);
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.forEach(function (_ref3) {
        var el = _ref3.el,
            fn = _ref3.fn;
        return el.removeEventListener('change', fn);
      });
    }
  }, {
    key: "_updateOptions",
    value: function _updateOptions() {
      var product = this.product;
      var optionsState = getOptionsState(this.product, this.selectOptions, this.radioOptions);
      var variant = getVariantFromOptionsState(product.variants, optionsState);
      var optionsMap = getOptionsMap(product, optionsState); // Update master select

      this.variantsEl.value = variant ? variant.id : '';

      this._updateSelectOptions(optionsMap);

      this._updateRadioOptions(optionsMap); // Trigger event, IE11 compatible but could be deprecated in the future


      var event = document.createEvent('Event');
      event.initEvent('change', true, false);
      this.variantsEl.dispatchEvent(event);
      var data = {
        product: product,
        previousVariant: this.previousVariant,
        currentVariant: variant,
        optionsState: optionsState
      };
      this.callbacks.forEach(function (callback) {
        return callback(data);
      });
      var switchVariantEvent = document.createEvent('CustomEvent');
      switchVariantEvent.initCustomEvent('shopify-variants:switch-variant', true, true, data);
      window.dispatchEvent(switchVariantEvent);
      this.previousVariant = variant;
    }
  }, {
    key: "_updateSelectOptions",
    value: function _updateSelectOptions(optionsMap) {
      var _this2 = this;

      if (this.selectOptions.length === 0) {
        return;
      } // Iterate over each option type


      var _loop = function _loop(i) {
        // Corresponding select dropdown, if it exists
        var select = _this2.selectOptions.find(function (_ref4) {
          var option = _ref4.option;

          if (parseInt(option.dataset.variantOptionIndex, 10) === i) {
            return true;
          }

          return false;
        });

        if (select) {
          var fragment = document.createDocumentFragment();
          var option = select.option,
              wrappers = select.wrappers,
              values = select.values;

          for (var j = values.length - 1; j >= 0; j--) {
            var wrapper = wrappers[j];
            var optionValue = values[j];
            var value = optionValue.value;
            var available = value in optionsMap[i] && optionsMap[i][value].available;
            var accessible = value in optionsMap[i] && optionsMap[i][value].accessible;
            var isChooseOption = value === ''; // Option element to indicate unchosen option
            // Disable unavailable options

            optionValue.disabled = isChooseOption || _this2.config.disableUnavailableOptions && !accessible;
            optionValue.dataset.variantOptionAccessible = accessible;
            optionValue.dataset.variantOptionAvailable = available;

            if (_this2.config.removeUnavailableOptions && (accessible || isChooseOption)) {
              fragment.insertBefore(wrapper, fragment.firstElementChild);
            }
          }

          if (_this2.config.removeUnavailableOptions) {
            option.innerHTML = '';
            option.appendChild(fragment);
          }

          var chosenValue = values.find(function (value) {
            return value.selected;
          });
          option.dataset.variantOptionChosenValue = chosenValue && chosenValue.value !== '' ? chosenValue.value : false;
        }
      };

      for (var i = 0; i < this.product.options.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: "_updateRadioOptions",
    value: function _updateRadioOptions(optionsMap) {
      var _this3 = this;

      if (this.radioOptions.length === 0) {
        return;
      }

      var _loop2 = function _loop2(i) {
        var radios = _this3.radioOptions.find(function (_ref5) {
          var option = _ref5.option;

          if (parseInt(option.dataset.variantOptionIndex, 10) === i) {
            return true;
          }

          return false;
        });

        if (radios) {
          var fragment = document.createDocumentFragment();
          var option = radios.option,
              wrappers = radios.wrappers,
              values = radios.values;

          for (var j = 0; j < values.length; j++) {
            var wrapper = wrappers[j];
            var optionValue = values[j];
            var value = optionValue.value;
            var available = value in optionsMap[i] && optionsMap[i][value].available;
            var accessible = value in optionsMap[i] && optionsMap[i][value].accessible; // Disable unavailable options

            optionValue.disabled = _this3.config.disableUnavailableOptions && !accessible;
            optionValue.dataset.variantOptionAccessible = accessible;
            optionValue.dataset.variantOptionAvailable = available;

            if (_this3.config.removeUnavailableOptions && accessible) {
              fragment.appendChild(wrapper);
            }
          }

          if (_this3.config.removeUnavailableOptions) {
            option.innerHTML = '';
            option.appendChild(fragment);
          }

          var chosenValue = values.find(function (value) {
            return value.checked;
          });
          option.dataset.variantOptionChosenValue = chosenValue ? chosenValue.value : false;
        }
      };

      for (var i = 0; i < this.product.options.length; i++) {
        _loop2(i);
      }
    }
  }, {
    key: "isDefaultVariant",
    get: function get() {
      return this.product.variants[0].public_title === null;
    }
  }, {
    key: "isInIndeterminateState",
    get: function get() {
      return getOptionsState(this.product, this.selectOptions, this.radioOptions).some(function (optionState) {
        return !optionState;
      });
    }
  }, {
    key: "currentVariant",
    get: function get() {
      if (this.isDefaultVariant) {
        return this.product.variants[0];
      }

      return getVariantFromOptionsState(this.product.variants, getOptionsState(this.product, this.selectOptions, this.radioOptions));
    }
  }]);

  return Variants;
}();

function updateLabels(el) {
  const optionsEls = el.querySelectorAll('[data-variant-option]');

  for (let i = 0; i < optionsEls.length; i++) {
    const optionsEl = optionsEls[i];
    const optionsNameEl = optionsEl.parentElement.querySelector('[data-variant-option-name]');

    if (optionsNameEl) {
      optionsNameEl.dataset.variantOptionChosenValue = optionsEl.dataset.variantOptionChosenValue;

      if (optionsEl.dataset.variantOptionChosenValue !== 'false') {
        optionsNameEl.innerHTML = optionsNameEl.dataset.variantOptionName;
        const optionNameValueSpan = optionsNameEl.querySelector('span');

        if (optionNameValueSpan) {
          optionNameValueSpan.innerHTML = optionsEl.dataset.variantOptionChosenValue;
        }
      } else {
        optionsNameEl.innerHTML = optionsNameEl.dataset.variantOptionChooseName;
      }
    }
  }
}

class ShopifyVariantsUI {
  constructor(el, product, config = {}) {
    this._isDefaultVariant = el.matches('input[data-variants]');
    this._product = product;
    if (this._isDefaultVariant) return;
    const variantsEl = el.querySelector('select[data-variants]');
    const optionsEls = el.querySelectorAll('[data-variant-option]');
    this._shopifyVariants = new Variants(product, variantsEl, optionsEls, config);
    updateLabels(el);

    this._shopifyVariants.onVariantChange(() => updateLabels(el));
  }

  get isDefaultVariant() {
    return this._isDefaultVariant || this._shopifyVariants.isDefaultVariant;
  }

  get isInIndeterminateState() {
    return this._isDefaultVariant ? false : this._shopifyVariants.isInIndeterminateState;
  }

  get currentVariant() {
    return this._isDefaultVariant ? this._product.variants[0] : this._shopifyVariants.currentVariant;
  }

  onVariantChange(callback) {
    if (!this._shopifyVariants) return;

    this._shopifyVariants.onVariantChange(callback);
  }

  offVariantChange(callback) {
    if (!this._shopifyVariants) return;

    this._shopifyVariants.offVariantChange(callback);
  }

  unload() {
    if (this._shopifyVariants) {
      this._shopifyVariants.unload();
    }
  }

}

/* harmony default export */ var shopify_variants_ui_dist_index_es = (ShopifyVariantsUI);

;// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-surface-pick-up/dist/index.es.js
function dist_index_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function dist_index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function dist_index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) dist_index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) dist_index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

function index_es_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function index_es_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function index_es_objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      index_es_ownKeys(Object(source), true).forEach(function (key) {
        index_es_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      index_es_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var LOCAL_STORAGE_KEY = 'pxu-shopify-surface-pick-up';
var loadingClass = 'surface-pick-up--loading';

var isNotExpired = function isNotExpired(timestamp) {
  return timestamp + 1000 * 60 * 60 <= Date.now();
};

var removeTrailingSlash = function removeTrailingSlash(s) {
  return s.replace(/(.*)\/$/, '$1');
}; // Haversine Distance
// The haversine formula is an equation giving great-circle distances between
// two points on a sphere from their longitudes and latitudes


var calculateDistance = function calculateDistance(latitude1, longitude1, latitude2, longitude2, unitSystem) {
  var dtor = Math.PI / 180;
  var radius = unitSystem === 'metric' ? 6378.14 : 3959;
  var rlat1 = latitude1 * dtor;
  var rlong1 = longitude1 * dtor;
  var rlat2 = latitude2 * dtor;
  var rlong2 = longitude2 * dtor;
  var dlon = rlong1 - rlong2;
  var dlat = rlat1 - rlat2;
  var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.pow(Math.sin(dlon / 2), 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c;
};

var getGeoLocation = function getGeoLocation() {
  return new Promise(function (resolve, reject) {
    var options = {
      maximumAge: 3600000,
      // 1 hour
      timeout: 5000
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (_ref) {
        var coords = _ref.coords;
        return resolve(coords);
      }, reject, options);
    } else {
      reject();
    }
  });
};

var index_es_location = null;

var setLocation = function setLocation(_ref2) {
  var latitude = _ref2.latitude,
      longitude = _ref2.longitude;
  return new Promise(function (resolve) {
    var cachedLocation = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    var newData = {
      latitude: latitude,
      longitude: longitude,
      timestamp: Date.now()
    };
    index_es_location = newData;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));

    if (cachedLocation !== null && cachedLocation.latitude === latitude && cachedLocation.longitude === longitude // Valid for 1 hour - per Debut's example
    && isNotExpired(cachedLocation.timestamp)) {
      resolve({
        latitude: latitude,
        longitude: longitude
      });
      return;
    }

    fetch('/localization.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: latitude,
        longitude: longitude
      })
    }).then(function () {
      return resolve({
        latitude: latitude,
        longitude: longitude
      });
    });
  });
};

var getLocation = function getLocation() {
  return new Promise(function (resolve) {
    if (index_es_location && isNotExpired(index_es_location.timestamp)) {
      resolve(index_es_location);
      return;
    }

    resolve(getGeoLocation().then(setLocation));
  });
};

var SurfacePickUp = /*#__PURE__*/function () {
  function SurfacePickUp(el, options) {
    dist_index_es_classCallCheck(this, SurfacePickUp);

    this.el = el;
    this.options = index_es_objectSpread2({
      root_url: window.Theme && window.Theme.routes && window.Theme.routes.root_url || ''
    }, options);
    this.options.root_url = removeTrailingSlash(this.options.root_url);
    this.callbacks = [];
    this.onBtnPress = null;
    this.latestVariantId = null;
    this.pickUpEnabled = localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
  }

  dist_index_es_createClass(SurfacePickUp, [{
    key: "load",
    value: function load(variantId) {
      var _this = this;

      // If no variant is available, empty element and quick-return
      if (!variantId) {
        this.el.innerHTML = '';
        return;
      } // Because Shopify doesn't expose any `pick_up_enabled` data on the shop object, we
      // don't know if the variant might be, or is definitely not available for pick up.
      // Until we know the shop has > 0 pick up locations, we want to avoid prompting the
      // user for location data (it's annoying, and only makes sense to do if we use it).
      //
      // Instead, we have to make an initial request, check and see if any pick up locations
      // were returned, then ask for the users location, then make another request to get the
      // location-aware pick up locations.
      //
      // As far as I can tell the pick up aware locations differ only in sort order - which
      // we could do on the front end - but we're following this approach to ensure future
      // compatibility with any changes Shopify makes (maybe disabling options based on
      // user location, or whatever else).
      //
      // Shopify has indicated they will look into adding pick_up_enabled data to the shop
      // object, which which case this method can be greatly simplifed into 2 simple cases.


      this.latestVariantId = variantId;

      var getLocationThenInjectData = function getLocationThenInjectData() {
        return getLocation() // If we get a location, inject data using that location
        .then(function (coords) {
          return _this._getData(variantId).then(function (data) {
            return _this._injectData(data, coords);
          });
        }) // Otherwise, inject data without location
        ["catch"](function () {
          return _this._getData(variantId).then(function (data) {
            return _this._injectData(data, null);
          });
        });
      };

      this.el.classList.add(loadingClass); // If we've previously seen some pick up locations we know this variant may be available
      // for pick up, so we request browser location data.

      if (this.pickUpEnabled) {
        return getLocationThenInjectData();
      }

      return this._getData(variantId).then(function (data) {
        if (data.items.length > 0) {
          _this.pickUpEnabled = true; // Inject initial data - the store displayed may not be the closest, since it was
          // determined by IP geolocation, instead of browser side location. But better
          // than nothing.

          _this._injectData(data, null); // Then get browser location and go through the process again with the new location
          // data. Any subsequent variants will skip the initial request and go
          // directly to the browser based location data.


          return getLocationThenInjectData();
        } // If there are no items (pick up locations), just inject the (empty) data and return.
        // We will continue to check for pick up locations on any new variants, since depending
        // on product availability, the first product may have no pick up locations even if the
        // store does have some.


        return _this._injectData(data, null);
      });
    }
  }, {
    key: "onModalRequest",
    value: function onModalRequest(callback) {
      if (this.callbacks.indexOf(callback) >= 0) return;
      this.callbacks.push(callback);
    }
  }, {
    key: "offModalRequest",
    value: function offModalRequest(callback) {
      this.callbacks.splice(this.callbacks.indexOf(callback));
    }
  }, {
    key: "unload",
    value: function unload() {
      this.callbacks = [];
      this.el.innerHTML = '';
    }
  }, {
    key: "_getData",
    value: function _getData(variantId) {
      var _this2 = this;

      return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        var requestUrl = "".concat(_this2.options.root_url, "/variants/").concat(variantId, "/?section_id=surface-pick-up");
        xhr.open('GET', requestUrl, true);

        xhr.onload = function () {
          var el = xhr.response;
          var embed = el.querySelector('[data-html="surface-pick-up-embed"]');
          var itemsContainer = el.querySelector('[data-html="surface-pick-up-items"]');
          var items = itemsContainer.content.querySelectorAll('[data-surface-pick-up-item]');
          resolve({
            embed: embed,
            itemsContainer: itemsContainer,
            items: items,
            variantId: variantId
          });
        };

        xhr.onerror = function () {
          resolve({
            embed: {
              innerHTML: ''
            },
            itemsContainer: {
              innerHTML: ''
            },
            items: [],
            variantId: variantId
          });
        };

        xhr.responseType = 'document';
        xhr.send();
      });
    }
  }, {
    key: "_injectData",
    value: function _injectData(_ref3, userCoords) {
      var _this3 = this;

      var embed = _ref3.embed,
          itemsContainer = _ref3.itemsContainer,
          items = _ref3.items,
          variantId = _ref3.variantId;

      if (variantId !== this.latestVariantId) {
        return null;
      }

      this.el.innerHTML = embed.innerHTML;
      this.el.classList.remove(loadingClass);

      if (items.length === 0) {
        return this.el;
      }

      var processedDistances = false;

      var processDistances = function processDistances() {
        if (processedDistances) return;
        processedDistances = true;
        items.forEach(function (item) {
          var distanceEl = item.querySelector('[data-distance]');
          var distanceUnitEl = item.querySelector('[data-distance-unit]');
          var unitSystem = distanceUnitEl.dataset.distanceUnit;
          var itemLatitude = parseFloat(distanceEl.dataset.latitude);
          var itemLongitude = parseFloat(distanceEl.dataset.longitude);

          if (userCoords && isFinite(itemLatitude) && isFinite(itemLongitude)) {
            var distance = calculateDistance(userCoords.latitude, userCoords.longitude, itemLatitude, itemLongitude, unitSystem);
            distanceEl.innerHTML = distance.toFixed(1);
          } else {
            distanceEl.remove();
            distanceUnitEl.remove();
          }
        });
      };

      this.el.querySelector('[data-surface-pick-up-embed-modal-btn]').addEventListener('click', function () {
        processDistances();

        _this3.callbacks.forEach(function (callback) {
          return callback(itemsContainer.innerHTML);
        });
      });
      return this.el;
    }
  }]);

  return SurfacePickUp;
}();

/* harmony default export */ var shopify_surface_pick_up_dist_index_es = (SurfacePickUp);

// EXTERNAL MODULE: ./node_modules/@pixelunion/events/dist/EventHandler.js
var EventHandler = __webpack_require__(766);
// EXTERNAL MODULE: ./node_modules/just-debounce/index.js
var just_debounce = __webpack_require__(405);
var just_debounce_default = /*#__PURE__*/__webpack_require__.n(just_debounce);
;// CONCATENATED MODULE: ./source/scripts/helpers/QuantitySelector.js
function QuantitySelector_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function QuantitySelector_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function QuantitySelector_createClass(Constructor, protoProps, staticProps) { if (protoProps) QuantitySelector_defineProperties(Constructor.prototype, protoProps); if (staticProps) QuantitySelector_defineProperties(Constructor, staticProps); return Constructor; }




var QuantitySelector = /*#__PURE__*/function () {
  function QuantitySelector(_ref) {
    var _this = this;

    var quantityField = _ref.quantityField,
        onChange = _ref.onChange;

    QuantitySelector_classCallCheck(this, QuantitySelector);

    this.events = new EventHandler/* default */.Z();
    this.field = quantityField;
    this.input = this.field.querySelector('[data-quantity-input]');
    this.plus = this.field.querySelector('[data-quantity-plus]');
    this.minus = this.field.querySelector('[data-quantity-minus]'); // this.max assigned in methods when max attribute has been added to the input

    this.min = this.input.min ? parseInt(this.input.min, 10) : 0;
    this.increaseAmount = this.increaseAmount.bind(this);
    this.decreaseAmount = this.decreaseAmount.bind(this);
    this.refreshQuantity = this.refreshQuantity.bind(this);
    this.onChange = onChange ? just_debounce_default()(onChange, 1000) : function () {};
    this.events.register(this.plus, 'click', function (e) {
      return _this.increaseAmount(e);
    });
    this.events.register(this.minus, 'click', function (e) {
      return _this.decreaseAmount(e);
    });
    this.events.register(this.input, 'change', function (e) {
      return _this.setAmount(e);
    });
  }

  QuantitySelector_createClass(QuantitySelector, [{
    key: "setAmount",
    value: function setAmount(e) {
      e.preventDefault();
      var currentValue = this.input.valueAsNumber;
      this.max = parseInt(this.input.max, 10);
      this.refreshQuantity();

      if (currentValue < this.max || currentValue > this.min) {
        this.onChange();
      }
    }
  }, {
    key: "increaseAmount",
    value: function increaseAmount(e) {
      e.preventDefault();
      var currentValue = this.input.valueAsNumber;
      this.max = parseInt(this.input.max, 10);

      if (!this.max || currentValue < this.max) {
        this.input.value = currentValue + 1;
        this.onChange();
      }
    }
  }, {
    key: "decreaseAmount",
    value: function decreaseAmount(e) {
      e.preventDefault();
      var currentValue = this.input.valueAsNumber;

      if (currentValue > this.min) {
        this.input.value = currentValue - 1;
        this.onChange();
      }
    }
  }, {
    key: "refreshQuantity",
    value: function refreshQuantity() {
      var currentValue = this.input.valueAsNumber;
      this.max = parseInt(this.input.max, 10);

      if (currentValue > this.max) {
        this.input.value = this.max;
      }
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();
    }
  }]);

  return QuantitySelector;
}();


;// CONCATENATED MODULE: ./source/scripts/components/ProductDetails.js
function ProductDetails_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductDetails_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductDetails_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductDetails_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductDetails_defineProperties(Constructor, staticProps); return Constructor; }






var ProductDetails = /*#__PURE__*/function () {
  function ProductDetails(options) {
    var _this = this;

    ProductDetails_classCallCheck(this, ProductDetails);

    this.el = options.el;
    this.product = options.product;
    this.variantInventory = options.variantInventory;
    this.settings = options.settings;
    this.onVariantChange = options.onVariantChange;
    this.selectFirstAvailableVariant = this.settings.selectFirstAvailableVariant;
    this.soldOutOptions = this.settings.soldOutOptions;
    this.productDetailsContainer = this.el.querySelector('[data-product-details]');
    this.variantsUIElement = this.el.querySelector('[data-variants-ui]');
    this.productUnitPricing = this.el.querySelector('[data-unit-price]');
    this.sizeChartButton = this.el.querySelector('[data-size-chart-trigger]');
    this.sizeChartContent = this.el.querySelector('[data-size-chart]');
    this.surfacePickUpEl = this.el.querySelector('[data-surface-pick-up]'); // Element to inject surface pick up information into on product

    this.surfacePickUp = new shopify_surface_pick_up_dist_index_es(this.surfacePickUpEl);
    this.events = new EventHandler/* default */.Z(); // Set up variants ui

    this.variantsUI = new shopify_variants_ui_dist_index_es(this.variantsUIElement, this.product, {
      selectFirstAvailableVariant: this.selectFirstAvailableVariant,
      disableUnavailableOptions: this.soldOutOptions === 'disabled',
      removeUnavailableOptions: this.soldOutOptions === 'hidden'
    });
    this.surfacePickUp.load(this.variantsUI.currentVariant.id);
    this.surfacePickUp.onModalRequest(function (contents) {
      var container = document.createElement('div');
      var variantTitle;
      var headerClass;

      if (!_this.variantsUI.isDefaultVariant) {
        variantTitle = "<div class=\"surface-pick-up-modal__variant\">".concat(_this.variantsUI.currentVariant.title, "</div>");
      } else {
        variantTitle = '';
        headerClass = 'surface-pick-up-modal__header--no-variants';
      }

      var modalContents = "\n        <div class=\"surface-pick-up-modal__header ".concat(headerClass, "\">\n          <h2 class=\"surface-pick-up-modal__title\">").concat(_this.product.title, "</h2>\n          ").concat(variantTitle, "\n        </div>\n        ").concat(contents, "\n        ");
      container.innerHTML = modalContents;
      window.modal.open({
        trigger: document.querySelector('[data-surface-pick-up-embed-modal-btn]'),
        classname: 'surface-pick-up__popup',
        content: container
      });
    });
    this.events.register(this.sizeChartButton, 'click', function (e) {
      e.preventDefault();
      window.modal.open({
        trigger: _this.sizeChartButton,
        classname: 'product__size-chart-modal',
        content: _this.sizeChartContent
      });
      _this.sizeChartContent.dataset.enabled = true;
    }); // Form

    this.formArea = this.el.querySelector('[data-product-form-area]');
    this.productVariants = this.el.querySelector('[data-variants]');
    this.backInStockForm = this.el.querySelector('[data-back-in-stock-form]');
    this.productFormToggles = this.el.querySelectorAll('[data-selected-variant]');
    this.inventoryRemainingContainer = this.el.querySelector('[data-inventory-remaining]');
    this.inventoryRemainingText = this.el.querySelector('[data-inventory-remaining-count]');
    this.quantityBox = this.el.querySelector('[data-product-quantity-box]');
    this.oneLeft = Shopify.translation.items_left_count_one;
    this.moreLeft = Shopify.translation.items_left_count_other;
    this.variantFields = {
      atcContainer: this.el.querySelector('[data-atc-wrapper]'),
      unavailableText: this.el.querySelector('[data-unavailable-text]'),
      priceContainer: this.el.querySelector('[data-price-container]'),
      price: this.el.querySelector('[data-product-price]'),
      priceCompare: this.el.querySelector('[data-product-price-compare]'),
      atcButton: this.el.querySelector('[data-product-atc]'),
      atcButtonText: this.el.querySelector('[data-product-atc-text]'),
      sku: this.el.querySelector('[data-product-sku]'),
      unitPrice: this.el.querySelector('[data-unit-price]'),
      totalQuantity: this.el.querySelector('[data-total-quantity]'),
      unitPriceAmount: this.el.querySelector('[data-unit-price-amount]'),
      unitPriceMeasure: this.el.querySelector('[data-unit-price-measure]')
    }; // Update featured image on page load

    this.onVariantChange(this.variantsUI.currentVariant);

    if (this.quantityBox) {
      this.productQuantityBox = new QuantitySelector({
        quantityField: this.quantityBox
      });
    }

    this.variantsUI.onVariantChange(function (data) {
      return _this._onSwitchVariant(data);
    }); // Checks if all variant options have been selected

    this.events.register(this.variantFields.atcButton, 'click', function (e) {
      e.preventDefault();

      if (!_this.variantsUI.currentVariant) {
        _this.formArea.classList.add('product-form--error-option-unselected');

        _this.productDetailsContainer.classList.add('product-form--error-option-unselected');
      } else {
        _this.formArea.classList.remove('product-form--error-option-unselected');

        _this.productDetailsContainer.classList.remove('product-form--error-option-unselected');

        if (Shopify.theme_settings.cart_action_type !== 'ajax') {
          _this.formArea.querySelector('[data-product-form]').submit();
        }
      }
    });
  }

  ProductDetails_createClass(ProductDetails, [{
    key: "unload",
    value: function unload() {
      if (this.productQuanityBox) {
        this.productQuantityBox.unload();
      }

      this.surfacePickUp.unload();
      this.variantsUI.unload();
      this.events.unregisterAll();
    }
  }, {
    key: "_updatePrice",
    value: function _updatePrice(variant) {
      var _this$variantFields = this.variantFields,
          unavailableText = _this$variantFields.unavailableText,
          priceContainer = _this$variantFields.priceContainer,
          price = _this$variantFields.price,
          priceCompare = _this$variantFields.priceCompare,
          atcButton = _this$variantFields.atcButton,
          atcButtonText = _this$variantFields.atcButtonText,
          atcContainer = _this$variantFields.atcContainer,
          unitPrice = _this$variantFields.unitPrice,
          totalQuantity = _this$variantFields.totalQuantity,
          unitPriceAmount = _this$variantFields.unitPriceAmount,
          unitPriceMeasure = _this$variantFields.unitPriceMeasure;
      var moneyFormat = document.body.dataset.moneyFormat;
      this.formatMoney = Shopify.currencyHelper.formatMoney;

      if (variant.unit_price && variant.available) {
        this.productUnitPricing.classList.remove('product__unit-price--hidden');
        unitPriceAmount.innerHTML = this.formatMoney(variant.unit_price, moneyFormat);
        unitPriceMeasure.innerHTML = variant.unit_price_measurement.quantity_unit;
        totalQuantity.innerHTML = "".concat(variant.unit_price_measurement.quantity_value).concat(variant.unit_price_measurement.quantity_unit);
      } else {
        this.productUnitPricing.classList.add('product__unit-price--hidden');
      }

      var variantPrice = this.formatMoney(variant.price, moneyFormat);
      var variantComparePrice = this.formatMoney(variant.compare_at_price, moneyFormat); // Display free price text for $0 products

      if (variant.price > 0) {
        price.innerHTML = variantPrice;
      } else if (variant.available) {
        price.innerHTML = Shopify.theme_settings.free_text;
      } else {
        price.innerHTML = '';
      } // Sale scenario


      if (variant.price < variant.compare_at_price) {
        priceContainer.dataset.sale = true;
        priceContainer.dataset.comparePriceVisible = true;
        priceCompare.innerHTML = variantComparePrice;
      } else {
        priceContainer.dataset.sale = false;
        priceContainer.dataset.comparePriceVisible = false;
        priceCompare.innerHTML = '';
      }

      if (atcContainer.dataset.selectedVariant === 'false') {
        atcContainer.dataset.selectedVariant = 'true';
      }

      if (this.productFormToggles) {
        this.productFormToggles.forEach(function (option) {
          var toggle = option;

          if (toggle.dataset.selectedVariant === 'false') {
            toggle.dataset.selectedVariant = 'true';
          }
        });
      } // Checking if variant is available to purchase


      if (!variant) {
        // Unavailable
        atcButtonText.innerText = Shopify.translation.product_unavailable;
        atcButton.disabled = true;
        priceContainer.dataset.unavailable = true;
        unavailableText.innerText = Shopify.translation.product_unavailable;

        if (this.backInStockForm) {
          this.backInStockForm.dataset.formEnabled = false;
        }
      } else if (variant.available) {
        // Available and not sold out
        atcButtonText.innerText = Shopify.translation.product_add_to_cart;
        atcButton.disabled = false;
        priceContainer.dataset.soldOut = false;
        priceContainer.dataset.unavailable = false;

        if (this.backInStockForm) {
          this.backInStockForm.dataset.formEnabled = false;
        }
      } else {
        // Sold out
        atcButtonText.innerText = Shopify.translation.product_sold_out;
        atcButton.disabled = true;
        priceContainer.dataset.soldOut = true;
        priceContainer.dataset.unavailable = false; // If show back in stock form enabled, show form

        if (Shopify.theme_settings.notify_me_form) {
          this.backInStockForm.dataset.formEnabled = true;
        }
      }
    }
  }, {
    key: "_updateSKU",
    value: function _updateSKU(variant) {
      if (!this.variantFields.sku) {
        return;
      }

      if (variant.sku === '') {
        this.variantFields.sku.classList.add('product__sku--empty');
      } else if (variant.sku) {
        this.variantFields.sku.classList.remove('product__sku--empty');
        this.variantFields.sku.innerHTML = variant.sku;
      }
    }
  }, {
    key: "_updateInventoryRemaining",
    value: function _updateInventoryRemaining(_ref) {
      var _this2 = this;

      var available = _ref.available,
          id = _ref.id;

      if (available === undefined) {
        return;
      }

      if (!this.variantInventory) {
        return;
      } // These are taken from the admin settings for the variant


      var _this$variantInventor = this.variantInventory[id],
          inventory_quantity = _this$variantInventor.inventory_quantity,
          inventory_policy = _this$variantInventor.inventory_policy; // Method for updating the inventory remaining text

      var updateInventoryRemainingText = function updateInventoryRemainingText() {
        if (!_this2.inventoryRemainingContainer) {
          return;
        }

        if (!_this2.inventoryRemainingText) {
          return;
        }

        if (!available) {
          _this2.inventoryRemainingContainer.dataset.enabled = false;
          return;
        } // Only show remaining inventory if less than or equal to threshold amount


        if (inventory_quantity <= Shopify.theme_settings.inventory_threshold) {
          _this2.newInventoryQuantity = inventory_quantity;
          _this2.itemsLeftText = _this2.newInventoryQuantity === 1 ? _this2.oneLeft : _this2.moreLeft;
          _this2.inventoryRemainingContainer.dataset.enabled = true;
          _this2.inventoryRemainingText.innerText = "".concat(_this2.newInventoryQuantity, " ").concat(_this2.itemsLeftText);
        } else {
          _this2.inventoryRemainingContainer.dataset.enabled = false;
        }
      }; // Method for updating the quantity box


      var updateQuantityBox = function updateQuantityBox() {
        if (!_this2.quantityBox) {
          return;
        }

        if (!available) {
          _this2.quantityBox.dataset.enabled = false;
          return;
        }

        _this2.quantityBox.dataset.enabled = true; // Sets the limit on the quantity box input

        if (Shopify.theme_settings.limit_quantity && inventory_policy === 'deny') {
          _this2.quantityBox.querySelector('input').setAttribute('max', inventory_quantity);
        } else {
          _this2.quantityBox.querySelector('input').removeAttribute('max');
        }

        _this2.productQuantityBox.refreshQuantity();
      };

      updateInventoryRemainingText();
      updateQuantityBox();
    }
  }, {
    key: "_onSwitchVariant",
    value: function _onSwitchVariant(data) {
      var currentVariant = data.currentVariant;

      if (this.variantsUI.isInIndeterminateState) {
        return;
      }

      this.formArea.classList.remove('product-form--error-option-unselected');
      this.productDetailsContainer.classList.remove('product-form--error-option-unselected');
      this.surfacePickUp.load(currentVariant.id); // Update Variant Information

      this._updatePrice(currentVariant);

      this._updateSKU(currentVariant);

      this._updateInventoryRemaining(currentVariant);

      this.onVariantChange(currentVariant);
    }
  }]);

  return ProductDetails;
}();


// EXTERNAL MODULE: ./node_modules/@pixelunion/breakpoint/dist/cjs/index.js
var cjs = __webpack_require__(646);
// EXTERNAL MODULE: ./node_modules/flickity/js/index.js
var js = __webpack_require__(442);
var js_default = /*#__PURE__*/__webpack_require__.n(js);
// EXTERNAL MODULE: ./node_modules/flickity-imagesloaded/flickity-imagesloaded.js
var flickity_imagesloaded = __webpack_require__(105);
// EXTERNAL MODULE: ./node_modules/flickity-as-nav-for/as-nav-for.js
var as_nav_for = __webpack_require__(541);
;// CONCATENATED MODULE: ./node_modules/drift-zoom/es/util/dom.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// This is not really a perfect check, but works fine.
// From http://stackoverflow.com/questions/384286
var HAS_DOM_2 = (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object";
function isDOMElement(obj) {
  return HAS_DOM_2 ? obj instanceof HTMLElement : obj && _typeof(obj) === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string";
}
function addClasses(el, classNames) {
  classNames.forEach(function (className) {
    el.classList.add(className);
  });
}
function removeClasses(el, classNames) {
  classNames.forEach(function (className) {
    el.classList.remove(className);
  });
}
//# sourceMappingURL=dom.js.map
;// CONCATENATED MODULE: ./node_modules/drift-zoom/es/injectBaseStylesheet.js
/* UNMINIFIED RULES

const RULES = `
@keyframes noop {
  0% { zoom: 1; }
}

@-webkit-keyframes noop {
  0% { zoom: 1; }
}

.drift-zoom-pane.drift-open {
  display: block;
}

.drift-zoom-pane.drift-opening, .drift-zoom-pane.drift-closing {
  animation: noop 1ms;
  -webkit-animation: noop 1ms;
}

.drift-zoom-pane {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.drift-zoom-pane-loader {
  display: none;
}

.drift-zoom-pane img {
  position: absolute;
  display: block;
  max-width: none;
  max-height: none;
}

.drift-bounding-box {
  position: absolute;
  pointer-events: none;
}
`;

*/
var RULES = ".drift-bounding-box,.drift-zoom-pane{position:absolute;pointer-events:none}@keyframes noop{0%{zoom:1}}@-webkit-keyframes noop{0%{zoom:1}}.drift-zoom-pane.drift-open{display:block}.drift-zoom-pane.drift-closing,.drift-zoom-pane.drift-opening{animation:noop 1ms;-webkit-animation:noop 1ms}.drift-zoom-pane{overflow:hidden;width:100%;height:100%;top:0;left:0}.drift-zoom-pane-loader{display:none}.drift-zoom-pane img{position:absolute;display:block;max-width:none;max-height:none}";
function injectBaseStylesheet() {
  if (document.querySelector(".drift-base-styles")) {
    return;
  }

  var styleEl = document.createElement("style");
  styleEl.type = "text/css";
  styleEl.classList.add("drift-base-styles");
  styleEl.appendChild(document.createTextNode(RULES));
  var head = document.head;
  head.insertBefore(styleEl, head.firstChild);
}
//# sourceMappingURL=injectBaseStylesheet.js.map
;// CONCATENATED MODULE: ./node_modules/drift-zoom/es/util/throwIfMissing.js
function throwIfMissing() {
  throw new Error("Missing parameter");
}
//# sourceMappingURL=throwIfMissing.js.map
;// CONCATENATED MODULE: ./node_modules/drift-zoom/es/BoundingBox.js
function BoundingBox_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function BoundingBox_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function BoundingBox_createClass(Constructor, protoProps, staticProps) { if (protoProps) BoundingBox_defineProperties(Constructor.prototype, protoProps); if (staticProps) BoundingBox_defineProperties(Constructor, staticProps); return Constructor; }




var BoundingBox = /*#__PURE__*/function () {
  function BoundingBox(options) {
    BoundingBox_classCallCheck(this, BoundingBox);

    this.isShowing = false;
    var _options$namespace = options.namespace,
        namespace = _options$namespace === void 0 ? null : _options$namespace,
        _options$zoomFactor = options.zoomFactor,
        zoomFactor = _options$zoomFactor === void 0 ? throwIfMissing() : _options$zoomFactor,
        _options$containerEl = options.containerEl,
        containerEl = _options$containerEl === void 0 ? throwIfMissing() : _options$containerEl;
    this.settings = {
      namespace: namespace,
      zoomFactor: zoomFactor,
      containerEl: containerEl
    };
    this.openClasses = this._buildClasses("open");

    this._buildElement();
  }

  BoundingBox_createClass(BoundingBox, [{
    key: "_buildClasses",
    value: function _buildClasses(suffix) {
      var classes = ["drift-".concat(suffix)];
      var ns = this.settings.namespace;

      if (ns) {
        classes.push("".concat(ns, "-").concat(suffix));
      }

      return classes;
    }
  }, {
    key: "_buildElement",
    value: function _buildElement() {
      this.el = document.createElement("div");
      addClasses(this.el, this._buildClasses("bounding-box"));
    }
  }, {
    key: "show",
    value: function show(zoomPaneWidth, zoomPaneHeight) {
      this.isShowing = true;
      this.settings.containerEl.appendChild(this.el);
      var style = this.el.style;
      style.width = "".concat(Math.round(zoomPaneWidth / this.settings.zoomFactor), "px");
      style.height = "".concat(Math.round(zoomPaneHeight / this.settings.zoomFactor), "px");
      addClasses(this.el, this.openClasses);
    }
  }, {
    key: "hide",
    value: function hide() {
      if (this.isShowing) {
        this.settings.containerEl.removeChild(this.el);
      }

      this.isShowing = false;
      removeClasses(this.el, this.openClasses);
    }
  }, {
    key: "setPosition",
    value: function setPosition(percentageOffsetX, percentageOffsetY, triggerRect) {
      var pageXOffset = window.pageXOffset;
      var pageYOffset = window.pageYOffset;
      var inlineLeft = triggerRect.left + percentageOffsetX * triggerRect.width - this.el.clientWidth / 2 + pageXOffset;
      var inlineTop = triggerRect.top + percentageOffsetY * triggerRect.height - this.el.clientHeight / 2 + pageYOffset;

      if (inlineLeft < triggerRect.left + pageXOffset) {
        inlineLeft = triggerRect.left + pageXOffset;
      } else if (inlineLeft + this.el.clientWidth > triggerRect.left + triggerRect.width + pageXOffset) {
        inlineLeft = triggerRect.left + triggerRect.width - this.el.clientWidth + pageXOffset;
      }

      if (inlineTop < triggerRect.top + pageYOffset) {
        inlineTop = triggerRect.top + pageYOffset;
      } else if (inlineTop + this.el.clientHeight > triggerRect.top + triggerRect.height + pageYOffset) {
        inlineTop = triggerRect.top + triggerRect.height - this.el.clientHeight + pageYOffset;
      }

      this.el.style.left = "".concat(inlineLeft, "px");
      this.el.style.top = "".concat(inlineTop, "px");
    }
  }]);

  return BoundingBox;
}();


//# sourceMappingURL=BoundingBox.js.map
;// CONCATENATED MODULE: ./node_modules/drift-zoom/es/Trigger.js
function Trigger_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Trigger_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Trigger_createClass(Constructor, protoProps, staticProps) { if (protoProps) Trigger_defineProperties(Constructor.prototype, protoProps); if (staticProps) Trigger_defineProperties(Constructor, staticProps); return Constructor; }




var Trigger = /*#__PURE__*/function () {
  function Trigger() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    Trigger_classCallCheck(this, Trigger);

    this._show = this._show.bind(this);
    this._hide = this._hide.bind(this);
    this._handleEntry = this._handleEntry.bind(this);
    this._handleMovement = this._handleMovement.bind(this);
    var _options$el = options.el,
        el = _options$el === void 0 ? throwIfMissing() : _options$el,
        _options$zoomPane = options.zoomPane,
        zoomPane = _options$zoomPane === void 0 ? throwIfMissing() : _options$zoomPane,
        _options$sourceAttrib = options.sourceAttribute,
        sourceAttribute = _options$sourceAttrib === void 0 ? throwIfMissing() : _options$sourceAttrib,
        _options$handleTouch = options.handleTouch,
        handleTouch = _options$handleTouch === void 0 ? throwIfMissing() : _options$handleTouch,
        _options$onShow = options.onShow,
        onShow = _options$onShow === void 0 ? null : _options$onShow,
        _options$onHide = options.onHide,
        onHide = _options$onHide === void 0 ? null : _options$onHide,
        _options$hoverDelay = options.hoverDelay,
        hoverDelay = _options$hoverDelay === void 0 ? 0 : _options$hoverDelay,
        _options$touchDelay = options.touchDelay,
        touchDelay = _options$touchDelay === void 0 ? 0 : _options$touchDelay,
        _options$hoverBoundin = options.hoverBoundingBox,
        hoverBoundingBox = _options$hoverBoundin === void 0 ? throwIfMissing() : _options$hoverBoundin,
        _options$touchBoundin = options.touchBoundingBox,
        touchBoundingBox = _options$touchBoundin === void 0 ? throwIfMissing() : _options$touchBoundin,
        _options$namespace = options.namespace,
        namespace = _options$namespace === void 0 ? null : _options$namespace,
        _options$zoomFactor = options.zoomFactor,
        zoomFactor = _options$zoomFactor === void 0 ? throwIfMissing() : _options$zoomFactor,
        _options$boundingBoxC = options.boundingBoxContainer,
        boundingBoxContainer = _options$boundingBoxC === void 0 ? throwIfMissing() : _options$boundingBoxC;
    this.settings = {
      el: el,
      zoomPane: zoomPane,
      sourceAttribute: sourceAttribute,
      handleTouch: handleTouch,
      onShow: onShow,
      onHide: onHide,
      hoverDelay: hoverDelay,
      touchDelay: touchDelay,
      hoverBoundingBox: hoverBoundingBox,
      touchBoundingBox: touchBoundingBox,
      namespace: namespace,
      zoomFactor: zoomFactor,
      boundingBoxContainer: boundingBoxContainer
    };

    if (this.settings.hoverBoundingBox || this.settings.touchBoundingBox) {
      this.boundingBox = new BoundingBox({
        namespace: this.settings.namespace,
        zoomFactor: this.settings.zoomFactor,
        containerEl: this.settings.boundingBoxContainer
      });
    }

    this.enabled = true;

    this._bindEvents();
  }

  Trigger_createClass(Trigger, [{
    key: "_preventDefault",
    value: function _preventDefault(event) {
      event.preventDefault();
    }
  }, {
    key: "_preventDefaultAllowTouchScroll",
    value: function _preventDefaultAllowTouchScroll(event) {
      if (!this.settings.touchDelay || !this._isTouchEvent(event) || this.isShowing) {
        event.preventDefault();
      }
    }
  }, {
    key: "_isTouchEvent",
    value: function _isTouchEvent(event) {
      return !!event.touches;
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      this.settings.el.addEventListener("mouseenter", this._handleEntry, false);
      this.settings.el.addEventListener("mouseleave", this._hide, false);
      this.settings.el.addEventListener("mousemove", this._handleMovement, false);

      if (this.settings.handleTouch) {
        this.settings.el.addEventListener("touchstart", this._handleEntry, false);
        this.settings.el.addEventListener("touchend", this._hide, false);
        this.settings.el.addEventListener("touchmove", this._handleMovement, false);
      } else {
        this.settings.el.addEventListener("touchstart", this._preventDefault, false);
        this.settings.el.addEventListener("touchend", this._preventDefault, false);
        this.settings.el.addEventListener("touchmove", this._preventDefault, false);
      }
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      this.settings.el.removeEventListener("mouseenter", this._handleEntry, false);
      this.settings.el.removeEventListener("mouseleave", this._hide, false);
      this.settings.el.removeEventListener("mousemove", this._handleMovement, false);

      if (this.settings.handleTouch) {
        this.settings.el.removeEventListener("touchstart", this._handleEntry, false);
        this.settings.el.removeEventListener("touchend", this._hide, false);
        this.settings.el.removeEventListener("touchmove", this._handleMovement, false);
      } else {
        this.settings.el.removeEventListener("touchstart", this._preventDefault, false);
        this.settings.el.removeEventListener("touchend", this._preventDefault, false);
        this.settings.el.removeEventListener("touchmove", this._preventDefault, false);
      }
    }
  }, {
    key: "_handleEntry",
    value: function _handleEntry(e) {
      this._preventDefaultAllowTouchScroll(e);

      this._lastMovement = e;

      if (e.type == "mouseenter" && this.settings.hoverDelay) {
        this.entryTimeout = setTimeout(this._show, this.settings.hoverDelay);
      } else if (this.settings.touchDelay) {
        this.entryTimeout = setTimeout(this._show, this.settings.touchDelay);
      } else {
        this._show();
      }
    }
  }, {
    key: "_show",
    value: function _show() {
      if (!this.enabled) {
        return;
      }

      var onShow = this.settings.onShow;

      if (onShow && typeof onShow === "function") {
        onShow();
      }

      this.settings.zoomPane.show(this.settings.el.getAttribute(this.settings.sourceAttribute), this.settings.el.clientWidth, this.settings.el.clientHeight);

      if (this._lastMovement) {
        var touchActivated = this._lastMovement.touches;

        if (touchActivated && this.settings.touchBoundingBox || !touchActivated && this.settings.hoverBoundingBox) {
          this.boundingBox.show(this.settings.zoomPane.el.clientWidth, this.settings.zoomPane.el.clientHeight);
        }
      }

      this._handleMovement();
    }
  }, {
    key: "_hide",
    value: function _hide(e) {
      if (e) {
        this._preventDefaultAllowTouchScroll(e);
      }

      this._lastMovement = null;

      if (this.entryTimeout) {
        clearTimeout(this.entryTimeout);
      }

      if (this.boundingBox) {
        this.boundingBox.hide();
      }

      var onHide = this.settings.onHide;

      if (onHide && typeof onHide === "function") {
        onHide();
      }

      this.settings.zoomPane.hide();
    }
  }, {
    key: "_handleMovement",
    value: function _handleMovement(e) {
      if (e) {
        this._preventDefaultAllowTouchScroll(e);

        this._lastMovement = e;
      } else if (this._lastMovement) {
        e = this._lastMovement;
      } else {
        return;
      }

      var movementX;
      var movementY;

      if (e.touches) {
        var firstTouch = e.touches[0];
        movementX = firstTouch.clientX;
        movementY = firstTouch.clientY;
      } else {
        movementX = e.clientX;
        movementY = e.clientY;
      }

      var el = this.settings.el;
      var rect = el.getBoundingClientRect();
      var offsetX = movementX - rect.left;
      var offsetY = movementY - rect.top;
      var percentageOffsetX = offsetX / this.settings.el.clientWidth;
      var percentageOffsetY = offsetY / this.settings.el.clientHeight;

      if (this.boundingBox) {
        this.boundingBox.setPosition(percentageOffsetX, percentageOffsetY, rect);
      }

      this.settings.zoomPane.setPosition(percentageOffsetX, percentageOffsetY, rect);
    }
  }, {
    key: "isShowing",
    get: function get() {
      return this.settings.zoomPane.isShowing;
    }
  }]);

  return Trigger;
}();


//# sourceMappingURL=Trigger.js.map
;// CONCATENATED MODULE: ./node_modules/drift-zoom/es/ZoomPane.js
function ZoomPane_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ZoomPane_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ZoomPane_createClass(Constructor, protoProps, staticProps) { if (protoProps) ZoomPane_defineProperties(Constructor.prototype, protoProps); if (staticProps) ZoomPane_defineProperties(Constructor, staticProps); return Constructor; }


 // All officially-supported browsers have this, but it's easy to
// account for, just in case.

var divStyle = document.createElement("div").style;
var HAS_ANIMATION = typeof document === "undefined" ? false : "animation" in divStyle || "webkitAnimation" in divStyle;

var ZoomPane = /*#__PURE__*/function () {
  function ZoomPane() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    ZoomPane_classCallCheck(this, ZoomPane);

    this._completeShow = this._completeShow.bind(this);
    this._completeHide = this._completeHide.bind(this);
    this._handleLoad = this._handleLoad.bind(this);
    this.isShowing = false;
    var _options$container = options.container,
        container = _options$container === void 0 ? null : _options$container,
        _options$zoomFactor = options.zoomFactor,
        zoomFactor = _options$zoomFactor === void 0 ? throwIfMissing() : _options$zoomFactor,
        _options$inline = options.inline,
        inline = _options$inline === void 0 ? throwIfMissing() : _options$inline,
        _options$namespace = options.namespace,
        namespace = _options$namespace === void 0 ? null : _options$namespace,
        _options$showWhitespa = options.showWhitespaceAtEdges,
        showWhitespaceAtEdges = _options$showWhitespa === void 0 ? throwIfMissing() : _options$showWhitespa,
        _options$containInlin = options.containInline,
        containInline = _options$containInlin === void 0 ? throwIfMissing() : _options$containInlin,
        _options$inlineOffset = options.inlineOffsetX,
        inlineOffsetX = _options$inlineOffset === void 0 ? 0 : _options$inlineOffset,
        _options$inlineOffset2 = options.inlineOffsetY,
        inlineOffsetY = _options$inlineOffset2 === void 0 ? 0 : _options$inlineOffset2,
        _options$inlineContai = options.inlineContainer,
        inlineContainer = _options$inlineContai === void 0 ? document.body : _options$inlineContai;
    this.settings = {
      container: container,
      zoomFactor: zoomFactor,
      inline: inline,
      namespace: namespace,
      showWhitespaceAtEdges: showWhitespaceAtEdges,
      containInline: containInline,
      inlineOffsetX: inlineOffsetX,
      inlineOffsetY: inlineOffsetY,
      inlineContainer: inlineContainer
    };
    this.openClasses = this._buildClasses("open");
    this.openingClasses = this._buildClasses("opening");
    this.closingClasses = this._buildClasses("closing");
    this.inlineClasses = this._buildClasses("inline");
    this.loadingClasses = this._buildClasses("loading");

    this._buildElement();
  }

  ZoomPane_createClass(ZoomPane, [{
    key: "_buildClasses",
    value: function _buildClasses(suffix) {
      var classes = ["drift-".concat(suffix)];
      var ns = this.settings.namespace;

      if (ns) {
        classes.push("".concat(ns, "-").concat(suffix));
      }

      return classes;
    }
  }, {
    key: "_buildElement",
    value: function _buildElement() {
      this.el = document.createElement("div");
      addClasses(this.el, this._buildClasses("zoom-pane"));
      var loaderEl = document.createElement("div");
      addClasses(loaderEl, this._buildClasses("zoom-pane-loader"));
      this.el.appendChild(loaderEl);
      this.imgEl = document.createElement("img");
      this.el.appendChild(this.imgEl);
    }
  }, {
    key: "_setImageURL",
    value: function _setImageURL(imageURL) {
      this.imgEl.setAttribute("src", imageURL);
    }
  }, {
    key: "_setImageSize",
    value: function _setImageSize(triggerWidth, triggerHeight) {
      this.imgEl.style.width = "".concat(triggerWidth * this.settings.zoomFactor, "px");
      this.imgEl.style.height = "".concat(triggerHeight * this.settings.zoomFactor, "px");
    } // `percentageOffsetX` and `percentageOffsetY` must be percentages
    // expressed as floats between `0' and `1`.

  }, {
    key: "setPosition",
    value: function setPosition(percentageOffsetX, percentageOffsetY, triggerRect) {
      var imgElWidth = this.imgEl.offsetWidth;
      var imgElHeight = this.imgEl.offsetHeight;
      var elWidth = this.el.offsetWidth;
      var elHeight = this.el.offsetHeight;
      var centreOfContainerX = elWidth / 2;
      var centreOfContainerY = elHeight / 2;
      var targetImgXToBeCentre = imgElWidth * percentageOffsetX;
      var targetImgYToBeCentre = imgElHeight * percentageOffsetY;
      var left = centreOfContainerX - targetImgXToBeCentre;
      var top = centreOfContainerY - targetImgYToBeCentre;
      var differenceBetweenContainerWidthAndImgWidth = elWidth - imgElWidth;
      var differenceBetweenContainerHeightAndImgHeight = elHeight - imgElHeight;
      var isContainerLargerThanImgX = differenceBetweenContainerWidthAndImgWidth > 0;
      var isContainerLargerThanImgY = differenceBetweenContainerHeightAndImgHeight > 0;
      var minLeft = isContainerLargerThanImgX ? differenceBetweenContainerWidthAndImgWidth / 2 : 0;
      var minTop = isContainerLargerThanImgY ? differenceBetweenContainerHeightAndImgHeight / 2 : 0;
      var maxLeft = isContainerLargerThanImgX ? differenceBetweenContainerWidthAndImgWidth / 2 : differenceBetweenContainerWidthAndImgWidth;
      var maxTop = isContainerLargerThanImgY ? differenceBetweenContainerHeightAndImgHeight / 2 : differenceBetweenContainerHeightAndImgHeight;

      if (this.el.parentElement === this.settings.inlineContainer) {
        // This may be needed in the future to deal with browser event
        // inconsistencies, but it's difficult to tell for sure.
        // let scrollX = isTouch ? 0 : window.scrollX;
        // let scrollY = isTouch ? 0 : window.scrollY;
        var scrollX = window.pageXOffset;
        var scrollY = window.pageYOffset;
        var inlineLeft = triggerRect.left + percentageOffsetX * triggerRect.width - elWidth / 2 + this.settings.inlineOffsetX + scrollX;
        var inlineTop = triggerRect.top + percentageOffsetY * triggerRect.height - elHeight / 2 + this.settings.inlineOffsetY + scrollY;

        if (this.settings.containInline) {
          if (inlineLeft < triggerRect.left + scrollX) {
            inlineLeft = triggerRect.left + scrollX;
          } else if (inlineLeft + elWidth > triggerRect.left + triggerRect.width + scrollX) {
            inlineLeft = triggerRect.left + triggerRect.width - elWidth + scrollX;
          }

          if (inlineTop < triggerRect.top + scrollY) {
            inlineTop = triggerRect.top + scrollY;
          } else if (inlineTop + elHeight > triggerRect.top + triggerRect.height + scrollY) {
            inlineTop = triggerRect.top + triggerRect.height - elHeight + scrollY;
          }
        }

        this.el.style.left = "".concat(inlineLeft, "px");
        this.el.style.top = "".concat(inlineTop, "px");
      }

      if (!this.settings.showWhitespaceAtEdges) {
        if (left > minLeft) {
          left = minLeft;
        } else if (left < maxLeft) {
          left = maxLeft;
        }

        if (top > minTop) {
          top = minTop;
        } else if (top < maxTop) {
          top = maxTop;
        }
      }

      this.imgEl.style.transform = "translate(".concat(left, "px, ").concat(top, "px)");
      this.imgEl.style.webkitTransform = "translate(".concat(left, "px, ").concat(top, "px)");
    }
  }, {
    key: "_removeListenersAndResetClasses",
    value: function _removeListenersAndResetClasses() {
      this.el.removeEventListener("animationend", this._completeShow, false);
      this.el.removeEventListener("animationend", this._completeHide, false);
      this.el.removeEventListener("webkitAnimationEnd", this._completeShow, false);
      this.el.removeEventListener("webkitAnimationEnd", this._completeHide, false);
      removeClasses(this.el, this.openClasses);
      removeClasses(this.el, this.closingClasses);
    }
  }, {
    key: "show",
    value: function show(imageURL, triggerWidth, triggerHeight) {
      this._removeListenersAndResetClasses();

      this.isShowing = true;
      addClasses(this.el, this.openClasses);

      if (this.imgEl.getAttribute("src") != imageURL) {
        addClasses(this.el, this.loadingClasses);
        this.imgEl.addEventListener("load", this._handleLoad, false);

        this._setImageURL(imageURL);
      }

      this._setImageSize(triggerWidth, triggerHeight);

      if (this._isInline) {
        this._showInline();
      } else {
        this._showInContainer();
      }

      if (HAS_ANIMATION) {
        this.el.addEventListener("animationend", this._completeShow, false);
        this.el.addEventListener("webkitAnimationEnd", this._completeShow, false);
        addClasses(this.el, this.openingClasses);
      }
    }
  }, {
    key: "_showInline",
    value: function _showInline() {
      this.settings.inlineContainer.appendChild(this.el);
      addClasses(this.el, this.inlineClasses);
    }
  }, {
    key: "_showInContainer",
    value: function _showInContainer() {
      this.settings.container.appendChild(this.el);
    }
  }, {
    key: "hide",
    value: function hide() {
      this._removeListenersAndResetClasses();

      this.isShowing = false;

      if (HAS_ANIMATION) {
        this.el.addEventListener("animationend", this._completeHide, false);
        this.el.addEventListener("webkitAnimationEnd", this._completeHide, false);
        addClasses(this.el, this.closingClasses);
      } else {
        removeClasses(this.el, this.openClasses);
        removeClasses(this.el, this.inlineClasses);
      }
    }
  }, {
    key: "_completeShow",
    value: function _completeShow() {
      this.el.removeEventListener("animationend", this._completeShow, false);
      this.el.removeEventListener("webkitAnimationEnd", this._completeShow, false);
      removeClasses(this.el, this.openingClasses);
    }
  }, {
    key: "_completeHide",
    value: function _completeHide() {
      this.el.removeEventListener("animationend", this._completeHide, false);
      this.el.removeEventListener("webkitAnimationEnd", this._completeHide, false);
      removeClasses(this.el, this.openClasses);
      removeClasses(this.el, this.closingClasses);
      removeClasses(this.el, this.inlineClasses);
      this.el.style = ""; // The window could have been resized above or below `inline`
      // limits since the ZoomPane was shown. Because of this, we
      // can't rely on `this._isInline` here.

      if (this.el.parentElement === this.settings.container) {
        this.settings.container.removeChild(this.el);
      } else if (this.el.parentElement === this.settings.inlineContainer) {
        this.settings.inlineContainer.removeChild(this.el);
      }
    }
  }, {
    key: "_handleLoad",
    value: function _handleLoad() {
      this.imgEl.removeEventListener("load", this._handleLoad, false);
      removeClasses(this.el, this.loadingClasses);
    }
  }, {
    key: "_isInline",
    get: function get() {
      var inline = this.settings.inline;
      return inline === true || typeof inline === "number" && window.innerWidth <= inline;
    }
  }]);

  return ZoomPane;
}();


//# sourceMappingURL=ZoomPane.js.map
;// CONCATENATED MODULE: ./node_modules/drift-zoom/es/Drift.js
function Drift_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Drift_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Drift_createClass(Constructor, protoProps, staticProps) { if (protoProps) Drift_defineProperties(Constructor.prototype, protoProps); if (staticProps) Drift_defineProperties(Constructor, staticProps); return Constructor; }






var Drift = /*#__PURE__*/function () {
  function Drift(triggerEl) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    Drift_classCallCheck(this, Drift);

    this.VERSION = "1.4.3";
    this.triggerEl = triggerEl;
    this.destroy = this.destroy.bind(this);

    if (!isDOMElement(this.triggerEl)) {
      throw new TypeError("`new Drift` requires a DOM element as its first argument.");
    } // Prefix for generated element class names (e.g. `my-ns` will
    // result in classes such as `my-ns-pane`. Default `drift-`
    // prefixed classes will always be added as well.


    var namespace = options["namespace"] || null; // Whether the ZoomPane should show whitespace when near the edges.

    var showWhitespaceAtEdges = options["showWhitespaceAtEdges"] || false; // Whether the inline ZoomPane should stay inside
    // the bounds of its image.

    var containInline = options["containInline"] || false; // How much to offset the ZoomPane from the
    // interaction point when inline.

    var inlineOffsetX = options["inlineOffsetX"] || 0;
    var inlineOffsetY = options["inlineOffsetY"] || 0; // A DOM element to append the inline ZoomPane to

    var inlineContainer = options["inlineContainer"] || document.body; // Which trigger attribute to pull the ZoomPane image source from.

    var sourceAttribute = options["sourceAttribute"] || "data-zoom"; // How much to magnify the trigger by in the ZoomPane.
    // (e.g., `zoomFactor: 3` will result in a 900 px wide ZoomPane imag
    // if the trigger is displayed at 300 px wide)

    var zoomFactor = options["zoomFactor"] || 3; // A DOM element to append the non-inline ZoomPane to.
    // Required if `inlinePane !== true`.

    var paneContainer = options["paneContainer"] === undefined ? document.body : options["paneContainer"]; // When to switch to an inline ZoomPane. This can be a boolean or
    // an integer. If `true`, the ZoomPane will always be inline,
    // if `false`, it will switch to inline when `windowWidth <= inlinePane`

    var inlinePane = options["inlinePane"] || 375; // If `true`, touch events will trigger the zoom, like mouse events.

    var handleTouch = "handleTouch" in options ? !!options["handleTouch"] : true; // If present (and a function), this will be called
    // whenever the ZoomPane is shown.

    var onShow = options["onShow"] || null; // If present (and a function), this will be called
    // whenever the ZoomPane is hidden.

    var onHide = options["onHide"] || null; // Add base styles to the page. See the "Theming"
    // section of README.md for more information.

    var injectBaseStyles = "injectBaseStyles" in options ? !!options["injectBaseStyles"] : true; // An optional number that determines how long to wait before
    // showing the ZoomPane because of a `mouseenter` event.

    var hoverDelay = options["hoverDelay"] || 0; // An optional number that determines how long to wait before
    // showing the ZoomPane because of a `touchstart` event.
    // It's unlikely that you would want to use this option, since
    // "tap and hold" is much more intentional than a hover event.

    var touchDelay = options["touchDelay"] || 0; // If true, a bounding box will show the area currently being previewed
    // during mouse hover

    var hoverBoundingBox = options["hoverBoundingBox"] || false; // If true, a bounding box will show the area currently being previewed
    // during touch events

    var touchBoundingBox = options["touchBoundingBox"] || false; // A DOM element to append the bounding box to.

    var boundingBoxContainer = options["boundingBoxContainer"] || document.body;

    if (inlinePane !== true && !isDOMElement(paneContainer)) {
      throw new TypeError("`paneContainer` must be a DOM element when `inlinePane !== true`");
    }

    if (!isDOMElement(inlineContainer)) {
      throw new TypeError("`inlineContainer` must be a DOM element");
    }

    this.settings = {
      namespace: namespace,
      showWhitespaceAtEdges: showWhitespaceAtEdges,
      containInline: containInline,
      inlineOffsetX: inlineOffsetX,
      inlineOffsetY: inlineOffsetY,
      inlineContainer: inlineContainer,
      sourceAttribute: sourceAttribute,
      zoomFactor: zoomFactor,
      paneContainer: paneContainer,
      inlinePane: inlinePane,
      handleTouch: handleTouch,
      onShow: onShow,
      onHide: onHide,
      injectBaseStyles: injectBaseStyles,
      hoverDelay: hoverDelay,
      touchDelay: touchDelay,
      hoverBoundingBox: hoverBoundingBox,
      touchBoundingBox: touchBoundingBox,
      boundingBoxContainer: boundingBoxContainer
    };

    if (this.settings.injectBaseStyles) {
      injectBaseStylesheet();
    }

    this._buildZoomPane();

    this._buildTrigger();
  }

  Drift_createClass(Drift, [{
    key: "_buildZoomPane",
    value: function _buildZoomPane() {
      this.zoomPane = new ZoomPane({
        container: this.settings.paneContainer,
        zoomFactor: this.settings.zoomFactor,
        showWhitespaceAtEdges: this.settings.showWhitespaceAtEdges,
        containInline: this.settings.containInline,
        inline: this.settings.inlinePane,
        namespace: this.settings.namespace,
        inlineOffsetX: this.settings.inlineOffsetX,
        inlineOffsetY: this.settings.inlineOffsetY,
        inlineContainer: this.settings.inlineContainer
      });
    }
  }, {
    key: "_buildTrigger",
    value: function _buildTrigger() {
      this.trigger = new Trigger({
        el: this.triggerEl,
        zoomPane: this.zoomPane,
        handleTouch: this.settings.handleTouch,
        onShow: this.settings.onShow,
        onHide: this.settings.onHide,
        sourceAttribute: this.settings.sourceAttribute,
        hoverDelay: this.settings.hoverDelay,
        touchDelay: this.settings.touchDelay,
        hoverBoundingBox: this.settings.hoverBoundingBox,
        touchBoundingBox: this.settings.touchBoundingBox,
        namespace: this.settings.namespace,
        zoomFactor: this.settings.zoomFactor,
        boundingBoxContainer: this.settings.boundingBoxContainer
      });
    }
  }, {
    key: "setZoomImageURL",
    value: function setZoomImageURL(imageURL) {
      this.zoomPane._setImageURL(imageURL);
    }
  }, {
    key: "disable",
    value: function disable() {
      this.trigger.enabled = false;
    }
  }, {
    key: "enable",
    value: function enable() {
      this.trigger.enabled = true;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.trigger._hide();

      this.trigger._unbindEvents();
    }
  }, {
    key: "isShowing",
    get: function get() {
      return this.zoomPane.isShowing;
    }
  }, {
    key: "zoomFactor",
    get: function get() {
      return this.settings.zoomFactor;
    },
    set: function set(zf) {
      this.settings.zoomFactor = zf;
      this.zoomPane.settings.zoomFactor = zf;
      this.trigger.settings.zoomFactor = zf;
      this.boundingBox.settings.zoomFactor = zf;
    }
  }]);

  return Drift;
}(); // Public API

/* eslint-disable no-self-assign */



Object.defineProperty(Drift.prototype, "isShowing", {
  get: function get() {
    return this.isShowing;
  }
});
Object.defineProperty(Drift.prototype, "zoomFactor", {
  get: function get() {
    return this.zoomFactor;
  },
  set: function set(value) {
    this.zoomFactor = value;
  }
});
Drift.prototype["setZoomImageURL"] = Drift.prototype.setZoomImageURL;
Drift.prototype["disable"] = Drift.prototype.disable;
Drift.prototype["enable"] = Drift.prototype.enable;
Drift.prototype["destroy"] = Drift.prototype.destroy;
/* eslint-enable no-self-assign */
//# sourceMappingURL=Drift.js.map
// EXTERNAL MODULE: ./node_modules/plyr/dist/plyr.min.js
var plyr_min = __webpack_require__(443);
var plyr_min_default = /*#__PURE__*/__webpack_require__.n(plyr_min);
;// CONCATENATED MODULE: ./source/scripts/components/Video.js
function Video_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Video_ownKeys(Object(source), true).forEach(function (key) { Video_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { Video_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Video_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Video_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Video_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Video_createClass(Constructor, protoProps, staticProps) { if (protoProps) Video_defineProperties(Constructor.prototype, protoProps); if (staticProps) Video_defineProperties(Constructor, staticProps); return Constructor; }



var Video_Video = /*#__PURE__*/function () {
  function Video(videos, options) {
    var _this = this;

    Video_classCallCheck(this, Video);

    var playerControls = {
      playButtonIcon: '<button type="button" class="plyr__control plyr__control--overlaid" aria-label="Play, {title}" data-plyr="play"><svg class="play-icon-button-control" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23 20V40L39 29.4248L23 20Z" fill="#323232"/></svg><span class="plyr__sr-only">Play</span></button>',
      playButton: '<button type="button" class="plyr__controls__item plyr__control" aria-label="Play, {title}" data-plyr="play"><svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg><svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg><span class="label--pressed plyr__tooltip" role="tooltip">Pause</span><span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span></button>',
      muteButton: '<button type="button" class="plyr__controls__item plyr__control" aria-label="Mute" data-plyr="mute"><svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg><svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg><span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span><span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span></button>',
      progressInput: '<div class="plyr__controls__item plyr__progress__container"><div class="plyr__progress"><input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek"><progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress><span role="tooltip" class="plyr__tooltip">00:00</span></div></div>',
      volume: '<div class="plyr__controls__item plyr__volume"><input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume"></div>',
      fullscreen: '<button type="button" class="plyr__controls__item plyr__control" data-plyr="fullscreen"><svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg><svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg><span class="label--pressed plyr__tooltip" role="tooltip">Exit fullscreen</span><span class="label--not-pressed plyr__tooltip" role="tooltip">Enter fullscreen</span></button>'
    };
    var controls = "".concat(playerControls.playButtonIcon, " <div class=\"plyr__controls\"> ").concat(playerControls.playButton, " ").concat(playerControls.progressInput, " ").concat(playerControls.muteButton, " ").concat(playerControls.volume, " ").concat(playerControls.fullscreen, " </div>");
    var defaultConfig = {
      controls: controls,
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: true
      },
      storage: {
        enabled: false
      }
    };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);

    if (options) {
      this.config = _objectSpread(_objectSpread({}, options), defaultConfig);
    } else {
      this.config = defaultConfig;
    }

    if (videos.length > 1) {
      this.player = plyr_min_default().setup(videos, this.config);

      if (!this.player) {
        return;
      } // Adds plyr video id to video wrapper for html5 and vimeo videos


      this.player.forEach(function (player) {
        var provider = player.provider,
            id = player.id;
        var video;

        if (provider === 'html5') {
          video = player.elements.wrapper.querySelector('video');
          video.setAttribute('data-plyr-video-id', id);
        }

        if (provider === 'vimeo') {
          player.on('ready', function (event) {
            var instance = event.detail.plyr;
            video = player.elements.wrapper;
            video.setAttribute('data-plyr-video-id', instance.id);
          });
        }
      });
    } else {
      this.player = new (plyr_min_default())(videos, this.config);

      if (!this.player) {
        return;
      } // Adds plyr video id to video wrapper for html5 and vimeo videos


      var _this$player = this.player,
          provider = _this$player.provider,
          id = _this$player.id;
      var video;

      if (provider === 'html5') {
        video = this.player.elements.wrapper.querySelector('video');
        video.setAttribute('data-plyr-video-id', id);
      }

      if (provider === 'vimeo') {
        this.player.on('ready', function (event) {
          var instance = event.detail.plyr;
          video = _this.player.elements.wrapper;
          video.setAttribute('data-plyr-video-id', instance.id);
        });
      }
    }
  }

  Video_createClass(Video, [{
    key: "play",
    value: function play() {
      if (this.player) {
        this.player.play();
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.player) {
        this.player.pause();
      }
    }
  }, {
    key: "unload",
    value: function unload() {
      if (!this.player) {
        return;
      }

      if (this.player.length > 1) {
        this.player.forEach(function (player) {
          return player.destroy();
        });
      } else {
        this.player.destroy();
      }
    }
  }]);

  return Video;
}();


// EXTERNAL MODULE: ./node_modules/photoswipe/dist/photoswipe.js
var photoswipe = __webpack_require__(832);
var photoswipe_default = /*#__PURE__*/__webpack_require__.n(photoswipe);
// EXTERNAL MODULE: ./node_modules/photoswipe/dist/photoswipe-ui-default.js
var photoswipe_ui_default = __webpack_require__(411);
var photoswipe_ui_default_default = /*#__PURE__*/__webpack_require__.n(photoswipe_ui_default);
;// CONCATENATED MODULE: ./source/scripts/components/GalleryModal.js
function GalleryModal_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function GalleryModal_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function GalleryModal_createClass(Constructor, protoProps, staticProps) { if (protoProps) GalleryModal_defineProperties(Constructor.prototype, protoProps); if (staticProps) GalleryModal_defineProperties(Constructor, staticProps); return Constructor; }




var GalleryModal = /*#__PURE__*/function () {
  function GalleryModal() {
    GalleryModal_classCallCheck(this, GalleryModal);

    this.modalTarget = document.querySelector('[data-pswp]');
    this.modal = '';
  }

  GalleryModal_createClass(GalleryModal, [{
    key: "init",
    value: function init(imageArray) {
      var selectedIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (!this.modalTarget) {
        return;
      }

      var options = {
        index: selectedIndex,
        fullscreenEl: false,
        zoomEl: false,
        shareEl: false,
        counterEl: false,
        arrowEl: true,
        preloaderEl: false,
        closeOnScroll: false,
        showHideOpacity: true,
        history: false,
        loop: true,
        clickToCloseNonZoomable: false,
        timeToIdle: false,
        timeToIdleOutside: false
      };
      this.modal = new (photoswipe_default())(this.modalTarget, (photoswipe_ui_default_default()), imageArray, options);
      this.modal.init();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.modal) {
        this.modal.destroy();
      }
    }
  }]);

  return GalleryModal;
}();


;// CONCATENATED MODULE: ./source/scripts/components/ProductGallery.js
function ProductGallery_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductGallery_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductGallery_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductGallery_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductGallery_defineProperties(Constructor, staticProps); return Constructor; }











var ProductGallery = /*#__PURE__*/function () {
  function ProductGallery(options) {
    var _this = this;

    ProductGallery_classCallCheck(this, ProductGallery);

    this.el = options.el;
    this.galleryElements = {
      gallery: this.el.querySelector('[data-main-gallery]'),
      thumbnailGallery: this.el.querySelector('[data-thumbnail-gallery]'),
      slides: this.el.querySelectorAll('[data-product-gallery-slide]'),
      thumbnails: this.el.querySelectorAll('[data-gallery-thumbnail]'),
      arrowShape: 'M95.04 46 21.68 46 48.18 22.8 42.91 16.78 4.96 50 42.91 83.22 48.18 77.2 21.68 54 95.04 54 95.04 46z'
    };
    this.gallerySettings = options.settings;
    if (!this.galleryElements.gallery) return;
    this.events = new EventHandler/* default */.Z();
    var _this$galleryElements = this.galleryElements,
        gallery = _this$galleryElements.gallery,
        thumbnailGallery = _this$galleryElements.thumbnailGallery,
        slides = _this$galleryElements.slides,
        thumbnails = _this$galleryElements.thumbnails,
        arrowShape = _this$galleryElements.arrowShape;
    var _this$gallerySettings = this.gallerySettings,
        mediaCount = _this$gallerySettings.mediaCount,
        slideshowSpeed = _this$gallerySettings.slideshowSpeed,
        slideshowAnimation = _this$gallerySettings.slideshowAnimation,
        thumbnailSliderEnabled = _this$gallerySettings.thumbnailSliderEnabled,
        thumbnailsArrowsEnabled = _this$gallerySettings.thumbnailsArrowsEnabled,
        thumbnailsPosition = _this$gallerySettings.thumbnailsPosition,
        zoomEnabled = _this$gallerySettings.zoomEnabled,
        lightboxEnabled = _this$gallerySettings.lightboxEnabled,
        loopingEnabled = _this$gallerySettings.loopingEnabled;
    var thumbnailsEnabled = this.gallerySettings.thumbnailsEnabled !== 'disabled';
    dist_index_es.watch(gallery);

    if (thumbnailGallery) {
      dist_index_es.watch(thumbnailGallery);
    } // Initialize Flickity for main gallery


    this.flickity = new (js_default())(gallery, {
      wrapAround: true,
      adaptiveHeight: true,
      dragThreshold: 10,
      imagesLoaded: true,
      pageDots: mediaCount > 1,
      prevNextButtons: mediaCount > 1,
      autoPlay: slideshowSpeed * 1000,
      fade: slideshowAnimation === 'fade',
      watchCSS: false,
      arrowShape: arrowShape,
      accessibility: false // Flickity's inherent "accessibility" actually makes it worse

    }); // Arrows added after Flickity initialized

    this.arrows = this.el.querySelectorAll('.flickity-prev-next-button');
    var videos = gallery.querySelectorAll('[data-html5-video] video, [data-external-video]');
    this.galleryVideos = new Video_Video(videos, {
      loop: {
        active: loopingEnabled
      }
    });
    Object.keys(this.galleryVideos).forEach(function (player) {
      _this.videoPlayers = _this.galleryVideos[player];
    });

    if (!Array.isArray(this.videoPlayers)) {
      this.players = [];
      this.players.push(this.videoPlayers);
    } else {
      this.players = this.videoPlayers;
    }

    this.playVideo = function (type, host, id) {
      _this.players.forEach(function (player) {
        if (player.playing) {
          player.pause();
        }

        if (type === 'video' && player.id === id) {
          player.play();
        }

        if (type === 'external_video') {
          if (host === 'youtube' && player.media.id === id) {
            player.play();
          }

          if (host === 'vimeo' && player.id === id) {
            player.play();
          }
        } // On fullscreen exit, focus on the thumbnail carousel


        player.on('exitfullscreen', function () {
          if (thumbnailGallery) {
            thumbnailGallery.focus();
          }
        });
      });
    };

    this.playModel = function (model) {
      model.play();
    };

    this.disableFlickityDrag = function () {
      _this.flickity.options.draggable = false;

      _this.flickity.updateDraggable();
    };

    this.enableFlickityDrag = function () {
      _this.flickity.options.draggable = true;

      _this.flickity.updateDraggable();
    };

    this.initModal = function () {
      if (!_this.lightboxImages) {
        return;
      }

      _this.lightboxImages.forEach(function (image, selectedIndex) {
        var href = image.href,
            dataset = image.dataset;
        var item = {
          src: href,
          w: dataset.imageWidth,
          h: dataset.imageHeight
        };

        _this.lightboxImageArray.push(item);

        _this.events.register(image, 'click', function (e) {
          e.preventDefault();

          _this.modal.init(_this.lightboxImageArray, selectedIndex);
        });
      });
    };

    this._updateTabindex = function () {
      // We need to remove tabindex from the slides that are not currently
      // selected, so that slides not currently shown cannot receive keyboard focus.
      slides.forEach(function (slide, i) {
        var links = slide.querySelectorAll('a');
        var isVisible = _this.flickity.selectedIndex === i;
        slide.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
        links.forEach(function (link) {
          return link.setAttribute('tabindex', isVisible ? '0' : '-1');
        });
      });
    }; // Lightbox


    if (lightboxEnabled) {
      this.lightboxImages = this.el.querySelectorAll('[data-product-gallery-modal]');
      this.lightboxImageArray = [];
      this.modal = new GalleryModal();

      if (this.lightboxImages.length > 0) {
        this.initModal();
      }
    }

    this._updateTabindex(); // Handling models and videos during Flickity change event


    this.flickity.on('change', function () {
      slides.forEach(function (slide) {
        var mediaType = slide.getAttribute('data-media-type');

        if (slide.classList.contains('is-selected')) {
          switch (mediaType) {
            case 'model':
              if (cjs/* min */.VV('L')) {
                // On mouseenter event, unbind flickity
                _this.events.register(slide, 'mouseenter', _this.disableFlickityDrag); // On mouseleave event, bind flickity


                _this.events.register(slide, 'mouseleave', _this.enableFlickityDrag);
              } // Listen for model play/pause events


              _this.events.register(slide.querySelector('model-viewer'), 'shopify_model_viewer_ui_toggle_play', _this.disableFlickityDrag);

              _this.events.register(slide.querySelector('model-viewer'), 'shopify_model_viewer_ui_toggle_pause', _this.enableFlickityDrag);

              break;

            default:
          }
        } else {
          // Below logic deals with the hidden slides when a flickity change is triggered
          switch (mediaType) {
            case 'video':
              {
                var videoID = parseInt(slide.querySelector('video').getAttribute('data-plyr-video-id'), 10);

                if (_this.players && videoID) {
                  _this.players.forEach(function (player) {
                    if (player.id === videoID) {
                      player.pause();
                    }
                  });
                }

                break;
              }

            case 'external_video':
              {
                var host = slide.getAttribute('data-media-host');

                if (_this.players) {
                  _this.players.forEach(function (player) {
                    if (host === 'youtube') {
                      var iframeID = slide.querySelector('iframe').getAttribute('id');

                      if (player.media.id === iframeID) {
                        player.pause();
                      }
                    }

                    if (host === 'vimeo') {
                      var videoWrapper = slide.querySelector('[data-plyr-video-id]');

                      if (!videoWrapper) {
                        return;
                      }

                      var _videoID = parseInt(videoWrapper.getAttribute('data-plyr-video-id'), 10);

                      if (player.id === _videoID) {
                        player.pause();
                      }
                    }
                  });
                }

                break;
              }

            default:
          }
        }
      });

      _this._updateTabindex();
    });
    this.flickity.on('settle', function () {
      // Ensures Flickity is not collapsed when loaded
      _this.resizeFlickity(); // If zoom enabled, initiate Drift on gallery images


      if (zoomEnabled && cjs/* min */.VV('L')) {
        var selectedSlide = _this.el.querySelector('.product-gallery__slide.is-selected');

        if (!selectedSlide) {
          return;
        }

        var selectedImage = selectedSlide.querySelector('[data-rimg]');

        if (!selectedImage) {
          return;
        }

        selectedImage.setAttribute('data-zoom', selectedSlide.getAttribute('data-zoom'));
        _this.drift = new Drift(selectedImage, {
          paneContainer: selectedSlide
        });
      } // If lightbox enabled, disable pointer events when dragging


      if (lightboxEnabled) {
        _this.flickity.on('dragStart', function () {
          _this.el.querySelector('.product-gallery__slide.is-selected').style.pointerEvents = 'none';
        });

        _this.flickity.on('dragEnd', function () {
          _this.el.querySelector('.product-gallery__slide.is-selected').style.pointerEvents = 'all';
        });
      }
    });

    this.resizeFlickity = function () {
      _this.flickity.resize();
    };

    this.resizeThumbnailFlickity = function () {
      if (_this.thumbnailFlickity) {
        _this.thumbnailFlickity.resize();
      }
    };

    this.handleSlideMedia = function () {
      _this.flickity.stopPlayer();

      _this.flickity.on('settle', function () {
        var slide = gallery.querySelector('.product-gallery__slide.is-selected');
        var mediaType = slide.getAttribute('data-media-type');
        var host = slide.getAttribute('data-media-host');

        if (mediaType === 'video') {
          var videoID = parseInt(slide.querySelector('video').getAttribute('data-plyr-video-id'), 10);

          _this.playVideo('video', host, videoID);
        }

        if (mediaType === 'external_video') {
          if (host === 'youtube') {
            var iframeID = slide.querySelector('iframe').getAttribute('id');

            _this.playVideo('external_video', host, iframeID);
          }

          if (host === 'vimeo') {
            var _videoID2 = parseInt(slide.querySelector('[data-plyr-video-id]').getAttribute('data-plyr-video-id'), 10);

            _this.playVideo('external_video', host, _videoID2);
          }
        }

        if (mediaType === 'model') {
          if (_this.models) {
            _this.models.forEach(function (model) {
              var modelSlide = model.container.closest('.product-gallery__slide');

              if (modelSlide.classList.contains('is-selected')) {
                _this.playModel(model);
              }
            });
          }
        }
      });

      _this.flickity.off('settle');
    };

    this.events.register(window, 'load', this.resizeFlickity); // Logic for selected slide on page load

    slides.forEach(function (slide) {
      var mediaType = slide.getAttribute('data-media-type');

      if (slide.classList.contains('is-selected')) {
        if (mediaType === 'model' && cjs/* min */.VV('L')) {
          _this.events.register(slide, 'mouseenter', _this.disableFlickityDrag);

          _this.events.register(slide, 'mouseleave', _this.enableFlickityDrag);
        }
      }
    });

    if ((thumbnailsArrowsEnabled || thumbnailsEnabled) && cjs/* min */.VV('L')) {
      if (this.arrows) {
        this.arrows.forEach(function (arrow) {
          // Clicking slider arrows
          _this.events.register(arrow, 'click', _this.handleSlideMedia);
        });
      }

      if (thumbnails) {
        thumbnails.forEach(function (thumbnail, index) {
          // Clicking thumbnails
          _this.events.register(thumbnail, 'click', function () {
            _this.flickity.select(index);
          });

          _this.events.register(thumbnail, 'click', _this.handleSlideMedia);
        });
      }
    } // Thumbnail gallery


    if (thumbnailsEnabled) {
      if (thumbnailSliderEnabled && slides.length > 1) {
        if (cjs/* min */.VV('S')) {
          if (thumbnailsPosition === 'bottom-thumbnails') {
            this.thumbnailFlickity = new (js_default())(thumbnailGallery, {
              wrapAround: true,
              cellAlign: 'left',
              contain: true,
              groupCells: '80%',
              imagesLoaded: true,
              pageDots: false,
              prevNextButtons: thumbnails.length > 5 ? thumbnailsArrowsEnabled : false,
              asNavFor: gallery,
              arrowShape: arrowShape
            }); // Ensures Flickity is not collapsed when loaded

            this.thumbnailFlickity.on('settle', function () {
              _this.thumbnailFlickity.resize();
            });
            this.events.register(window, 'load', this.resizeThumbnailFlickity); // Once thumbnail is focused, move carousel to that cell

            thumbnails.forEach(function (thumbnail, index) {
              _this.events.register(thumbnail, 'focus', function () {
                _this.thumbnailFlickity.select(index);
              });
            });
          }
        } else {
          // Create standard thumbnail slider
          this.thumbnailFlickity = new (js_default())(thumbnailGallery, {
            wrapAround: true,
            cellAlign: 'left',
            contain: true,
            groupCells: true,
            imagesLoaded: true,
            pageDots: false,
            prevNextButtons: false,
            asNavFor: gallery,
            arrowShape: arrowShape
          });
        }

        this.events.register(window, 'resize', this.resizeThumbnailFlickity);
      } else {
        // If thumbnail slider is disabled, ensure thumbnails still link to product images
        thumbnails.forEach(function (thumbnail, index) {
          _this.events.register(thumbnail, 'click', function () {
            _this.flickity.select(index);
          });
        });
      }
    } // 3D Model setup with default control list


    this.modelsConfig = {
      controls: ['zoom-in', 'zoom-out', 'fullscreen'],
      focusOnPlay: false
    }; // Loading product media libraries

    window.Shopify.loadFeatures([{
      name: 'shopify-xr',
      version: '1.0'
    }, {
      name: 'model-viewer-ui',
      version: '1.0'
    }], function () {
      _this.models = [];
      _this.modelElements = _this.el.querySelectorAll('model-viewer');

      if (_this.modelElements) {
        _this.modelElements.forEach(function (modelViewer) {
          var model = new Shopify.ModelViewerUI(modelViewer, _this.modelsConfig);

          _this.models.push(model);
        });
      }
    });
  }

  ProductGallery_createClass(ProductGallery, [{
    key: "updateGalleryImageByVariant",
    value: function updateGalleryImageByVariant(variant) {
      if (this.flickity && variant.featured_media) {
        var index = this.galleryElements.gallery.querySelector("[data-image-id=\"".concat(variant.featured_media.id, "\"]")).getAttribute('data-index');
        this.flickity.select(index, false, true);
      }
    }
  }, {
    key: "unload",
    value: function unload() {
      if (this.flickity) {
        this.flickity.destroy();
      }

      if (this.thumbnailFlickity) {
        this.thumbnailFlickity.destroy();
      }

      if (this.drift) {
        this.drift.disable();
        this.drift = null;
      }

      if (this.galleryVideos) {
        this.galleryVideos.unload();
      }

      if (this.events) {
        this.events.unregisterAll();
      }
    }
  }]);

  return ProductGallery;
}();


;// CONCATENATED MODULE: ./node_modules/@pixelunion/animations/dist/animations.es.js

  /*!
   * @pixelunion/animations v0.1.0
   * (c) 2019 Pixel Union
   * Released under the UNLICENSED license.
  */

function animations_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function animations_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function animations_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) animations_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) animations_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

function animations_es_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function animations_es_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function animations_es_objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      animations_es_ownKeys(source, true).forEach(function (key) {
        animations_es_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      animations_es_ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/**
 * Promisified version of window.requestAnimationFrame.
 * @returns {Promise} Promise will resolve when requestAnimationFrame callback is run.
 */
function raf() {
  return new Promise(function (resolve) {
    window.requestAnimationFrame(resolve);
  });
}
/**
 * Represents an HTML element with associate states
 */


var Animation =
/*#__PURE__*/
function () {
  /**
   * @param {Object} options
   * @param {HTMLElement}  options.el Target element
   * @param {String} [options.state=initial] Initial state. This is also the default state.
   * @param {String} [options.stateAttribute=data-revealer] Attribute name to update with state.
   * @param {String} [options.stateChangeAttribute=data-revealer-transition] Attribute name to
   * update with change of state.
   * @param {String} [options.endEvent=transitionend] Event to listen for at end of state change.
   * @param {Boolean} [options.hold=false] If true, changeAttribute will not be removed until the
   * next state change.
   * @param {Function} [options.onStart] Callback to execute immediate after
   * applying stateChangeAttribute.
   */
  function Animation(options) {
    animations_es_classCallCheck(this, Animation);

    this._el = options.el;
    this.cancelRunning = null;
    this._state = options.state || 'initial';
    this.initialState = this._state;
    this.stateAttribute = options.stateAttribute || 'data-animation-state';
    this.stateChangeAttribute = options.stateChangeAttribute || 'data-animation';
    this.endEvent = options.endEvent || 'transitionend';
    this.hold = !!options.hold;

    this.onStart = options.onStart || function () {
      /* do nothing */
    };

    this.activeEventHandler = null;
  }
  /**
   * Returns target element
   *
   * @return {HTMLElement} Target element
   */


  animations_es_createClass(Animation, [{
    key: "isState",

    /**
     * Check if a state is active
     * @param {String} state State to compare
     *
     * @return {Boolean}
     */
    value: function isState(state) {
      return state === this._state;
    }
    /**
     * Sequences a change to a new state.
     * @param {String} state Target state
     *
     * @param {Boolean} options.force Switch to final state immediately
     *
     * @param {Function} options.onStart Callback to execute immediately after
     * applying stateChangeAttribute for this state change only.
     *
     * @param {Boolean} [options.hold=false] If true, changeAttribute will not be removed until the
     * next state change.
     *
     * @return {Promise} Resolves when endEvent triggered
     */

  }, {
    key: "animateTo",
    value: function animateTo(state) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var from = this._el.dataset[this.stateAttribute] || this._state;
      var to = state || this.initialState;
      var force = options.force;
      var hold = 'hold' in options ? options.hold : this.hold;
      return new Promise(function (resolve) {
        if (_this.cancelRunning) {
          _this.cancelRunning();
        }

        if (from === to) {
          // Removing this here fixes some lingering attributes. But why?
          _this._el.removeAttribute(_this.stateChangeAttribute);

          resolve(from, null);
          return;
        }

        var running = true;

        _this.cancelRunning = function () {
          running = false;
          resolve(null, null);
        };

        _this._el.removeEventListener(_this.endEvent, _this.activeEventHandler);

        _this.activeEventHandler = null;

        if (force) {
          _this._el.setAttribute(_this.stateChangeAttribute, "".concat(from, "=>").concat(to));

          _this.onStart({
            el: _this._el,
            from: from,
            to: to
          });

          if (typeof options.onStart === 'function') {
            options.onStart({
              el: _this._el,
              from: from,
              to: to
            });
          }

          _this._el.setAttribute(_this.stateAttribute, to);

          _this._state = to;

          if (!hold) {
            _this._el.removeAttribute(_this.stateChangeAttribute);
          }

          resolve(to, null);
          return;
        }

        raf().then(function () {
          if (!running) throw new Error('cancelled');

          _this._el.setAttribute(_this.stateChangeAttribute, "".concat(from, "=>").concat(to));

          _this.onStart({
            el: _this._el,
            from: from,
            to: to
          });

          if (typeof options.onStart === 'function') {
            options.onStart({
              el: _this._el,
              from: from,
              to: to
            });
          }

          return raf();
        }).then(function () {
          if (!running) throw new Error('cancelled');

          _this._el.removeEventListener(_this.endEvent, _this.activeEventHandler);

          _this.activeEventHandler = function (e) {
            // Ignore any events bubbling up
            if (e.target !== _this._el || !running) return;

            _this._el.removeEventListener(_this.endEvent, _this.activeEventHandler);

            if (!hold) {
              _this._el.removeAttribute(_this.stateChangeAttribute);
            }

            resolve(to, e);
          };

          _this._el.addEventListener(_this.endEvent, _this.activeEventHandler);

          _this._el.setAttribute(_this.stateAttribute, to);

          _this._state = to;
        })["catch"](function (error) {
          // Only catch 'cancelled' errors.
          if (error.message !== 'cancelled') throw error;
        });
      });
    }
    /**
     * Remove any event listeners
     */

  }, {
    key: "unload",
    value: function unload() {
      this._el.removeEventListener(this.endEvent, this.activeEventHandler);

      this.activeEventHandler = null;
    }
  }, {
    key: "el",
    get: function get() {
      return this._el;
    }
    /**
     * Returns current state
     *
     * @return {String} Current state
     */

  }, {
    key: "state",
    get: function get() {
      return this._state;
    }
  }]);

  return Animation;
}();

/**
 * Manage state changes for a set of elements
 */

var AnimationsManager =
/*#__PURE__*/
(/* unused pure expression or super */ null && (function () {
  function AnimationsManager() {
    animations_es_classCallCheck(this, AnimationsManager);

    this.animations = new Map();
  }
  /**
   * Add a new element and return an animation for that element. If element already has an associated animation, return that animation.
   * @param {Object} options
   * @param {HTMLElement}  options.el Target element
   * @param {String} [options.state=initial] Initial state. This is also the default state.
   * @param {String} [options.stateAttribute=data-revealer] Attribute name to update with state.
   * @param {String} [options.stateChangeAttribute=data-revealer-transition] Attribute name to update with change of state.
   * @param {String} [options.endEvent=transitionend] Event name to listen for at end of state change.
   * @param {Boolean} [options.hold=false] If true, changeAttribute will not be removed until the next state change.
   * @param {Function} [options.onStart] Callback to execute immediate after applying stateChangeAttribute.
   *
   * @return {Animation}
   */


  animations_es_createClass(AnimationsManager, [{
    key: "add",
    value: function add(options) {
      if (this.animations.has(options.el)) return this.animations.get(options.el);
      var animation = new Animation(options);
      this.animations.set(options.el, animation);
      return animation;
    }
    /**
     * Remove a single animation
     * @param {Animation} animation Animation to remove. Any event listeners will also be removed.
     */

  }, {
    key: "remove",
    value: function remove(animation) {
      this.animations["delete"](animation.el);
      animation.unload();
    }
    /**
     * Remove all animations, including all event listeners.
     */

  }, {
    key: "removeAll",
    value: function removeAll() {
      this.animations.forEach(function (animation) {
        return animation.unload();
      });
    }
  }]);

  return AnimationsManager;
}()));

function animation(options) {
  var setOptions = {
    endEvent: 'animationend',
    hold: true
  };
  return new Animation(animations_es_objectSpread2({
    options: options
  }, setOptions));
}

function transition(options) {
  return new Animation(options);
}



;// CONCATENATED MODULE: ./source/scripts/components/Sidebar.js
function Sidebar_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Sidebar_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Sidebar_createClass(Constructor, protoProps, staticProps) { if (protoProps) Sidebar_defineProperties(Constructor.prototype, protoProps); if (staticProps) Sidebar_defineProperties(Constructor, staticProps); return Constructor; }




var Sidebar = /*#__PURE__*/function () {
  function Sidebar(container) {
    var _this = this;

    Sidebar_classCallCheck(this, Sidebar);

    if (!container) {
      return;
    }

    this.container = container;

    if (this.container.hasAttribute('data-sidebar')) {
      this.sidebar = this.container;
    } else {
      this.sidebar = this.container.querySelector('[data-sidebar]');
    }

    if (!this.sidebar || this.sidebar.dataset.hasToggle !== 'true') {
      return;
    }

    this.toggleLinks = this.sidebar.querySelectorAll('[data-sidebar-toggle]');
    this.events = new EventHandler/* default */.Z();

    this.toggleMenu = function (link) {
      var toggle = link;
      var content = toggle.nextElementSibling;
      var contentTransition = transition({
        el: content
      });

      if (content.dataset.animationState === 'closed') {
        contentTransition.animateTo('open', {
          onStart: function onStart(_ref) {
            var el = _ref.el;
            var height = el.scrollHeight;
            el.style.setProperty('--open-height', "".concat(height, "px"));
          }
        });
        toggle.dataset.open = 'true';
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        contentTransition.animateTo('closed');
        toggle.dataset.open = 'false';
        toggle.setAttribute('aria-expanded', 'false');
      }
    };

    this.toggleLinks.forEach(function (link) {
      _this.events.register(link, 'click', function (e) {
        e.preventDefault();

        _this.toggleMenu(link);
      });
    });
  }

  Sidebar_createClass(Sidebar, [{
    key: "unload",
    value: function unload() {
      if (this.events) {
        this.events.unregisterAll();
      }
    }
  }]);

  return Sidebar;
}();


;// CONCATENATED MODULE: ./source/scripts/helpers/PaymentTerms.js
function PaymentTerms_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function PaymentTerms_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function PaymentTerms_createClass(Constructor, protoProps, staticProps) { if (protoProps) PaymentTerms_defineProperties(Constructor.prototype, protoProps); if (staticProps) PaymentTerms_defineProperties(Constructor, staticProps); return Constructor; }

var PaymentTerms = /*#__PURE__*/function () {
  function PaymentTerms(el) {
    PaymentTerms_classCallCheck(this, PaymentTerms);

    this._el = el;
    this._reference = this._el.querySelector('[data-payment-terms-reference] shopify-payment-terms');
    if (!this._reference) return;
    this._target = this._el.querySelector('[data-payment-terms-target]');
    this._input = document.createElement('input');
    this._input.name = 'id';
    this._input.type = 'hidden';

    this._target.appendChild(this._input);

    this._target.appendChild(this._reference);

    this._target.style.display = null;
  }

  PaymentTerms_createClass(PaymentTerms, [{
    key: "update",
    value: function update(variantId) {
      if (!this._reference) return;
      this._input.value = variantId;

      this._input.dispatchEvent(new Event('change', {
        bubbles: true
      }));
    }
  }]);

  return PaymentTerms;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/Product.js
function Product_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Product_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Product_createClass(Constructor, protoProps, staticProps) { if (protoProps) Product_defineProperties(Constructor.prototype, protoProps); if (staticProps) Product_defineProperties(Constructor, staticProps); return Constructor; }






var Product = /*#__PURE__*/function () {
  function Product(section) {
    var _this = this;

    Product_classCallCheck(this, Product);

    this.el = section.el;
    this.data = section.data;
    this.onboarding = this.data.onboarding;
    this.product = this.data.product;
    this.variantInventory = this.data.variantInventory;
    this.sidebarEl = this.el.querySelector('[data-sidebar-top]');
    this.sidebarBottomEl = this.el.querySelector('[data-sidebar-bottom]');
    this.paymentTerms = new PaymentTerms(this.el);
    this.productGallery = new ProductGallery({
      el: this.el,
      product: this.product,
      settings: this.data
    });

    if (this.onboarding) {
      return;
    }

    this.productDetails = new ProductDetails({
      el: this.el,
      product: this.product,
      variantInventory: this.variantInventory,
      settings: this.data,
      onVariantChange: function onVariantChange(variant) {
        _this.productGallery.updateGalleryImageByVariant(variant);

        _this.paymentTerms.update(variant.id);
      }
    }); // We need to initialize 2 sidebars because on desktop the normal sidebar is used,
    // and on mobile, if a bottom sidebar is used, we have it there.
    // The sidebar class determines if the sidebar exists.

    this.sidebar = new Sidebar(this.sidebarEl);
    this.sidebarBottom = new Sidebar(this.sidebarBottomEl);
  }

  Product_createClass(Product, [{
    key: "unload",
    value: function unload() {
      if (this.productDetails) {
        this.productDetails.unload();
      }

      if (this.productGallery) {
        this.productGallery.unload();
      }

      if (this.sidebar) {
        this.sidebar.unload();
      }

      if (this.sidebarBottom) {
        this.sidebarBottom.unload();
      }
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.unload();
    }
  }]);

  return Product;
}();


;// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-asyncview/dist/index.es.js

  /*!
   * @pixelunion/shopify-asyncview v2.0.5
   * (c) 2020 Pixel Union
  */

function shopify_asyncview_dist_index_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function shopify_asyncview_dist_index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function shopify_asyncview_dist_index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) shopify_asyncview_dist_index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) shopify_asyncview_dist_index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

function dist_index_es_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function dist_index_es_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function dist_index_es_objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      dist_index_es_ownKeys(Object(source), true).forEach(function (key) {
        dist_index_es_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      dist_index_es_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var deferred = {};

var AsyncView = /*#__PURE__*/function () {
  function AsyncView() {
    shopify_asyncview_dist_index_es_classCallCheck(this, AsyncView);
  }

  shopify_asyncview_dist_index_es_createClass(AsyncView, null, [{
    key: "load",

    /**
     * Load the template given by the provided URL into the provided
     * view
     *
     * @param {string} url - The url to load
     * @param {object} query - An object containing additional query parameters of the URL
     * @param {string} query.view - A required query parameter indicating which view to load
     * @param {object} [options] - Config options
     * @param {string} [options.hash] - A hash of the current page content
     */
    value: function load(url) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!('view' in query)) {
        return Promise.reject(new Error('\'view\' not found in \'query\' parameter'));
      }

      var querylessUrl = url.replace(/\?[^#]+/, '');
      var queryParamsString = new RegExp(/.+\?([^#]+)/).exec(url);
      var queryParams = query;

      if (queryParamsString && queryParamsString.length >= 2) {
        queryParamsString[1].split('&').forEach(function (param) {
          var _param$split = param.split('='),
              _param$split2 = _slicedToArray(_param$split, 2),
              key = _param$split2[0],
              value = _param$split2[1];

          queryParams[key] = value;
        });
      } // NOTE: We're adding an additional timestamp to the query.
      // This is to prevent certain browsers from returning cached
      // versions of the url we are requesting.
      // See this PR for more info: https://github.com/pixelunion/shopify-asyncview/pull/4


      var cachebustingParams = dist_index_es_objectSpread2({}, queryParams, {
        _: new Date().getTime()
      });

      var hashUrl = querylessUrl.replace(/([^#]+)(.*)/, function (match, address, hash) {
        return "".concat(address, "?").concat(Object.keys(queryParams).sort().map(function (key) {
          return "".concat(key, "=").concat(encodeURIComponent(queryParams[key]));
        }).join('&')).concat(hash);
      });
      var requestUrl = querylessUrl.replace(/([^#]+)(.*)/, function (match, address, hash) {
        return "".concat(address, "?").concat(Object.keys(cachebustingParams).sort().map(function (key) {
          return "".concat(key, "=").concat(encodeURIComponent(cachebustingParams[key]));
        }).join('&')).concat(hash);
      });
      var promise = new Promise(function (resolve, reject) {
        var data;

        if (hashUrl in deferred) {
          resolve(deferred[hashUrl]);
          return;
        }

        deferred[hashUrl] = promise;

        if (options.hash) {
          data = sessionStorage.getItem(hashUrl);

          if (data) {
            var deserialized = JSON.parse(data);

            if (options.hash === deserialized.options.hash) {
              delete deferred[hashUrl];
              resolve(deserialized);
              return;
            }
          }
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl, true);

        xhr.onload = function () {
          var el = xhr.response;
          var newOptions = {};
          var optionsEl = el.querySelector('[data-options]');

          if (optionsEl && optionsEl.innerHTML) {
            newOptions = JSON.parse(el.querySelector('[data-options]').innerHTML);
          }

          var htmlEls = el.querySelectorAll('[data-html]');
          var newHtml = {};

          if (htmlEls.length === 1 && htmlEls[0].getAttribute('data-html') === '') {
            newHtml = htmlEls[0].innerHTML;
          } else {
            for (var i = 0; i < htmlEls.length; i++) {
              newHtml[htmlEls[i].getAttribute('data-html')] = htmlEls[i].innerHTML;
            }
          }

          var dataEls = el.querySelectorAll('[data-data]');
          var newData = {};

          if (dataEls.length === 1 && dataEls[0].getAttribute('data-data') === '') {
            newData = JSON.parse(dataEls[0].innerHTML);
          } else {
            for (var _i = 0; _i < dataEls.length; _i++) {
              newData[dataEls[_i].getAttribute('data-data')] = JSON.parse(dataEls[_i].innerHTML);
            }
          }

          if (options.hash) {
            try {
              sessionStorage.setItem(hashUrl, JSON.stringify({
                options: newOptions,
                data: newData,
                html: newHtml
              }));
            } catch (error) {
              console.error(error);
            }
          }

          delete deferred[hashUrl];
          resolve({
            data: newData,
            html: newHtml
          });
        };

        xhr.onerror = function () {
          delete deferred[hashUrl];
          reject();
        };

        xhr.responseType = 'document';
        xhr.send();
      });
      return promise;
    }
  }]);

  return AsyncView;
}();

/* harmony default export */ var shopify_asyncview_dist_index_es = (AsyncView);

;// CONCATENATED MODULE: ./source/scripts/components/Tabs.js
function Tabs_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Tabs_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Tabs_createClass(Constructor, protoProps, staticProps) { if (protoProps) Tabs_defineProperties(Constructor.prototype, protoProps); if (staticProps) Tabs_defineProperties(Constructor, staticProps); return Constructor; }



var Tabs = /*#__PURE__*/function () {
  function Tabs() {
    var _this = this;

    Tabs_classCallCheck(this, Tabs);

    this.tabs = document.querySelectorAll('ul.tabs');
    this.events = new EventHandler/* default */.Z();

    if (!this.tabs) {
      return;
    }

    this.tabs.forEach(function (tabs) {
      _this.events.register(tabs, 'click', function (event) {
        event.preventDefault();
        var target = event.target;
        var sibling = tabs.nextElementSibling;

        if (!sibling) {
          return;
        }

        if (target.nodeName === 'A') {
          _this.displaySelected(target, tabs, sibling);
        }
      });
    });
  }

  Tabs_createClass(Tabs, [{
    key: "displaySelected",
    value: function displaySelected(target, tabs, sibling) {
      var tabsPresent = tabs.querySelectorAll('li a');
      var tabsContentPresent = sibling.querySelectorAll('li');

      for (var i = 0; i < tabsPresent.length; i++) {
        tabsPresent[i].classList.remove('active');
        tabsContentPresent[i].classList.remove('active');

        if (target === tabsPresent[i]) {
          tabsPresent[i].classList.add('active');
          tabsContentPresent[i].classList.add('active');
        }
      }
    }
  }]);

  return Tabs;
}();


;// CONCATENATED MODULE: ./source/scripts/components/Accordion.js
function Accordion_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Accordion_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Accordion_createClass(Constructor, protoProps, staticProps) { if (protoProps) Accordion_defineProperties(Constructor.prototype, protoProps); if (staticProps) Accordion_defineProperties(Constructor, staticProps); return Constructor; }



var Accordion = /*#__PURE__*/function () {
  function Accordion() {
    var _this = this;

    Accordion_classCallCheck(this, Accordion);

    this.accordions = document.querySelectorAll('.accordion');
    this.events = new EventHandler/* default */.Z();

    if (!this.accordions) {
      return;
    }

    this.accordions.forEach(function (accordion) {
      var accordionLink = accordion.querySelectorAll('dt a');

      if (!accordionLink) {
        return;
      }

      accordionLink.forEach(function (link) {
        var content = link.parentNode.nextElementSibling;

        _this.events.register(link, 'click', function (event) {
          event.preventDefault();
          link.classList.toggle('active');

          _this.toggleContent(content);
        });
      });
    });
  }

  Accordion_createClass(Accordion, [{
    key: "toggleContent",
    value: function toggleContent(content) {
      content.classList.toggle('active');
    }
  }]);

  return Accordion;
}();


;// CONCATENATED MODULE: ./source/scripts/components/ProductQuickshop.js
function ProductQuickshop_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductQuickshop_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductQuickshop_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductQuickshop_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductQuickshop_defineProperties(Constructor, staticProps); return Constructor; }









var ProductQuickshop = /*#__PURE__*/function () {
  function ProductQuickshop(productCard) {
    var _this = this;

    ProductQuickshop_classCallCheck(this, ProductQuickshop);

    this.productCard = productCard;
    this.productCardLink = productCard.querySelector('.product-thumbnail__link');
    this.quickshopButton = productCard.querySelector('[data-quickshop-button]');
    this.events = new EventHandler/* default */.Z();
    this.events.register(this.quickshopButton, 'click', function (e) {
      e.preventDefault(); // Build request url

      var requestUrl = _this.quickshopButton.dataset.quickshopUrl;
      window.modal.open({
        trigger: _this.productCardLink,
        classname: 'modal--quickshop',
        onClose: function onClose() {
          if (_this.productGallery) {
            var _this$productGallery = _this.productGallery,
                players = _this$productGallery.players,
                flickity = _this$productGallery.flickity;

            if (players) {
              players.forEach(function (player) {
                if (player.playing) {
                  player.pause();
                }
              });
            }

            if (flickity) {
              flickity.options.autoPlay = 0;
            }
          }
        }
      }); // Run AsyncView to populate quickshop HTML

      shopify_asyncview_dist_index_es.load(requestUrl, {
        view: '_quickshop'
      }).then(function (_ref) {
        var data = _ref.data,
            html = _ref.html;
        var container = document.createElement('div');
        container.innerHTML = html.content;
        _this.paymentTerms = new PaymentTerms(container);
        _this.productGallery = new ProductGallery({
          el: container,
          product: data.product,
          settings: data
        });
        _this.productDetails = new ProductDetails({
          el: container,
          product: data.product,
          variantInventory: data.variantInventory,
          settings: data,
          onVariantChange: function onVariantChange(variant) {
            _this.productGallery.updateGalleryImageByVariant(variant);

            _this.paymentTerms.update(variant.id);
          }
        });

        if (Shopify.theme_settings.cart_action_type === 'ajax') {
          var atcButton = _this.productDetails.formArea.querySelector('[data-product-atc]');

          _this.events.register(atcButton, 'click', function (event) {
            var ev = new Event('quickshop-add', {
              bubbles: true
            });
            atcButton.dispatchEvent(ev);
            event.preventDefault();
          });
        }

        window.modal.updateContent(container); // Initialize Shopify payment buttons

        if (Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }

        new Tabs();
        new Accordion();
      });
    });
  }

  ProductQuickshop_createClass(ProductQuickshop, [{
    key: "unload",
    value: function unload() {
      if (this.productGallery) {
        this.productGallery.unload();
      }

      if (this.productDetails) {
        this.productDetails.unload();
      }
    }
  }]);

  return ProductQuickshop;
}();


;// CONCATENATED MODULE: ./source/scripts/components/ProductThumbnail.js
function ProductThumbnail_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductThumbnail_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductThumbnail_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductThumbnail_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductThumbnail_defineProperties(Constructor, staticProps); return Constructor; }





var ProductThumbnail = /*#__PURE__*/function () {
  function ProductThumbnail(productThumbnail, settings) {
    var _this = this;

    ProductThumbnail_classCallCheck(this, ProductThumbnail);

    this.events = new EventHandler/* default */.Z();
    this.settings = settings;
    this.productThumbnail = productThumbnail;
    this.productImageContainer = this.productThumbnail.querySelector('[data-media-wrapper]');
    this.productPrimaryMedia = this.productThumbnail.querySelector('[data-primary-media]');
    this.productSecondaryMedia = this.productThumbnail.querySelector('[data-secondary-media]');
    this.productThumbnailVideo = this.productThumbnail.querySelector('[data-thumbnail-video]');
    this.collectionSwatches = this.productThumbnail.querySelectorAll('[data-swatch]');
    this.productImage = this.productThumbnail.querySelector('[data-rimg]');
    this.secondaryImage = null;
    this.secondaryImageSrc = null;
    this.secondaryImageSrcset = null;

    if (!this.productImage) {
      return;
    }

    this.events.register(this.productImage, 'rimg:load', function () {
      _this.defaultImageSrc = _this.productImage.src;
      _this.defaultImageSrcset = _this.productImage.srcset;
    });

    if (this.viewportIsMobile()) {
      return;
    }

    this.quickshop = new ProductQuickshop(this.productThumbnail);

    if (!this.productSecondaryMedia) {
      return;
    }

    this.secondaryImage = this.productSecondaryMedia.querySelector('[data-rimg]');
    this.events.register(this.secondaryImage, 'rimg:load', function () {
      _this.secondaryImageSrc = _this.secondaryImage.src;
      _this.secondaryImageSrcset = _this.secondaryImage.srcset;
    });
    this.setupSwatches();

    if (this.settings.showSecondaryMediaOnHover) {
      if (this.productThumbnailVideo) {
        var video = this.productThumbnailVideo.querySelector('[data-html5-video] video, [data-external-video]');
        this.videoPlayer = new Video_Video(video, {
          muted: true
        });
      }

      this.setupSecondaryMediaSwap();
    }
  }

  ProductThumbnail_createClass(ProductThumbnail, [{
    key: "setupSecondaryMediaSwap",
    value: function setupSecondaryMediaSwap() {
      var _this2 = this;

      this.events.register(this.productImageContainer, 'mouseover', function () {
        if (_this2.secondaryImageSrc) {
          _this2.secondaryImage.src = _this2.secondaryImageSrc;
          _this2.secondaryImage.srcset = _this2.secondaryImageSrcset;
        }

        _this2.productPrimaryMedia.classList.add('hidden');

        if (_this2.productThumbnailVideo) {
          _this2.productThumbnailVideo.classList.remove('hidden');

          _this2.productSecondaryMedia.classList.add('hidden');

          _this2.videoPlayer.play();
        } else {
          _this2.productSecondaryMedia.classList.remove('hidden');
        }
      });
      this.events.register(this.productImageContainer, 'mouseleave', function () {
        _this2.productPrimaryMedia.classList.remove('hidden');

        if (_this2.videoPlayer) {
          _this2.productThumbnailVideo.classList.add('hidden');

          _this2.videoPlayer.pause();
        } else {
          _this2.productSecondaryMedia.classList.add('hidden');
        }
      });
    }
  }, {
    key: "setupSwatches",
    value: function setupSwatches() {
      var _this3 = this;

      /* When hovering over a swatch with an image
      associated with it,set the thumbnail image to
      the associated image */
      this.collectionSwatches.forEach(function (swatch) {
        _this3.events.register(swatch, 'mouseover', function () {
          if (swatch.dataset.image.indexOf('no-image') === -1) {
            _this3.secondaryImage.src = swatch.dataset.image;
            _this3.secondaryImage.srcset = swatch.dataset.image;

            _this3.productPrimaryMedia.classList.add('hidden');

            _this3.productSecondaryMedia.classList.remove('hidden');
          } else {
            _this3.productPrimaryMedia.classList.remove('hidden');

            _this3.productSecondaryMedia.classList.add('hidden');
          }
        });
      });
    }
  }, {
    key: "viewportIsMobile",
    value: function viewportIsMobile() {
      return window.innerWidth < 768;
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();
    }
  }]);

  return ProductThumbnail;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/ProductRecommendations.js
function ProductRecommendations_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductRecommendations_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductRecommendations_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductRecommendations_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductRecommendations_defineProperties(Constructor, staticProps); return Constructor; }







var ProductRecommendations = /*#__PURE__*/function () {
  function ProductRecommendations(section) {
    var _this = this;

    ProductRecommendations_classCallCheck(this, ProductRecommendations);

    this.sectionId = section.id;
    this.el = section.el;
    var _section$data = section.data,
        customCollectionEnabled = _section$data.customCollectionEnabled,
        layout = _section$data.layout,
        productId = _section$data.productId,
        productsPerRow = _section$data.productsPerRow,
        limit = _section$data.limit,
        sectionEnabled = _section$data.sectionEnabled,
        showSecondaryMediaOnHover = _section$data.showSecondaryMediaOnHover;
    var recommendedProductsUrl = Shopify.routes.product_recommendations;
    var recommendedProductsContainer = document.querySelector('[data-product-recommendations-container]');
    var productSidebar = document.querySelector('[data-sidebar]');
    var requestUrl = "".concat(recommendedProductsUrl, "?section_id=").concat(this.sectionId, "&limit=").concat(limit, "&product_id=").concat(productId);

    if (!sectionEnabled) {
      return;
    }

    this.events = new EventHandler/* default */.Z();
    var thumbnailSettings = {
      showSecondaryMediaOnHover: showSecondaryMediaOnHover
    };

    var initializeThumbnails = function initializeThumbnails() {
      _this.productList = _this.container.querySelectorAll('[data-product-thumbnail]');
      _this.productThumbnails = [];

      _this.productList.forEach(function (product) {
        _this.productThumbnails.push(new ProductThumbnail(product, thumbnailSettings));
      });
    };

    var enableSlider = function enableSlider(el) {
      _this.slider = el.querySelector('[data-product-slider]');
      _this.toggleSlider = limit > productsPerRow;

      if (_this.slider && layout === 'slider') {
        // Enable slider
        _this.Flickity = new (js_default())(_this.slider, {
          wrapAround: true,
          pageDots: false,
          cellAlign: 'left',
          prevNextButtons: _this.toggleSlider,
          draggable: _this.toggleSlider
        });

        if (_this.toggleSlider === false) {
          _this.isDraggable();

          _this.events.register(window, 'resize', function () {
            _this.isDraggable();
          });
        } // Ensures Flickity is not collapsed when loaded


        setTimeout(function () {
          _this.Flickity.resize();
        }, 500);

        _this.events.register(window, 'load', function () {
          _this.Flickity.resize();
        });
      }
    };

    if (productSidebar) {
      this.container = recommendedProductsContainer;
      this.el.classList.add('product-recommendations--hidden');
      this.container.classList.remove('product-recommendations-container--visible');
    } else {
      this.container = this.el;
      this.container.classList.remove('product-recommendations--hidden');
      recommendedProductsContainer.classList.add('product-recommendations-container--hidden');
    } // If using custom collection


    if (customCollectionEnabled) {
      if (productSidebar) {
        var data = this.el.innerHTML;
        recommendedProductsContainer.innerHTML = data;
      }

      dist_index_es.watch(this.container);
      initializeThumbnails();
      enableSlider(this.container);
      return;
    }

    shopify_asyncview_dist_index_es.load(requestUrl, {
      view: ''
    }).then(function (_ref) {
      var html = _ref.html;
      _this.container.innerHTML = html;
      dist_index_es.watch(_this.container);
      initializeThumbnails();
      enableSlider(_this.container); // Initialize Shopify payment buttons

      if (Shopify.PaymentButton) {
        Shopify.PaymentButton.init();
      }
    });
  }

  ProductRecommendations_createClass(ProductRecommendations, [{
    key: "isDraggable",
    value: function isDraggable() {
      if (this.viewportIsMobile()) {
        this.Flickity.options.draggable = true;
        this.Flickity.updateDraggable();
      } else {
        this.Flickity.options.draggable = false;
        this.Flickity.updateDraggable();
      }
    }
  }, {
    key: "viewportIsMobile",
    value: function viewportIsMobile() {
      return window.innerWidth < 768;
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.Flickity) {
        this.Flickity.destroy();
      }

      if (this.productThumbnails) {
        this.productThumbnails.forEach(function (product) {
          return product.unload();
        });
      }

      this.events.unregisterAll();
    }
  }]);

  return ProductRecommendations;
}();


;// CONCATENATED MODULE: ./node_modules/@pixelunion/pxs-slideshow/dist/index.es.js

/*!
 * @pixelunion/pxs-slideshow v1.1.3
 * (c) 2021 Pixel Union
 */

function pxs_slideshow_dist_index_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function pxs_slideshow_dist_index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function pxs_slideshow_dist_index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) pxs_slideshow_dist_index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) pxs_slideshow_dist_index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function index_es_createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var evEmitter = index_es_createCommonjsModule(function (module) {
/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if (  module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : commonjsGlobal, function() {

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  // copy over to avoid interference if .off() in listener
  listeners = listeners.slice(0);
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  for ( var i=0; i < listeners.length; i++ ) {
    var listener = listeners[i];
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
  }

  return this;
};

proto.allOff = function() {
  delete this._events;
  delete this._onceEvents;
};

return EvEmitter;

}));
});

var getSize = index_es_createCommonjsModule(function (module) {
/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */
/* globals console: false */

( function( window, factory ) {
  /* jshint strict: false */ /* globals define, module */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.getSize = factory();
  }

})( window, function factory() {

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') == -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console == 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

var measurementsLength = measurements.length;

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}

// -------------------------- getStyle -------------------------- //

/**
 * getStyle, get style of element, check for Firefox bug
 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function getStyle( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    logError( 'Style returned ' + style +
      '. Are you running this code in a hidden iframe on Firefox? ' +
      'See https://bit.ly/getsizebug1' );
  }
  return style;
}

// -------------------------- setup -------------------------- //

var isSetup = false;

var isBoxSizeOuter;

/**
 * setup
 * check isBoxSizerOuter
 * do on first getSize() rather than on page load for Firefox bug
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  // -------------------------- box sizing -------------------------- //

  /**
   * Chrome & Safari measure the outer-width on style.width on border-box elems
   * IE11 & Firefox<29 measures the inner-width
   */
  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style.boxSizing = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );
  // round value for browser zoom. desandro/masonry#928
  isBoxSizeOuter = Math.round( getStyleSize( style.width ) ) == 200;
  getSize.isBoxSizeOuter = isBoxSizeOuter;

  body.removeChild( div );
}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem == 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display == 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

  // get all measurements
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

return getSize;

});
});

var matchesSelector = index_es_createCommonjsModule(function (module) {
/**
 * matchesSelector v2.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  // universal module definition
  if (  module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.matchesSelector = factory();
  }

}( window, function factory() {

  var matchesMethod = ( function() {
    var ElemProto = window.Element.prototype;
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0; i < prefixes.length; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  return function matchesSelector( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  };

}));
});

var utils = index_es_createCommonjsModule(function (module) {
/**
 * Fizzy UI utils v2.0.7
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      matchesSelector
    );
  } else {
    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.matchesSelector
    );
  }

}( window, function factory( window, matchesSelector ) {

var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- makeArray ----- //

var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    return obj;
  }
  // return empty array if undefined or null. #6
  if ( obj === null || obj === undefined ) {
    return [];
  }

  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  if ( isArrayLike ) {
    // convert nodeList to array
    return arraySlice.call( obj );
  }

  // array of single index
  return [ obj ];
};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = ary.indexOf( obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem.parentNode && elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  elems.forEach( function( elem ) {
    // check that elem is an actual element
    if ( !( elem instanceof HTMLElement ) ) {
      return;
    }
    // add elem if no selector
    if ( !selector ) {
      ffElems.push( elem );
      return;
    }
    // filter & find items if we have a selector
    // filter
    if ( matchesSelector( elem, selector ) ) {
      ffElems.push( elem );
    }
    // find children
    var childElems = elem.querySelectorAll( selector );
    // concat childElems to filterFound array
    for ( var i=0; i < childElems.length; i++ ) {
      ffElems.push( childElems[i] );
    }
  });

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  threshold = threshold || 100;
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    clearTimeout( timeout );

    var args = arguments;
    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold );
  };
};

// ----- docReady ----- //

utils.docReady = function( callback ) {
  var readyState = document.readyState;
  if ( readyState == 'complete' || readyState == 'interactive' ) {
    // do async to allow for other scripts to run. metafizzy/flickity#441
    setTimeout( callback );
  } else {
    document.addEventListener( 'DOMContentLoaded', callback );
  }
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via [data-namespace] or .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-options
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  utils.docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var dataAttr = 'data-' + dashedNamespace;
    var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
    var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
    var elems = utils.makeArray( dataAttrElems )
      .concat( utils.makeArray( jsDashElems ) );
    var dataOptionsAttr = dataAttr + '-options';
    var jQuery = window.jQuery;

    elems.forEach( function( elem ) {
      var attr = elem.getAttribute( dataAttr ) ||
        elem.getAttribute( dataOptionsAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
          ': ' + error );
        }
        return;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('namespace')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    });

  });
};

// -----  ----- //

return utils;

}));
});

var cell = index_es_createCommonjsModule(function (module) {
// Flickity.Cell
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      getSize
    );
  } else {
    // browser global
    window.Flickity = window.Flickity || {};
    window.Flickity.Cell = factory(
      window,
      window.getSize
    );
  }

}( window, function factory( window, getSize ) {

function Cell( elem, parent ) {
  this.element = elem;
  this.parent = parent;

  this.create();
}

var proto = Cell.prototype;

proto.create = function() {
  this.element.style.position = 'absolute';
  this.element.setAttribute( 'aria-hidden', 'true' );
  this.x = 0;
  this.shift = 0;
};

proto.destroy = function() {
  // reset style
  this.unselect();
  this.element.style.position = '';
  var side = this.parent.originSide;
  this.element.style[ side ] = '';
};

proto.getSize = function() {
  this.size = getSize( this.element );
};

proto.setPosition = function( x ) {
  this.x = x;
  this.updateTarget();
  this.renderPosition( x );
};

// setDefaultTarget v1 method, backwards compatibility, remove in v3
proto.updateTarget = proto.setDefaultTarget = function() {
  var marginProperty = this.parent.originSide == 'left' ? 'marginLeft' : 'marginRight';
  this.target = this.x + this.size[ marginProperty ] +
    this.size.width * this.parent.cellAlign;
};

proto.renderPosition = function( x ) {
  // render position of cell with in slider
  var side = this.parent.originSide;
  this.element.style[ side ] = this.parent.getPositionValue( x );
};

proto.select = function() {
  this.element.classList.add('is-selected');
  this.element.removeAttribute('aria-hidden');
};

proto.unselect = function() {
  this.element.classList.remove('is-selected');
  this.element.setAttribute( 'aria-hidden', 'true' );
};

/**
 * @param {Integer} factor - 0, 1, or -1
**/
proto.wrapShift = function( shift ) {
  this.shift = shift;
  this.renderPosition( this.x + this.parent.slideableWidth * shift );
};

proto.remove = function() {
  this.element.parentNode.removeChild( this.element );
};

return Cell;

}));
});

var slide = index_es_createCommonjsModule(function (module) {
// slide
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.Flickity = window.Flickity || {};
    window.Flickity.Slide = factory();
  }

}( window, function factory() {

function Slide( parent ) {
  this.parent = parent;
  this.isOriginLeft = parent.originSide == 'left';
  this.cells = [];
  this.outerWidth = 0;
  this.height = 0;
}

var proto = Slide.prototype;

proto.addCell = function( cell ) {
  this.cells.push( cell );
  this.outerWidth += cell.size.outerWidth;
  this.height = Math.max( cell.size.outerHeight, this.height );
  // first cell stuff
  if ( this.cells.length == 1 ) {
    this.x = cell.x; // x comes from first cell
    var beginMargin = this.isOriginLeft ? 'marginLeft' : 'marginRight';
    this.firstMargin = cell.size[ beginMargin ];
  }
};

proto.updateTarget = function() {
  var endMargin = this.isOriginLeft ? 'marginRight' : 'marginLeft';
  var lastCell = this.getLastCell();
  var lastMargin = lastCell ? lastCell.size[ endMargin ] : 0;
  var slideWidth = this.outerWidth - ( this.firstMargin + lastMargin );
  this.target = this.x + this.firstMargin + slideWidth * this.parent.cellAlign;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.select = function() {
  this.cells.forEach( function( cell ) {
    cell.select();
  });
};

proto.unselect = function() {
  this.cells.forEach( function( cell ) {
    cell.unselect();
  });
};

proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  });
};

return Slide;

}));
});

var animate = index_es_createCommonjsModule(function (module) {
// animate
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      utils
    );
  } else {
    // browser global
    window.Flickity = window.Flickity || {};
    window.Flickity.animatePrototype = factory(
      window,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, utils ) {

// -------------------------- animate -------------------------- //

var proto = {};

proto.startAnimation = function() {
  if ( this.isAnimating ) {
    return;
  }

  this.isAnimating = true;
  this.restingFrames = 0;
  this.animate();
};

proto.animate = function() {
  this.applyDragForce();
  this.applySelectedAttraction();

  var previousX = this.x;

  this.integratePhysics();
  this.positionSlider();
  this.settle( previousX );
  // animate next frame
  if ( this.isAnimating ) {
    var _this = this;
    requestAnimationFrame( function animateFrame() {
      _this.animate();
    });
  }
};

proto.positionSlider = function() {
  var x = this.x;
  // wrap position around
  if ( this.options.wrapAround && this.cells.length > 1 ) {
    x = utils.modulo( x, this.slideableWidth );
    x = x - this.slideableWidth;
    this.shiftWrapCells( x );
  }

  this.setTranslateX( x, this.isAnimating );
  this.dispatchScrollEvent();
};

proto.setTranslateX = function( x, is3d ) {
  x += this.cursorPosition;
  // reverse if right-to-left and using transform
  x = this.options.rightToLeft ? -x : x;
  var translateX = this.getPositionValue( x );
  // use 3D tranforms for hardware acceleration on iOS
  // but use 2D when settled, for better font-rendering
  this.slider.style.transform = is3d ?
    'translate3d(' + translateX + ',0,0)' : 'translateX(' + translateX + ')';
};

proto.dispatchScrollEvent = function() {
  var firstSlide = this.slides[0];
  if ( !firstSlide ) {
    return;
  }
  var positionX = -this.x - firstSlide.target;
  var progress = positionX / this.slidesWidth;
  this.dispatchEvent( 'scroll', null, [ progress, positionX ] );
};

proto.positionSliderAtSelected = function() {
  if ( !this.cells.length ) {
    return;
  }
  this.x = -this.selectedSlide.target;
  this.velocity = 0; // stop wobble
  this.positionSlider();
};

proto.getPositionValue = function( position ) {
  if ( this.options.percentPosition ) {
    // percent position, round to 2 digits, like 12.34%
    return ( Math.round( ( position / this.size.innerWidth ) * 10000 ) * 0.01 )+ '%';
  } else {
    // pixel positioning
    return Math.round( position ) + 'px';
  }
};

proto.settle = function( previousX ) {
  // keep track of frames where x hasn't moved
  if ( !this.isPointerDown && Math.round( this.x * 100 ) == Math.round( previousX * 100 ) ) {
    this.restingFrames++;
  }
  // stop animating if resting for 3 or more frames
  if ( this.restingFrames > 2 ) {
    this.isAnimating = false;
    delete this.isFreeScrolling;
    // render position with translateX when settled
    this.positionSlider();
    this.dispatchEvent( 'settle', null, [ this.selectedIndex ] );
  }
};

proto.shiftWrapCells = function( x ) {
  // shift before cells
  var beforeGap = this.cursorPosition + x;
  this._shiftCells( this.beforeShiftCells, beforeGap, -1 );
  // shift after cells
  var afterGap = this.size.innerWidth - ( x + this.slideableWidth + this.cursorPosition );
  this._shiftCells( this.afterShiftCells, afterGap, 1 );
};

proto._shiftCells = function( cells, gap, shift ) {
  for ( var i=0; i < cells.length; i++ ) {
    var cell = cells[i];
    var cellShift = gap > 0 ? shift : 0;
    cell.wrapShift( cellShift );
    gap -= cell.size.outerWidth;
  }
};

proto._unshiftCells = function( cells ) {
  if ( !cells || !cells.length ) {
    return;
  }
  for ( var i=0; i < cells.length; i++ ) {
    cells[i].wrapShift( 0 );
  }
};

// -------------------------- physics -------------------------- //

proto.integratePhysics = function() {
  this.x += this.velocity;
  this.velocity *= this.getFrictionFactor();
};

proto.applyForce = function( force ) {
  this.velocity += force;
};

proto.getFrictionFactor = function() {
  return 1 - this.options[ this.isFreeScrolling ? 'freeScrollFriction' : 'friction' ];
};

proto.getRestingPosition = function() {
  // my thanks to Steven Wittens, who simplified this math greatly
  return this.x + this.velocity / ( 1 - this.getFrictionFactor() );
};

proto.applyDragForce = function() {
  if ( !this.isDraggable || !this.isPointerDown ) {
    return;
  }
  // change the position to drag position by applying force
  var dragVelocity = this.dragX - this.x;
  var dragForce = dragVelocity - this.velocity;
  this.applyForce( dragForce );
};

proto.applySelectedAttraction = function() {
  // do not attract if pointer down or no slides
  var dragDown = this.isDraggable && this.isPointerDown;
  if ( dragDown || this.isFreeScrolling || !this.slides.length ) {
    return;
  }
  var distance = this.selectedSlide.target * -1 - this.x;
  var force = distance * this.options.selectedAttraction;
  this.applyForce( force );
};

return proto;

}));
});

var flickity = index_es_createCommonjsModule(function (module) {
// Flickity main
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      evEmitter,
      getSize,
      utils,
      cell,
      slide,
      animate
    );
  } else {
    // browser global
    var _Flickity = window.Flickity;

    window.Flickity = factory(
      window,
      window.EvEmitter,
      window.getSize,
      window.fizzyUIUtils,
      _Flickity.Cell,
      _Flickity.Slide,
      _Flickity.animatePrototype
    );
  }

}( window, function factory( window, EvEmitter, getSize,
  utils, Cell, Slide, animatePrototype ) {

// vars
var jQuery = window.jQuery;
var getComputedStyle = window.getComputedStyle;
var console = window.console;

function moveElements( elems, toElem ) {
  elems = utils.makeArray( elems );
  while ( elems.length ) {
    toElem.appendChild( elems.shift() );
  }
}

// -------------------------- Flickity -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Flickity intances
var instances = {};

function Flickity( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for Flickity: ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // do not initialize twice on same element
  if ( this.element.flickityGUID ) {
    var instance = instances[ this.element.flickityGUID ];
    instance.option( options );
    return instance;
  }

  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }
  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // kick things off
  this._create();
}

Flickity.defaults = {
  accessibility: true,
  // adaptiveHeight: false,
  cellAlign: 'center',
  // cellSelector: undefined,
  // contain: false,
  freeScrollFriction: 0.075, // friction when free-scrolling
  friction: 0.28, // friction when selecting
  namespaceJQueryEvents: true,
  // initialIndex: 0,
  percentPosition: true,
  resize: true,
  selectedAttraction: 0.025,
  setGallerySize: true
  // watchCSS: false,
  // wrapAround: false
};

// hash of methods triggered on _create()
Flickity.createMethods = [];

var proto = Flickity.prototype;
// inherit EventEmitter
utils.extend( proto, EvEmitter.prototype );

proto._create = function() {
  // add id for Flickity.data
  var id = this.guid = ++GUID;
  this.element.flickityGUID = id; // expando
  instances[ id ] = this; // associate via id
  // initial properties
  this.selectedIndex = 0;
  // how many frames slider has been in same position
  this.restingFrames = 0;
  // initial physics properties
  this.x = 0;
  this.velocity = 0;
  this.originSide = this.options.rightToLeft ? 'right' : 'left';
  // create viewport & slider
  this.viewport = document.createElement('div');
  this.viewport.className = 'flickity-viewport';
  this._createSlider();

  if ( this.options.resize || this.options.watchCSS ) {
    window.addEventListener( 'resize', this );
  }

  // add listeners from on option
  for ( var eventName in this.options.on ) {
    var listener = this.options.on[ eventName ];
    this.on( eventName, listener );
  }

  Flickity.createMethods.forEach( function( method ) {
    this[ method ]();
  }, this );

  if ( this.options.watchCSS ) {
    this.watchCSS();
  } else {
    this.activate();
  }

};

/**
 * set options
 * @param {Object} opts
 */
proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

proto.activate = function() {
  if ( this.isActive ) {
    return;
  }
  this.isActive = true;
  this.element.classList.add('flickity-enabled');
  if ( this.options.rightToLeft ) {
    this.element.classList.add('flickity-rtl');
  }

  this.getSize();
  // move initial cell elements so they can be loaded as cells
  var cellElems = this._filterFindCellElements( this.element.children );
  moveElements( cellElems, this.slider );
  this.viewport.appendChild( this.slider );
  this.element.appendChild( this.viewport );
  // get cells from children
  this.reloadCells();

  if ( this.options.accessibility ) {
    // allow element to focusable
    this.element.tabIndex = 0;
    // listen for key presses
    this.element.addEventListener( 'keydown', this );
  }

  this.emitEvent('activate');
  this.selectInitialIndex();
  // flag for initial activation, for using initialIndex
  this.isInitActivated = true;
  // ready event. #493
  this.dispatchEvent('ready');
};

// slider positions the cells
proto._createSlider = function() {
  // slider element does all the positioning
  var slider = document.createElement('div');
  slider.className = 'flickity-slider';
  slider.style[ this.originSide ] = 0;
  this.slider = slider;
};

proto._filterFindCellElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.cellSelector );
};

// goes through all children
proto.reloadCells = function() {
  // collection of item elements
  this.cells = this._makeCells( this.slider.children );
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
};

/**
 * turn elements into Flickity.Cells
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Flickity Cells
 */
proto._makeCells = function( elems ) {
  var cellElems = this._filterFindCellElements( elems );

  // create new Flickity for collection
  var cells = cellElems.map( function( cellElem ) {
    return new Cell( cellElem, this );
  }, this );

  return cells;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.getLastSlide = function() {
  return this.slides[ this.slides.length - 1 ];
};

// positions all cells
proto.positionCells = function() {
  // size all cells
  this._sizeCells( this.cells );
  // position all cells
  this._positionCells( 0 );
};

/**
 * position certain cells
 * @param {Integer} index - which cell to start with
 */
proto._positionCells = function( index ) {
  index = index || 0;
  // also measure maxCellHeight
  // start 0 if positioning all cells
  this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
  var cellX = 0;
  // get cellX
  if ( index > 0 ) {
    var startCell = this.cells[ index - 1 ];
    cellX = startCell.x + startCell.size.outerWidth;
  }
  var len = this.cells.length;
  for ( var i=index; i < len; i++ ) {
    var cell = this.cells[i];
    cell.setPosition( cellX );
    cellX += cell.size.outerWidth;
    this.maxCellHeight = Math.max( cell.size.outerHeight, this.maxCellHeight );
  }
  // keep track of cellX for wrap-around
  this.slideableWidth = cellX;
  // slides
  this.updateSlides();
  // contain slides target
  this._containSlides();
  // update slidesWidth
  this.slidesWidth = len ? this.getLastSlide().target - this.slides[0].target : 0;
};

/**
 * cell.getSize() on multiple cells
 * @param {Array} cells
 */
proto._sizeCells = function( cells ) {
  cells.forEach( function( cell ) {
    cell.getSize();
  });
};

// --------------------------  -------------------------- //

proto.updateSlides = function() {
  this.slides = [];
  if ( !this.cells.length ) {
    return;
  }

  var slide = new Slide( this );
  this.slides.push( slide );
  var isOriginLeft = this.originSide == 'left';
  var nextMargin = isOriginLeft ? 'marginRight' : 'marginLeft';

  var canCellFit = this._getCanCellFit();

  this.cells.forEach( function( cell, i ) {
    // just add cell if first cell in slide
    if ( !slide.cells.length ) {
      slide.addCell( cell );
      return;
    }

    var slideWidth = ( slide.outerWidth - slide.firstMargin ) +
      ( cell.size.outerWidth - cell.size[ nextMargin ] );

    if ( canCellFit.call( this, i, slideWidth ) ) {
      slide.addCell( cell );
    } else {
      // doesn't fit, new slide
      slide.updateTarget();

      slide = new Slide( this );
      this.slides.push( slide );
      slide.addCell( cell );
    }
  }, this );
  // last slide
  slide.updateTarget();
  // update .selectedSlide
  this.updateSelectedSlide();
};

proto._getCanCellFit = function() {
  var groupCells = this.options.groupCells;
  if ( !groupCells ) {
    return function() {
      return false;
    };
  } else if ( typeof groupCells == 'number' ) {
    // group by number. 3 -> [0,1,2], [3,4,5], ...
    var number = parseInt( groupCells, 10 );
    return function( i ) {
      return ( i % number ) !== 0;
    };
  }
  // default, group by width of slide
  // parse '75%
  var percentMatch = typeof groupCells == 'string' &&
    groupCells.match(/^(\d+)%$/);
  var percent = percentMatch ? parseInt( percentMatch[1], 10 ) / 100 : 1;
  return function( i, slideWidth ) {
    return slideWidth <= ( this.size.innerWidth + 1 ) * percent;
  };
};

// alias _init for jQuery plugin .flickity()
proto._init =
proto.reposition = function() {
  this.positionCells();
  this.positionSliderAtSelected();
};

proto.getSize = function() {
  this.size = getSize( this.element );
  this.setCellAlign();
  this.cursorPosition = this.size.innerWidth * this.cellAlign;
};

var cellAlignShorthands = {
  // cell align, then based on origin side
  center: {
    left: 0.5,
    right: 0.5
  },
  left: {
    left: 0,
    right: 1
  },
  right: {
    right: 0,
    left: 1
  }
};

proto.setCellAlign = function() {
  var shorthand = cellAlignShorthands[ this.options.cellAlign ];
  this.cellAlign = shorthand ? shorthand[ this.originSide ] : this.options.cellAlign;
};

proto.setGallerySize = function() {
  if ( this.options.setGallerySize ) {
    var height = this.options.adaptiveHeight && this.selectedSlide ?
      this.selectedSlide.height : this.maxCellHeight;
    this.viewport.style.height = height + 'px';
  }
};

proto._getWrapShiftCells = function() {
  // only for wrap-around
  if ( !this.options.wrapAround ) {
    return;
  }
  // unshift previous cells
  this._unshiftCells( this.beforeShiftCells );
  this._unshiftCells( this.afterShiftCells );
  // get before cells
  // initial gap
  var gapX = this.cursorPosition;
  var cellIndex = this.cells.length - 1;
  this.beforeShiftCells = this._getGapCells( gapX, cellIndex, -1 );
  // get after cells
  // ending gap between last cell and end of gallery viewport
  gapX = this.size.innerWidth - this.cursorPosition;
  // start cloning at first cell, working forwards
  this.afterShiftCells = this._getGapCells( gapX, 0, 1 );
};

proto._getGapCells = function( gapX, cellIndex, increment ) {
  // keep adding cells until the cover the initial gap
  var cells = [];
  while ( gapX > 0 ) {
    var cell = this.cells[ cellIndex ];
    if ( !cell ) {
      break;
    }
    cells.push( cell );
    cellIndex += increment;
    gapX -= cell.size.outerWidth;
  }
  return cells;
};

// ----- contain ----- //

// contain cell targets so no excess sliding
proto._containSlides = function() {
  if ( !this.options.contain || this.options.wrapAround || !this.cells.length ) {
    return;
  }
  var isRightToLeft = this.options.rightToLeft;
  var beginMargin = isRightToLeft ? 'marginRight' : 'marginLeft';
  var endMargin = isRightToLeft ? 'marginLeft' : 'marginRight';
  var contentWidth = this.slideableWidth - this.getLastCell().size[ endMargin ];
  // content is less than gallery size
  var isContentSmaller = contentWidth < this.size.innerWidth;
  // bounds
  var beginBound = this.cursorPosition + this.cells[0].size[ beginMargin ];
  var endBound = contentWidth - this.size.innerWidth * ( 1 - this.cellAlign );
  // contain each cell target
  this.slides.forEach( function( slide ) {
    if ( isContentSmaller ) {
      // all cells fit inside gallery
      slide.target = contentWidth * this.cellAlign;
    } else {
      // contain to bounds
      slide.target = Math.max( slide.target, beginBound );
      slide.target = Math.min( slide.target, endBound );
    }
  }, this );
};

// -----  ----- //

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
proto.dispatchEvent = function( type, event, args ) {
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery && this.$element ) {
    // default trigger with type if no event
    type += this.options.namespaceJQueryEvents ? '.flickity' : '';
    var $event = type;
    if ( event ) {
      // create jQuery event
      var jQEvent = jQuery.Event( event );
      jQEvent.type = type;
      $event = jQEvent;
    }
    this.$element.trigger( $event, args );
  }
};

// -------------------------- select -------------------------- //

/**
 * @param {Integer} index - index of the slide
 * @param {Boolean} isWrap - will wrap-around to last/first if at the end
 * @param {Boolean} isInstant - will immediately set position at selected cell
 */
proto.select = function( index, isWrap, isInstant ) {
  if ( !this.isActive ) {
    return;
  }
  index = parseInt( index, 10 );
  this._wrapSelect( index );

  if ( this.options.wrapAround || isWrap ) {
    index = utils.modulo( index, this.slides.length );
  }
  // bail if invalid index
  if ( !this.slides[ index ] ) {
    return;
  }
  var prevIndex = this.selectedIndex;
  this.selectedIndex = index;
  this.updateSelectedSlide();
  if ( isInstant ) {
    this.positionSliderAtSelected();
  } else {
    this.startAnimation();
  }
  if ( this.options.adaptiveHeight ) {
    this.setGallerySize();
  }
  // events
  this.dispatchEvent( 'select', null, [ index ] );
  // change event if new index
  if ( index != prevIndex ) {
    this.dispatchEvent( 'change', null, [ index ] );
  }
  // old v1 event name, remove in v3
  this.dispatchEvent('cellSelect');
};

// wraps position for wrapAround, to move to closest slide. #113
proto._wrapSelect = function( index ) {
  var len = this.slides.length;
  var isWrapping = this.options.wrapAround && len > 1;
  if ( !isWrapping ) {
    return index;
  }
  var wrapIndex = utils.modulo( index, len );
  // go to shortest
  var delta = Math.abs( wrapIndex - this.selectedIndex );
  var backWrapDelta = Math.abs( ( wrapIndex + len ) - this.selectedIndex );
  var forewardWrapDelta = Math.abs( ( wrapIndex - len ) - this.selectedIndex );
  if ( !this.isDragSelect && backWrapDelta < delta ) {
    index += len;
  } else if ( !this.isDragSelect && forewardWrapDelta < delta ) {
    index -= len;
  }
  // wrap position so slider is within normal area
  if ( index < 0 ) {
    this.x -= this.slideableWidth;
  } else if ( index >= len ) {
    this.x += this.slideableWidth;
  }
};

proto.previous = function( isWrap, isInstant ) {
  this.select( this.selectedIndex - 1, isWrap, isInstant );
};

proto.next = function( isWrap, isInstant ) {
  this.select( this.selectedIndex + 1, isWrap, isInstant );
};

proto.updateSelectedSlide = function() {
  var slide = this.slides[ this.selectedIndex ];
  // selectedIndex could be outside of slides, if triggered before resize()
  if ( !slide ) {
    return;
  }
  // unselect previous selected slide
  this.unselectSelectedSlide();
  // update new selected slide
  this.selectedSlide = slide;
  slide.select();
  this.selectedCells = slide.cells;
  this.selectedElements = slide.getCellElements();
  // HACK: selectedCell & selectedElement is first cell in slide, backwards compatibility
  // Remove in v3?
  this.selectedCell = slide.cells[0];
  this.selectedElement = this.selectedElements[0];
};

proto.unselectSelectedSlide = function() {
  if ( this.selectedSlide ) {
    this.selectedSlide.unselect();
  }
};

proto.selectInitialIndex = function() {
  var initialIndex = this.options.initialIndex;
  // already activated, select previous selectedIndex
  if ( this.isInitActivated ) {
    this.select( this.selectedIndex, false, true );
    return;
  }
  // select with selector string
  if ( initialIndex && typeof initialIndex == 'string' ) {
    var cell = this.queryCell( initialIndex );
    if ( cell ) {
      this.selectCell( initialIndex, false, true );
      return;
    }
  }

  var index = 0;
  // select with number
  if ( initialIndex && this.slides[ initialIndex ] ) {
    index = initialIndex;
  }
  // select instantly
  this.select( index, false, true );
};

/**
 * select slide from number or cell element
 * @param {Element or Number} elem
 */
proto.selectCell = function( value, isWrap, isInstant ) {
  // get cell
  var cell = this.queryCell( value );
  if ( !cell ) {
    return;
  }

  var index = this.getCellSlideIndex( cell );
  this.select( index, isWrap, isInstant );
};

proto.getCellSlideIndex = function( cell ) {
  // get index of slides that has cell
  for ( var i=0; i < this.slides.length; i++ ) {
    var slide = this.slides[i];
    var index = slide.cells.indexOf( cell );
    if ( index != -1 ) {
      return i;
    }
  }
};

// -------------------------- get cells -------------------------- //

/**
 * get Flickity.Cell, given an Element
 * @param {Element} elem
 * @returns {Flickity.Cell} item
 */
proto.getCell = function( elem ) {
  // loop through cells to get the one that matches
  for ( var i=0; i < this.cells.length; i++ ) {
    var cell = this.cells[i];
    if ( cell.element == elem ) {
      return cell;
    }
  }
};

/**
 * get collection of Flickity.Cells, given Elements
 * @param {Element, Array, NodeList} elems
 * @returns {Array} cells - Flickity.Cells
 */
proto.getCells = function( elems ) {
  elems = utils.makeArray( elems );
  var cells = [];
  elems.forEach( function( elem ) {
    var cell = this.getCell( elem );
    if ( cell ) {
      cells.push( cell );
    }
  }, this );
  return cells;
};

/**
 * get cell elements
 * @returns {Array} cellElems
 */
proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  });
};

/**
 * get parent cell from an element
 * @param {Element} elem
 * @returns {Flickit.Cell} cell
 */
proto.getParentCell = function( elem ) {
  // first check if elem is cell
  var cell = this.getCell( elem );
  if ( cell ) {
    return cell;
  }
  // try to get parent cell elem
  elem = utils.getParent( elem, '.flickity-slider > *' );
  return this.getCell( elem );
};

/**
 * get cells adjacent to a slide
 * @param {Integer} adjCount - number of adjacent slides
 * @param {Integer} index - index of slide to start
 * @returns {Array} cells - array of Flickity.Cells
 */
proto.getAdjacentCellElements = function( adjCount, index ) {
  if ( !adjCount ) {
    return this.selectedSlide.getCellElements();
  }
  index = index === undefined ? this.selectedIndex : index;

  var len = this.slides.length;
  if ( 1 + ( adjCount * 2 ) >= len ) {
    return this.getCellElements();
  }

  var cellElems = [];
  for ( var i = index - adjCount; i <= index + adjCount ; i++ ) {
    var slideIndex = this.options.wrapAround ? utils.modulo( i, len ) : i;
    var slide = this.slides[ slideIndex ];
    if ( slide ) {
      cellElems = cellElems.concat( slide.getCellElements() );
    }
  }
  return cellElems;
};

/**
 * select slide from number or cell element
 * @param {Element, Selector String, or Number} selector
 */
proto.queryCell = function( selector ) {
  if ( typeof selector == 'number' ) {
    // use number as index
    return this.cells[ selector ];
  }
  if ( typeof selector == 'string' ) {
    // do not select invalid selectors from hash: #123, #/. #791
    if ( selector.match(/^[#\.]?[\d\/]/) ) {
      return;
    }
    // use string as selector, get element
    selector = this.element.querySelector( selector );
  }
  // get cell from element
  return this.getCell( selector );
};

// -------------------------- events -------------------------- //

proto.uiChange = function() {
  this.emitEvent('uiChange');
};

// keep focus on element when child UI elements are clicked
proto.childUIPointerDown = function( event ) {
  // HACK iOS does not allow touch events to bubble up?!
  if ( event.type != 'touchstart' ) {
    event.preventDefault();
  }
  this.focus();
};

// ----- resize ----- //

proto.onresize = function() {
  this.watchCSS();
  this.resize();
};

utils.debounceMethod( Flickity, 'onresize', 150 );

proto.resize = function() {
  if ( !this.isActive ) {
    return;
  }
  this.getSize();
  // wrap values
  if ( this.options.wrapAround ) {
    this.x = utils.modulo( this.x, this.slideableWidth );
  }
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
  this.emitEvent('resize');
  // update selected index for group slides, instant
  // TODO: position can be lost between groups of various numbers
  var selectedElement = this.selectedElements && this.selectedElements[0];
  this.selectCell( selectedElement, false, true );
};

// watches the :after property, activates/deactivates
proto.watchCSS = function() {
  var watchOption = this.options.watchCSS;
  if ( !watchOption ) {
    return;
  }

  var afterContent = getComputedStyle( this.element, ':after' ).content;
  // activate if :after { content: 'flickity' }
  if ( afterContent.indexOf('flickity') != -1 ) {
    this.activate();
  } else {
    this.deactivate();
  }
};

// ----- keydown ----- //

// go previous/next if left/right keys pressed
proto.onkeydown = function( event ) {
  // only work if element is in focus
  var isNotFocused = document.activeElement && document.activeElement != this.element;
  if ( !this.options.accessibility ||isNotFocused ) {
    return;
  }

  var handler = Flickity.keyboardHandlers[ event.keyCode ];
  if ( handler ) {
    handler.call( this );
  }
};

Flickity.keyboardHandlers = {
  // left arrow
  37: function() {
    var leftMethod = this.options.rightToLeft ? 'next' : 'previous';
    this.uiChange();
    this[ leftMethod ]();
  },
  // right arrow
  39: function() {
    var rightMethod = this.options.rightToLeft ? 'previous' : 'next';
    this.uiChange();
    this[ rightMethod ]();
  },
};

// ----- focus ----- //

proto.focus = function() {
  // TODO remove scrollTo once focus options gets more support
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Browser_compatibility
  var prevScrollY = window.pageYOffset;
  this.element.focus({ preventScroll: true });
  // hack to fix scroll jump after focus, #76
  if ( window.pageYOffset != prevScrollY ) {
    window.scrollTo( window.pageXOffset, prevScrollY );
  }
};

// -------------------------- destroy -------------------------- //

// deactivate all Flickity functionality, but keep stuff available
proto.deactivate = function() {
  if ( !this.isActive ) {
    return;
  }
  this.element.classList.remove('flickity-enabled');
  this.element.classList.remove('flickity-rtl');
  this.unselectSelectedSlide();
  // destroy cells
  this.cells.forEach( function( cell ) {
    cell.destroy();
  });
  this.element.removeChild( this.viewport );
  // move child elements back into element
  moveElements( this.slider.children, this.element );
  if ( this.options.accessibility ) {
    this.element.removeAttribute('tabIndex');
    this.element.removeEventListener( 'keydown', this );
  }
  // set flags
  this.isActive = false;
  this.emitEvent('deactivate');
};

proto.destroy = function() {
  this.deactivate();
  window.removeEventListener( 'resize', this );
  this.allOff();
  this.emitEvent('destroy');
  if ( jQuery && this.$element ) {
    jQuery.removeData( this.element, 'flickity' );
  }
  delete this.element.flickityGUID;
  delete instances[ this.guid ];
};

// -------------------------- prototype -------------------------- //

utils.extend( proto, animatePrototype );

// -------------------------- extras -------------------------- //

/**
 * get Flickity instance from element
 * @param {Element} elem
 * @returns {Flickity}
 */
Flickity.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.flickityGUID;
  return id && instances[ id ];
};

utils.htmlInit( Flickity, 'flickity' );

if ( jQuery && jQuery.bridget ) {
  jQuery.bridget( 'flickity', Flickity );
}

// set internal jQuery, for Webpack + jQuery v3, #478
Flickity.setJQuery = function( jq ) {
  jQuery = jq;
};

Flickity.Cell = Cell;
Flickity.Slide = Slide;

return Flickity;

}));
});

var unipointer = index_es_createCommonjsModule(function (module) {
/*!
 * Unipointer v2.3.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*global define, module, require */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      evEmitter
    );
  } else {
    // browser global
    window.Unipointer = factory(
      window,
      window.EvEmitter
    );
  }

}( window, function factory( window, EvEmitter ) {

function noop() {}

function Unipointer() {}

// inherit EvEmitter
var proto = Unipointer.prototype = Object.create( EvEmitter.prototype );

proto.bindStartEvent = function( elem ) {
  this._bindStartEvent( elem, true );
};

proto.unbindStartEvent = function( elem ) {
  this._bindStartEvent( elem, false );
};

/**
 * Add or remove start event
 * @param {Boolean} isAdd - remove if falsey
 */
proto._bindStartEvent = function( elem, isAdd ) {
  // munge isAdd, default to true
  isAdd = isAdd === undefined ? true : isAdd;
  var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';

  // default to mouse events
  var startEvent = 'mousedown';
  if ( window.PointerEvent ) {
    // Pointer Events
    startEvent = 'pointerdown';
  } else if ( 'ontouchstart' in window ) {
    // Touch Events. iOS Safari
    startEvent = 'touchstart';
  }
  elem[ bindMethod ]( startEvent, this );
};

// trigger handler methods for events
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// returns the touch that we're keeping track of
proto.getTouch = function( touches ) {
  for ( var i=0; i < touches.length; i++ ) {
    var touch = touches[i];
    if ( touch.identifier == this.pointerIdentifier ) {
      return touch;
    }
  }
};

// ----- start event ----- //

proto.onmousedown = function( event ) {
  // dismiss clicks from right or middle buttons
  var button = event.button;
  if ( button && ( button !== 0 && button !== 1 ) ) {
    return;
  }
  this._pointerDown( event, event );
};

proto.ontouchstart = function( event ) {
  this._pointerDown( event, event.changedTouches[0] );
};

proto.onpointerdown = function( event ) {
  this._pointerDown( event, event );
};

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto._pointerDown = function( event, pointer ) {
  // dismiss right click and other pointers
  // button = 0 is okay, 1-4 not
  if ( event.button || this.isPointerDown ) {
    return;
  }

  this.isPointerDown = true;
  // save pointer identifier to match up touch events
  this.pointerIdentifier = pointer.pointerId !== undefined ?
    // pointerId for pointer events, touch.indentifier for touch events
    pointer.pointerId : pointer.identifier;

  this.pointerDown( event, pointer );
};

proto.pointerDown = function( event, pointer ) {
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// hash of events to be bound after start event
var postStartEvents = {
  mousedown: [ 'mousemove', 'mouseup' ],
  touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
  pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
};

proto._bindPostStartEvents = function( event ) {
  if ( !event ) {
    return;
  }
  // get proper events to match start event
  var events = postStartEvents[ event.type ];
  // bind events to node
  events.forEach( function( eventName ) {
    window.addEventListener( eventName, this );
  }, this );
  // save these arguments
  this._boundPointerEvents = events;
};

proto._unbindPostStartEvents = function() {
  // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
  if ( !this._boundPointerEvents ) {
    return;
  }
  this._boundPointerEvents.forEach( function( eventName ) {
    window.removeEventListener( eventName, this );
  }, this );

  delete this._boundPointerEvents;
};

// ----- move event ----- //

proto.onmousemove = function( event ) {
  this._pointerMove( event, event );
};

proto.onpointermove = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerMove( event, event );
  }
};

proto.ontouchmove = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerMove( event, touch );
  }
};

/**
 * pointer move
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerMove = function( event, pointer ) {
  this.pointerMove( event, pointer );
};

// public
proto.pointerMove = function( event, pointer ) {
  this.emitEvent( 'pointerMove', [ event, pointer ] );
};

// ----- end event ----- //


proto.onmouseup = function( event ) {
  this._pointerUp( event, event );
};

proto.onpointerup = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerUp( event, event );
  }
};

proto.ontouchend = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerUp( event, touch );
  }
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerUp = function( event, pointer ) {
  this._pointerDone();
  this.pointerUp( event, pointer );
};

// public
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
};

// ----- pointer done ----- //

// triggered on pointer up & pointer cancel
proto._pointerDone = function() {
  this._pointerReset();
  this._unbindPostStartEvents();
  this.pointerDone();
};

proto._pointerReset = function() {
  // reset properties
  this.isPointerDown = false;
  delete this.pointerIdentifier;
};

proto.pointerDone = noop;

// ----- pointer cancel ----- //

proto.onpointercancel = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerCancel( event, event );
  }
};

proto.ontouchcancel = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerCancel( event, touch );
  }
};

/**
 * pointer cancel
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerCancel = function( event, pointer ) {
  this._pointerDone();
  this.pointerCancel( event, pointer );
};

// public
proto.pointerCancel = function( event, pointer ) {
  this.emitEvent( 'pointerCancel', [ event, pointer ] );
};

// -----  ----- //

// utility function for getting x/y coords from event
Unipointer.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX,
    y: pointer.pageY
  };
};

// -----  ----- //

return Unipointer;

}));
});

var unidragger = index_es_createCommonjsModule(function (module) {
/*!
 * Unidragger v2.3.0
 * Draggable base class
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      unipointer
    );
  } else {
    // browser global
    window.Unidragger = factory(
      window,
      window.Unipointer
    );
  }

}( window, function factory( window, Unipointer ) {

// -------------------------- Unidragger -------------------------- //

function Unidragger() {}

// inherit Unipointer & EvEmitter
var proto = Unidragger.prototype = Object.create( Unipointer.prototype );

// ----- bind start ----- //

proto.bindHandles = function() {
  this._bindHandles( true );
};

proto.unbindHandles = function() {
  this._bindHandles( false );
};

/**
 * Add or remove start event
 * @param {Boolean} isAdd
 */
proto._bindHandles = function( isAdd ) {
  // munge isAdd, default to true
  isAdd = isAdd === undefined ? true : isAdd;
  // bind each handle
  var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';
  var touchAction = isAdd ? this._touchActionValue : '';
  for ( var i=0; i < this.handles.length; i++ ) {
    var handle = this.handles[i];
    this._bindStartEvent( handle, isAdd );
    handle[ bindMethod ]( 'click', this );
    // touch-action: none to override browser touch gestures. metafizzy/flickity#540
    if ( window.PointerEvent ) {
      handle.style.touchAction = touchAction;
    }
  }
};

// prototype so it can be overwriteable by Flickity
proto._touchActionValue = 'none';

// ----- start event ----- //

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerDown = function( event, pointer ) {
  var isOkay = this.okayPointerDown( event );
  if ( !isOkay ) {
    return;
  }
  // track start event position
  this.pointerDownPointer = pointer;

  event.preventDefault();
  this.pointerDownBlur();
  // bind move and end events
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// nodes that have text fields
var cursorNodes = {
  TEXTAREA: true,
  INPUT: true,
  SELECT: true,
  OPTION: true,
};

// input types that do not have text fields
var clickTypes = {
  radio: true,
  checkbox: true,
  button: true,
  submit: true,
  image: true,
  file: true,
};

// dismiss inputs with text fields. flickity#403, flickity#404
proto.okayPointerDown = function( event ) {
  var isCursorNode = cursorNodes[ event.target.nodeName ];
  var isClickType = clickTypes[ event.target.type ];
  var isOkay = !isCursorNode || isClickType;
  if ( !isOkay ) {
    this._pointerReset();
  }
  return isOkay;
};

// kludge to blur previously focused input
proto.pointerDownBlur = function() {
  var focused = document.activeElement;
  // do not blur body for IE10, metafizzy/flickity#117
  var canBlur = focused && focused.blur && focused != document.body;
  if ( canBlur ) {
    focused.blur();
  }
};

// ----- move event ----- //

/**
 * drag move
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

// base pointer move logic
proto._dragPointerMove = function( event, pointer ) {
  var moveVector = {
    x: pointer.pageX - this.pointerDownPointer.pageX,
    y: pointer.pageY - this.pointerDownPointer.pageY
  };
  // start drag if pointer has moved far enough to start drag
  if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
    this._dragStart( event, pointer );
  }
  return moveVector;
};

// condition if pointer has moved far enough to start drag
proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
};

// ----- end event ----- //

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
  this._dragPointerUp( event, pointer );
};

proto._dragPointerUp = function( event, pointer ) {
  if ( this.isDragging ) {
    this._dragEnd( event, pointer );
  } else {
    // pointer didn't move enough for drag to start
    this._staticClick( event, pointer );
  }
};

// -------------------------- drag -------------------------- //

// dragStart
proto._dragStart = function( event, pointer ) {
  this.isDragging = true;
  // prevent clicks
  this.isPreventingClicks = true;
  this.dragStart( event, pointer );
};

proto.dragStart = function( event, pointer ) {
  this.emitEvent( 'dragStart', [ event, pointer ] );
};

// dragMove
proto._dragMove = function( event, pointer, moveVector ) {
  // do not drag if not dragging yet
  if ( !this.isDragging ) {
    return;
  }

  this.dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  event.preventDefault();
  this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
};

// dragEnd
proto._dragEnd = function( event, pointer ) {
  // set flags
  this.isDragging = false;
  // re-enable clicking async
  setTimeout( function() {
    delete this.isPreventingClicks;
  }.bind( this ) );

  this.dragEnd( event, pointer );
};

proto.dragEnd = function( event, pointer ) {
  this.emitEvent( 'dragEnd', [ event, pointer ] );
};

// ----- onclick ----- //

// handle all clicks and prevent clicks when dragging
proto.onclick = function( event ) {
  if ( this.isPreventingClicks ) {
    event.preventDefault();
  }
};

// ----- staticClick ----- //

// triggered after pointer down & up with no/tiny movement
proto._staticClick = function( event, pointer ) {
  // ignore emulated mouse up clicks
  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
    return;
  }

  this.staticClick( event, pointer );

  // set flag for emulated clicks 300ms after touchend
  if ( event.type != 'mouseup' ) {
    this.isIgnoringMouseUp = true;
    // reset flag after 300ms
    setTimeout( function() {
      delete this.isIgnoringMouseUp;
    }.bind( this ), 400 );
  }
};

proto.staticClick = function( event, pointer ) {
  this.emitEvent( 'staticClick', [ event, pointer ] );
};

// ----- utils ----- //

Unidragger.getPointerPoint = Unipointer.getPointerPoint;

// -----  ----- //

return Unidragger;

}));
});

var drag = index_es_createCommonjsModule(function (module) {
// drag
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      flickity,
      unidragger,
      utils
    );
  } else {
    // browser global
    window.Flickity = factory(
      window,
      window.Flickity,
      window.Unidragger,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, Unidragger, utils ) {

// ----- defaults ----- //

utils.extend( Flickity.defaults, {
  draggable: '>1',
  dragThreshold: 3,
});

// ----- create ----- //

Flickity.createMethods.push('_createDrag');

// -------------------------- drag prototype -------------------------- //

var proto = Flickity.prototype;
utils.extend( proto, Unidragger.prototype );
proto._touchActionValue = 'pan-y';

// --------------------------  -------------------------- //

var isTouch = 'createTouch' in document;
var isTouchmoveScrollCanceled = false;

proto._createDrag = function() {
  this.on( 'activate', this.onActivateDrag );
  this.on( 'uiChange', this._uiChangeDrag );
  this.on( 'deactivate', this.onDeactivateDrag );
  this.on( 'cellChange', this.updateDraggable );
  // TODO updateDraggable on resize? if groupCells & slides change
  // HACK - add seemingly innocuous handler to fix iOS 10 scroll behavior
  // #457, RubaXa/Sortable#973
  if ( isTouch && !isTouchmoveScrollCanceled ) {
    window.addEventListener( 'touchmove', function() {});
    isTouchmoveScrollCanceled = true;
  }
};

proto.onActivateDrag = function() {
  this.handles = [ this.viewport ];
  this.bindHandles();
  this.updateDraggable();
};

proto.onDeactivateDrag = function() {
  this.unbindHandles();
  this.element.classList.remove('is-draggable');
};

proto.updateDraggable = function() {
  // disable dragging if less than 2 slides. #278
  if ( this.options.draggable == '>1' ) {
    this.isDraggable = this.slides.length > 1;
  } else {
    this.isDraggable = this.options.draggable;
  }
  if ( this.isDraggable ) {
    this.element.classList.add('is-draggable');
  } else {
    this.element.classList.remove('is-draggable');
  }
};

// backwards compatibility
proto.bindDrag = function() {
  this.options.draggable = true;
  this.updateDraggable();
};

proto.unbindDrag = function() {
  this.options.draggable = false;
  this.updateDraggable();
};

proto._uiChangeDrag = function() {
  delete this.isFreeScrolling;
};

// -------------------------- pointer events -------------------------- //

proto.pointerDown = function( event, pointer ) {
  if ( !this.isDraggable ) {
    this._pointerDownDefault( event, pointer );
    return;
  }
  var isOkay = this.okayPointerDown( event );
  if ( !isOkay ) {
    return;
  }

  this._pointerDownPreventDefault( event );
  this.pointerDownFocus( event );
  // blur
  if ( document.activeElement != this.element ) {
    // do not blur if already focused
    this.pointerDownBlur();
  }

  // stop if it was moving
  this.dragX = this.x;
  this.viewport.classList.add('is-pointer-down');
  // track scrolling
  this.pointerDownScroll = getScrollPosition();
  window.addEventListener( 'scroll', this );

  this._pointerDownDefault( event, pointer );
};

// default pointerDown logic, used for staticClick
proto._pointerDownDefault = function( event, pointer ) {
  // track start event position
  // Safari 9 overrides pageX and pageY. These values needs to be copied. #779
  this.pointerDownPointer = {
    pageX: pointer.pageX,
    pageY: pointer.pageY,
  };
  // bind move and end events
  this._bindPostStartEvents( event );
  this.dispatchEvent( 'pointerDown', event, [ pointer ] );
};

var focusNodes = {
  INPUT: true,
  TEXTAREA: true,
  SELECT: true,
};

proto.pointerDownFocus = function( event ) {
  var isFocusNode = focusNodes[ event.target.nodeName ];
  if ( !isFocusNode ) {
    this.focus();
  }
};

proto._pointerDownPreventDefault = function( event ) {
  var isTouchStart = event.type == 'touchstart';
  var isTouchPointer = event.pointerType == 'touch';
  var isFocusNode = focusNodes[ event.target.nodeName ];
  if ( !isTouchStart && !isTouchPointer && !isFocusNode ) {
    event.preventDefault();
  }
};

// ----- move ----- //

proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > this.options.dragThreshold;
};

// ----- up ----- //

proto.pointerUp = function( event, pointer ) {
  delete this.isTouchScrolling;
  this.viewport.classList.remove('is-pointer-down');
  this.dispatchEvent( 'pointerUp', event, [ pointer ] );
  this._dragPointerUp( event, pointer );
};

proto.pointerDone = function() {
  window.removeEventListener( 'scroll', this );
  delete this.pointerDownScroll;
};

// -------------------------- dragging -------------------------- //

proto.dragStart = function( event, pointer ) {
  if ( !this.isDraggable ) {
    return;
  }
  this.dragStartPosition = this.x;
  this.startAnimation();
  window.removeEventListener( 'scroll', this );
  this.dispatchEvent( 'dragStart', event, [ pointer ] );
};

proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.dispatchEvent( 'pointerMove', event, [ pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  if ( !this.isDraggable ) {
    return;
  }
  event.preventDefault();

  this.previousDragX = this.dragX;
  // reverse if right-to-left
  var direction = this.options.rightToLeft ? -1 : 1;
  if ( this.options.wrapAround ) {
    // wrap around move. #589
    moveVector.x = moveVector.x % this.slideableWidth;
  }
  var dragX = this.dragStartPosition + moveVector.x * direction;

  if ( !this.options.wrapAround && this.slides.length ) {
    // slow drag
    var originBound = Math.max( -this.slides[0].target, this.dragStartPosition );
    dragX = dragX > originBound ? ( dragX + originBound ) * 0.5 : dragX;
    var endBound = Math.min( -this.getLastSlide().target, this.dragStartPosition );
    dragX = dragX < endBound ? ( dragX + endBound ) * 0.5 : dragX;
  }

  this.dragX = dragX;

  this.dragMoveTime = new Date();
  this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
};

proto.dragEnd = function( event, pointer ) {
  if ( !this.isDraggable ) {
    return;
  }
  if ( this.options.freeScroll ) {
    this.isFreeScrolling = true;
  }
  // set selectedIndex based on where flick will end up
  var index = this.dragEndRestingSelect();

  if ( this.options.freeScroll && !this.options.wrapAround ) {
    // if free-scroll & not wrap around
    // do not free-scroll if going outside of bounding slides
    // so bounding slides can attract slider, and keep it in bounds
    var restingX = this.getRestingPosition();
    this.isFreeScrolling = -restingX > this.slides[0].target &&
      -restingX < this.getLastSlide().target;
  } else if ( !this.options.freeScroll && index == this.selectedIndex ) {
    // boost selection if selected index has not changed
    index += this.dragEndBoostSelect();
  }
  delete this.previousDragX;
  // apply selection
  // TODO refactor this, selecting here feels weird
  // HACK, set flag so dragging stays in correct direction
  this.isDragSelect = this.options.wrapAround;
  this.select( index );
  delete this.isDragSelect;
  this.dispatchEvent( 'dragEnd', event, [ pointer ] );
};

proto.dragEndRestingSelect = function() {
  var restingX = this.getRestingPosition();
  // how far away from selected slide
  var distance = Math.abs( this.getSlideDistance( -restingX, this.selectedIndex ) );
  // get closet resting going up and going down
  var positiveResting = this._getClosestResting( restingX, distance, 1 );
  var negativeResting = this._getClosestResting( restingX, distance, -1 );
  // use closer resting for wrap-around
  var index = positiveResting.distance < negativeResting.distance ?
    positiveResting.index : negativeResting.index;
  return index;
};

/**
 * given resting X and distance to selected cell
 * get the distance and index of the closest cell
 * @param {Number} restingX - estimated post-flick resting position
 * @param {Number} distance - distance to selected cell
 * @param {Integer} increment - +1 or -1, going up or down
 * @returns {Object} - { distance: {Number}, index: {Integer} }
 */
proto._getClosestResting = function( restingX, distance, increment ) {
  var index = this.selectedIndex;
  var minDistance = Infinity;
  var condition = this.options.contain && !this.options.wrapAround ?
    // if contain, keep going if distance is equal to minDistance
    function( d, md ) { return d <= md; } : function( d, md ) { return d < md; };
  while ( condition( distance, minDistance ) ) {
    // measure distance to next cell
    index += increment;
    minDistance = distance;
    distance = this.getSlideDistance( -restingX, index );
    if ( distance === null ) {
      break;
    }
    distance = Math.abs( distance );
  }
  return {
    distance: minDistance,
    // selected was previous index
    index: index - increment
  };
};

/**
 * measure distance between x and a slide target
 * @param {Number} x
 * @param {Integer} index - slide index
 */
proto.getSlideDistance = function( x, index ) {
  var len = this.slides.length;
  // wrap around if at least 2 slides
  var isWrapAround = this.options.wrapAround && len > 1;
  var slideIndex = isWrapAround ? utils.modulo( index, len ) : index;
  var slide = this.slides[ slideIndex ];
  if ( !slide ) {
    return null;
  }
  // add distance for wrap-around slides
  var wrap = isWrapAround ? this.slideableWidth * Math.floor( index / len ) : 0;
  return x - ( slide.target + wrap );
};

proto.dragEndBoostSelect = function() {
  // do not boost if no previousDragX or dragMoveTime
  if ( this.previousDragX === undefined || !this.dragMoveTime ||
    // or if drag was held for 100 ms
    new Date() - this.dragMoveTime > 100 ) {
    return 0;
  }

  var distance = this.getSlideDistance( -this.dragX, this.selectedIndex );
  var delta = this.previousDragX - this.dragX;
  if ( distance > 0 && delta > 0 ) {
    // boost to next if moving towards the right, and positive velocity
    return 1;
  } else if ( distance < 0 && delta < 0 ) {
    // boost to previous if moving towards the left, and negative velocity
    return -1;
  }
  return 0;
};

// ----- staticClick ----- //

proto.staticClick = function( event, pointer ) {
  // get clickedCell, if cell was clicked
  var clickedCell = this.getParentCell( event.target );
  var cellElem = clickedCell && clickedCell.element;
  var cellIndex = clickedCell && this.cells.indexOf( clickedCell );
  this.dispatchEvent( 'staticClick', event, [ pointer, cellElem, cellIndex ] );
};

// ----- scroll ----- //

proto.onscroll = function() {
  var scroll = getScrollPosition();
  var scrollMoveX = this.pointerDownScroll.x - scroll.x;
  var scrollMoveY = this.pointerDownScroll.y - scroll.y;
  // cancel click/tap if scroll is too much
  if ( Math.abs( scrollMoveX ) > 3 || Math.abs( scrollMoveY ) > 3 ) {
    this._pointerDone();
  }
};

// ----- utils ----- //

function getScrollPosition() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset
  };
}

// -----  ----- //

return Flickity;

}));
});

var prevNextButton = index_es_createCommonjsModule(function (module) {
// prev/next buttons
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      flickity,
      unipointer,
      utils
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.Unipointer,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, Unipointer, utils ) {

var svgURI = 'http://www.w3.org/2000/svg';

// -------------------------- PrevNextButton -------------------------- //

function PrevNextButton( direction, parent ) {
  this.direction = direction;
  this.parent = parent;
  this._create();
}

PrevNextButton.prototype = Object.create( Unipointer.prototype );

PrevNextButton.prototype._create = function() {
  // properties
  this.isEnabled = true;
  this.isPrevious = this.direction == -1;
  var leftDirection = this.parent.options.rightToLeft ? 1 : -1;
  this.isLeft = this.direction == leftDirection;

  var element = this.element = document.createElement('button');
  element.className = 'flickity-button flickity-prev-next-button';
  element.className += this.isPrevious ? ' previous' : ' next';
  // prevent button from submitting form http://stackoverflow.com/a/10836076/182183
  element.setAttribute( 'type', 'button' );
  // init as disabled
  this.disable();

  element.setAttribute( 'aria-label', this.isPrevious ? 'Previous' : 'Next' );

  // create arrow
  var svg = this.createSVG();
  element.appendChild( svg );
  // events
  this.parent.on( 'select', this.update.bind( this ) );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PrevNextButton.prototype.activate = function() {
  this.bindStartEvent( this.element );
  this.element.addEventListener( 'click', this );
  // add to DOM
  this.parent.element.appendChild( this.element );
};

PrevNextButton.prototype.deactivate = function() {
  // remove from DOM
  this.parent.element.removeChild( this.element );
  // click events
  this.unbindStartEvent( this.element );
  this.element.removeEventListener( 'click', this );
};

PrevNextButton.prototype.createSVG = function() {
  var svg = document.createElementNS( svgURI, 'svg');
  svg.setAttribute( 'class', 'flickity-button-icon' );
  svg.setAttribute( 'viewBox', '0 0 100 100' );
  var path = document.createElementNS( svgURI, 'path');
  var pathMovements = getArrowMovements( this.parent.options.arrowShape );
  path.setAttribute( 'd', pathMovements );
  path.setAttribute( 'class', 'arrow' );
  // rotate arrow
  if ( !this.isLeft ) {
    path.setAttribute( 'transform', 'translate(100, 100) rotate(180) ' );
  }
  svg.appendChild( path );
  return svg;
};

// get SVG path movmement
function getArrowMovements( shape ) {
  // use shape as movement if string
  if ( typeof shape == 'string' ) {
    return shape;
  }
  // create movement string
  return 'M ' + shape.x0 + ',50' +
    ' L ' + shape.x1 + ',' + ( shape.y1 + 50 ) +
    ' L ' + shape.x2 + ',' + ( shape.y2 + 50 ) +
    ' L ' + shape.x3 + ',50 ' +
    ' L ' + shape.x2 + ',' + ( 50 - shape.y2 ) +
    ' L ' + shape.x1 + ',' + ( 50 - shape.y1 ) +
    ' Z';
}

PrevNextButton.prototype.handleEvent = utils.handleEvent;

PrevNextButton.prototype.onclick = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.parent.uiChange();
  var method = this.isPrevious ? 'previous' : 'next';
  this.parent[ method ]();
};

// -----  ----- //

PrevNextButton.prototype.enable = function() {
  if ( this.isEnabled ) {
    return;
  }
  this.element.disabled = false;
  this.isEnabled = true;
};

PrevNextButton.prototype.disable = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.element.disabled = true;
  this.isEnabled = false;
};

PrevNextButton.prototype.update = function() {
  // index of first or last slide, if previous or next
  var slides = this.parent.slides;
  // enable is wrapAround and at least 2 slides
  if ( this.parent.options.wrapAround && slides.length > 1 ) {
    this.enable();
    return;
  }
  var lastIndex = slides.length ? slides.length - 1 : 0;
  var boundIndex = this.isPrevious ? 0 : lastIndex;
  var method = this.parent.selectedIndex == boundIndex ? 'disable' : 'enable';
  this[ method ]();
};

PrevNextButton.prototype.destroy = function() {
  this.deactivate();
  this.allOff();
};

// -------------------------- Flickity prototype -------------------------- //

utils.extend( Flickity.defaults, {
  prevNextButtons: true,
  arrowShape: {
    x0: 10,
    x1: 60, y1: 50,
    x2: 70, y2: 40,
    x3: 30
  }
});

Flickity.createMethods.push('_createPrevNextButtons');
var proto = Flickity.prototype;

proto._createPrevNextButtons = function() {
  if ( !this.options.prevNextButtons ) {
    return;
  }

  this.prevButton = new PrevNextButton( -1, this );
  this.nextButton = new PrevNextButton( 1, this );

  this.on( 'activate', this.activatePrevNextButtons );
};

proto.activatePrevNextButtons = function() {
  this.prevButton.activate();
  this.nextButton.activate();
  this.on( 'deactivate', this.deactivatePrevNextButtons );
};

proto.deactivatePrevNextButtons = function() {
  this.prevButton.deactivate();
  this.nextButton.deactivate();
  this.off( 'deactivate', this.deactivatePrevNextButtons );
};

// --------------------------  -------------------------- //

Flickity.PrevNextButton = PrevNextButton;

return Flickity;

}));
});

var pageDots = index_es_createCommonjsModule(function (module) {
// page dots
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      flickity,
      unipointer,
      utils
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.Unipointer,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, Unipointer, utils ) {

function PageDots( parent ) {
  this.parent = parent;
  this._create();
}

PageDots.prototype = Object.create( Unipointer.prototype );

PageDots.prototype._create = function() {
  // create holder element
  this.holder = document.createElement('ol');
  this.holder.className = 'flickity-page-dots';
  // create dots, array of elements
  this.dots = [];
  // events
  this.handleClick = this.onClick.bind( this );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PageDots.prototype.activate = function() {
  this.setDots();
  this.holder.addEventListener( 'click', this.handleClick );
  this.bindStartEvent( this.holder );
  // add to DOM
  this.parent.element.appendChild( this.holder );
};

PageDots.prototype.deactivate = function() {
  this.holder.removeEventListener( 'click', this.handleClick );
  this.unbindStartEvent( this.holder );
  // remove from DOM
  this.parent.element.removeChild( this.holder );
};

PageDots.prototype.setDots = function() {
  // get difference between number of slides and number of dots
  var delta = this.parent.slides.length - this.dots.length;
  if ( delta > 0 ) {
    this.addDots( delta );
  } else if ( delta < 0 ) {
    this.removeDots( -delta );
  }
};

PageDots.prototype.addDots = function( count ) {
  var fragment = document.createDocumentFragment();
  var newDots = [];
  var length = this.dots.length;
  var max = length + count;

  for ( var i = length; i < max; i++ ) {
    var dot = document.createElement('li');
    dot.className = 'dot';
    dot.setAttribute( 'aria-label', 'Page dot ' + ( i + 1 ) );
    fragment.appendChild( dot );
    newDots.push( dot );
  }

  this.holder.appendChild( fragment );
  this.dots = this.dots.concat( newDots );
};

PageDots.prototype.removeDots = function( count ) {
  // remove from this.dots collection
  var removeDots = this.dots.splice( this.dots.length - count, count );
  // remove from DOM
  removeDots.forEach( function( dot ) {
    this.holder.removeChild( dot );
  }, this );
};

PageDots.prototype.updateSelected = function() {
  // remove selected class on previous
  if ( this.selectedDot ) {
    this.selectedDot.className = 'dot';
    this.selectedDot.removeAttribute('aria-current');
  }
  // don't proceed if no dots
  if ( !this.dots.length ) {
    return;
  }
  this.selectedDot = this.dots[ this.parent.selectedIndex ];
  this.selectedDot.className = 'dot is-selected';
  this.selectedDot.setAttribute( 'aria-current', 'step' );
};

PageDots.prototype.onTap = // old method name, backwards-compatible
PageDots.prototype.onClick = function( event ) {
  var target = event.target;
  // only care about dot clicks
  if ( target.nodeName != 'LI' ) {
    return;
  }

  this.parent.uiChange();
  var index = this.dots.indexOf( target );
  this.parent.select( index );
};

PageDots.prototype.destroy = function() {
  this.deactivate();
  this.allOff();
};

Flickity.PageDots = PageDots;

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pageDots: true
});

Flickity.createMethods.push('_createPageDots');

var proto = Flickity.prototype;

proto._createPageDots = function() {
  if ( !this.options.pageDots ) {
    return;
  }
  this.pageDots = new PageDots( this );
  // events
  this.on( 'activate', this.activatePageDots );
  this.on( 'select', this.updateSelectedPageDots );
  this.on( 'cellChange', this.updatePageDots );
  this.on( 'resize', this.updatePageDots );
  this.on( 'deactivate', this.deactivatePageDots );
};

proto.activatePageDots = function() {
  this.pageDots.activate();
};

proto.updateSelectedPageDots = function() {
  this.pageDots.updateSelected();
};

proto.updatePageDots = function() {
  this.pageDots.setDots();
};

proto.deactivatePageDots = function() {
  this.pageDots.deactivate();
};

// -----  ----- //

Flickity.PageDots = PageDots;

return Flickity;

}));
});

var player = index_es_createCommonjsModule(function (module) {
// player & autoPlay
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      evEmitter,
      utils,
      flickity
    );
  } else {
    // browser global
    factory(
      window.EvEmitter,
      window.fizzyUIUtils,
      window.Flickity
    );
  }

}( window, function factory( EvEmitter, utils, Flickity ) {

// -------------------------- Player -------------------------- //

function Player( parent ) {
  this.parent = parent;
  this.state = 'stopped';
  // visibility change event handler
  this.onVisibilityChange = this.visibilityChange.bind( this );
  this.onVisibilityPlay = this.visibilityPlay.bind( this );
}

Player.prototype = Object.create( EvEmitter.prototype );

// start play
Player.prototype.play = function() {
  if ( this.state == 'playing' ) {
    return;
  }
  // do not play if page is hidden, start playing when page is visible
  var isPageHidden = document.hidden;
  if ( isPageHidden ) {
    document.addEventListener( 'visibilitychange', this.onVisibilityPlay );
    return;
  }

  this.state = 'playing';
  // listen to visibility change
  document.addEventListener( 'visibilitychange', this.onVisibilityChange );
  // start ticking
  this.tick();
};

Player.prototype.tick = function() {
  // do not tick if not playing
  if ( this.state != 'playing' ) {
    return;
  }

  var time = this.parent.options.autoPlay;
  // default to 3 seconds
  time = typeof time == 'number' ? time : 3000;
  var _this = this;
  // HACK: reset ticks if stopped and started within interval
  this.clear();
  this.timeout = setTimeout( function() {
    _this.parent.next( true );
    _this.tick();
  }, time );
};

Player.prototype.stop = function() {
  this.state = 'stopped';
  this.clear();
  // remove visibility change event
  document.removeEventListener( 'visibilitychange', this.onVisibilityChange );
};

Player.prototype.clear = function() {
  clearTimeout( this.timeout );
};

Player.prototype.pause = function() {
  if ( this.state == 'playing' ) {
    this.state = 'paused';
    this.clear();
  }
};

Player.prototype.unpause = function() {
  // re-start play if paused
  if ( this.state == 'paused' ) {
    this.play();
  }
};

// pause if page visibility is hidden, unpause if visible
Player.prototype.visibilityChange = function() {
  var isPageHidden = document.hidden;
  this[ isPageHidden ? 'pause' : 'unpause' ]();
};

Player.prototype.visibilityPlay = function() {
  this.play();
  document.removeEventListener( 'visibilitychange', this.onVisibilityPlay );
};

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pauseAutoPlayOnHover: true
});

Flickity.createMethods.push('_createPlayer');
var proto = Flickity.prototype;

proto._createPlayer = function() {
  this.player = new Player( this );

  this.on( 'activate', this.activatePlayer );
  this.on( 'uiChange', this.stopPlayer );
  this.on( 'pointerDown', this.stopPlayer );
  this.on( 'deactivate', this.deactivatePlayer );
};

proto.activatePlayer = function() {
  if ( !this.options.autoPlay ) {
    return;
  }
  this.player.play();
  this.element.addEventListener( 'mouseenter', this );
};

// Player API, don't hate the ... thanks I know where the door is

proto.playPlayer = function() {
  this.player.play();
};

proto.stopPlayer = function() {
  this.player.stop();
};

proto.pausePlayer = function() {
  this.player.pause();
};

proto.unpausePlayer = function() {
  this.player.unpause();
};

proto.deactivatePlayer = function() {
  this.player.stop();
  this.element.removeEventListener( 'mouseenter', this );
};

// ----- mouseenter/leave ----- //

// pause auto-play on hover
proto.onmouseenter = function() {
  if ( !this.options.pauseAutoPlayOnHover ) {
    return;
  }
  this.player.pause();
  this.element.addEventListener( 'mouseleave', this );
};

// resume auto-play on hover off
proto.onmouseleave = function() {
  this.player.unpause();
  this.element.removeEventListener( 'mouseleave', this );
};

// -----  ----- //

Flickity.Player = Player;

return Flickity;

}));
});

var addRemoveCell = index_es_createCommonjsModule(function (module) {
// add, remove cell
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      flickity,
      utils
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, utils ) {

// append cells to a document fragment
function getCellsFragment( cells ) {
  var fragment = document.createDocumentFragment();
  cells.forEach( function( cell ) {
    fragment.appendChild( cell.element );
  });
  return fragment;
}

// -------------------------- add/remove cell prototype -------------------------- //

var proto = Flickity.prototype;

/**
 * Insert, prepend, or append cells
 * @param {Element, Array, NodeList} elems
 * @param {Integer} index
 */
proto.insert = function( elems, index ) {
  var cells = this._makeCells( elems );
  if ( !cells || !cells.length ) {
    return;
  }
  var len = this.cells.length;
  // default to append
  index = index === undefined ? len : index;
  // add cells with document fragment
  var fragment = getCellsFragment( cells );
  // append to slider
  var isAppend = index == len;
  if ( isAppend ) {
    this.slider.appendChild( fragment );
  } else {
    var insertCellElement = this.cells[ index ].element;
    this.slider.insertBefore( fragment, insertCellElement );
  }
  // add to this.cells
  if ( index === 0 ) {
    // prepend, add to start
    this.cells = cells.concat( this.cells );
  } else if ( isAppend ) {
    // append, add to end
    this.cells = this.cells.concat( cells );
  } else {
    // insert in this.cells
    var endCells = this.cells.splice( index, len - index );
    this.cells = this.cells.concat( cells ).concat( endCells );
  }

  this._sizeCells( cells );
  this.cellChange( index, true );
};

proto.append = function( elems ) {
  this.insert( elems, this.cells.length );
};

proto.prepend = function( elems ) {
  this.insert( elems, 0 );
};

/**
 * Remove cells
 * @param {Element, Array, NodeList} elems
 */
proto.remove = function( elems ) {
  var cells = this.getCells( elems );
  if ( !cells || !cells.length ) {
    return;
  }

  var minCellIndex = this.cells.length - 1;
  // remove cells from collection & DOM
  cells.forEach( function( cell ) {
    cell.remove();
    var index = this.cells.indexOf( cell );
    minCellIndex = Math.min( index, minCellIndex );
    utils.removeFrom( this.cells, cell );
  }, this );

  this.cellChange( minCellIndex, true );
};

/**
 * logic to be run after a cell's size changes
 * @param {Element} elem - cell's element
 */
proto.cellSizeChange = function( elem ) {
  var cell = this.getCell( elem );
  if ( !cell ) {
    return;
  }
  cell.getSize();

  var index = this.cells.indexOf( cell );
  this.cellChange( index );
};

/**
 * logic any time a cell is changed: added, removed, or size changed
 * @param {Integer} changedCellIndex - index of the changed cell, optional
 */
proto.cellChange = function( changedCellIndex, isPositioningSlider ) {
  var prevSelectedElem = this.selectedElement;
  this._positionCells( changedCellIndex );
  this._getWrapShiftCells();
  this.setGallerySize();
  // update selectedIndex
  // try to maintain position & select previous selected element
  var cell = this.getCell( prevSelectedElem );
  if ( cell ) {
    this.selectedIndex = this.getCellSlideIndex( cell );
  }
  this.selectedIndex = Math.min( this.slides.length - 1, this.selectedIndex );

  this.emitEvent( 'cellChange', [ changedCellIndex ] );
  // position slider
  this.select( this.selectedIndex );
  // do not position slider after lazy load
  if ( isPositioningSlider ) {
    this.positionSliderAtSelected();
  }
};

// -----  ----- //

return Flickity;

}));
});

var lazyload = index_es_createCommonjsModule(function (module) {
// lazyload
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      flickity,
      utils
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, utils ) {

Flickity.createMethods.push('_createLazyload');
var proto = Flickity.prototype;

proto._createLazyload = function() {
  this.on( 'select', this.lazyLoad );
};

proto.lazyLoad = function() {
  var lazyLoad = this.options.lazyLoad;
  if ( !lazyLoad ) {
    return;
  }
  // get adjacent cells, use lazyLoad option for adjacent count
  var adjCount = typeof lazyLoad == 'number' ? lazyLoad : 0;
  var cellElems = this.getAdjacentCellElements( adjCount );
  // get lazy images in those cells
  var lazyImages = [];
  cellElems.forEach( function( cellElem ) {
    var lazyCellImages = getCellLazyImages( cellElem );
    lazyImages = lazyImages.concat( lazyCellImages );
  });
  // load lazy images
  lazyImages.forEach( function( img ) {
    new LazyLoader( img, this );
  }, this );
};

function getCellLazyImages( cellElem ) {
  // check if cell element is lazy image
  if ( cellElem.nodeName == 'IMG' ) {
    var lazyloadAttr = cellElem.getAttribute('data-flickity-lazyload');
    var srcAttr = cellElem.getAttribute('data-flickity-lazyload-src');
    var srcsetAttr = cellElem.getAttribute('data-flickity-lazyload-srcset');
    if ( lazyloadAttr || srcAttr || srcsetAttr ) {
      return [ cellElem ];
    }
  }
  // select lazy images in cell
  var lazySelector = 'img[data-flickity-lazyload], ' +
    'img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]';
  var imgs = cellElem.querySelectorAll( lazySelector );
  return utils.makeArray( imgs );
}

// -------------------------- LazyLoader -------------------------- //

/**
 * class to handle loading images
 */
function LazyLoader( img, flickity ) {
  this.img = img;
  this.flickity = flickity;
  this.load();
}

LazyLoader.prototype.handleEvent = utils.handleEvent;

LazyLoader.prototype.load = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  // get src & srcset
  var src = this.img.getAttribute('data-flickity-lazyload') ||
    this.img.getAttribute('data-flickity-lazyload-src');
  var srcset = this.img.getAttribute('data-flickity-lazyload-srcset');
  // set src & serset
  this.img.src = src;
  if ( srcset ) {
    this.img.setAttribute( 'srcset', srcset );
  }
  // remove attr
  this.img.removeAttribute('data-flickity-lazyload');
  this.img.removeAttribute('data-flickity-lazyload-src');
  this.img.removeAttribute('data-flickity-lazyload-srcset');
};

LazyLoader.prototype.onload = function( event ) {
  this.complete( event, 'flickity-lazyloaded' );
};

LazyLoader.prototype.onerror = function( event ) {
  this.complete( event, 'flickity-lazyerror' );
};

LazyLoader.prototype.complete = function( event, className ) {
  // unbind events
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );

  var cell = this.flickity.getParentCell( this.img );
  var cellElem = cell && cell.element;
  this.flickity.cellSizeChange( cellElem );

  this.img.classList.add( className );
  this.flickity.dispatchEvent( 'lazyLoad', event, cellElem );
};

// -----  ----- //

Flickity.LazyLoader = LazyLoader;

return Flickity;

}));
});

var index_es_js = index_es_createCommonjsModule(function (module) {
/*!
 * Flickity v2.2.1
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2019 Metafizzy
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      flickity,
      drag,
      prevNextButton,
      pageDots,
      player,
      addRemoveCell,
      lazyload
    );
  }

})( window, function factory( Flickity ) {
  /*jshint strict: false*/
  return Flickity;
});
});

var flickityFade = index_es_createCommonjsModule(function (module) {
/**
 * Flickity fade v1.0.0
 * Fade between Flickity slides
 */

/* jshint browser: true, undef: true, unused: true */

( function( window, factory ) {
  // universal module definition
  /*globals define, module, require */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      index_es_js,
      utils
    );
  } else {
    // browser global
    factory(
      window.Flickity,
      window.fizzyUIUtils
    );
  }

}( commonjsGlobal, function factory( Flickity, utils ) {

// ---- Slide ---- //

var Slide = Flickity.Slide;

var slideUpdateTarget = Slide.prototype.updateTarget;
Slide.prototype.updateTarget = function() {
  slideUpdateTarget.apply( this, arguments );
  if ( !this.parent.options.fade ) {
    return;
  }
  // position cells at selected target
  var slideTargetX = this.target - this.x;
  var firstCellX = this.cells[0].x;
  this.cells.forEach( function( cell ) {
    var targetX = cell.x - firstCellX - slideTargetX;
    cell.renderPosition( targetX );
  });
};

Slide.prototype.setOpacity = function( alpha ) {
  this.cells.forEach( function( cell ) {
    cell.element.style.opacity = alpha;
  });
};

// ---- Flickity ---- //

var proto = Flickity.prototype;

Flickity.createMethods.push('_createFade');

proto._createFade = function() {
  this.fadeIndex = this.selectedIndex;
  this.prevSelectedIndex = this.selectedIndex;
  this.on( 'select', this.onSelectFade );
  this.on( 'dragEnd', this.onDragEndFade );
  this.on( 'settle', this.onSettleFade );
  this.on( 'activate', this.onActivateFade );
  this.on( 'deactivate', this.onDeactivateFade );
};

var updateSlides = proto.updateSlides;
proto.updateSlides = function() {
  updateSlides.apply( this, arguments );
  if ( !this.options.fade ) {
    return;
  }
  // set initial opacity
  this.slides.forEach( function( slide, i ) {
    var alpha = i == this.selectedIndex ? 1 : 0;
    slide.setOpacity( alpha );
  }, this );
};

/* ---- events ---- */

proto.onSelectFade = function() {
  // in case of resize, keep fadeIndex within current count
  this.fadeIndex = Math.min( this.prevSelectedIndex, this.slides.length - 1 );
  this.prevSelectedIndex = this.selectedIndex;
};

proto.onSettleFade = function() {
  delete this.didDragEnd;
  if ( !this.options.fade ) {
    return;
  }
  // set full and 0 opacity on selected & faded slides
  this.selectedSlide.setOpacity( 1 );
  var fadedSlide = this.slides[ this.fadeIndex ];
  if ( fadedSlide && this.fadeIndex != this.selectedIndex ) {
    this.slides[ this.fadeIndex ].setOpacity( 0 );
  }
};

proto.onDragEndFade = function() {
  // set flag
  this.didDragEnd = true;
};

proto.onActivateFade = function() {
  if ( this.options.fade ) {
    this.element.classList.add('is-fade');
  }
};

proto.onDeactivateFade = function() {
  if ( !this.options.fade ) {
    return;
  }
  this.element.classList.remove('is-fade');
  // reset opacity
  this.slides.forEach( function( slide ) {
    slide.setOpacity('');
  });
};

/* ---- position & fading ---- */

var positionSlider = proto.positionSlider;
proto.positionSlider = function() {
  if ( !this.options.fade ) {
    positionSlider.apply( this, arguments );
    return;
  }

  this.fadeSlides();
  this.dispatchScrollEvent();
};

var positionSliderAtSelected = proto.positionSliderAtSelected;
proto.positionSliderAtSelected = function() {
  if ( this.options.fade ) {
    // position fade slider at origin
    this.setTranslateX( 0 );
  }
  positionSliderAtSelected.apply( this, arguments );
};

proto.fadeSlides = function() {
  if ( this.slides.length < 2 ) {
    return;
  }
  // get slides to fade-in & fade-out
  var indexes = this.getFadeIndexes();
  var fadeSlideA = this.slides[ indexes.a ];
  var fadeSlideB = this.slides[ indexes.b ];
  var distance = this.wrapDifference( fadeSlideA.target, fadeSlideB.target );
  var progress = this.wrapDifference( fadeSlideA.target, -this.x );
  progress = progress / distance;

  fadeSlideA.setOpacity( 1 - progress );
  fadeSlideB.setOpacity( progress );

  // hide previous slide
  var fadeHideIndex = indexes.a;
  if ( this.isDragging ) {
    fadeHideIndex = progress > 0.5 ? indexes.a : indexes.b;
  }
  var isNewHideIndex = this.fadeHideIndex != undefined &&
    this.fadeHideIndex != fadeHideIndex &&
    this.fadeHideIndex != indexes.a &&
    this.fadeHideIndex != indexes.b;
  if ( isNewHideIndex ) {
    // new fadeHideSlide set, hide previous
    this.slides[ this.fadeHideIndex ].setOpacity( 0 );
  }
  this.fadeHideIndex = fadeHideIndex;
};

proto.getFadeIndexes = function() {
  if ( !this.isDragging && !this.didDragEnd ) {
    return {
      a: this.fadeIndex,
      b: this.selectedIndex,
    };
  }
  if ( this.options.wrapAround ) {
    return this.getFadeDragWrapIndexes();
  } else {
    return this.getFadeDragLimitIndexes();
  }
};

proto.getFadeDragWrapIndexes = function() {
  var distances = this.slides.map( function( slide, i ) {
    return this.getSlideDistance( -this.x, i );
  }, this );
  var absDistances = distances.map( function( distance ) {
    return Math.abs( distance );
  });
  var minDistance = Math.min.apply( Math, absDistances );
  var closestIndex = absDistances.indexOf( minDistance );
  var distance = distances[ closestIndex ];
  var len = this.slides.length;

  var delta = distance >= 0 ? 1 : -1;
  return {
    a: closestIndex,
    b: utils.modulo( closestIndex + delta, len ),
  };
};

proto.getFadeDragLimitIndexes = function() {
  // calculate closest previous slide
  var dragIndex = 0;
  for ( var i=0; i < this.slides.length - 1; i++ ) {
    var slide = this.slides[i];
    if ( -this.x < slide.target ) {
      break;
    }
    dragIndex = i;
  }
  return {
    a: dragIndex,
    b: dragIndex + 1,
  };
};

proto.wrapDifference = function( a, b ) {
  var diff = b - a;

  if ( !this.options.wrapAround ) {
    return diff;
  }

  var diffPlus = diff + this.slideableWidth;
  var diffMinus = diff - this.slideableWidth;
  if ( Math.abs( diffPlus ) < Math.abs( diff ) ) {
    diff = diffPlus;
  }
  if ( Math.abs( diffMinus ) < Math.abs( diff ) ) {
    diff = diffMinus;
  }
  return diff;
};

// ---- wrapAround ---- //

var _getWrapShiftCells = proto._getWrapShiftCells;
proto._getWrapShiftCells = function() {
  if ( !this.options.fade ) {
    _getWrapShiftCells.apply( this, arguments );
  }
};

var shiftWrapCells = proto.shiftWrapCells;
proto.shiftWrapCells = function() {
  if ( !this.options.fade ) {
    shiftWrapCells.apply( this, arguments );
  }
};

return Flickity;

}));
});

var EventHandler_1 = index_es_createCommonjsModule(function (module, exports) {
exports.__esModule = true;
var EventHandler = /** @class */ (function () {
    function EventHandler() {
        this.events = [];
    }
    EventHandler.prototype.register = function (el, event, listener) {
        if (!el || !event || !listener)
            return null;
        this.events.push({ el: el, event: event, listener: listener });
        el.addEventListener(event, listener);
        return { el: el, event: event, listener: listener };
    };
    EventHandler.prototype.unregister = function (_a) {
        var el = _a.el, event = _a.event, listener = _a.listener;
        if (!el || !event || !listener)
            return null;
        this.events = this.events.filter(function (e) { return el !== e.el
            || event !== e.event || listener !== e.listener; });
        el.removeEventListener(event, listener);
        return { el: el, event: event, listener: listener };
    };
    EventHandler.prototype.unregisterAll = function () {
        this.events.forEach(function (_a) {
            var el = _a.el, event = _a.event, listener = _a.listener;
            return el.removeEventListener(event, listener);
        });
        this.events = [];
    };
    return EventHandler;
}());
exports["default"] = EventHandler;
});

var index_es_EventHandler = unwrapExports(EventHandler_1);

var Slideshow = /*#__PURE__*/function () {
  function Slideshow(section) {
    var _this = this;

    pxs_slideshow_dist_index_es_classCallCheck(this, Slideshow);

    this.el = section.el;
    this.settings = section.data;
    this.paginationClicked = false;
    this.events = new index_es_EventHandler();
    this.carousel = this.el.querySelector('[data-slideshow-wrapper]');
    this.slides = this.el.querySelectorAll('[data-slideshow-slide]');
    this.pagination = this.el.querySelector('[data-slideshow-pagination]');
    this.paginationButtons = this.pagination ? this.pagination.querySelectorAll('[data-slide-button]') : null;
    this.counter = this.el.querySelector('[data-slide-counter]');
    this.el.style.setProperty('--slide-text-color', "".concat(this.slides[0].dataset.textColor));

    if (this.carousel && this.slides.length > 1) {
      this.flickity = new flickityFade(this.carousel, {
        accessibility: false,
        // Flickity's inherent "accessibility" actually makes it worse
        adaptiveHeight: true,
        autoPlay: this.settings.enable_autoplay ? this.settings.autoplay_interval * 1000 : false,
        cellAlign: 'left',
        cellSelector: '[data-slideshow-slide]',
        contain: true,
        fade: this.settings.transition_fade,
        imagesLoaded: true,
        pageDots: this.settings.show_pagination,
        pauseAutoPlayOnHover: true,
        selectedAttraction: this.settings.slide_attraction ? parseFloat(this.settings.slide_attraction) : 0.03,
        friction: this.settings.slide_friction ? parseFloat(this.settings.slide_friction) : 0.3,
        wrapAround: true,
        arrowShape: {
          x0: 10,
          x1: 60,
          y1: 50,
          x2: 65,
          y2: 45,
          x3: 20
        }
      });
      this.prevNextButtons = this.el.querySelectorAll('.flickity-prev-next-button');

      if (this.prevNextButtons.length === 2) {
        this.prevNextButtons[0].setAttribute('aria-label', this.settings.previous_text);
        this.prevNextButtons[1].setAttribute('aria-label', this.settings.next_text);
      }

      this._updateTabindex();

      this._positionNavigation();

      this._updateCounter(1);

      this.flickity.on('change', function (index) {
        _this.el.style.setProperty('--slide-text-color', "".concat(_this.slides[index].dataset.textColor));

        _this._updatePagination();

        _this._positionNavigation();

        _this._updateTabindex();

        _this._updateCounter(index + 1);
      }); // On any interaction on the slideshow, we want it to pause

      this.flickity.on('pointerDown', function () {
        return _this.flickity.pausePlayer();
      });
      this.events.register(this.carousel, 'rimg:load', function () {
        if (_this.carousel.offsetHeight === 0) {
          _this.flickity.resize();
        }

        _this._positionNavigation();
      }); // As soon as the slideshow receives keyboard or mouse focus, we want it to pause

      this.events.register(this.carousel, 'focusin', function () {
        return _this.flickity.pausePlayer();
      });
      this.events.register(window, 'resize', function () {
        _this._positionNavigation();
      }); // We want to focus on the new slide if the pagination buttons were clicked
      // If we don't wait until "settle" then the slideshow experiences a weird jump issue

      this.flickity.on('settle', function (index) {
        if (_this.paginationClicked) {
          _this.slides[index].focus();

          _this.paginationClicked = false;
        }
      }); // We had to add in our own pagination buttons since the flickity ones
      // are not elements that can be tabbed to. This replicates their behaviour.

      if (this.pagination) {
        var _loop = function _loop(i) {
          _this.events.register(_this.paginationButtons[i], 'click', function () {
            var index = parseInt(_this.paginationButtons[i].dataset.slideButton, 10);

            _this.flickity.pausePlayer();

            _this.flickity.select(index, true, false);

            _this.paginationClicked = true;
          });
        };

        for (var i = 0; i < this.paginationButtons.length; i++) {
          _loop(i);
        }
      }
    }
  }

  pxs_slideshow_dist_index_es_createClass(Slideshow, [{
    key: "_updatePagination",
    value: function _updatePagination() {
      if (this.pagination) {
        for (var i = 0; i < this.paginationButtons.length; i++) {
          this.paginationButtons[i].dataset.selected = 'false';
          this.paginationButtons[i].setAttribute('aria-selected', 'false');
        }

        this.paginationButtons[this.flickity.selectedIndex].dataset.selected = 'true';
        this.paginationButtons[this.flickity.selectedIndex].setAttribute('aria-selected', 'true');
      }
    }
  }, {
    key: "_positionNavigation",
    value: function _positionNavigation() {
      if (this.settings.mobile_navigation_adjust) {
        var arrowButtons = this.el.querySelectorAll('.flickity-prev-next-button');
        var currentSlideheight = this.flickity.selectedElement.querySelector('[data-slide-image-wrapper]').offsetHeight;

        if (arrowButtons) {
          var top = '50%';

          if (this.viewportIsMobile()) {
            top = "".concat(currentSlideheight / 2, "px");
          }

          arrowButtons[0].style.top = top;
          arrowButtons[1].style.top = top;
        }

        if (this.pagination) {
          var _top = 'auto';

          if (this.viewportIsMobile()) {
            var content = this.flickity.selectedElement.querySelector('[data-slide-content]');

            if (content) {
              _top = "".concat(currentSlideheight, "px");
            } else {
              var paginationHeight = this.pagination.offsetHeight; // If no content, and mobile, offset by height of dots, and the bottom gutter

              _top = "".concat(currentSlideheight - paginationHeight, "px");
            }
          }

          this.pagination.style.top = _top;
        }
      }
    }
  }, {
    key: "_updateTabindex",
    value: function _updateTabindex() {
      // We need to remove tabindex from the slides that are not currently
      // selected, so that slides not currently shown cannot receive keyboard focus.
      for (var i = 0; i < this.slides.length; i++) {
        var links = this.slides[i].querySelectorAll('a');

        for (var j = 0; j < links.length; j++) {
          links[j].setAttribute('tabindex', i === this.flickity.selectedIndex ? '0' : '-1');
        }
      }
    } // This updates the counter which is used for accessibility. This gets read out to a user
    // who uses a screen reader every time the slide changes.

  }, {
    key: "_updateCounter",
    value: function _updateCounter(index) {
      var counterText = this.counter.dataset.counterTemplate.replace("\{\{ count \}\}", index).replace("\{\{ total \}\}", this.slides.length);
      this.counter.innerHTML = counterText;
    } // This method can be overridden by the theme if the breakpoint is different than 720.

  }, {
    key: "viewportIsMobile",
    value: function viewportIsMobile() {
      return window.innerWidth < 720;
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events.unregisterAll();
      this.flickity.destroy();
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(e) {
      var slideIndex = e.el.dataset.slideIndex;
      this.flickity.select(slideIndex);
      this.flickity.pausePlayer();
      this.flickity.resize();
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect() {
      if (this.settings.enable_autoplay) {
        this.flickity.playPlayer();
      }
    }
  }]);

  return Slideshow;
}();

/* harmony default export */ var pxs_slideshow_dist_index_es = (Slideshow);

;// CONCATENATED MODULE: ./source/scripts/sections/Slideshow.js
function Slideshow_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { Slideshow_typeof = function _typeof(obj) { return typeof obj; }; } else { Slideshow_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return Slideshow_typeof(obj); }

function Slideshow_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Slideshow_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Slideshow_createClass(Constructor, protoProps, staticProps) { if (protoProps) Slideshow_defineProperties(Constructor.prototype, protoProps); if (staticProps) Slideshow_defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (Slideshow_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var Slideshow_Slideshow = /*#__PURE__*/function (_SharedSlideshow) {
  _inherits(Slideshow, _SharedSlideshow);

  var _super = _createSuper(Slideshow);

  function Slideshow() {
    Slideshow_classCallCheck(this, Slideshow);

    return _super.apply(this, arguments);
  }

  Slideshow_createClass(Slideshow, [{
    key: "viewportIsMobile",
    value: function viewportIsMobile() {
      return cjs/* max */.Fp('S');
    }
  }]);

  return Slideshow;
}(pxs_slideshow_dist_index_es);


// EXTERNAL MODULE: ./node_modules/scriptjs/dist/script.js
var dist_script = __webpack_require__(277);
var script_default = /*#__PURE__*/__webpack_require__.n(dist_script);
;// CONCATENATED MODULE: ./source/scripts/sections/Map.js
function Map_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Map_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Map_createClass(Constructor, protoProps, staticProps) { if (protoProps) Map_defineProperties(Constructor.prototype, protoProps); if (staticProps) Map_defineProperties(Constructor, staticProps); return Constructor; }



var Map_Map = /*#__PURE__*/function () {
  function Map(section) {
    var _this = this;

    Map_classCallCheck(this, Map);

    this.el = section.el;
    this.settings = section.data;

    if (this.el.querySelector('[data-api-key]')) {
      this.map = this.el.querySelector('.map-section__map');
      this.address = this.el.querySelector('[data-address]').dataset.address;
      this.directions = this.el.querySelector('[data-directions-address]').dataset.directionsAddress;
      this.zoom = this.el.querySelector('[data-zoom]').dataset.zoom;
      this.mapStyle = this.el.querySelector('[data-style]').dataset.style;
      this.showPin = this.el.querySelector('[data-pin]').dataset.pin;
      this.apiKey = this.el.querySelector('[data-api-key]').dataset.apiKey;
      this.mapLink = this.el.querySelector('.map-section__link');

      if (window.googleMaps === undefined) {
        script_default()("https://maps.googleapis.com/maps/api/js?key=".concat(this.apiKey), function () {
          _this.findLocation();
        });
      } else {
        this.findLocation();
      }
    }
  }

  Map_createClass(Map, [{
    key: "findLocation",
    value: function findLocation() {
      var _this2 = this;

      var geoLat;
      var geoLng; // Get geolocation of address

      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': this.address
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          geoLat = results[0].geometry.location.lat();
          geoLng = results[0].geometry.location.lng();

          _this2.initMap(geoLat, geoLng, _this2.map);
        }
      });
    }
  }, {
    key: "initMap",
    value: function initMap(lat, long, el) {
      var styleJson; // Determine map style

      if (this.mapStyle === 'aubergine') {
        styleJson = [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8ec3b9"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1a3646"
          }]
        }, {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#64779e"
          }]
        }, {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        }, {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#334e87"
          }]
        }, {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [{
            "color": "#023e58"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#283d6a"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#6f9ba5"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#023e58"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#3C7680"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#304a7d"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#98a5be"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2c6675"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#255763"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#b0d5ce"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#023e58"
          }]
        }, {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#98a5be"
          }]
        }, {
          "featureType": "transit",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#283d6a"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#3a4762"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#0e1626"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#4e6d70"
          }]
        }];
      } else if (this.mapStyle === 'retro') {
        styleJson = [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#ebe3cd"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#523735"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#f5f1e6"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#c9b2a6"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#dcd2be"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#ae9e90"
          }]
        }, {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#93817c"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#a5b076"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#447530"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f5f1e6"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "color": "#fdfcf8"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f8c967"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#e9bc62"
          }]
        }, {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e98d58"
          }]
        }, {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#db8555"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#806b63"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8f7d77"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#ebe3cd"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#b9d3c2"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#92998d"
          }]
        }];
      } else if (this.mapStyle === 'silver') {
        styleJson = [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#f5f5f5"
          }]
        }, {
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#f5f5f5"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#bdbdbd"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#eeeeee"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e5e5e5"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#ffffff"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dadada"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e5e5e5"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#eeeeee"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#c9c9c9"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }];
      } else if (this.mapStyle === 'night') {
        styleJson = [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#242f3e"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#746855"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#242f3e"
          }]
        }, {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#d59563"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#d59563"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#263c3f"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#6b9a76"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#38414e"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#212a37"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9ca5b3"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#746855"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#1f2835"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#f3d19c"
          }]
        }, {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2f3948"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#d59563"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#17263c"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#515c6d"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#17263c"
          }]
        }];
      } else {
        styleJson = [];
      } // Build map with options


      var map = new google.maps.Map(el, {
        center: {
          lat: lat,
          lng: long
        },
        zoom: parseFloat(this.zoom),
        styles: styleJson
      }); // Set pin if enabled

      if (this.showPin === 'true') {
        var marker = new google.maps.Marker({
          position: {
            lat: lat,
            lng: long
          },
          map: map
        });
      } // Set URL for directions link


      this.mapLink.setAttribute('href', "https://www.google.com/maps/place/".concat(this.directions, "/@").concat(lat, ",").concat(long));
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(block) {}
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect() {}
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {}
  }]);

  return Map;
}();


// EXTERNAL MODULE: ./node_modules/flickity-fade/flickity-fade.js
var flickity_fade = __webpack_require__(31);
var flickity_fade_default = /*#__PURE__*/__webpack_require__.n(flickity_fade);
// EXTERNAL MODULE: ./node_modules/flickity-sync/flickity-sync.js
var flickity_sync = __webpack_require__(566);
;// CONCATENATED MODULE: ./source/scripts/sections/Testimonial.js
function Testimonial_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Testimonial_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Testimonial_createClass(Constructor, protoProps, staticProps) { if (protoProps) Testimonial_defineProperties(Constructor.prototype, protoProps); if (staticProps) Testimonial_defineProperties(Constructor, staticProps); return Constructor; }







var Testimonial = /*#__PURE__*/function () {
  function Testimonial(section) {
    Testimonial_classCallCheck(this, Testimonial);

    this.el = section.el;
    this.settings = section.data;
    this.testimonial = this.el.querySelector('[data-testimonial-slideshow]');
    this.testimonialInfo = this.el.querySelector('[data-slideshow-secondary]');
    this.testimonialSlides = this.testimonial.querySelectorAll('[data-slide]');
    this._onChange = this._onChange.bind(this);
    this.events = new EventHandler/* default */.Z();
    cjs/* onChange */.z2(this._onChange);

    this._setupFlickity();
  }

  Testimonial_createClass(Testimonial, [{
    key: "_showPageDots",
    value: function _showPageDots() {
      if (this.testimonialSlides.length <= 1) {
        return false;
      }

      if (this.settings.desktop_navigation_style === 'dots' || cjs/* max */.Fp('S')) {
        return true;
      }

      return false;
    }
  }, {
    key: "_setupFlickity",
    value: function _setupFlickity() {
      var _this = this;

      var pageDots = this._showPageDots();

      var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
      var slideshowSettings = {
        arrowShape: {
          x0: 10,
          x1: 60,
          y1: 50,
          x2: 65,
          y2: 45,
          x3: 20
        },
        fade: true,
        friction: 0.5,
        wrapAround: true,
        selectedAttraction: 0.075,
        adaptiveHeight: true,
        draggable: supportsTouch,
        cellSelector: '[data-slide]',
        prevNextButtons: this.settings.desktop_navigation_style === 'buttons',
        pageDots: false
      };
      var secondarySlideshowSettings = {
        asNavFor: this.testimonial,
        wrapAround: this.testimonialSlides.length > 2,
        friction: 0.5,
        selectedAttraction: 0.075,
        adaptiveHeight: false,
        prevNextButtons: false,
        freeScroll: false,
        draggable: supportsTouch,
        cellSelector: '[data-secondary-slide]',
        pageDots: pageDots,
        sync: this.testimonial
      };
      this.testimonialSlideshow = new (flickity_fade_default())(this.testimonial, slideshowSettings);
      this.secondarySlideshow = new (flickity_fade_default())(this.testimonialInfo, secondarySlideshowSettings);
      this.events.register(this.testimonialInfo, 'rimg:load', function () {
        _this.secondarySlideshow.resize();
      }); // Remove the aria-hidden attribute as the images should be focusable/accessible via keyboard

      this.secondarySlideshow.on('select', function (index) {
        for (var i = 0; i < _this.secondarySlideshow.cells.length; i++) {
          if (i !== index) {
            _this.secondarySlideshow.cells[i].element.ariaHidden = null;
          }
        }
      });
    }
  }, {
    key: "_onChange",
    value: function _onChange(event) {
      this._reconstructFlickity();
    }
  }, {
    key: "_reconstructFlickity",
    value: function _reconstructFlickity() {
      this.testimonialSlideshow.destroy();
      this.secondarySlideshow.destroy();
      this.events.unregisterAll();

      this._setupFlickity();
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(block) {
      var slideIndex = block.el.dataset.slideIndex;
      this.testimonialSlideshow.select(slideIndex);
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect() {}
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.testimonialSlideshow.destroy();
      this.secondarySlideshow.destroy();
      this.events.unregisterAll();
      cjs/* offChange */.F(this._onChange);
    }
  }]);

  return Testimonial;
}();


;// CONCATENATED MODULE: ./source/scripts/components/MobileCarousel.js
function MobileCarousel_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MobileCarousel_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MobileCarousel_createClass(Constructor, protoProps, staticProps) { if (protoProps) MobileCarousel_defineProperties(Constructor.prototype, protoProps); if (staticProps) MobileCarousel_defineProperties(Constructor, staticProps); return Constructor; }



 // This class is intended to be used across the site whenever we want to
// have a carousel for a section that is only on mobile. It improves on
// Flickity to make the carousel more accessible, and also keeps consistency
// across the theme.

var MobileCarousel = /*#__PURE__*/function () {
  function MobileCarousel(settings) {
    var _this = this;

    MobileCarousel_classCallCheck(this, MobileCarousel);

    this.carouselWrapper = settings.carouselWrapper;
    this.slideSelector = settings.slideSelector;
    this.slides = this.carouselWrapper.querySelectorAll(this.slideSelector);

    if (this.slides.length <= 1) {
      return;
    }

    this.events = new EventHandler/* default */.Z();
    this.flickity = null;
    this.rimgEvent = null;
    this.pagination = null;
    this.paginationButtons = [];
    this.paginationEvents = [];
    this.paginationKeydown = false;
    this.events.register(window, 'resize', function () {
      // On screen resize, we want to enable flickity only when below the M breakpoint.
      // If flickity is enabled already, we don't want to set it up again.
      if (_this.flickity || cjs/* min */.VV('M')) {
        if (_this.flickity && cjs/* min */.VV('M')) {
          _this._disableFlickity();
        }
      } else {
        _this._setupFlickity();
      }
    }); // Initial setup of flickity if we are below the M breakpoint

    if (!cjs/* min */.VV('M')) {
      this._setupFlickity();
    }
  }

  MobileCarousel_createClass(MobileCarousel, [{
    key: "_disableFlickity",
    value: function _disableFlickity() {
      var _this2 = this;

      this.flickity.destroy();
      this.flickity = null;
      this.events.unregister(this.rimgEvent);
      this.paginationEvents.forEach(function (event) {
        return _this2.events.unregister(event);
      });
      this.carouselWrapper.removeChild(this.pagination);
    }
  }, {
    key: "_setupFlickity",
    value: function _setupFlickity() {
      var _this3 = this;

      this.flickity = new (js_default())(this.carouselWrapper, {
        accessibility: false,
        // Flickity's inherent "accessibility" actually makes it worse
        adaptiveHeight: true,
        autoPlay: false,
        cellAlign: 'left',
        cellSelector: this.slideSelector,
        contain: true,
        pageDots: false,
        prevNextButtons: false,
        selectedAttraction: 0.2,
        friction: 0.8,
        wrapAround: true
      });
      this.rimgEvent = this.events.register(this.carouselWrapper, 'rimg:load', function () {
        _this3.flickity.resize();
      });

      this._createPagination();

      this._updateTabindex();

      this.flickity.on('change', function () {
        _this3._updatePagination();

        _this3._updateTabindex();
      });
      this.flickity.on('settle', function (index) {
        if (_this3.paginationKeydown) {
          _this3.slides[index].focus();

          _this3.paginationKeydown = false;
        }
      });
    } // We have to add in our own pagination buttons since the ones in flickity cannot be clicked
    // through keyboard navigation. This replicates the creation of them and their behaviour.

  }, {
    key: "_createPagination",
    value: function _createPagination() {
      var _this4 = this;

      var mobilePagination = document.createElement('ol');
      mobilePagination.classList.add('mobile-carousel__pagination');
      this.paginationEvents = [];
      this.paginationButtons = [];

      var _loop = function _loop(i) {
        _this4.slides[i].setAttribute('tabindex', '-1');

        _this4.slides[i].setAttribute('aria-label', "Carousel slide ".concat(i + 1));

        var dot = document.createElement('li');
        dot.classList.add('mobile-carousel__pagination-item');
        var button = document.createElement('button');
        button.classList.add('mobile-carousel__pagination-button');
        button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        button.dataset.selected = i === 0;
        var span = document.createElement('span');
        span.classList.add('visually-hidden');
        span.innerHTML = "Go to slide ".concat(i + 1);
        button.appendChild(span);
        dot.appendChild(button);
        mobilePagination.appendChild(dot);

        var buttonEvent = _this4.events.register(button, 'click', function () {
          _this4.flickity.select(i, true, false);
        });

        var keydownEvent = _this4.events.register(button, 'keydown', function () {
          _this4.paginationKeydown = true;
        });

        _this4.paginationButtons.push(button);

        _this4.paginationEvents.push(buttonEvent);

        _this4.paginationEvents.push(keydownEvent);

        _this4.pagination = mobilePagination;
      };

      for (var i = 0; i < this.slides.length; i++) {
        _loop(i);
      }

      this.carouselWrapper.appendChild(mobilePagination);
    }
  }, {
    key: "_updatePagination",
    value: function _updatePagination() {
      for (var i = 0; i < this.paginationButtons.length; i++) {
        this.paginationButtons[i].dataset.selected = 'false';
        this.paginationButtons[i].setAttribute('aria-selected', 'false');
      }

      this.paginationButtons[this.flickity.selectedIndex].dataset.selected = 'true';
      this.paginationButtons[this.flickity.selectedIndex].setAttribute('aria-selected', 'true');
    }
  }, {
    key: "_updateTabindex",
    value: function _updateTabindex() {
      // We need to remove tabindex from the slides that are not currently
      // selected, so that slides not currently shown cannot receive keyboard focus.
      for (var i = 0; i < this.slides.length; i++) {
        var links = this.slides[i].querySelectorAll('a');

        for (var j = 0; j < links.length; j++) {
          links[j].setAttribute('tabindex', i === this.flickity.selectedIndex ? '0' : '-1');
        }
      }
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();

      if (this.flickity) {
        this._disableFlickity();
      }
    }
  }]);

  return MobileCarousel;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/BlogPosts.js
function BlogPosts_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function BlogPosts_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function BlogPosts_createClass(Constructor, protoProps, staticProps) { if (protoProps) BlogPosts_defineProperties(Constructor.prototype, protoProps); if (staticProps) BlogPosts_defineProperties(Constructor, staticProps); return Constructor; }



var BlogPosts = /*#__PURE__*/function () {
  function BlogPosts(section) {
    BlogPosts_classCallCheck(this, BlogPosts);

    this.el = section.el;
    this.carousel = this.el.querySelector('[data-blog-posts-wrapper]');
    this.mobileCarousel = new MobileCarousel({
      carouselWrapper: this.carousel,
      slideSelector: '[data-blog-post]'
    });
  }

  BlogPosts_createClass(BlogPosts, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.mobileCarousel.unload();
    }
  }]);

  return BlogPosts;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/Collection.js
function Collection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Collection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Collection_createClass(Constructor, protoProps, staticProps) { if (protoProps) Collection_defineProperties(Constructor.prototype, protoProps); if (staticProps) Collection_defineProperties(Constructor, staticProps); return Constructor; }






var FeaturedCollection = /*#__PURE__*/function () {
  function FeaturedCollection(section) {
    var _this = this;

    Collection_classCallCheck(this, FeaturedCollection);

    this.el = section.el;
    this.settings = section.data;
    this.events = new EventHandler/* default */.Z();
    this.productThumbnailsElements = this.el.querySelectorAll('[data-product-thumbnail]');
    this.collectionSlider = this.el.querySelector('[data-collection-slideshow]');
    this.productsPerRow = this.settings.products_per_row;
    this.productLimit = this.settings.products_limit;
    this.productThumbnails = [];
    var thumbnailSettings = {
      showSecondaryMediaOnHover: this.settings.show_secondary_media
    };
    this.productThumbnailsElements.forEach(function (productThumbnail) {
      _this.productThumbnails.push(new ProductThumbnail(productThumbnail, thumbnailSettings));
    });
    this.sidebar = new Sidebar(this.el);
    var toggleSlider = this.productLimit >= this.productsPerRow;

    if (this.collectionSlider && this.productsPerRow < this.productThumbnailsElements.length) {
      this.flickity = new (flickity_fade_default())(this.collectionSlider, {
        wrapAround: true,
        pageDots: false,
        cellAlign: 'left',
        adaptiveHeight: false,
        watchCSS: true,
        draggable: toggleSlider,
        prevNextButtons: toggleSlider,
        imagesLoaded: true
      });

      this._updateTabindex();

      this.flickity.on('change', function () {
        _this._updateTabindex();
      });

      if (toggleSlider === false) {
        this.isDraggable();
        this.events.register(window, 'resize', function () {
          _this.isDraggable();
        });
      }
    }
  }

  Collection_createClass(FeaturedCollection, [{
    key: "isDraggable",
    value: function isDraggable() {
      if (this.viewportIsMobile()) {
        this.flickity.options.draggable = true;
        this.flickity.updateDraggable();
      } else {
        this.flickity.options.draggable = false;
        this.flickity.updateDraggable();
      }
    }
  }, {
    key: "_updateTabindex",
    value: function _updateTabindex() {
      // We need to remove tabindex from the slides that are not currently
      // selected, so that slides not currently shown cannot receive keyboard focus.
      var selectedIndex = this.flickity.selectedIndex;

      for (var i = 0; i < this.productThumbnailsElements.length; i++) {
        var links = this.productThumbnailsElements[i].querySelectorAll('a');
        var isVisible = i >= selectedIndex && i < selectedIndex + this.productsPerRow;
        this.productThumbnailsElements[i].setAttribute('aria-hidden', isVisible ? 'false' : 'true');

        for (var j = 0; j < links.length; j++) {
          links[j].setAttribute('tabindex', isVisible ? '0' : '-1');
        }
      }
    }
  }, {
    key: "viewportIsMobile",
    value: function viewportIsMobile() {
      return window.innerWidth < 768;
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events.unregisterAll();
      this.sidebar.unload();
      this.flickity.destroy();
      this.productThumbnails.forEach(function (productThumbnail) {
        return productThumbnail.unload();
      });
    }
  }]);

  return FeaturedCollection;
}();


;// CONCATENATED MODULE: ./node_modules/@shopify/theme-a11y/theme-a11y.js
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 */

/**
 * Moves focus to an HTML element
 * eg for In-page links, after scroll, focus shifts to content area so that
 * next `tab` is where user expects. Used in bindInPageLinks()
 * eg move focus to a modal that is opened. Used in trapFocus()
 *
 * @param {Element} container - Container DOM element to trap focus inside of
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 */
function forceFocus(element, options) {
  options = options || {};

  var savedTabIndex = element.tabIndex;

  element.tabIndex = -1;
  element.dataset.tabIndex = savedTabIndex;
  element.focus();
  if (typeof options.className !== 'undefined') {
    element.classList.add(options.className);
  }
  element.addEventListener('blur', callback);

  function callback(event) {
    event.target.removeEventListener(event.type, callback);

    element.tabIndex = savedTabIndex;
    delete element.dataset.tabIndex;
    if (typeof options.className !== 'undefined') {
      element.classList.remove(options.className);
    }
  }
}

/**
 * If there's a hash in the url, focus the appropriate element
 * This compensates for older browsers that do not move keyboard focus to anchor links.
 * Recommendation: To be called once the page in loaded.
 *
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 * @param {string} options.ignore - Selector for elements to not include.
 */

function focusHash(options) {
  options = options || {};
  var hash = window.location.hash;
  var element = document.getElementById(hash.slice(1));

  // if we are to ignore this element, early return
  if (element && options.ignore && element.matches(options.ignore)) {
    return false;
  }

  if (hash && element) {
    forceFocus(element, options);
  }
}

/**
 * When an in-page (url w/hash) link is clicked, focus the appropriate element
 * This compensates for older browsers that do not move keyboard focus to anchor links.
 * Recommendation: To be called once the page in loaded.
 *
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 * @param {string} options.ignore - CSS selector for elements to not include.
 */

function bindInPageLinks(options) {
  options = options || {};
  var links = Array.prototype.slice.call(
    document.querySelectorAll('a[href^="#"]')
  );

  return links.filter(function(link) {
    if (link.hash === '#' || link.hash === '') {
      return false;
    }

    if (options.ignore && link.matches(options.ignore)) {
      return false;
    }

    var element = document.querySelector(link.hash);

    if (!element) {
      return false;
    }

    link.addEventListener('click', function() {
      forceFocus(element, options);
    });

    return true;
  });
}

function focusable(container) {
  var elements = Array.prototype.slice.call(
    container.querySelectorAll(
      '[tabindex],' +
        '[draggable],' +
        'a[href],' +
        'area,' +
        'button:enabled,' +
        'input:not([type=hidden]):enabled,' +
        'object,' +
        'select:enabled,' +
        'textarea:enabled'
    )
  );

  // Filter out elements that are not visible.
  // Copied from jQuery https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/css/hiddenVisibleSelectors.js
  return elements.filter(function(element) {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  });
}

/**
 * Traps the focus in a particular container
 *
 * @param {Element} container - Container DOM element to trap focus inside of
 * @param {Element} elementToFocus - Element to be focused on first
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 */

var trapFocusHandlers = {};

function trapFocus(container, options) {
  options = options || {};
  var elements = focusable(container);
  var elementToFocus = options.elementToFocus || container;
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = function(event) {
    if (container !== event.target && !container.contains(event.target)) {
      first.focus();
    }

    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;
    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function(event) {
    if (event.keyCode !== 9) return; // If not TAB key

    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  forceFocus(elementToFocus, options);
}

/**
 * Removes the trap of focus from the page
 */
function removeTrapFocus() {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);
}

/**
 * Add a preventive message to external links and links that open to a new window.
 * @param {string} elements - Specific elements to be targeted
 * @param {object} options.messages - Custom messages to overwrite with keys: newWindow, external, newWindowExternal
 * @param {string} options.messages.newWindow - When the link opens in a new window (e.g. target="_blank")
 * @param {string} options.messages.external - When the link is to a different host domain.
 * @param {string} options.messages.newWindowExternal - When the link is to a different host domain and opens in a new window.
 * @param {object} options.prefix - Prefix to namespace "id" of the messages
 */
function accessibleLinks(elements, options) {
  if (typeof elements !== 'string') {
    throw new TypeError(elements + ' is not a String.');
  }

  elements = document.querySelectorAll(elements);

  if (elements.length === 0) {
    return;
  }

  options = options || {};
  options.messages = options.messages || {};

  var messages = {
    newWindow: options.messages.newWindow || 'Opens in a new window.',
    external: options.messages.external || 'Opens external website.',
    newWindowExternal:
      options.messages.newWindowExternal ||
      'Opens external website in a new window.'
  };

  var prefix = options.prefix || 'a11y';

  var messageSelectors = {
    newWindow: prefix + '-new-window-message',
    external: prefix + '-external-message',
    newWindowExternal: prefix + '-new-window-external-message'
  };

  function generateHTML(messages) {
    var container = document.createElement('ul');
    var htmlMessages = Object.keys(messages).reduce(function(html, key) {
      return (html +=
        '<li id=' + messageSelectors[key] + '>' + messages[key] + '</li>');
    }, '');

    container.setAttribute('hidden', true);
    container.innerHTML = htmlMessages;

    document.body.appendChild(container);
  }

  function externalSite(link) {
    return link.hostname !== window.location.hostname;
  }

  elements.forEach(function(link) {
    var target = link.getAttribute('target');
    var rel = link.getAttribute('rel');
    var isExternal = externalSite(link);
    var isTargetBlank = target === '_blank';
    var missingRelNoopener = rel === null || rel.indexOf('noopener') === -1;

    if (isTargetBlank && missingRelNoopener) {
      var relValue = rel === null ? 'noopener' : rel + ' noopener';
      link.setAttribute('rel', relValue);
    }

    if (isExternal && isTargetBlank) {
      link.setAttribute('aria-describedby', messageSelectors.newWindowExternal);
    } else if (isExternal) {
      link.setAttribute('aria-describedby', messageSelectors.external);
    } else if (isTargetBlank) {
      link.setAttribute('aria-describedby', messageSelectors.newWindow);
    }
  });

  generateHTML(messages);
}
;// CONCATENATED MODULE: ./source/scripts/sections/Gallery.js
function Gallery_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Gallery_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Gallery_createClass(Constructor, protoProps, staticProps) { if (protoProps) Gallery_defineProperties(Constructor.prototype, protoProps); if (staticProps) Gallery_defineProperties(Constructor, staticProps); return Constructor; }






var Gallery = /*#__PURE__*/function () {
  function Gallery(section) {
    var _this = this;

    Gallery_classCallCheck(this, Gallery);

    this.el = section.el;
    this.events = new EventHandler/* default */.Z();
    this.settings = section.data;
    this.blocks = this.settings.blocks;
    this.perRow = this.settings.slides_per_row;
    this.gallery = this.el.querySelector('[data-gallery-slide]');
    this.images = document.querySelectorAll('[data-gallery-modal]');
    this.imageArray = [];
    this.modal = new GalleryModal();
    this.trigger = null;
    var toggleOptions = this.blocks > this.perRow;
    this.slideshow = new (flickity_fade_default())(this.gallery, {
      accessibility: false,
      // Flickity's inherent "accessibility" actually makes it worse
      wrapAround: true,
      pageDots: false,
      cellAlign: 'left',
      watchCSS: true,
      draggable: toggleOptions,
      prevNextButtons: toggleOptions,
      imagesLoaded: true
    });
    this.slideshow.on('settle', function () {
      _this.checkVisibility();
    });

    if (this.blocks > this.perRow === false) {
      this.toggleDraggable();
      this.events.register(window, 'resize', function () {
        _this.toggleDraggable();
      });
    }

    this.events.register(this.gallery, 'rimg:load', function () {
      if (_this.gallery.offsetHeight === 0) {
        _this.slideshow.resize();
      }
    });
    this.initModal();
  }

  Gallery_createClass(Gallery, [{
    key: "toggleDraggable",
    value: function toggleDraggable() {
      if (this.viewportIsMobile()) {
        this.slideshow.options.draggable = true;
        this.slideshow.updateDraggable();
      } else {
        this.slideshow.options.draggable = false;
        this.slideshow.updateDraggable();
      }
    }
  }, {
    key: "viewportIsMobile",
    value: function viewportIsMobile() {
      return window.innerWidth < 768;
    }
  }, {
    key: "initModal",
    value: function initModal() {
      var _this2 = this;

      this.images.forEach(function (image, selectedIndex) {
        var href = image.href,
            dataset = image.dataset;
        var item = {
          src: href,
          w: dataset.imageWidth,
          h: dataset.imageHeight
        };

        _this2.imageArray.push(item);

        _this2.events.register(image, 'click', function (e) {
          e.preventDefault();
          _this2.trigger = image;

          _this2.modal.init(_this2.imageArray, selectedIndex);

          trapFocus(_this2.modal.modalTarget);

          _this2.modal.modal.listen('close', function () {
            removeTrapFocus(_this2.modal.modalTarget);

            _this2.trigger.focus();
          });
        });
      });
    }
  }, {
    key: "checkVisibility",
    value: function checkVisibility() {
      var viewportX = this.slideshow.viewport.getBoundingClientRect().x;
      var viewportWidth = this.slideshow.viewport.offsetWidth;
      this.slideshow.cells.forEach(function (cell) {
        var cellX = cell.element.getBoundingClientRect().x - viewportX;
        var isHidden = Math.ceil(cellX) >= viewportX && Math.ceil(cellX) >= viewportWidth;

        if (isHidden) {
          cell.element.querySelector('a').setAttribute('tabindex', -1);
          cell.element.setAttribute('aria-hidden', true);
        } else {
          cell.element.querySelector('a').setAttribute('tabindex', 0);
          cell.element.removeAttribute('aria-hidden');
        }
      });
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(block) {
      if (this.blocks > this.perRow) {
        var slideIndex = block.el.dataset.slideIndex;
        this.slideshow.select(slideIndex);
        this.slideshow.resize();
      }
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events.unregisterAll();
      this.slideshow.destroy();
      this.modal.destroy();
    }
  }]);

  return Gallery;
}();


;// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-cross-border/dist/index.es.js
function shopify_cross_border_dist_index_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function shopify_cross_border_dist_index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function shopify_cross_border_dist_index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) shopify_cross_border_dist_index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) shopify_cross_border_dist_index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function dist_index_es_createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var index_es_EventHandler_1 = dist_index_es_createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var EventHandler =
/** @class */
function () {
  function EventHandler() {
    this.events = [];
  }

  EventHandler.prototype.register = function (el, event, listener) {
    if (!el || !event || !listener) return null;
    this.events.push({
      el: el,
      event: event,
      listener: listener
    });
    el.addEventListener(event, listener);
    return {
      el: el,
      event: event,
      listener: listener
    };
  };

  EventHandler.prototype.unregister = function (_a) {
    var el = _a.el,
        event = _a.event,
        listener = _a.listener;
    if (!el || !event || !listener) return null;
    this.events = this.events.filter(function (e) {
      return el !== e.el || event !== e.event || listener !== e.listener;
    });
    el.removeEventListener(event, listener);
    return {
      el: el,
      event: event,
      listener: listener
    };
  };

  EventHandler.prototype.unregisterAll = function () {
    this.events.forEach(function (_a) {
      var el = _a.el,
          event = _a.event,
          listener = _a.listener;
      return el.removeEventListener(event, listener);
    });
    this.events = [];
  };

  return EventHandler;
}();

exports["default"] = EventHandler;
});

var Events = /*@__PURE__*/getDefaultExportFromCjs(index_es_EventHandler_1);

var selectors = {
  disclosureList: '[data-disclosure-list]',
  disclosureToggle: '[data-disclosure-toggle]',
  disclosureInput: '[data-disclosure-input]',
  disclosureOptions: '[data-disclosure-option]'
};
var classes = {
  listVisible: 'disclosure-list--visible',
  alternateDrop: 'disclosure-list--alternate-drop'
};

var Disclosure = /*#__PURE__*/function () {
  function Disclosure(el) {
    shopify_cross_border_dist_index_es_classCallCheck(this, Disclosure);

    this.el = el;
    this.events = new Events();
    this.cache = {};

    this._cacheSelectors();

    this._connectOptions();

    this._connectToggle();

    this._onFocusOut();
  }

  shopify_cross_border_dist_index_es_createClass(Disclosure, [{
    key: "_cacheSelectors",
    value: function _cacheSelectors() {
      this.cache = {
        disclosureList: this.el.querySelector(selectors.disclosureList),
        disclosureToggle: this.el.querySelector(selectors.disclosureToggle),
        disclosureInput: this.el.querySelector(selectors.disclosureInput),
        disclosureOptions: this.el.querySelectorAll(selectors.disclosureOptions)
      };
    }
  }, {
    key: "_connectToggle",
    value: function _connectToggle() {
      var _this = this;

      this.events.register(this.cache.disclosureToggle, 'click', function (e) {
        var ariaExpanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
        e.currentTarget.setAttribute('aria-expanded', !ariaExpanded);

        _this.cache.disclosureList.classList.remove(classes.alternateDrop);

        _this.cache.disclosureList.classList.toggle(classes.listVisible);

        window.requestAnimationFrame(function () {
          var _this$cache$disclosur = _this.cache.disclosureList.getBoundingClientRect(),
              left = _this$cache$disclosur.left,
              width = _this$cache$disclosur.width;

          var _window = window,
              innerWidth = _window.innerWidth;
          var gutter = 30;

          if (left + width + gutter > innerWidth) {
            _this.cache.disclosureList.classList.add(classes.alternateDrop);
          }
        });
      });
    }
  }, {
    key: "_connectOptions",
    value: function _connectOptions() {
      var _this2 = this;

      var options = this.cache.disclosureOptions;

      for (var i = 0; i < options.length; i++) {
        var option = options[i];
        this.events.register(option, 'click', function (e) {
          return _this2._submitForm(e.currentTarget.dataset.value);
        });
      }
    }
  }, {
    key: "_onFocusOut",
    value: function _onFocusOut() {
      var _this3 = this;

      this.events.register(this.cache.disclosureToggle, 'focusout', function (e) {
        var disclosureLostFocus = !_this3.el.contains(e.relatedTarget);

        if (disclosureLostFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.cache.disclosureList, 'focusout', function (e) {
        var childInFocus = e.currentTarget.contains(e.relatedTarget);

        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);

        if (isVisible && !childInFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.el, 'keyup', function (e) {
        if (e.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        if (e.key !== 'Escape' || e.key !== 'Esc') return;

        _this3._hideList();

        _this3.cache.disclosureToggle.focus();
      });
      this.events.register(document.body, 'click', function (e) {
        var isOption = _this3.el.contains(e.target);

        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);

        if (isVisible && !isOption) {
          _this3._hideList();
        }
      });
    }
  }, {
    key: "_submitForm",
    value: function _submitForm(value) {
      this.cache.disclosureInput.value = value;
      this.el.closest('form').submit();
    }
  }, {
    key: "_hideList",
    value: function _hideList() {
      this.cache.disclosureList.classList.remove(classes.listVisible);
      this.cache.disclosureToggle.setAttribute('aria-expanded', false);
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();
    }
  }]);

  return Disclosure;
}();

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function closest(s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}

/* harmony default export */ var shopify_cross_border_dist_index_es = (Disclosure);

;// CONCATENATED MODULE: ./source/scripts/components/NavDesktopParent.js
function NavDesktopParent_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavDesktopParent_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavDesktopParent_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavDesktopParent_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavDesktopParent_defineProperties(Constructor, staticProps); return Constructor; }


 // eslint-disable-line import/no-cycle

var NavDesktopParent = /*#__PURE__*/function () {
  function NavDesktopParent(el, options) {
    var _this = this;

    NavDesktopParent_classCallCheck(this, NavDesktopParent);

    this.listitem = el;
    this.link = null;
    this.submenu = null;
    this._isOpen = false;
    this._isMeganav = false;
    this.menu = null;
    this.parentMenu = options.parentMenu;
    this.closeSiblings = this.parentMenu.closeSiblings;
    this.events = new EventHandler/* default */.Z();
    var children = this.listitem.children;

    for (var i = 0; i < children.length; i++) {
      if (children[i].dataset.mainNavLink !== undefined) {
        this.link = children[i];
      } else if (children[i].dataset.mainNavSubmenu !== undefined) {
        this.submenu = children[i];
      }
    }

    this._isMeganav = this.submenu && this.submenu.classList.contains('navigation-meganav');

    this.open = function () {
      _this._open();
    };

    this.close = function () {
      _this._close();
    };

    this.closeEsc = function (e) {
      if (e.key === 'Escape') {
        _this.link.focus();

        _this.close();
      }
    };

    this.closeTimer = null;

    this.mouseover = function () {
      clearTimeout(_this.closeTimer);

      _this.open();
    };

    this.mouseout = function () {
      _this.closeTimer = setTimeout(_this.close, 400);
    };

    this.click = function (e) {
      e.stopPropagation(); // if already open, continue to link destination

      if (e.target.dataset.mainNavLink === undefined || _this._isOpen) {
        return;
      }

      e.preventDefault();

      _this.open();
    };

    this.focusin = function (e) {
      e.stopPropagation();

      _this.closeSiblings(_this);
    };

    this.events.register(this.listitem, 'mouseover', function () {
      return _this.mouseover();
    });
    this.events.register(this.listitem, 'mouseout', function () {
      return _this.mouseout();
    });
    this.events.register(this.listitem, 'touchend', function () {
      return _this.touchend();
    });
    this.events.register(this.listitem, 'click', function (e) {
      return _this.click(e);
    });
    this.events.register(this.listitem, 'focusin', function (e) {
      return _this.focusin(e);
    });
    this.events.register(document.body, 'click', function () {
      return _this.close();
    });
    this.events.register(document.body, 'focusin', function () {
      return _this.close();
    });
  }

  NavDesktopParent_createClass(NavDesktopParent, [{
    key: "isOpen",
    get: function get() {
      return this._isOpen;
    }
  }, {
    key: "isMeganav",
    get: function get() {
      return this.submenu.classList.contains('navigation-meganav');
    }
  }, {
    key: "blockId",
    get: function get() {
      return this.submenu.dataset.meganavId;
    }
  }, {
    key: "forceOpen",
    value: function forceOpen() {
      return this._open(true);
    }
  }, {
    key: "forceClose",
    value: function forceClose() {
      return this._close(true);
    }
  }, {
    key: "_open",
    value: function _open() {
      var _this2 = this;

      if (this._isOpen) return;
      this._isOpen = true;
      this.closeSiblings(this);
      this.closeEscEvent = this.events.register(window, 'keydown', function (e) {
        return _this2.closeEsc(e);
      });

      if (!this.menu && !this.submenu.classList.contains('navigation-meganav')) {
        this.menu = new NavDesktopMenu(this.submenu);
      }

      this.submenu.classList.add('open');
      this.submenu.classList.remove('alternate-drop'); // Check for if dropdown is offscreen and style accordingly

      var menuBounds = this.submenu.getBoundingClientRect();

      if (menuBounds.right > document.documentElement.clientWidth) {
        this.submenu.classList.add('alternate-drop');
      }

      this.link.setAttribute('aria-expanded', true);
    }
  }, {
    key: "_close",
    value: function _close() {
      if (!this._isOpen) return;

      if (this.menu) {
        this.menu.unload();
        this.menu = null;
      }

      this._isOpen = false;
      this.events.unregister(this.closeEscEvent);
      this.submenu.classList.remove('open');
      this.submenu.classList.remove('alternate-drop');
      this.link.setAttribute('aria-expanded', false);
      this.parentMenu.openSelectedBlock();
    }
  }, {
    key: "unload",
    value: function unload() {
      this.forceClose();
      this.events.unregisterAll();
      window.removeEventListener('keydown', this.closeEsc);
    }
  }]);

  return NavDesktopParent;
}();


;// CONCATENATED MODULE: ./source/scripts/components/NavDesktopMenu.js
function NavDesktopMenu_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavDesktopMenu_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavDesktopMenu_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavDesktopMenu_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavDesktopMenu_defineProperties(Constructor, staticProps); return Constructor; }


 // eslint-disable-line import/no-cycle

var NavDesktopMenu = /*#__PURE__*/function () {
  function NavDesktopMenu(_ref) {
    var _this = this;

    var children = _ref.children;

    NavDesktopMenu_classCallCheck(this, NavDesktopMenu);

    this.parents = [];
    this.children = children;
    this.events = new EventHandler/* default */.Z(); // Meganav, if any, that is fully open (not animating).

    this._openMeganav = null; // Meganav, if any, that is selected for editing in the TE.

    this._selectedBlock = null;
    this._megaNavs = null;

    this.closeSiblings = function (current) {
      _this.parents.forEach(function (parent) {
        if (parent !== current) {
          parent.close();
        }
      });
    };

    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];

      if (child.dataset.mainNavParent !== undefined) {
        this.parents.push(new NavDesktopParent(child, {
          parentMenu: this
        }));
      } else {
        this.events.register(child, 'focusin', function () {
          return _this.closeSiblings();
        });
      }
    }
  }

  NavDesktopMenu_createClass(NavDesktopMenu, [{
    key: "openMeganav",
    get: function get() {
      return this._openMeganav;
    },
    set: function set(meganav) {
      this._openMeganav = meganav;
    }
  }, {
    key: "selectBlock",
    value: function selectBlock(id) {
      var _this2 = this;

      // This is TE only, so only initialize the first time a block is selected
      if (!this._megaNavs) {
        this._megaNavs = {};
        this.parents.filter(function (parent) {
          return parent.isMeganav;
        }).forEach(function (megaNav) {
          _this2._megaNavs[megaNav.blockId] = megaNav;
        });
      }

      var newSelectedBlock = this._megaNavs[id];
      if (this._selectedBlock === newSelectedBlock) return;

      if (this._selectedBlock) {
        this._selectedBlock.close();
      }

      this._selectedBlock = this._megaNavs[id]; // Force open give a better experience when changing settings.
      // Otherwise the selected block visibly closes and reopens after every
      // settings change.

      this._selectedBlock.forceOpen();
    }
  }, {
    key: "openSelectedBlock",
    value: function openSelectedBlock() {
      if (this._selectedBlock && this.parents.filter(function (parent) {
        return parent.isOpen;
      }).length === 0) {
        this._selectedBlock.open();
      }
    } // If a block is open and selected in the TE and no other blocks are open
    // we don't want to close it when we normally would.

  }, {
    key: "shouldBlockClose",
    value: function shouldBlockClose(block) {
      if (block === this._selectedBlock && this.parents.filter(function (parent) {
        return parent.isOpen;
      }).length === 1) {
        return false;
      }

      return true;
    }
  }, {
    key: "closeAllMenus",
    value: function closeAllMenus() {
      this._selectedBlock = null;
      this.parents.forEach(function (parent) {
        return parent.close();
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      this.parents.forEach(function (parent) {
        parent.unload();
      });
      this.events.unregisterAll();
    }
  }]);

  return NavDesktopMenu;
}();


;// CONCATENATED MODULE: ./source/scripts/helpers/ScrollLock.js
function ScrollLock_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ScrollLock_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ScrollLock_createClass(Constructor, protoProps, staticProps) { if (protoProps) ScrollLock_defineProperties(Constructor.prototype, protoProps); if (staticProps) ScrollLock_defineProperties(Constructor, staticProps); return Constructor; }

var _document = document,
    body = _document.body;
var html = document.querySelector('html');

function _blockScroll(event) {
  // Only block events that occur outside the modal
  if (event.target.closest('.allow-scroll-while-locked')) return;
  event.preventDefault();
  event.stopPropagation();
}

var ScrollLock = /*#__PURE__*/function () {
  function ScrollLock() {
    ScrollLock_classCallCheck(this, ScrollLock);
  }

  ScrollLock_createClass(ScrollLock, null, [{
    key: "lock",
    value:
    /**
     * Prevents all scrolling of the document
     * @param {HTMLElement} modal Element within which scrolling is allowed
     */
    function lock(modal) {
      if (modal) {
        modal.classList.add('allow-scroll-while-locked');
      }

      html.classList.add('scroll-locked');
      body.style.top = -1 * window.pageYOffset;
      body.addEventListener('scroll', _blockScroll, false);
      body.addEventListener('touchmove', _blockScroll, {
        passive: false
      });
    }
    /**
     * Removes scroll lock
     */

  }, {
    key: "unlock",
    value: function unlock() {
      document.querySelectorAll('.allow-scroll-while-locked').forEach(function (modal) {
        return modal.classList.remove('allow-scroll-while-locked');
      });
      html.classList.remove('scroll-locked');
      body.style.top = '';
      body.removeEventListener('scroll', _blockScroll, false);
      body.removeEventListener('touchmove', _blockScroll, {
        passive: false
      });
    }
  }, {
    key: "isLocked",
    get: function get() {
      return html.classList.contains('scroll-locked');
    }
  }]);

  return ScrollLock;
}();


;// CONCATENATED MODULE: ./source/scripts/components/NavMobileSubmenu.js
function NavMobileSubmenu_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavMobileSubmenu_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavMobileSubmenu_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavMobileSubmenu_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavMobileSubmenu_defineProperties(Constructor, staticProps); return Constructor; }





var NavMobileSubmenu = /*#__PURE__*/function () {
  function NavMobileSubmenu(settings) {
    var _this = this;

    NavMobileSubmenu_classCallCheck(this, NavMobileSubmenu);

    this.menu = settings.submenu;
    this.trigger = settings.trigger;
    this.parentMenu = settings.parentMenu;
    this.tier = settings.tier;
    this.mobileMenu = settings.mobileMenu;
    this.submenu = null;
    this.backButton = this.menu.querySelector('[data-mobile-back-button]');
    this.closeButton = this.menu.querySelector('[data-mobile-close-button]');
    this.flyout = this.menu.querySelector('[data-mobile-submenu-flyout]');
    this.overlay = this.menu.querySelector('[data-mobile-submenu-overlay]');
    this.submenuTriggers = this.menu.querySelectorAll("[data-mobile-submenu-button=\"tier-".concat(this.tier, "\"]"));
    this.events = new EventHandler/* default */.Z();
    this.flyoutAnimation = transition({
      el: this.flyout,
      state: 'closed'
    });
    this.overlayAnimation = transition({
      el: this.overlay,
      state: 'closed'
    });
    this.events.register(this.backButton, 'click', function () {
      return _this.close();
    });
    this.events.register(this.closeButton, 'click', function () {
      return _this.mobileMenu.close();
    });
    this.submenuTriggers.forEach(function (submenuTrigger) {
      _this.events.register(submenuTrigger, 'click', function (e) {
        return _this.openSubmenu(e);
      });
    });
    this.open();
  }

  NavMobileSubmenu_createClass(NavMobileSubmenu, [{
    key: "open",
    value: function open() {
      this.menu.dataset.open = true;
      this.flyoutAnimation.animateTo('open');
      this.overlayAnimation.animateTo('open');
      this.menu.focus();
      trapFocus(this.menu);
    }
  }, {
    key: "close",
    value: function close() {
      var _this2 = this;

      removeTrapFocus(this.menu);
      this.trigger.focus();
      trapFocus(this.parentMenu);
      this.parentMenu.dataset.childOpen = false;
      this.overlayAnimation.animateTo('closed');
      this.flyoutAnimation.animateTo('closed').then(function () {
        _this2.unload();
      });
    }
  }, {
    key: "openSubmenu",
    value: function openSubmenu(e) {
      var submenuTrigger = e.target;
      var submenu = submenuTrigger.nextElementSibling;
      this.menu.dataset.childOpen = true;
      this.submenu = new NavMobileSubmenu({
        submenu: submenu,
        trigger: submenuTrigger,
        parentMenu: this.menu,
        tier: this.tier + 1,
        mobileMenu: this.mobileMenu
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      if (this.submenu) {
        this.submenu.unload();
      }

      this.menu.dataset.open = false;
      this.menu.dataset.childOpen = false;
      this.flyoutAnimation.animateTo('closed', {
        force: true
      });
      this.overlayAnimation.animateTo('closed', {
        force: true
      });
      this.flyoutAnimation.unload();
      this.overlayAnimation.unload();
      this.events.unregisterAll();
    }
  }]);

  return NavMobileSubmenu;
}();


;// CONCATENATED MODULE: ./source/scripts/components/NavMobileMenu.js
function NavMobileMenu_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavMobileMenu_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavMobileMenu_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavMobileMenu_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavMobileMenu_defineProperties(Constructor, staticProps); return Constructor; }








var NavMobileMenu = /*#__PURE__*/function () {
  function NavMobileMenu(_ref) {
    var _this = this;

    var controls = _ref.controls,
        mobileNav = _ref.mobileNav;

    NavMobileMenu_classCallCheck(this, NavMobileMenu);

    this.controls = controls;
    this.mobileNav = mobileNav;
    this.submenu = null;
    this.mobileTrigger = this.controls.querySelector('[data-mobile-nav-trigger]');
    this.closeButton = this.mobileNav.querySelector('[data-mobile-nav-close]');
    this.mainFlyout = this.mobileNav.querySelector('[data-mobile-main-flyout]');
    this.overlay = this.mobileNav.querySelector('[data-mobile-overlay]');
    this.submenuTriggers = this.mobileNav.querySelectorAll('[data-mobile-submenu-button="tier-1"]');
    this.events = new EventHandler/* default */.Z();
    this.flyoutAnimation = transition({
      el: this.mainFlyout,
      state: 'closed'
    });
    this.overlayAnimation = transition({
      el: this.overlay,
      state: 'closed'
    });

    this.closeEsc = function (e) {
      if (e.key === 'Escape') {
        _this.close();
      }
    };

    this.events.register(this.mobileTrigger, 'click', function (event) {
      return _this.open(event);
    });
    this.events.register(this.closeButton, 'click', function () {
      return _this.close();
    });
    this.events.register(this.overlay, 'click', function () {
      return _this.close();
    });
    this.submenuTriggers.forEach(function (submenuTrigger) {
      _this.events.register(submenuTrigger, 'click', function (e) {
        return _this.openSubmenu(e);
      });
    }); // Currency and Language selectors

    this.currencyDisclosureEl = this.mobileNav.querySelector('[data-disclosure-currency]');
    this.localeDisclosureEl = this.mobileNav.querySelector('[data-disclosure-locale]');
    this.disclosures = [];

    if (this.currencyDisclosureEl) {
      this.disclosures.push(new shopify_cross_border_dist_index_es(this.currencyDisclosureEl));
    }

    if (this.localeDisclosureEl) {
      this.disclosures.push(new shopify_cross_border_dist_index_es(this.localeDisclosureEl));
    }
  }

  NavMobileMenu_createClass(NavMobileMenu, [{
    key: "open",
    value: function open(e) {
      var _this2 = this;

      e.preventDefault();
      ScrollLock.lock(this.mobileNav);
      this.mobileNav.dataset.open = true;
      this.flyoutAnimation.animateTo('open');
      this.overlayAnimation.animateTo('open');
      this.closeEvent = this.events.register(window, 'keydown', function (e) {
        return _this2.closeEsc(e);
      });
      this.mobileNav.focus();
      trapFocus(this.mobileNav);
    }
  }, {
    key: "close",
    value: function close() {
      var _this3 = this;

      ScrollLock.unlock();
      removeTrapFocus(this.mobileNav);
      this.mobileTrigger.focus();
      this.mobileNav.dataset.childOpen = false;
      this.events.unregister(this.closeEvent);
      this.flyoutAnimation.animateTo('closed');
      this.overlayAnimation.animateTo('closed').then(function () {
        _this3.mobileNav.dataset.open = false;

        if (_this3.submenu) {
          _this3.submenu.unload();
        }
      });
    }
  }, {
    key: "openSubmenu",
    value: function openSubmenu(e) {
      var submenuTrigger = e.target;
      var submenu = submenuTrigger.nextElementSibling;
      this.mobileNav.dataset.childOpen = true;
      this.submenu = new NavMobileSubmenu({
        submenu: submenu,
        trigger: submenuTrigger,
        parentMenu: this.mobileNav,
        tier: 2,
        mobileMenu: this
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      if (this.submenu) {
        this.submenu.unload();
      }

      this.flyoutAnimation.animateTo('closed', {
        force: true
      });
      this.overlayAnimation.animateTo('closed', {
        force: true
      });
      this.flyoutAnimation.unload();
      this.overlayAnimation.unload();
      this.disclosures.forEach(function (disclosure) {
        return disclosure.unload();
      });
      this.events.unregisterAll();
    }
  }]);

  return NavMobileMenu;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/Header.js
function Header_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Header_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Header_createClass(Constructor, protoProps, staticProps) { if (protoProps) Header_defineProperties(Constructor.prototype, protoProps); if (staticProps) Header_defineProperties(Constructor, staticProps); return Constructor; }






var Header = /*#__PURE__*/function () {
  function Header(section) {
    var _this = this;

    Header_classCallCheck(this, Header);

    this.el = section.el;
    this.data = section.data;
    this.events = new EventHandler/* default */.Z();
    this.sticky = this.data.sticky_header;
    this.firstSectionIsBanner = false;
    this.transparent = false;
    this.main = document.querySelector('main');
    this.announcement = this.el.querySelector('[data-site-announcement]');
    this.utilityBar = this.el.querySelector('[data-header-utility]');
    this.header = this.el.querySelector('[data-site-header]');
    this.mobileControls = this.el.querySelector('[data-mobile-header-controls]');
    this.navigation = this.el.querySelector('[data-main-nav]');
    this.mobileNav = this.el.querySelector('[data-mobile-nav]'); // We need to move the mobile nav in the dom to be outside of the header to allow for
    // appropriate z-index between the header controls, header, and mobile nav.

    this.mobileNav = document.body.insertBefore(this.mobileNav, this.el.nextSibling);
    this.navDesktopMenu = new NavDesktopMenu(this.navigation);
    this.navMobile = new NavMobileMenu({
      controls: this.mobileControls,
      mobileNav: this.mobileNav
    });

    if (this.sticky) {
      document.body.classList.add('site-header--sticky');
    }

    if (this.data.transparent_header !== 'none') {
      // Determine if the first section is a banner which makes the header transparent
      var firstSection = this.main.querySelector('section');

      if (firstSection) {
        this.firstSectionIsBanner = firstSection.classList.contains('image-with-text-overlay--wide') || firstSection.classList.contains('article-template--width-wide') || firstSection.classList.contains('blog-template--width-wide') || firstSection.classList.contains('slideshow--width-wide') || firstSection.classList.contains('video-section--width-wide-true');
      }

      if (this.firstSectionIsBanner && (this.data.current_page === 'index' || this.data.transparent_header === 'site')) {
        this.main.classList.add('main--transparent-header');
      }

      this._setHeaderTransparency(); // We only want to change transparency if the header is sticky


      if (this.sticky) {
        this.events.register(window, 'scroll', function () {
          _this._setBodyScrolled();

          _this._setHeaderTransparency();
        });
      }
    } else if (this.sticky) {
      this.events.register(window, 'scroll', function () {
        _this._setBodyScrolled();
      });
    }

    this._setCSSHeightVariables(); // If the window resizes, the number of rows of menu items might change, so we need to adjust
    // the variables that adjust the placement of the header and main elements.
    // This is also the case if the image logo size changes (usually editor only).


    this.events.register(window, 'resize', function () {
      return _this._setCSSHeightVariables();
    });
    this.events.register(this.header, 'rimg:load', function () {
      return _this._setCSSHeightVariables();
    }); // Correcting for cached CSS variables that are making the screen not stop at position 0

    if (document.documentElement.scrollTop < 250) {
      window.scrollTo(0, 0);
    } // Currency and Language selectors


    this.currencyDisclosureEl = this.el.querySelector('[data-disclosure-currency]');
    this.localeDisclosureEl = this.el.querySelector('[data-disclosure-locale]');
    this.disclosures = [];

    if (this.currencyDisclosureEl) {
      this.disclosures.push(new shopify_cross_border_dist_index_es(this.currencyDisclosureEl));
    }

    if (this.localeDisclosureEl) {
      this.disclosures.push(new shopify_cross_border_dist_index_es(this.localeDisclosureEl));
    }

    this.el.classList.add('site-header__outer-wrapper--loaded');
  }

  Header_createClass(Header, [{
    key: "_setBodyScrolled",
    value: function _setBodyScrolled() {
      if (document.documentElement.scrollTop < 150) {
        document.body.classList.remove('body--scrolled');
      } else {
        document.body.classList.add('body--scrolled');
      }
    }
  }, {
    key: "_setHeaderTransparency",
    value: function _setHeaderTransparency() {
      // Sets the header transparent class based on the page and scroll position
      if (this.firstSectionIsBanner && (this.data.current_page === 'index' || this.data.transparent_header === 'site') && (!this.sticky || document.documentElement.scrollTop < 150)) {
        this.el.classList.add('site-header__outer-wrapper--transparent');

        if (!this.transparent) {
          this.transparent = true;

          this._setCSSHeightVariables();
        }
      } else {
        this.el.classList.remove('site-header__outer-wrapper--transparent');

        if (this.transparent) {
          this.transparent = false;

          this._setCSSHeightVariables();
        }
      }
    }
  }, {
    key: "_setCSSHeightVariables",
    value: function _setCSSHeightVariables() {
      // Set CSS variables to adjust sticky header
      var announcementHeight = this.announcement ? this.announcement.offsetHeight : 0;
      var utilityHeight = this.utilityBar ? this.utilityBar.offsetHeight : 0;
      var headerHeight = this.header.offsetHeight;
      var fullHeaderHeight = utilityHeight + headerHeight;
      document.body.style.setProperty('--announcement-height', "".concat(announcementHeight, "px"));
      document.body.style.setProperty('--utility-height', "".concat(utilityHeight, "px"));
      document.body.style.setProperty('--header-height', "".concat(headerHeight, "px"));
      document.body.style.setProperty('--full-header-height', "".concat(fullHeaderHeight, "px"));
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.navDesktopMenu.unload();
      this.events.unregisterAll();
      this.disclosures.forEach(function (disclosure) {
        return disclosure.unload();
      });
      document.body.classList.remove('site-header--sticky');
      this.main.classList.remove('main--transparent-header');
    }
  }]);

  return Header;
}();


;// CONCATENATED MODULE: ./node_modules/@shopify/theme-addresses/theme-addresses.js
/**
 * CountryProvinceSelector Constructor
 * @param {String} countryOptions the country options in html string
 */
function CountryProvinceSelector(countryOptions) {
  if (typeof countryOptions !== 'string') {
    throw new TypeError(countryOptions + ' is not a string.');
  }
  this.countryOptions = countryOptions;
}

/**
 * Builds the country and province selector with the given node element
 * @param {Node} countryNodeElement The <select> element for country
 * @param {Node} provinceNodeElement The <select> element for province
 * @param {Object} options Additional settings available
 * @param {CountryProvinceSelector~onCountryChange} options.onCountryChange callback after a country `change` event
 * @param {CountryProvinceSelector~onProvinceChange} options.onProvinceChange callback after a province `change` event
 */
CountryProvinceSelector.prototype.build = function (countryNodeElement, provinceNodeElement, options) {
  if (typeof countryNodeElement !== 'object') {
    throw new TypeError(countryNodeElement + ' is not a object.');
  }

  if (typeof provinceNodeElement !== 'object') {
    throw new TypeError(provinceNodeElement + ' is not a object.');
  }

  var defaultValue = countryNodeElement.getAttribute('data-default');
  options = options || {}

  countryNodeElement.innerHTML = this.countryOptions;
  countryNodeElement.value = defaultValue;

  if (defaultValue && getOption(countryNodeElement, defaultValue)) {
    var provinces = buildProvince(countryNodeElement, provinceNodeElement, defaultValue);
    options.onCountryChange && options.onCountryChange(provinces, provinceNodeElement, countryNodeElement);
  }

  // Listen for value change on the country select
  countryNodeElement.addEventListener('change', function (event) {
    var target = event.target;
    var selectedValue = target.value;
    
    var provinces = buildProvince(target, provinceNodeElement, selectedValue);
    options.onCountryChange && options.onCountryChange(provinces, provinceNodeElement, countryNodeElement);
  });

  options.onProvinceChange && provinceNodeElement.addEventListener('change', options.onProvinceChange);
}

/**
 * This callback is called after a user interacted with a country `<select>`
 * @callback CountryProvinceSelector~onCountryChange
 * @param {array} provinces the parsed provinces
 * @param {Node} provinceNodeElement province `<select>` element
 * @param {Node} countryNodeElement country `<select>` element
 */

 /**
 * This callback is called after a user interacted with a province `<select>`
 * @callback CountryProvinceSelector~onProvinceChange
 * @param {Event} event the province selector `change` event object
 */

/**
 * Returns the <option> with the specified value from the
 * given node element
 * A null is returned if no such <option> is found
 */
function getOption(nodeElement, value) {
  return nodeElement.querySelector('option[value="' + value +'"]')
}

/**
 * Builds the options for province selector
 */
function buildOptions (provinceNodeElement, provinces) {
  var defaultValue = provinceNodeElement.getAttribute('data-default');

  provinces.forEach(function (option) {
    var optionElement = document.createElement('option');
    optionElement.value = option[0];
    optionElement.textContent = option[1];

    provinceNodeElement.appendChild(optionElement);
  })

  if (defaultValue && getOption(provinceNodeElement, defaultValue)) {
    provinceNodeElement.value = defaultValue;
  }
}

/**
 * Builds the province selector
 */
function buildProvince (countryNodeElement, provinceNodeElement, selectedValue) {
  var selectedOption = getOption(countryNodeElement, selectedValue);
  var provinces = JSON.parse(selectedOption.getAttribute('data-provinces'));

  provinceNodeElement.options.length = 0;

  if (provinces.length) {
    buildOptions(provinceNodeElement, provinces)
  }

  return provinces;
}

;// CONCATENATED MODULE: ./source/scripts/sections/Cart.js
function Cart_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Cart_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Cart_createClass(Constructor, protoProps, staticProps) { if (protoProps) Cart_defineProperties(Constructor.prototype, protoProps); if (staticProps) Cart_defineProperties(Constructor, staticProps); return Constructor; }






var Cart = /*#__PURE__*/function () {
  function Cart(section) {
    var _this = this;

    Cart_classCallCheck(this, Cart);

    this.el = section.el;
    this.modal = new GalleryModal();
    this.events = new EventHandler/* default */.Z();
    this.tos = this.el.querySelector('[data-tos]');
    this.form = this.el.querySelector('#cart_form');
    this.rates = document.querySelector('[data-shipping-rates]');
    this.cartSubmit = this.el.querySelector('[data-cart-submit]');
    this.images = document.querySelectorAll('[data-gallery-modal]');
    this.message = document.querySelector('[data-shipping-message]');
    this.inputFields = this.el.querySelectorAll('[data-quantity-input]');
    this.zip = document.querySelector('[data-shipping-calculator-zipcode]');
    this.submit = document.querySelector('[data-shipping-calculator-submit]');
    this.response = document.querySelector('[data-shipping-calculator-response]');
    this.countrySelect = document.querySelector('[data-shipping-calculator-country]');
    this.provinceSelect = document.querySelector('[data-shipping-calculator-province]');
    this.provinceContainer = document.querySelector('[data-shipping-calculator-province-container]');
    this.quantitySelectors = [];
    this.inputFields.forEach(function (input) {
      _this.quantitySelectors.push(new QuantitySelector({
        quantityField: input.parentNode,
        onChange: function onChange() {
          return _this.form.submit();
        }
      }));
    });
    this.events.register(this.cartSubmit, 'click', function () {
      if (_this.tos.length) {
        if (_this.tos.checked === true) {
          _this.form.submit();
        } else {
          alert(Shopify.translation.agree_to_terms_warning);
        }
      } else {
        _this.form.submit();
      }
    });

    if (this.images.length > 0) {
      this.initModal();
    }

    if (Shopify.theme_settings.shipping_calculator) {
      this.buildCalculator();
    }
  }

  Cart_createClass(Cart, [{
    key: "initModal",
    value: function initModal() {
      var _this2 = this;

      this.images.forEach(function (image, selectedIndex) {
        var href = image.href,
            dataset = image.dataset;
        var item = {
          src: href,
          w: dataset.imageWidth,
          h: dataset.imageHeight
        };

        _this2.imageArray.push(item);

        _this2.events.register(image, 'click', function (e) {
          e.preventDefault();

          _this2.modal.init(_this2.imageArray, selectedIndex);
        });
      });
    }
  }, {
    key: "buildCalculator",
    value: function buildCalculator() {
      var _this3 = this;

      this.shippingCountryProvinceSelector = new CountryProvinceSelector(this.countrySelect.innerHTML);
      this.shippingCountryProvinceSelector.build(this.countrySelect, this.provinceSelect, {
        onCountryChange: function onCountryChange(provinces) {
          if (provinces.length) {
            _this3.provinceContainer.style.display = 'block';
          } else {
            _this3.provinceContainer.style.display = 'none';
          } // "Province", "State", "Region", etc. and "Postal Code", "ZIP Code", etc.
          // Even countries without provinces include a label.


          var _window$Countries$_th = window.Countries[_this3.countrySelect.value],
              label = _window$Countries$_th.label,
              zipLabel = _window$Countries$_th.zip_label;
          _this3.provinceContainer.querySelector('label[for="address_province"]').innerHTML = label;
          _this3.el.querySelector('label[for="address_zip"]').innerHTML = zipLabel;
        }
      });
      this.events.register(this.submit, 'click', function (e) {
        e.preventDefault();

        _this3.getRates();
      });
    }
  }, {
    key: "getRates",
    value: function getRates() {
      var _this4 = this;

      var shippingAddress = {};
      shippingAddress.country = this.countrySelect ? this.countrySelect.value : '';
      shippingAddress.province = this.provinceSelect ? this.provinceSelect.value : '';
      shippingAddress.zip = this.zip ? this.zip.value : '';
      var queryString = Object.keys(shippingAddress).map(function (key) {
        return "".concat(encodeURIComponent("shipping_address[".concat(key, "]")), "=").concat(encodeURIComponent(shippingAddress[key]));
      }).join('&');
      fetch("".concat(Shopify.routes.cart_url, "/shipping_rates.json?").concat(queryString)).then(function (response) {
        return response.json();
      }).then(function (data) {
        return _this4.displayRates(data);
      });
    }
  }, {
    key: "displayRates",
    value: function displayRates(rates) {
      var _this5 = this;

      var propertyName = Object.keys(rates);
      this.clearRates();

      if (propertyName[0] === 'shipping_rates') {
        rates.shipping_rates.forEach(function (rate) {
          var rateLi = document.createElement('li');
          rateLi.innerHTML = "".concat(rate.name, ": ").concat(_this5.formatPrice(rate.price));

          _this5.rates.appendChild(rateLi);
        });

        if (rates.length > 1) {
          this.message.innerHTML = "".concat(Shopify.translation.additional_rates_part_1, " ").concat(rates.length, " ").concat(Shopify.translation.additional_rates_part_2, " ").concat(this.zip.value, ", ").concat(this.provinceSelect.value, ", ").concat(this.countrySelect.value, ", ").concat(Shopify.translation.additional_rates_part_3, " ").concat(this.formatPrice(rates[0].price));
        } else {
          this.message.innerHTML = "".concat(Shopify.translation.additional_rate, " ").concat(this.zip.value, ", ").concat(this.provinceSelect.value, ", ").concat(this.countrySelect.value, ", ").concat(Shopify.translation.additional_rate_at, " ").concat(this.formatPrice(rates.shipping_rates[0].price));
        }

        this.response.classList.add('shipping-rates--display-rates');
      } else {
        this.message.innerHTML = "Error: ".concat(propertyName[0], " ").concat(rates[propertyName[0]]);
        this.response.classList.add('shipping-rates--display-error');
      }
    }
  }, {
    key: "clearRates",
    value: function clearRates() {
      this.response.classList.remove('shipping-rates--display-error', 'shipping-rates--display-rates');
      this.message.innerHTML = '';
      this.rates.innerHTML = '';
    }
  }, {
    key: "formatPrice",
    value: function formatPrice(price) {
      var formattedPrice;

      if (Currency.display_format === 'money_with_currency_format') {
        formattedPrice = "<span class=\"money\">".concat(Currency.symbol).concat(price, " ").concat(Currency.iso_code, "</span>");
      } else {
        formattedPrice = "<span class=\"money\">".concat(Currency.symbol).concat(price, "</span>");
      }

      return formattedPrice;
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events.unregisterAll();
      this.quantitySelectors.forEach(function (selector) {
        return selector.unload();
      });
    }
  }]);

  return Cart;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/Footer.js
function Footer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Footer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Footer_createClass(Constructor, protoProps, staticProps) { if (protoProps) Footer_defineProperties(Constructor.prototype, protoProps); if (staticProps) Footer_defineProperties(Constructor, staticProps); return Constructor; }





var Footer_Header = /*#__PURE__*/function () {
  function Header(section) {
    var _this = this;

    Footer_classCallCheck(this, Header);

    this.el = section.el;
    this.data = section.data;
    this.headings = this.el.querySelectorAll('[data-toggle-content]');
    this.events = new EventHandler/* default */.Z(); // Currency and Language selectors

    this.currencyDisclosureEl = this.el.querySelector('[data-disclosure-currency]');
    this.localeDisclosureEl = this.el.querySelector('[data-disclosure-locale]');
    this.disclosures = [];

    if (this.currencyDisclosureEl) {
      this.disclosures.push(new shopify_cross_border_dist_index_es(this.currencyDisclosureEl));
    }

    if (this.localeDisclosureEl) {
      this.disclosures.push(new shopify_cross_border_dist_index_es(this.localeDisclosureEl));
    }

    this.headings.forEach(function (heading) {
      var parent = heading.parentNode;
      var content = parent.querySelector('[data-content]');
      var animateContent = transition({
        el: content,
        state: 'closed'
      });

      _this.events.register(heading, 'click', function () {
        _this.toggleContent(parent, animateContent);
      });
    });
  }

  Footer_createClass(Header, [{
    key: "toggleContent",
    value: function toggleContent(parent, animateContent) {
      if (parent.classList.contains('active')) {
        animateContent.animateTo('closed');
        parent.classList.remove('active');
      } else {
        animateContent.animateTo('open');
        parent.classList.add('active');
      }
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events.unregisterAll();
      this.disclosures.forEach(function (disclosure) {
        return disclosure.unload();
      });
    }
  }]);

  return Header;
}();


;// CONCATENATED MODULE: ./source/scripts/components/NavMobileFilters.js
function NavMobileFilters_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NavMobileFilters_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NavMobileFilters_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavMobileFilters_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavMobileFilters_defineProperties(Constructor, staticProps); return Constructor; }






var NavMobileFilters = /*#__PURE__*/function () {
  function NavMobileFilters(_ref) {
    var _this = this;

    var controls = _ref.controls,
        mobileNav = _ref.mobileNav;

    NavMobileFilters_classCallCheck(this, NavMobileFilters);

    this.controls = controls;
    this.mobileNav = mobileNav;

    if (!this.mobileNav) {
      return;
    }

    this.mobileTrigger = this.controls.querySelector('[data-mobile-filters-button]');
    this.closeButton = this.mobileNav.querySelector('[data-mobile-nav-close]');
    this.mainFlyout = this.mobileNav.querySelector('[data-mobile-main-flyout]');
    this.overlay = this.mobileNav.querySelector('[data-mobile-overlay]');
    this.events = new EventHandler/* default */.Z();
    this.flyoutAnimation = transition({
      el: this.mainFlyout,
      state: 'closed'
    });
    this.overlayAnimation = transition({
      el: this.overlay,
      state: 'closed'
    });

    this.closeEsc = function (e) {
      if (e.key === 'Escape') {
        _this.close();
      }
    };

    this.events.register(this.mobileTrigger, 'click', function () {
      return _this.open();
    });
    this.events.register(this.closeButton, 'click', function () {
      return _this.close();
    });
    this.events.register(this.overlay, 'click', function () {
      return _this.close();
    });
  }

  NavMobileFilters_createClass(NavMobileFilters, [{
    key: "open",
    value: function open() {
      var _this2 = this;

      ScrollLock.lock(this.mobileNav);
      this.closeEvent = this.events.register(window, 'keydown', function (e) {
        return _this2.closeEsc(e);
      });
      this.mobileNav.dataset.open = true;
      this.flyoutAnimation.animateTo('open');
      this.overlayAnimation.animateTo('open');
      this.mobileNav.focus();
      trapFocus(this.mobileNav);
    }
  }, {
    key: "close",
    value: function close() {
      var _this3 = this;

      ScrollLock.unlock();
      removeTrapFocus(this.mobileNav);
      this.mobileTrigger.focus();
      this.events.unregister(this.closeEvent);
      this.flyoutAnimation.animateTo('closed');
      this.overlayAnimation.animateTo('closed').then(function () {
        _this3.mobileNav.dataset.open = false;
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      this.flyoutAnimation.animateTo('closed', {
        force: true
      });
      this.overlayAnimation.animateTo('closed', {
        force: true
      });
      this.flyoutAnimation.unload();
      this.overlayAnimation.unload();
      this.events.unregisterAll();
    }
  }]);

  return NavMobileFilters;
}();


;// CONCATENATED MODULE: ./source/scripts/pages/Collection.js
function pages_Collection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function pages_Collection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function pages_Collection_createClass(Constructor, protoProps, staticProps) { if (protoProps) pages_Collection_defineProperties(Constructor.prototype, protoProps); if (staticProps) pages_Collection_defineProperties(Constructor, staticProps); return Constructor; }







var CollectionPage = /*#__PURE__*/function () {
  function CollectionPage(section) {
    var _this = this;

    pages_Collection_classCallCheck(this, CollectionPage);

    this.el = section.el;
    this.settings = section.data;
    this.events = new EventHandler/* default */.Z();
    this.collectionFilters = this.el.querySelector('[data-collection-filters]');
    this.sortByDisclosureEl = this.el.querySelector('[data-sort-by-disclosure]');
    this.sidebarEl = this.el.querySelector('[data-sidebar-top]');
    this.sidebarBottomEl = this.el.querySelector('[data-sidebar-bottom]');
    this.mobileFiltersMenu = this.el.querySelector('[data-mobile-filters]');
    this.productList = this.el.querySelectorAll('[data-product-thumbnail]'); // We need to initialize 2 sidebars because on desktop the normal sidebar is used,
    // and on mobile, if a bottom sidebar is used, we have it there.
    // The sidebar class determines if the sidebar exists.

    this.sidebar = new Sidebar(this.sidebarEl);
    this.sidebarBottom = new Sidebar(this.sidebarBottomEl);
    this.mobileFilters = new NavMobileFilters({
      controls: this.collectionFilters,
      mobileNav: this.mobileFiltersMenu
    });
    this.productThumbnails = [];
    var thumbnailSettings = {
      showSecondaryMediaOnHover: this.settings.show_secondary_media
    };
    this.productList.forEach(function (product) {
      _this.productThumbnails.push(new ProductThumbnail(product, thumbnailSettings));
    });

    if (this.sidebarEl) {
      // This is added to set the top margin of the sidebar so that it is aligned with the content.
      this.sidebarEl.style.setProperty('--filter-bar-height', "".concat(this.collectionFilters.offsetHeight, "px"));
    }

    if (this.sortByDisclosureEl) {
      this.sortByDisclosure = new shopify_cross_border_dist_index_es(this.sortByDisclosureEl);
    }
  }

  pages_Collection_createClass(CollectionPage, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events.unregisterAll();
      this.sidebar.unload();
      this.sidebarBottom.unload();
      this.mobileFilters.unload();
      this.productThumbnails.forEach(function (product) {
        return product.unload();
      });

      if (this.sortByDisclosure) {
        this.sortByDisclosure.unload();
      }
    }
  }]);

  return CollectionPage;
}();


;// CONCATENATED MODULE: ./source/scripts/pages/Blog.js
function Blog_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Blog_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Blog_createClass(Constructor, protoProps, staticProps) { if (protoProps) Blog_defineProperties(Constructor.prototype, protoProps); if (staticProps) Blog_defineProperties(Constructor, staticProps); return Constructor; }



var BlogPage = /*#__PURE__*/function () {
  function BlogPage(section) {
    Blog_classCallCheck(this, BlogPage);

    this.el = section.el;
    this.data = section.data;
    this.sidebarTopEl = this.el.querySelector('[data-sidebar-top]');
    this.sidebarBottomEl = this.el.querySelector('[data-sidebar-bottom]');
    this.sidebarTop = new Sidebar(this.sidebarTopEl);
    this.sidebarBottom = new Sidebar(this.sidebarBottomEl);
  }

  Blog_createClass(BlogPage, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.sidebarTop.unload();
      this.sidebarBottom.unload();
    }
  }]);

  return BlogPage;
}();


;// CONCATENATED MODULE: ./source/scripts/pages/Article.js
function Article_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Article_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Article_createClass(Constructor, protoProps, staticProps) { if (protoProps) Article_defineProperties(Constructor.prototype, protoProps); if (staticProps) Article_defineProperties(Constructor, staticProps); return Constructor; }



var ArticlePage = /*#__PURE__*/function () {
  function ArticlePage(section) {
    Article_classCallCheck(this, ArticlePage);

    this.el = section.el;
    this.data = section.data;
    this.sidebarTopEl = this.el.querySelector('[data-sidebar-top]');
    this.sidebarBottomEl = this.el.querySelector('[data-sidebar-bottom]');
    this.sidebarTop = new Sidebar(this.sidebarTopEl);
    this.sidebarBottom = new Sidebar(this.sidebarBottomEl);
  }

  Article_createClass(ArticlePage, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.sidebarTop.unload();
      this.sidebarBottom.unload();
    }
  }]);

  return ArticlePage;
}();


;// CONCATENATED MODULE: ./source/scripts/pages/Search.js
function Search_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Search_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Search_createClass(Constructor, protoProps, staticProps) { if (protoProps) Search_defineProperties(Constructor.prototype, protoProps); if (staticProps) Search_defineProperties(Constructor, staticProps); return Constructor; }




var Search = /*#__PURE__*/function () {
  function Search(section) {
    var _this = this;

    Search_classCallCheck(this, Search);

    this.el = section.el;
    this.settings = section.data;
    this.productThumbnailsElements = this.el.querySelectorAll('[data-product-thumbnail]');
    this.productThumbnails = [];
    var thumbnailSettings = {
      showSecondaryMediaOnHover: this.settings.show_secondary_media
    };
    this.sidebar = new Sidebar(this.el);
    this.productThumbnailsElements.forEach(function (productThumbnail) {
      _this.productThumbnails.push(new ProductThumbnail(productThumbnail, thumbnailSettings));
    });
  }

  Search_createClass(Search, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.sidebar.unload();
      this.productThumbnails.forEach(function (productThumbnail) {
        return productThumbnail.unload();
      });
    }
  }]);

  return Search;
}();


;// CONCATENATED MODULE: ./source/scripts/pages/StaticPage.js
function StaticPage_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticPage_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticPage_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticPage_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticPage_defineProperties(Constructor, staticProps); return Constructor; }



var StaticPage = /*#__PURE__*/function () {
  function StaticPage(section) {
    StaticPage_classCallCheck(this, StaticPage);

    this.el = section.el;
    this.data = section.data;
    this.sidebarEl = this.el.querySelector('[data-sidebar]');
    this.sidebar = new Sidebar(this.sidebarEl);
  }

  StaticPage_createClass(StaticPage, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.sidebar.unload();
    }
  }]);

  return StaticPage;
}();


;// CONCATENATED MODULE: ./source/scripts/components/PredictiveSearch.js
function PredictiveSearch_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function PredictiveSearch_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function PredictiveSearch_createClass(Constructor, protoProps, staticProps) { if (protoProps) PredictiveSearch_defineProperties(Constructor.prototype, protoProps); if (staticProps) PredictiveSearch_defineProperties(Constructor, staticProps); return Constructor; }






var PredictiveSearch = /*#__PURE__*/function () {
  function PredictiveSearch() {
    var _this = this;

    PredictiveSearch_classCallCheck(this, PredictiveSearch);

    if (document.body.dataset.predictiveSearch === 'false') return;
    this.events = new EventHandler/* default */.Z();
    this.searchOverlay = document.querySelector('[data-search-overlay]');
    this.search = document.querySelector('[data-search]');
    this.searchForm = document.querySelector('[data-search-form]');
    this.resultsWrapper = document.querySelector('[data-results-wrapper]');
    this.searchMessage = document.querySelector('[data-predictive-search-message]');
    this.searchType = document.querySelector('[data-search-type]').value;
    this.searchTerms = document.querySelector('[data-search-terms]');
    this.productSearchLink = document.querySelector('[data-product-search-link]');
    this.openSearchButtons = document.querySelectorAll('[data-search-open]');
    this.closeSearchButton = document.querySelector('[data-close-search]');
    this.productSearchResults = document.querySelector('[data-product-search-results]');
    this.trigger = null;
    this.timer = null;
    this.getResults = this.getResults.bind(this);
    this.animateSearchOverlay = transition({
      el: this.searchOverlay,
      state: 'closed'
    });
    this.animateSearch = transition({
      el: this.search,
      state: 'closed'
    });

    if (document.querySelector('[data-side-search-results]')) {
      this.sideSearchLink = document.querySelector('[data-side-search-link]');
      this.sideSearchResults = document.querySelector('[data-side-search-results]');
    }

    this.openSearchButtons.forEach(function (openButton) {
      _this.events.register(openButton, 'click', function (e) {
        e.preventDefault();

        _this.openSearch();

        _this.trigger = openButton;
      });
    });
    this.events.register(this.searchOverlay, 'click', function (e) {
      if (e.target.classList.contains('predictive-search__overlay')) {
        _this.closeSearch();
      }
    });
    this.events.register(this.closeSearchButton, 'click', function (e) {
      e.preventDefault();

      _this.closeSearch();
    });

    this._closeEsc = function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation();

        _this.closeSearch();
      }
    };
  }

  PredictiveSearch_createClass(PredictiveSearch, [{
    key: "openSearch",
    value: function openSearch() {
      var _this2 = this;

      this.searchOverlay.classList.add('predictive-search__overlay--active');
      this.animateSearchOverlay.animateTo('open');
      this.animateSearch.animateTo('open').then(function () {
        trapFocus(_this2.search);

        _this2.searchTerms.focus();
      });
      this.events.register(this.searchTerms, 'keyup', function (e) {
        clearTimeout(_this2.timer);

        if (_this2.searchTerms.value.length >= 2 && e.keyCode !== 9) {
          // Check if word greater than 2 letters and we are not trying to tab
          _this2.timer = setTimeout(_this2.getResults, 300);
        } else if (_this2.searchTerms.value === '') {
          _this2.clearResults();
        }
      });
      this.closeEscEvent = this.events.register(window, 'keydown', function (e) {
        return _this2._closeEsc(e);
      });
    }
  }, {
    key: "closeSearch",
    value: function closeSearch() {
      var _this3 = this;

      this.events.unregister(this.searchOverlay);
      this.events.unregister(this.searchTerms);
      this.events.unregister(this.closeEscEvent);
      this.clearResults();
      this.resultsWrapper.classList.remove('predictive-search__results--show');
      this.animateSearch.animateTo('closed');
      this.animateSearchOverlay.animateTo('closed').then(function () {
        _this3.searchOverlay.classList.remove('predictive-search__overlay--active');

        _this3.searchTerms.value = '';
        ScrollLock.unlock();
        removeTrapFocus(_this3.search);

        _this3.trigger.focus();
      });
    }
  }, {
    key: "getResults",
    value: function getResults() {
      var _this4 = this;

      fetch("".concat(Shopify.routes.search_url, "/suggest.json?q=").concat(this.searchTerms.value, "&resources[type]=").concat(this.searchType, "&resources[limit]=5&resources[options][unavailable_products]=last&resources[options][fields]=title,body,variants.title,vendor,product_type,tag")).then(function (response) {
        return response.json();
      }).then(function (suggestions) {
        var results = suggestions.resources.results;
        var products = results.products,
            articles = results.articles,
            pages = results.pages;

        _this4.clearResults();

        _this4.resultsWrapper.classList.add('predictive-search__results--show');

        ScrollLock.lock(_this4.resultsWrapper);

        if ((products === null || products === void 0 ? void 0 : products.length) > 0 || (articles === null || articles === void 0 ? void 0 : articles.length) > 0 || (pages === null || pages === void 0 ? void 0 : pages.length) > 0) {
          _this4.displayResults(products, articles, pages);

          _this4.setLinks();
        } else {
          _this4.noResults();
        }
      });
    }
  }, {
    key: "clearResults",
    value: function clearResults() {
      this.resultsWrapper.classList.remove('predictive-search__results--show');

      while (this.searchMessage.firstChild) {
        this.searchMessage.removeChild(this.searchMessage.firstChild);
      }

      while (this.productSearchResults.firstChild) {
        this.productSearchResults.removeChild(this.productSearchResults.firstChild);
      }

      if (this.sideSearchResults) {
        while (this.sideSearchResults.firstChild) {
          this.sideSearchResults.removeChild(this.sideSearchResults.firstChild);
        }
      }
    }
  }, {
    key: "noResults",
    value: function noResults() {
      this.resultsWrapper.classList.add('predictive-search__results-no-results');
      var noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = "".concat(Shopify.translation.your_search, " \"").concat(this.searchTerms.value, "\" ").concat(Shopify.translation.no_match);
      this.searchMessage.appendChild(noResultsMessage);
      this.searchMessage.classList.add('predictive-search__message--show');
      removeTrapFocus(this.search);
      trapFocus(this.search);
      this.searchTerms.focus();
    }
  }, {
    key: "displayResults",
    value: function displayResults(products, articles, pages) {
      var productLimit;
      this.resultsWrapper.classList.remove('predictive-search__results-no-results');
      this.searchMessage.classList.remove('predictive-search__message--show');

      if (this.resultsWrapper.classList.contains('predictive-search__results--everything')) {
        productLimit = 4;
      } else {
        productLimit = 5;
      }

      this.displayProducts(products, productLimit);

      if (this.sideSearchResults) {
        if (articles.length > 0 || pages.length) {
          this.displayArticles(articles);
          this.displayPages(pages);
          this.sideSearchLink.style.display = 'block';
        } else {
          var noResultsMessage = document.createElement('li');
          noResultsMessage.textContent = Shopify.translation.no_results;
          this.sideSearchResults.appendChild(noResultsMessage);
          this.sideSearchLink.style.display = 'none';
        }
      }

      removeTrapFocus(this.search);
      trapFocus(this.search);
      this.searchTerms.focus();
    }
  }, {
    key: "displayProducts",
    value: function displayProducts(products, productLimit) {
      var _this5 = this;

      if (products.length > 0) {
        products.slice(-productLimit).forEach(function (product) {
          // using slice to ensure we limit the amount of results being looped
          var productResult = document.createElement('div');
          var title = product.title,
              image = product.image,
              url = product.url;
          productResult.classList.add('search-results__product');
          productResult.innerHTML = "\n          <a tabindex=\"0\" class=\"search-results__product-wrapper\" href=\"".concat(url, "\">\n            <img src=\"").concat(_this5.imageDimension(image, '_600x'), "\" />\n            <div>\n              <span class=\"product-thumbnail__title\">").concat(title, "</span>\n              ").concat(_this5.displayPrice(product), "\n            </div>\n          </a>\n        ");

          _this5.productSearchResults.appendChild(productResult);
        });
        this.productSearchLink.style.display = 'block';
      } else {
        var noResultsMessage = document.createElement('p');
        noResultsMessage.classList.add('no-results');
        noResultsMessage.textContent = Shopify.translation.no_results;
        this.productSearchResults.appendChild(noResultsMessage);
        this.productSearchLink.style.display = 'none';
      }
    }
  }, {
    key: "displayArticles",
    value: function displayArticles(articles) {
      var _this6 = this;

      articles.slice(-3).forEach(function (article) {
        // using slice to ensure we limit the amount of results being looped
        var articleResult = document.createElement('li');
        var title = article.title,
            url = article.url;
        articleResult.classList.add('search-results__side');
        articleResult.innerHTML = "\n        <a tabindex=\"0\" href=\"".concat(url, "\">\n          ").concat(title, "\n        </a>\n      ");

        _this6.sideSearchResults.appendChild(articleResult);
      });
    }
  }, {
    key: "displayPages",
    value: function displayPages(pages) {
      var _this7 = this;

      pages.slice(-3).forEach(function (page) {
        // using slice to ensure we limit the amount of results being looped
        var pageResult = document.createElement('li');
        var title = page.title,
            url = page.url;
        pageResult.classList.add('search-results__side');
        pageResult.innerHTML = "\n        <a tabindex=\"0\" href=\"".concat(url, "\">\n          ").concat(title, "\n        </a>\n      ");

        _this7.sideSearchResults.appendChild(pageResult);
      });
    }
  }, {
    key: "setLinks",
    value: function setLinks() {
      this.productSearchLink.setAttribute('href', "".concat(Shopify.routes.search_url, "?type=product&q=").concat(this.searchTerms.value));

      if (this.sideSearchLink) {
        this.sideSearchLink.setAttribute('href', "".concat(Shopify.routes.search_url, "?type=page%2Carticle&q=").concat(this.searchTerms.value));
      }
    }
  }, {
    key: "displayPrice",
    value: function displayPrice(product) {
      var price;

      if (product.available === true) {
        if (product.compare_at_price_max > product.price_max || product.compare_at_price_min > product.price_min) {
          // eslint-disable-line
          price = "<span class=\"product-thumbnail__price product__sale-price\">".concat(this.formatPrice(product.price), " <span class=\"product__compare-price\">").concat(this.formatPrice(product.compare_at_price_max), "</span></span>");
        } else if (product.price > 0 && product.price_min !== product.price_max) {
          price = "<span class=\"product-thumbnail__price\">".concat(Shopify.translation.product_from, " ").concat(this.formatPrice(product.price), "</span>");
        } else if (product.price > 0 && product.price_min === product.price_max) {
          price = "<span class=\"product-thumbnail__price\">".concat(this.formatPrice(product.price), "</span>");
        } else {
          price = "<span class=\"product-thumbnail__price\">".concat(Shopify.theme_settings.free_text, "</span>");
        }
      } else {
        price = "<span class=\"product-thumbnail__price\">".concat(Shopify.translation.product_sold_out, "</span>");
      }

      return price;
    }
  }, {
    key: "formatPrice",
    value: function formatPrice(price) {
      var formattedPrice;

      if (Currency.display_format === 'money_with_currency_format') {
        formattedPrice = "<span class=\"money\">".concat(Currency.symbol).concat(price, " ").concat(Currency.iso_code, "</span>");
      } else {
        formattedPrice = "<span class=\"money\">".concat(Currency.symbol).concat(price, "</span>");
      }

      return formattedPrice;
    }
  }, {
    key: "imageDimension",
    value: function imageDimension(url, size) {
      if (url !== null) {
        var insertPosition = url.lastIndexOf('.');
        return url.substring(0, insertPosition) + size + url.substring(insertPosition);
      }

      return '';
    }
  }]);

  return PredictiveSearch;
}();


// EXTERNAL MODULE: ./node_modules/form-serialize/index.js
var form_serialize = __webpack_require__(422);
var form_serialize_default = /*#__PURE__*/__webpack_require__.n(form_serialize);
;// CONCATENATED MODULE: ./source/scripts/components/CartDrawer.js
function CartDrawer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function CartDrawer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function CartDrawer_createClass(Constructor, protoProps, staticProps) { if (protoProps) CartDrawer_defineProperties(Constructor.prototype, protoProps); if (staticProps) CartDrawer_defineProperties(Constructor, staticProps); return Constructor; }










var CartDrawer = /*#__PURE__*/function () {
  function CartDrawer() {
    var _this = this;

    CartDrawer_classCallCheck(this, CartDrawer);

    this.events = new EventHandler/* default */.Z();
    this.overlay = document.querySelector('[data-cart-overlay]');
    this.drawer = document.querySelector('[data-cart-drawer]');
    this.atcButtons = document.querySelectorAll('[data-product-atc]');
    this.cartCount = document.querySelector('[data-header-cart-count]');
    this.trigger = null;

    if (this.atcButtons) {
      this.atcButtons.forEach(function (button) {
        _this.events.register(button, 'click', function (e) {
          var incompleteForm = button.closest('.product-form--error-option-unselected');
          if (incompleteForm) return;
          e.preventDefault();
          _this.trigger = button;

          _this.addItem(button);
        });
      });
    }

    document.body.addEventListener('quickshop-add', function (e) {
      var incompleteForm = e.target.closest('.product-form--error-option-unselected');
      if (incompleteForm) return;

      _this.addItem(e.target);

      var quickshopProductURL = e.target.closest('[data-product-url]').dataset.productUrl;
      _this.trigger = document.querySelector("[data-reference-url=\"".concat(quickshopProductURL, "\"]"));
    });

    this._closeEsc = function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation();

        _this.closeDrawer();
      }
    };

    this.loadDrawer();
  }

  CartDrawer_createClass(CartDrawer, [{
    key: "updateCartCount",
    value: function updateCartCount(itemCount) {
      this.cartCount.innerHTML = itemCount;
    }
  }, {
    key: "addItem",
    value: function addItem(button) {
      var _this2 = this;

      var atcButton = button;
      var buttonForm = button.form;
      var formData = form_serialize_default()(buttonForm, {
        hash: true
      });
      atcButton.classList.add('cart-drawer--loading');
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }).then(function (response) {
        return response.json();
      }).then(function () {
        _this2.loadDrawer(true, atcButton);
      });
    }
  }, {
    key: "removeItem",
    value: function removeItem(line) {
      var _this3 = this;

      fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: 0,
          line: line
        })
      }).then(function (response) {
        return response.json();
      }).then(function () {
        _this3.loadDrawer();
      });
    }
  }, {
    key: "updateItem",
    value: function updateItem(line, quantity) {
      var _this4 = this;

      fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: quantity,
          line: line
        })
      }).then(function (response) {
        return response.json();
      }).then(function () {
        _this4.loadDrawer();
      });
    }
  }, {
    key: "loadDrawer",
    value: function loadDrawer() {
      var _this5 = this;

      var forceOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var atcButton = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      shopify_asyncview_dist_index_es.load('/cart', {
        view: '_drawer'
      }).then(function (_ref) {
        var html = _ref.html,
            data = _ref.data;
        _this5.drawer.innerHTML = html.content;

        _this5.initDrawer(forceOpen);

        _this5.updateCartCount(data.item_count);

        if (atcButton !== '') {
          atcButton.classList.remove('cart-drawer--loading');
          window.modal.close();
        }
      });
    }
  }, {
    key: "initDrawer",
    value: function initDrawer(forceOpen) {
      var _this6 = this;

      dist_index_es.watch(this.drawer);
      this.drawerOpenButton = document.querySelector('[data-cart-drawer-open]');
      this.drawerCloseButton = document.querySelector('[data-cart-drawer-close]');
      this.inputFields = this.drawer.querySelectorAll('[data-quantity-input]');
      this.removeButtons = this.drawer.querySelectorAll('[data-remove-item]');
      this.animateOverlay = transition({
        el: this.overlay,
        state: 'closed'
      });
      this.animateDrawer = transition({
        el: this.drawer,
        state: 'closed'
      });
      this.quantitySelectors = [];
      this.inputFields.forEach(function (input) {
        _this6.quantitySelectors.push(new QuantitySelector({
          quantityField: input.parentNode,
          onChange: function onChange() {
            var lineID = input.dataset.lineId;
            var quantity = input.value;

            _this6.updateItem(lineID, quantity);
          }
        }));
      });
      this.removeButtons.forEach(function (button) {
        _this6.events.register(button, 'click', function (e) {
          e.preventDefault();

          _this6.removeItem(button.dataset.removeItem);
        });
      });
      this.events.register(this.drawerOpenButton, 'click', function (e) {
        e.preventDefault();

        _this6.openDrawer();

        _this6.trigger = _this6.drawerOpenButton;
      });
      this.events.register(this.drawerCloseButton, 'click', function (e) {
        e.preventDefault();

        _this6.closeDrawer();
      });
      this.events.register(this.overlay, 'click', function (e) {
        if (e.target.classList.contains('cart-drawer__overlay')) {
          _this6.closeDrawer();
        }
      });

      if (forceOpen === true) {
        this.openDrawer();
      }
    }
  }, {
    key: "openDrawer",
    value: function openDrawer() {
      var _this7 = this;

      ScrollLock.lock(this.drawer);
      this.overlay.classList.add('active');
      this.animateOverlay.animateTo('open');
      this.animateDrawer.animateTo('open').then(function () {
        _this7.closeEscEvent = _this7.events.register(window, 'keydown', function (e) {
          return _this7._closeEsc(e);
        });
        trapFocus(_this7.drawer);
      });
    }
  }, {
    key: "closeDrawer",
    value: function closeDrawer() {
      var _this8 = this;

      ScrollLock.unlock();
      removeTrapFocus(this.drawer);
      this.events.unregister(this.drawerCloseButton);
      this.events.unregister(this.overlay);
      this.events.unregister(this.closeEscEvent);
      this.animateOverlay.animateTo('closed');
      this.animateDrawer.animateTo('closed').then(function () {
        _this8.overlay.classList.remove('active');

        _this8.trigger.focus();
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      this.quantitySelectors.forEach(function (selector) {
        return selector.unload();
      });
    }
  }]);

  return CartDrawer;
}();


;// CONCATENATED MODULE: ./source/scripts/components/Modal.js
function Modal_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Modal_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Modal_createClass(Constructor, protoProps, staticProps) { if (protoProps) Modal_defineProperties(Constructor.prototype, protoProps); if (staticProps) Modal_defineProperties(Constructor, staticProps); return Constructor; }





var Modal = /*#__PURE__*/function () {
  function Modal() {
    var _this = this;

    Modal_classCallCheck(this, Modal);

    this.modal = document.querySelector('[data-modal]');

    if (!this.modal) {
      return;
    }

    this.overlay = this.modal.querySelector('[data-modal-overlay]');
    this.closeButton = this.modal.querySelector('[data-modal-close]');
    this.modalWindow = this.modal.querySelector('[data-modal-window]');
    this.modalContent = this.modal.querySelector('[data-modal-content]');

    if (!this.modalContent) {
      return;
    }

    this.events = new EventHandler/* default */.Z();
    this.initialContent = this.modalContent.firstElementChild;
    this.trigger = null;
    this.classname = null;
    this.open = this.open.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.close = this.close.bind(this);
    this.events.register(this.closeButton, 'click', function () {
      return _this.close();
    });
    this.events.register(this.overlay, 'click', function () {
      return _this.close();
    });

    this._closeEsc = function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation();

        _this.close();
      }
    };
  }

  Modal_createClass(Modal, [{
    key: "open",
    value: function open(options) {
      var _this2 = this;

      var content = options.content,
          trigger = options.trigger,
          classname = options.classname,
          onClose = options.onClose;
      var newContent = content || this.initialContent;
      this.trigger = trigger;

      if (classname) {
        this.classname = classname;
        this.modal.classList.add(classname);
      }

      this.onClose = onClose;
      this.modal.dataset.open = 'true';
      this.modalWindow.focus();
      this.updateContent(newContent);
      ScrollLock.lock(this.modalWindow);
      this.closeEscEvent = this.events.register(window, 'keydown', function (e) {
        return _this2._closeEsc(e);
      });
    }
  }, {
    key: "updateContent",
    value: function updateContent(content) {
      // Empty current content
      this.modalContent.innerHTML = ''; // Append updated content

      this.modalContent.appendChild(content);
      trapFocus(this.modalWindow);
    }
  }, {
    key: "close",
    value: function close() {
      removeTrapFocus(this.modalWindow);
      ScrollLock.unlock();

      if (this.closeEscEvent) {
        this.events.unregister(this.closeEscEvent);
      }

      this.modal.classList.remove(this.classname);

      if (this.trigger) {
        this.trigger.focus();
      }

      if (this.onClose) {
        this.onClose();
      }

      this.modal.dataset.open = 'false';
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();
    }
  }]);

  return Modal;
}();


;// CONCATENATED MODULE: ./source/scripts/components/NewsletterPopup.js
function NewsletterPopup_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function NewsletterPopup_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function NewsletterPopup_createClass(Constructor, protoProps, staticProps) { if (protoProps) NewsletterPopup_defineProperties(Constructor.prototype, protoProps); if (staticProps) NewsletterPopup_defineProperties(Constructor, staticProps); return Constructor; }




var NewsletterPopup = /*#__PURE__*/function () {
  function NewsletterPopup() {
    var _this = this;

    NewsletterPopup_classCallCheck(this, NewsletterPopup);

    this.events = new EventHandler/* default */.Z();
    this.popup = document.querySelector('[data-popup-opened]');
    this.popupCloseBtn = document.querySelector('[data-popup-close]');
    this.delay = Shopify.theme_settings.newsletter_popup_seconds * 1000;
    this.days = parseInt(Shopify.theme_settings.newsletter_popup_days, 10);
    this.animatePopup = transition({
      el: this.popup,
      state: 'closed'
    });

    if (this.getCookie() === -1) {
      setTimeout(function () {
        _this.popup.dataset.popupOpened = true;

        _this.animatePopup.animateTo('open');
      }, this.delay);
    }

    this.events.register(this.popupCloseBtn, 'click', function () {
      _this.popup.dataset.popupOpened = false;

      _this.animatePopup.animateTo('closed');

      _this.setCookie();
    });

    this._closeEsc = function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        _this.popup.dataset.popupOpened = false;

        _this.animatePopup.animateTo('closed');

        _this.setCookie();
      }
    };

    this.closeEscEvent = this.events.register(window, 'keydown', function (e) {
      return _this._closeEsc(e);
    });
  }

  NewsletterPopup_createClass(NewsletterPopup, [{
    key: "setCookie",
    value: function setCookie() {
      if (this.days !== 0) {
        var date = new Date();
        date.setTime(date.getTime() + this.days * 24 * 60 * 60 * 1000);
        document.cookie = "hide-popup=true; expires=\"".concat(date.toGMTString(), "\"");
      }
    }
  }, {
    key: "getCookie",
    value: function getCookie() {
      if (this.days !== 0) {
        var cookieArray = document.cookie.split(';').map(function (item) {
          return item.trim();
        });
        return cookieArray.indexOf('hide-popup=true');
      }

      return -1;
    }
  }, {
    key: "unload",
    value: function unload() {
      if (this.events) {
        this.events.unregisterAll();
      }
    }
  }]);

  return NewsletterPopup;
}();


;// CONCATENATED MODULE: ./source/scripts/helpers/flickityTouchFix.js
// This is a helper class to fix a touch issue that came up in flickity
// on iOS devices as of version 13. It should smooth out some of the scroll
// and swipe issues that flickity is having on that version of iOS.
var flickityTouchFix = function flickityTouchFix() {
  var touchingSlider = false;
  var touchStartCoordsX = 0;

  var onTouchStart = function onTouchStart(e) {
    if (e.target.closest && e.target.closest('.flickity-slider')) {
      touchingSlider = true;
      touchStartCoordsX = e.touches[0].pageX;
    } else {
      touchingSlider = false;
    }
  };

  var onTouchMove = function onTouchMove(e) {
    if (!(touchingSlider && e.cancelable)) {
      return;
    }

    if (Math.abs(e.touches[0].pageX - touchStartCoordsX) > 10) {
      e.preventDefault();
    }
  };

  document.body.addEventListener('touchstart', onTouchStart);
  document.body.addEventListener('touchmove', onTouchMove, {
    passive: false
  });
};

/* harmony default export */ var helpers_flickityTouchFix = (flickityTouchFix);
;// CONCATENATED MODULE: ./source/scripts/Retina.js


 // Sections












 // Pages





 // Components






 // Helpers


dist_index_es.init();
new Tabs();
new Accordion();

if (Shopify.theme_settings.newsletter_popup === true) {
  new NewsletterPopup();
}

if (Shopify.theme_settings.enable_autocomplete === true) {
  new PredictiveSearch();
}

window.modal = new Modal();
var sections = new shopify_sections_manager_es();
sections.register('site-header', function (section) {
  return new Header(section);
});
sections.register('product', function (section) {
  return new Product(section);
});
sections.register('product-recommendations', function (section) {
  return new ProductRecommendations(section);
});
sections.register('map', function (section) {
  return new Map_Map(section);
});
sections.register('pxs-slideshow', function (section) {
  return new Slideshow_Slideshow(section);
});
sections.register('testimonial', function (section) {
  return new Testimonial(section);
});
sections.register('blog-posts', function (section) {
  return new BlogPosts(section);
});
sections.register('featured-collection', function (section) {
  return new FeaturedCollection(section);
});
sections.register('pxs-video', function (section) {
  return new pxs_video_dist_index_es(section);
});
sections.register('gallery', function (section) {
  return new Gallery(section);
});
sections.register('cart', function (section) {
  return new Cart(section);
});
sections.register('site-footer', function (section) {
  return new Footer_Header(section);
});
sections.register('collection-page', function (section) {
  return new CollectionPage(section);
});
sections.register('blog-page', function (section) {
  return new BlogPage(section);
});
sections.register('article-page', function (section) {
  return new ArticlePage(section);
});
sections.register('search-page', function (section) {
  return new Search(section);
});
sections.register('static-page', function (section) {
  return new StaticPage(section);
});

if (Shopify.theme_settings.cart_action_type === 'ajax') {
  new CartDrawer();
}

helpers_flickityTouchFix();
}();
/******/ })()
;
//# sourceMappingURL=retina.js.map?1622583847030