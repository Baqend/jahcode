beforeEach(function() {
    this.addMatchers({
        hasPrototypeChain : function(chain) {
            var expected = chain.isInstanceOf(Array) ? chain : arguments;

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

        isInstanceOf : function(klasses) {
            var expected = klasses.isInstanceOf(Array) ? klasses : arguments;

            for ( var i = 0, cls; cls = expected[i]; ++i) {
                if (this.isNot === this.actual.isInstanceOf(cls)) {
                    return this.isNot;
                }
            }

            return !this.isNot;
        },

        asInstanceOf : function(klasses) {
            var expected = klasses.isInstanceOf(Array) ? klasses : arguments;

            for ( var i = 0, cls; cls = expected[i]; ++i) {
                try {
                    this.actual.asInstanceOf(cls);

                    if (this.isNot) {
                        return this.isNot;
                    }
                } catch (e) {
                    if (!this.isNot) {
                        return this.isNot;
                    }
                }
            }

            return !this.isNot;
        },

        toBeCastable : function(to) {
            var expected = to.isInstanceOf(Array) ? to : arguments;

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
