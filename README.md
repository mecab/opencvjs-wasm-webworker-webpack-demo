opencvjs-wasm-webworker-webpack-demo
====================================

A demo of in-browser face detection, using
[OpenCV.js](https://docs.opencv.org/3.4.2/d4/da1/tutorial_js_setup.html)
built as [WebAssembly (WASM)](https://webassembly.org/), running through
[Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) and
bundled by [webpack](https://webpack.js.org/).

Hopefully to be a good scaffold to start any OpenCV.js projects.

![screenshot](doc/screenshot.png)

How to run
----------

```bash
$ npm install
$ npm run debug
```

(Debug/development purpose. Your modification will show up soon by
`webpack --watch` and `node-dev`)

or

```bash
$ npm install
$ npm run build
$ npm start
```

(Production purpose. Produces minified JS, however you will need to
build the assets to reflect your edit.)
