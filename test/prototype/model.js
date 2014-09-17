function defineAnimal() {
    Animal = Class.create({
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
    AgedAnimal = Class.create(Animal, {
        initialize: function ($super, name, age) {
            $super(name);
            this.age = age;
        },
        getAge: function () {
            return this.age;
        }
    });
}

function defineCat() {
    Cat = Class.create(AgedAnimal, {});
}

function defineDog() {
    Dog = Class.create(AgedAnimal, {
        getAge: function ($super) {
            return $super() * 7;
        }
    });
}