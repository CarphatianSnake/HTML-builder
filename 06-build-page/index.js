const path = require('path');
const fs = require('fs');

const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');

init();
writeHTML();
writeStyles();

function writeHTML() {

  fs.readFile(
    templatePath,
    {encoding: 'utf8'},
    (error, data) => {
  
      isErrorMessage(error);
  
      let template = data;
  
      const templateSelectors = data.match(/{{\w+}}/gi)
        .map(str => str.replace(/[{}]/gi, ''));

      templateSelectors.forEach((item, index, arr) => {

        const input = fs.createReadStream(
          path.join(componentsPath, `${item}.html`),
          'utf-8'
        )
  
        let componentData = '';
        
        input.on('data', chunk => componentData += chunk);
        input.on('error', error => console.error(error.message));
        input.on('end', () => {

          template = template.replace(`{{${item}}}`, componentData);

          if (index === arr.length - 1) {
  
            fs.writeFile(
              path.join(projectDistPath, 'index.html'),
              template,
              isErrorMessage
            );

          }

          })
      });
      
    }
  );

}

function writeStyles() {

  fs.readdir(
    stylesFolder,
    {withFileTypes: true},
    (error, files) => {
  
      isErrorMessage(error);
  
      const filesArray = [];
  
      files.forEach(file => {
  
        if (file.isFile() && path.extname(path.join(stylesFolder, file.name)) === '.css') {
  
          filesArray.push(file.name);
  
        }
  
      });
  
      const dataArray = [];
  
      filesArray.forEach((file, index, arr) => {
  
        const input = fs.createReadStream(
          path.join(stylesFolder, file),
          'utf-8'
        );
  
        let data = '';
  
        input.on('data', chunk => data += chunk);
        input.on('error', error => console.error(error.message));
        input.on('end', () => {
  
          dataArray.push(data);
  
          if (index === arr.length - 1) {
  
            const newData = dataArray.join('');
            const bundlePath = path.join(projectDistPath, 'style.css');
  
            fs.writeFile(
              bundlePath,
              newData,
              isErrorMessage
            );
  
          }
  
        });
  
      });
  
    }
  );

}

function init() {

  fs.mkdir(
    projectDistPath,
    {recursive: true},
    error => {
      if (error) return console.error('Error:\n', error.message);
    }
  );

}

function isErrorMessage(error) {
  if (error) return console.error(error.message);
}