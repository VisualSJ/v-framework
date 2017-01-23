'use strict';

const ChildProcess = require('child_process');
const ElectronPrebuilt = require('electron-prebuilt');

const Path = require('path');
const FsExtra = require('fs-extra');

exports.on = function () {};
exports.off = function () {};
exports.once = function () {};

exports.start = function (options) {
    var child = ChildProcess.spawn(ElectronPrebuilt, [
        Path.dirname(process.mainModule.filename),
        '--debug=5858'
    ]);

    child.on('exit', function() {
        console.log('Exit v-framework');
    });

    child.stdout.on('data', function(data) {
        var string = (data + '').trim();
        if (!string) return;
        console.log(string);
    });
};

/**
 * 发布程序
 * 将项目按照 electron 格式整理好，发布到指定文件夹内
 * @param options
 */
exports.build = function (options) {
    var source = options.source;
    var output = options.output;
    var electronPath = Path.join(ElectronPrebuilt, '../');
    FsExtra.copySync(electronPath, output);
};