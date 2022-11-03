const path = require('path');
const fs = require('fs');

const filesPath = path.join(__dirname, 'files');
const copyFilesPath = path.join(__dirname, 'files-copy');

class CopyDir {

  init(path) {

    fs.mkdir(
      path,
      {recursive: true},
      this.isErrorMessage
    );
  
  }

  deleteFiles(sourceFiles, destination) {

    fs.readdir(
      destination,
      (error, copyFiles) => {

        if (copyFiles && copyFiles.length > 0) {

          this.isErrorMessage(error);

          let filesArray = copyFiles;

          sourceFiles.forEach(file => {
            filesArray = filesArray.filter(item => item !== file);
          });

          filesArray.forEach(file => {
            fs.unlink(path.join(destination, file), this.isErrorMessage);
          });

        }
  
      }
    );
  
  }

  copyFiles(source, destination) {

    fs.readdir(
      source,
      (error, sourceFiles) => {
    
        this.isErrorMessage(error);
    
        this.init(destination);
    
        this.deleteFiles(sourceFiles, destination);
    
        sourceFiles.forEach(file => {
          fs.copyFile(
            path.join(source, file),
            path.join(destination, file),
            this.isErrorMessage
          );
        });
    
      }
    );
  
  }

  isErrorMessage(error) {
    if (error) return console.error(error.message);
  }

}

const copyDir = new CopyDir();

copyDir.copyFiles(filesPath, copyFilesPath);