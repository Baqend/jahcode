JavaScript Classes and Traits
=============================

A framework for declaring Classes and Traits easily in JS, where the inheritance of Classes and Traits will be mapped on to the native Prototype model of JS

Defining Classes
----------------
A class can be defined with the inherit method. The inherit method expect at least one argument the class body. 
The class body is written in the simple object notation and contains all members which will be available on instances 
of the created class. The optional initialize method is the method which is called every time an instance is been created of the
current class and so it behaves like a constructor

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
    
To Use the Class just instantiate it, and use his members as you know
    
    var myClass = new SimpleClass();
    myClass.saySomething();
    
Constructor arguments can be declared as you aspect, they will be passed to the initialize method
    
    var SimpleClass = Object.inherit({
        initialize: function(customText) {
            this.text = customText;
        },
        ...
        
    var myClass = new SimpleClass('Hello World');

The constructor property is also available and always refers the class object of an instance, as it is the JavaScript way
    
    myClass.constructor == SimpleClass // true

Inheritance
-----------

To extend a class, just simply use the inherit Method which is defined on every class object
On the first example we didn't want to extend any specific class so we call the method just on the Object class, 
since the Object is the base class of all classes in JS.
But if we want to extend a specific Class we will call the inherit method on that specific class instead

So let's extend the SimpleClass and override the saySomething method

    var SpecificClass = SimpleClass.inherit({
        saySomething: function() {
            alert(this.text + ' on a more specific way');
        }
    });

Many frameworks provide a simple way to access the parent overwritten method from the overwriting method
for doing this every object contains a superCall method which does this job

    var SpecificClass = SimpleClass.inherit({
        saySomething: function() {
            alert(this.superCall() + ' on a more specific way');
        }
    });

It is also possible to call the parent initialize method with the callSuper method
Note: if an initialize method didn't call the parent initialize method the parent initialize method will be called automatically with 
no arguments passed and before the actual initialize method is called 

Static members
--------------

To declare static members (means members that are applied to the class object itself) the special property constructor can be used for it.
The constructor property is a special property what can be optional set in the class body.

    var StaticMembersClass = SimpleClass.inherit({
        constructor: {
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

Another feature what is introduced with this framework are scala like traits.
Traits can be used to define interface with an optional provided implementation for each method, traits can be mixined in classes 
so that they inherit the implementation of the mixined traits
If the same trait occurs more than one time in the inheritance hierarchy only the first trait will stay in the hierarchy. 
Importing one trait more than one time will be ignored, as it is part of the common linearization process

Define a trait is very similar to declare a class

    var SimpleTrait = Trait.inherit({
        text: 'Hello World from a SimpleTrait',
        
        saySomething: function() {
            alert(this.text);
        }
    });
    
To use one or more traits you can import them by just list all traits as arguments before the class body argument for the inherit method. 
    
    //saySomething is imported form the SimpleTrait
    var SimpleClass = Object.inherit(SimpleTrait, {
        initialize: function(customText) {
            this.text = customText;
        }
    });
    
    var myClass = new SimpleClass('Hello World with trait');
    myClass.saySomething(); // will output 'Hello World with trait'

Also traits can inherit and mixined other traits
    
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

As it is usually common to check the type of an instance with instanceof the framework provide more functionality to check the type
Of course the instanceof methods works fine for all classes and Traits which was not mixined into an class, this method doesn't work 
for Traits which was mixined in to a class. For doing that there exist two more methods inspired by scala which each object owned.
And I prefer to use this methods always, to check the right type and forgot about instanceof.

With the isInstanceOf method you can chack the type of an instance as you do it with instaceof but it works for classes and all mixins as well.

    myClass.isInstanceOf(SimpleClass) // true
    myClass.isInstanceOf(SimpleTrait) // true
    
Another way to check the type is with asInstanceOf, it will check the type and returns the object itself if the type is correct and will otherwise throw an TypeError 

    myClass.asInstanceOf(SimpleClass) // returns myClass
    myClass.asInstanceOf(SimpleTrait) // returns myClass
    myClass.asInstanceOf(MyFunkyClass) // throws TypeError
    
A third way which is sometimes called soft casting is inspired by Actionscript, where you can use the class constructor 
to cast an object to the right type or you will get null if the type mismatch. However I found this way of type casting most use full so it is implemented 
directly in every class constructor which was created with the inherit method

    SimpleClass(myClass) // returns myClass
    SimpleTrait(myClass) // returns myClass
    MyFunkyClass(myClass) // returns null
    
