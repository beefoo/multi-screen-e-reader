
$(function(){
    
    // connect to the socket
    var socket = io.connect('http://localhost:8080');
    // keep the ID of the Page to display
    var state = 0;
    var states = ["cover", "page01", "page02", "page03", "page04", "page05"];
    var methods = {};
    
    // set initial state once socket connects
    socket.on('connect', function(data) {
        // set CSS on init
        $(".lastPage").css("visibility", "hidden");
        methods.changePage(state);
    });
    socket.on('pageChange', function(data) {
        console.log(data);
    });
    socket.on('invokeQuiz', function(data) {
        console.log(data);
    });
    socket.on('quizFinished', function(data) {
        console.log(data);
    });
    
    // next and last button clicks
    $(".nextPage").bind("click", function(ev) {
        methods.changePage( (state + 1) );
    });
    $(".lastPage").bind("click", function(ev) {
        methods.changePage( (state - 1) );
    });
    
    methods.changePage = function(page){
        console.log(page);
        state = page;
        for(var i=0; i<6; i++){
            if(i != page){
                $("#"+states[i]).css("display", "none");
            }
        }
        $("#"+states[page]).css("display", "inherit"); 
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
    
    methods.triggerQuiz = function(page) {
        // show the quiz based on the page# in a modal   
    }
    
});  