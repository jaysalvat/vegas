Packaging [vegas](http://vegas.jaysalvat.com) for [Meteor.js](http://meteor.com).

[DEMO](http://vagesdemo.meteor.com)


# Meteor

If you're new to Meteor, here's what the excitement is all about -
[watch the first two minutes](https://www.youtube.com/watch?v=fsi0aJ9yr2o); you'll be hooked by 1:28.
That screencast is from 2012. In the meantime, Meteor has become a mature JavaScript-everywhere web
development framework. Read more at [Why Meteor](http://www.meteorpedia.com/read/Why_Meteor).

# Usage

For a template named eg. 'home' add this to the client, to create and destroy the slideshow:

```javascript
Template.home.onCreated( function() {
  $('body').vegas({
    overlay: '/packages/las_vegas/dist/overlays/02.png',
    transition: 'fade',
    transitionDuration: 4000,
    delay: 10000,
    animation: 'random',
    animationDuration: 20000,
    slides: [
      { src: '/img/slide1.jpg' },
      { src: '/img/slide2.jpg' },
      { src: '/img/slide3.jpg' }
    ]
  });
});

Template.home.onDestroyed(function(){
  $('body').vegas('destroy');
});

```

## Overlay images
Vegas’s default overlay images are automatically supplied to your app after adding the package to your app, via:
```
/packages/las_vegas/dist/overlays/[01-08].png
```
# Issues

If you encounter an issue while using this package, please CC @mperkh when you file it in this repo.


# DONE

* Instantiation test
