'use strict';

const Path = require('path');
const Layout = require('./layout');
const Interface = require('../init/interface');

const Electron = require('electron');
const {app, BrowserWindow} = Electron;

var id = 1;
var cache = {};
var ready = app.isReady();

class Window {

    constructor(options) {
        this.id = id++;
        this.options = options || {};
        this.layout = null;
        this.nativeWindow = null;
        cache[this.id] = this;
        this.retain();
    }

    retain() {
        if (!ready) return;
        var options = this.options;

        // options.show = false;
        options.width = options.width || 360;
        options.height = options.height || 500;
        options.autoHideMenuBar = options.autoHideMenuBar === undefined ? true : options.autoHideMenuBar;

        this.layout = Layout.load(options.layout);

        this.nativeWindow = new BrowserWindow(options);
        this.nativeWindow.loadURL(Path.join(__dirname, '../page/window.html'));

        this.nativeWindow.webContents.on('did-finish-load', () => {
            this.nativeWindow.webContents.send('initialization', this.id);
        });
    }

    release() {
        delete cache[this.id];
        if (this.nativeWindow) {
            this.nativeWindow.close();
        }
    }
}

app.on('ready', function () {
    ready = true;
    for (let id in cache) {
        let win = cache[id];
        if (!win.nativeWindow) {
            win.retain();
        }
    }
});

exports.open = function (options) {
    return new Window(options);
};

exports.forEach = function (handler) {
    Object.keys(cache).forEach((id) => {
        var win = cache[id];
        if (win) {
            handler.call(win, win);
        }
    });
};

Interface.add('window', {
    '/query-layout-info': function (event, data) {
        var win = cache[data.id];
        if (!win)
            return event.reply(`Window is not found: ${data.id}`, null);
        event.reply(null, win.layout.json);
    }
});