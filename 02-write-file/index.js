const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const textFilePath = path.join(__dirname, 'text.txt');

// Removing file when script launches with flag -d and stop script
const deleteFlag = process.argv[2];
if (deleteFlag === '-d') return removeFile();

// Main script
const output = fs.createWriteStream(textFilePath);

init();

const rl = require("readline").createInterface({
  input: stdin,
  output: stdout
});

stdout.write('Please enter any text:\n');

rl.on('line', data => {
    
  if (data === 'exit') {
    process.exit(0);
  } else {
    output.write(`${data}\n`);
  }

});

rl.on("SIGINT", () => {
  process.emit("SIGINT");
});

process.on("SIGINT", () => {
  process.exit(0);
});

process.on('exit', () => stdout.write('\nGood luck!'));

// init function to create new empty file
function init() {
  fs.writeFile(
    textFilePath,
    '',
    error => {
      if (error) return console.error(error.message);
    }
  );
}

// function for removing file when script launches with flag -d
function removeFile() {
  fs.unlink(
    textFilePath,
    error => {
      if (error) return console.error(error.message);
      console.log('File deleted');
    }
  );
}