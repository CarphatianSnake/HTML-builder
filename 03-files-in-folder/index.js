const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');

const options = {
  encoding: 'utf8',
  withFileTypes: true
}

fs.readdir(
  folderPath,
  options,
  (error, files) => {
    
    if (error) return console.error(error.message);

    files.forEach(file => {

      if (file.isFile()) {

        let fileInfo = file.name.replace('.', ' — ');

        fs.stat(path.join(folderPath, file.name), (error, stats) => {

          if (error) return console.error(error.message);

          fileInfo += ` — ${(stats.size / 1024).toFixed(2)}kb`;
          console.log(fileInfo);

        });

      }

    });
  }
)