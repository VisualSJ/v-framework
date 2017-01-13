'use strict';

const ChildProcess = require('child_process');
const ElectronPrebuilt = require('electron-prebuilt');

const Path = require('path');
const FsExtra = require('fs-extra');

exports.on = function () {};
exports.off = function () {};
exports.once = function () {};

exports.start = function (options) {
    var child = ChildProcess.spawn(ElectronPrebuilt, [process.cwd(), '--debug=5858']);

    child.on('exit', function() {
        console.log('Exit v-framework');
    });

    child.stdout.on('data', function(data) {
        var string = (data + '').trim();
        if (!string) return;
        console.log(string);
    });
};

exports.build = function (options) {
    var source = options.source;
    var output = options.output;
    var electronPath = Path.join(ElectronPrebuilt, '../');
    FsExtra.copySync(electronPath, output);
};