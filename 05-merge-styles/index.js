const path = require('path');

const mergeStyles = require(path.join(__dirname, 'mergeStyles'));

const bundleFolder = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');

mergeStyles(stylesFolder, bundleFolder, 'bundle.css');