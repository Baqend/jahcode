require('../jahcode.js');

describe("Class declaration", function() {
    var myClass = Object.inherit({
        initialize : function(a, b, c) {
            this.called = true;
            this.params = [a, b, c];
        },

        error: function() {
            throw 'myClass';
        }
    });

    it("should call the initialize method at instantiation", function() {
        var obj = new myClass(1, 2, 3);
        expect(obj.params).toEqual([1, 2, 3]);
    });

    it("should add static members", function() {
        var myExtClass = myClass.inherit({
            extend : {
                create : function() {
                    return new this(1, 2, 3);
                },
                getInstance : function() {
                    return this.create();
                }
            }
        });

        expect(myExtClass.create()).isInstanceOf(myExtClass);
        expect(myExtClass.getInstance()).isInstanceOf(myExtClass);
    });

    it("should call the static initialize method", function() {
        var myExtClass = myClass.inherit({
            extend : {
                initialize : function() {
                    this.called = true;
                }
            }
        });

        expect(myExtClass.called).toBeTruthy();
    });

    describe("with extending a class", function() {
        it("should call both initialize methods at instantiation", function() {
            var myExtClass = myClass.inherit({
                initialize : function(a, b, c, d, e) {
                    this.superCall(a, b, c);
                    this.params.push(d, e);
                }
            });

            var obj = new myExtClass(1, 2, 3, 4, 5);
            expect(obj.params).toEqual([1, 2, 3, 4, 5]);
        });

        it("should call the implicit initialize method at instantiation", function() {
            var myExtClass = myClass.inherit({
            // no explicit super call
            });

            var obj = new myExtClass();
            expect(obj.called).toBeTruthy();
        });

        it("should call the super initialize method at instantiation", function() {
            var myExtClass = myClass.inherit({
                initialize : function() {
                    this.extCalled = true;
                }
            });

            var obj = new myExtClass();
            expect(obj.called).toBeTruthy();
            expect(obj.extCalled).toBeTruthy();
        });

        it("should call the super and super.super constructor at instantiation", function() {
            var myExtClass = myClass.inherit({
                initialize : function() {
                    this.extCalled = true;
                }
            });

            var myExtExtClass = myExtClass.inherit({
                initialize : function() {
                    this.superCall();

                    this.extExtCalled = true;
                }
            });

            var obj = new myExtExtClass();
            expect(obj.called).toBeTruthy();
            expect(obj.extCalled).toBeTruthy();
            expect(obj.extExtCalled).toBeTruthy();
        });

        it("should work exceptions throwing in a superCall", function() {
            var myExtClass = myClass.inherit({
                error: function() {
                   try {
                       this.superCall();
                   } catch (e) {
                        throw e + ' myExtClass';
                   }
                }
            });

            var myExtExtClass = myExtClass.inherit({
                error: function() {
                    try {
                        this.superCall();
                    } catch (e) {
                        throw e + ' myExtExtClass';
                    }
                }
            });

            var obj = new myExtExtClass();
            expect(function() { obj.error(); }).toThrow('myClass myExtClass myExtExtClass');
            expect(obj.superCall).toBeUndefined();
        });
    });

    describe("with property", function() {
        it("constructor should overwrite the default constructor", function() {
            var myClass = Object.inherit({
                constructor: function(a,b,c) {
                    this.a = a;
                    this.b = b;
                    this.c = c;
                }
            });

            var cls = new myClass(1,2,3);
            expect(cls.a).toEqual(1);
            expect(cls.b).toEqual(2);
            expect(cls.c).toEqual(3);
        });

        it("should define simple property", function() {
            var myClass = Object.inherit({
                test: 34
            });

            expect(new myClass().test).toEqual(34);
        });

        it("should define function property", function() {
            var myClass = Object.inherit({
                test: function() {
                    return 34;
                }
            });

            expect(new myClass().test()).toEqual(34);
        });

        it("should define object property", function() {
            var myClass = Object.inherit({
                test: {
                    val: 34
                }
            });

            expect(new myClass().test.val).toEqual(34);
        });

        it("should define ecma descriptor property", function() {
            var myClass = Object.inherit({
                test: {
                    value: 34
                }
            });

            expect(new myClass().test).toEqual(34);
        });

        /* ie8 throws a syntax error for following test cases */
        it("should define native getter and setter property", function() {
            var myClass = Object.inherit({
                get test() {
                    return this._test;
                },
                set test(val) {
                    this._test = val;
                }
            });

            var cls = new myClass();
            cls.test = 34;
            expect(cls.test).toEqual(34);
        });

        it("should define ecma descriptor getter and setter property", function() {
            var myClass = Object.inherit({
                test: {
                    get: function() {
                        return this._test;
                    },
                    set: function(val) {
                        this._test = val;
                    }
                }
            });

            var cls = new myClass();
            cls.test = 34;
            expect(cls.test).toEqual(34);
        });
    });
});
