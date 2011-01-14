var private;
var protected;
var public;

Function.empty = function() {};

Function.prototype.extend = function(className, classDescriptor) {
	if (className instanceof Function) {
		classDescriptor = className;
		className = null;
	}
	
	var cls = new Class(this, className, classDescriptor);
	
	if (className != null)
		window[className] = cls.getClassObject();
	
	return cls.getClassObject();
}

function Delegator(scope, name) {
	this.get = function() {
		return scope[name];
	}
	this.set = function(value) {
		scope[name] = value;
	}
}

var Class = function C(self) {
	private.parentClassObject;
	private.classObject;
	private.classDescriptor;
	private.name;
	private.simpleName;
	
	public.init = function(parentClassObject, name, classDescriptor) {
		self.parentClassObject = parentClassObject? parentClassObject: Object;
		self.classDescriptor = classDescriptor;
		self.name = name;
		self.simpleName = name == null? null: name.substring(name.lastIndexOf('.'));
		
		self.classObject.prototype = Object.create(self.parentClassObject.prototype);
		
		Object.defineProperty(self.classObject, 'class', {value : self});
	}
	
	public.getClassObject = function() {
		return self.classObject;
	}
	
	public.getParentClassObject = function() {
		return self.parentClassObject;
	}
		
	public.getParentClass = function() {
		return self.parentClassObject.class;
	}
	
	public.getClassDescriptor = function() {
		return self.classDescriptor;
	}
	
	public.getSimpleName = function() {
		return self.simpleName;
	}
	
	public.getName = function() {
		return self.name;
	}
	
	private.classObject = function() {
		if (this.constructor == Object) {
			this.constructor = self.classObject;
			
			public = this;
			protected = Object.create(public);
			
			var scope = Object.create(protected);
		} else {
			var scope = private;
		}

		var super = function() {};
			
		if (self.parentClassObject.class instanceof Class) {
			private = Object.create(protected);
			
			self.parentClassObject.call(this);
			
			super = private.init.bind(private);
			
//			delete this.init;
			
			for (var name in protected) {
				if (protected[name] instanceof Function) {
					super[name] = protected[name];
				}
			}
		}
		
		private = scope;
		self.classDescriptor.call(public, private, super);
		
		for (var name in protected) {
			if (!(protected[name] instanceof Function) && !scope.hasOwnProperty(name)) {
				Object.defineProperty(scope, name, new Delegator(protected, name));
			}
		}
		
		if (!scope.init || !/\Wsuper\s*\(/.test(scope.init.toString())) {
			var init = scope.init? scope.init: Function.empty;
			scope.init = function() {
				super();
				init.apply(scope, arguments);
			}
		}
		
		if (this.constructor == self.classObject) {
			for (var name in public) {
				if (!(public[name] instanceof Function)) {
					Object.defineProperty(protected, name, new Delegator(public, name));
				}
			}
			scope.init.apply(scope, arguments);
//			delete this.init;
		}
	}
}


//var classPrototype = {};
//
//public = Object.create(classPrototype);
//private = Object.create(public);
//Class.call(public, private);
//public.init(null, 'Class', Class);
//
//var Class = public.getClassObject();
//Class.prototype = classPrototype;
//
//public = private = undefined;


public = protected = private = {};
Class.call(public, public);
public.init(null, 'Class', Class);
var cls = public.classObject;
Class = new cls(null, 'Class', Class).getClassObject();
Class.class.constructor = Class;
Class.prototype = cls.prototype;


//Class.Init = function(self) {
//	self.call(this, this);
//	this.init(Object, window, self);
//	
//	delete this.init;
//	
//	this.constructor = Class;
//	
//	Class.prototype = self.Init.prototype;
//	Class.Prototype = self.Prototype;
//}
//
//Class.Init.prototype = Object.create(Object.prototype);
//new Class.Init(Class);

//new Class(Object, window, function(Package) {
//	var _currentPackage = window;
//	
//	Package.getCurrentPackage = function() {
//		return _currentPackage;
//	}
//	
//	Package.setCurrentPackage = function(currentPackage) {
//		if (!currentPackage)
//			currentPackage = '';
//		
//		if (typeof currentPackage == 'string')
//			_currentPackage = Package.forName(currentPackage);
//		else	
//			_currentPackage = currentPackage;
//	}
//	
//	Package.forName = function(name) {
//		var comps = name.split('.');
//		
//		var cur = window;
//		for (var i = 0, comp; comp = comps[i]; ++i) {
//			if (comp in cur) {
//				cur = cur[comp];
//			} else {
//				cur = cur[comp] = new Package(comps.slice(0, i + 1).join('.'));
//			}
//		}
//		
//		return cur;
//	}
//	
//	return function Package() {
//		var _name;
//		
//		this.init = function(name) {
//			_name = name;
//		}
//		
//		this.toString = function() {
//			return _name;
//		}
//	}
//});
//
//var package = Package.setCurrentPackage;

Object.extend('Test', function(self) {
	
	private.privateVar = 'private';
	protected.protectedVar = 'protected';
	public.publicVar = 'public';
	
	protected.init = function() {
		self.privateMethod();
		self.protectedMethod();
		self.publicMethod();
	}
	
	private.privateMethod = function(arg) {
		console.log('privateMethod');
		console.log(self.privateVar);
		console.log(self.protectedVar);
		console.log(self.publicVar);
	}
	
	protected.protectedMethod = function(arg) {
		console.log('protectedMethod');
		self.privateMethod();
	}
	
	public.publicMethod = function(arg) {
		console.log('publicMethod');
		self.privateMethod();
	}

	public.getMethod = function() {
		console.log(self.publicVar);
	}
});

Test.extend('TestExtended', function(self, super) {
	
	private.privateVar = 'private2';
	protected.protectedVar = 'protected2';
	public.publicVar = 'public2';
	
	protected.init = function() {
		self.privateMethod();
		self.protectedMethod();
		self.publicMethod();
	}
	
	private.privateMethod = function(arg) {
		console.log('privateMethod2');
		console.log(self.privateVar);
		console.log(self.protectedVar);
		console.log(self.publicVar);
	}
	
	protected.protectedMethod = function(arg) {
		super.protectedMethod();
		
		console.log('protectedMethod2');
		console.log(self.privateVar);
		console.log(self.protectedVar);
		console.log(self.publicVar);
	}
	
	public.publicMethod = function(arg) {
		super.publicMethod();
		
		console.log('publicMethod2');
		console.log(self.privateVar);
		console.log(self.protectedVar);
		console.log(self.publicVar);
	}
	
	public.setMethod = function() {
		self.publicVar = 'muh';
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

console.log(Test.class instanceof Class);
console.log(TestExtended.class instanceof Class);
console.log(Class.class instanceof Class);

console.log(TestExtended.class.constructor == Class);
console.log(Test.class.constructor == Class);
console.log(Class.class.constructor == Class);