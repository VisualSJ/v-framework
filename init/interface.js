'use strict';

/*
注册 app:// 协议
并开放 app://protocol/xxx 的注册接口
可以使用 Interfaces.add('package', function); 注册
将 app://package/xxx 导流到指定的处理器内
 */

const Console = require('../manager/console');
const Network = require('../manager/network');

const Interfaces = {};

/**
 * 注册访问方法到 app:// 下
 * @param {String} name
 * @param {Object} handler
 */
exports.add = function (name, handler) {
    Console.trace(`[Interface] register - app://${name}`);
    Interfaces[name] = handler;
};

/**
 * 删除已经注册的访问方法
 * @param name
 */
exports.remove = function (name) {
    Console.trace(`[Interface] register - app://${name}`);
    delete Interfaces[name];
};

/**
 * 注册 app 协议
 * 使用 app://xxx 进入到这个处理函数内
 */
Network.register('app:', function (event, data) {
    var cache = Interfaces[event.options.to];
    if (cache) {
        var handler = cache[event.options.path];
        if (handler) {
            return handler(event, data);
        }
    }
    var message = `Interface is not found: app://${event.options.to}/${event.options.path}`;
    Console.warn(message);
    event.reply(message);
});