
/* global jQuery, Zepto, Pin */

(function ($) {
    'use strict';

    var defaults = {
        slide:           0,
        delay:           5000,
        preload:         true,
        timer:           true,
        overlay:         false,
        autoplay:        true,
        shuffle:         false,
        fill:            true,
        color:           null,
        align:           'center',
        valign:          'center',
        transition:      'fade',
        transitionDelay: 1000,
        init:  function () {},
        play:  function () {},
        pause: function () {},
        walk:  function () {},
        slides: [
            // {   
            //  src:             null,
            //  color:           null,
            //  delay:           null,
            //  align:           null,
            //  valign:          null,
            //  transition:      null,
            //  transitiondelay: null,
            //  fill:            true,
            //  videos:          []
            // }
            // ...
        ]
    };

    var Vegas = function (elmt, options) {
        this.elmt         = elmt;
        this.settings     = $.extend({}, defaults, $.vegas.defaults, options);
        this.slide        = this.settings.slide;
        this.total        = this.settings.slides.length;
        this.noshow       = this.total < 2;
        this.paused       = !this.settings.autoplay || this.noshow;
        this.$elmt        = $(elmt);
        this.$timer       = null;
        this.$overlay     = null;
        this.$slide       = null;
        this.timeout      = null;
        this.transitions  = [];

        this.support = {
            objectFit:  'objectFit'  in document.body.style,
            transition: 'transition' in document.body.style || 'WebkitTransition' in document.body.style,
            video:      $.vegas.isVideoCompatible()
        };

        for (var i = 0; i < document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i],
                rules = sheet.rules ? sheet.rules : sheet.cssRules;

            if (/vegas(\.min)?\.css$/.test(sheet.href)) {
                for (var j = 0; j < rules.length; j++) {
                    var rule  = rules[j],
                        match = /vegas\-transition\-(.*)-|\b/gi.exec(rule.selectorText);
                
                    if (match && match[1]) {
                        this.transitions.push(match[1]);
                    }
                }
            }
        }

        if (this.settings.shuffle === true) {
            this.shuffle();
        }

        this._init();
    };

    Vegas.prototype = {
        _init: function () {
            var $wrapper,
                $overlay,
                $timer,
                isBody    = this.elmt.tagName === 'BODY',
                timer     = this.settings.timer,
                overlay   = this.settings.overlay,
                preload   = this.settings.preload,
                position  = this.$elmt.css('position'),
                img,
                i;

            // Preloading
            if (preload) {
                for (i = 0; i < this.settings.slides.length; i++) {
                    if (this.settings.slides[i].src) {
                        img = new Image();
                        img.src = this.settings.slides[i].src;
                    }
                }
            }

            // Wrapper with content
            if (!isBody) {
                $wrapper = $('<div class="vegas-wrapper">')
                    .css('overflow', this.$elmt.css('overflow'))
                    .css('padding',  this.$elmt.css('padding'));

                // Some browsers don't compute padding shorthand
                if (!this.$elmt.css('padding')) {
                    $wrapper
                        .css('padding-top',    this.$elmt.css('padding-top'))
                        .css('padding-bottom', this.$elmt.css('padding-bottom'))
                        .css('padding-left',   this.$elmt.css('padding-left'))
                        .css('padding-right',  this.$elmt.css('padding-right'));
                }

                $wrapper[0].innerHTML = this.elmt.innerHTML;
                this.elmt.innerHTML = '';
            }

            // Timer
            if (timer && this.support.transition) {
                $timer = $('<div class="vegas-timer"><div class="vegas-timer-progress">');
                this.$timer = $timer;
                this.$elmt.prepend($timer);
            }

            // Overlay
            if (overlay) {
                $overlay = $('<div class="vegas-overlay">');
                if (typeof overlay === 'string') {
                    $overlay.css('background-image', 'url(' + overlay + ')');
                }
                this.$overlay = $overlay;
                this.$elmt.prepend($overlay);
            }

            // Container
            this.$elmt.addClass('vegas-container');
            if (!isBody) {
                if (position === 'static') {
                    this.$elmt.css('position', 'relative');
                }
                this.$elmt.append($wrapper);
            }

            this.trigger('init');
            this._goto(this.slide);
        },

        _slideShow: function () {
            var self = this;

            if (this.paused || this.noshow) {
                clearTimeout(this.timeout);
            } else {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    self.next();
                }, this._options('delay')); 
            }
        },

        _timer: function (state) {
            var self = this;

            clearTimeout(this.timeout);

            if (!this.$timer || this.paused || this.noshow) {
                return;
            }

            this.$timer
                .removeClass('vegas-timer-running')
                    .find('div')
                        .css('transition-duration', '0ms');

            if (state) {
                setTimeout(function () {
                   self.$timer
                    .addClass('vegas-timer-running')
                        .find('div')
                            .css('transition-duration', self._options('delay') - 100 + 'ms');
                }, 100);
            }
        },

        _options: function (key, i) {
            if (i === undefined) {
                i = this.slide;
            }

            if (this.settings.slides[i][key] !== undefined) {
                return this.settings.slides[i][key];
            }

            return this.settings[key];
        },

        _goto: function (nb) {
            this.slide = nb;

            var $slide,
                $slides    = this.$elmt.children('.vegas-slide'),
                total      = $slides.length,
                self       = this,
                src        = this.settings.slides[nb].src,
                videos     = this.settings.slides[nb].video,
                delay      = this._options('delay'),
                duration   = this._options('transitionDelay'),
                align      = this._options('align'),
                valign     = this._options('valign'),
                color      = this._options('color') || this.$elmt.css('background-color'),
                fill       = this._options('fill') ? 'cover' : 'contain',
                transition = this._options('transition'),
                isRandom   = transition === 'random',
                video,
                source,
                img;

            if (isRandom) {
                transition = this.transitions[Math.floor(Math.random() * (this.transitions.length - 1))];
            }

            if (transition !== 'none' && this.transitions.indexOf(transition) < 0) {
                console.error("Vegas: Transition " + transition + " doesn't exist.");
            }

            if (duration > delay) {
                duration = delay;
            }

            if (this.support.video && videos) {
                if (videos instanceof Array === false) {
                    videos = [ videos ];
                }

                video = document.createElement('video');
                video.muted = true;
                video.loop = true;
                video.autoplay = true;

                videos.forEach(function (src) {
                    source = document.createElement('source');
                    source.src = src;
                    video.appendChild(source);
                });

                $slide = $(video)
                    .addClass('vegas-video')
                    .addClass('vegas-slide')
                    .addClass('vegas-transition-' + transition)
                    .css('background-color', color);

                if (this.support.objectFit) {
                    $slide
                        .css('object-position', align + ' ' + valign)
                        .css('object-fit', fill)
                        .css('width',  '100%')
                        .css('height', '100%');
                } else if (fill === 'contain') {
                    $slide
                        .css('width',  '100%')
                        .css('height', '100%');
                }
            } else {
                img = new Image();
                img.src = src;

                $slide = $('<div></div>')
                    .addClass('vegas-slide')
                    .addClass('vegas-transition-' + transition)
                    .css('background-image',    'url(' + src + ')')
                    .css('background-color',    color)
                    .css('background-position', align + ' ' + valign)
                    .css('background-size',     fill);
            }

            if (!self.support.transition) {
                $slide.css('display', 'none');
            }

            if (total) {
                $slides.eq(total - 1).after($slide);
            } else {
                this.$elmt.prepend($slide);
            }

            $slides
                .css('transition', 'all 0ms')
                .each(function () {
                    this.className  = ' vegas-slide';
                    this.className += ' vegas-transition-' +  transition;
                    this.className += ' vegas-transition-' +  transition + '-in';
                    
                    if (video) {
                        this.className += ' vegas-video';    
                    }
                }
            );

            self._timer(false);

            function go () {
                self._timer(true);

                setTimeout(function () {
                    if (self.support.transition) {
                        $slides
                            .css('transition', 'all ' + duration + 'ms')
                            .addClass('vegas-transition-' + transition + '-out');
                    }

                    $slide
                        .css('transition', 'all ' + duration + 'ms')
                        .addClass('vegas-transition-' + transition + '-in');

                    if (!self.support.transition) {
                        $slide.fadeIn(duration);
                    }

                    if ($slides.length >= 2) {
                         $slides.eq(0).remove();
                    }

                    self.trigger('walk');
                    self._slideShow();
                }, 100);
            }

            if (video) {
                // oncanplay is triggered every time when loop=true
                // so let's start the slide only once
                var played = false; 

                video.play();
                video.oncanplay = function () {
                    if (!played) {
                        played = true;
                        go();
                    }
                };
            } else {
                img.onload = go;
            }
        },

        shuffle: function () {
            var temp,
                rand;

            for (var i = this.total - 1; i > 0; i--) {
                rand = Math.floor(Math.random() * (i + 1));
                temp = this.settings.slides[i];
                this.settings.slides[i] = this.settings.slides[rand];
                this.settings.slides[rand] = temp;
            }
        },

        play: function () {
            if (this.paused) {
                this.paused = false;
                this.next();
                this.trigger('play');
            }
        },

        pause: function () {
            this._timer(false);
            this.paused = true;
            this.trigger('pause');
        },

        toggle: function () {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        },

        playing: function () {
            return !this.paused && !this.noshow;
        },

        current: function (advanced) {
            if (advanced) {
                return {
                    slide: this.slide,
                    data:  this.settings.slides[this.slide]
                };
            }
            return this.slide;
        },

        jump: function (nb) {
            if (nb < 0 || nb > this.total - 1 || nb === this.slide) {
                return;
            }

            this.slide = nb;
            this._goto(this.slide);
        },

        next: function () {
            this.slide++;

            if (this.slide >= this.total) {
                this.slide = 0;
            }

            this._goto(this.slide);
        },

        previous: function () {
            this.slide--;

            if (this.slide < 0) {
                this.slide = this.total - 1;
            }

            this._goto(this.slide);
        },

        trigger: function (fn) {
            var params = [];

            if (fn !== 'init') {
                params = [ 
                    this.slide, 
                    this.settings.slides[this.slide]
                ];
            }

            this.$elmt.trigger('vegas' + fn, params);

            if (typeof this.settings[fn] === 'function') {
                this.settings[fn].apply(this.$elmt, params);
            }
        },

        options: function (key, value) {
            if (typeof key === 'string') {
                if (value === undefined) {
                    return this.settings[key];
                }
                this.settings[key] = value;
            } else if (typeof key === 'object') {
                this.settings = key;
            } else {
                return this.settings;
            }
        }
    };

    $.fn.vegas = function(options) {
        var args = arguments,
            error = false,
            returns;

        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!this._vegas) {
                    this._vegas = new Vegas(this, options);
                }
            });
        } else if (typeof options === 'string') {
            this.each(function () {
                var instance = this._vegas;

                if (!instance) {
                    throw new Error('No Vegas applied to this element.');
                }

                if (typeof instance[options] === 'function' && options[0] !== '_') {
                    returns = instance[options].apply(instance, [].slice.call(args, 1));
                } else {
                    error = true;
                }
            });

            if (error) {
                throw new Error('No method "' + options + '" in Vegas.');
            }

            return returns !== undefined ? returns : this;
        }
    };

    $.vegas = {};
    $.vegas.defaults = defaults;

    $.vegas.isVideoCompatible = function () {
        return !('ontouchstart' in window || 'onmsgesturechange' in window);
    };

})(typeof jQuery !== 'undefined' ? jQuery :
   typeof Zepto  !== 'undefined' ? Zepto  :
   typeof Pin    !== 'undefined' ? Pin    : null
);
