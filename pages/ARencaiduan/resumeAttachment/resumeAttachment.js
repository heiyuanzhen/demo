const {
  resumeFilelistReq,
  resumeFileaddReq,
  resumeFiledelReq
} = require('../../../utils/api/reqTalent')
const {
  uploadvideo
} = require('../../../utils/index')
const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    resumes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    console.log(wx.getStorageSync('loginUserinfo').userid, "userid")
    console.log(options)
    this.setData({
      userid: wx.getStorageSync('loginUserinfo').userid || ''
    })
    this.getresumeFilelist()
  },
  onShow: function () {
    this.getresumeFilelist()
  },

  async getresumeFilelist() {
    const res = await resumeFilelistReq({
      userid: this.data.userid
    })
    console.log(res.data, 'res');
    if (res.data.code === 1) {
      let list = res.data.data
      list.forEach(item => {
        let type = 'other'
        if (/\.pdf/.test(item.file_name)) {
          type = 'pdf'
        } else if (/\.docx/.test(item.file_name)) {
          type = 'word'
        }
        item.type = type
      });
      list = list.splice(0, 3)
      this.setData({
        resumes: list
      })
    }

  },

  uploadvideoFun() {
    wx.navigateTo({
      url: './web-view/web-view?id=' + this.data.userid,
    })

    // wx.chooseMessageFile({
    //   count: 1,
    //   type: 'file',
    //   success: async (res) => {
    //     const tempFilePaths = res.tempFiles
    //     if (tempFilePaths[0].type !== 'file') {
    //       return wx.showModal({
    //         title: "提示",
    //         content: "请选择pdf或word格式的文件!",
    //         confirmColor: "#26BA8D"
    //       })
    //     }
    //     const result = await uploadvideo(tempFilePaths)
    //     let data = {
    //       userid: this.data.userid,
    //       file_name: tempFilePaths[0].name,
    //       file_dir: result.ret
    //     }
    //     const resp = await resumeFileaddReq(data)
    //     if (resp.data.code === 1) {
    //       wx.showModal({
    //         title: "提示",
    //         content: "添加简历成功!",
    //         confirmColor: "#26BA8D",
    //         complete: () => {
    //           this.getresumeFilelist()
    //         }
    //       })
    //     }


    //   }
    // })
  },

  deleteItem(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.showModal({
      title: "提示",
      content: "确认要删除该简历吗",
      confirmColor: "#26BA8D",
      confirmText: "删除",
      cancelText: "再想想",
      success: async (res) => {
        if (res.confirm) {
          const res = await resumeFiledelReq({
            id
          })
          if (res.data.code === 1) {
            app.toast('删除成功!')
            this.getresumeFilelist()
          }
        } else {
          console.log('no');
        }
      },
    })
  },

  onPullDownRefresh: function () {
    this.getresumeFilelist()
    wx.stopPullDownRefresh()
  },

  gotolook(e) {
    const {
      url
    } = e.currentTarget.dataset
    this.previewFile(url)
  },
  previewFile(url) {
    wx.showLoading({
      title: '文件下载中',
    });
    wx.downloadFile({ //下载到本地
      url: url,
      success: function (res) {
        wx.hideLoading();
        var filePath = res.tempFilePath;
        var fileType = ""
        let dIndex = filePath.lastIndexOf(".")
        fileType = filePath.substring(dIndex + 1, filePath.length)
        if (fileType == 'msword') {
          fileType = 'doc'
        }
        wx.openDocument({
          filePath: filePath,
          fileType: fileType,
          success: function (res) {},
          fail: function (res) {
            wx.showToast({
              title: '文件打开失败',
            });
          },
          complete: function (res) {}
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '文件下载失败',
        });
      },
      complete: function (res) {},
    })
  },
})