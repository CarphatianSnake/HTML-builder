const path = require('path');
const fs = require('fs');

const filesPath = path.join(__dirname, 'files');

fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, error => {
  if (error) return console.error(error.message);
});

const copyFilesPath = path.join(__dirname, 'files-copy');

fs.readdir(filesPath, (error, files) => {

  if (error) return console.error(error.message);

  files.forEach(file => {
    fs.copyFile(
      path.join(filesPath, file),
      path.join(copyFilesPath, file),
      error => {
        if (error) return console.error(error.message);
      }
    )
  })

})