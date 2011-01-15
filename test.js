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

	public.getMethod = function() {
		console.log(self.publicVar);
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
	
	public.setMethod = function() {
		self.publicVar = 'muh';
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
	},
	testImplicitConstructors: function() {
		expectAsserts(5); // + 3 in tear down
		
		var myClass = Object.extend(function() {
			public.init = function() {
				assertTrue(true);
			}
		});
		
		var myExtClass = myClass.extend(function(self, super) {
			// no super call
		});
		
		new myExtClass();
		
		var myExtClass = myClass.extend(function(self, super) {
			public.init = function() {
				//no super call
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

//console = {
//	log: function(msg) {
//		document.write(msg + '<br/>');
//	}
//};

var t = new Test();
var test = new TestExtended();

for (el in t)
	console.log(el);

for (el in test)
	console.log(el);

test.setMethod();
test.getMethod();

console.log(t instanceof Test);
console.log(t instanceof TestExtended);
console.log(test instanceof Test);
console.log(test instanceof TestExtended);