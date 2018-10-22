Vegas – Backgrounds and Slideshows
==================================

[![NPM version](https://badge.fury.io/js/vegas.svg)](https://badge.fury.io/js/vegas)
[![Bower version](https://badge.fury.io/bo/vegas.svg)](https://badge.fury.io/bo/vegas)

Vegas is a [jQuery](https://jquery.com)/[Zepto](https://zeptojs.com) plugin 
to add beautiful backgrounds and Slideshows to DOM elements.

**Important note:** Vegas 2 is not a drop-in replacement for version 1.x. It's a brand new plugin.

#### Install

Download the [last version](https://jaysalvat.github.io/vegas/releases/latest/vegas.zip).

Or use [Bower](https://bower.io/):

    bower install vegas

Or use [NPM](https://www.npmjs.org/):

    npm install vegas

#### Get started

First, include either [jQuery](https://jquery.com) or [Zepto](https://zeptojs.com).

Then...

    $(function() {
        $('body').vegas({
            slides: [
                { src: 'img1.jpg' },
                { src: 'img2.jpg' },
                { src: 'img3.jpg' }
            ]
        });
    });

### Official website
https://vegas.jaysalvat.com/

### Sin City demo
https://vegas.jaysalvat.com/demo/

### Documentation
https://vegas.jaysalvat.com/documentation/

#### Looking for Vegas v1?

The [Vegas v1 website](http://v1.vegas.jaysalvat.com) is still available but this version is not maintained anymore.

Contributing
------------

Please don't edit files in the `dist` directory as they are generated via [Gulp](https://gulpjs.com). 
You'll find source code in the `src` directory!

Install dependencies.

    npm install

Run watch task before editing code. 

    gulp watch

Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

License
-------

**The MIT License (MIT)**

Copyright 2018 Jay Salvat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
