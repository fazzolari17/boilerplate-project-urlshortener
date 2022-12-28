require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const data = require('./data');
// const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
  console.log(data)
});

app.post('/api/shorturl', (req, res) => {
  console.log(req.body)
  const { url } = req.body;


  const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  
  const goodUrl = httpRegex.test(url);
  console.log(goodUrl)
  if (!goodUrl) {
    return res.json({
      "error": "invalid url"
    })
  } else if (goodUrl) {
    const shortenedUrl = {
      "original_url": url,
      "short_url": (data.length + 1).toString(),
    };
  
    data.push(shortenedUrl);
    return res.json(shortenedUrl);
  }

  
});

app.get('/api/shorturl/:id?', (req, res) => {
  const id = req.params.id;
  const found = data.find(item => item.short_url === id);


  if (found) {
    res.redirect(found.original_url)
  }

})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
