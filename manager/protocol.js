'use strict';

const Electron = require('electron');
const App = Electron.app;

var ready = App.isReady();
var waitQueue = [];

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