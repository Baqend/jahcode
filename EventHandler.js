Object.extend(Object.properties, {
	on: function(proto, objectDescriptor) {
		if (proto.constructor.linearizedTypes.lastIndexOf(EventHandler) != -1) {
			proto.constructor.on = objectDescriptor.on;
			return true;
		}
	}
});

var EventHandler = Trait.inherit({
	initialize: function() {
		this.on = {};
		
		var types = classOf(this).linearizedTypes;
		for (var i = types.length - 1, type; (type = types[i]) && type !== EventHandler; --i) {
			if (type.on)
				this.bindEventHandlers(type.on);
		}
	},
	
	bindEventHandlers: function(handlers, override) {
		for (handlerName in handlers) {
			if (override || !this.on.hasOwnProperty(handlerName)) {
				this.on[handlerName] = handlers[handlerName].bind(this);
			}
		}
	}
});