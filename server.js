var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs')

    app.listen(8080);

function handler (req, res) {
  if(req.url            === "/"){
    fs.readFile(__dirname + '/client/index.html',
        function (err, data) {
          if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
          }
          res.writeHead(200);
          res.end(data);
        });
  }
  else{
    fs.readFile(__dirname + req.url, function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' +req.url);
      }
      res.writeHead(200);
      res.end(data);
    });
  }
}

io.sockets.on('connection', function (socket) {
    socket.on('pageChange', function (data) {
        io.sockets.emit('pageChange', {"pageNumber": data.pageNumber});
    });
    socket.on('invokeQuiz', function (data) {
        io.sockets.emit('invokeQuiz', {"pageNumber": data.pageNumber});
    });
    socket.on('quizFinished', function (data) {
        io.sockets.emit('quizFinished', {"success": data.success});
    });
});