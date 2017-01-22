'use strict';

const Electron = require('electron');
const App = Electron.app;

var ready = App.isReady();
var waitQueue = [];

/**
 * 注册自定义协议
 * 让 framework 中页面可以用 protocol://xxx 去访问指定的资源
 * @param protocol
 * @param handler
 */
exports.register = function (protocol, handler) {

    if (!ready) {
        waitQueue.push([protocol, handler]);
        return;
    }

    Electron.protocol.registerFileProtocol(protocol, handler);
};

App.on('ready', function () {
    ready = true;
    waitQueue.forEach((args) => {
        exports.register.apply(this, args);
    });
    waitQueue = [];
});