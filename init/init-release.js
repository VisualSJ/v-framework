'use strict';

const Path = require('path');
const Url = require('url');

const Interface = require('./interface');
const Event = require('../manager/event');
const Package = require('../manager/package');
const Window = require('../manager/window');
const Protocol = require('../manager/protocol');

Event.mount(exports, 'app');

/**
 *
 * @param {Object} options
 */
exports.start = function (options) {
    Package.search(options.packages);
    options.autoHideMenuBar = true;
    Window.open(options.window);
};

/**
 *
 * @param {Object} options
 */
exports.build = function (options) {

};

exports.Interface = Interface;

Protocol.register('app', function (request, callback) {
    var url = request.url.substr(6);
    var urlItem = Url.parse(url);
    callback({
        path: Path.normalize(Path.join(__dirname, '../static', urlItem.pathname))
    });
}, function (error) {
    if (error)
        console.error('Failed to register protocol')
});