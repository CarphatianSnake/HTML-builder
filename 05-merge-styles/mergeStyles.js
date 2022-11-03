const path = require('path');
const fs = require('fs');

module.exports = function mergeStyles(source, destination, resultName) {

  fs.readdir(
    source,
    {withFileTypes: true},
    (error, files) => {
  
      isErrorMessage(error);
  
      const filesArray = [];
  
      files.forEach(file => {
  
        if (file.isFile() && path.extname(path.join(source, file.name)) === '.css') {
  
          filesArray.push(file.name);
  
        }
  
      });
  
      const dataArray = [];
  
      filesArray.forEach((file, index) => {
  
        const input = fs.createReadStream(
          path.join(source, file),
          'utf-8'
        );
  
        let data = '';
  
        input.on('data', chunk => data += chunk);
        input.on('error', error => console.error(error.message));
        input.on('end', () => {
  
          dataArray.push(data);
  
          if (filesArray.length - 1 === index) {
  
            const newData = dataArray.join('');
            const bundlePath = path.join(destination, resultName);
  
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
  
function isErrorMessage(error) {
  if (error) return console.error(error.message);
}