'use strict';

const Path = require('path');
const Layout = require('./layout');
const Interface = require('../init/interface');
const Console = require('./console');

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

        // 设置最小的宽高
        (() => {
            var json = this.layout.json;
            if (!json) {
                return Console.warn(`Layuot is not found!`);
            }
            var minHeight = parseInt(json.style['min-height']);
            var minWidth = parseInt(json.style['min-width']);
            if (minHeight && !isNaN(minHeight)) {
                options.minHeight = minHeight + 39;
            }
            if (minWidth && !isNaN(minWidth)) {
                options.minWidth = minWidth + 16;
            }
        })();

        this.nativeWindow = new BrowserWindow(options);
        this.nativeWindow.loadURL(Path.join(__dirname, '../page/window.html'));

        // TODO Menu 没有准备好，所以暂时关闭所有的菜单
        this.nativeWindow.setMenuBarVisibility(false);

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

/**
 * app://window/xxx
 */
Interface.add('window', {
    '/query-layout-info': function (event, data) {
        var win = cache[data.id];
        if (!win)
            return event.reply(`Window is not found: ${data.id}`, null);
        event.reply(null, win.layout.json);
    }
});

/**
 * app://window-console/xxx
 */
Interface.add('window-console', {
    '/trace' (event, args) {
        Console.tarce(...args);
    },
    '/debug' (event, args) {
        Console.debug(...args);
    },
    '/log' (event, args) {
        Console.log(...args);
    },
    '/info' (event, args) {
        Console.info(...args);
    },
    '/warn' (event, args) {
        Console.warn(...args);
    },
    '/error' (event, args) {
        Console.error(...args);
    },
    '/fatal' (event, args) {
        Console.fatal(...args);
    },
});