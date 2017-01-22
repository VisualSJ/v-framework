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

var state = 'pause';

exports.interfaces = {
    '/controller-operation' (event, data) {
        this.broadcast('controller-operation', data);
    }
};

exports.messages = {
    'state-changed' (event, data) {
        this.push('state-changed', data);
    }
};