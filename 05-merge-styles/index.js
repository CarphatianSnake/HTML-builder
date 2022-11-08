const path = require('path');
const fsPromises = require('fs/promises');

// const mergeStyles = require(path.join(__dirname, 'mergeStyles'));

const bundleFolder = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');

mergeStyles(stylesFolder, bundleFolder, 'bundle.css');

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