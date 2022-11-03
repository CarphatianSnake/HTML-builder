const path = require('path');
const fs = require('fs');

class CopyDir {
  constructor(dirname, source, destination) {
    this.dirname = dirname;
    this.source = path.join(dirname, source);
    this.destination = path.join(dirname, destination);
  }

  init(path) {

    fs.mkdir(
      path,
      {recursive: true},
      this.error
    );
  
  }

  delete(sourceFiles, destination) {

    fs.readdir(
      destination,
      (error, copyFiles) => {

        if (copyFiles && copyFiles.length > 0) {

          this.error(error);

          let filesArray = copyFiles;

          sourceFiles.forEach(file => {
            filesArray = filesArray.filter(item => item !== file);
          });

          filesArray.forEach(file => {
            fs.unlink(path.join(destination, file), this.error);
          });

        }

      }
    );
  
  }

  checkDir(folderMap) {

    const files = [];
    const folders = [];

    folderMap.forEach(item => {

      if (item.isFile()) {
        files.push(item.name);
      } else {
        folders.push(item.name);
      }

    });

    return { files, folders };

  }

  copy(source = this.source, destination = this.destination) {

    fs.readdir(
      source,
      {
        encoding: 'utf-8',
        withFileTypes: true
      },
      (error, sourceMap) => {

        const { files, folders } = this.checkDir(sourceMap);
    
        this.error(error);
    
        this.init(destination);
    
        this.delete(files, destination);
    
        files.forEach(file => {
          fs.copyFile(
            path.join(source, file),
            path.join(destination, file),
            this.error
          );
        });

        folders.forEach(folder => {

          const src = path.join(source, folder);
          const dest = path.join(destination, folder);

          this.copy(src, dest);
          
        })
    
      }
    );
  
  }

  error(error) {
    if (error) return console.error(error.message);
  }

}

const copyDir = new CopyDir(__dirname, 'files', 'files-copy');

copyDir.copy();