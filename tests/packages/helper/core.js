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

exports.interfaces = {};

exports.messages = {

    'menu-selected' (event, data) {
        this.sendPage('selected', data);
    },

    'controller-operation' (event, data) {
        var operation = data.type;
        this.sendPage('operation', operation);
    }
};