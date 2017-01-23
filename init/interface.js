'use strict';

/*
注册 app:// 协议
并开放 app://protocol/xxx 的注册接口
可以使用 Interfaces.add('package', function); 注册
将 app://package/xxx 导流到指定的处理器内
 */

const Network = require('../manager/network');

const Interfaces = {};

/**
 *
 * @param {String} name
 * @param {Object} handler
 */
exports.add = function (name, handler) {
    console.log(`[Interface] Add handler - ${name}`);
    Interfaces[name] = handler;
};

exports.remove = function (name, handler) {
    console.log(`[Interface] Remove handler - ${name}`);
    delete Interfaces[name];
};

Network.register('app:', function (event, data) {
    var cache = Interfaces[event.options.to];
    if (cache) {
        var handler = cache[event.options.path];
        if (handler) {
            return handler(event, data);
        }
    }
    event.reply(`Interface is not found: app://${event.options.to}/${event.options.path}`);
});