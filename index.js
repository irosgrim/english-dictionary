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
            response.send({
                pagination: pagination(rows.length, page, resultsPerPage), 
                words: paginatedResponse(rows, resultsPerPage, page)
            });
        }
    })
})

function paginatedResponse(rows, resultsPerPage, page) {
    const totalRows = rows.length;
    const pages = Math.ceil(totalRows / resultsPerPage);
    const currentPage = (page - 1);
    const wordsAtPage = rows.slice(currentPage * resultsPerPage, (currentPage * resultsPerPage) + resultsPerPage);
    return  wordsAtPage;
}

function pagination ( totalItems = 0, currentPage = 1, pageSize = 5, maxPages = 5 ) {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    let startPage;
    let endPage;
    if (totalPages <= maxPages) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPages;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
        (i) => startPage + i
    );
    return {
        totalItems,
        currentPage,
        pageSize,
        totalPages,
        startPage,
        endPage,
        startIndex,
        endIndex,
        pages,
        maxPages
    }
}