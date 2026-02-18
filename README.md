Vegas – Backgrounds and Slideshows
==================================

[![NPM version](https://badge.fury.io/js/vegas.svg)](https://badge.fury.io/js/vegas)

Vegas is a JavaScript library to add beautiful backgrounds and slideshows to DOM elements.
No jQuery required — a jQuery wrapper is available separately.

#### Install

Use [NPM](https://www.npmjs.org/):

    npm install vegas

Or download the [latest release](https://jaysalvat.github.io/vegas/releases/latest/vegas.zip).

#### Get started

**Vanilla JS**

Include `vegas.css` and `vegas.js`, then:

```html
<link rel="stylesheet" href="vegas/dist/vegas.css">
<script type="module">
  import vegas from 'vegas/dist/vegas.js'

  vegas('body', {
    slides: [
      { src: 'img1.jpg' },
      { src: 'img2.jpg' },
      { src: 'img3.jpg' }
    ]
  })
</script>
```

**Bundler (Vite, Webpack…)**

```js
import 'vegas/dist/vegas.css'
import vegas from 'vegas'

vegas('body', {
  slides: [
    { src: 'img1.jpg' },
    { src: 'img2.jpg' },
    { src: 'img3.jpg' }
  ]
})
```

For the jQuery wrapper (auto-registers with global `$`):

```js
import 'vegas/dist/vegas.css'
import 'vegas/jquery'

$('body').vegas({
  slides: [
    { src: 'img1.jpg' },
    { src: 'img2.jpg' },
    { src: 'img3.jpg' }
  ]
})
```

**jQuery wrapper**

> The jQuery wrapper is provided for backward compatibility with Vegas v2. New projects should use the vanilla JS API.

Include jQuery, then `jquery.vegas.js` — the plugin registers itself automatically:

```html
<link rel="stylesheet" href="vegas/dist/vegas.css">
<script src="jquery.min.js"></script>
<script src="vegas/dist/jquery.vegas.js"></script>
<script>
  $('body').vegas({
    slides: [
      { src: 'img1.jpg' },
      { src: 'img2.jpg' },
      { src: 'img3.jpg' }
    ]
  })
</script>
```

The wrapper is also compatible with [Zepto](https://zeptojs.com) and [m4q](https://github.com/olton/m4q).

### Official website
https://vegas.jaysalvat.com/

### Sin City demo
https://vegas.jaysalvat.com/demo/

### Documentation
https://vegas.jaysalvat.com/documentation/

Contributing
------------

Please don't edit files in the `dist` directory as they are generated via [Rollup](https://rollupjs.org).
You'll find source code in the `src` directory.

Install dependencies:

    npm install

Watch JS changes during development:

    npm run dev

Build for production:

    npm run build

License
-------

**The MIT License (MIT)**

Copyright 2026 Jay Salvat

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
