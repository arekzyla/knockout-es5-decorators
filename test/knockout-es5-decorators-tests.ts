QUnit.module("Knockout decorators");

var d = ko.decorators;

ko.extenders['setValue'] = (target, value) => {
    target(value);
    return target;
};

@d.decoratable
class SomeViewModel {

}

@d.decoratable
class ObservableViewModel {

    @d.observable value: any;
    @d.observable otherValue: number = 3;
}

@d.decoratable
class ComputedViewModel {

    @d.observable value: any;
    @d.observable otherValue: number = 3;

    @d.computed get square() {
        return this.otherValue ** 2;
    }

    @d.computed
    get double() {
        return this.otherValue * 2;
    }
    set double(a: number) {
        this.otherValue = a / 2;
    }
}

@d.decoratable
class ExtendViewModel {

    @d.extend({ setValue: 'b' })
    @d.observable extendedValue: string = 'a';
    someValue: string = 'c';

    @d.extend<ExtendViewModel>(o => { return { setValue: o.someValue } })
    @d.observable otherExtendedValue: string = 'a';
}

@d.decoratable
class SubscribeViewModel {

    valueChanged = false;

    @d.subscribe<SubscribeViewModel>(o => o.valueChanged = true)
    @d.observable value = 'a';
}

QUnit.test('A class decorated with the "decoratable" decorator should be constructed.', assert => {
    var vm = new SomeViewModel();
    assert.ok(true);
});

QUnit.test('A not initialized property decorated with the "observable" decorator should be observable.', assert => {
    var vm = new ObservableViewModel();
    assert.notEqual(ko.getObservable(vm, 'value'), null);
});

QUnit.test('A not initialized property decorated with the "observable" decorator should return null.', assert => {
    var vm = new ObservableViewModel();
    assert.equal(vm.value, null);
});

QUnit.test('An iInitialized property decorated with the "observable" decorator should be observable.', assert => {
    var vm = new ObservableViewModel();
    assert.notEqual(ko.getObservable(vm, 'otherValue'), null);
});

QUnit.test('An initialized property decorated with the "observable" decorator should save its initial value.', assert => {
    var vm = new ObservableViewModel();
    assert.equal(vm.otherValue, 3);
});

QUnit.test('A property with definied getter and decorated with the "computed" decorator should be a computed property.', assert => {
    var vm = new ComputedViewModel();
    assert.notEqual(ko.getObservable(vm, 'square'), null);
});

QUnit.test('A property with definied getter and decorated with the "computed" decorator should return a value as it is definied in its getter.', assert => {
    var vm = new ComputedViewModel();
    assert.equal(vm.square, 9);
});

QUnit.test('A property with definied getter and setter and decorated with the "computed" decorator should be a computed property.', assert => {
    var vm = new ComputedViewModel();
    assert.notEqual(ko.getObservable(vm, 'double'), null);
});

QUnit.test('A property with definied getter and setter and decorated with the "computed" decorator should return a value as it is definied in its getter.', assert => {
    var vm = new ComputedViewModel();
    assert.equal(vm.double, 6);
});

QUnit.test('A property with definied getter and setter and decorated with the "computed" decorator should be set as it is definied in its setter.', assert => {
    var vm = new ComputedViewModel();
    vm.double = 10;
    assert.equal(vm.otherValue, 5);
});

QUnit.test('An observable property decorated with the "extend" decorator factory with an object parameter should be extended with this object.', assert => {
    var vm = new ExtendViewModel();
    assert.equal(vm.extendedValue, 'b');
});

QUnit.test('An observable property decorated with the "extend" decorator factory with a function parameter should be extended with the function\'s value.', assert => {
    var vm = new ExtendViewModel();
    assert.equal(vm.otherExtendedValue, 'c');
});

QUnit.test('An observable property decorated with the "subscribe" decorator factory with a function parameter should have this function subscribed.', assert => {
    var vm = new SubscribeViewModel();
    assert.equal(vm.valueChanged, false);
    vm.value = 'b';
    assert.equal(vm.valueChanged, true);
});