Object.extend('Test', function() {
	
	private.privateVar = 'private';
	protected.protectedVar = 'protected';
	public.publicVar = 'public';
	
	public.init = function() {
		assertEquals('private', this.privateVar);
		
		if (this instanceof TestExtended) {
			assertEquals('protected2', this.protectedVar);
			assertEquals('public2', this.publicVar);
		} else {
			assertEquals('protected', this.protectedVar);
			assertEquals('public', this.publicVar);
		}
		
		this.privateMethod();
		this.protectedMethod();
		this.publicMethod();
	}
	
	private.privateMethod = function(arg) {
		assertEquals('private', this.privateVar);
		
		if (this instanceof TestExtended) {
			assertEquals('protected2', this.protectedVar);
			assertEquals('public2', this.publicVar);
		} else {
			assertEquals('protected', this.protectedVar);
			assertEquals('public', this.publicVar);
		}
	}
	
	protected.protectedMethod = function(arg) {
		this.privateMethod();

		assertEquals('private', this.privateVar);
		
		if (this instanceof TestExtended) {
			assertEquals('protected2', this.protectedVar);
			assertEquals('public2', this.publicVar);
		} else {
			assertEquals('protected', this.protectedVar);
			assertEquals('public', this.publicVar);
		}
	}
	
	public.publicMethod = function(arg) {
		this.privateMethod();
		
		assertEquals('private', this.privateVar);
		
		if (this instanceof TestExtended) {
			assertEquals('protected2', this.protectedVar);
			assertEquals('public2', this.publicVar);
		} else {
			assertEquals('protected', this.protectedVar);
			assertEquals('public', this.publicVar);
		}
	}
});

