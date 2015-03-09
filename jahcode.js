/*! Jahcode v1.1.6 | jahcode.com | Copyright 2011-2014 by Florian Buecklers | MIT license */

(function(global) {
    var fakePrototype = Object.getPrototypeOf({
            constructor : String
        }) == String.prototype;

    if (!Function.prototype.extend) {
        /**
         * Extends the target with the properties of props and return target
         * @param {*=} target The target to extends or thisArg, if it is not set
         * @param {Object} props The properties to extend
         * @returns {*} The extended target
         */
        Function.prototype.extend = function(target, props) {
            if (!props) {
                props = target;
                target = this;
            }

            for (var name in props) {
                if (props.hasOwnProperty(name)) {
                    target[name] = props[name];
                }
            }

            return target;
        };
    }

    Object.extend(Function.prototype, /** @lends Function.prototype */ {
        /**
         * The linearized type hierarchy of this class
         * @type Function[]
         */
        linearizedTypes : [Object],

        /**
         * Inherits this constructor and extends it by additional properties and methods. Optional there can be mixined
         * additional Traits
         * @param {Trait...} traits Additional traits to mixin
         * @param {Object} classDescriptor The descriptor of the class properties and methods
         * @returns {Function} The new created child class
         */
        inherit : function() {
            var objectDescriptor = arguments[arguments.length - 1];
            var klass = objectDescriptor.constructor !== Object? objectDescriptor.constructor: function Class(toCast) {
                if (!(this instanceof klass)) {
                    return klass.asInstance(toCast);
                }

                if (this.initialize)
                    arguments.length ? this.initialize.apply(this, arguments) : this.initialize();
            };

            var proto = Object.createPrototypeChain(klass, this, Array.prototype.slice.call(arguments, 0, arguments.length - 1));

            var names = Object.getOwnPropertyNames(objectDescriptor);
            for ( var i = 0; i < names.length; ++i) {
                var name = names[i];
                var result = false;
                if (Object.properties.hasOwnProperty(name)) {
                    result = Object.properties[name](proto, objectDescriptor, name);
                }

                if (!result) {
                    var d = Object.getOwnPropertyDescriptor(objectDescriptor, name);

                    if (d.value) {
                        var val = d.value;
                        if (val instanceof Function) {
                            if (/this\.superCall/.test(val.toString())) {
                                d.value = Object.createSuperCallWrapper(klass, name, val);
                            }
                        } else if (val && (val.hasOwnProperty('get') || val.hasOwnProperty('value'))) {
                            d = val;
                        }
                    }

                    Object.defineProperty(proto, name, d);
                }
            }

            if (klass.initialize) {
                klass.initialize();
            }

            return klass;
        },

        /**
         * Indicates if this class is a subclass of the given class or mixin the given trait.
         * @param {Function} cls The parent class or trait to check
         * @returns {boolean} <code>true</code> if this class is a subclass or mixin the trait
         */
        isA: function(cls) {
            return this.prototype instanceof cls || this.linearizedTypes.lastIndexOf(cls) != -1;
        },

        /**
         * Indicates if the object is an instance of this class
         * @param obj The object to check for
         * @returns {boolean} <code>true</code> if the object is defined and
         */
        isInstance : function(obj) {
            if (obj === null || obj === void 0)
                return false;

            return Object(obj) instanceof this || classOf(obj).linearizedTypes.lastIndexOf(this) != -1;
        },

        /**
         * Checks if the object is an instance of this class and returns the object or try to convert the
         * object to an instance of this class by calling {@link #conv}
         * @param obj The object to check
         * @returns {*} The typed object or null, if the object can't be typed to an instance of this class
         */
        asInstance : function(obj) {
            if (this.isInstance(obj)) {
                return obj;
            } else {
                return this.conv(obj);
            }
        },

        /**
         * Converts the given value to an instance of this class, or returns null, if the value can't be converted
         * @param {*} value The value to convert
         * @returns {null} The converted value or null
         */
        conv : function() {
            return null;
        }
    });

    Object.extend( /** @lends Object **/ {
        properties : {},
        cloneOwnProperties : function(target, src) {
            var names = Object.getOwnPropertyNames(src);
            for ( var i = 0; i < names.length; ++i) {
                var name = names[i];
                if (name != '__proto__') {
                    var descr = Object.getOwnPropertyDescriptor(src, name);

                    Object.defineProperty(target, name, descr);
                }
            }
        },
        createPrototypeChain : function(cls, parentClass, traits) {
            var proto = parentClass.prototype;
            var linearizedTypes = parentClass.linearizedTypes.slice();
            var prototypeChain = parentClass.prototypeChain ? parentClass.prototypeChain.slice() : [proto];

            for ( var i = 0, trait; trait = traits[i]; ++i) {
                if (!(trait.prototype instanceof Trait)) {
                    throw new TypeError("Only traits can be mixed in.");
                }

                var linearizedTraitTypes = trait.linearizedTypes;
                for ( var j = 0, type; type = linearizedTraitTypes[j]; ++j) {
                    if (linearizedTypes.indexOf(type) == -1 && type != Trait) {
                        proto = Object.create(proto);
                        Object.cloneOwnProperties(proto, type.wrappedPrototype ? type.wrappedPrototype : type.prototype);

                        proto.constructor = type;

                        linearizedTypes.push(type);
                        prototypeChain.push(proto);
                    }
                }
            }

            proto = Object.create(proto);
            proto.constructor = cls;

            linearizedTypes.push(cls);
            prototypeChain.push(proto);

            if (fakePrototype) {
                cls.wrappedPrototype = proto;
                cls.prototype = Object.create(proto);
            } else {
                cls.prototype = proto;
            }

            cls.linearizedTypes = linearizedTypes;
            cls.prototypeChain = prototypeChain;

            return proto;
        },
        createSuperCallWrapper : function(declaringClass, methodName, method) {
            var superCall = function() {
                var cls = classOf(this);
                var index = cls.linearizedTypes.lastIndexOf(declaringClass);
                if (index == -1) {
                    throw new ReferenceError("superCall can't determine any super method");
                }

                var proto = cls.prototypeChain[index - 1];

                if (methodName != 'initialize' || proto[methodName])
                    return arguments.length ? proto[methodName].apply(this, arguments) : proto[methodName].call(this);
            };

            return function() {
                var current = this.superCall;
                this.superCall = superCall;

                try {
                    return arguments.length ? method.apply(this, arguments) : method.call(this);
                } finally {
                    if (current) {
                        this.superCall = current;
                    } else {
                        // made the property invisible again
                        delete this.superCall;
                    }
                }
            };
        }
    });

    Object.extend(Object.properties, {
        initialize : function(proto, objectDescriptor) {
            var init = objectDescriptor.initialize;
            var test = /this\.superCall/.test(init.toString());
            if (proto instanceof Trait) {
                if (test) {
                    throw new TypeError('Trait constructors can not call super constructors directly.');
                }

                objectDescriptor.initialize = function() {
                    arguments.length ? this.superCall.apply(this, arguments) : this.superCall.call(this);
                    init.call(this);
                };
            } else if (!test && classOf(proto) != Object) {
                objectDescriptor.initialize = function() {
                    this.superCall.call(this);
                    arguments.length ? init.apply(this, arguments) : init.call(this);
                };
            }
        },
        extend : function(proto, objectDescriptor) {
            Object.extend(proto.constructor, objectDescriptor.extend);
            return true;
        }
    });

    /**
     * Returns the constructor of the given object, works for objects and primitive types
     * @param {*} object The constructor to return for
     * @returns {Function} The constructor of the object
     * @global
     */
    var classOf = function(object) {
        if (object === null || object === void 0)
            return object;

        return Object.getPrototypeOf(Object(object)).constructor;
    };

    /**
     * @mixin Trait
     * @global
     */
    var Trait = Object.inherit({});

    /**
     * @extends Trait
     * @mixin Bind
     * @global
     */
    var Bind = Trait.inherit({
        /** @lends Bind */
        extend : {
            initialize : function() {
                try {
                    Object.defineProperty(this.prototype, 'bind', {
                        get : function() {
                            return this.bind = Bind.create(this);
                        },
                        set : function(val) {
                            Object.defineProperty(this, 'bind', {
                                value : val
                            });
                        },
                        configurable : true
                    });

                    this.Object = Object.inherit({
                        initialize : function(self) {
                            this.self = self;
                        }
                    });
                } catch (e) {
                    this.Object = Object.inherit({
                        initialize : function(self) {
                            this.self = self;

                            var bind = this;
                            Bind.each(self, function(name, method) {
                                bind[name] = method.bind(bind.self);
                            });
                        }
                    });
                }
            },

            /**
             * Creates a bind proxy for the given object
             * Each method of the given object is reflected on the proxy and
             * bound to the object context
             * @param {*} obj The object which will be bound
             * @returns {Bind} The bound proxy
             */
            create : function(obj) {
                if (!obj.constructor.Bind) {
                    try {
                        var descr = {};
                        Bind.each(obj, function(name, method) {
                            descr[name] = {
                                get : function() {
                                    return this[name] = method.bind(this.self);
                                },
                                set : function(val) {
                                    Object.defineProperty(this, name, {
                                        value : val
                                    });
                                },
                                configurable : true
                            };
                        });
                        obj.constructor.Bind = Bind.Object.inherit(descr);
                    } catch (e) {
                        obj.constructor.Bind = Bind.Object.inherit({});
                    }
                }

                return new obj.constructor.Bind(obj);
            },
            each : function(obj, callback) {
                var proto = Object.getPrototypeOf(obj);

                for ( var name in proto) {
                    var method = proto[name];
                    if (name != 'initialize' && name != 'constructor' && method instanceof Function) {
                        callback(name, method);
                    }
                }
            }
        },

        initialize : function() {
            if (!('bind' in this)) {
                this.bind = Bind.create(this);
            }
        }

        /**
         * @type Bind
         * @name Bind.prototype.bind
         */
    });

    var nativeClasses = [Boolean, Number, String, Function, RegExp, Error];
    for ( var i = 0, cls; cls = nativeClasses[i]; ++i) {
        cls.conv = cls;
    }

    Date.conv = function(object) {
        return new Date(object);
    };

    Array.conv = function(object) {
        return Array.prototype.slice.call(object);
    };

    Array.prototype.initialize = function() {
        for ( var i = 0; i < arguments.length; ++i) {
            this[i] = arguments[i];
        }

        this.length = arguments.length;
    };

    Error.prototype.initialize = function(message) {
        var stack = new Error().stack || 'Error';
        stack = stack.substring(stack.indexOf('\n') + 1);

        this.stack = message + '\n' + stack;
        this.message = message;
    };

    if (TypeError instanceof Error) { // ie8 uses error instances for subtype constructors
        Error.prototype.isInstance = Error.isInstance;
        Error.prototype.asInstance = Error.asInstance;
        Error.prototype.conv = Error.conv;
    }

    Object.extend(global, {
        classOf : classOf,
        Trait : Trait,
        Bind : Bind
    });
})(typeof window != 'undefined' ? window : global);