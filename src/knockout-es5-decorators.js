/*!
 * Knockout ES5 Decorators plugin - https://github.com/arekzyla/knockout-es5-decorators
 * Copyright (c) Arkadiusz Żyła
 * MIT license
 */

; (function (factory) {
    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("knockout-es5"), exports);
        //AMD
    } else if (typeof define === "function" && define.amd) {
        define(["knockout-es5", "exports"], factory);
        //normal script tag
    } else {
        factory(ko, ko.decorators = {});
    }
}(function (ko, exports) {

    exports.decoratorsArrayName = '__kodecorators__';

    exports.registerDecoratorFactory = function (obj, dec) {
        obj[exports.decoratorsArrayName] = obj[exports.decoratorsArrayName] || [];
        obj[exports.decoratorsArrayName].push(dec);
    }

    exports.applyDecorators = function (obj) {
        if (obj[exports.decoratorsArrayName]) {
            obj[exports.decoratorsArrayName].forEach(function(f) { f(obj) });
            delete obj[exports.decoratorsArrayName];
        }
    }

    exports.decoratable = function (target) {
        var original = target;
        function construct(constructor, args) {
            var c = function () {
                return constructor.apply(this, args);
            }
            c.prototype = constructor.prototype;
            return new c();
        }
        var f = function (args) {
            var obj = construct(original, args);
            exports.applyDecorators(obj);
            return obj;
        }
        f.prototype = original.prototype;

        return f;
    }

    exports.observable = function (obj, key) {
        exports.registerDecoratorFactory(obj, function (o) {
            o[key] = o[key] === undefined ? null : o[key];
            ko.track(o, [key]);
        });
    }

    exports.computed = function (obj, key, options) {
        var getter = Object.getOwnPropertyDescriptor(obj, key).get;
        var setter = Object.getOwnPropertyDescriptor(obj, key).set;
        if (!getter) {
            throw new Error("Property '" + key + "' has no getter definied and thus cannot be a computed property.");
        }
        exports.registerDecoratorFactory(obj, function (o) {
            delete obj[key];
            ko.defineProperty(o, key, {
                get: getter,
                set: setter
            });
        });
    }

    exports.extend = function (ruleDefinitions) {
        return function (obj, key) {
            exports.registerDecoratorFactory(obj, function (o) {
                var observable = ko.getObservable(o, key);
                if (!observable) {
                    throw new Error("Property '" + key + "' is not observable and thus cannot be extended.");
                }
                observable.extend(ruleDefinitions instanceof Function ? ruleDefinitions(o) : ruleDefinitions);
            });
        }
    }

    exports.subscribe = function (callback, target, event) {
        return function (obj, key) {
            exports.registerDecoratorFactory(obj, function (o) {
                var observable = ko.getObservable(o, key);
                if (!observable) {
                    throw new Error("Property '" + key + "' is not observable and thus cannot be subscribed.");
                }
                observable.subscribe(function (nv) { callback(o, nv), target, event });
            });
        }
    }
}));