var private;
var protected;
var public;

(function() {
	var scope;
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
	
	if (!Function.prototype.bind) {
		Function.prototype.bind = function(self) {
			var func = this;
			return function() {
				return func.apply(self, arguments);
			}
		}
	}
	
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
	
	function Delegator(scopes, name) {
		this.configurable = false;
		this.enumerable = false;
		
		this.get = function get() {
			return getScope(get.caller, name)[name];
		}
		
		this.set = function set(value) {
			getScope(set.caller, name)[name] = value;
		}
		
		function getScope(method, name) {
			var cls = method && method.class;
			var s = scopes, n = cls && cls.getName();
			if (cls) {
				var scope = scopes[cls.getName()];
				if (scope) {
					if (scope.hasOwnProperty(name)) {
						return scope;
					} else if (scopes.protected.hasOwnProperty(name)) {
						return scopes.protected;
					}
				}
			}
			
			return scopes.public;
		}
	}
	
	var anonymousClassCounter = 0;  
	
	Class = function() {
		var self = this;
		
		var _name = null;
		var _parentConstructor = null;
		var _classConstructor = null;
		var _classDescriptor = null;
		var _simpleName = null;
		
		public.init = function(parentConstructor, className, classDescriptor) {
			_parentConstructor = parentConstructor? parentConstructor: Object;
			_classDescriptor = classDescriptor;
			_name = className == null? '$' + (++anonymousClassCounter): className;
			_simpleName = _name.substring(_name.lastIndexOf('.'));
			
			_classConstructor.prototype = Object.create(_parentConstructor.prototype);
			
			Object.defineProperty(_classConstructor, 'class', {value : self});
		}
		
		public.getConstructor = function() {
			return _classConstructor;
		}
		
		public.getParentConstructor = function() {
			return _parentConstructor;
		}
			
		public.getParentClass = function() {
			return _parentConstructor.class;
		}
		
		public.getDescriptor = function() {
			return _classDescriptor;
		}
		
		public.getSimpleName = function() {
			return _simpleName;
		}
		
		public.getName = function() {
			return _name;
		}
		
		_classConstructor = function() {
			if (this.constructor == Object) {
				var oldPublic = public;
				var oldProtected = protected;
				var oldScope = scope;
				
				this.constructor = _classConstructor;
				
				scope = {};
				
				public = scope.public = Object.create(_classConstructor.prototype);
				protected = scope.protected = Object.create(public);
			}
			
			var super = function() {};
				
			if (_parentConstructor.class instanceof Class) {
				_parentConstructor.call(this);
				
				if (public.init) {
					super = public.init.bind(this);
					delete public.init;
				} else if (protected.init) {
					super = protected.init.bind(this);
					delete protected.init;
				} else {
					throw new Error('Cannot extend from class ' + self.getParentClass().getName());
				}
				
				for (var name in protected) {
					if (protected[name] instanceof Function) {
						super[name] = protected[name].bind(this);
					}
				}
			}
			
			var oldPrivate = private;
			private = scope[_name] = Object.create(protected);
			_classDescriptor.call(this, super);
			
			private.super = super;
			
			var initScope = public.init? public: protected;
			if (initScope.init && !/\Wsuper\s*\(/.test(initScope.init.toString())) {
				var init = initScope.init;
				init.class = self;
				
				initScope.init = function() {
					super();
					init.apply(this, arguments);
				}
			} else if (!private.init) {
				public.init = super;
			}
			
			for (var name in private) {
				var prop = private[name];
				if (name != 'init' && !(name in this)) {
					Object.defineProperty(this, name, new Delegator(scope, name));
				}
				
				if (prop instanceof Function && !prop.class) {
					prop.class = self;
				}
			}
			
			private = oldPrivate;
			
			if (this.constructor == _classConstructor) {
				if (!public.init)
					throw new Error('Can not instantiate classes with none public constructors');
				
				public.init.apply(this, arguments);
				
				this.scope = scope;
				
				public = oldPublic;
				protected = oldProtected;
				scope = oldScope;
			}
		}
	}
	
	//init the Class class 
	public = {};
	Class.call(public);
	public.init(null, 'Class', Class);
	var cls = public.getConstructor();
	
	public = undefined;

	Class = new cls(null, 'Class', Class).getConstructor();
	Class.class.constructor = Class;
	Class.prototype = cls.prototype;
})();