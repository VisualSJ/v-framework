'use strict';

const Fs = require('fs');
const Path = require('path');

const Event = require('../manager/event');
const Window = require('./window');
const Network = require('./network');
const Interface = require('../init/interface');
const Utils = require('./package-utils');

Event.mount(exports, 'package');

const PATH = {
    json: 'package.json'
};

var cache = {};

class Storage {
    constructor(path) {
        this.length = 0;
        this.path = Path.join(path, '.temp', 'storage.json');
        this.data = Utils.loadStorage(this.path);
    }

    /**
     * 设置一个 item
     * @param key
     * @param value
     * @returns {*}
     */
    setItem(key, value) {
        this.data[key] = value;
        Utils.saveStorage(this.data, this.path);
        return value;
    }

    /**
     * 获取存储在 storage 内的某个 item 的值
     * @param key
     * @returns {*}
     */
    getItem(key) {
        return this.data[key];
    }

    /**
     * 删除存储的某个 item
     * @param key
     */
    removeItem(key) {
        delete this.data[key];
        Utils.saveStorage(this.data, this.path);
    }

    /**
     * 清空 storage
     */
    clear() {
        this.data = {};
        Utils.saveStorage(this.data, this.path);
    }

    /**
     * 当外部文件或是特殊需求需要重新从 storage 文件重置
     */
    reload() {
        this.data = Utils.loadStorage(this.path);
    }
}

class Package {
    constructor(options, paths, pkgExports) {
        this.options = options;
        this.paths = paths;
        this.exports = pkgExports;

        this.storage = new Storage(paths.base);

        // 监听 message
        if (pkgExports.messages) {
            Object.keys(pkgExports.messages).forEach((message) => {
                var func = pkgExports.messages[message].bind(this);
                exports.on(`${this.options.name}:${message}`, func);
            });
        }
    }

    /**
     * 发送事件给其他插件
     * @param name
     * @param message
     * @param args
     */
    send(name, message, ...args) {
        var event = {
            type: 'message',
            target: this,
            from: this.options.name
        };
        exports.emit.apply(this, [`${name}:${message}`, event, ...args]);
    }

    /**
     * 广播消息到每个插件，包括自己
     * @param message
     * @param data
     */
    broadcast(message, data) {
        Object.keys(cache).forEach((name) => {
            cache[name].send(name, message, data);
        });
    }

    /**
     * 推送消息给 page 层
     * @param message
     * @param data
     */
    push(message, data) {
        var name = this.options.name;
        Window.forEach(function (win) {
            win.nativeWindow.send('ipc-listen', `${name}:${message}`, data);
        });
    }

    /**
     * 启动一个 child process
     * @param script
     */
    worker(script) {
        var path = Path.join(this.options.paths.base, script);
        return new Utils.Worker(path);
    }
}

/**
 * 加载插件
 * @param {String} path
 * @returns {*}
 */
exports.load = function (path) {
    var paths = {
        base: path,
        json: Path.join(path, PATH.json),
        main: null,
        page: null
    };

    if (!Fs.existsSync(paths.json)) {
        return console.log(`[Package] ${paths.json} is not found.`);
    }

    var options;
    try {
        options = JSON.parse(Fs.readFileSync(paths.json, 'utf-8'));
    } catch (error) {
        return console.log(`[Package] ${paths.json} parse error.`);
    }

    // 检查必须参数是否正常
    if (!options.name) {
        return console.log(`[Package] ${paths.json} - 'name' is not found.`);
    }

    paths.main = Path.join(path, options.main);
    paths.page = Path.join(path, options.page);

    var exports;
    try {
        exports = require(paths.main);
    } catch (error) {
        exports = {};
        console.error(`[Package] require ${options.name} load error.`);
    }

    cache[options.name] = new Package(
        options,
        paths,
        exports
    );

    try {
        exports.load.call(cache[options.name]);
    } catch (error) {
        console.error(`[Package] ${options.name} load func error.`);
        console.error(error);
    }

    console.log(`[Package] ${options.name} is loaded.`);
};

/**
 * 卸载插件
 * @param {String} path
 */
exports.unload = function (path) {
    // todo 卸载插件
};

/**
 * 传入地址，扫描文件夹内的插件
 * 并自动加载
 * @param {Array|String} paths
 */
exports.search = function (paths) {
    if (typeof paths === 'string') {
        paths = [paths];
    }

    paths.forEach(function (path) {
        if (!Fs.existsSync(path)) {
            return console.log(`[Package] ${path} is not found.`);
        }
        var stat = Fs.statSync(path);
        if (!stat.isDirectory()) {
            return console.log(`[Package] ${path} is not directory.`);
        }

        var list = Fs.readdirSync(path);
        list.forEach(function (name) {
            var pkgPath = Path.join(path, name);
            exports.load(pkgPath);
        });
    });
};

/**
 * 根据插件名字获取插件对象
 * @param name
 */
exports.find = function (name) {
    return cache[name];
};

/*
注册 package 协议
使用 package://package-name/controller 访问插件内部注册的 interface
 */
Network.register('package:', function (event, data) {
    var pkg = cache[event.options.to];
    if (pkg && pkg.exports && pkg.exports.interfaces) {
        let handler = pkg.exports.interfaces[event.options.path];
        if (handler) {
            return handler.call(pkg, event, data);
        }
    }
    event.reply(`Interface is not found: package://${event.options.to}${event.options.path}`);
});

Interface.add('package', {
    '/query-all-name': function (event) {
        event.reply(null, Object.keys(cache));
    },
    '/query-package-info': function (event, data) {
        var pkg = cache[data.name];
        if (!pkg) {
            return event.reply(`Package is not found: ${data.id}`, null);
        }
        event.reply(null, pkg.paths);
    }
});
