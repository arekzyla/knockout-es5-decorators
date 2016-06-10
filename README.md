# knockout-es5-decorators

Decorators to simplify and boost MVVM with Knockout

### Installation 

Just add a script tag referencing this plugin. Make sure to place the reference after both Knockout and Knockout ES5 plugin:

```HTML
<script src='knockout-x.y.z.js'></script>
<script src='knockout-es5.min.js'></script>
<script src='knockout-es5-decorators.js'></script>
```

### Getting started

All of the decorators are in the ko.decorators object but to make your code cleaner you can always make some aliases:

```typescript

var d = ko.decorators;
var observable = d.observable;

```

For all of the decorators to work you need to decorate your ViewModel like this:

```typescript

@decoratable 
class ViewModel {

}

```

### Observable properties
You can create an observable property like this:
```typescript

@observable firstName: string;
@observable lastName: string = 'Doe';

```
If value is not initialized it will be set to null.

### Computed properties

Computed properties can be created like this:
```typescript

@computed get fullName() {
    return `${this.firstName} ${this.lastName}`;
}

```

You can also define a setter:

```typescript

@computed 
get fullName() {
    return `${this.firstName} ${this.lastName}`;
}
set fullName(str: string) {
    var splitted = (str || '').split(" "); 
    this.firstName = splitted[0];
    this.lastName = splitted[1];
}

```

### Extending observables
You can extend observables this way:

```typescript

@extend({ notify: 'always' })
@observable firstName: string = 'John';

```

It is especially useful with Knockout Validation

```typescript

@extend({ required: true })
@observable firstName: string;

```

You can also pass a function as an argument:

```typescript

requireFirstName: boolean = true;

@extend<ViewModel>(o => { return { required: o.requireFirstName } } )
@observable firstName: string;

```

### Subscriptions

You can also subscribe to an observable:

```typescript

@subscribe<ViewModel>((o, nv) => o.onLastNameChange(nv))
@observable lastName: string;

private onLastNameChange(newLastName: string) {
}

```

### Full example:

```typescript
//You can create alias like this
var d = ko.decorators;
//Or like this for every decorator
var observable = d.observable;
var subscribe = d.subscribe;
var computed = d.computed;
var extend = d.extend;

@d.decoratable
export class SampleViewModel {

    @d.observable value: number = 3;

    @d.computed
    get double() {
        return this.value * 2;
    }
    set double(v) {
        this.value = v / 2;
    }

    //Note that validation extenders are not provided with this plugin
    @extend({ required: true })
    @observable firstName: string;

    @subscribe(o => console.log('Last name changed.'))
    @extend<SampleViewModel>(o => o.validateLastName())
    @observable lastName: string;

    @subscribe<SampleViewModel>((o, nv) => o.onFullNameChange(nv))
    @computed get fullName() {
        return `${this.firstName } ${this.lastName }`;
    }

    private validateLastName() {
        var validator = () => {
            return !!this.lastName;
        };
        return {
            validation: {
                validator: validator,
                message: 'Last name is required.'
            }
        }
    }
    
    private onFullNameChange(newFullName: string) {
        console.log(`New full name is: ${newFullName}`);
    }
}
```
