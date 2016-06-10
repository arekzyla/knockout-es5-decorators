// Type definitions for Knockout-ES5-Decorators
// Project: https://github.com/arekzyla/knockout-es5-decorators

/// <reference path="../knockout/knockout.d.ts" />

interface KnockoutStatic {
    decorators: KnockoutDecorators;
}

interface KnockoutDecorators {
    decoratable(obj: any);
    observable(obj: any, key: string);
    computed(obj: any, key: string);
    extend<T>(ruleDefinitions: {} | ((obj: T) => {}));
    subscribe<T>(callback: (obj: T, newValue?: any) => void, target?: any, event?: string);
}