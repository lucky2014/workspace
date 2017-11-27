define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();

    require("../html2canvas/html2canvas");

    var app = {
		init: function(){
            var me = this;
            var targetDom = $(".shareInner"); 

            var w = targetDom.width();
            var h = targetDom.height();
            //要将 canvas 的宽高设置成容器宽高的 2 倍
            var canvas = document.createElement("canvas");
            canvas.width = w * 2;
            canvas.height = h * 2;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            var context = canvas.getContext("2d");
            //然后将画布缩放，将图像放大两倍画到画布上
            context.scale(2,2); 

            html2canvas(targetDom, {
                canvas: canvas,
              onrendered: function(canvas) {
                var thCanvas = me.convertCanvasToImage(canvas);
                var thBase64 = $(thCanvas).attr("src");
                var url = canvas.toDataURL();//图片地址
                setup.commonAjax("index/uploadBase64Img.do",{"imgData":url}, function(msg){
                    //console.log(msg)
                    $.hideLoading();
                    $(".goodsShare").show();
                    $(".goodsShare .shareInner").html('<img src="'+msg+'" style="height:100%;" class="doPic"/>'+tips);
                    $(".goodsShare").css({"z-index":"99","background": "rgba(0,0,0,0.5)"});
                    $(".goodsShare .shareInner").css({
                        "top":"50%",
                        "margin-top":"-250px",
                        "left":"10%",
                        "z-index":"100"
                    });
                    
                })
                var tips = "<div class='tips'><span>长按保存图片</span><i><img src='../imgs/c/cutShare.png'/></i></div>";
                
                  },
              useCORS: true,
            });
        },
        convertCanvasToImage: function(canvas) {
            var image = new Image();
            //image.crossOrigin = "anonymous";
            image.src = canvas.toDataURL("image/png");
            return image;
        },
    };
    app.init();
});
