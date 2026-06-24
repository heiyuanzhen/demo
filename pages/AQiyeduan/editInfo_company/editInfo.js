import {
  getCompanyUserinfo,
  EditCompnayinfoReq
} from '../../../utils/api/reqTalent'
import {
  uploadgai
} from '../../../utils/index'
const app = getApp().rencaiApp

const {
  debounce,
  checkMobile
} = require('../../../utils/function.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyinfo: {
      thumb: '',
      company: '',
      address: '',
      telephone: '',
      business: '',
      introduce: '',
      zhizhao: ''
    },
    formdata: {},
    rules: {
      thumb: {
        isRequire: false,
        placeholder: '请填入公司logo'
      },
      company: {
        isRequire: true,
        placeholder: '请填入公司名'
      },
      address: {
        isRequire: true,
        placeholder: '请填入地址'
      },
      telephone: {
        isRequire: true,
        placeholder: '请填入联系电话'
      },
      zhizhao: {
        isRequire: false,
        placeholder: '请上传营业执照'
      },
    },
    resultImage: '',
    resultImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let obj = wx.getStorageSync('edit_companyinfo') || {}
    console.log(obj, "公司信息")
    let companyinfo = {
      zhizhao: obj.zhizhao || '',
      thumb: obj.thumb || '',
      company: obj.company || '',
      address: obj.address || '',
      telephone: obj.telephone || '',
      business: obj.business || '',
      introduce: obj.introduce || '',

    }

    this.setData({
      companyinfo,
      userinfo: wx.getStorageSync('loginUserinfo')
    })

  },

  onShow() {
    if (this.data.resultImage !== '') {
      this.setData({
        ['companyinfo.thumb']: this.data.resultImage,

      })
    }
    if (this.data.resultImg !== '') {
      this.setData({
        ['companyinfo.zhizhao']: this.data.resultImg,
      })
    }
  },

  changeCompanyInfo(e) {
    const {
      key
    } = e.currentTarget.dataset
    this.setData({
      [`companyinfo.${key}`]: e.detail.value
    })
  },

  // uploadAvatar(){
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: async (res) => {  
  //       console.log(res, 'chooseImage');
  //       const res2 = await uploadgai({file: res.tempFilePaths[0]}, true)
  //       this.setData({
  //         ['companyinfo.thumb']: res2.ret
  //       })
  //     }
  //   })
  // },

  saveMessage: debounce(async function () {
    let editdata = this.data.companyinfo
    editdata.userid = this.data.userinfo.userid
    let rules = this.data.rules
    console.log(rules, "规则")
    console.log(editdata, "数据")

    for (let key in editdata) {

      if (key == 'introduce' || key == 'business') {

      } else if (editdata[key] === '') {
        return wx.showModal({
          title: "提示",
          content: `${rules[key].placeholder}`,
          confirmColor: "#26BA8D",
          confirmText: "确定",
          cancelText: "取消",
          cancelColor: "#000",
          showCancel: false
        })
      } else if (key == 'telephone') {
        var x = checkMobile(editdata[key])
        if (x) {
          return
        }
      }
    }
    const res = await EditCompnayinfoReq(editdata)
    if (res.data.code === 1) {
      let data = {
        userid: this.data.userinfo.userid
      }
      const res = await getCompanyUserinfo(data)
      if (res.data.code === 1) {
        wx.setStorageSync('edit_companyinfo', res.data.data)
      }
      wx.showModal({
        title: "提示",
        content: "企业信息编辑成功!",
        confirmColor: "#26BA8D",
        confirmText: "去查看",
        cancelText: "取消",
        cancelColor: "#000",
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack()
          }
        },
      })
    } else {
      app.toast(res.data.msg)
    }


  }, 300),


  //上传头像
  uploadAvatar: function () {

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const src = res.tempFilePaths[0]

        wx.navigateTo({
          url: `/pages/uploadAvatar/uploadAvatar?src=${src}`
        })
      }
    })

  },
  //上传营业执照
  uploadBusiness: function () {
    console.log(111111111)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res, "营业执照")
        const src = res.tempFilePaths[0]
        wx.navigateTo({
          url: `/pages/uploadAvatar/uploadAvatar?src=${src}` + '&type=1'
        })
      }
    })
  }

})