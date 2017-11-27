define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    var weui = require("weui");

    var app = {
        cardId: setup.getQueryString("cardId"),
		init: function(pageNum, pageSize, grandType){
			/*var me = this;
			var params = {
                grandType: grandType,
				pageNum: pageNum,
				pageSize: pageSize
			};

			setup.commonAjax("giftCard/getGiftCardTemplate.do", params, function(msg){
            	if(msg && msg.length > 0){
                    $.each(msg, function(i,v){
                        v.type = (v.template)[0].type;
                        v.typeName = (v.template)[0].typeName;
                        
                        var len = (v.template).length;
                        v.childList = [];
                        for(var j=0;j<len;j++){
                            v.childList.push({
                                id: (v.template)[j].id,
                                imageUrl: (v.template)[j].imageUrl,
                                name: (v.template)[j].name,
                                cardId: setup.getQueryString("cardId")
                            });
                        }
                        v.template = "";
                        
                    });

                    for(var i=0; i<msg.length;i++){
                        for (var j in msg[i]) {
                            if (msg[i][j] === '' ||  msg[i][j] === {}) {
                                delete msg[i][j]
                            }
                        }
                    }
            		var indexTpl = require("../../ps_template/index.tpl");
                    box.render($("#temp_List"), msg, indexTpl);  //我的卡券列表
            	}
            });*/

            var msg = [
              {
                "type": 4,
                "typeName": "朋友一辈子",
                "childList": [
                  {
                    "id": 2,
                    "imageUrl": "http://122.224.218.61:8001/group1/M00/00/46/wKgCClkQa0iAWWvAAAF6xEgayfE486.jpg",
                    "name": "一个像夏天一个像秋天",
                    "cardId": null
                  },
                  {
                    "id": 1,
                    "imageUrl": "http://122.224.218.61:8001/group1/M00/00/46/wKgCClkQa4eAYiK0AAEZPm94jrw382.jpg",
                    "name": "友谊地久天长",
                    "cardId": null
                  }
                ]
              },
              {
                "type": 5,
                "typeName": "以爱之名",
                "childList": [
                  {
                    "id": 4,
                    "imageUrl": "http://122.224.218.61:8001/group1/M00/00/46/wKgCClkQa4eAYiK0AAEZPm94jrw382.jpg",
                    "name": "最美",
                    "cardId": null
                  },
                  {
                    "id": 3,
                    "imageUrl": "http://122.224.218.61:8001/group1/M00/00/46/wKgCClkQawGAKjoUAADa2JDUMe4826.jpg",
                    "name": "陪你度过漫长岁月",
                    "cardId": null
                  }
                ]
              },
              {
                "type": 6,
                "typeName": "致亲情",
                "childList": [
                  {
                    "id": 6,
                    "imageUrl": "http://122.224.218.61:8001/group1/M00/00/46/wKgCClkQawGAKjoUAADa2JDUMe4826.jpg",
                    "name": "时间都去哪了",
                    "cardId": null
                  },
                  {
                    "id": 5,
                    "imageUrl": "http://122.224.218.61:8001/group1/M00/00/46/wKgCClkQa0iAWWvAAAF6xEgayfE486.jpg",
                    "name": "真的爱你",
                    "cardId": null
                  }
                ]
              }
            ];
            var indexTpl = require("./index.tpl");
            box.render($("#temp_List"), msg, indexTpl);  //我的卡券列表
		},
        swiperInit: function(){
            setup.commonAjax("giftCard/getCarouselGiftCardTemplate.do", {}, function(msg){
                swiper.swiperInit(msg);
            });
        }
	};

    //banner图滑动例子
	app.init(1,10,1);  //模板渲染例子


    $(document)
    .on('click', '#show-success', function() {
        weui.toptip('操作成功', 'success');
    })
    .on('click', '#show-error', function() {
        weui.toptip('操作失败', 'error');
    })
    .on('click', '#show-warning', function() {
        weui.toptip('警告', 'warning');
    })
});
