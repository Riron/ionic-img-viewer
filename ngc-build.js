const sass = require('node-sass');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const tempFolder = '.tmp';
const componentPath = `./${tempFolder}/image-viewer.component.ts`;
const scssPath = `./${tempFolder}/image-viewer.scss`;

process();

function process() {
  console.log('Running build...');
  deleteFolderRecursiveSync(tempFolder);
  copyRecursiveSync('src', tempFolder);

  const component = getFileContent(componentPath);
  const css = getCss(getFileContent(scssPath));

  console.log('Inlining styles...');
  const newComponent = component.replace('styles: []', `styles: ['${css}']`);

  writeFile(componentPath, newComponent, () => {
    console.log('About to run ngc async...');

    runNgc('tsconfig.json');
    runNgc('tsconfig.umd.json');
  });
}

function runNgc(tsConfigPath) {
  console.log('Started for', tsConfigPath);

  const ngc = path.resolve('node_modules', '.bin', 'ngc');
  exec(`${ngc} -p ${tsConfigPath}`, (err, stdout, stdeer) => {
    if (err) {
      console.log('Error !', err);
      return;
    }

    console.log('Done for', tsConfigPath);
  });
}

function getCss(scss_content) {
  const style = sass.renderSync({
    data: scss_content
  });

  return style.css
    .toString()
    .replace(/([\n\r]\s*)+/gm, ' ')
    .replace(/"/g, '\\"');
}

function getFileContent(path) {
  return fs.readFileSync(path, 'utf8');
}

function writeFile(path, data, callback) {
  return fs.writeFile(path, data, err => {
    if (err) {
      console.log('Error while writing file !', err);
    }

    callback();
  });
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copySync(src, dest);
  }
}

function deleteFolderRecursiveSync(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.removeSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
