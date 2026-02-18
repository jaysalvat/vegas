
import vegas from './vegas.js'

function jqueryVegas($) {
  $.fn.vegas = function (options) {
    const args = arguments
    let error = false
    let returns

    if (typeof options === 'undefined' || typeof options === 'object') {
      return this.each(function (_, el) {
        if (!el._vegas) {
          // Bridge callbacks → jQuery events for backward compatibility
          const jqOptions = Object.assign({}, options, {
            init(settings) {
              $(el).trigger('vegasinit', [ settings ])
              if (options && options.init) {
                options.init.call(el, settings)
              }
            },
            play(index, slide) {
              $(el).trigger('vegasplay', [ index, slide ])
              if (options && options.play) {
                options.play.call(el, index, slide)
              }
            },
            pause(index, slide) {
              $(el).trigger('vegaspause', [ index, slide ])
              if (options && options.pause) {
                options.pause.call(el, index, slide)
              }
            },
            walk(index, slide) {
              $(el).trigger('vegaswalk', [ index, slide ])
              if (options && options.walk) {
                options.walk.call(el, index, slide)
              }
            },
            end(index, slide) {
              $(el).trigger('vegasend', [ index, slide ])
              if (options && options.end) {
                options.end.call(el, index, slide)
              }
            }
          })

          vegas(el, jqOptions)
        }
      })
    }

    if (typeof options === 'string') {
      this.each(function (_, el) {
        const instance = el._vegas

        if (!instance) {
          throw new Error('No Vegas applied to this element.')
        }

        if (typeof instance[options] === 'function' && options[0] !== '_') {
          returns = instance[options](...Array.from(args).slice(1))
        } else {
          error = true
        }
      })

      if (error) {
        throw new Error(`No method "${options}" in Vegas.`)
      }

      return typeof returns !== 'undefined' ? returns : this
    }

    return this
  }

  $.vegas = {
    defaults: vegas.defaults,
    isVideoCompatible: vegas.isVideoCompatible
  }
}

// Auto-register if jQuery/Zepto/m4q is available globally
if (typeof window !== 'undefined') {
  const $ = window.jQuery || window.Zepto || window.m4q
  if ($) {
    jqueryVegas($)
  }
}

export default jqueryVegas
