JavaScript Classes and Traits
=============================

A framework to declare Classes and Traits with ease in JavaScript.
Inheritance of Classes and Traits is mapped onto the native Prototype model of JS which makes it stable and fast.

Jahcode runs in all modern browsers as well as in Node.js. 

For documentation see http://jahcode.com

Setup
-----

Just use jahcode.js for development or the minified jahcode.min.js for production environments.

Jahcode has no external dependencies unless you would like to support non-ECMA-5 browsers.
For those, use the referenced shims form the lib folder. Use both es5.shim.js and es5.sham.js to 
get most of the ECMA 5 features in older engines.

Running the Tests
----------------

The tests for jahcode are written with [jasmine](https://jasmine.github.io/) can can be executed in
node.js and browsers.

* To run the tests in a browser just open test/SpecRunner.html
* To run the tests in node.js install jahcode via npm and run the tests with jasmine-node test
