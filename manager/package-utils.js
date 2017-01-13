'use strict';

const Fs = require('fs');
const Path = require('path');

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