define(function(require,exports,module){
	var $ = require("jquery");

    var setup = require("setup");
    var Engine = require("engine");
    var box = Engine.init();
    require("weui");
    // require("../goodsEdit/dragImg.js");
    var app = {
    	goodsId : setup.getQueryString("goodsId") || 22,
		init: function(){
			var me = this;
			me.getProductInfo();

			$("body").delegate(".modifyBtn li:last-child","click",function(){
				me.updateProduct();
				//console.log(commit)
			})
			
		},
		modifyProfit: function(){
			//显示利润修改框
			$("body").delegate(".modifyBtn li:first-child","click",function(){
				var costMoney = $(".rulesDetails .cost span").html();
				var sellMoney = $(".rulesDetails .confirmPrice input").val();
				//console.log((sellMoney-costMoney)/costMoney*100)
				var percent = (sellMoney-costMoney)/costMoney*100;
				$(".ratio input").val(percent.toFixed(2));
				$(".valueNum  input").val((sellMoney-costMoney).toFixed(2));
				$("#popUp").show();
			});
			//取消修改
			$("body").delegate(".insureBtn li:last-child","click",function(){
				$("#popUp").hide();
			})
			//修改利润
			$("body").delegate("#popUp .mode li","click",function(){
				var _this = $(this);
				var type = _this.attr("type");
				if(type == 1){
					$("p.ratio").show();
					$("p.valueNum").hide();
					$(".insureBtn li:first-child").attr("type","1");
				}else{
					$("p.ratio").hide();
					$("p.valueNum").show();
					$(".insureBtn li:first-child").attr("type","2");
				}
				_this.addClass("active").siblings().removeClass("active");
			});
			//console.log(commit)
			//确定批量修改
			$("body").delegate(".insureBtn li:first-child","click",function(){
				var thisType = $(this).attr("type");
				var cost = $(".rulesDetails .cost span").html();
				
				if(thisType == 1){
					var thNum = $("p.ratio  input").val();
					var nowCost = Number($(".cost span").html());
					var nowProfit = nowCost*(thNum/100);
					var nowSellPrice = nowCost+nowProfit;
					$.each(commit.skuInfos,function(i,v){
						var jsonCost = Number(v.storeGoodsSku1688.cost);
						var profit = Number(jsonCost*(thNum/100));
						var val = Number(jsonCost)+Number(jsonCost*(thNum/100));
						var jsonVal = Number(jsonCost)+Number(jsonCost*(thNum/100));
						v.sellPrice = jsonVal;
						//console.log(val)
						$(".commonSelect ul li").eq(i).attr("sellprice",val.toFixed(2)).attr("value",profit.toFixed(2));
					});
				}else{
					var thNum = $("p.valueNum input").val();
					var nowCost = Number($(".cost span").html());
					var nowProfit = Number(thNum);
					var nowSellPrice = Number(nowCost+nowProfit);
					$.each(commit.skuInfos,function(i,v){
						var jsonCost = v.storeGoodsSku1688.cost;
						var val = Number(jsonCost)+Number(thNum);
						var profit = Number(thNum);
						var jsonVal = Number(jsonCost)+Number(thNum);
						v.sellPrice = jsonVal;
						$(".commonSelect ul li").eq(i).attr("sellprice",val.toFixed(2)).attr("value",profit.toFixed(2));
					});
				}
				/*$.each($(".commonSelect ul li"),function(i,v){
					$(v).attr("sellprice",val.toFixed(2)).attr("value",profit);
				});*/
				$(".rulesDetails .repertory span i").html(Number(nowProfit).toFixed(2));
				$(".rulesDetails .confirmPrice input").val(nowSellPrice.toFixed(2));
				$("#popUp").hide();
			});
			//单个价格修改
			$("body").delegate(".confirmPrice input","blur",function(){
				var ind = $(".commonSelect ul li.selected").index();
				var setVal = "";
				//console.log($(this).val() < 0)
				if($(this).val() < 0){
					$.toast("售价不能为负数", "forbidden");
					setVal = commit.skuInfos[ind].sellPrice;
					$(this).val(setVal);
				}else{
					setVal = $(this).val();
				}
				var profitS = setVal-$(".cost span").html();
				$(".commonSelect ul li").eq(ind).attr("sellprice",setVal);
				$(".commonSelect ul li").eq(ind).attr("value",profitS);
				$(".repertory span i").html(profitS.toFixed(2));
				commit.skuInfos[ind].sellPrice = setVal;
			})
		},
		getProductInfo: function(){
			var me = this;
			var indexTpl = require("../goodsEdit/index.tpl");
			//var goodsId = setup.getQueryString("id");
			setup.commonAjax_B("1","product/getProductInfo.do",{"id":me.goodsId},function(msg){
				/*var msg = require("../goodsEdit/json.js");*/
				//console.log(JSON.stringify(msg,null,2))
				commitMsg = JSON.stringify(msg);
				commit = JSON.parse(commitMsg)
				/*commit = commitMsg;*/
				
				var thattrVal = [];
				$.each(msg.skuInfos,function(i,v){
					var str = "";
					$.each(v.storeGoodsSkuAttrs,function(j,k){
						if(str){
							str = str+"，"+k.attrVal;
						}else{
							str+=k.attrVal;
						}
					})
					thattrVal.push({
						"attribute":str,
						"price":v.storeGoodsSku1688.cost,
						"retailPrice":msg.retailPrice||"无",
						"currentNum":v.currentNum,
						"value":(Number(v.sellPrice)-Number(v.storeGoodsSku1688.cost)).toFixed(2),
						//"type":v.type,
						"sellPrice":v.sellPrice
					})
					
				})
				var titleLen = msg.name.length > 30 ? 30 : msg.name.length;
				var newMsg = $.extend(msg,{"thattrVal":thattrVal,"titleLen":titleLen});
				newMsg.name = msg.name.length > 30 ? msg.name.substr(0,29) : msg.name;
				newMsg.pic = msg.imgage.images[0];
			    box.render($(".goodsEdit_main"),newMsg,indexTpl,function(){
			    	if(msg.skuInfos.length == 0){
			    		$(".editRules h2").html("暂不支持无属性商品编辑");
			    		var noSkuDatas = {
			    			price : newMsg.cost || "无",
			    			retailPrice : newMsg.retailPrice || "无",
			    			currentNum : newMsg.totalCurrentNum,
			    			sellPrice : Number(newMsg.origin_price).toFixed(2),
			    			type : newMsg.type,
			    			value : "无"
			    		}
			    		var priceFormsTpl = require("../goodsEdit/priceForms.tpl");
			    		 box.render($(".goodsEdit_main .priceForms"),noSkuDatas,priceFormsTpl,"",1);
			    		 $(".confirmPrice input").attr("disabled","disabled").css("background","#fff");
			    		 $(".modifyBtn").hide();
			    	}else{
			    		me.editRulesliClick($(".editRules .commonSelect ul li").eq(0));
			    	}
			    	//选择商品规格
			    	$(".editRules .commonSelect ul li").click(function(){
			    		me.editRulesliClick($(this));
			    		
			    	});
			    	//进入主图页面
			    	$(".goodsEdit_main .editPics").click(function(){
			    		window.location.href = "goodsEdit_img.html?id="+me.goodsId;
			    	});
			    	//进入图文详情
			    	$(".goodsEdit_main .editPicsText").click(function(){
			    		window.location.href = "goodsEdit_detail.html?id="+me.goodsId;
			    	});
			    	//标题更改
			    	$(".editTitle textarea").keyup(function(){
			    		var len = $(this).val().length;
			    		$(".editTitle>span i").html(len);
			    	})
			    	//更新json标题
			    	$(".editTitle textarea").blur(function(){
			    		commit.name = $(this).val();
			    	})
			    	me.modifyProfit();
			    });
            });
		},
		//规格选择
		editRulesliClick: function(me){
			var datas = {
				price : me.attr("price"),
				retailPrice : me.attr("retailPrice"),
				currentNum : me.attr("currentNum"),
				sellPrice : Number(me.attr("sellPrice")).toFixed(2),
				type : me.attr("type")-1,
				value : Number(me.attr("value")).toFixed(2)
			}
			//console.log(datas)
			var priceFormsTpl = require("../goodsEdit/priceForms.tpl");
			 box.render($(".goodsEdit_main .priceForms"),datas,priceFormsTpl,"",1)
			me.addClass("selected").siblings("li").removeClass("selected");
		},
		updateProduct: function(){
			var datas = {
				"id" : commit.id,
				"name" : commit.name,
				"skuInfos" : JSON.stringify(commit.skuInfos)
			};
			setup.commonAjax_B(1,"product/updateProduct.do",datas,function(msg){
				$.alert("修改成功", "提示");
			});
		},
	};
    app.init();
});


