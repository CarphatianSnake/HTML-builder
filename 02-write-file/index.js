const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const textFilePath = path.join(__dirname, 'text.txt');

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

function init() {
  fs.writeFile(
    textFilePath,
    '',
    error => {
      if (error) return console.error(error.message);
    }
  );
}