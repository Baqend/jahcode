if (!Function.prototype.extend) {	
	Function.prototype.extend = function(target, props) {
		if (!props) {
			props = target;
			target = this;
		}
		
		for (name in props) {
			if (props.hasOwnProperty(name))
				target[name] = props[name];
		}
		
		return target;
	};
}

Object.extend(Function.prototype, {
	linearizedTypes: [Object],
	inherit: function() {
		var klass = function(toCast) {
			if (!(this instanceof klass)) return toCast.isInstanceOf(klass)? toCast: null;
			this.initialize.apply(this, arguments);
		};
		
		var objectDescriptor = arguments[arguments.length - 1];
		var proto = Object.createPrototypeChain(klass, this, Array.prototype.slice.call(arguments, 0, arguments.length - 1));
		
		for (var name in objectDescriptor) {
			if (objectDescriptor.hasOwnProperty(name)) {
				var result = false;
				if (Object.properties.hasOwnProperty(name)) {
					result = Object.properties[name](proto, objectDescriptor, name);
				} 
				
				var d = objectDescriptor[name];
				if (!result) {											
					if (!d || !(d.hasOwnProperty('get') || d.hasOwnProperty('set'))) {				
						proto[name] = d;
					} else {
						Object.defineProperty(proto, name, d);
					}
				}
				
				if (d instanceof Function) {
					d.methodName = name;
				}
			}
		}
		
		return klass;
	}
});

Object.extend({
	properties: {},
	basePrototype: {},
	cloneOwnProperties: function(target, src) {
		var names = Object.getOwnPropertyNames(src);
		for (var i = 0; i < names.length; ++i) {
			var name = names[i];
			Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(src, name));			
		}
	},
	getBasePrototype: function(cls) {
		var proto = cls.wrappedPrototype? cls.wrappedPrototype: cls.prototype;
		
		if (proto.superCall)
			return proto;
		
		if (!cls.basePrototype) {
			cls.basePrototype = Object.create(cls.prototype);
			Object.extend(cls.basePrototype, Object.basePrototype);
			
			if (!cls.prototype.initialize) {
				cls.basePrototype.initialize = function() {
					cls.apply(this, arguments);
				};
			}
		}
			
		return cls.basePrototype;
	},
	createPrototypeChain: function(cls, parentClass, traits) {
		var proto = Object.getBasePrototype(parentClass);
		var linearizedTypes = parentClass.linearizedTypes.slice();
		
		for (var i = 0, trait; trait = traits[i]; ++i) {
			if (!(trait.prototype instanceof Trait)) 
				throw new TypeError("Only traits can be mixed in");
			
			var linearizedTraitTypes = trait.linearizedTypes;
			for (var j = 0, type; type = linearizedTraitTypes[j]; ++j) {
				if (linearizedTypes.indexOf(type) == -1) {
					linearizedTypes.push(type);
					
					proto = Object.create(proto);
					proto.constructor = type;
					Object.cloneOwnProperties(proto, type.wrappedPrototype? type.wrappedPrototype: type.prototype);
				}					
			}
		}

		linearizedTypes.push(cls);
		
		proto = Object.create(proto);
		proto.constructor = cls;
		
		cls.prototype = proto;
		cls.linearizedTypes = linearizedTypes;
		
		return proto;
	}
});

Object.extend(Object.properties, {
	initialize: function(proto, objectDescriptor) {
		var init = objectDescriptor.initialize;
		var test = /this\.superCall\(/.test(init.toString());
		if (proto instanceof Trait) {
			if (test)
				throw new TypeError('trait constructors can not call super constructors directly');
			
			objectDescriptor.initialize = function() {
				this.superCall.apply(this, arguments);
				init.call(this);
			};
		} else if (!test) {
			objectDescriptor.initialize = function() {
				this.superCall.call(this);
				init.apply(this, arguments);
			};
		}
	},
	extend: function(proto, objectDescriptor) {
		Object.extend(proto.constructor, objectDescriptor.extend);
		return true;
	}
});

Object.extend(Object.basePrototype, {
	initialize: function() {},
	superCall: function() {
		var caller = arguments.callee.caller;
		
		if (caller && caller.methodName) {
			var methodName = caller.methodName;
			
			var proto = this;
			while (!proto.hasOwnProperty(methodName) || proto[methodName] !== caller) {
				proto = Object.getPrototypeOf(proto);

				if (proto == Object.prototype)
					throw new ReferenceError("superCall can't determine any super method");
			}
			proto = Object.getPrototypeOf(proto);
			
			return proto[caller.methodName].apply(this, arguments);
		} else {		
			throw new ReferenceError("superCall can not be called outside of object inheritance");
		}
	},
	isInstanceOf: function(klass) {
		return this instanceof klass || classOf(this).linearizedTypes.lastIndexOf(klass) != -1;
	},
	asInstanceOf: function(klass) {
		if (this.isInstanceOf(klass)) {
			return this;
		} else {
			throw new TypeError();
		}
	}
});

function Trait() {};
if (Object.create)
	Trait.prototype = Object.create(Object.basePrototype);

function classOf(object) {
	return Object.getPrototypeOf(Object(object)).constructor;
}

for (var i = 0, cls; cls = [Boolean, Number, String, Array, Function, Date, RegExp, Error][i]; ++i) {
	Object.extend(cls.prototype, {
		isInstanceOf: function(klass) {
			return this instanceof klass;
		},
		asInstanceOf: Object.basePrototype.asInstanceOf
	});
}

Object.extend(Array.prototype, {
	initialize: function() {
		for (var i = 0; i < arguments.length; ++i)
			this[i] = arguments[i];
		
		this.length = arguments.length;
	}
});

Object.extend(Error.prototype, {
	initialize: function(message) {
		this.message = message;
	}
});