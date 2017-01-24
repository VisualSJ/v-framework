'use strict';

const Fs = require('fs');
const Console = require('./console');

/**
 * 解析布局对象内每个节点
 * @param item
 */
var parsePackage = function (item) {
    var json = {
        drag: item.drag !== false,
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

        // 循环 layout 中的所有节点
        // 补全里面的 min-height | min-width 信息
        // 规则： 最底层的 block 带有 1px 的边框, 两个 block 之间有一个 2px 的分割线
        var minWidth = 0;
        var maxHeight = 0;
        json.children.forEach(function (child) {
            var type = json.style['flex-direction'] || 'row';

            var childMinWidth = child.style['min-width'];
            if (childMinWidth) {
                if (type === 'row') {
                    minWidth += parseInt(childMinWidth);
                } else {
                    minWidth = Math.max(minWidth, parseInt(childMinWidth));
                }
            }
            var childMinHeight = child.style['min-height'];
            if (childMinHeight) {
                if (type === 'row') {
                    maxHeight = Math.max(maxHeight, parseInt(childMinHeight));
                } else {
                    maxHeight += parseInt(childMinHeight);
                }
            }
            if (!child.children) {
                if (json.style['flex-direction'] === 'column') {
                    maxHeight += 2;
                } else {
                    minWidth += 2;
                }
            }
        });

        if (json.style['flex-direction'] === 'column') {
            maxHeight += (json.children.length - 1) * 2;
        } else {
            minWidth += (json.children.length - 1) * 2;
        }

        if (minWidth === 0) {
            minWidth = 100;
        }
        if (maxHeight === 0) {
            maxHeight = 50;
        }

        json.style['min-width'] = minWidth + 'px';
        json.style['min-height'] = maxHeight + 'px';
    }

    json.name = item.name;

    return json;
};

class Layout {
    constructor(path, json) {
        this.path = path;
        this.json = parsePackage(json);
    }
}

exports.load = function (path) {
    if (!Fs.existsSync(path)) {
        return Console.log(`[Layout] ${path} is not found.`);
    }
    var json;
    try {
        var string = Fs.readFileSync(path, 'utf-8');
        json = JSON.parse(string);
    } catch (error) {
        return Console.log(`[Layout] parse ${path} is failure.`);
    }

    return new Layout(path, json);
};