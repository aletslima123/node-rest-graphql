const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

let db = null;
const url = 'mongodb://localhost:27017';
const dbName = 'RestApiDb';
const door = 3000;

const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({extended: true});

app.use(jsonParser);
app.use(urlEncodedParser);

mongoClient.connect(
  url, 
  {useNewUrlParser: true, useUnifiedTopology: true},
  (error, client) => {
    error ? console.log('Erro: ', error) : console.log('Connected!');
    db = client.db(dbName);
});

app.listen(door);
console.log(`Server started in: localhost:${door}`);

function getCode() {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    const fullDate = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    const code = Number(parseFloat(fullDate)/2).toFixed(0);
    return code;

  } catch(error) {
    console.log('Erro: ', {error: error});

  }
}

app.get('/', urlEncodedParser, (_, response) => {
  try {
    response.send({response: 'Foda-se' });
  } catch(error) {
    console.log('Error: ', error);
    response.send({error: error});
  }
});

app.get('/users', urlEncodedParser, (_, response) => {
  try {
    response.send({response: 'Register of users' });
  } catch(error) {
    console.log('Error: ', error);
    response.send({error: error});
  }
});

app.post('/users/add', urlEncodedParser, (request, response) => {
  try {
    let objJSON = {};

    objJSON.code = request.body.code ? Number(request.body.code) : getCode();
    objJSON.name = request.body.name ? request.body.name.toString().trim() : 'Anonymous';
    objJSON.age = request.body.age ? Number(request.body.age) : 00;
    objJSON.email = request.body.email ? request.body.email.toString().trim() : '';

    addUser(objJSON, (result) => {
      response.send({result});
    });

  } catch(error) {
    console.log('Error: ', error);
    response.send({error: error});
  }
});

app.get('/users/:code', urlEncodedParser, (request, response) => {
  try {
    let code = request.params.code ? Number(request.params.code) : 0;
    console.log('code: ', code);
    let objJSON = {
      code: code
    };
    console.log('objJSON: ', objJSON);

    getUser(objJSON, (result) => {
      console.log(result);
      response.send({result});
    });

  } catch(error) {
    console.log('Error: ', error);
    response.send({error: error})
  }
});

function addUser(objJSON, callback) {
  try {
    const collection = db.collection('users');
    collection.insertOne(objJSON, (error, result) => {
      error ? callback(error) : callback(result);
    });

  } catch(error) {
    console.log('Error: ', error);
  }
}

function getUser(objJSON, callback) {
  try {
    const collection = db.collection('users');
    collection.findOne(objJSON, (error, result) => {
      error ? callback(error) : callback(result);
    });

  } catch(error) {
    console.log('Error: ', error);
  }
}

