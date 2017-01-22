'use strict';

const Path = require('path');
const App = require('v-framework');

App.start({
    packages: [
        Path.join(__dirname, 'packages'),
        Path.join(__dirname, 'layout-tests'),
    ],
    window: {
        layout: Path.join(__dirname, './layout/default.json'),
        width: 800,
        height: 600
    }
});

App.on('ready', function () {

});