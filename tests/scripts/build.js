'use strict';

const Path = require('path');
const App = require('v-framework');

App.build({
    source: Path.join(__dirname, '../../'),
    output: Path.join(__dirname, '../../output')
});