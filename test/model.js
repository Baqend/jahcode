var TraitA = Trait.inherit({
	initialize: function() {
		this.fieldA = true;
	},
	
	overridden: function() {
        return "TraitA"; 
    },
    
    a: function() {
    	return "A";
    }
});

var TraitB = TraitA.inherit({
	initialize: function() {
		this.fieldB = this.fieldA;
	},
	
	overridden: function() {
        return "TraitB " + this.superCall(); 
    },
    
    b: function() {
        return "B";
    }
});

var TraitC = TraitA.inherit({
	initialize: function() {
		this.fieldC = this.fieldA;
	},
	
	overridden: function() {
        return "TraitC " + this.superCall(); 
    },
    
    c: function() {
        return "C";
    }
});

var TraitD = TraitB.inherit(TraitC, {
	initialize: function() {
		this.fieldD = this.fieldC && this.fieldB;
	},
	
	overridden: function() {
        return "TraitD " + this.superCall(); 
    },
    
    d: function() {
        return "D";
    }
});

var ClassA = Object.inherit(TraitA, TraitB, {
	initialize: function() {
		this.fieldE = this.fieldA && this.fieldB;
	},
	
	overridden: function() {
		return "ClassA " + this.superCall(); 
	},
	
	a: function() {
		return "Class" + this.superCall();
	},
	
	e: function() {
		return "E";
	}
});

var ClassB = ClassA.inherit(TraitA, TraitC, TraitD, {
	initialize: function() {
		this.fieldF = this.fieldA && this.fieldC && this.fieldD && this.fieldE;
	},
	
	overridden: function() {
        return "ClassB " + this.superCall(); 
    },
    
    a: function() {
		return "ClassB " + this.superCall();
	},
	
	b: function() {
		return "Class" + this.superCall();
	},
	
	d: function() {
		return "ClassB " + this.superCall();
	},
	
	f: function() {
		return "F";
	}
});