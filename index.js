const port = 3000;
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/webster.db', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected to db!');
  }
})

app.listen(port, () => {
  console.log(`Server 🔥 on port ${port}!`);
})

app.use(express.static('www'));

app.get('/define', (request, response) => {
  const word = request.query.word;
  const page = parseInt(request.query.page) || 1;
  const resultsPerPage = parseInt(request.query.resultsPerPage) || 20;
  const query = word ? `SELECT * FROM english_dictionary WHERE word LIKE '%${word}%'` : `SELECT * FROM english_dictionary`;
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      response.send(paginatedResponse(rows, resultsPerPage, page));
    }
  })
})

function paginatedResponse(rows, resultsPerPage, page) {
  const totalRows = rows.length;
  const pages = Math.ceil(totalRows / resultsPerPage);
  const currentPage = (page - 1);
  const wordsAtPage = rows.slice(currentPage * resultsPerPage, (currentPage * resultsPerPage) + resultsPerPage);
  return {
    pagination: {
      matches: totalRows,
      currentPage: page,
      lastPage: pages,
    },
    words: wordsAtPage
  }
}
