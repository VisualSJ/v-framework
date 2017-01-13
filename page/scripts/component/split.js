'use strict';

const Fs = require('fs');
const Path = require('path');

exports.template = Fs.readFileSync(Path.join(__dirname, './split.html'), 'utf-8');

exports.props = ["direction"];

exports.components = {};

exports.data = function () {
    return {};
};