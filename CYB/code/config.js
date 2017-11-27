(function(){
	var config = {
		//base: "../../",
		alias: {
			"jquery": "jquery/jquery-1.8.3.min",
			"$": "jquery/jquery-1.8.3.min",
			"handlebars": "handlebars/handlebars.seajs.min",
			"engine": "setup/engine", //模板引擎
			"setup": "setup/setup", //ajax配置
			"wxShare": "https://res.wx.qq.com/open/js/jweixin-1.0.0.js",
			"weui": "../../lib/weui/jquery-weui",
			"PhotoClip": "../../lib/photoClip/PhotoClip",
			"ajaxfileupload": "../../lib/ajaxfileupload/ajaxfileupload",
			//"MD5":"jquery/MD5.js",
			"fastclick": "../../lib/weui/fastclick",
		},
		vars: {
			editTpl: "../shopManage/"+getQueryString("editTpl")
		},
	};
	function getQueryString(name){
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
		//return unescape(r[2]);
		return decodeURI(r[2]);
		}
		return null;
	}
	seajs.config(config);
})();