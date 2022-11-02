const path = require('path');
const fs = require('fs');

const filesPath = path.join(__dirname, 'files');
const copyFilesPath = path.join(__dirname, 'files-copy');

copyDir();

function copyDir() {

  fs.readdir(
    filesPath,
    (error, files) => {
  
      isErrorMessage(error);
  
      init();
  
      deleteFiles(files);
  
      files.forEach(file => {
        fs.copyFile(
          path.join(filesPath, file),
          path.join(copyFilesPath, file),
          isErrorMessage
        );
      })
  
      console.log('\nMagic!\n');
  
    }
  );

}

function init() {

  fs.mkdir(
    copyFilesPath,
    {recursive: true},
    isErrorMessage
  );

}

function deleteFiles(files) {

  fs.readdir(
    copyFilesPath,
    (error, copyFiles) => {

      isErrorMessage(error);

      let filesArray = copyFiles;

      files.forEach(file => {
        filesArray = filesArray.filter(item => item !== file);
      });

      filesArray.forEach(file => {
        fs.unlink(path.join(copyFilesPath, file), isErrorMessage)
      });

    }
  );

}

function isErrorMessage(error) {
  if (error) return console.error(error.message);
}