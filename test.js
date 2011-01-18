Object.extend('Test', function(self) {
	
	private.privateVar = 'private';
	protected.protectedVar = 'protected';
	public.publicVar = 'public';
	
	public.init = function() {
		assertEquals('private', self.privateVar);
		
		if (self instanceof TestExtended) {
			assertEquals('protected2', self.protectedVar);
			assertEquals('public2', self.publicVar);
		} else {
			assertEquals('protected', self.protectedVar);
			assertEquals('public', self.publicVar);
		}
		
		self.privateMethod();
		self.protectedMethod();
		self.publicMethod();
	}
	
	private.privateMethod = function(arg) {
		assertEquals('private', self.privateVar);
		
		if (self instanceof TestExtended) {
			assertEquals('protected2', self.protectedVar);
			assertEquals('public2', self.publicVar);
		} else {
			assertEquals('protected', self.protectedVar);
			assertEquals('public', self.publicVar);
		}
	}
	
	protected.protectedMethod = function(arg) {
		self.privateMethod();

		assertEquals('private', self.privateVar);
		
		if (self instanceof TestExtended) {
			assertEquals('protected2', self.protectedVar);
			assertEquals('public2', self.publicVar);
		} else {
			assertEquals('protected', self.protectedVar);
			assertEquals('public', self.publicVar);
		}
	}
	
	public.publicMethod = function(arg) {
		self.privateMethod();
		
		assertEquals('private', self.privateVar);
		
		if (self instanceof TestExtended) {
			assertEquals('protected2', self.protectedVar);
			assertEquals('public2', self.publicVar);
		} else {
			assertEquals('protected', self.protectedVar);
			assertEquals('public', self.publicVar);
		}
	}
});

Test.extend('TestExtended', function(self, super) {
	
	private.privateVar = 'private2';
	protected.protectedVar = 'protected2';
	public.publicVar = 'public2';
	
	public.init = function() {
		self.privateMethod();
		self.protectedMethod();
		self.publicMethod();
	}
	
	private.privateMethod = function(arg) {
		assertEquals('private2', self.privateVar);
		assertEquals('protected2', self.protectedVar);
		assertEquals('public2', self.publicVar);
	}
	
	protected.protectedMethod = function(arg) {
		super.protectedMethod();
		
		assertEquals('private2', self.privateVar);
		assertEquals('protected2', self.protectedVar);
		assertEquals('public2', self.publicVar);
	}
	
	public.publicMethod = function(arg) {
		super.publicMethod();
		
		assertEquals('private2', self.privateVar);
		assertEquals('protected2', self.protectedVar);
		assertEquals('public2', self.publicVar);
	}
});

var testObject;
TestCase("TestClass", {
	setUp: function() {
		assertSame(undefined, public);
		assertSame(undefined, protected);
		assertSame(undefined, private);
	},
	tearDown: function() {
		assertSame(undefined, public);
		assertSame(undefined, protected);
		assertSame(undefined, private);
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
	testMemberAccess : function() {
		var myClass = Object.extend(function(self) {
			private.privateVar = 1;
			protected.protectedVar = 2;
			public.publicVar = 3;
			
			public.getPrivateVar = function() {
				return self.privateVar;
			}
			public.setPrivateVar = function(value) {
				self.privateVar = value;
			}
			public.getProtectedVar = function() {
				return self.protectedVar;
			}
			public.setProtectedVar = function(value) {
				self.protectedVar = value;
			}
			public.getPublicVar = function() {
				return self.publicVar;
			}
			public.setPublicVar = function(value) {
				self.publicVar = value;
			}
		});
		
		var myExtClass = myClass.extend(function(self) {
			private.privateVar = 4;

			public.getExtPrivateVar = function() {
				return self.privateVar;
			}
			public.setExtPrivateVar = function(value) {
				self.privateVar = value;
			}
			public.getExtProtectedVar = function() {
				return self.protectedVar;
			}
			public.setExtProtectedVar = function(value) {
				self.protectedVar = value;
			}
			public.getExtPublicVar = function() {
				return self.publicVar;
			}
			public.setExtPublicVar = function(value) {
				self.publicVar = value;
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
		
		var myExtClass = myClass.extend(function(self, super) {
			public.init = function(a, b, c) {
				super(a, b, c);
			}
		});
		
		new myExtClass(1, 2, 3);
	},
	testImplicitConstructors: function() {
		expectAsserts(5); // + 3 in tear down
		
		var myClass = Object.extend(function() {
			public.init = function() {
				assertTrue(true);
			}
		});
		
		var myExtClass = myClass.extend(function(self, super) {
			// no explicit super call
		});
		
		new myExtClass();
		
		var myExtClass = myClass.extend(function(self, super) {
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
	}
});