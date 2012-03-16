
TestCase("TestIneritance", {
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
			extend: {
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
	testTraits: function() {
		var myTrait = Trait.inherit({
			initialize: function() {
				this.field = true;
			},
			fieldValue: function() {
				return this.field;
			}
		});
		
		var myExtTrait = myTrait.inherit({
			initialize: function() {
				this.extField = true;
			},
			extFieldValue: function() {
				return this.field && this.extField;
			}
		});
		
		var t = new myTrait();
		
		assertInstanceOf(Trait, t);
		assertInstanceOf(myTrait, t);
		assertIsInstanceOf(myTrait, t);
		assertAsInstanceOf(myTrait, t);
		
		assertTrue(t.field);
		assertTrue(t.fieldValue());
		
		var t = new myExtTrait();
		
		assertInstanceOf(Trait, t);
		assertInstanceOf(myTrait, t);
		assertIsInstanceOf(myTrait, t);
		assertAsInstanceOf(myTrait, t);
		assertInstanceOf(myExtTrait, t);
		assertIsInstanceOf(myExtTrait, t);
		assertAsInstanceOf(myExtTrait, t);
		
		assertTrue(t.field);
		assertTrue(t.extField);
		assertTrue(t.fieldValue());
		assertTrue(t.extFieldValue());
	},
	testMixinedTrait: function() {
		var myTrait = Trait.inherit({
			initialize: function() {
				this.field = true;
			},
			fieldValue: function() {
				return this.field;
			}
		});
		
		jstestdriver.console.log(Object.getOwnPropertyDescriptor)
		
		var myExtTrait = Trait.inherit(myTrait, {
			initialize: function() {
				this.extField = true;
			},
			extFieldValue: function() {
				return this.field && this.extField;
			}
		});
		

		
		var t = new myExtTrait();
		
		assertIsInstanceOf(myTrait, t);
		assertAsInstanceOf(myTrait, t);
		assertInstanceOf(myExtTrait, t);
		assertIsInstanceOf(myExtTrait, t);
		assertAsInstanceOf(myExtTrait, t);
		
		assertTrue(t.field);
		assertTrue(t.extField);
		assertTrue(t.fieldValue());
		assertTrue(t.extFieldValue());
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
	},
	testNativeClassOf: function() {
		assertSame(Boolean, classOf(true));
		assertSame(Boolean, classOf(false));
		assertSame(Boolean, classOf(Boolean(true)));
		assertSame(Number, classOf(0));
		assertSame(Number, classOf(1));
		assertSame(Number, classOf(17.43));
		assertSame(Number, classOf(Number(1)));
		assertSame(String, classOf(""));
		assertSame(String, classOf("a"));
		assertSame(String, classOf(String("a")));
		assertSame(RegExp, classOf(/foo/));
		assertSame(RegExp, classOf(new RegExp("asdf")));
		assertSame(Array, classOf([]));
		assertSame(Array, classOf([1]));
		assertSame(Date, classOf(new Date()));
		assertSame(Function, classOf(new Function("return;")));
		assertSame(Function, classOf(function(){}));
		assertSame(Error, classOf(new Error()));
		assertSame(TypeError, classOf(new TypeError()));
	}
});

TestCase("TestModel", {
	testAvailability : function() {
		assertNotUndefined('TraitA is unavailable', TraitA);
		assertNotUndefined('TraitB is unavailable', TraitB);
		assertNotUndefined('TraitC is unavailable', TraitC);
		assertNotUndefined('TraitD is unavailable', TraitD);
		assertNotUndefined('ClassA is unavailable', ClassA);
		assertNotUndefined('ClassB is unavailable', ClassB);
	},
	testTraitA : function() {
		var types = [Object, Trait, TraitA];
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
		
		assertSame(TraitA, classOf(t));
	},
	testTraitB : function() {
		var types = [Object, Trait, TraitA, TraitB];
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
		
		assertSame(TraitB, classOf(t));
	},
	testTraitC : function() {
		var types = [Object, Trait, TraitA, TraitC];
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
		
		assertSame(TraitC, classOf(t));
	},
	testTraitD : function() {
		var types = [Object, Trait, TraitA, TraitB, TraitC, TraitD];
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
		
		assertSame(TraitD, classOf(t));
	},
	testClassA: function() {
		var types = [Object, TraitA, TraitB, ClassA];
		var otherTypes = [TraitC, TraitD, ClassB, Trait];
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
		
		assertSame(ClassA, classOf(t));
	},
	testClassB : function() {
		var types = [Object, TraitA, TraitB, ClassA, TraitC, TraitD, ClassB];
		var otherTypes = [Trait];
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
		
		assertSame(ClassB, classOf(t));
		
		assertInstanceOf(ClassA, t);
		assertInstanceOf(ClassB, t);
	}
});