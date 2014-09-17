function defineAnimal() {
    Animal = function (name) {
        this.name = name;
    };

    Animal.prototype.getName = function () {
        return this.name;
    };

    Animal.prototype.setName = function (name) {
        this.name = name;
    };
}

function defineAgedAnimal() {
    AgedAnimal = function (name, age) {
        Animal.call(this, name);
        this.age = age;
    };

    AgedAnimal.prototype = new Animal();

    AgedAnimal.prototype.getAge = function () {
        return this.age;
    };
}

function defineCat() {
    Cat = function (name, age) {
        AgedAnimal.call(this, name, age);
    };

    Cat.prototype = new AgedAnimal();
}

function defineDog() {
    Dog = function (name, age) {
        AgedAnimal.call(this, name, age);
    };

    Dog.prototype = new AgedAnimal();
    Dog.prototype.getAge = function () {
        return AgedAnimal.prototype.getAge.call(this) * 7;
    };
}