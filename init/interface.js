'use strict';

const Network = require('../manager/network');

const Interfaces = {};

/**
 *
 * @param {String} name
 * @param {Object} handler
 */
exports.add = function (name, handler) {
    Interfaces[name] = handler;
};

exports.remove = function (name, handler) {
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