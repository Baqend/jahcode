beforeEach(function() {
    this.addMatchers({
        hasPrototypeChain : function(chain) {
            var expected = Array.isInstance(chain) ? chain : arguments;

            var proto = this.actual;
            for ( var i = expected.length - 1, cls; cls = expected[i]; --i) {
                do {
                    proto = Object.getPrototypeOf(proto);
                } while (!proto.hasOwnProperty('constructor'));

                if (this.isNot === (cls === proto.constructor)) {
                    return this.isNot;
                }
            }

            return !this.isNot;
        },

        isA : function(klasses) {
            var expected = Array.isInstance(klasses) ? klasses : arguments;

            for ( var i = 0, cls; cls = expected[i]; ++i) {
                if (this.isNot === this.actual.isA(cls)) {
                    return this.isNot;
                }
            }

            return !this.isNot;
        },

        isInstanceOf : function(klasses) {
            var expected = Array.isInstance(klasses) ? klasses : arguments;

            for ( var i = 0, cls; cls = expected[i]; ++i) {
                if (this.isNot === cls.isInstance(this.actual)) {
                    return this.isNot;
                }
            }

            return !this.isNot;
        },

        asInstanceOf : function(klasses) {
            var expected = Array.isInstance(klasses) ? klasses : arguments;

            for ( var i = 0, cls; cls = expected[i]; ++i) {
                if (!this.isNot) {
                    if (cls.asInstance(this.actual) !== this.actual)
                        return false;
                } else {
                    if (cls.asInstance(this.actual) === this.actual);
                        return true;
                }
            }

            return !this.isNot;
        },

        toBeCastable : function(to) {
            var expected = Array.isInstance(to) ? to : arguments;

            for ( var i = 0, cls; cls = expected[i]; ++i) {
                if (this.isNot) {
                    if (cls(this.actual) !== null) {
                        return true;
                    }
                } else {
                    if (cls(this.actual) !== this.actual) {
                        return false;
                    }
                }
            }

            return !this.isNot;
        }
    });
});
