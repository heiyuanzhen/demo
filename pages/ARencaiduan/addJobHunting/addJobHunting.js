const {
  addOrEditJobHuntingReq
} = require('../../../utils/api/reqTalent')
const {
  Addpost
} = require('../../../utils/index')
let addpost = new Addpost()
const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postItems: [],
    currentPage: 1,
    total: 0,
    postselectData: '',
    formdata: {
      catid: '',
      gzxz: '',
      address: '浙江省,杭州市,不限',
      xinzi: ''
    },
    isEdit: false,
    saveText: '添加'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (options.huntingItem) {
      let item = JSON.parse(options.huntingItem)
      console.log(item, 'item');
      this.setData({
        threeLevelLabel: item.catname,
        threeLevelValue: item.catid,
        ['formdata.catid']: item.catid,
        typeId: item.type,
        ['formdata.gzxz']: item.type,
        xinziId: item.xinzi,
        ['formdata.xinzi']: item.xinzi,
        huntingItem: item,
        isEdit: true,
        saveText: '修改',
        address: item.address
      })
      wx.setNavigationBarTitle({
        title: '修改求职意向',
      })
    }

    this.getStorageUserinfo()

    await this.getPostSelectData()


  },


  getStorageUserinfo() {
    let obj = wx.getStorageSync('loginUserinfo') || {}
    if (!obj.userid) {
      return wx.showModal({
        title: "提示",
        content: "请登录来获得最佳体验~",
        confirmColor: "#26BA8D",
        confirmText: "确定",
        cancelText: "取消",
        cancelColor: "#000",
        success: () => {
          wx.redirectTo({
            url: '/pages/phoneLogin/phoneLogin',
          })
          // app.gopath('/pages/phoneLogin/phoneLogin', 2)
        },
      })

    } else {
      this.setData({
        logininfo: obj
      })
    }

  },


  async getPostSelectData() {
    let postselectData = {}
    if (addpost.isStorage()) {
      postselectData = addpost.get()
    } else {
      postselectData = await addpost.getData()
    }
    this.setData({
      postselectData
    })
  },

  threeLevelPickerChange(e) {
    this.setData({
      ['formdata.catid']: e.detail
    })
  },
  twolevelPickerChange(e) {
    const key = e.detail.currentTarget.dataset.key
    const value = e.detail.detail.value
    this.setData({
      [`formdata.${key}`]: value
    })
  },
  addresschange(e) {
    let address = e.detail.length > 0 ? e.detail.join(',') : ''
    this.setData({
      ['formdata.address']: address
    })
  },

  async addJobHunting() {

    let data = this.data.formdata
    console.log(data, 'data');
    if (!data.catid || !data.xinzi) {
      return wx.showModal({
        title: "提示",
        content: "请输入完整信息",
        confirmColor: "#26BA8D",
        confirmText: "确定",
        cancelText: "取消",
        cancelColor: "#000",
        showCancel: false
      })
    }
    let formD = {
      catid: data.catid,
      xinzi: data.xinzi,
      type: data.gzxz,
      address: data.address,
      userid: this.data.logininfo.userid,
      openid: this.data.logininfo.rc_openId
    }
    if (this.data.isEdit) {
      formD.id = this.data.huntingItem.id
    }

    const res = await addOrEditJobHuntingReq(formD)
    console.log(res.data, 'res.data');
    console.log(res.data.code == 1, 'res.data.code == 1');
    let isTrue = res.data.code === 1 ? true : false

    if (isTrue) {
      wx.showModal({
        title: `${this.data.isEdit ? '修改成功!' : '添加成功!'}`,
        content: "去查看我的求职~",
        confirmColor: "#26BA8D",
        confirmText: "好的",
        cancelText: "再想想",
        cancelColor: "#000",
        success: (res) => {
          if (res.confirm) {
            app.gopath('/pages/ARencaiduan/jobHunting/jobHunting')
          }
        },
      })
    } else {
      wx.showModal({
        title: '添加失败!',
        content: res.data.msg,
        confirmColor: "#26BA8D",
        confirmText: "重新添加",
        cancelColor: "#000",
        success: (res) => { }
      })
    }


  },

})