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
    var socket = io.connect('http://192.168.1.113:8080');
    
    ///////////////////////////////////////////////////
    // keep the ID of the Page to display
    ///////////////////////////////////////////////////
    var state = 0;
    
    ///////////////////////////////////////////////////
    // keep states array to track page changes
    // TODO: Keep this in the server in Mongo or something that persists
    // TODO: Support multiple viewers to create team games
    ///////////////////////////////////////////////////
    var states = ["cover", "page01", "page02", "page03", "page04", "page05"];
    
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
        if(view == "viewer"){
            methods.changePage(data.pageNumber);
        }
    });
    // TODO: Implement this method on Server from button click
    socket.on('invokeQuiz', function(data) {
        console.log(data);
        methods.triggerQuiz();
    });
    // TODO: Implement successful quiz
    // TODO: Implement a place holder for Reader while quiz is in session
    socket.on('quizFinished', function(data) {
        console.log(data);
        if(view == "viewer"){
            socket.emit('quizFinished', {"success":true});
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
        console.log(page);
        for(var i=0; i<6; i++){
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
            if(page == 5) {
                $(".lastPage").css("visibility", "visible");
                $(".nextPage").css("visibility", "hidden");
            }
            if(page < 5 && page > 0) {
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
    methods.triggerQuiz = function(page) {
        // show the quiz based on the page# in a modal  
        switch (state) {
            case "cover":
                break;
            case "page01":
                // custom images
                // custom animation type
            case "page02":
                // custom images
                // custom animation type
            case "page03":
                // custom images
                // custom animation type
            case "page04":
                // custom images
                // custom animation type
            case "page05":
                // custom images
                // custom animation type
            default:
                // all types use the same algorithm
        }
    }
    
    ///////////////////////////////////////////////////
    // TODO: Use Turn.js to animation the page flips
    ///////////////////////////////////////////////////
    
});  