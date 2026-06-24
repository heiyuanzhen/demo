const { config  } = require('./wxRequest')

function uploadvideo(tempFilePaths, showloading = true) {
  return new Promise((resolve, reject) => {
    if (showloading) {
      wx.showLoading({
        title: "上传中",
        mask: true,
      })
    }
    let filePath = tempFilePaths[0].path
    wx.uploadFile({
      url: config.SERVER_URL + '/uploadVideo',
      filePath,
      name: 'file',
      formData: {
        userid: wx.getStorageSync('loginUserinfo').userid,
      },
      success: function (ret) {
        let result = JSON.parse(ret.data)
        if (result.result) {
          resolve(result)
        }
        reject(result)
      },
      fail: function (err) {
        reject(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  })
}

function uploadgai(param, showloading) {
  return new Promise((resolve, reject) => {
    if (!showloading)
      showloading = false
    if (showloading) {
      wx.showLoading({
        title: "上传中",
        mask: true,
      })
    }
    console.log('参数', param);
    wx.uploadFile({
      url: config.SERVER_URL + '/api/upload/storeNew',
      filePath: param.file,
      name: 'file',
      formData: {
        type: param.type
      },
      success: function (ret) {
        if (typeof (ret.data) == "string") {
          ret.data = JSON.parse(ret.data);
        }
        if (ret.data.result)
          resolve(ret.data)
        else {
          reject(ret.data)
        }
      },
      fail: function (err) {
        reject(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  })
}

module.exports = {
  uploadvideo,
  uploadgai
}