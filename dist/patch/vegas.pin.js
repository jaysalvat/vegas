/* 
 * Pin to jQuery compatibility patch
 *
 * This file is required if you use 
 * Pin instead of jQuery
 *
 * What is Pin?
 * http://pin.jaysalvat.com
 */

/* global Pin: true */

(function ($) {
    'use strict';

    if ($ && $.pin) {
        $.fn.addClass = function (name) {
            return this.set('.' + name);
        };

        $.fn.hasClass = function (name) {
            return this.get('.' + name);
        };

        $.fn.removeClass = function (name) {
            return this.set('.' + name, 'remove');
        };

        $.fn.css = function (key, value) {
            if (value === undefined) {
                return this.get(':' + key);
            }
            return this.set(':' + key, value);
        };

        $.fn.attr = function (key, value) {
            if (value === undefined) {
                return this.get('@' + key);
            }
            return this.set('@' + key, value);
        };

        $.fn.fadeIn = function (duration) {
            return this.each(function () {
                var self  = this,
                    start = new Date(),
                    from  = 0,
                    intvl = setInterval(function() {
                        var passed   = new Date() - start,
                            progress = passed / duration;

                        self.style.opacity = from + progress;

                        if (progress >= 1) {
                            clearInterval(intvl);
                        }
                    }, duration || 100);
            });
        };
    }
})(typeof Pin !== 'undefined' ? Pin : null);