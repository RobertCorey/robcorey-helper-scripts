const fs = require("fs");

const MULTIPLIER = 1.0;
const PRECISION = 1;

//get all files in a directory and subdirectories with a certain extension
function getAllFiles(dir, ext, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getAllFiles(name, ext, files_);
    } else {
      if (name.slice(-ext.length) == ext) files_.push(name);
    }
  }
  return files_;
}

function getNewValue(number) {
  return `${+(number * MULTIPLIER).toFixed(PRECISION)}rem`;
}

function transformLine(line) {
  const regex = /[+-]?([0-9]*[.])?[0-9]+rem/g;
  //get the number before the rem
  try {
    let newLine = line;
    line.match(regex).forEach((match) => {
      let number = parseFloat(match.split("rem")[0]);
      let newValue = getNewValue(number);
      newLine = newLine.replace(match, newValue);
    });
    return newLine;
  } catch (error) {
    console.log("no rem value found");
  }
  return line;
}

//open a file and go through each line
function processFile(file) {
  var lines = fs.readFileSync(file, "utf8").split("\n");
  var newLines = [];
  for (var i in lines) {
    var line = lines[i];
    //if the line contains a rem, transform it
    if (line.indexOf("rem") != -1) {
      newLines.push(transformLine(line));
    } else {
      newLines.push(line);
    }
  }
  //write the new file
  fs.writeFileSync(file, newLines.join("\n"));
}

const files = [
  ...getAllFiles("./", ".ts"),
  ...getAllFiles("./", ".scss"),
  ...getAllFiles("./", ".tsx"),
];
files.forEach(processFile);
