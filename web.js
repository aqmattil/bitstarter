var fs = require('fs');
var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
#  response.send('Hello World 2!');
buf = new Buffer(256);
fs.readFileSync('index.html', function(err, data) {
if(err) throw err;
response.send(buf.toString(data))}
);

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
