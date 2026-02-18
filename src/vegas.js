
const defaults = {
  slide: 0,
  delay: 5000,
  loop: true,
  preload: false,
  preloadImage: false,
  preloadVideo: false,
  timer: true,
  overlay: false,
  autoplay: true,
  shuffle: false,
  cover: true,
  color: null,
  align: 'center',
  valign: 'center',
  firstTransition: null,
  firstTransitionDuration: null,
  transition: 'fade',
  transitionDuration: 1000,
  transitionRegister: [],
  animation: null,
  animationDuration: 'auto',
  animationRegister: [],
  slidesToKeep: 1,
  init: () => {},
  play: () => {},
  pause: () => {},
  walk: () => {},
  slides: [
    // {
    //  src:                null,
    //  color:              null,
    //  delay:              null,
    //  align:              null,
    //  valign:             null,
    //  transition:         null,
    //  transitionDuration: null,
    //  animation:          null,
    //  animationDuration:  null,
    //  cover:              true,
    //  video: {
    //      src: [],
    //      muted: true,
    //      loop: true
    // }
    // ...
  ]
}

const videoCache = {}
let instances = 0

class Vegas {
  constructor(elmt, options) {
    this.elmt = elmt
    this.settings = Object.assign({}, defaults, vegas.defaults, options)
    this.slide = this.settings.slide
    this.total = this.settings.slides.length
    this.noshow = this.total < 2
    this.paused = !this.settings.autoplay || this.noshow
    this.ended = false
    this.timer = null
    this.overlay = null
    this.timeout = null
    this.first = true

    this.instance = instances++

    this.transitions = [
      'fade', 'fade2',
      'blur', 'blur2',
      'flash', 'flash2',
      'negative', 'negative2',
      'burn', 'burn2',
      'slideLeft', 'slideLeft2',
      'slideRight', 'slideRight2',
      'slideUp', 'slideUp2',
      'slideDown', 'slideDown2',
      'zoomIn', 'zoomIn2',
      'zoomOut', 'zoomOut2',
      'swirlLeft', 'swirlLeft2',
      'swirlRight', 'swirlRight2'
    ]

    this.animations = [
      'kenburns',
      'kenburnsLeft', 'kenburnsRight',
      'kenburnsUp', 'kenburnsUpLeft', 'kenburnsUpRight',
      'kenburnsDown', 'kenburnsDownLeft', 'kenburnsDownRight'
    ]

    if (!(this.settings.transitionRegister instanceof Array)) {
      this.settings.transitionRegister = [ this.settings.transitionRegister ]
    }

    if (!(this.settings.animationRegister instanceof Array)) {
      this.settings.animationRegister = [ this.settings.animationRegister ]
    }

    this.transitions = this.transitions.concat(this.settings.transitionRegister)
    this.animations = this.animations.concat(this.settings.animationRegister)

    this.support = {
      objectFit: 'objectFit' in document.body.style,
      transition: 'transition' in document.body.style || 'WebkitTransition' in document.body.style
    }

    if (this.settings.shuffle === true) {
      this.shuffle()
    }
    this._init()
  }

