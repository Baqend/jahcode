function assertPrototypeChain(expected, actual) {
	var proto = actual;
	for (var i = expected.length - 1, cls; cls = expected[i]; --i) {
		proto = Object.getPrototypeOf(proto);
		assertSame(cls, proto.constructor);
	}
}

function assertIsInstanceOf(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertTrue(actual.isInstanceOf(cls));
	}
}

function assertNotIsInstanceOf(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertFalse(actual.isInstanceOf(cls));
	}
}

function assertAsInstanceOf(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertNoException(function() {
			actual.asInstanceOf(cls);
		});
	}
}

function assertNotAsInstanceOf(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertException(function() {
			actual.asInstanceOf(cls);
		});
	}
}

function assertClassCast(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertSame(cls(actual), actual);
	}
}

function assertNotClassCast(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertNull(cls(actual));
	}
}

TestCase("TestIneritance", {
	tearDown: function() {
		
	},
	testAvailability : function() {
		assertNotUndefined(TraitB);
		assertNotUndefined(TraitC);
		assertNotUndefined(TraitD);
		assertNotUndefined(ClassA);
		assertNotUndefined(ClassB);
	},
	testTraitA : function() {
		var types = [Object, TraitA];
		var otherTypes = [TraitB, TraitC, TraitD, ClassA, ClassB];
		assertEquals(types, TraitA.linearizedTypes);
		
		var t = new TraitA();
		
		assertTrue(t.fieldA);
		assertUndefined(t.fieldB);
		assertUndefined(t.fieldC);
		assertUndefined(t.fieldD);
		assertUndefined(t.fieldE);
		assertUndefined(t.fieldF);
		assertSame('A', t.a());
		assertSame('TraitA', t.overridden());
		
		assertSame(TraitA, t.constructor);
		assertPrototypeChain(types, t);
		
		assertIsInstanceOf(types, t);
		assertAsInstanceOf(types, t);
		assertClassCast(types, t);
		
		assertNotIsInstanceOf(otherTypes, t);
		assertNotAsInstanceOf(otherTypes, t);
		assertNotClassCast(otherTypes, t);
	},
	testTraitB : function() {
		var types = [Object, TraitA, TraitB];
		var otherTypes = [TraitC, TraitD, ClassA, ClassB];
		assertEquals(types, TraitB.linearizedTypes);
		
		var t = new TraitB();

		assertTrue(t.fieldA);
		assertTrue(t.fieldB);
		assertUndefined(t.fieldC);
		assertUndefined(t.fieldD);
		assertUndefined(t.fieldE);
		assertUndefined(t.fieldF);
		assertSame('A', t.a());
		assertSame('B', t.b());
		assertSame('TraitB TraitA', t.overridden());
		
		assertSame(TraitB, t.constructor);
		assertPrototypeChain(types, t);
		
		assertIsInstanceOf(types, t);
		assertAsInstanceOf(types, t);
		assertClassCast(types, t);
		
		assertNotIsInstanceOf(otherTypes, t);
		assertNotAsInstanceOf(otherTypes, t);
		assertNotClassCast(otherTypes, t);
	},
	testTraitC : function() {
		var types = [Object, TraitA, TraitC];
		var otherTypes = [TraitB, TraitD, ClassA, ClassB];
		assertEquals(types, TraitC.linearizedTypes);
		
		var t = new TraitC();

		assertTrue(t.fieldA);
		assertUndefined(t.fieldB);
		assertTrue(t.fieldC);
		assertUndefined(t.fieldD);
		assertUndefined(t.fieldE);
		assertUndefined(t.fieldF);
		assertSame('A', t.a());
		assertSame('C', t.c());
		assertSame('TraitC TraitA', t.overridden());
		
		assertSame(TraitC, t.constructor);
		assertPrototypeChain(types, t);
		
		assertIsInstanceOf(types, t);
		assertAsInstanceOf(types, t);
		assertClassCast(types, t);
		
		assertNotIsInstanceOf(otherTypes, t);
		assertNotAsInstanceOf(otherTypes, t);
		assertNotClassCast(otherTypes, t);
	},
	testTraitD : function() {
		var types = [Object, TraitA, TraitB, TraitC, TraitD];
		var otherTypes = [ClassA, ClassB];
		assertEquals(types, TraitD.linearizedTypes);
		
		var t = new TraitD();

		assertTrue(t.fieldA);
		assertTrue(t.fieldB);
		assertTrue(t.fieldC);
		assertTrue(t.fieldD);
		assertUndefined(t.fieldE);
		assertUndefined(t.fieldF);
		assertSame('A', t.a());
		assertSame('B', t.b());
		assertSame('C', t.c());
		assertSame('D', t.d());
		assertSame('TraitD TraitC TraitB TraitA', t.overridden());
		
		assertSame(TraitD, t.constructor);
		assertPrototypeChain(types, t);
		
		assertIsInstanceOf(types, t);
		assertAsInstanceOf(types, t);
		assertClassCast(types, t);
		
		assertNotIsInstanceOf(otherTypes, t);
		assertNotAsInstanceOf(otherTypes, t);
		assertNotClassCast(otherTypes, t);
	},
	testClassA: function() {
		var types = [Object, TraitA, TraitB, ClassA];
		var otherTypes = [TraitC, TraitD, ClassB];
		assertEquals(types, ClassA.linearizedTypes);
		
		var t = new ClassA();
		
		assertTrue(t.fieldA);
		assertTrue(t.fieldB);
		assertUndefined(t.fieldC);
		assertUndefined(t.fieldD);
		assertTrue(t.fieldE);
		assertUndefined(t.fieldF);
		assertSame('ClassA', t.a());
		assertSame('B', t.b());
		assertSame('E', t.e());
		assertSame('ClassA TraitB TraitA', t.overridden());
		
		assertSame(ClassA, t.constructor);
		assertPrototypeChain(types, t);
		
		assertIsInstanceOf(types, t);
		assertAsInstanceOf(types, t);
		assertClassCast(types, t);
		
		assertNotIsInstanceOf(otherTypes, t);
		assertNotAsInstanceOf(otherTypes, t);
		assertNotClassCast(otherTypes, t);
	},
	testClassB : function() {
		var types = [Object, TraitA, TraitB, ClassA, TraitC, TraitD, ClassB];
		var otherTypes = [];
		assertEquals(types, ClassB.linearizedTypes);
		
		var t = new ClassB();

		assertTrue(t.fieldA);
		assertTrue(t.fieldB);
		assertTrue(t.fieldC);
		assertTrue(t.fieldD);
		assertTrue(t.fieldE);
		assertTrue(t.fieldF);
		assertSame('ClassB ClassA', t.a());
		assertSame('ClassB', t.b());
		assertSame('C', t.c());
		assertSame('ClassB D', t.d());
		assertSame('E', t.e());
		assertSame('F', t.f());
		assertSame('ClassB TraitD TraitC ClassA TraitB TraitA', t.overridden());
		
		assertSame(ClassB, t.constructor);
		assertPrototypeChain(types, t);
		
		assertIsInstanceOf(types, t);
		assertAsInstanceOf(types, t);
		assertClassCast(types, t);
		
		assertNotIsInstanceOf(otherTypes, t);
		assertNotAsInstanceOf(otherTypes, t);
		assertNotClassCast(otherTypes, t);
	},
	testConstructors : function() {
		var myClass = Object.inherit({
			initialize: function(a, b, c) {
				assertSame(1, a);
				assertSame(2, b);
				assertSame(3, c);
			}
		});
		
		new myClass(1, 2, 3);
		
		var myExtClass = myClass.inherit({
			initialize: function(a, b, c, d, e) {
				this.superCall(a, b, c);
				assertSame(4, d);
				assertSame(5, e);
			}
		});
		
		new myExtClass(1, 2, 3, 4, 5);
	},
	testImplicitConstructors: function() {
		expectAsserts(6);
		
		var myClass = Object.inherit({
			initialize: function() {
				assertTrue(true);
			}
		});
		
		var myExtClass = myClass.inherit({
			// no explicit super call
		});
		
		new myExtClass();
		
		var myExtClass = myClass.inherit({
			initialize: function() {
				assertTrue(true);
			}
		});
		
		new myExtClass();
		
		var myExtExtClass = myExtClass.inherit({
			initialize: function() {
				this.superCall();
				
				assertTrue(true);
			}
		});
		
		new myExtExtClass();
	},
	testStaticMembers: function() {
		var myClass = Object.inherit({
			constructor: {
				create: function() {
					return new this(1, 2, 3);
				},
				getInstance: function() {
					return this.create();
				}
			},
			initialize: function(a, b, c) {
				assertSame(1, a);
				assertSame(2, b);
				assertSame(3, c);
			}
		});

		assertIsInstanceOf(myClass, myClass.create());
		assertIsInstanceOf(myClass, myClass.getInstance());
	},
	testNativeTypes: function() {
		assertAsInstanceOf(Boolean, true);
		assertAsInstanceOf(Boolean, false);
		assertAsInstanceOf(Boolean, Boolean(true));
		assertAsInstanceOf(Number, 0);
		assertAsInstanceOf(Number, 1);
		assertAsInstanceOf(Number, 17.43);
		assertAsInstanceOf(Number, Number(1));
		assertAsInstanceOf(String, "");
		assertAsInstanceOf(String, "a");
		assertAsInstanceOf(String, String("a"));
		assertAsInstanceOf(RegExp, /foo/);
		assertAsInstanceOf(RegExp, new RegExp("asdf"));
		assertAsInstanceOf(Array, []);
		assertAsInstanceOf(Array, [1]);
		assertAsInstanceOf(Date, new Date());
		assertAsInstanceOf(Function, new Function("return;"));
		assertAsInstanceOf(Function, function(){});
		assertAsInstanceOf(Error, new Error());
		assertAsInstanceOf([Error, TypeError], new TypeError());
	}
});