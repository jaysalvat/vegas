
<!-- TITLE/ -->

# Safe FS

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](http://img.shields.io/travis-ci/bevry/safefs.png?branch=master)](http://travis-ci.org/bevry/safefs "Check this project's build status on TravisCI")
[![NPM version](http://badge.fury.io/js/safefs.png)](https://npmjs.org/package/safefs "View this project on NPM")
[![Gittip donate button](http://img.shields.io/gittip/bevry.png)](https://www.gittip.com/bevry/ "Donate weekly to this project using Gittip")
[![Flattr donate button](http://img.shields.io/flattr/donate.png?color=yellow)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](http://img.shields.io/paypal/donate.png?color=yellow)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Stop getting EMFILE errors! Open only as many files as the operating system supports.

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [Node](http://nodejs.org/), [Browserify](http://browserify.org/)
- Use: `require('safefs')`
- Install: `npm install --save safefs`

### [Ender](http://ender.jit.su/)
- Use: `require('safefs')`
- Install: `ender add safefs`

<!-- /INSTALL -->


## Usage

``` javascript
var safefs = require('safefs');
```

The following [file system](http://nodejs.org/docs/latest/api/all.html#all_file_system) methods are available (but wrapped in safe way to prevent EMFILE errors):

- `readFile(path, options?, next)`
- `writeFile(path, data, options?, next)` - will also attempt to ensure the path exists
- `appendFile(path, data, options?, next)` - will also attempt to ensure the path exists
- `mkdir(path, mode?, next)` - mode defaults to `0o777 & (~process.umask())`
- `stat(path, next)`
- `readdir(path, next)`
- `unlink(path, next)`
- `rmdir(path, next)`
- `exists(path, next)`

For other file system interaction, you can do the following:

``` javascript
// get a slot in the file system queue
require('safefs').openFile(function(closeFile){
	// do our file system interaction
	require('fs').someOtherMethod(a,b,c,function(err,a,b,c){
		// close the slot we are using in the file system queue
		closeFile();
	});
});
```

To make this possible we define a global variable called `safefsGlobal` that manages the available slots for interacting with the file system.


<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `History.md` file.](https://github.com/bevry/safefs/blob/master/History.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `Contributing.md` file.](https://github.com/bevry/safefs/blob/master/Contributing.md#files)

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

### Contributors

These amazing people have contributed code to this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton) - [view contributions](https://github.com/bevry/safefs/commits?author=balupton)
- jagill (https://github.com/jagill) - [view contributions](https://github.com/bevry/safefs/commits?author=jagill)
- sfrdmn (https://github.com/sfrdmn) - [view contributions](https://github.com/bevry/safefs/commits?author=sfrdmn)

[Become a contributor!](https://github.com/bevry/safefs/blob/master/Contributing.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT license](http://creativecommons.org/licenses/MIT/)

Copyright &copy; 2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)
<br/>Copyright &copy; 2011-2012 Benjamin Lupton <b@lupton.cc> (http://balupton.com)

<!-- /LICENSE -->


