function defineAnimal() {
    Animal = dojo.declare(null, {
        constructor: function (name) {
            this.name = name;
        },
        getName: function () {
            return this.name;
        },
        setName: function (name) {
            this.name = name;
        }
    });
}

function defineAgedAnimal() {
    AgedAnimal = dojo.declare(Animal, {
        constructor: function (name, age) {
            this.age = age;
        },
        getAge: function () {
            return this.age;
        }
    });
}

function defineCat() {
    Cat = dojo.declare(AgedAnimal, {});
}

function defineDog() {
    Dog = dojo.declare(AgedAnimal, {
        getAge: function () {
            return this.inherited(arguments) * 7;
        }
    });
}