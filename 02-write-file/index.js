const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const deleteFlag = process.argv[2];
if (deleteFlag === '-d') return removeFile();

function init() {
  fs.writeFile(
    path.join(__dirname, 'text.txt'),
    '',
    error => {
      if (error) return console.error(error.message);
    }
  );
}

function removeFile() {
  fs.unlink(
    path.join(__dirname, 'text.txt'),
    error => {
      if (error) return console.error(error.message);
      console.log('File deleted');
    }
  );
}

init();