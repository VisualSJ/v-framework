'use strict';

const Electron = require('electron');
const Dialog = Electron.remote.dialog;

exports.selectDirectory = function (options) {
    options = options || {};
    options['properties'] = ['openDirectory'];
    var res = Dialog.showOpenDialog(options);

    return res ? res[0] : '';
};

exports.selectFile = function (options) {
    options = options || {};
    options['properties'] = ['openFile'];
    var res = Dialog.showOpenDialog(options);

    return res ? res[0] : '';
};