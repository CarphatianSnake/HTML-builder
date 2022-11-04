const path = require('path');

const generateHTML = require(path.join(__dirname, 'generateHTML'));
const mergeStyles = require(path.join(__dirname, '..', '05-merge-styles', 'mergeStyles'));
const CopyDir = require(path.join(__dirname, '..', '04-copy-directory', 'CopyDir'));

const cd = new CopyDir(__dirname, 'assets', path.join('project-dist', 'assets'));

const projectDistPath = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');

cd.init(projectDistPath);
generateHTML();
mergeStyles(stylesFolder, projectDistPath, 'style.css');
cd.copy();