JavaScript Classes and Traits
=============================

A framework to declare Classes and Traits with ease in JS.
Inheritance of Classes and Traits is mapped onto the native Prototype model of JS which makes it stable and fast.

Jahcode runs in all modern browsers as well as in node.js. 

For documentation see http://jahcode.com

Setup
-----

Just use jahcode.js for development or the minified jahcode.min.js production environments.

Jahcode have no external dependencies except you wan't to support none ECMA 5 base browsers.
For those use the referred shims form the lib folder. Use both es5.shim.js and es5.sham.js to 
get most of the ecm5 features in older engines.

Running the Tests
----------------

The tests for jahcode are written with [jasmine](http://pivotal.github.io/jasmine/) acn can be executed in
node.js and in a browser.

* To run the tests in a browser just opne test/SpecRunner.html
* To run the tests in node.js install jahcode via npm and run the tests with jasmine-node test