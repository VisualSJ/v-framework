'use strict';

/**
 * 插件加载成功的时候的处理函数
 */
exports.load = function () {

};

/**
 * 插件卸载之后的处理函数
 */
exports.unload = function () {

};

exports.interfaces = {
    '/state-changed' (event, data) {
        this.broadcast('state-changed', data);
    }
};

exports.messages = {
    'controller-operation' (event, data) {
        var operation = {
            type: data.type,
            from: event.from
        };
        this.push('operation', operation);
    }
};