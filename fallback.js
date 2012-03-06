(function() {
	//Add support for ff 3 and some older webkit versions
	if (Object.create)
		return;
	
	var Prototype = function() {};
	Object.extend({
		create: function(proto) {
			Prototype.prototype = proto;
			
			var instance = new Prototype();
			if (!instance.hasOwnProperty('__proto__'))
				instance.__proto__ = proto;
			
			return instance;
		},
		defineProperty: function(obj, name, descr) {
			if ('value' in descr) {
				obj[name] = descr.value;
			} else {
				if ('get' in descr)
					obj.__defineGetter__(name, descr.get);
				
				if ('set' in descr)
					obj.__defineSetter__(name, descr.set);
			}
		},
		getOwnPropertyDescriptor: function(obj, name) {
			if (obj.hasOwnProperty(name)) {
				var d = {
					configurable: true,
					enumerable: true
				};
				
				var getter, setter;
				if (obj.__lookupGetter__) {	
					if (getter = obj.__lookupGetter__(name))
						d.get = getter;
					
					if (setter = obj.__lookupSetter__(name))
						d.set = setter;
				}
				
				if (!getter && !setter) {
					d.value = obj[name];
					d.writable = true;
				}
				
				return d;
			}
		},
		keys: function(obj) {
			var names = [];
			for (var name in obj)
				if (obj.hasOwnProperty(name) && name != '__proto__')
					names.push(name);
			
			return names;
		},
		getPrototypeOf: function(obj) {
			return obj.__proto__ || obj.constructor.prototype;
		}
	});

	Object.getOwnPropertyNames = Object.keys;
	
	if (!Function.prototype.bind) {
		Function.prototype.bind = function(self) {
			var func = this;
			return function() {
				return func.apply(self, arguments);
			};
		};
	}
	
	if (!Array.prototype.indexOf) {
		Object.extend(Array.prototype, {
			indexOf: function(searchElement, fromIndex) {
				if (!fromIndex)
					fromIndex = 0;
				
				if (fromIndex < 0)
					fromIndex = Math.max(0, this.length + fromIndex);
				
				for (var i = fromIndex; i < this.length; ++i) {
					if (this[i] === searchElement)
						return i;
				}
					
				return -1;
			},
			lastIndexOf: function(searchElement, fromIndex) {
				if (!fromIndex)
					fromIndex = -1;
				
				if (fromIndex < 0)
					fromIndex = this.length + fromIndex;
				
				fromIndex = Math.min(this.length - 1, fromIndex);
				
				for (var i = fromIndex; i >= 0; --i) {
					if (this[i] === searchElement)
						return i;
				}
					
				return -1;
			}
		});
	}
	
	Trait.prototype = Object.create(Object.basePrototype);
	
	if (![].__proto__) {
		var inherit = Function.prototype.inherit;
		Function.prototype.inherit = function() {
			var cls = inherit.apply(this, arguments);
			cls.wrappedPrototype = cls.prototype;
			cls.prototype = Object.create(cls.prototype);
			return cls;
		};
	}
})();