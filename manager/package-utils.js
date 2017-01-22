'use strict';

/*
Package 使用的工具库
 */

const Fs = require('fs');
const Path = require('path');

const Electron = require('electron');
const {app, BrowserWindow} = Electron;

var ready = app.isReady();

/**
 * 读取 storage 数据
 * @param path
 * @returns {Object}
 */
exports.loadStorage = function (path) {
    if (!Fs.existsSync(path)) {
        return {};
    }
    try {
        var string = Fs.readFileSync(path, 'utf-8');
        return JSON.parse(string);
    } catch (error) {
        console.error(error);
        return {};
    }
};

/**
 * 保存 storage 数据
 * @param data
 * @param path
 */
exports.saveStorage = function (data, path) {
    if (!Fs.existsSync(path)) {
        let base = Path.dirname(path);
        if (!Fs.existsSync(base)) {
            Fs.mkdirSync(base);
        }
    }

    var string = JSON.stringify(data, null, 2);
    Fs.writeFileSync(path, string);
};

var cache = [];

app.on('ready', function () {
    ready = true;
    cache.forEach(function (worker) {
        worker.retain();
    });
    cache = [];
});

/**
 * Worker 进程
 * TODO 未完成
 * @param path
 * @constructor
 */
exports.Worker = function (path) {
    this.win = null;
    this.ready = false;
    this.path = path;

    if (ready) {
        this.retain();
    } else {
        cache.push(this);
    }
};

(function (proto) {

    proto.retain = function () {
        this.win = new BrowserWindow({
            width: 800,
            height: 600,
            show: false
        });
        this.win.loadURL(this.path);
    };

    proto.release = function () {
        var index = cache.indexOf(this);
        if (index !== -1) {
            cache.splice(i, 1);
        }
        this.win.close();
    };

})(exports.Worker.prototype);