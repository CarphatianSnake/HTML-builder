const path = require('path');
const fs = require('fs');

module.exports = class CopyDir {
  constructor(dirname, source, destination) {
    this.dirname = dirname;
    this.source = path.join(dirname, source);
    this.destination = path.join(dirname, destination);
    this.readdirOptions = {
      encoding: 'utf-8',
      withFileTypes: true
    };
  }

  init(path) {

    fs.mkdir(
      path,
      {recursive: true},
      this.error
    );
  
  }

  checkDir(folderMap) {

    const files = [];
    const folders = [];

    if (folderMap) {

      folderMap.forEach(item => {

        if (item.isFile()) {
          files.push(item.name);
        } else {
          folders.push(item.name);
        }
  
      });
      
    }

    return { files, folders };

  }

  delete(sourceMap, destination) {

    fs.readdir(
      destination,
      this.readdirOptions,
      (error, destinationMap) => {

        const { files, folders } = this.checkDir(destinationMap);

        if (files && files.length > 0) {

          this.error(error);

          let filesArray = files;

          sourceMap.forEach(file => {
            filesArray = filesArray.filter(item => item !== file);
          });

          filesArray.forEach(file => {
            fs.unlink(path.join(destination, file), this.error);
          });

        }

        if (folders && folders.length > 0) {

          let foldersArray = folders;

          sourceMap.forEach(folder => {
            foldersArray = foldersArray.filter(item => item !== folder);
          })

          foldersArray.forEach(folder => {
            fs.rm(path.join(destination, folder), {recursive: true}, this.error);
          })

        }

      }
    );
  
  }

  copy(source = this.source, destination = this.destination) {

    fs.readdir(
      source,
      this.readdirOptions,
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
    if (error) return console.error('Error\n', error.message);
  }

}