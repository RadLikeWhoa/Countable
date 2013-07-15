# Changelog

## 2.0.1 _(2013-07-13)_

- FIX: Missing parameter in `Countable.once`. (Thanks to [MrOPR](https://github.com/RadLikeWhoa/Countable/pull/18))

## 2.0.0 _(2013-05-25)_

- NEW: Countable has a new Syntax. You can now use `Countable.live`, `Countable.once`, `Countable.die` and `Countable.enabled`. Notes on upgrading is provided in the README.
- NEW: Countable can now work on multiple elements with one function call.
- FIX: Prevent a XSS bug. (Thanks to [Rob--W](https://github.com/RadLikeWhoa/Countable/pull/17))

## 1.4.2 _(2013-05-23)_

- FIX: Fix a bug where options wouldn't be applied correctly.

## 1.4.1 _(2013-05-22)_

- NEW: Added option to execute the callback only once.

## 1.4.0 _(2013-05-20)_

- NEW: Allow for an options object as the third parameter.

## 1.3.0 _(2013-05-16)_

- NEW: Countable is now available as an AMD and CommonJS module.
- FIX: Better handle `textarea` with predefined value. (Thanks to [besmithett](https://github.com/RadLikeWhoa/Countable/pull/15))

## 1.2.0 _(2013-05-02)_

- NEW: Optionally strip HTML tags. (Thanks to [craniumslows](https://github.com/RadLikeWhoa/Countable/pull/13))
- NEW: Include ucs2decode function from the [punycode](https://github.com/bestiejs/punycode.js) library to better handle special characters. (Thanks to [craniumslows](https://github.com/RadLikeWhoa/Countable/pull/13))
- IMPROVED: Better handling of punctuation.

## 1.1.1 _(2013-03-16)_

- IMPROVED: Better support for foreign languages and special characters.

## 1.1.0 _(2013-03-12)_

- NEW: Include number of characters including whitespace.
- NEW: Countable is now available on Bower.
- IMPROVED: Improve performance when counting the values.
- IMPROVED: Improve performance when trimming strings by using `String::trim` when available.
- IMPROVED: Better documentation.

## 1.0.0 _(2013-03-11)_

- Initial release