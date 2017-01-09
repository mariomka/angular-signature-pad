# blinkmobile / angular-signature-pad [![npm](https://img.shields.io/npm/v/@blinkmobile/angular-signature-pad.svg?maxAge=2592000)](https://www.npmjs.com/package/@blinkmobile/angular-signature-pad) [![AppVeyor Status](https://img.shields.io/appveyor/ci/blinkmobile/angular-signature-pad/master.svg)](https://ci.appveyor.com/project/blinkmobile/angular-signature-pad) [![Travis CI Status](https://travis-ci.org/blinkmobile/angular-signature-pad.svg?branch=master)](https://travis-ci.org/blinkmobile/angular-signature-pad)

AngularJS 1.x component for smooth canvas based signature drawing

_This component does not apply any styling, it only places the canvas
and allows you to bind your component to the signature pad by exposing
the functionality provided by [signature_pad](https://github.com/szimek/signature_pad).
This means you must execute the exposed functions from your own buttons, events etc..._

## Installation

1.  Install this module and [signature_pad](https://github.com/szimek/signature_pad) using npm

    ```
    npm install @blinkmobile/angular-signature-pad signature_pad@1.5.x --save
    ```

1.  Add the module to your app

    ```js
    angular.module('app', [
      'bmSignaturePad',
    ]);
    ```

1.  Ensure these two modules are loaded e.g.

    ```html
    <!DOCTYPE html>
    <html ng-app="app">
    <head>
      <script src="node_modules/signature_pad/signature_pad.js"></script>
      <script src="node_modules/bm-signature-pad/bm-signature-pad.js"></script>
    </head>
    <body>
      ...
    </body>
    </html>
    ```

## Usage

### Basics

```html
<bm-signature-pad ng-model="$ctrl.signature"></bm-signature-pad>

<img ng-show="$ctrl.signature"
     ng-src="{{ $ctrl.signature }}"></image>
```

### Attributes

_All attributes are optional with the exception of ngModel_

Attribute       |Value       |Comments
----------------|------------|--------
`ngModel`       |String      |Reference to bind value of signature pad to. When `ngModel` is set, `crop`, `imageType` and `imageEncoder` attribute values will be used.
`options`       |Object      |All [signature_pad options](https://github.com/szimek/signature_pad#options) are valid.
`crop`          |Expression  |Return a truthy value if the signature should be cropped of white space when `ngModel` is set.
`imageType`     |Expression  |Return an image type to use when `ngModel` is set. See [HTMLCanvasElement.toDataUrl() type parameter](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL#Parameters) for options and default
`imageEncoder`  |Expression  |Return an image encoder to use when `ngModel` is set. See [HTMLCanvasElement.toDataUrl() encoderOptions parameter](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL#Parameters) for options and default
`scale-down`    |Expression  |Return a truthy value if the signature should be scaled down when calling the function exposed via `resize`.
`clear`         |Expression  |Exposes the `clear()` function provided by _signature_pad_  as `$fn`.
`resize`        |Expression  |Exposes the `resize()` function provided by _signature_pad_  as `$fn`. However, the `width` and `height` will be set to width and height of the canvas' parent element and the `scaleDown` argument will be set to the value of the `scale-down` attribute.
`get-signature` |Expression  |Exposes a function as `$fn` that takes the same arguments as [HTMLCanvasElement.toDataUrl()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) and returns the signature as a [DataUrl](https://developer.mozilla.org/en-US/docs/Web/HTTP/BasURIs).<br>Will return `undefined` if the canvas is empty<br>If the value of the `crop` attribute is truthy, the signature will be cropped of white space before generating a DataUrl<br>Otherwise the DataUrl will contain the entire canvas

### Recommendations

-   Try not to use CSS to manage the `width` or `height` of the `canvas` element. Instead, make use of the exposed `resize()` function which will change the `width` and `height` attributes of the canvas. For more details, see [Sizing The Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#Sizing_the_canvas)

    > The displayed size of the canvas can be changed using a stylesheet. The image is scaled during rendering to fit the styled size. If your renderings seem distorted, try specifying your width and height attributes explicitly in the <canvas> attributes, and not using CSS.

-   If you would like the background of the `canvas` to be something other than white, use CSS to change the background instead of setting the `options.backgroundColor`. Setting this option will prevent cropping from working correctly.

## Example

**Note**: The examples make use of a `resize` event on the `window` object and also `$scope.$watch` a DOM element property.
Both of these practices are valid JavaScript and AngularJS, however, neither are ideal in production circumstances.

For more details on the `resize` event, see [Event Reference: resize](https://developer.mozilla.org/en-US/docs/Web/Events/resize):

> Since resize events can fire at a high rate, the event handler shouldn't execute computationally expensive operations such as DOM modifications.

For more details on `$scope.$watch` best practices, see [Scope `$watch` Performance Considerations](https://docs.angularjs.org/guide/scope#scope-watch-performance-considerations):

> Dirty checking the scope for property changes is a common operation in Angular and for this reason the dirty checking function must be efficient. Care should be taken that the dirty checking function does not do any DOM access, as DOM access is orders of magnitude slower than property access on JavaScript object.

### Instructions

1.  Install [Node 6.x](https://nodejs.org/en/download/) or higher

1.  Clone this repository

1.  Install dependencies

    ```
    npm install
    ```

1.  Start demo

    ```
    npm start
    ```

1.  Open [http://localhost:8080/example/](http://localhost:8080/example/) in your browser
