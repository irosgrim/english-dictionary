const dictionaryFile = require('./dictionary_webster.json');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./webster.db', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('DB on!');
  }
})

const parseJsonAsync = function (file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(file);
    })
  })
}

parseJsonAsync(dictionaryFile).then(data => {
  Object.keys(data).forEach(key => {
    db.exec(`INSERT INTO english_dictionary (word, definition) VALUES ("${key}", "${data[key]}")`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`pushed [${key}]`);
      }
    })
  });
});