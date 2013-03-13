;(function($, undefined){
  'use strict';

  // Provides this syntax:
  //
  //   $(img).afterImageLoad(someUrl, successCallback, optionalFailureCallback, useCors);
  //
  $.fn.afterImageLoad = function(newSrc, successCallback, failureCallback, useCors) {

    var img = this,
        failureCallback = (failureCallback || function(){}),
        scannableSrc = newSrc.slice(0, 512);

    // Data URLs can be considered loaded.
    //
    if (scannableSrc.indexOf('base64') > 0) {
      var loadedHandler = function(){
        img.unbind('load', loadedHandler);
        img.unbind('error', failureCallback);
        successCallback(img);
      }

      img.bind('error', failureCallback);
      img.bind('load', loadedHandler);

      img.attr('src', newSrc);

      // Returns img
      //
      return img;
    }

    if (useCors) {
      img.attr('crossOrigin', 'Anonymous');
    }

    // For other requests, attach a handler then
    // fire the src. If it is cached and loaded,
    // call the callback by hand.
    //
    var loadedHandler = function(){
      img.unbind('load', loadedHandler);
      img.unbind('error', failureCallback);
      successCallback(img);
    }

    img.bind('error', failureCallback);
    img.bind('load', loadedHandler);

    img.attr('src', newSrc);

    if (img[0].complete || img[0].readyState) {
      loadedHandler();
    }

    // Returns img
    //
    return img;
  }

  // Provides two additional syntaxes:
  //
  //   $.afterImageLoad(imgEl, someUrl, successCallback, optionalFailureCallback, useCors);
  //   $.afterImageLoad(someUrl, successCallback, optionalFailureCallback, useCors);
  //
  $.afterImageLoad = function(img, newSrc, successCallback, failureCallback, useCors) {
    if ($.type(img) == 'string') {
      var failureCallback = successCallback,
          successCallback = newSrc,
          newSrc = img,
          useCors = failureCallback,
          img = $('<img />');
    } else {
      var img = $(img);
    }
    img.afterImageLoad(newSrc, successCallback, failureCallback, useCors);
  }

}(jQuery));
