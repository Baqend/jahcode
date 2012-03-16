JavaScript Classes and Traits
=============================

A framework to declare Classes and Traits with ease in JS.
Inheritance of Classes and Traits is mapped onto the native Prototype model of JS which makes it stable and fast.


Defining Classes
----------------
A class is defined by using the inherit method. 
The inherit method expects at least the class body as an argument . 
The class body is written in the simple object notation and contains all members which will be available to instances of the created class. 
The optional initialize method will be called on each instance of the current class to achieve a  constructor-like behaviour.

A simple class with a constructor and one method
    
    var SimpleClass = Object.inherit({
        initialize: function() {
            //just declare your members in the constructor
            this.text = 'Hello World';
        },
        
        saySomething: function() {
            alert(this.text);
        }
    });
    
To use the Class just instantiate it, and use its members as you are used to
    
    var myClass = new SimpleClass();
    myClass.saySomething();
    
Pass arguments to the constructor and process them in the initialize function.
    
    var SimpleClass = Object.inherit({
        initialize: function(customText) {
            this.text = customText;
        },
        ...
        
    var myClass = new SimpleClass('Hello World');

The constructor property is also available and refers the class object of an instance.
    
    myClass.constructor == SimpleClass // true

Inheritance
-----------

To extend a class, simply use the inherit Method which is defined on every class object
On the first example we didn't want to extend any specific class so we call the method on the Object class, since the Object is the base class of all classes in JS.

If you want to extend a specific Class, call the inherit method on that specific class instead

For example let’s extend SimpleClass and override the saySomething method

    var SpecificClass = SimpleClass.inherit({
        saySomething: function() {
            alert(this.text + ' on a more specific way');
        }
    });

A lot of frameworks provide a simple way to call the parents overwritten method from the overwriting child method.
For this every object contains a superCall method which does this job.

    var SpecificClass = SimpleClass.inherit({
        saySomething: function() {
            alert(this.superCall() + ' on a more specific way');
        }
    });

It is also possible to call the parents initialize method with the superCall method
Note: if an initialize method doesn’t call the parents initialize method the parents initialize method will be called by default without arguments and before the childs initialize method is called 

Static members
--------------

To declare static members (means members that are applied to the class object itself) you can make use of the special property extend.
The extend property is a special property which can be optionally set in the class body.

    var StaticMembersClass = SimpleClass.inherit({
        extend: {
            create: function() {
                return new this(); //this refers here to the class object itself
            }
        },
        initialize: function() {
            this.superCall('Hello World, again!');
        }
    });
    
    var myInstance = SimpleClass.create();
    myInstance.saySomething();

Traits
------

Another feature being introduced with this framework are scala-like Traits.
Traits can be used to define an interface with an optional provided implementation for each method, traits can be mixined in classes so that they inherit the implementation of the mixined traits.
If the same trait occurs more than one time in the inheritance hierarchy only the first trait will stay in the hierarchy. 
Traits which are imported more than once (in the entire hierarchy) will be ignored, as it is part of the common linearization process

Defining a Trait is very similar to declaring a Class

    var SimpleTrait = Trait.inherit({
        text: 'Hello World from a SimpleTrait',
        
        saySomething: function() {
            alert(this.text);
        }
    });
    
To use one or more Traits you can import them by listing all Traits as arguments before the class body argument is passed to the inherit method. 
    
    //saySomething is imported form the SimpleTrait
    var SimpleClass = Object.inherit(SimpleTrait, {
        initialize: function(customText) {
            this.text = customText;
        }
    });
    
    var myClass = new SimpleClass('Hello World with trait');
    myClass.saySomething(); // will output 'Hello World with trait'

Traits can also inherit and mixined other traits
    
    var TraitA = Trait.inherit({
        a: function() {
            return ', TraitA'; 
        }
    });
    
    var TraitB = Trait.inherit({
        b: function() {
            return ', TraitB'; 
        }
    });
    
    var TraitC = TraitB.inherit(TraitA, {
        c: function() {
            return 'from TraitC' + this.b() + this.a(); 
        }
    });
    
    var ComplexClass = SimpleClass.inherit(TraitC, {
        initialize: function() {
            this.superCall('Hello World ' + this.c());
        }
    });
    
    var myClass = new ComplexClass();
    myClass.saySomething(); // will output 'Hello World, from TraitC, TraitB, TraitA'

Type Checking and Casting
-------------------------

The common way to check the type of an instance is the use of instanceof.
The framework adds some more functionality for type checking. 

Even though the instanceof methods works fine for all classes and Traits which have  not been mixined into an class, this method doesn't work for Traits which have been mixined. 
For dealing with those there are two more methods inspired by scala which are owned by each object.
I prefer to use this methods by default for type checking. Just forget about instanceof.

With the isInstanceOf method you can check the type of an instance as you would with instanceof but it works for classes and all mixins as well.

    myClass.isInstanceOf(SimpleClass) // true
    myClass.isInstanceOf(SimpleTrait) // true
    
Another way to check the type is to use asInstanceOf. It will check the type and return the object itself if the type is correct. otherwise it will throw an TypeError 

    myClass.asInstanceOf(SimpleClass) // returns myClass
    myClass.asInstanceOf(SimpleTrait) // returns myClass
    myClass.asInstanceOf(MyFunkyClass) // throws TypeError
    
A third way which is sometimes called soft casting is inspired by Actionscript, where you can make use of the class constructor to cast an object to the desired type. It will retun null if the type does not. 
However I found this way of type casting the most useful so it’s implemented directly in every class object which is automatically created with the inherit method

    SimpleClass(myClass) // returns myClass
    SimpleTrait(myClass) // returns myClass
    MyFunkyClass(myClass) // returns null

Extending Traditional Classes
-----------------------------

It is also possible to mix classes written in this framework with classes that are written in traditional way

    var MyAlreadyDefiniedClass = function(message) {
        this.message = message;
    }
    
    MyAlreadyDefiniedClass.prototype.getSomethingToSay = function() { // :-<
        return this.message;
    }
    
    MyComplexClass = MyAlreadyDefiniedClass.inherit({
        initialize: function() {
            //will be forwarded to the traditional constructor
            this.superCall('My really complex message');
        },
        
        saySomething: function() {
            alert(this.getSomethingToSay());
        }
    });
    
    var myComplexObject = new MyComplexClass();
    myComplexObject.saySomething(); // alert 'My really complex message'
    
    myComplexObject.isInstanceOf(MyAlreadyDefiniedClass) // returns true
    myComplexObject.isInstanceOf(MyComplexClass) // returns true


ECMA 5 Based Getters and Setters
--------------------------------

Another new feature what was introduced with ECMA 5 was the possibility to declare getters and setters. 
You can used them already in the class body definition of any class and they work as same to the standard

Note: this feature works only in ECMA 5 based browsers, if you want to support older browser just don't use this feature.
The other parts of this framework works also in older browser if you import the shims from lib/es5-shim.min.js

    var GetterSetterClass = Object.inherit(SimpleTrait, {
        text: {
            get: function() {
                return this._text;
            },
            set: function(newText) {
                this._text = newText;
                this.saySomething();
            },
            enumerable: false //Also the other ECMA 5 settings for declaring properties works here
        }
    });
    
    var myClass = new GetterSetterClass();
    myClass.text = 'Hello World!'; // alert 'Hello World!'

EventHandler Trait
------------------

My first custom Trait, improves the way to declare event handlers. As you know Objects in JavaScript are first class objects
so methods lose they scope if you bind them as event handler. In most cases we don't want to lose the reference to the origin 
object who owns our event handler. So if you import the EventHandler.js you can declare your event handlers on a more common way.

    var MyEventHandler = SimpleClass.inherit(EventHandler, { //just mixin the EventHandler trait and al your event handlers don't lose there scopes
        on: { //declare your event handlers here
            click: function() {
                //this refers here to the MyEventHandler instance
                this.saySomething();
            }
        },
        initialize: {
            for (name in this.on) //register all event handlers on the window object
                window.addEventListener(name, this.on[name]);
        }
    });
    
    var myHandler = new MyEventHandler();
    

