'use strict';

const Events = require('events');
const Network = require('./network');

class Package extends Events.EventEmitter{
    constructor (name) {
        super();
        this.name = name;
    }

    ajax (options) {
        options.url = `package://${this.name}` + options.url;
        Network.send(options, {
            from: this.name
        });
    }

    listen (message, handler) {
        Network.listen(`${this.name}:${message}`, handler);
    }
}

exports.create = function (name) {
    return new Package(name);
};