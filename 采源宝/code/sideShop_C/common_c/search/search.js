define(function(require,exports,module){
	var $ = require("jquery");
	var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    require("../search/search.css");

    $(".search>i").click(function(){
        var name = $(".search input").val();
    	window.location.href = "goodsAll.html?name="+name;
    	//search();
    })
    $(document).keydown(function (event) {
        if(event.keyCode==13){
            var name = $(".search input").val();
            window.location.href = "goodsAll.html?name="+name;
            //search();
        }
    })
})