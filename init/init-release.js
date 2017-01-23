'use strict';

const Path = require('path');
const Url = require('url');

const Interface = require('./interface');
const Event = require('../manager/event');
const Package = require('../manager/package');
const Window = require('../manager/window');
const Protocol = require('../manager/protocol');

Event.mount(exports, 'app');

/**
 *
 * @param {Object} options
 */
exports.start = function (options) {
    // 内置插件
    Package.search(Path.join(__dirname, '../builtin'));
    // 用户的插件
    Package.search(options.packages);
    // 打开窗口
    Window.open(options.window);
};

/**
 * 发布程序
 * 在发布模式下无效
 */
exports.build = function () {};

exports.Interface = Interface;

Protocol.register('app', function (request, callback) {
    var url = request.url.substr(6);
    var urlItem = Url.parse(url);
    callback({
        path: Path.normalize(Path.join(__dirname, '../static', urlItem.pathname))
    });
}, function (error) {
    if (error)
        console.error('Failed to register protocol')
});