const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

// const generateHTML = require(path.join(__dirname, 'generateHTML'));
// const mergeStyles = require(path.join(__dirname, '..', '05-merge-styles', 'mergeStyles'));
// const CopyDir = require(path.join(__dirname, '..', '04-copy-directory', 'CopyDir'));

// const cd = new CopyDir(__dirname, 'assets', path.join('project-dist', 'assets'));

const projectDistPath = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');

const indexHTML = path.join(__dirname, 'project-dist', 'index.html');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');

async function generateHTML() {

  try {

    const template = await fsPromises.readFile(templatePath, {encoding: 'utf-8'});
    
    const templateSelectors = template.match(/{{\w+}}/gi)
        .map(str => str.replace(/[{}]/gi, ''));

    let data = template;

    for (let i = 0; i < templateSelectors.length; i++) {

      const component = await fsPromises.readFile(
        path.join(componentsPath, `${templateSelectors[i]}.html`),
        {encoding: 'utf-8'}
      );

      data = data.replace(`{{${templateSelectors[i]}}}`, component);

      if (i === templateSelectors.length - 1) {
        try {
          await fsPromises.writeFile(indexHTML, data);
        } catch(error) {
          console.error(error);
        }
      }

    }
  
  } catch(error) {
    console.error(error);
  }

}

async function mergeStyles(source, destination, resultName) {

  try {

    let files = await fsPromises.readdir(source, {withFileTypes: true});

    files = files.filter(filename => {

      const isCSS = path.extname(path.join(
        source,
        filename.name
      )) === '.css';

      return filename.isFile() && isCSS;

  });

    const data = [];

    for (let i = 0; i < files.length; i++) {

      const file = await fsPromises.readFile(
        path.join(source, files[i].name),
        {encoding: 'utf-8'}
      );

      data.push(`${file}\n`);

      if (i === files.length - 1) {
        
        try {
          await fsPromises.writeFile(
            path.join(destination, resultName),
            data,
            {encoding: 'utf-8'}
          );
        } catch(error) {
          console.error(error);
        }
        
      }

    }

  } catch(error) {
    console.error(error);
  }

}

class CopyDir {
  constructor(source, destination) {
    this.source = path.join(__dirname, source);
    this.destination = path.join(__dirname, destination);
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

  delete(sourceMap, sourceFolders, destination) {

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

          sourceFolders.forEach(folder => {
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
    
        this.delete(files, folders, destination);
    
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

const cd = new CopyDir('assets', path.join('project-dist', 'assets'));

cd.init(projectDistPath);
generateHTML();
mergeStyles(stylesFolder, projectDistPath, 'style.css');
cd.copy();