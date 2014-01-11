$(function(){
    var socket = io.connect('http://localhost:8080');
    socket.on('pageChange', function(data) {
        console.log(data);
    });
    socket.on('invokeQuiz', function(data) {
        console.log(data);
    });
    socket.on('quizFinished', function(data) {
        console.log(data);
    });
});