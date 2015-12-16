'use strict';

Tinytest.add('Instantiation', function (test) {
  var slideshow = document.createElement('div');
  document.body.appendChild(slideshow);
  $(slideshow).vegas({
        slides: [
            { src: 'http://lorempixel.com/400/200' }
        ]
    });
  test.matches($(slideshow).html(), /vegas/, 'Instantiation');
});
