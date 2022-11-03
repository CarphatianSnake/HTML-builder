const path = require('path');
const fs = require('fs');

const mergeStyles = require(path.join(__dirname, '..', '05-merge-styles', 'mergeStyles'));
const CopyDir = require(path.join(__dirname, '..', '04-copy-directory', 'CopyDir'));

const cd = new CopyDir(__dirname, 'assets', path.join('project-dist', 'assets'));

const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');

cd.init(projectDistPath);
writeHTML();
mergeStyles(stylesFolder, projectDistPath, 'style.css');
cd.copy();

function writeHTML() {

  fs.readFile(
    templatePath,
    {encoding: 'utf8'},
    (error, data) => {
  
      cd.error(error);
  
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
              error => {
                cd.error(error);
              }
            );

          }

          })
      });
      
    }
  );

}

function isErrorMessage(error) {
  if (error) return console.error('Error:\n', error.message);
}