require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Url = require('./model/url-model');
var bodyParser = require('body-parser');
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

// mongodb+srv://<username>:<password>@cluster0.82wyu.mongodb.net/<dbname>?retryWrites=true&w=majority

// mongodb+srv://<username>:<password>@cluster0.82wyu.mongodb.net/<dbname>?retryWrites=true&w=majority

// mongodb+srv://ademustexcel:<password>@cluster0.g5s4z.mongodb.net/<dbname>?retryWrites=true&w=majority

//mongoose.connect(MONGO_URI)
const connectionURL = 'mongodb://127.0.0.1:27017/url-shortener'
// Setup your mongodb connection here
mongoose.connect(connectionURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


app.post('/api/shorturl/new', async (req, res) => {
  try {
    //console.log(req.url);
    const reqUrl = req.body.url
    let url = await Url.findOne({
      original_url: reqUrl
    })
    if (url) {
      console.log('from old', url);
      res.json(url)
    } else {
      url = new Url({
        original_url: reqUrl,
        short_url: `${reqUrl[8]}${reqUrl[9]}${reqUrl[reqUrl.length - 5]}${Math.floor(Math.random() * reqUrl.length)}`
      })
      url.save();
      console.log('newurl: ', url);
      res.json(url)
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

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