Test.extend('TestExtended', function(super) {
	
	private.privateVar = 'private2';
	protected.protectedVar = 'protected2';
	public.publicVar = 'public2';
	
	public.init = function() {
		this.privateMethod();
		this.protectedMethod();
		this.publicMethod();
	}
	
	private.privateMethod = function(arg) {
		assertEquals('private2', this.privateVar);
		assertEquals('protected2', this.protectedVar);
		assertEquals('public2', this.publicVar);
	}
	
	protected.protectedMethod = function(arg) {
		super.protectedMethod();
		
		assertEquals('private2', this.privateVar);
		assertEquals('protected2', this.protectedVar);
		assertEquals('public2', this.publicVar);
	}
	
	public.publicMethod = function(arg) {
		super.publicMethod();
		
		assertEquals('private2', this.privateVar);
		assertEquals('protected2', this.protectedVar);
		assertEquals('public2', this.publicVar);
	}
});
var pub = public;
var pro = protected;
var pri = private;
var testObject;
TestCase("TestClass", {
	tearDown: function() {
		assertSame(pub, public);
		assertSame(pro, protected);
		assertSame(pri, private);
	},
	testAvailability : function() {
		assertNotSame(undefined, Test);
		assertNotSame(undefined, TestExtended);
	},
	testClassObjects : function() {
		assertTrue(Class.class instanceof Class);
		assertTrue(Test.class instanceof Class);
		assertTrue(TestExtended.class instanceof Class);
	},
	testClassObjectConstructors : function() {
		assertSame(Class, Class.class.constructor);
		assertSame(Class, Test.class.constructor);
		assertSame(Class, TestExtended.class.constructor);
	},
    testScope: function() {
    	var t = new Test();
    	assertSame(Test, t.constructor);
    	assertTrue(t instanceof Test);
    	
    	assertSame(undefined, t.privateMethod);
    	assertSame(undefined, t.protectedMethod);
    	assertNotSame(undefined, t.publicMethod);
    	
    	t = new TestExtended();
    	assertSame(t.constructor, TestExtended);
    	assertTrue(t instanceof TestExtended);
	},
	testInstanceOf : function() {
		var myClass = Object.extend(function() {
			public.init = function() {
				assertTrue(this instanceof myClass);
				
				this.privateTest();
				this.protectedTest();
				this.publicTest();
			}
			private.privateTest = function() {
				assertTrue(this instanceof myClass);
			}
			protected.protectedTest = function() {
				assertTrue(this instanceof myClass);
			}
			public.publicTest = function() {
				assertTrue(this instanceof myClass);
			}
		});
		
		new myClass();
		
		var myExtClass = Object.extend(function(super) {
			public.init = function() {
				super();
				
				this.privateTest();
				assertTrue(this instanceof myExtClass);
			}
			private.privateTest = function() {
				assertTrue(this instanceof myExtClass);
			}
			protected.protectedTest = function() {
				super.protectedTest();
				assertTrue(this instanceof myExtClass);
			}
			public.publicTest = function() {
				super.publicTest();
				assertTrue(this instanceof myExtClass);
			}
		});
		
		new myExtClass();
	},
	testMemberAccess : function() {
		var myClass = Object.extend(function() {
			private.privateVar = 1;
			protected.protectedVar = 2;
			public.publicVar = 3;
			
			public.getPrivateVar = function() {
				return this.privateVar;
			}
			public.setPrivateVar = function(value) {
				this.privateVar = value;
			}
			public.getProtectedVar = function() {
				return this.protectedVar;
			}
			public.setProtectedVar = function(value) {
				this.protectedVar = value;
			}
			public.getPublicVar = function() {
				return this.publicVar;
			}
			public.setPublicVar = function(value) {
				this.publicVar = value;
			}
		});
		
		var myExtClass = myClass.extend(function() {
			private.privateVar = 4;

			public.getExtPrivateVar = function() {
				return this.privateVar;
			}
			public.setExtPrivateVar = function(value) {
				this.privateVar = value;
			}
			public.getExtProtectedVar = function() {
				return this.protectedVar;
			}
			public.setExtProtectedVar = function(value) {
				this.protectedVar = value;
			}
			public.getExtPublicVar = function() {
				return this.publicVar;
			}
			public.setExtPublicVar = function(value) {
				this.publicVar = value;
			}
		});
		
		var obj = new myExtClass();
		
		assertSame(1, obj.getPrivateVar());
		assertSame(4, obj.getExtPrivateVar());
		assertSame(2, obj.getProtectedVar());
		assertSame(2, obj.getExtProtectedVar());
		assertSame(3, obj.getPublicVar());
		assertSame(3, obj.getExtPublicVar());
		assertSame(3, obj.publicVar);
		
		obj.setPrivateVar(5);
		assertSame(5, obj.getPrivateVar());
		assertSame(4, obj.getExtPrivateVar());
		
		obj.setExtPrivateVar(6);
		assertSame(5, obj.getPrivateVar());
		assertSame(6, obj.getExtPrivateVar());
		
		obj.setProtectedVar(7);
		assertSame(7, obj.getProtectedVar());
		assertSame(7, obj.getExtProtectedVar());
		
		obj.setExtProtectedVar(8);
		assertSame(8, obj.getProtectedVar());
		assertSame(8, obj.getExtProtectedVar());

		obj.setPublicVar(9);
		assertSame(9, obj.getPublicVar());
		assertSame(9, obj.getExtPublicVar());
		assertSame(9, obj.publicVar);
		
		obj.setExtPublicVar(10);
		assertSame(10, obj.getPublicVar());
		assertSame(10, obj.getExtPublicVar());
		assertSame(10, obj.publicVar);
	},
	testConstructors : function() {
		var myClass = Object.extend(function() {
			public.init = function(a, b, c) {
				assertSame(1, a);
				assertSame(2, b);
				assertSame(3, c);
			}
		});
		
		new myClass(1, 2, 3);
		
		var myExtClass = myClass.extend(function(super) {
			public.init = function(a, b, c) {
				super(a, b, c);
			}
		});
		
		new myExtClass(1, 2, 3);
	},
	testImplicitConstructors: function() {
		expectAsserts(2);
		
		var myClass = Object.extend(function() {
			public.init = function() {
				assertTrue(true);
			}
		});
		
		var myExtClass = myClass.extend(function(super) {
			// no explicit super call
		});
		
		new myExtClass();
		
		var myExtClass = myClass.extend(function(super) {
			public.init = function() {
				//no explicit super call
			}
		});
		
		new myExtClass();
	},
	testScopeProtection : function() {
		var myClass = Object.extend(function() {
			public.test = new Test();
		});
		
		var instance = new myClass();
		
		assertTrue(instance instanceof myClass);
		assertTrue(instance.test instanceof Test);
		
		assertSame(undefined, instance.publicMethod);
		assertNotSame(undefined, instance.test);
	},
	testSameClassAccess : function() {
		var myClass = Object.extend(function() {
			public.add = function(cls) {
				assertSame(a, cls);
				cls.doAdd(this);
			}
			protected.doAdd = function(cls) {
				assertSame(b, cls);
				cls.added(this);
			}
			private.added = function(cls) {
				assertSame(a, cls);
			}
		});
		
		var a = new myClass();
		var b = new myClass();
		
		b.add(a);
	}
});