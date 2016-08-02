import domSearch from 'dom-search';
import isRegexp from 'is-regexp';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

function domSearchReplace(doc, pattern, replacement, options) {
    var search = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? Object.create(options) : {};
    search.type = getPatternType(pattern);

    var result = domSearch(doc, pattern, options);

    if (!result.length) {
        return doc;
    }

    if (result.length === 1) {
        replaceNode(result[0], pattern, replacement, search);
    } else {
        replaceNodes(result, pattern, replacement, search);
    }

    return doc;
}

function replaceNode(result, pattern, replacement, search) {
    var str = result.textNode.nodeValue;

    if (search.type === 'string') {
        var start = str.indexOf(pattern);
        var end = start + pattern.length;
        var before = str.slice(0, start);
        var after = str.slice(end, str.length);

        if (typeof replacement === 'string') {
            result.textNode.nodeValue = before + replacement + after;
        } else {
            var frag = document.createDocumentFragment();
            frag.appendChild(document.createTextNode(before));
            frag.appendChild(replacement);
            frag.appendChild(document.createTextNode(after));
            result.parent.replaceChild(frag, result.textNode);
        }
    } else if (search.type === 'regexp') {
        result.textNode.nodeValue = str.replace(pattern, replacement);
    }
}

function replaceNodes(result, pattern, replacement, search) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = result[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var info = _step.value;

            replaceNode(info, pattern, replacement, search);
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
}

function getPatternType(pattern) {
    if (isRegexp(pattern)) {
        return 'regexp';
    }

    return typeof pattern === 'undefined' ? 'undefined' : _typeof(pattern);
}

export default domSearchReplace;
//# sourceMappingURL=bundle.es.js.map
