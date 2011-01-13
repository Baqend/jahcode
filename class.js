var private;
var protected;
var public;

Function.empty = function() {};

Function.prototype.extend = function(packageOrExtender, extender) {
	if (typeof packageOrExtender == 'string') {
		var pack = Package.forName(packageOrExtender);
	} else {
//		var pack = Package.getCurrentPackage();
		var pack = window;
		extender = packageOrExtender;
	}
	
	var cls = new Class()
	cls.init(this, pack, extender);
	
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

function Class() {
	var self = this,
		_classObject,
		_parentClassObject,
		_classDescriptor;
	
	this.init = function(parentClassObject, classPackage, classDescriptor) {
		_parentClassObject = parentClassObject? parentClassObject: Object;
		
		_classObject.prototype = Object.create(_parentClassObject.prototype);
		
		Object.defineProperty(_classObject, 'class', {value : self});
		
		_classDescriptor = classDescriptor;
	}
	
	this.getClassObject = function() {
		return _classObject;
	}
	
	this.getParentClassObject = function() {
		return _parentClassObject;
	}
		
	this.getParentClass = function() {
		return _parentClassObject.class;
	}
	
	this.getClassDescriptor = function() {
		return _classDescriptor;
	}
	
	this.getSimpleName = function() {
		return _simpleName;
	}
	
	this.getPackage = function() {
		return _package;
	}
	
	_classObject = function(scope) {
		
		if (this.constructor == Object) {
			this.constructor = _classObject;
			
			public = this;
			protected = Object.create(public);
			
			scope = Object.create(protected);
		}

		var super = function() {};
			
		if (_parentClassObject.class instanceof Class) {
			var parentScope = Object.create(protected);
			
			_parentClassObject.call(this, parentScope);
			
			super = parentScope.init.bind(parentScope);
			
//			delete this.init;
			
			for (var name in protected) {
				if (protected[name] instanceof Function) {
					super[name] = protected[name];
				}
			}
		}
		
		private = scope;
		_classDescriptor.call(public, private, super);
		
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
		
		if (this.constructor == _classObject) {
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

var Test = Object.extend(function(self) {
	
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

var TestExtended = Test.extend(function(self, super) {
	
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