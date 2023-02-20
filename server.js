const express = require('express');
const path = require('path');
const fs = require('fs');
const { clog } = require('./middleware/clog');
const uuid = require('./helpers/uuid');
const { readAndAppend, readFromFile, writeToFile } = require('./helpers/fsUtils');


const PORT = process.env.PORT || 3001;

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clog);

app.use(express.static('public'));


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});



app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received to add a note`);


  const { title, text } = req.body;


  if (title && text) {

    const newNotes = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNotes, './db/db.json');

    const response = {
      status: 'success',
      body: newNotes,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);