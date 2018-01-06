Page({
  data: {
    
  },
  bindtap : function(){
  	wx.request({
	  // 获取token
	  url: 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=fzf2qK/aUzrxaIATKFDsNQ==',
	  data:{
	    "touser":"o64P60CI3E5C082OvJJ588u8Wszc",
	    "msgtype":"miniprogrampage",
	    "miniprogrampage":{
	        "title":"title",
	        "pagepath":"pagepath",
	        "thumb_media_id":"thumb_media_id"
	    }
	  },
	  success(res) {

	  }
	})
  }
})
