///////////////////////////////////////////////////
// init JQuery Method
///////////////////////////////////////////////////
$(function(){
    
    ///////////////////////////////////////////////////
    // keep track of the type of user
    // TODO: send to Socket for keeping state on the server
    ///////////////////////////////////////////////////
    var view = "reader";
    
    ///////////////////////////////////////////////////
    // connect to the socket
    ///////////////////////////////////////////////////
    var socket = io.connect('http://10.176.35.207:8080');
    // 192.168.2.49
    // 10.176.35.207
    
    ///////////////////////////////////////////////////
    // keep the ID of the Page to display
    ///////////////////////////////////////////////////
    var state = 0;
    
    ///////////////////////////////////////////////////
    // keep states array to track page changes
    // TODO: Keep this in the server in Mongo or something that persists
    // TODO: Support multiple viewers to create team games
    ///////////////////////////////////////////////////
    var states = ["cover", "page01", "page02", "page03", "page04", "page05", "page06"];
    
    ///////////////////////////////////////////////////
    // a custom object to store all methods not bound to UI events
    ///////////////////////////////////////////////////
    var methods = {};
    
    ///////////////////////////////////////////////////
    // modal to choose view type
    ///////////////////////////////////////////////////
    $('#myModal').modal({"show":true, "backdrop":"static"});
    
    ///////////////////////////////////////////////////
    // reader or viewer modal buttons
    ///////////////////////////////////////////////////
    $("#viewBtn").bind("click", function(ev) {
        view = "viewer";
        $(".nextPage").css("visibility", "hidden");
        $(".lastPage").css("visibility", "hidden");
        $(".sentence").css("visibility", "hidden");
    });
    $("#readBtn").bind("click", function(ev) {
        view = "reader";
    });
    
    ///////////////////////////////////////////////////
    // set initial state once socket connects
    ///////////////////////////////////////////////////
    socket.on('connect', function(data) {
        // set CSS on init
        if(view == "viewer"){
            methods.changePage(data.pageNumber);
            $(".nextPage").css("visibility", "hidden");
        }
        $(".lastPage").css("visibility", "hidden");
        methods.changePage(state);
    });
    // change the page coming from the server
    socket.on('pageChange', function(data) {
        state = data.pageNumber;
        if(view == "viewer"){
            methods.changePage(data.pageNumber);
        }
    });
    // TODO: Implement this method on Server from button click
    socket.on('invokeQuiz', function(data) {
        if(view == "viewer"){
            methods.showQuiz();
        }
    });
    // TODO: Implement successful quiz
    // TODO: Implement a place holder for Reader while quiz is in session
    socket.on('quizFinished', function(data) {
        console.log("Quiz Finished " + data.success);
        if(view == "reader"){
            if(data.success){
                // create temporary alert
                $("#alertContainer").html(
                  '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>Success!</strong> Viewer chose the correct answer.</div>'  
                );
            }else{
                // create temporary alert
                $("#alertContainer").html(
                  '<div class="alert alert-warning alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>Oops!</strong> Viewer chose an incorrect answer.</div>'  
                );
            }
        }
    });
    
    ///////////////////////////////////////////////////
    // Word in the text button clicks
    ///////////////////////////////////////////////////
    $(".nounclick").bind("click", function(ev) {
        if(view == "reader"){
            socket.emit('invokeQuiz', {'pageNumber':state});   
        }
    });
    
    ///////////////////////////////////////////////////
    // next and last button clicks
    ///////////////////////////////////////////////////
    $(".nextPage").bind("click", function(ev) {
        state++;
        console.log(state);
        // change the viewer page
        methods.changePage( state );
        socket.emit('pageChange', {"pageNumber":state});
    });
    $(".lastPage").bind("click", function(ev) {
        state--;
        methods.changePage( state );
        socket.emit('pageChange', {"pageNumber":state});
    });
    
    ///////////////////////////////////////////////////
    // trigger a page change and modify control states
    ///////////////////////////////////////////////////
    methods.changePage = function(page){
        for(var i=0; i<7; i++){
            if(i != page){
                $("#"+states[i]).css("display", "none");
            }
        }
        $("#"+states[page]).css("display", "inherit"); 
        if(view == "reader"){
            if(page == 0){
                $(".lastPage").css("visibility", "hidden");
                $(".nextPage").css("visibility", "visible");
            }
            if(page == 6) {
                $(".lastPage").css("visibility", "visible");
                $(".nextPage").css("visibility", "hidden");
            }
            if(page < 6 && page > 0) {
                $(".lastPage").css("visibility", "visible");
                $(".nextPage").css("visibility", "visible");
            }
        }
    } 
    
    ///////////////////////////////////////////////////
    // this method will use Animate.css to animate the graphics inside a modal
    // the modal shold have a transparent background
    // TODO: keep score in Mongo for stats
    ///////////////////////////////////////////////////
    methods.showQuiz = function() {
        console.log(state);
        // show the quiz based on the page# in a modal  
        switch (state) {
            case 0:
                break;
            case 1:
                $('#yellowQuizModal').modal({"show":true, "backdrop":"static"});
                break;
            case 2:
                $('#houseQuizModal').modal({"show":true, "backdrop":"static"});
                break;
            case 3:
                $('#greenQuizModal').modal({"show":true, "backdrop":"static"});
                break;
            case 4:
                $('#grassQuizModal').modal({"show":true, "backdrop":"static"});
                break;
            default:
                // all types use the same algorithm
        }
    }
    
    ///////////////////////////////////////////////////
    // Quiz Answer button clicks
    ///////////////////////////////////////////////////
    $(".quizitem").bind("click", function(ev) {
        if(view == "viewer"){
           methods.answerQuiz(ev.currentTarget.id);
        }
    });
    
    ///////////////////////////////////////////////////
    // Quiz Answer validation
    ///////////////////////////////////////////////////
    methods.answerQuiz = function(item) {
        console.log(state);
        // show the quiz based on the page# in a modal  
        switch (state) {
            case 0:
                break;
            case 1:
                if(item == "yellow") {
                    // correct answer
                    socket.emit('quizFinished', {'success':true});
                    $('#yellowQuizModal').modal('toggle');
                }else{
                    // incorrect answer
                    socket.emit('quizFinished', {'success':false});
                    $("#"+item).css("visibility", "hidden");
                }
                break;
            case 2:
                if(item == "house") {
                    // correct answer
                    socket.emit('quizFinished', {'success':true});
                    $('#houseQuizModal').modal('toggle');
                }else{
                    // incorrect answer
                    socket.emit('quizFinished', {'success':false});
                    $("#"+item).css("visibility", "hidden");
                }
                break;
            case 3:
                if(item == "green") {
                    // correct answer
                    socket.emit('quizFinished', {'success':true});
                    $('#greenQuizModal').modal('toggle');
                }else{
                    // incorrect answer
                    socket.emit('quizFinished', {'success':false});
                    $("#"+item).css("visibility", "hidden");
                }
                break;
            case 4:
                if(item == "grass") {
                    // correct answer
                    socket.emit('quizFinished', {'success':true});
                    $('#grassQuizModal').modal('toggle');
                }else{
                    // incorrect answer
                    socket.emit('quizFinished', {'success':false});
                    $("#"+item).css("visibility", "hidden");
                }
                break;
            default:
                // all types use the same algorithm
        }
    }
    
    ///////////////////////////////////////////////////
    // TODO: Use Turn.js to animation the page flips
    ///////////////////////////////////////////////////
    
});  