  _init() {
    const isBody = this.elmt.tagName === 'BODY'
    const timer = this.settings.timer
    const overlay = this.settings.overlay

    this._preload()

    let content, contentScroll

    // Div with scrollable content
    if (!isBody) {
      contentScroll = document.createElement('div')
      contentScroll.className = 'vegas-content-scrollable'

      content = document.createElement('div')
      content.className = 'vegas-content'

      const cs = getComputedStyle(this.elmt)
      content.style.overflow = cs.overflow
      content.style.padding = cs.padding

      // Some browsers don't compute padding shorthand
      if (!cs.padding) {
        content.style.paddingTop = cs.paddingTop
        content.style.paddingBottom = cs.paddingBottom
        content.style.paddingLeft = cs.paddingLeft
        content.style.paddingRight = cs.paddingRight
      }

      this.elmt.style.padding = '0'

      Array.from(this.elmt.children).forEach((child) => {
        content.appendChild(child.cloneNode(true))
      })
      this.elmt.innerHTML = ''
    }

    // Timer
    if (timer && this.support.transition) {
      const timerEl = document.createElement('div')
      timerEl.className = 'vegas-timer'
      const timerProgress = document.createElement('div')
      timerProgress.className = 'vegas-timer-progress'
      timerEl.appendChild(timerProgress)
      this.timer = timerEl
      this.elmt.prepend(timerEl)
    }

    // Overlay
    if (overlay) {
      const overlayEl = document.createElement('div')
      overlayEl.className = 'vegas-overlay'

      if (typeof overlay === 'string') {
        overlayEl.style.backgroundImage = `url(${overlay})`
      }

      this.overlay = overlayEl
      this.elmt.prepend(overlayEl)
    }

    // Container
    this.elmt.classList.add('vegas-container')

    if (!isBody) {
      contentScroll.append(content)
      this.elmt.append(contentScroll)
    }

    setTimeout(() => {
      this.trigger('init')
      this._goto(this.slide)

      if (this.settings.autoplay) {
        this.trigger('play')
      }
    }, 1)
  }

  _preload() {
    for (let i = 0; i < this.settings.slides.length; i++) {
      if (this.settings.preload || this.settings.preloadImages) {
        if (this.settings.slides[i].src) {
          const img = new Image()
          img.src = this.settings.slides[i].src
        }
      }

      if (this.settings.preload || this.settings.preloadVideos) {
        if (this.settings.slides[i].video) {
          if (this.settings.slides[i].video instanceof Array) {
            this._video(this.settings.slides[i].video)
          } else {
            this._video(this.settings.slides[i].video.src)
          }
        }
      }
    }
  }

