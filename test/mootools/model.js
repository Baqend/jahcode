function defineAnimal() {
    Animal = new Class({
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
    AgedAnimal = new Class({
        Extends: Animal,
        initialize: function (name, age) {
            this.parent(name);
            this.age = age;
        },
        getAge: function () {
            return this.age;
        }
    });
}

function defineCat() {
    Cat = new Class({
        Extends: AgedAnimal
    });
}

function defineDog() {
    Dog = new Class({
        Extends: AgedAnimal,
        getAge: function () {
            return this.parent() * 7;
        }
    });
}