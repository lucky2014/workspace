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
