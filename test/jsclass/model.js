function defineAnimal() {
    Animal = new JS.Class({
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
    AgedAnimal = new JS.Class(Animal, {
        initialize: function (name, age) {
            this.callSuper(name);
            this.age = age;
        },
        getAge: function () {
            return this.age;
        }
    });
}

function defineCat() {
    Cat = new JS.Class(AgedAnimal, {});
}

function defineDog() {
    Dog = new JS.Class(AgedAnimal, {
        getAge: function () {
            return this.callSuper() * 7;
        }
    });
}