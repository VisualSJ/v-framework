'use strict';

const Electron = require('electron');
const Ipc = Electron.ipcMain;

class IpcEvent {
    constructor (event, options) {
        this.type = 'ajax';
        this.options = options;
        this.sender = event.sender;
    }

    reply (error, data) {
        if (!this.options.needCallback) return;
        this.sender.send('ipc-ajax-reply', this.options, error, data);
    }
}

var handler = {};

Ipc.on('ipc-ajax', (event, options, data) => {
    var func = handler[options.protocol];
    var ipcEvent = new IpcEvent(event, options);
    if (func) {
        func(ipcEvent, data);
    } else if (options.needCallback) {
        ipcEvent.reply(`Protocol: ${options.protocol} is not define.`, null);
    }
});

exports.register = function (protocol, func) {
    handler[protocol] = func;
};

// todo 注册 http 协议，使用真正的网络连接获取数据
// exports.register('http:');