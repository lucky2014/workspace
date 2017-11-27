define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");

    require("{kk}.tpl");

    var app = {
        //图片上传
        uploadImgInit: function(){
            var me = this;
            var PhotoClip = require("PhotoClip");
            var winWidth = $(window).width()*0.92;
            var winHeight = winWidth*2/3;
            
            var pc = new PhotoClip('#clipArea', {
                size: [winWidth,winHeight],
                outputSize: [0,0],
                file: '#imageFile',
                ok: '#clipBtn',
                inShade: "#inShade",
                body: "#body",
                parentBox: "clipBox",
                loadStart: function() {
                    $("body").css({"height": "100%", "overflow": "hidden"});
                    console.log('开始读取照片');
                },
                loadComplete: function() {
                    console.log('照片读取完成');
                },
                done: function(dataURL) {
                    setup.commonAjax("vote/uploadBase64Img.do", {imgData:dataURL}, function(msg){
                        $("#inShade").hide();
                        me.imgUrl = msg;
                        $(".image").attr("src",msg);
                        $("#clipBox").hide();
                        $("body").attr("style", "");

                    });
                },
                fail: function(msg) {
                    console.log(msg);
                }
            });
        },
	};

    app.uploadImgInit();
});
