const formatTime = (date, log) => {
  const t = new Date(date);
  const year = t.getFullYear()
  const month = t.getMonth() + 1
  const day = t.getDate()
  const hour = t.getHours()
  const minute = t.getMinutes()
  const second = t.getSeconds()

  return log ? [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':') : [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function getViewWHInfo(e){ 

  var viewSize={}; 
  var originalWidth = e.detail.width;//图片原始宽  
  var originalHeight = e.detail.height;//图片原始高  
  wx.getSystemInfo({ 
   success: function (res) {  
    //读取系统宽度和高度 
    var viewWidth = res.windowWidth; 

    viewSize.width = viewWidth; 
    viewSize.height = originalHeight*viewWidth/originalWidth; 
   } 
  }); 
  return viewSize; 
} 

module.exports = {
  formatTime: formatTime,
  getViewWHInfo: getViewWHInfo,
}
