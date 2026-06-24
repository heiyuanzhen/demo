
//服务器地址
let isonline = true  //正式
// let isonline = false  //测试

let version = wx.getAccountInfoSync().miniProgram.envVersion
console.log(version, 'ion');


if (version == 'trial' || version == 'release') {
  isonline = true
}

let config = {
  // SERVER_URL: isonline ? 'https://dxtdev.chinayarn.com' : 'https://dxtdev.chinayarn.com',
  SERVER_URL: isonline ? 'https://dxtwx.chinayarn.com' : 'https://dxtdev.chinayarn.com',
  isonline,
  gzxz: [
    { id: 0, name: '暂不填写' },
    { id: 1, name: '全职' },
    { id: 2, name: '兼职' },
  ],
  hyzk: [
    { id: 0, name: '暂不填写' },
    { id: 1, name: '未婚' },
    { id: 2, name: '已婚' },
  ],
  gender: [
    { id: 0, name: '暂不填写' },
    { id: 1, name: '男' },
    { id: 2, name: '女' },
  ],
  ishigh: [
    { id: 0, name: '位置' },
    { id: 1, name: '是' },
    { id: 2, name: '否' },
  ],
  situation: [
    { id: 0, name: '观望有好机会再考虑' },
    { id: 1, name: '正在找工作' }
  ]
}

function wxRequest(url, params = {}, method = 'GET') {
  const { SERVER_URL } = config
  return new Promise((reslove, reject) => {
    wx.request({
      url: SERVER_URL + url,
      method: method || 'GET',
      data: params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: (res) => {
        reslove(res)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}

module.exports = {
  config,
  wxRequest,
}