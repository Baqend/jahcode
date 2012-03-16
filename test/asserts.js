function assertPrototypeChain(expected, actual) {
	var proto = actual;
	for (var i = expected.length - 1, cls; cls = expected[i]; --i) {
		do {
			proto = Object.getPrototypeOf(proto);
		} while (!proto.hasOwnProperty('constructor'));
		
		assertSame(cls, proto.constructor);
	}
}

function assertIsInstanceOf(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertTrue(actual.isInstanceOf(cls));
	}
}

function assertNotIsInstanceOf(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertFalse(actual.isInstanceOf(cls));
	}
}

function assertAsInstanceOf(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertNoException(function() {
			actual.asInstanceOf(cls);
		});
	}
}

function assertNotAsInstanceOf(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertException(function() {
			actual.asInstanceOf(cls);
		});
	}
}

function assertClassCast(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertSame(cls(actual), actual);
	}
}

function assertNotClassCast(expected, actual) {
	expected.isInstanceOf(Array)? expected: [expected];
	
	for (var i = 0, cls; cls = expected[i]; ++i) {
		assertNull(cls(actual));
	}
}