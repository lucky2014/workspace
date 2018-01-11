const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var app = {
  //url : "https://store.iliujia.com/micro-store-cus/",
  url : "https://store.yinnima.com/micro-store-cus/",
  ajaxFn : function(cmd,data,cb,fcb){
    wx.request({
      url: app.url + cmd +"?develop=true&local=3",
      method : 'POST',
      header : {'content-type':"application/x-www-form-urlencoded"},
      dataType : 'json',
      data:data,
      success: function(res) {
        if(res.data.resultCode == 1000){
            cb&&cb(res.data.returnObject);
            //res && cb(res.returnObject);
        }
      },
      fail : function(res){
        fcb&&fcb(res)
      }
    });
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
}
module.exports = {
  ajaxFn : app.ajaxFn,
  timeFormatter : app.timeFormatter,
  formatTime: formatTime
}
