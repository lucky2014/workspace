define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    require("../common_c/nav/nav");
    require("../common_c/search/search");
    var goodsListTpl = require("../index/goodsList.tpl");
    var searchTpl = require("../common_c/search/search.tpl");
    var name = setup.getQueryString("name");
    var commonFn = require("../common_c/commonFn");
    var goodsSelect = require("../common_c/addsToCar/goodsSelect");

    var app = {
        loading:false,
        pageSize: 10,
		init: function(){
            var me = this;
            goodsSelect.init();
            var params = {
                "pageNum" : 1,
                "pageSize" : app.pageSize,
                "name" : name
            }
            me.listStoreProducts(params)
            $(".search>img").click(function(){
                var thname = $(".search input").val();
                params.name = thname;
                me.listStoreProducts(params);
            })
            $(document).keydown(function (event) {
                if(event.keyCode==13){
                    var thname = $(".search input").val();
                    params.name = thname;
                    me.listStoreProducts(params);
                
                }
            })
            $(document.body).infinite().on("infinite", function() {
                if(app.loading) return;
                app.loading = true;
                setTimeout(function() {
                    params.pageNum++;
                    me.listStoreProducts(params);
                }, 1000);
            });
             box.render($(".home_header"),"",searchTpl,function(){
                require("../common_c/search/search");
            });
        },
        listStoreProducts: function(params){
            var me = this;
            setup.commonAjax("store/listStoreProducts.do",params,function(msg){
                $("#allGoods").show();
                var data = msg.data;
                var newData=[];

                if(params.pageNum == 1 && data.length == 0){
                    $(".home_shopGoods").hide();
                    $(".noData").show();
                    $(".weui-loadmore").hide();
                }else{
                    $(".home_shopGoods").show();
                    $(".noData").hide();
                    $.each(data,function(i,v){
                       newData.push(v);
                       v.originPrice = v.originPrice.toFixed(2);
                    })
                    box.render($(".home_shopGoods>ul"),newData,goodsListTpl,function(){
                        me.heightFn();
                    });
                    if((msg.page.pages == params.pageNum) && data.length <= app.pageSize){
                        $("#allGoods .home_shopGoods").append("<p class='noMoreData'>——没有更多了——</p>")
                     }
                }
                if(msg.page.pages == params.pageNum){
                    app.loading = true;
                    $(document.body).destroyInfinite();
                    $(".weui-loadmore").hide();
                }else{
                    app.loading = false;
                }
            })
        },
        heightFn: function(){
            commonFn.addsToCar();
            $.each($(".home_shopGoods ul li"),function(i,v){
                var className = $(v).find("a>img");
                className.height(className.width());
            })
            
            window.onresize = function(){
                $.each($(".home_shopGoods ul li"),function(i,v){
                    var className = $(v).find("a>img");
                    className.height(className.width());
                })
            };
        }
    };
    app.init();
});
