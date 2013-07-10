var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');
infile = "index.html";
var text = fs.readFileync(infile, function(err, data) {
  if (err) throw err;
  console.log(data)
});
console.log(text);

app.get('/', function(request, response) {
  response.send('Hello World 2!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
