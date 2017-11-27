define(function(require, exports, module) {
	var $ = require("jquery");
    require("weui");
    var FastClick = require("fastclick");
    var setupApp = {
        url:"http://store.yinnima.com/micro-store-cus/",//测试
        url_B: "http://store.yinnima.com/store-bus-",//测试
        getQueryString: function(name) { //获取URL的参数，isEit
          var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
          var r = window.location.search.substr(1).match(reg);
          if (r != null) {
            //return unescape(r[2]);
            return decodeURI(r[2]);
          }
          return null;
        },
        commonAjax: function(name, params, succCallback, errCallback,async){
            var me = this;
            $.ajax({  
                type: "post",  
                url: me.url+ name,
                data: params,
                dataType: "json",
                async:async==undefined?true:async,
                success: function(msg){
                    if(msg.resultCode == 1000){
                        msg && succCallback(msg.returnObject);
                    }else if(msg.resultCode == 2006){
                        location.href = msg.returnObject;
                    }else if(msg.resultCode == 9999){ //系统异常或故障
                        $.alert(msg.returnObject, "提示", function(){
                            $(".weui-dialog,.weui-mask").remove();
                        });
                    }else{
                        $.alert(msg.returnObject, "提示", function(){
                            $(".weui-dialog,.weui-mask").remove();
                        });
                    }
                }, 
                complete: function (XHR, TS) { XHR = null },
                error: function (msg) {  
                    if(errCallback){
                        errCallback(msg); 
                    }else{
                        $.alert(msg.responseJSON.returnObject+"！", "提示", function(){
                            $(".weui-dialog,.weui-mask").remove();
                        });
                    }
                }  
            }); 
        },
        commonAjax_B: function(type,name, params, succCallback, errCallback,async){
            var ajaxUrl;
            if (type==1) {
                ajaxUrl = "goods/";
            }else if(type==2){
                ajaxUrl = "shop/";
            }else if(type==3){
                ajaxUrl = "order/";
            };
            var me = this;
            $.ajax({  
                type: "post",  
                url: me.url_B+ajaxUrl+name,  
                data: params,
                dataType: "json",
                async:async==undefined?true:async,
                beforeSend: function(xhr){xhr.setRequestHeader('X-Requested-With','XMLHttpRequest')},//这里设置header
                success: function(msg){
                    if(msg.resultCode == 1000){
                        msg && succCallback(msg.returnObject);
                    }else if(msg.resultCode == 2006){
                        location.href = msg.returnObject;
                    }else if(msg.resultCode == 9999){ //系统异常或故障
                        $.alert(msg.returnObject, "提示", function(){
                            $(".weui-dialog,.weui-mask").remove();
                        });
                    }else{
                        $.alert(msg.returnObject, "提示", function(){
                            $(".weui-dialog,.weui-mask").remove();
                        });
                    }
                }, 
                /*complete: function (XHR, TS) { XHR = null },*/
                error: function (msg) {  
                    if(errCallback){
                        errCallback(msg); 
                    }else{
                        $.alert(msg.responseJSON.returnObject+"！", "提示", function(){
                            $(".weui-dialog,.weui-mask").remove();
                        });
                    }
                }  
            }); 
        },
        isIE: function(){ //判断浏览器是不是IE,暂时不需要
            return (!!window.ActiveXObject || "ActiveXObject" in window) ? true : false;
        },
        is_weixn:function(){  
            var ua = navigator.userAgent.toLowerCase();  
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;  
            } else {  
                location.href = "../weixinerror.html"
                return false;  
            }  
        },
        timeFormatter: function(t,log){
            function formatNumber(n){
              n = n.toString()
              return n[1] ? n : '0' + n
            }

            t = new Date(t);

            var year = t.getFullYear();
            var month = t.getMonth() + 1;
            var day = t.getDate();
            var hour = t.getHours();
            var minute = t.getMinutes();
            var second = t.getSeconds();

            return log ? [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':') : [year, month, day].map(formatNumber).join('-');
        }
    };
    //setupApp.is_weixn();
    //console.log(setupApp.timeFormatter(1511080660000,1));
    $(function() {
       FastClick.attach(document.body);
    });
    module.exports = setupApp;
});