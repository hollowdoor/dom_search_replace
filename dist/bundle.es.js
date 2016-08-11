import domSearch from 'dom-search';
import isRegexp from 'is-regexp';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
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
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

function domSearchReplace(doc, pattern, replacement, options) {
    var search = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? Object.create(options) : {};
    search.all = typeof search.all === 'boolean' ? search.all : false;
    search.replaceType = getReplacementType(replacement);

    var result = domSearch(doc, pattern, options);

    if (!result.length) {
        return doc;
    }

    if (search.replaceType === 'node') {
        replaceWithNode(result[0], pattern, replacement, search);
        return doc;
    } else if (search.replaceType === 'appendTo') {
        replaceWithAppendTo(result[0], pattern, replacement, search);
        return doc;
    }

    replacement = String(replacement);

    if (!search.all) {
        replaceWithText(result[0], pattern, replacement, search);
        return doc;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = result[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var res = _step.value;

            replaceWithText(res, pattern, replacement, search);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return doc;
}

function replaceWithText(result, pattern, replacement, search) {
    var str = result.textNode.nodeValue;
    var parts = void 0,
        collect = '';

    if (sameLength(pattern, str)) {
        result.textNode.nodeValue = replacement;
        return;
    }

    if (search.all) {
        parts = str.split(pattern);
    } else {
        parts = str.split(pattern, 2);
    }

    for (var i = 0; i < parts.length; i++) {
        collect += parts[i];
        if (i < parts.length - 1) {
            collect += replacement;
        }
    }

    result.textNode.nodeValue = collect;
}

function replaceWithNode(result, pattern, replacement, search) {
    var str = result.textNode.nodeValue;

    if (sameLength(pattern, str)) {
        result.parent.replaceChild(replacement, result.textNode);
        return;
    }

    var _str$split = str.split(pattern, 2);

    var _str$split2 = slicedToArray(_str$split, 2);

    var before = _str$split2[0];
    var after = _str$split2[1];


    var frag = document.createDocumentFragment();

    frag.appendChild(document.createTextNode(before));
    frag.appendChild(replacement);
    frag.appendChild(document.createTextNode(after));

    result.parent.replaceChild(frag, result.textNode);
}

function replaceWithAppendTo(result, pattern, replacement, search) {
    var str = result.textNode.nodeValue;
    var frag = document.createDocumentFragment();

    if (sameLength(pattern, str)) {
        replacement.appendTo(frag);
    } else {
        var _str$split3 = str.split(pattern, 2);

        var _str$split4 = slicedToArray(_str$split3, 2);

        var before = _str$split4[0];
        var after = _str$split4[1];


        frag.appendChild(document.createTextNode(before));
        replacement.appendTo(frag);
        frag.appendChild(document.createTextNode(after));
    }

    result.parent.replaceChild(frag, result.textNode);
}

function getReplacementType(replacement) {
    if (isNode(replacement)) {
        return 'node';
    } else if ((typeof replacement === 'undefined' ? 'undefined' : _typeof(replacement)) === 'object' && typeof replacement.appendTo === 'function') {
        return 'appendTo';
    }
    return 'none';
}

function sameLength(pattern, str) {
    if (typeof pattern === 'string' && pattern.length === str.length) {
        return true;
    } else if (isRegexp(pattern)) {
        var match = str.match(pattern);
        if (match[0].length === str.length) {
            return true;
        }
    }

    return false;
}

function isNode(o) {
    return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === "object" ? o instanceof Node : o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string";
}

export default domSearchReplace;
//# sourceMappingURL=bundle.es.js.map
