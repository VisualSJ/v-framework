'use strict';

/*
用户和 page 层的网络数据交互
 */

const Electron = require('electron');
const Ipc = Electron.ipcMain;

class IpcEvent {
    constructor (event, options) {
        this.type = 'ipc';
        this.options = options;
        this.sender = event.sender;
    }

    reply (error, data) {
        if (!this.options.needCallback) return;
        this.sender.send('ipc-request-reply', this.options, error, data);
    }
}

var handler = {};

Ipc.on('ipc-request', (event, options, data) => {
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
