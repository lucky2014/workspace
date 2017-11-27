define(function(require,exports,module){
	var $ = require("jquery");
	require("weui");
    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var msg = {
                    "resultCode":1000,
                    "returnObject":{
                        "data":[
                            {
                                "storeGoodsInfoBase":{
                                    "name":"商品名称",
                                    "coverUrl":"../imgs/c/test/pic1.jpg",
                                    "pic":"../imgs/c/test/pic1.jpg",
                                },
                                "id":2,
                                "userId":3,
                                "goodsId":4,
                                "skuId":5,
                                "num":6,
                                "price":130.00,
                            },
                            {
                                "storeGoodsInfoBase":{
                                    "name":"商品名称2",
                                    "coverUrl":"../imgs/c/test/pic2.jpg",
                                    "pic":"../imgs/c/test/pic2.jpg",
                                },
                                "id":2,
                                "userId":3,
                                "goodsId":4,
                                "skuId":5,
                                "num":3,
                                "price":130.00,
                            },
                            {
                                "storeGoodsInfoBase":{
                                    "name":"商品名称8",
                                    "coverUrl":"../imgs/c/test/pic3.jpg",
                                    "pic":"../imgs/c/test/pic3.jpg",
                                },
                                "id":2,
                                "userId":3,
                                "goodsId":4,
                                "skuId":5,
                                "num":1,
                                "price":130.00,
                            },
                            {
                                "storeGoodsInfoBase":{
                                    "name":"商品名称7",
                                    "coverUrl":"../imgs/c/test/pic1.jpg",
                                    "pic":"../imgs/c/test/pic1.jpg",
                                },
                                "id":2,
                                "userId":3,
                                "goodsId":4,
                                "skuId":5,
                                "num":8,
                                "price":130.00,
                            },
                            {
                                "storeGoodsInfoBase":{
                                    "name":"商品名称6",
                                    "coverUrl":"../imgs/c/test/pic3.jpg",
                                    "pic":"../imgs/c/test/pic1.jpg",
                                },
                                "id":2,
                                "userId":3,
                                "goodsId":4,
                                "skuId":5,
                                "num":23,
                                "price":130.00,
                            },
                        ],
                        "page": {
                            "endRow": 10,
                            "pageSize": 10,
                            "startRow": 0,
                            "totalCount": 0,
                            "totalPage": 5,
                            "pageNum": 1
                        }
                    }
            }
    var app = {
        pages:{
            pageNum:1,
            pageSize:1000,
            totalPage:1,
        },
        init:function(scrollele,name,params,cb){
            var me = this;
            var data = $.extend({pageNum:me.pages.pageNum,pageSize:me.pages.pageSize},params);
            setup.commonAjax(name,data,function(msg){
                me.pages.totalPage = msg.page.totalPage;
                cb&&cb(msg);
            });
            this.scroll(scrollele,name,params,cb);
        },
    	scroll:function(scrollele,name,params,cb){
            var me = this;
            $(scrollele).scroll(function(){
                var scrollTop = $(this)[0].scrollTop;
                var scroolHeight = $(this)[0].scrollHeight-$(this)[0].offsetHeight;
                if(scrollTop>=scroolHeight){
                    if(me.pages.pageNum<me.pages.totalPage){
                        me.pages.pageNum++;
                        var data = $.extend({pageNum:me.pages.pageNum,pageSize:me.pages.pageSize},params);
                        setup.commonAjax(name,data,function(msg){
                            me.pages.totalPage = msg.returnObject.page.totalPage;
                            cb&&cb(msg);
                        });
                        // me.pages.totalPage = msg.returnObject.page.totalPage;
                        // cb&&cb(msg);
                    }
                }
            })
    	}
    }
    return app;
});