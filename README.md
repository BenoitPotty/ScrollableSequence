# Scrollable Sequence

## Description

This script produce the video scroll effect that we can find on the [Apple Website's](https://www.apple.com/airpods-pro/).

This script is inspired from the article on [CSS Tricks](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/).

## Documentation

### General
To produce this effect, the scripts uses a `<canvas>` HTMLElement to draw the images on scroll event. The transition is done using the `requestAnimationFrame` javascript method.

All the images of the animated sequence should be stored in a directory, and named buy there index, without or without number padding, and in a continuous sequence. Example : 

```
1.jpg
2.jpg

[...]

10.jpg
```

The script will draw the image using a `scalle-to-fit` sizing. This sizing is computed for each image, and at every window `resize` event. 

### Usage
The whole script is contained in a `ScrollableSequence` class. The class uses the `data-` attributes of the `<canvas>` element to make its configuration. 

Parameters are : 
- `data-framecount`: The number of image to use in the animation. Error will be thrown if not set.
- `data-imagepath`: Path to the image. More precisely, a format patter for building the image path. Will be used in the image `src` attribute. Can be URL. This variable must contain the `{framenumber}` replacement token. It will be automatically replaced by the current frame number. Error will be thrown if not set, or not containing the replacement token.
- `data-framenumbepading`:  The number of digits that represents the Frame Number. This number will be used with a `padStart()` method in the file name generation. Default is `0`;

In order to be responsive, it is required to encapsulate the `<canvas>` HTMLElement into a `<div>` HTMLElement. The `ScrollableSequence` class will adapt the size of the `<canvas>` to it's parent container. Give the parent the desired responsive size. 

``` HTML
<div id="sequence-container">
    <canvas id="sequence-canvas" data-framecount="200" data-imagepath="/images/ezgif-frame-{framenumber}.jpg" data-framenumberpading="3"></canvas>
</div>
```

### Script activation
Instanciate the `ScrollableSequence` class and call it's `init()` method.

Constructor of the class requires the `canvasId` parameter, which is the `id` given to the `<canvas>` HTMLElement.

``` html
<script>
    new ScrollableSequence("sequence-canvas").init();
</script>
```

### Style
In order to produce the correct effect when scrolling, the `canvas`, or better the containing parent (see responsive), must have the CSS `postion` attribute set to `fixed`.

### Image preload
To ensure a smooth animation, all images will be preloaded in the browser cach at the initialisation of the script.

### Images source 
All image are extracted from the free Pexels video [Drone Footage Of A Mountain Landscape With Snow](https://www.pexels.com/video/drone-footage-of-a-mountain-landscape-with-snow-2871918/)