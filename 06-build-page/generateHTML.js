const path = require('path');
const fsPromises = require('fs/promises');

const indexHTML = path.join(__dirname, 'project-dist', 'index.html');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');

module.exports = async function gengerateHTML() {

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