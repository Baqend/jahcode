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

    it("should be converted to true", function() {
        var truly = [true, "test", 2, 3.3, /test/, [], [1,2,3], function() {}, new Date(), new Error()];

        for ( var i = 0; i < truly.length; ++i) {
            expect(Boolean.asInstance(truly[i])).toBeTruthy();
        }
    });

    it("should be converted to false", function() {
        var falsely = [false, "", 0, 0.0, undefined, NaN];

        for ( var i = 0; i < falsely.length; ++i) {
            expect(Boolean.asInstance(falsely[i])).toBeFalsy();
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

    it("should be converted to number", function() {
        var val = [true, false, "123", "22.45", 2, 3.3];
        var num = [1, 0, 123, 22.45, 2, 3.3];

        for ( var i = 0; i < val.length; ++i) {
            expect(Number.asInstance(val[i])).toBe(num[i]);
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

    it("should be converted to String", function() {
        var val = [true, false, 123, 22.45, "test"];
        var num = ["true", "false", "123", "22.45", "test"];

        for ( var i = 0; i < vals.length; ++i) {
            expect(String.asInstance(val[i])).toBe(num[i]);
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

    it("should be converted to Array", function() {
        var val = [[1,2,3], (function() {return arguments})(1,2,3), {0:1,1:2,2:3,length:3}];

        for ( var i = 0; i < val.length; ++i) {
            expect(Array.asInstance(val[i])).toEqual([1,2,3]);
        }
    });

    it("should be extendable", function() {
        var myArray = Array.inherit({
            prepend : function(el) {
                this.unshift(el);
            },
            append : function(el) {
                this.push(el);
            }
        });

        var arr = new myArray(1, 2, 3);
        expect(arr.length).toBe(3);

        expect(arr).isInstanceOf(Array);
        expect(arr).isInstanceOf(myArray);

        arr.prepend(5);
        expect(arr.length).toBe(4);

        arr.append(17);
        expect(arr.length).toBe(5);

        expect(arr[0]).toBe(5);
        expect(arr[1]).toBe(1);
        expect(arr[2]).toBe(2);
        expect(arr[3]).toBe(3);
        expect(arr[4]).toBe(17);
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

    it("should be extendable", function() {
        var myError = Error.inherit({
            initialize : function(message, state) {
                this.superCall(message);
                this.state = state;
            }
        });

        var err = new myError("A test error", 43);
        expect(err.state).toBe(43);
        expect(err.message).toBe("A test error");
        expect(err.stack.indexOf("A test error")).toBe(0);

        expect(err).isInstanceOf(Error);
        expect(err).isInstanceOf(myError);
    });
});