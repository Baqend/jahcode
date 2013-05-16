require('../jahcode.js');

describe("Native booleans", function() {
    var vals = [true, false, Boolean(true), new Boolean(false)];

    it("should be instanceof Boolean", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(vals[i]).asInstanceOf(Object, Boolean);
        }
    });

    it("should be instances of Boolean", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(classOf(vals[i])).toBe(Boolean);
        }
    });
});

describe("Native numbers", function() {
    var vals = [0, 1, 17.43, Number(1), new Number(1)];

    it("should be instanceof Number", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(vals[i]).asInstanceOf(Object, Number);
        }
    });

    it("should be instances of Number", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(classOf(vals[i])).toBe(Number);
        }
    });
});

describe("Native strings", function() {
    var vals = ["", "a", String("a"), new String("a"), "4"];

    it("should be instanceof String", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(vals[i]).asInstanceOf(Object, String);
        }
    });

    it("should be instances of String", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(classOf(vals[i])).toBe(String);
        }
    });
});

describe("Native regular expressions", function() {
    var vals = [/foo/, new RegExp("asdf")];

    it("should be instanceof RegExp", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(vals[i]).asInstanceOf(Object, RegExp);
        }
    });

    it("should be instances of RegExp", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(classOf(vals[i])).toBe(RegExp);
        }
    });
});

describe("Native arrays", function() {
    var vals = [[], [1], new Array(10), new Array(3, 7, 8, 6, 5)];

    it("should be instanceof Array", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(vals[i]).asInstanceOf(Object, Array);
        }
    });

    it("should be instances of Array", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(classOf(vals[i])).toBe(Array);
        }
    });
});

describe("Native dates", function() {
    var vals = [new Date()];

    it("should be instanceof Date", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(vals[i]).asInstanceOf(Object, Date);
        }
    });

    it("should be instances of Date", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(classOf(vals[i])).toBe(Date);
        }
    });
});

describe("Native functions", function() {
    function test() {
    }

    var vals = [test, new Function("return;"), function() {
    }];

    it("should be instanceof Function", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(vals[i]).asInstanceOf(Object, Function);
        }
    });

    it("should be instances of Function", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(classOf(vals[i])).toBe(Function);
        }
    });
});

describe("Native errors", function() {
    var vals = [new Error(), new TypeError()];

    it("should be instanceof Error", function() {
        for ( var i = 0; i < vals.length; ++i) {
            expect(vals[i]).asInstanceOf(Object, Error);
        }
    });

    it("should be instanceof of there concrete types", function() {
        expect(new TypeError()).asInstanceOf(Object, TypeError);
    });

    it("should return the concrete error class", function() {
        expect(classOf(vals[0])).toBe(Error);
        expect(classOf(vals[1])).toBe(TypeError);
    });
});