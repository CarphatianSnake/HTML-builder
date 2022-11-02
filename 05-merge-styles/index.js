const path = require('path');
const fs = require('fs');

const bundleFolder = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');

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

    filesArray.forEach((file, index) => {

      const input = fs.createReadStream(
        path.join(stylesFolder, file),
        'utf-8'
      );

      let data = '';

      input.on('data', chunk => data += chunk);
      input.on('error', error => console.error(error.message));
      input.on('end', () => {

        dataArray.push(data);

        if (filesArray.length - 1 === index) {

          const newData = dataArray.join('');
          const bundlePath = path.join(bundleFolder, 'bundle.css');

          fs.writeFile(
            bundlePath,
            newData,
            error => {
              isErrorMessage(error);
              console.log('Merging complete!');
            }
          );

        }

      });

    });

    

  }
);

function isErrorMessage(error) {
  if (error) return console.error(error.message);
}