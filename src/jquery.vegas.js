// ----------------------------------------------------------------------------
// Vegas – Fullscreen Backgrounds and Slideshows with jQuery.
// Licensed under the MIT license.
// http://vegas.jaysalvat.com/
// ----------------------------------------------------------------------------
// Copyright (C) 2013 Jay Salvat
// http://jaysalvat.com/
// ----------------------------------------------------------------------------

(function($) {
    var $background = $('<img />').addClass('vegas-background'),
        $overlay = $('<div />').addClass('vegas-overlay'),
        $loading = $('<div />').addClass('vegas-loading'),
        $current = $(),
        paused = null,
        backgrounds = [],
        step = 0,
        delay = 5000,
        walk = function() {},
        timer,
        methods = {

        // Init plugin
        init : function(settings) {
            var options = {
                src: getBackground(),
                align: 'center',
                valign: 'center',
                fade: 0,
                loading: true,
                load: function() {},
                complete: function() {}
            };

            $.extend(options, $.vegas.defaults.background, settings);

            if (options.loading) {
                loading();
            }

            var $new = $background.clone();
            $new.css({
                'position': 'fixed',
                'left': '0px',
                'top': '0px'
            })
            .bind('load', function() {
                if ($new == $current) {
                    return;
                }

                $(window).bind('load resize.vegas', function(e) {
                    resize($new, options);
                });

                if ($current.is('img')) {

                    $current.stop();

                    $new.hide()
                        .insertAfter($current)
                        .fadeIn(options.fade, function() {
                            $('.vegas-background')
                                .not(this)
                                    .remove();
                            $('body').trigger('vegascomplete', [this, step - 1]);
                            options.complete.apply($new, [step - 1]);
                        });
                } else {
                    $new.hide()
                        .prependTo('body')
                        .fadeIn(options.fade, function() {
                            $('body').trigger('vegascomplete', [this, step - 1]);
                            options.complete.apply(this, [step - 1]);
                        });
                }

                $current = $new;

                resize($current, options);

                if (options.loading) {
                    loaded();
                }

                $('body').trigger('vegasload', [$current.get(0), step - 1]);
                options.load.apply($current.get(0), [step - 1]);

                if (step) {
                    $('body').trigger('vegaswalk', [$current.get(0), step - 1]);
                    options.walk.apply($current.get(0), [step - 1]);
                }
            })
            .attr('src', options.src);

            return $.vegas;
        },

        // Destroy background and/or overlay
        destroy: function(what) {
            if (!what || what == 'background') {
                $('.vegas-background, .vegas-loading').remove();
                $(window).unbind('*.vegas');
                $current = $();
            }

            if (!what || what == 'overlay') {
                $('.vegas-overlay').remove();
            }

            clearInterval(timer);

            return $.vegas;
        },

        // Display the pattern overlay
        overlay: function(settings) {
            var options = {
                src: null,
                opacity: null
            };
            $.extend(options, $.vegas.defaults.overlay, settings);

            $overlay.remove();

            $overlay
                .css({
                    'margin': '0',
                    'padding': '0',
                    'position': 'fixed',
                    'left': '0px',
                    'top': '0px',
                    'width': '100%',
                    'height': '100%'
            });

            if (options.src === false) {
                $overlay.css('backgroundImage', 'none');
            }

            if (options.src) {
                $overlay.css('backgroundImage', 'url(' + options.src + ')');
            }

            if (options.opacity) {
                $overlay.css('opacity', options.opacity);
            }

            $overlay.prependTo('body');

            return $.vegas;
        },

        // Start/restart slideshow
        slideshow: function(settings, keepPause) {
            var options = {
                step: step,
                delay: delay,
                preload: false,
                loading: true,
                backgrounds: backgrounds,
                walk: walk
            };

            $.extend(options, $.vegas.defaults.slideshow, settings);

            if (options.backgrounds != backgrounds) {
                if (!settings.step) {
                    options.step = 0;
                }

                if (!settings.walk) {
                    options.walk = function() {};
                }

                if (options.preload) {
                    $.vegas('preload', options.backgrounds);
                }
            }

            backgrounds = options.backgrounds;
            delay = options.delay;
            step = options.step;
            walk = options.walk;

            clearInterval(timer);

            if (!backgrounds.length) {
                return $.vegas;
            }

            var doSlideshow = function() {
                if (step < 0) {
                    step = backgrounds.length - 1;
                }

                if (step >= backgrounds.length || !backgrounds[step - 1]) {
                    step = 0;
                }

                var settings = backgrounds[step++];
                settings.walk = options.walk;
                settings.loading = options.loading;

                if (typeof(settings.fade) == 'undefined') {
                    settings.fade = options.fade;
                }

                if (settings.fade > options.delay) {
                    settings.fade = options.delay;
                }

                $.vegas(settings);
            };

            doSlideshow();

            if (!keepPause) {
                paused = false;

                $('body').trigger('vegasstart', [$current.get(0), step - 1]);
            }

            if (!paused) {
                timer = setInterval(doSlideshow, options.delay);
            }

            return $.vegas;
        },

        // Jump to the next background in the current slideshow
        next: function() {
            var from = step;

            if (step) {
                $.vegas('slideshow', { step: step }, true);

                $('body').trigger('vegasnext', [$current.get(0), step - 1, from - 1]);
            }

            return $.vegas;
        },

        // Jump to the previous background in the current slideshow
        previous: function() {
            var from = step;

            if (step) {
                $.vegas('slideshow', { step: step - 2 }, true);

                $('body').trigger('vegasprevious', [$current.get(0), step - 1, from - 1]);
            }

            return $.vegas;
        },

        // Jump to a specific background in the current slideshow
        jump: function(s) {
            var from = step;

            if (step) {
                $.vegas('slideshow', { step: s }, true);

                $('body').trigger('vegasjump', [$current.get(0), step - 1, from - 1]);
            }

            return $.vegas;
        },

        // Stop slideshow
        stop: function() {
            var from = step;
            step = 0;
            paused = null;
            clearInterval(timer);

            $('body').trigger('vegasstop', [$current.get(0), from - 1]);

            return $.vegas;
        },

        // Pause slideShow
        pause: function() {
            paused = true;
            clearInterval(timer);

            $('body').trigger('vegaspause', [$current.get(0), step - 1]);

            return $.vegas;
        },

        // Get some useful values or objects
        get: function(what) {
            if (what === null || what == 'background') {
                return $current.get(0);
            }

            if (what == 'overlay') {
                return $overlay.get(0);
            }

            if (what == 'step') {
                return step - 1;
            }

            if (what == 'paused') {
                return paused;
            }
        },

        // Preload an array of backgrounds
        preload: function(backgrounds) {
            var cache = [];
            for(var i in backgrounds) {
                if (backgrounds[i].src) {
                    var cacheImage = document.createElement('img');
                    cacheImage.src = backgrounds[i].src;
                    cache.push(cacheImage);
                }
            }

            return $.vegas;
        }
    };

    // Resize the background
    function resize($img, settings) {
        var options =  {
            align: 'center',
            valign: 'center'
        };

        $.extend(options, settings);

        if($img.height() === 0) {
            $img.load(function(){
                resize($(this), settings);
            });
            return;
        }

        var vp = getViewportSize(),
            ww = vp.width,
            wh = vp.height,
            iw = $img.width(),
            ih = $img.height(),
            rw = wh / ww,
            ri = ih / iw,
            newWidth, newHeight,
            newLeft, newTop,
            properties;

        if (rw > ri) {
            newWidth = wh / ri;
            newHeight = wh;
        } else {
            newWidth = ww;
            newHeight = ww * ri;
        }

        properties = {
            'width': newWidth + 'px',
            'height': newHeight + 'px',
            'top': 'auto',
            'bottom': 'auto',
            'left': 'auto',
            'right': 'auto'
        };

        if (!isNaN(parseInt(options.valign, 10))) {
            properties.top = (0 - (newHeight - wh) / 100 * parseInt(options.valign, 10)) + 'px';
        } else if (options.valign == 'top') {
            properties.top = 0;
        } else if (options.valign == 'bottom') {
            properties.bottom = 0;
        } else {
            properties.top = (wh - newHeight) / 2;
        }

        if (!isNaN(parseInt(options.align, 10))) {
            properties.left = (0 - (newWidth - ww) / 100 * parseInt(options.align, 10)) + 'px';
        } else if (options.align == 'left') {
            properties.left = 0;
        } else if (options.align == 'right') {
            properties.right = 0;
        } else {
            properties.left = (ww - newWidth) / 2 ;
        }

        $img.css(properties);
    }

    // Display the loading indicator
    function loading() {
        $loading.prependTo('body').fadeIn();
    }

    // Hide the loading indicator
    function loaded() {
        $loading.fadeOut('fast', function() {
            $(this).remove();
        });
    }

    // Get the background image from the body
    function getBackground() {
        if ($('body').css('backgroundImage')) {
            return $('body').css('backgroundImage').replace(/url\("?(.*?)"?\)/i, '$1');
        }
    }

    // Get the real viewport size
    function getViewportSize(){
        var elmt = window,
            prop = 'inner';

        if (!('innerWidth' in window)){
            elmt = document.documentElement || document.body;
            prop = 'client';
        }

        return {
            width:  elmt[prop + 'Width' ],
            height: elmt[prop + 'Height']
        };
    }

    // The plugin
    $.vegas = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist');
        }
    };

    // Global parameters
    $.vegas.defaults = {
        background: {
            // src:         string
            // align:       string/int
            // valign:      string/int
            // fade:        int
            // loading      bool
            // load:        function
            // complete:    function
        },
        slideshow: {
            // fade:        null
            // step:        int
            // delay:       int
            // backgrounds: array
            // loading      bool
            // preload:     bool
            // walk:        function
        },
        overlay: {
            // src:         string
            // opacity:     float
        }
    };
})(jQuery);