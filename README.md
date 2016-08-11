dom-search-replace
==================

Install
-------

`npm install --save dom-search-replace`

You might need to use *browserify*, or some other tool to use this function.

Usage
-----

```html
<body>
<div>Here is <span>previous text</span></div>
</body>
```

```javascript
const domSearchReplace = require('dom-search-replace');
//es2015
//import domSearchReplace from 'dom-search-replace';
let div = document.querySelector('#some-div');
let result = domSearchReplace(div, 'previous text', 'new text');
```

API
---

### domSearchReplace(element, search, replacement, options) -> result

`search` can be a string, or a regular expression.

`replacement` should be a string, or a DOM node.

The `replacement` value can also use the `appendTo` contract. If the `replacement` is a user space object then if it has an `appendTo` method this method will be used to insert the replacement value at the matched position.

#### options.all

Set if all occurrences of the pattern should be matched.

The default is `false` which means the pattern will only be matched once.

If the `replacement` value is a DOM node then `options.all` does nothing as nodes just get moved around when they are appended.

Warning
-------

You'll get unexpected results if you try to replace across nodes. If the string you want to replace crosses over a `<span>` for instance that string will not be replaced.

`dom-search-replace` only matches inside of a single node for replacement.

About
-----

See [dom-search](https://github.com/hollowdoor/dom_search).
