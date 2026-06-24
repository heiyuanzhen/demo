const { getuserinfoReq, talentListReq, collectionResume } = require("../../../utils/api/index")
const { PayForVip } = require('../../../utils/pay')

const app = getApp().rencaiApp
let that = this

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentTabbarIndex: {
      type: String | Number,
      value: '1',
      observer: async function (newval) {
        // 页面加载事件
        if (newval == 2) {
          await this.initLoginuserInfo()
        }
        console.log(newval, 'newval');
      }
    }
  },
  externalClasses: ['mine-class'],

  /**
   * 组件的初始数据
   */
  data: {
    talentList: [],
    loginUserinfo: null,
    currentIndex: 1,
    isLogin: false,
    total: 0,
    isTriggerEnd: true,
    jl_count: 0,
  },


  attached() {
    const res = wx.getSystemInfoSync()
    var statusbarH = res.statusBarHeight
    this.setData({
        statusbar :statusbarH+10, // 状态栏高度
        jiaonangheight: wx.getMenuButtonBoundingClientRect().height  // 胶囊高度
    })
  },

  pageLifetimes: {
    show: async function() {
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async initLoginuserInfo() {
      await app.initData()
      let obj = wx.getStorageSync('loginUserinfo')
      this.setData({
        loginUserinfo: obj,
        isLogin: obj.userid ? true : false
      })
    },


    async tabitemClick(e) {
      console.log(e, 'eee');
      let index
      // 1. (string || number) 2. object
      if (typeof (e) === 'string' || typeof (e) === 'number') {
        index = parseInt(e)
      } else {
        index = e.currentTarget.dataset.index
      }

      this.setData({
        currentIndex: index
      })

      let talentList
      // 已收藏人才
      let obj = this.data.loginUserinfo
      if (obj.userid) {
        const res = await talentListReq({ userid: obj.userid, tab: index })
        console.log(this.data.talentList, 'talentList');
        this.setData({
          talentList: res.data.data.data,
          total: res.data.data.total
        })

      } else {
        this.setData({
          talentList: []
        })
      }
      this.setData({
        talentList
      })
    },


    async gopath(e) {
      const { url, pathtype = 1, isgologinpath = 2 } = e.currentTarget.dataset

      if (!this.data.isLogin && isgologinpath != 1) {
        return wx.showModal({
          title: "提示",
          content: "请登录",
          confirmColor: "#26BA8D",
          confirmText: "去登陆",
          cancelText: "取消",
          cancelColor: "#000",
          success: (res) => {
            if (res.confirm) {
              app.gopath('/pages/phoneLogin/phoneLogin')
            }
          },
        })
      }
      
      app.gopath(url, pathtype)
    },

    handleCancelClick(e) {
      wx.showModal({
        title: '提示',
        content: '你确定要取消收藏该人才吗?',
        confirmColor: '#26BA8D',
        cancelText: '再想想',
        success: async res => {
          if (res.confirm) {
            console.log(e, 'eee');
            const { id } = e.currentTarget.dataset
            const res = await collectionResume({
              resume_id: id,
              user_id: this.data.loginUserinfo.userid
            })
            console.log(res, 'res');
            if (res.data.code === 1) {
              wx.showToast({
                title: '取消成功',
                icon: 'none'
              });
              this.tabitemClick(2)
            }
          }
        }
      })

    },

    async joinMember(e) {
      let isLogin = await app.showLoginAndEdit()
      if(!isLogin){
        return
      }
      
      const { isvip } = e.currentTarget.dataset
      let res
      if (isvip == 1) {
        res = await PayForVip(2, true)
      } else {
        res = await PayForVip(1)
      }

      console.log(res, 'PayForVip');
      if (res.errMsg == "requestPayment:ok") {
        // 处理支付成功之后的逻辑
        let loginUserinfo = this.data.loginUserinfo
        this.setData({
          loginUserinfo
        })        
      } else {
        wx.showModal({
          title: "提示",
          content: res.errMsg,
          confirmColor: "#26BA8D",
          confirmText: "确定",
          cancelText: "取消",
          cancelColor: "#000"
        })
      }
    },

    async pulldownrefresh() {
      // console.log('pulldownrefresh bossmine');
      this.setData({
        talentList: [],
        loginUserinfo: null,
        currentIndex: 1,
        isLogin: false,
        total: 0
      })
      await this.initLoginuserInfo()
      setTimeout(() => {
        this.setData({
          isTriggerEnd: false
        })
      }, 1000);
    },

    refreshTalentList() {
      this.tabitemClick(this.data.currentIndex)
    },

    logoutit(){
      wx.showModal({
        title: "提示",
        content: "确定要退出登录吗?",
        confirmColor: "#26BA8D",
        confirmText: "确定",
        cancelText: "取消",
        cancelColor: "#000",
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({
              title: '正在退出...'
            })
            setTimeout(() => {
              wx.hideLoading()
              wx.removeStorageSync('loginUserinfo')
              this.setData({
                loginUserinfo: {},
                isLogin: false,
                jl_count: 0,
              })
            }, 1000);
          }
        },
      })
    },
    
    callUs(e){
      const { phone } = e.currentTarget.dataset
      wx.makePhoneCall({
        phoneNumber: phone,
        success: resp => {
          console.log(resp, 'resp');
        },
        fail: err => {
          // 取消
          console.log(err, 'err');
        }
      })
    }

  },
})
