'use strict';

const Events = require('events');

var EventManager = new Events.EventEmitter();

exports.on = function (...args) {
    EventManager.on(...args);
};

exports.off = function (...args) {
    EventManager.off(...args);
};

exports.once = function (...args) {
    EventManager.once(...args);
};

exports.emit = function (...args) {
    EventManager.emit(...args);
};

exports.mount = function (object, name) {

    object.on = function (message, ...args) {
        EventManager.on(`${name}:${message}`, ...args);
    };
    object.off = function (message, ...args) {
        EventManager.off(`${name}:${message}`, ...args);
    };
    object.once = function (message, ...args) {
        EventManager.once(`${name}:${message}`, ...args);
    };
    object.emit = function (message, ...args) {
        EventManager.emit(`${name}:${message}`, ...args);
    };

    return object;
};