var private;
var protected;
var public;

(function() {
	var Prototype = function() {};
	
	//Add support for ff 3 and some older webkit versions
	if (!Object.create && Object.prototype.__defineGetter__) {
		Object.create = function(proto) {
			Prototype.prototype = proto;
			
			return new Prototype();
		}
		
		Object.defineProperty = function(obj, name, descr) {
			if ('value' in descr) {
				obj[name] = descr.value;
			} else {
				if ('get' in descr) {
					obj.__defineGetter__(name, descr.get);
				}
				
				if ('set' in descr) {
					obj.__defineSetter__(name, descr.set);
				}
			}
		}
	}

	Function.empty = function() {};
	
	Function.prototype.extend = function(className, classDescriptor) {
		if (typeof className != 'string') {
			classDescriptor = className;
			className = null;
		}
		
		if (classDescriptor instanceof Function) {
			var cls = new Class(this, className, classDescriptor);
			
			if (className != null)
				window[className] = cls.getConstructor();
			
			return cls.getConstructor();
		} else {
			this.call(classDescriptor);
		}
	}
	
	function Delegator(scope, name) {
		this.get = function() {
			return scope[name];
		}
		this.set = function(value) {
			scope[name] = value;
		}
	}
	
	Class = function(self) {
		private.parentConstructor;
		private.classConstructor;
		private.classDescriptor;
		private.name;
		private.simpleName;
		
		public.init = function(parentConstructor, name, classDescriptor) {
			self.parentConstructor = parentConstructor? parentConstructor: Object;
			self.classDescriptor = classDescriptor;
			self.name = name;
			self.simpleName = name == null? null: name.substring(name.lastIndexOf('.'));
			
			self.classConstructor.prototype = Object.create(self.parentConstructor.prototype);
			
			Object.defineProperty(self.classConstructor, 'class', {value : self});
		}
		
		public.getConstructor = function() {
			return self.classConstructor;
		}
		
		public.getParentConstructor = function() {
			return self.parentConstructor;
		}
			
		public.getParentClass = function() {
			return self.parentConstructor.class;
		}
		
		public.getDescriptor = function() {
			return self.classDescriptor;
		}
		
		public.getSimpleName = function() {
			return self.simpleName;
		}
		
		public.getName = function() {
			return self.name;
		}
		
		private.classConstructor = function() {
			if (this.constructor == Object) {
				var oldPublic = public;
				var oldProtected = protected;
				
				this.constructor = self.classConstructor;
				
				public = this;
				protected = Object.create(public);
			}
	
			var super = function() {};
				
			if (self.parentConstructor.class instanceof Class) {
				self.parentConstructor.call(this);
				
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
			
			var oldPrivate = private;
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
			
			if (this.constructor == self.classConstructor) {
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
			}
			
			private = oldPrivate;
		}
	}
	
	//init the Class class 
	public = protected = private = {};
	Class.call(public, public);
	public.init(null, 'Class', Class);
	var cls = public.classConstructor;
	public = protected = private = undefined;

	Class = new cls(null, 'Class', Class).getConstructor();
	Class.class.constructor = Class;
	Class.prototype = cls.prototype;
})();