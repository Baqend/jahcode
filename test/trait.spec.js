require('../jahcode.js');

describe("An Instances of", function() {
    var myTrait = Trait.inherit({
        initialize : function() {
            this.field = true;
        },
        fieldValue : function() {
            return this.field;
        }
    });

    describe("a Trait", function() {
        it("should be instance of the trait", function() {
            var t = new myTrait();

            expect(t instanceof Trait).toBeTruthy();
            expect(t instanceof myTrait).toBeTruthy();

            expect(t).isInstanceOf(Trait);
            expect(t).isInstanceOf(myTrait);
            expect(t).asInstanceOf(myTrait);
        });

        it("should contain all members", function() {
            var t = new myTrait();

            expect(t.field).toBeTruthy();
            expect(t.fieldValue()).toBeTruthy();
        });
    });

    describe("a extended Trait", function() {
        var myExtTrait = myTrait.inherit({
            initialize : function() {
                this.extField = true;
            },
            extFieldValue : function() {
                return this.field && this.extField;
            }
        });

        it("should be instance of the extended trait", function() {
            var t = new myExtTrait();

            expect(t instanceof Trait).toBeTruthy();
            expect(t instanceof myTrait).toBeTruthy();
            expect(t instanceof myExtTrait).toBeTruthy();

            expect(t).isInstanceOf(Trait);
            expect(t).isInstanceOf(myTrait);
            expect(t).asInstanceOf(myTrait);
            expect(t).isInstanceOf(myExtTrait);
            expect(t).asInstanceOf(myExtTrait);
        });

        it("should contain all members", function() {
            var t = new myExtTrait();

            expect(t.field).toBeTruthy();
            expect(t.fieldValue()).toBeTruthy();
            expect(t.extField).toBeTruthy();
            expect(t.extFieldValue()).toBeTruthy();
        });
    });

    describe("a mixined Trait", function() {
        var myExtTrait = Trait.inherit(myTrait, {
            initialize : function() {
                this.extField = true;
            },
            extFieldValue : function() {
                return this.field && this.extField;
            }
        });

        it("should be instance of the mixined trait", function() {
            var t = new myExtTrait();

            expect(t instanceof Trait).toBeTruthy();
            // mixined traits can not be checked with native instanceof
            expect(t instanceof myTrait).toBeFalsy();
            expect(t instanceof myExtTrait).toBeTruthy();

            expect(t).isInstanceOf(Trait);
            expect(t).isInstanceOf(myTrait);
            expect(t).asInstanceOf(myTrait);
            expect(t).isInstanceOf(myExtTrait);
            expect(t).asInstanceOf(myExtTrait);
        });

        it("should contain all members", function() {
            var t = new myExtTrait();

            expect(t.field).toBeTruthy();
            expect(t.fieldValue()).toBeTruthy();
            expect(t.extField).toBeTruthy();
            expect(t.extFieldValue()).toBeTruthy();
        });
    });
});
