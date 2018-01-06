var app = {
	ajaxUrl: "/PICCWxServerAdvance/http/Server.do",
	insureds: [],
	count: 0,
	url: "",
	init: function(){
		var me = this;
		//验证手机
		var regPhone = /^1[34578]\d{9}$/;
		me.validatorInit("phone", "请输入正确的手机号码！", regPhone);

		//验证身份证
		var regIdCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
		me.validatorInit("idCard", "请输入正确的身份证号码！", regIdCard);
	},
	getQueryString: function(name) { //获取URL的参数，isEit
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	},
	validatorInit: function(name, msgStr, reg, len){
		$("input[name="+name+"]").bind("blur",function(){
			var val = $(this).val();
			if(!val){
				$(".msg span").html(msgStr);
				$(".msg").show();
			}else{
				if(!reg.test(val)){
					$(".msg span").html(msgStr);
					$(".msg").show();
				}else{
					$(".msg").hide();
				}
			}
		});
	},
	getDate3: function(){
		var dd = new Date();
		dd.setDate( dd.getDate() + 3);
		var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
		var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate()
		return dd.getFullYear() +"-"+ m +"-"+ d;
	},
	submitInit: function(len){
		var me = this;
		me.insureds = [];
		var insuredName = $("input[name=parentName]").val();
		var identifyNumber = $("input[name=idCard]").val();
		var mobile = $("input[name=phone]").val();
		var insuredAddress= $("textarea[name=address]").val();

		//获取名单
		me.insureds.push({insuredName: insuredName, mobile: mobile, insuredFlag: "100", identifyNumber: identifyNumber, insuredAddress: insuredAddress});
		var childName = $(".childName");
		for(var j=0; j<childName.length;j++){
			var vv = $(".childName").eq(j).find("input").val();
			if(vv.length>1){
				me.insureds.push({
					insuredName: vv,
					insuredFlag: "010",
					mobile: "13000000000"
				});
			}
		}
		
		var params = {
			planCode:"ZKF3301001",
			startDate: "2017-06-09",
			insurancePeriod: 365,
			count: len,
			sumPrice: $("#sum").html()*100,
			sumAmount: (len*5)+"0000",
			insureds: me.insureds,
			oucCode: "PDXcpsj8SMObvRXBlVnnWA",
			timeLimited:"N",
			benifitlaw: "Y",
			insuredmatch: "N"
		}
		//console.log(JSON.stringify(params,null,2));
		$.ajax({
			type: 'post',
			url: me.ajaxUrl,
			data: {cmd:"prpServSaveOrder",value:JSON.stringify(params)},
			dataType: 'json',
			success: function(msg){
				if(msg.code==100){ 
					$(".p6Box dd a").css("pointer-events", "auto"); //添加成功后才能再次点击，防止重复提交
					var object = JSON.parse(msg.result);
					me.weChatPretrade(msg.result);
					
				}else{
					//console.log(msg.result)
				}
			}
		});
	},
	weChatPretrade: function(trade_no){
		var me = this;
		var wxRechargeData = {
			trade_no: String(trade_no)
		};
		$.ajax({
			type: 'post',
			url: me.ajaxUrl,
			data: {cmd:"weChatPretrade",value:JSON.stringify(wxRechargeData)},
			dataType: 'json',
			success: function(msg){
				if(msg.code==100){
					//console.log(JSON.stringify(msg,null,2));
					$("#loding").hide();
					$(".codeOuter").show();
					var object = JSON.parse(msg.result);
					object.CodeImgUrl = unescape(object.CodeImgUrl.replace(/\\u/g, "%u")); 
					//console.log(object.CodeImgUrl)
					$(".qrcode img").attr("src",object.CodeImgUrl)
					$("body,html").addClass("hideBody");
					
				}else{
					//console.log(msg.result)
				}
			}
		});
	},
	add: function(count){
		if(count == 2){
			count = 2;
		}else{
			++count;
			app.count = count;
			if(count == 2){
				$(".reduce1").css("display","inline-block");
				$(".reduce2").hide();
				$("#add").hide();
			}else if(count == 1){
				$(".reduce1").hide();
				$(".reduce2").css("display","inline-block");
			}
		} 
		$(".childName").eq(count).show();
	},
	reduce: function(count){
		var me = this;
		if(count == 0){
			count = 0;
		}else{
			$(".childName").eq(count).hide();
			$(".childName").eq(count).find("input").attr("value","");
			$("#sum").html(6.1*count+"0");
			$(".p6Box dd a").attr("len",count);
			$("#originPrice").html((count*41));
			--count;
			app.count = count;
			if(count == 0){
				$("#add").css("display","inline-block");
				$(".reduce").hide();
			}else if(count == 1){
				$(".reduce1").hide();
				$(".reduce2").css("display","inline-block");
				$("#add").css("display","inline-block");
			}
		} 
	},
};

//业务逻辑
app.init();

//增加孩子姓名
$("#add").click(function(){
	app.add(app.count);
});
//减少孩子姓名
$(".reduce").click(function(){
	app.reduce(app.count);
});

