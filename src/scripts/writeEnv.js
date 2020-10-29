const yaml = require('js-yaml');
const fs = require('fs');
const envFile = '.env';
try {
  const config = yaml.safeLoad(fs.readFileSync('app.yaml', 'utf8'));
  const fileContent = JSON.stringify(config.env_variables)
    .replace(/["|{|}]/g, '')
    .replace(/:/g, '=')
    .replace(/,/g, '\n');
  fs.writeFile(
    envFile,
    fileContent,
    err => {
      if (err) throw err;
      console.log(`The file ${envFile} has been saved!`);
    },
  );
} catch (e) {
  console.log(e);
}
