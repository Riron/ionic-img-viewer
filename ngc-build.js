const sass = require('node-sass');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const tempFolder = '.tmp';
const componentPath = `./${tempFolder}/src/image-viewer.component.ts`;
const scssPath = `./${tempFolder}/src/image-viewer.scss`;

process();

async function process() {
  console.log('Running build...');
  prepareTempFolder();

  const component = await getFileContent(componentPath);
  const css = getCss(await getFileContent(scssPath));

  console.log('Inlining styles...');
  const newComponent = component.replace('styles: []', `styles: ['${css}']`);

  const write = await writeFile(componentPath, newComponent);

  console.log('About to run ngc async...');

  const es2015 = runNgc(`${tempFolder}/tsconfig.json`);
  const umd = runNgc(`${tempFolder}/tsconfig.umd.json`);

  const build = await Promise.all([es2015, umd]);

  console.log('Moving /dist to root');
  moveDist();
}

function moveDist() {
  return fs.copy(`${tempFolder}/dist`, 'dist', { overwrite: true });
}

function runNgc(tsConfigPath) {
  console.log('Started for', tsConfigPath);

  const ngc = path.resolve('node_modules', '.bin', 'ngc');
  return new Promise((resolve, reject) => {
    exec(`${ngc} -p ${tsConfigPath}`, (err, stdout, stdeer) => {
      if (err) {
        console.log('Error !', err);
        reject(err);
      }

      console.log('Done for', tsConfigPath);
      resolve(tsConfigPath);
    });
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

async function getFileContent(path) {
  return fs.readFile(path, 'utf8');
}

function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
      if (err) {
        console.log('Error while writing file !', err);
        reject(err);
      }

      resolve(path);
    });
  });
}

function prepareTempFolder() {
  fs.removeSync(tempFolder);

  fs.copySync('src', `${tempFolder}/src`);

  fs.copySync('ionic-img-viewer.ts', `${tempFolder}/ionic-img-viewer.ts`);
  fs.copySync('tsconfig.json', `${tempFolder}/tsconfig.json`);
  fs.copySync('tsconfig.umd.json', `${tempFolder}/tsconfig.umd.json`);
}
