'use strict';

/*
用户和 page 层的网络数据交互
 */

const Electron = require('electron');
const Ipc = Electron.ipcMain;

var handler = {};

class IpcEvent {
    constructor (event, options) {
        this.type = 'ipc';
        this.options = options;
        this.sender = event.sender;
    }

    /**
     * 回调函数 event.reply
     * @param error
     * @param data
     */
    reply (error, data) {
        if (!this.options.needCallback) return;
        this.sender.send('ipc-request-reply', this.options, error, data);
    }
}

/**
 * 接收 page 层发送的事件
 *
 * @param event ipcEvent
 * @param {Object} options
 * {
 *   id: requestID
 *   from: from（package name）
 *   protocol: protocol://xxx/xxx
 *   to: package://to/xxx
 *   path: package://xxx/path
 *   needCallback: false | true
 * }
 * @param {Object} data User data
 */
Ipc.on('ipc-request', (event, options, data) => {
    var func = handler[options.protocol];
    var ipcEvent = new IpcEvent(event, options);
    if (func) {
        func(ipcEvent, data);
    } else if (options.needCallback) {
        ipcEvent.reply(`Protocol: ${options.protocol} is not define.`, null);
    }
});

/**
 * 注册网络协议 （这里指的是 page - core 之间的网络协议）
 * 在 page 层可以使用 protocol://xxx 进入指定的 func 进行处理
 * @param protocol
 * @param func
 */
exports.register = function (protocol, func) {
    handler[protocol] = func;
};
