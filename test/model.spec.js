require('../jahcode.js');

describe("A complex model", function() {
    var TraitA = Trait.inherit({
        initialize : function() {
            this.fieldA = true;
        },

        overridden : function() {
            return "TraitA";
        },

        a : function() {
            return "A";
        }
    });

    var TraitB = TraitA.inherit({
        initialize : function() {
            this.fieldB = this.fieldA;
        },

        overridden : function() {
            return "TraitB " + this.superCall();
        },

        b : function() {
            return "B";
        }
    });

    var TraitC = TraitA.inherit({
        initialize : function() {
            this.fieldC = this.fieldA;
        },

        overridden : function() {
            return "TraitC " + this.superCall();
        },

        c : function() {
            return "C";
        }
    });

    var TraitD = TraitB.inherit(TraitC, {
        initialize : function() {
            this.fieldD = this.fieldC && this.fieldB;
        },

        overridden : function() {
            return "TraitD " + this.superCall();
        },

        d : function() {
            return "D";
        }
    });

    var ClassA = Object.inherit(TraitA, TraitB, {
        initialize : function() {
            this.fieldE = this.fieldA && this.fieldB;
        },

        overridden : function() {
            return "ClassA " + this.superCall();
        },

        a : function() {
            return "Class" + this.superCall();
        },

        e : function() {
            return "E";
        }
    });

    var ClassB = ClassA.inherit(TraitA, TraitC, TraitD, {
        initialize : function() {
            this.fieldF = this.fieldA && this.fieldC && this.fieldD && this.fieldE;
        },

        overridden : function() {
            return "ClassB " + this.superCall();
        },

        a : function() {
            return "ClassB " + this.superCall();
        },

        b : function() {
            return "Class" + this.superCall();
        },

        d : function() {
            return "ClassB " + this.superCall();
        },

        f : function() {
            return "F";
        }
    });

    it("shuold be available", function() {
        expect(TraitA).not.toBeUndefined();
        expect(TraitB).not.toBeUndefined();
        expect(TraitC).not.toBeUndefined();
        expect(TraitD).not.toBeUndefined();
        expect(ClassA).not.toBeUndefined();
        expect(ClassB).not.toBeUndefined();
    });

    it("should define TraitA correctly", function() {
        var types = [Object, Trait, TraitA];
        var otherTypes = [TraitB, TraitC, TraitD, ClassA, ClassB];
        expect(TraitA.linearizedTypes).toEqual(types);

        var t = new TraitA();

        expect(t.fieldA).toBeTruthy();
        expect(t.fieldB).toBeUndefined();
        expect(t.fieldC).toBeUndefined();
        expect(t.fieldD).toBeUndefined();
        expect(t.fieldE).toBeUndefined();
        expect(t.fieldF).toBeUndefined();
        expect(t.a()).toBe('A');
        expect(t.overridden()).toBe('TraitA');

        expect(t.constructor).toBe(TraitA);
        expect(t).hasPrototypeChain(types);

        expect(t).isInstanceOf(types);
        expect(t).asInstanceOf(types);
        expect(t).toBeCastable(types);

        expect(t).not.isInstanceOf(otherTypes);
        expect(t).not.asInstanceOf(otherTypes);
        expect(t).not.toBeCastable(otherTypes);

        expect(classOf(t)).toBe(TraitA);
    });

    it("should define TraitB correctly", function() {
        var types = [Object, Trait, TraitA, TraitB];
        var otherTypes = [TraitC, TraitD, ClassA, ClassB];
        expect(TraitB.linearizedTypes).toEqual(types);

        var t = new TraitB();

        expect(t.fieldA).toBeTruthy();
        expect(t.fieldB).toBeTruthy();
        expect(t.fieldC).toBeUndefined();
        expect(t.fieldD).toBeUndefined();
        expect(t.fieldE).toBeUndefined();
        expect(t.fieldF).toBeUndefined();
        expect(t.a()).toBe('A');
        expect(t.b()).toBe('B');
        expect(t.overridden()).toBe('TraitB TraitA');

        expect(t.constructor).toBe(TraitB);
        expect(t).hasPrototypeChain(types);

        expect(t).isInstanceOf(types);
        expect(t).asInstanceOf(types);
        expect(t).toBeCastable(types);

        expect(t).not.isInstanceOf(otherTypes);
        expect(t).not.asInstanceOf(otherTypes);
        expect(t).not.toBeCastable(otherTypes);

        expect(classOf(t)).toBe(TraitB);
    });

    it("should define TraitC correctly", function() {
        var types = [Object, Trait, TraitA, TraitC];
        var otherTypes = [TraitB, TraitD, ClassA, ClassB];
        expect(TraitC.linearizedTypes).toEqual(types);

        var t = new TraitC();

        expect(t.fieldA).toBeTruthy();
        expect(t.fieldB).toBeUndefined();
        expect(t.fieldC).toBeTruthy();
        expect(t.fieldD).toBeUndefined();
        expect(t.fieldE).toBeUndefined();
        expect(t.fieldF).toBeUndefined();
        expect(t.a()).toBe('A');
        expect(t.c()).toBe('C');
        expect(t.overridden()).toBe('TraitC TraitA');

        expect(t.constructor).toBe(TraitC);
        expect(t).hasPrototypeChain(types);

        expect(t).isInstanceOf(types);
        expect(t).asInstanceOf(types);
        expect(t).toBeCastable(types);

        expect(t).not.isInstanceOf(otherTypes);
        expect(t).not.asInstanceOf(otherTypes);
        expect(t).not.toBeCastable(otherTypes);

        expect(classOf(t)).toBe(TraitC);
    });

    it("should define TraitD correctly", function() {
        var types = [Object, Trait, TraitA, TraitB, TraitC, TraitD];
        var otherTypes = [ClassA, ClassB];
        expect(TraitD.linearizedTypes).toEqual(types);

        var t = new TraitD();

        expect(t.fieldA).toBeTruthy();
        expect(t.fieldB).toBeTruthy();
        expect(t.fieldC).toBeTruthy();
        expect(t.fieldD).toBeTruthy();
        expect(t.fieldE).toBeUndefined();
        expect(t.fieldF).toBeUndefined();
        expect(t.a()).toBe('A');
        expect(t.b()).toBe('B');
        expect(t.c()).toBe('C');
        expect(t.d()).toBe('D');
        expect(t.overridden()).toBe('TraitD TraitC TraitB TraitA');

        expect(t.constructor).toBe(TraitD);
        expect(t).hasPrototypeChain(types);

        expect(t).isInstanceOf(types);
        expect(t).asInstanceOf(types);
        expect(t).toBeCastable(types);

        expect(t).not.isInstanceOf(otherTypes);
        expect(t).not.asInstanceOf(otherTypes);
        expect(t).not.toBeCastable(otherTypes);

        expect(classOf(t)).toBe(TraitD);
    });

    it("should define ClassA correctly", function() {
        var types = [Object, TraitA, TraitB, ClassA];
        var otherTypes = [TraitC, TraitD, ClassB, Trait];
        expect(ClassA.linearizedTypes).toEqual(types);

        var t = new ClassA();

        expect(t.fieldA).toBeTruthy();
        expect(t.fieldB).toBeTruthy();
        expect(t.fieldC).toBeUndefined();
        expect(t.fieldD).toBeUndefined();
        expect(t.fieldE).toBeTruthy();
        expect(t.fieldF).toBeUndefined();
        expect(t.a()).toBe('ClassA');
        expect(t.b()).toBe('B');
        expect(t.e()).toBe('E');
        expect(t.overridden()).toBe('ClassA TraitB TraitA');

        expect(t.constructor).toBe(ClassA);
        expect(t).hasPrototypeChain(types);

        expect(t).isInstanceOf(types);
        expect(t).asInstanceOf(types);
        expect(t).toBeCastable(types);

        expect(t).not.isInstanceOf(otherTypes);
        expect(t).not.asInstanceOf(otherTypes);
        expect(t).not.toBeCastable(otherTypes);

        expect(classOf(t)).toBe(ClassA);
    });

    it("should define ClassA correctly", function() {
        var types = [Object, TraitA, TraitB, ClassA, TraitC, TraitD, ClassB];
        var otherTypes = [Trait];
        expect(ClassB.linearizedTypes).toEqual(types);

        var t = new ClassB();

        expect(t.fieldA).toBeTruthy();
        expect(t.fieldB).toBeTruthy();
        expect(t.fieldC).toBeTruthy();
        expect(t.fieldD).toBeTruthy();
        expect(t.fieldE).toBeTruthy();
        expect(t.fieldF).toBeTruthy();
        expect(t.a()).toBe('ClassB ClassA');
        expect(t.b()).toBe('ClassB');
        expect(t.c()).toBe('C');
        expect(t.d()).toBe('ClassB D');
        expect(t.e()).toBe('E');
        expect(t.f()).toBe('F');
        expect(t.overridden()).toBe('ClassB TraitD TraitC ClassA TraitB TraitA');

        expect(t.constructor).toBe(ClassB);
        expect(t).hasPrototypeChain(types);

        expect(t).isInstanceOf(types);
        expect(t).asInstanceOf(types);
        expect(t).toBeCastable(types);

        expect(t).not.isInstanceOf(otherTypes);
        expect(t).not.asInstanceOf(otherTypes);
        expect(t).not.toBeCastable(otherTypes);

        expect(classOf(t)).toBe(ClassB);

        expect(t instanceof ClassA).toBeTruthy();
        expect(t instanceof ClassB).toBeTruthy();
    });
});
