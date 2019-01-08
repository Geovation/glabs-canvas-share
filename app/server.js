var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var richText = require('rich-text');
var WebSocket = require('ws');
var path = require('path');
var WebSocketJSONStream = require('websocket-json-stream');
// require ('dotenv').config();

// var {
//     MONGO_INITDB_ROOT_USERNAME: usr,
//     MONGO_INITDB_ROOT_PASSWORD: pwd,
// } = process.env;
// console.log({usr});
// console.log({pwd});
var target = process.env.TARGET || 'localhost';
var db = require('sharedb-mongo')(`mongodb://@${target}:27017/sharedb`);

// var mongodb = require('mongodb');
// mongodb.connect(`mongodb://${usr}:${pwd}@mongo-db:27017/sharedb`, () => console.log({arguments}));

// try {
//   var db = require('sharedb-mongo')({mongo: function(callback) {
//     mongodb.connect(`mongodb://${target}:27017/sharedb`, callback);
//   }});
// } catch (err) {
//   console.log({err});
// }

ShareDB.types.register(richText.type);
var backend = new ShareDB({ db });
// var backend = new ShareDB();
createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples', 'richtext');
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{insert: 'Hi!'}], 'rich-text', callback);
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.use(express.static('static'));
  app.use(express.static('node_modules/quill/dist'));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws, req) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8080);
  console.log('Listening on http://localhost:8080');
}
