
<!-- TITLE/ -->

# Extend on Class

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](http://img.shields.io/travis-ci/bevry/extendonclass.png?branch=master)](http://travis-ci.org/bevry/extendonclass "Check this project's build status on TravisCI")
[![NPM version](http://badge.fury.io/js/extendonclass.png)](https://npmjs.org/package/extendonclass "View this project on NPM")
[![Dependency Status](https://david-dm.org/bevry/extendonclass.png?theme=shields.io)](https://david-dm.org/bevry/extendonclass)
[![Development Dependency Status](https://david-dm.org/bevry/extendonclass/dev-status.png?theme=shields.io)](https://david-dm.org/bevry/extendonclass#info=devDependencies)<br/>
[![Gittip donate button](http://img.shields.io/gittip/bevry.png)](https://www.gittip.com/bevry/ "Donate weekly to this project using Gittip")
[![Flattr donate button](http://img.shields.io/flattr/donate.png?color=yellow)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](http://img.shields.io/paypal/donate.png?color=yellow)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](http://img.shields.io/bitcoin/donate.png?color=yellow)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](http://img.shields.io/wishlist/browse.png?color=yellow)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Add a backbone-like extend method onto your CoffeeScript classes, making it easy for JavaScript users to extend your CoffeeScript classes

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('extendonclass')`
- Install: `npm install --save extendonclass`

### [Browserify](http://browserify.org/)
- Use: `require('extendonclass')`
- Install: `npm install --save extendonclass`
- CDN URL: `//wzrd.in/bundle/extendonclass@1.0.1`

### [Ender](http://ender.jit.su/)
- Use: `require('extendonclass')`
- Install: `ender add extendonclass`

<!-- /INSTALL -->


## Usage

### For JavaScript Users

``` javascript
// Import
var SomeCoffeeScriptClass = require('some-coffee-script-module');

// Add our super easy extend method to the CoffeeScript class
SomeCoffeeScriptClass.extend = require('extendonclass').extendOnClass;

// Extend the CoffeeScript class easily with JavaScript
var MyJavaScriptClass = SomeCoffeeScriptClass.extend({
	constructor: function(){
		// do your thing
		// if you wish to call super, you can do so via:
		// this.__super__.constructor.apply(this, arguments);
	}
});
```

### For CoffeeScript Users

[View the interactive JSFiddle](http://jsfiddle.net/balupton/k9buB/)


<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/extendonclass/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/bevry/extendonclass/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)

### Sponsors

No sponsors yet! Will you be the first?

[![Gittip donate button](http://img.shields.io/gittip/bevry.png)](https://www.gittip.com/bevry/ "Donate weekly to this project using Gittip")
[![Flattr donate button](http://img.shields.io/flattr/donate.png?color=yellow)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](http://img.shields.io/paypal/donate.png?color=yellow)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](http://img.shields.io/bitcoin/donate.png?color=yellow)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](http://img.shields.io/wishlist/browse.png?color=yellow)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

### Contributors

These amazing people have contributed code to this project:

- [Benjamin Lupton](https://github.com/balupton) <b@lupton.cc> — [view contributions](https://github.com/bevry/extendonclass/commits?author=balupton)

[Become a contributor!](https://github.com/bevry/extendonclass/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT license](http://creativecommons.org/licenses/MIT/)

Copyright &copy; 2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

<!-- /LICENSE -->


