'use strict';

const Fs = require('fs');
const Package = require('./package');

/**
 * 解析布局对象内每个节点
 * @param item
 */
var parsePackage = function (item) {
    var json = {
        style: {},
        children: null,
        package: null
    };

    if (item.style) {
        Object.keys(item.style).forEach((css) => {
            json.style[css] = item.style[css];
        });
    }

    if (item.children) {
        json.children = [];
        item.children.forEach((child) => {
            json.children.push(parsePackage(child));
        });
    }

    if (item.name) {
        // todo 找不到插件，显示一个默认的丢失页面
        let pkg = Package.find(item.name);
        if (pkg) {
            json.name = item.name;
            json.path = pkg.paths.page;
        } else {
            console.warn(`[Layout] Package is not found: ${item.name}.`);
        }
    }

    return json;
};

class Layout {
    constructor (path, json) {
        this.path = path;
        this.json = parsePackage(json);
    }
}

exports.load = function (path) {
    if (!Fs.existsSync(path)) {
        return console.log(`[Layout] ${path} is not found.`);
    }
    var json;
    try {
        var string = Fs.readFileSync(path, 'utf-8');
        json = JSON.parse(string);
    } catch (error) {
        return console.log(`[Layout] parse ${path} is failure.`);
    }

    return new Layout(path, json);
};