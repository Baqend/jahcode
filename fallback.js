(function() {
	//Add support for ff 3 and some older webkit versions
	if (Object.create)
		return;
	
	var Prototype = function() {};
	Object.extend({
		create: function(proto) {
			Prototype.prototype = proto;
			
			return new Prototype();
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
				if (obj.hasOwnProperty(name))
					names.push(name);
			
			return names;
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
})();