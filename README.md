Vegas – Fullscreen Backgrounds and Slideshows
=============================================

Vegas is a [jQuery](http://jquery.com)/[Zepto](http://zeptojs.com) plugin 
to add beautiful fullscreen backgrounds and Slideshows to DOM elements.

#### Install

    bower install vegas

#### Get started

First, include either [jQuery](http://jquery.com), [Zepto](http://zeptojs.com) or [Pin](http://pin.jaysalvat.com).

Then...

    $(function() {
	    $('body').vegas({
            slides: [
                { src: 'img1.jpg' },
                { src: 'img2.jpg' },
                { src: 'img3.jpg' }
            ]
        });
	}

### V2 Official website
http://vegas.jaysalvat.com/

### V2 Real life demo
http://vegas.jaysalvat.com/demo/

### V2 Documentation
http://vegas.jaysalvat.com/documentation/

Contributing
------------

Please don't edit files in the `dist` directory as they are generated via [Gulp](http://gulpjs.com). 
You'll find source code in the `src` directory!
Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**
Please don't run Gulp task. I will.

License
-------

**The MIT License (MIT)**

Copyright 2015 Jay Salvat

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
