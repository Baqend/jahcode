require('../jahcode.js');

describe("Bind trait", function() {
    it("should add a bind property", function() {
        var Test = Object.inherit(Bind, {
            counter : 0,

            testMethod : function() {
                this.counter++;
            }
        });

        var test = new Test();
        expect(test.counter).toBe(0);

        test.testMethod();
        expect(test.counter).toBe(1);

        expect(test.bind).not.toBeUndefined();
        expect(test.bind.testMethod).isInstanceOf(Function);

        test.bind.testMethod();
        expect(test.counter).toBe(2);

        var testMethod = test.bind.testMethod;
        testMethod();
        expect(test.counter).toBe(3);
    });

    it("should bind to the correct scope", function() {
        var Test = Object.inherit(Bind, {
            counter : 0,

            testMethod : function() {
                this.counter++;
            }
        });

        var test1 = new Test();
        var test2 = new Test();

        expect(test2.bind.testMethod).not.toBe(test1.bind.testMethod);

        test1.bind.testMethod();
        expect(test1.counter).toBe(1);
        expect(test2.counter).toBe(0);

        test2.bind.testMethod();
        expect(test1.counter).toBe(1);
        expect(test2.counter).toBe(1);

        var test1Method = test1.bind.testMethod;
        var test2Method = test2.bind.testMethod;

        test1Method();
        test2Method();

        expect(test1.counter).toBe(2);
        expect(test2.counter).toBe(2);
    });

    it("should behave correctly in inheritances", function() {
        var A = Object.inherit({
            counterA : 0,

            a : function() {
                this.counterA++;
            },

            test : function() {
                this.a();
            }
        });

        var B = A.inherit(Bind, {
            counterB : 0,

            b : function() {
                this.counterB++;
            },

            test : function() {
                this.b();
                this.superCall();
            }
        });

        var C = B.inherit({
            counterC : 0,

            c : function() {
                this.counterC++;
            },

            test : function() {
                this.c();
                this.superCall();
            }
        });

        var a = new A();
        expect(a.bind).toBeUndefined();

        var b = new B();

        b.bind.a();
        expect(b.counterA).toBe(1);
        expect(b.counterB).toBe(0);

        b.bind.b();
        expect(b.counterA).toBe(1);
        expect(b.counterB).toBe(1);

        b.bind.test();
        expect(b.counterA).toBe(2);
        expect(b.counterB).toBe(2);

        var c = new C();

        c.bind.a();
        expect(c.counterA).toBe(1);
        expect(c.counterB).toBe(0);
        expect(c.counterC).toBe(0);

        c.bind.b();
        expect(c.counterA).toBe(1);
        expect(c.counterB).toBe(1);
        expect(c.counterC).toBe(0);

        c.bind.c();
        expect(c.counterA).toBe(1);
        expect(c.counterB).toBe(1);
        expect(c.counterC).toBe(1);

        c.bind.test();
        expect(c.counterA).toBe(2);
        expect(c.counterB).toBe(2);
        expect(c.counterC).toBe(2);
    });

    it("should pass paramaters", function() {
        var Test = Object.inherit(Bind, {
            value : null,

            testMethod : function(val1, val2) {
                this.value = val2;
                return val1;
            }
        });

        var test = new Test();
        expect(test.value).toBeNull();

        expect(test.bind.testMethod("abc", "def")).toBe("abc");
        expect(test.value).toBe("def");
    });

    it("should return always the same bound method", function() {
        var Test = Object.inherit(Bind, {
            counter : 0,

            testMethod : function() {
                this.counter++;
            }
        });

        var test = new Test();

        testMethod = test.bind.testMethod;

        expect(testMethod).toBe(test.bind.testMethod);
    });

    it("should supply a static create method", function() {
        var Test = Object.inherit({
            counter : 0,

            testMethod : function() {
                this.counter++;
            }
        });

        var test1 = new Test();
        var test2 = new Test();

        var b1 = Bind.create(test1);
        var b2 = Bind.create(test2);

        b1.testMethod();
        expect(test1.counter).toBe(1);
        expect(test2.counter).toBe(0);

        b2.testMethod();
        b2.testMethod();
        expect(test1.counter).toBe(1);
        expect(test2.counter).toBe(2);
    });
});