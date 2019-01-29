#!/usr/bin/env node
'use strict';

const path = require('path');
const appropriateImages = require('@mapbox/appropriate-images');
const imageConfig = require('../conf/image-config');

// Execute the appropriate-images CLI **scoped to this particular setup**.
// cf. https://github.com/mapbox/appropriate-images#createcli
appropriateImages.createCli(imageConfig, {
  inputDirectory: path.join(__dirname, '../src/img/src'),
  outputDirectory: path.join(__dirname, '../src/img/dist')
});
