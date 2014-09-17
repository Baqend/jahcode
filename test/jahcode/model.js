function defineAnimal() {
    Animal = Object.inherit({
        initialize: function (name) {
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
    AgedAnimal = Animal.inherit({
        initialize: function (name, age) {
            this.superCall(name);
            this.age = age;
        },
        getAge: function () {
            return this.age;
        }
    });
}

function defineCat() {
    Cat = AgedAnimal.inherit({});
}

function defineDog() {
    Dog = AgedAnimal.inherit({
        getAge: function () {
            return this.superCall() * 7;
        }
    });
}