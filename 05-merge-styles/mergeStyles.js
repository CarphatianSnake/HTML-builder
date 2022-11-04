const path = require('path');
const fsPromises = require('fs/promises');

module.exports = async function merge(source, destination, resultName) {

  try {

    let files = await fsPromises.readdir(source, {withFileTypes: true});

    files = files.filter(filename => filename.isFile() && path.extname(path.join(source, filename.name)) === '.css');

    const data = [];

    for (let i = 0; i < files.length; i++) {

      const file = await fsPromises.readFile(
        path.join(source, files[i].name),
        {encoding: 'utf-8'}
      );

      data.push(file);

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