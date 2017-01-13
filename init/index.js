'use strict';

const Electron = require('electron');

if (!Electron.app) {
    console.log('Development model, Start electron...');
    module.exports = require('./init-dev');
} else {
    console.log('Start v-framework...');
    console.log(' ');
    module.exports = require('./init-release');
}