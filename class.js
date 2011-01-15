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

var Class = function(self) {
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
			var oldPublic = public;
			var oldProtected = protected;
			var oldPrivate = private;
			
			this.constructor = self.classObject;
			
			public = this;
			protected = Object.create(public);
		}

		var super = function() {};
			
		if (self.parentClassObject.class instanceof Class) {
			self.parentClassObject.call(this);
			
			super = protected.init;
			if (!super)
				throw new Error('Cannot extend from class ' + self.getParentClass().getName());
			
			delete protected.init;
			delete public.init;
			
			for (var name in protected) {
				if (protected[name] instanceof Function) {
					super[name] = protected[name];
				}
			}
		}
		
		private = Object.create(protected);
		self.classDescriptor.call(public, private, super);
		
		for (var name in protected) {
			if (!(protected[name] instanceof Function) && !private.hasOwnProperty(name)) {
				Object.defineProperty(private, name, new Delegator(protected, name));
			}
		}
		
		var initScope = public.init? public: protected;
		if (initScope.init && !/\Wsuper\s*\(/.test(initScope.init.toString())) {
			var init = initScope.init;
			initScope.init = function() {
				super();
				init.apply(this, arguments);
			}
		} else if (!private.init) {
			public.init = super;
		}
		
		if (this.constructor == self.classObject) {
			for (var name in public) {
				if (!(public[name] instanceof Function)) {
					Object.defineProperty(protected, name, new Delegator(public, name));
				}
			}
			
			if (!public.init)
				throw new Error('Can not instantiate classes with none public constructors');
			
			public.init.apply(public, arguments);
			
			delete public.init;
			
			public = oldPublic;
			protected = oldProtected;
			private = oldPrivate;
		}
	}
}

//init the Class class 
public = protected = private = {};
Class.call(public, public);
public.init(null, 'Class', Class);
var cls = public.classObject;
Class = new cls(null, 'Class', Class).getClassObject();
Class.class.constructor = Class;
Class.prototype = cls.prototype;
public = protected = private = undefined;