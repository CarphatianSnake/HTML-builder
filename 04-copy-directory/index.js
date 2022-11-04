const path = require('path');

const CopyDir = require(path.join(__dirname, 'CopyDir'));

const cd = new CopyDir(__dirname, 'files', 'files-copy');

cd.copy();