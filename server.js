require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Url = require('./model/url-model');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;
MONGO_URI='mongodb+srv://ademustexcel:judiciary@cluster0.g5s4z.mongodb.net/urlshortener?retryWrites=true&w=majority';

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
const connectionURL = 'mongodb://127.0.0.1:27017/url-shortener'

// Setup your mongodb connection here
mongoose.connect(connectionURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

app.post('/api/shorturl/new', async (req, res) => {
  try {
    const reqUrl = req.body.url;
    console.log('43 ', reqUrl);
    console.log('44', validator(reqUrl));
    if (!validator(reqUrl)) {
      res.json({
        "error": "invalid url"
      })
    } else {
      let url = await Url.findOne({
        original_url: reqUrl
      })
      if (url) {
        res.json(url)
      } else {
        url = new Url({
          original_url: reqUrl,
          short_url: `${reqUrl[8]}${reqUrl[9]}${reqUrl[reqUrl.length - 5]}${Math.floor(Math.random() * reqUrl.length)}`
        })
        url.save();
        res.json(url)
    }
    
    }    
  } catch (e) {
    throw e
  }
})

app.get('/api/shorturl/:short_url', async (req, res) => {
  const reqUrl = req.params.short_url;
  let url = await Url.findOne({
    short_url: reqUrl
  })
  console.log(url);
  res.redirect(`${url.original_url}`);
})

function validator(url) {
  const pattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gim;
  return pattern.test(url);
}


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
