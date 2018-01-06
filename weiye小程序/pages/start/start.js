Page({
  data:{
      imgs:[
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510667260234&di=842c33529fe0536411f4f95e6b62acd5&imgtype=0&src=http%3A%2F%2Fcdn103.img.lizhi.fm%2Faudio_cover%2F2016%2F01%2F22%2F25903998422022151_320x320.jpg",
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510667290578&di=5ea0d85ef0117e59b79d3187b638495d&imgtype=0&src=http%3A%2F%2Feasyread.ph.126.net%2FN_IDsLdBTeRzslUrZOhz7g%3D%3D%2F6597276474843679725.jpg",
          "http://img.kaiyanapp.com/64f96635ddc425e3be237b5f70374d87.jpeg?imageMogr2/quality/60",
     ],

      img:"http://img.kaiyanapp.com/7ff70fb62f596267ea863e1acb4fa484.jpeg",
  },

  start(){
       wx.navigateTo({
         url: '../home/home'
      })
      wx.redirectTo({ url: '../editor/editor' })
  },


})
