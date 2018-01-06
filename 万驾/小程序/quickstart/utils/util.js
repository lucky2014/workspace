


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



const getViewWHInfo = (e,pz) => { 

  const viewSize={}; 
  const originalWidth = e.detail.width;//图片原始宽  
  const originalHeight = e.detail.height;//图片原始高  
  wx.getSystemInfo({ //这里涉及到一个API
   success: function (res) {  
    //读取系统宽度和高度 

    if(pz<=1){
      const viewWidth = res.windowWidth*pz ;
      viewSize.width = viewWidth; 
      viewSize.height = originalHeight*viewWidth/originalWidth; 
    }else{
      viewSize.width = originalWidth*150/res.windowWidth; 
      viewSize.height = pz; 
    }
   } 
  }); 
  return viewSize; 
} 

module.exports = {
  formatTime: formatTime,
  getViewWHInfo: getViewWHInfo,
}