'use strict';

const Fs = require('fs');
const Path = require('path');

exports.template = Fs.readFileSync(Path.join(__dirname, './page.html'), 'utf-8');

exports.props = ['name'];

exports.data = function () {
    return {
        path: ''
    };
};

exports.methods = {
    _refresh () {
        var self = this;
        App.Network.send({
            url: 'app://package/query-package-info',
            data: { name: this.name },
            callback (error, paths) {
                if (error) {
                    self.path = '';
                    console.log(error);
                } else {
                    self.path = paths.page;
                }
            }
        });
    },
    _spliceName(name) {
        if (name) {
            this._refresh();
        }
        return `package-${name}`;
    }
};
