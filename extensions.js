Object.getBasePrototype(Array).initialize = function() {
	for (var i = 0; i < arguments.length; ++i)
		this[i] = arguments[i];
	
	this.length = arguments.length;
};

Object.getBasePrototype(Error).initialize = function(message) {
	this.message = message;
};