$(".childName input").bind("input propertychange",function(){
	var len = 0;
	var childName = $(".childName");
	for(var j=0; j<childName.length;j++){
		var vv = $(".childName").eq(j).find("input").val();
		if(vv.length>1){
			len = len+1;
			$("#sum").html((len*6.1).toFixed(2));
			$("#originPrice").html((len*41));
			$(".p6Box dd a").attr("len", len);
		}
	}
});

$(".p6Box dd a").click(function(){
	var insuredName = $("input[name=parentName]").val();
	var identifyNumber = $("input[name=idCard]").val();
	var mobile = $("input[name=phone]").val();
	var insuredAddress= $("textarea[name=address]").val();
	var childrenName1 = $("input[name=childrenName1]").val();

	if(mobile && mobile.length!=11){
		$(".msg span").html("请填写正确的手机号码！");
		$(".msg").show();
		return false;
	}else if((identifyNumber && identifyNumber.length!=15) && (identifyNumber && identifyNumber.length != 18)){
		$(".msg span").html("请填写正确的身份证号码！");
		$(".msg").show();
		return false;
	}else if(insuredName && insuredAddress && childrenName1){
		var self = $(this);
		$(".msg").hide();
		self.css("pointer-events", "none"); //不能点击，防止重复提交
		
		var len = self.attr("len") || 1;
		$(".codeBk").show();
		$("body,html").addClass("hideBody");
		app.submitInit(len);
	}else{
		$(".msg span").html("每一项都必填哦！");
		$(".msg").show();
		return false;
	}
});

//app.qcodetochar("weixin:/pay/bizpayurl?pr=zvIhvep")
$(".codeBk").click(function(){
	$(".codeBk").hide();
	$("body,html").removeClass("hideBody");
})
$(".codeOuter").click(function(event){
    event.stopPropagation();
});


function is_weixn(){  
    	var ua = navigator.userAgent.toLowerCase();  
        if(ua.match(/MicroMessenger/i)=="micromessenger") {  
             
        } else {   
             window.location.href="404.html";
        }  
} 
$(document).ready(function(){
  is_weixn()
})

var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?318e2c0d5818cbc069c1ef3d4efbd1e9";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();


$.ajax({
	type: 'post',
	url: "/PICCWxServerAdvance/html/jsConfig.do",
	data: {url:window.location.href},
	dataType: 'json',
	success: function(msg){
		if(msg.code==100){
			var obj = JSON.parse(msg.result);
			//alert(JSON.stringify(obj,null,2));

			//二维码扫描
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: obj.appId, // 必填，公众号的唯一标识
				timestamp: obj.timestamp, // 必填，生成签名的时间戳
				nonceStr: obj.nonceStr, // 必填，生成签名的随机串
				signature: obj.signature,// 必填，签名，见附录1
				jsApiList: [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			
			wx.ready(function(){
				var url = location.href.split("childrenDay");
				var title = "致每一个曾是孩子的你";
				var link = url[0]+"childrenDay/buy.html";
				var imgUrl = url[0]+"childrenDay/imgs/imgUrl.jpg";
				var desc = "这是一件你曾经难以理解，如今感同身受的事";
				//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
				wx.onMenuShareTimeline({
				    title: title, // 分享标题
				    link: link, // 分享链接
				    imgUrl: imgUrl, // 分享图标
					success: function (res) {
						//Dialog('已分享');
					},
					cancel: function (res) {
						//Dialog('已取消');
					}
				});
				//获取“分享给朋友”按钮点击状态及自定义分享内容接口
				wx.onMenuShareAppMessage({
				    title: title, // 分享标题
				    desc: desc, // 分享描述
				    link: link, // 分享链接
				    imgUrl: imgUrl, // 分享图标
				    type: '', // 分享类型,music、video或link，不填默认为link
				    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				    success: function () { 
				        // 用户确认分享后执行的回调函数
				    	//Dialog("分享成功！");
				    	//console.log(JSON.stringify(res));
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				        //console.log(JSON.stringify(res));
				    }
				});
				
				//获取“分享到QQ”按钮点击状态及自定义分享内容接口
				wx.onMenuShareQQ({
					title: title, // 分享标题
				    desc: desc, // 分享描述
				    link: link, // 分享链接
				    imgUrl: imgUrl, // 分享图标
				    success: function () { 
				       // 用户确认分享后执行的回调函数
				    	//Dialog("分享成功！");
				    },
				    cancel: function () { 
				       // 用户取消分享后执行的回调函数
				    }
				});
				
				//获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
				wx.onMenuShareWeibo({
					title: title, // 分享标题
				    desc: desc, // 分享描述
				    link: link, // 分享链接
				    imgUrl: imgUrl, // 分享图标
				    success: function () { 
				       // 用户确认分享后执行的回调函数
				    	//Dialog("分享成功！");
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				    }
				});
				
				//获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
				wx.onMenuShareQZone({
					title: title, // 分享标题
				    desc: desc, // 分享描述
				    link: link, // 分享链接
				    imgUrl: imgUrl, // 分享图标
				    success: function () { 
				       // 用户确认分享后执行的回调函数
				    	//Dialog("分享成功！");
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				    }
				});
			});
		}else{
		}
	}
});