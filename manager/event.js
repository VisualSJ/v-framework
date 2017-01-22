'use strict';
/*
Core 层的数据中枢
 */

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

/**
 * 在某个 object 上挂载 event 数据中枢的转发器
 * 这个对象在 on 注册事件的时候，事件会以 'name:message' 注册到事件中枢中
 *
 * @param object
 * @param name
 * @returns {*}
 */
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