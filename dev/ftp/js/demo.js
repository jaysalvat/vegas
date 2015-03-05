    /* jshint strict: false */

    var $body       = $('body'),
        $characters = $('.characters'),
        $posters    = $('.characters-poster'),
        $names      = $('.characters-list a'),
        $label      = $('.characters-label');

    var backgrounds = [
        { src: 'img/1.jpg', valign: 'top' },
        { src: 'img/2.jpg', valign: 'top' },
        { src: 'img/3.jpg', valign: 'top' },
        { src: 'img/2.jpg', delay: 6500, video: [
            'img/intro.mp4',
            'img/intro.ogv',
            'img/intro.webm'
        ] },
    ];

    var posters = [
        { src: 'img/poster-ja.jpg' },
        { src: 'img/poster-mr.jpg' },
        { src: 'img/poster-jb.jpg' },
        { src: 'img/poster-jg.jpg' },
        { src: 'img/poster-eg.jpg' },
        { src: 'img/poster-bw.jpg' },
        { src: 'img/poster-rd.jpg' },
        { src: 'img/poster-pb.jpg' },
        { src: 'img/poster-rl.jpg' },
        { src: 'img/poster-dh.jpg' },
    ];

    var backdrops = [
        { src: 'img/backdrop-ja.jpg' },
        { src: 'img/backdrop-mr.jpg' },
        { src: 'img/backdrop-jb.jpg' },
        { src: 'img/backdrop-jg.jpg' },
        { src: 'img/backdrop-eg.jpg' },
        { src: 'img/backdrop-bw.jpg' },
        { src: 'img/backdrop-rd.jpg' },
        { src: 'img/backdrop-pb.jpg' },
        { src: 'img/backdrop-rl.jpg' },
        { src: 'img/backdrop-dh.jpg' },
    ];

    $('html').addClass('animated');

    var displayBackdrops = false;

    $body.vegas({
        preload: true,
        overlay: true,
        transitionDelay: 4000,
        delay: 10000,
        slides: backgrounds,
        walk: function (nb, settings) {
            if (settings.video) {
                $('.logo').addClass('collapsed');
            } else {
                $('.logo').removeClass('collapsed');
            }
        }
    });

    $posters.vegas({
        preload: true,
        transition: 'swirlLeft2',
        transitionDelay: 1000,
        timer: false,
        delay: 5000,
        slides: posters,
        walk: function (nb) {
            $('.characters-list li')
                .removeClass('active')
                .eq(nb)
                    .addClass('active');

            var name = $names.eq(nb).data('character');

            $label
                .removeClass('animated');

            setTimeout(function () {
                $label
                    .text(name)
                    .addClass('animated');
            }, 250);

            if (displayBackdrops === true) {
                var backdrop = backdrops[nb];
                backdrop.transition = 'zoomOut';
                backdrop.transitionDelay = 1000;

                $body.vegas('options', 'delay', 1000);
                $body.vegas('options', 'slides', [ backdrop ]);
                $body.vegas('next');
            }
        }
    })
    .on('mouseenter', function () {
        displayBackdrops = true;
        $posters.vegas('trigger', 'walk');
        $posters.vegas('pause');
    })
    .on('click', debounce(function () {
        $posters.vegas('next');
    }, 250, true));

    $characters
    .on('mouseenter', function () {
        displayBackdrops = true;
    })
    .on('mouseleave', function () {
        $body.vegas('options', 'slides', backgrounds);
        $body.vegas('next');
        $body.vegas('options', 'delay', 4000);

        displayBackdrops = false;

        $posters.vegas('play');
    });

    $names
    .on('mouseenter', debounce(function (e) {
        e.preventDefault();

        var index = $(this).index('.characters-list a');

        $posters
            .vegas('jump', index)
            .vegas('pause');
    }, 250));

    // JavaScript Debounce Function
    // By David Walsh
    // http://davidwalsh.name/javascript-debounce-function
    function debounce (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, 
                args = arguments,
                later = function() {
                    timeout = null;

                    if (!immediate) {
                        func.apply(context, args);
                    }
                },
                callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait || 500);

            if (callNow) {
                func.apply(context, args);
            }
        };
    }
    