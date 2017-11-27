define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");
    var topGoodTpl = require("../index/topGood.tpl");
    var searchTpl = require("../common_c/search/search.tpl");
    var goodsSelect = require("../common_c/addsToCar/goodsSelect");
    var commonFn = require("../common_c/commonFn");
    require("../common_c/nav/nav");
    require("../common_c/shopInfor/shopInfor");
   

    var app = {
        loading:false,
        pageSize: 10,
		init: function(){
            var me = this;
            var params = {
                "pageSize" : app.pageSize,
                "pageNum" : 1
            }
            me.listStoreProducts(params);
            goodsSelect.init();
            $(document.body).infinite().on("infinite", function() {
                if(app.loading) return;
                app.loading = true;
                setTimeout(function() {
                    params.pageNum++;
                    if(params.pageNum != 1){
                        params.pageSize = app.pageSize;
                    }
                    me.listStoreProducts(params);
                }, 1000);
            });
             box.render($(".home_header"),"",searchTpl,function(){
                require("../common_c/search/search");
            });
        },
        listStoreProducts: function(params){
            var me = this;
            var goodsListTpl = require("../index/goodsList.tpl");
            setup.commonAjax("store/listStoreProducts.do", params, function(msg){
                var data = msg.data;
                var newData=[];
                var topData=[];
               /* if(msg.page.pageNum == 1){
                    if(data.length != 11){
                        app.loading = true;
                    }else{
                        app.loading = false;
                    }
                }else{*/
                    if(data.length != app.pageSize){
                        app.loading = true;
                    }else{
                        app.loading = false;
                    }
                /*}*/
                if(params.pageNum == 1){
                    if(data.length == 0){
                        $(".home_shopGoods").append("<p class='noMoreData'>—— 该店铺没有出售中商品 ——</p>")
                        $(".weui-loadmore, .home_shopGoods>ul,.topGood").hide();
                    }else{
                        $.each(data,function(i,v){
                            if(i != 0){
                                newData.push(v);
                                v.originPrice = v.originPrice.toFixed(2);
                            }else if(i == 0){
                                topData.push(v);
                                v.originPrice = v.originPrice.toFixed(2);
                            }
                        })
                        box.render($(".topGood"),topData,topGoodTpl,function(){
                            me.heightFn();
                        });
                        if((params.pageNum == msg.page.pages) || (data.length < app.pageSize)){
                            $(".home_shopGoods").append("<p class='noMoreData'>——没有更多了——</p>");
                        }
                    }
                    
                    if(data.length == 1){
                        $(".home_shopGoods>ul").hide();
                    }
                }else{
                     $.each(data,function(i,v){
                        newData.push(v);
                        v.originPrice = v.originPrice.toFixed(2);
                     })
                     if((params.pageNum == msg.page.pages) || (data.length < app.pageSize)){
                         $(".home_shopGoods").append("<p class='noMoreData'>——没有更多了——</p>");
                     }
                }
                
                box.render($(".home_shopGoods>ul"),newData,goodsListTpl,function(){
                    commonFn.addsToCar();
                    me.heightFn();
                });

                if(params.pageNum == msg.page.pages){
                    $(document.body).destroyInfinite();
                    $(".weui-loadmore").hide();
                }
            });
        },
        heightFn: function(){
            $(".home_shopGoods ul li>a>img").height($(".home_shopGoods ul li>a>img").width());
            window.onresize = function(){
                $(".home_shopGoods ul li>a>img").height($(".home_shopGoods ul li>a>img").width());
            };
        },
       
    };
    app.init();
});
