"use strict";
exports.__esModule = true;
exports.debounce = void 0;
function debounce(delay) {
    if (delay === void 0) { delay = 300; }
    return function (target, propertyKey, descriptor) {
        var timeoutKey = Symbol();
        var original = descriptor.value;
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            clearTimeout(this[timeoutKey]);
            this[timeoutKey] = setTimeout(function () { return original.apply(_this, args); }, delay);
        };
        return descriptor;
    };
}
exports.debounce = debounce;
