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
    '/selected' (event, data) {
        this.broadcast('menu-selected', data);
    }
};

exports.messages = {};