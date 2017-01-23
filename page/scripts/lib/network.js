'use strict';

const Electron = require('electron');
const Ipc = Electron.ipcRenderer;
const Url = require('url');

var requestID = 1;
var messages = {};
var callbackCache = {};

Ipc.on('ipc-request-reply', function (event, options, error, data) {
    var item = callbackCache[options.id];
    if (!item) console.warn(`${options.id}@renderer request is missing`);
    clearTimeout(item.timer);
    item.callback(error, data);
});

Ipc.on('ipc-listen', function (event, message, data) {
    var handler = messages[message];
    if (handler) {
        handler(event, data);
    }
});

/**
 *
 * @param options
 * @param internal
 */
exports.send = function (options, internal) {
    var item = Url.parse(options.url);

    // 默认参数
    options = options || {};
    internal = internal || {};
    options.timeout = options.timeout >= 0 ? options.timeout : 5000;
    options.data = options.data || {};

    var additional = {
        id: requestID,
        from: internal.from || '',
        protocol: item.protocol,
        to: item.hostname,
        path: item.pathname,
        needCallback: false
    };

    if (options.callback) {
        let timer;
        if (options.timeout !== 0) {
            timer = setTimeout(() => {
                console.log('[Network] ajax timeout.');
            }, options.timeout);
        }
        callbackCache[requestID] = {
            timer: timer,
            callback: options.callback
        };
        delete options.callback;
        additional.needCallback = true;
    }

    requestID++;
    Ipc.send('ipc-request', additional, options.data);
};

exports.listen = function (message, handler) {
    messages[message] = handler;
};