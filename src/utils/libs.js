
export const resizedataURL = (datas) => {
  return new Promise(async function (resolve) {

    // We create an image to receive the Data URI
    var img = document.createElement('img');
    var resize_width = 220
    // When the event "onload" is triggered we can resize the image.
    img.onload = function (el) {
      var elem = document.createElement('canvas');//create a canvas
      var ctx = elem.getContext('2d');

      var scaleFactor = resize_width / el.target.width

      elem.width = resize_width
      elem.height = el.target.height * scaleFactor


      ctx.drawImage(this, 0, 0, elem.width, elem.height)

      var dataURI = elem.toDataURL();

      resolve(dataURI);
    };

    // We put the Data URI in the image's src attribute
    img.src = datas;

  })
}

export const debounce = (func, delay) => {
  var timeout
  return function () {
    var context = this, args = arguments
    var later = function () {
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, delay || 500)
  }
}


