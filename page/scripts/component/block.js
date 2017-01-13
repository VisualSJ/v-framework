'use strict';

const Fs = require('fs');
const Path = require('path');

exports.template = Fs.readFileSync(Path.join(__dirname, './block.html'), 'utf-8');

exports.props = ['layout'];

exports.components = {
    block: exports,
    split: require('./split')
};

exports.data = function () {
    return {};
};