define(function(require, exports, module) {
	var Handlebars = require('handlebars');
	var box  = {
		init:function(){
			return box;
		},
		clicked:function(){},
		render:function($dom, data, tpl, cb, flag){
			var tplc = Handlebars.compile(tpl);
			if(flag){
				$dom.html(tplc(data));
				cb && cb();
			}else{
				$dom.append(tplc(data));
				cb && cb();
			}
			
			box.$dom = $dom;
			$dom.click(function() {
			  box.clicked && box.clicked();
			});
		}
	};
	
	Handlebars.registerHelper("manageStatusChange",function(type){
		var status = ["allGoods","sell","soldOut","unshelf","delete",'gongyingshangXiajia'];
		return status[type]
	})
	Handlebars.registerHelper("carStatusChange",function(type){
		var status = ["","sold",'soldOut','unshelf','delete','gongyingshangXiajia'];
		return status[type]
	});
	Handlebars.registerHelper("profit",function(v1,v2){
		if(v1&&v2){
			return (Number(v1)-Number(v2)).toFixed(2)
		}else{
			return "";
		}
	});
	Handlebars.registerHelper("carCanEdit",function(type,options){
		if(type==1){
			return options.fn(this);
		}else{
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper("orderStatusHtml",function(status,type){ //status表示订单状态，type区分买家（type=2）还是卖家（type=1）
		if(status == "1"||status == "8"){
			return '待付款';
		}else if(status == "2"){
			return '待发货';
		}else if(status == "3"){
			if(type==1){
				return '已发货';
			}else{
				return '待收货';
			}
		}else if(status == "5"){
			return '已关闭';
		}else if(status == "7"){
			return '已完成';
		}
	});
	Handlebars.registerHelper("isArray",function(val){ 
		if(val instanceof Array){
			return true;
		}else{
			return false;
		}
	})
	Handlebars.registerHelper("sizeAndColorChange",function(attr){ //
		var val = "";
		for(var i = attr.length-1;i>=0;i--){
			val+=(attr[i].attrVal)+" "
		}
		return val;
	});
	Handlebars.registerHelper("jisuan",function(v1,v2){ //
		return Math.abs(v1-v2);
	});
	
	Handlebars.registerHelper("goodsStatus",function(status,totalCurrentNum){ //
		if(status == 2 || totalCurrentNum == 0){
			return "已售罄";
		}else if(status == 1){
			return "加入购物车";
		}else if(status == 3 || status == 4){
			return "已下架";
		}
	});
	module.exports = box;
});