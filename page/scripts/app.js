'use strict';

const Electron = require('electron');
const Events = require('events');
const Ipc = Electron.ipcRenderer;

/*
    events: [
        ready,
    ]
 */

class App extends Events.EventEmitter{
    constructor () {
        super();
        this.id = undefined;
        this.PATH = {};
        this.Network = require('./lib/network');
        this.Package = require('./lib/package');
    }
}

module.exports = new App();

Ipc.on('initialization', function (event, id) {
    module.exports.id = id;
    module.exports.emit('ready');
});