  _random(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  _slideShow() {
    if (this.total > 1 && !this.ended && !this.paused && !this.noshow) {
      this.timeout = setTimeout(() => this.next(), this._options('delay'))
    }
  }

  _timer(state) {
    clearTimeout(this.timeout)

    if (!this.timer) {
      return
    }

    this.timer.classList.remove('vegas-timer-running')
    this.timer.querySelector('div').style.transitionDuration = '0ms'

    if (this.ended || this.paused || this.noshow) {
      return
    }

    if (state) {
      setTimeout(() => {
        this.timer.classList.add('vegas-timer-running')
        this.timer.querySelector('div').style.transitionDuration = `${this._options('delay') - 100}ms`
      }, 100)
    }
  }

  _video(srcs) {
    const cacheKey = this.instance + srcs.toString()

    if (videoCache[cacheKey]) {
      return videoCache[cacheKey]
    }

    if (!(srcs instanceof Array)) {
      srcs = [ srcs ]
    }

    const video = document.createElement('video')
    video.preload = true
    video.playsInline = true
    video.controls = false

    srcs.forEach((src) => {
      const source = document.createElement('source')
      source.src = src
      video.appendChild(source)
    })

    videoCache[cacheKey] = video
    return video
  }

  _fadeOutSound(video, duration) {
    const delay = duration / 10
    const volume = video.volume - 0.09

    if (volume > 0) {
      video.volume = volume
      setTimeout(() => this._fadeOutSound(video, duration), delay)
    } else {
      video.pause()
    }
  }

  _fadeInSound(video, duration) {
    const delay = duration / 10
    const volume = video.volume + 0.09

    if (volume < 1) {
      video.volume = volume
      setTimeout(() => this._fadeInSound(video, duration), delay)
    }
  }

  _options(key, i = this.slide) {
    if (key in this.settings.slides[i]) {
      return this.settings.slides[i][key]
    }
    return this.settings[key]
  }

  _goto(nb) {
    if (typeof this.settings.slides[nb] === 'undefined') {
      nb = 0
    }

    this.slide = nb

    const slides = Array.from(this.elmt.querySelectorAll(':scope > .vegas-slide'))
    const src = this.settings.slides[nb].src
    const videoSettings = this.settings.slides[nb].video
    const delay = this._options('delay')
    const align = this._options('align')
    const valign = this._options('valign')
    const color = this._options('color') || getComputedStyle(this.elmt).backgroundColor
    const total = slides.length

    let cover = this._options('cover')
    let transition = this._options('transition')
    let transitionDuration = this._options('transitionDuration')
    let animation = this._options('animation')
    let animationDuration = this._options('animationDuration')

    if (this.settings.firstTransition && this.first) {
      transition = this.settings.firstTransition || transition
    }

    if (this.settings.firstTransitionDuration && this.first) {
      transitionDuration = this.settings.firstTransitionDuration || transitionDuration
    }

    if (this.first) {
      this.first = false
    }

    if (cover !== 'repeat') {
      if (cover === true) {
        cover = 'cover'
      } else if (cover === false) {
        cover = 'contain'
      }
    }

    if (transition === 'random' || transition instanceof Array) {
      transition = transition instanceof Array
        ? this._random(transition)
        : this._random(this.transitions)
    }

    if (animation === 'random' || animation instanceof Array) {
      animation = animation instanceof Array
        ? this._random(animation)
        : this._random(this.animations)
    }

    if (transitionDuration === 'auto' || transitionDuration > delay) {
      transitionDuration = delay
    }

    if (animationDuration === 'auto') {
      animationDuration = delay
    }

    const slideEl = document.createElement('div')
    slideEl.className = 'vegas-slide'

    if (this.support.transition && transition) {
      slideEl.classList.add(`vegas-transition-${transition}`)
    }

    let video, img

    // Video
    if (videoSettings) {
      video = videoSettings instanceof Array
        ? this._video(videoSettings)
        : this._video(videoSettings.src)

      video.loop = 'loop' in videoSettings ? videoSettings.loop : true
      video.muted = 'muted' in videoSettings ? videoSettings.muted : true

      if (video.muted === false) {
        video.volume = 0
        this._fadeInSound(video, transitionDuration)
      } else {
        video.pause()
      }

      video.classList.add('vegas-video')
      video.style.backgroundColor = color

      if (this.support.objectFit) {
        video.style.objectPosition = `${align} ${valign}`
        video.style.objectFit = cover
        video.style.width = '100%'
        video.style.height = '100%'
      } else if (cover === 'contain') {
        video.style.width = '100%'
        video.style.height = '100%'
      }

      slideEl.append(video)

    // Image
    } else {
      img = new Image()

      const inner = document.createElement('div')
      inner.className = 'vegas-slide-inner'
      inner.style.backgroundImage = `url("${src}")`
      inner.style.backgroundColor = color
      inner.style.backgroundPosition = `${align} ${valign}`

      if (cover === 'repeat') {
        inner.style.backgroundRepeat = 'repeat'
      } else {
        inner.style.backgroundSize = cover
      }

      if (this.support.transition && animation) {
        inner.classList.add(`vegas-animation-${animation}`)
        inner.style.animationDuration = `${animationDuration}ms`
      }

      slideEl.append(inner)
    }

    if (!this.support.transition) {
      slideEl.style.display = 'none'
    }

    if (total) {
      slides[total - 1].insertAdjacentElement('afterend', slideEl)
    } else {
      this.elmt.prepend(slideEl)
    }

    slides.forEach((el) => {
      el.style.transition = 'all 0ms'
      el.className = 'vegas-slide'

      if (el.tagName === 'VIDEO') {
        el.className += ' vegas-video'
      }

      if (transition) {
        el.className += ` vegas-transition-${transition}`
        el.className += ` vegas-transition-${transition}-in`
      }
    })

    this._timer(false)

    const go = () => {
      this._timer(true)

      setTimeout(() => {
        if (transition) {
          if (this.support.transition) {
            slides.forEach((el) => {
              el.style.transition = `all ${transitionDuration}ms`
              el.classList.add(`vegas-transition-${transition}-out`)

              const vid = el.querySelector('video')
              if (vid) {
                vid.volume = 1
                this._fadeOutSound(vid, transitionDuration)
              }
            })

            slideEl.style.transition = `all ${transitionDuration}ms`
            slideEl.classList.add(`vegas-transition-${transition}-in`)
          } else {
            // Fallback fade for browsers without CSS transitions
            slideEl.style.opacity = '0'
            slideEl.style.display = ''
            setTimeout(() => {
              slideEl.style.transition = `opacity ${transitionDuration}ms`
              slideEl.style.opacity = '1'
            }, 10)
          }
        }

        for (let i = 0; i < slides.length - this.settings.slidesToKeep; i++) {
          slides[i].remove()
        }

        this.trigger('walk')
        this._slideShow()
      }, 100)
    }

    if (video) {
      if (video.readyState === 4) {
        video.currentTime = 0
      }

      video.play()
      go()
    } else {
      img.src = src

      if (img.complete) {
        go()
      } else {
        img.onload = go
      }
    }
  }

  _end() {
    this.ended = !this.settings.autoplay
    this._timer(false)
    this.trigger('end')
  }

  shuffle() {
    for (let i = this.total - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [ this.settings.slides[i], this.settings.slides[rand] ] = [ this.settings.slides[rand], this.settings.slides[i] ]
    }
  }

  play() {
    if (this.paused) {
      this.paused = false
      this.next()
      this.trigger('play')
    }
  }

  pause() {
    this._timer(false)
    this.paused = true
    this.trigger('pause')
  }

  toggle() {
    if (this.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  playing() {
    return !this.paused && !this.noshow
  }

  current(advanced) {
    if (advanced) {
      return {
        slide: this.slide,
        data: this.settings.slides[this.slide]
      }
    }
    return this.slide
  }

  jump(nb) {
    if (nb < 0 || nb > this.total - 1 || nb === this.slide) {
      return
    }

    this.slide = nb
    this._goto(this.slide)
  }

  next() {
    this.slide++

    if (this.slide >= this.total) {
      if (!this.settings.loop) {
        this._end()
        return
      }
      this.slide = 0
    }

    this._goto(this.slide)
  }

  previous() {
    this.slide--

    if (this.slide < 0) {
      if (!this.settings.loop) {
        this.slide++
        return
      }
      this.slide = this.total - 1
    }

    this._goto(this.slide)
  }

  trigger(fn) {
    const params = fn === 'init'
      ? [ this.settings ]
      : [ this.slide, this.settings.slides[this.slide] ]

    this.elmt.dispatchEvent(new CustomEvent(`vegas${fn}`, { detail: params, bubbles: true }))

    if (typeof this.settings[fn] === 'function') {
      this.settings[fn].apply(this.elmt, params)
    }
  }

  options(key, value) {
    // Getter cases — early return
    if (typeof key !== 'object' && typeof key !== 'string') {
      return this.settings
    }
    if (typeof key === 'string' && typeof value === 'undefined') {
      return this.settings[key]
    }

    // Setter cases
    const oldSlides = this.settings.slides.slice()

    if (typeof key === 'object') {
      this.settings = Object.assign({}, defaults, vegas.defaults, key)
    } else {
      this.settings[key] = value
    }

    // In case slides have changed
    if (this.settings.slides !== oldSlides) {
      this.total = this.settings.slides.length
      this.noshow = this.total < 2
      this._preload()
    }

    return this.settings
  }

  destroy() {
    clearTimeout(this.timeout)

    this.elmt.classList.remove('vegas-container')

    this.elmt.querySelectorAll(':scope > .vegas-slide').forEach((el) => el.remove())

    // Restore original content
    const scrollable = this.elmt.querySelector(':scope > .vegas-content-scrollable')
    if (scrollable) {
      scrollable.querySelectorAll(':scope > .vegas-content > *').forEach((child) => {
        this.elmt.appendChild(child.cloneNode(true))
      })
      scrollable.remove()
    }

    if (this.settings.timer && this.timer) {
      this.timer.remove()
    }
    if (this.settings.overlay && this.overlay) {
      this.overlay.remove()
    }

    this.elmt._vegas = null
  }
}

function vegas(target, options) {
  const el = typeof target === 'string' ? document.querySelector(target) : target

  if (!el) {
    throw new Error('Vegas: element not found')
  }
  if (el._vegas) {
    return el._vegas
  }

  el._vegas = new Vegas(el, options)
  return el._vegas
}

vegas.defaults = {}

vegas.isVideoCompatible = () => true

export default vegas
