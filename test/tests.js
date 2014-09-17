var tests = {
    testSimpleClassDefinition: function (count) {
        start();
        for (var i = 0; i < count; ++i) {
            defineAnimal();
        }
        stop();
    },

    testInheritanceClassDefinition: function (count) {
        start();
        for (var i = 0; i < count; ++i) {
            defineAnimal();
            defineAgedAnimal();
            defineCat();
        }
        stop();
    },

    testSimpleObjectCreation: function (count) {
        defineAnimal();
        start();

        arr = new Array(count);

        for (var i = 0; i < count; ++i)
            arr[i] = new Animal("Mouse");

        stop();
    },

    testComplexObjectCreation: function (count) {
        defineAnimal();
        defineAgedAnimal();
        defineCat();

        arr = new Array(count);

        start();
        for (var i = 0; i < count; ++i)
            arr[i] = new Cat("Mouse", 30);

        stop();
    },

    testSimpleMethodCall: function (count) {
        defineAnimal();
        var a = new Animal("Mouse");

        var test = true;
        start();
        for (var i = 0; i < count; ++i) {
            a.setName("Mouse" + i);
            test &= a.getName() == "Mouse" + i;
        }

        if (!test)
            throw new Error();

        stop();
    },

    testInheritedMethodCall: function (count) {
        defineAnimal();
        defineAgedAnimal();
        defineCat();

        var a = new Cat("Mouse", 30);

        var test = true;
        start();
        for (var i = 0; i < count; ++i) {
            a.setName("Mouse" + i);
            test &= a.getName() == "Mouse" + i;
        }

        if (!test)
            throw new Error();

        stop();
    },

    testSuperMethodCall: function (count) {
        defineAnimal();
        defineAgedAnimal();
        defineDog();

        var a = new Dog("Mouse", 30);

        var test = true;
        start();
        for (var i = 0; i < count; ++i) {
            a.age = i;
            test &= a.getAge() == i * 7;
        }

        if (!test)
            throw new Error();

        stop();
    }
};