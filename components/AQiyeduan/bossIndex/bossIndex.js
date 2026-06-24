const {
  talentListReq
} = require("../../../utils/api/index");
const {
  getJobListReq,
  getBanner,
  contactJobReq
} = require("../../../utils/api/reqTalent");
const {
  Query,
  searchNameWithid,
  Addpost
} = require('../../../utils/index')

const app = getApp().rencaiApp
let query = new Query()
let addpost = new Addpost()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    vHeight: {
      type: String,
      value: '',
      observer: function (newval) {
        console.log(newval, 'newval');
      }
    },

    currentTabbarIndex: {
      type: String | Number,
      value: '1',
      observer: async function (newval) {
        // 页面加载事件 比onShow要好的地方就是 点击tabbar切换的时候，这个也会加载 而pageLifetimes onshow不会
        if (newval == 1) {}
        console.log(newval, 'newval');
      }
    },
    is_first: {
      type: String,
      value: ""
    }

  },
  

  externalClasses: ['index-class'],

  /**
   * 组件的初始数据
   */
  data: {
    talents: [],
    currentIndex: 1,
    currentPage: 1,
    total: 0,
    isShowGoTop: false,
    scrolltopValue: 0,
    loadingText: '暂无更多',
    isShowCancelQuery: false,
    isTriggerEnd: true,
    currentJobhuntingIndex: 1,
    showLogo: true,
    current: 0,
    is_show_tehui: false,
    // poster: true
  },

   


  lifetimes: {
    attached: async function () {
      await this.initLoginuserinfo()
      // await this.getTalents()
      await this.getjobhuntings()
      await this.getBanner()
      //判断12月8号到18号才展示
      let time = new Date().getTime()
      if(time <= 1671379140000){
        this.setData({
            is_show_tehui: true
          })
      }
    },
    detached: function () {
      // query.clear()
    },
  },

  pageLifetimes: {
    show: async function () {

      this.setData({
        isShowCancelQuery: query.isNull() ? false : true,
        userinfo: wx.getStorageSync('loginUserinfo') || {}
      })
      // 有筛选条件, 发起请求
      // if (!query.isNull()) {
      //   this.setData({
      //     currentPage: 1
      //   })
      //   await this.getTalents(query.get())
      // } else {
      await this.getTalents(query.get())
      // }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getjobhuntings() {
      const res = await getJobListReq({
        username: this.data.userinfo.username
      })

      if (res.data.code === 1) {
        let list = res.data.data.data
        console.log(list, 'list');
        this.setData({
          jobhuntings: list
        })
      } else {
        this.setData({
          jobhuntings: []
        })
      }
    },
    swiperCurrentchang(e) {
      console.log(e, '获取current')
      let {
        current
      } = e.detail
      this.setData({
        current
      })

    },
    async getBanner() {
      const res = await getBanner({
        is_boss: 1
      })
      console.log(res, "banner图信息")
      if (res.data.code == 1) {
        if (res.data.code == 1) {
          this.setData({
            banner: res.data.data
          })
        }
      }
    },

    async initLoginuserinfo() {
      await app.initData()

      let obj = wx.getStorageSync('loginUserinfo') || {}
      this.setData({
        userinfo: obj,
        isLogin: obj.userid ? true : false
      })
    },

    gopath(e) {
      const {
        url,
        id
      } = e.currentTarget.dataset
      console.log(url, id, 'url id');
      let subString = url
      if (id) {
        subString = `${url}?id=${id}`
      }
      app.gopath(subString)
    },

    async getTalents(querySync = {}) {
      this.setData({
        loadingText: '正在加载,稍等片刻...'
      })
      let data = Object.assign({
        page: this.data.currentPage,
        index: this.data.currentIndex,
        userid: wx.getStorageSync('loginUserinfo').userid ? wx.getStorageSync('loginUserinfo').userid : ''
      }, querySync)
      const res = await talentListReq(data)
      console.log(res, 'res');

      if (res.data.code === 1) {
        try {
          let list = res.data.data.data || []
          list.forEach(item => {
            if (!this.data.userinfo || this.data.userinfo.isVip != 1) {
              if (item && item.isgoumai != 1) {
                item.truename = item.truename.substring(0, 1) + '**'
              }
            }

            let time = item.edittime.split(' ')
            item.edittime = time[0]
          })
          let i = this.data.currentPage
          this.setData({
            talents: i == 1 ? list : [...this.data.talents, ...list],
            total: res.data.data.total || 0
          })
        } catch (error) {
          console.log(error, 'error');
          this.setData({
            talents: [],
            total: 0
          })
        }
      }

      this.setData({
        loadingText: '暂无更多'
      })
    },

    tabItemClick(e) {
      const {
        index
      } = e.currentTarget.dataset
      if (this.data.currentIndex == index) {
        // 避免重复点击
        return
      }
      this.setData({
        currentIndex: index,
        currentPage: 1
      })
      query.set({
        type: index
      })
      let data = query.isNull() ? {} : query.get()
      this.getTalents(data)

    },

    toggleDialogShow() {
      this.setData({
        showLogo: false
      })
    },
    //关闭特惠弹窗
    closeTehuiShow() {
        this.setData({
            is_show_tehui: false
        })
      },
    goVip() {
      wx.navigateTo({
        url: '/pages/ARencaiduan/seasoncardOpened/seasoncardOpened',
      })
    },
    goTehuiVip() {
        wx.navigateTo({
          url: '/pages/ARencaiduan/preferentialPay/preferentialPay',
        })
      },
    // activeClose() {
    //   this.setData({
    //     poster: false
    //   })
    // },





    scrolltolower() {
      let isBottom
      if (this.data.total <= this.data.currentPage * 10) {
        isBottom = true
      }
      if (isBottom) {
        return
      }
      this.setData({
        currentPage: this.data.currentPage + 1,
      })
      let data = query.isNull() ? {} : query.get()
      this.getTalents(data)
      this.setData({
        loadingText: ''
      })
    },

    scrollView(e) {
      const {
        scrollTop
      } = e.detail

      if (scrollTop > 500 && !this.data.isShowGoTop) {
        this.setData({
          isShowGoTop: true
        })
        // 触发一个事件 隐藏底部tabbar
        this.triggerEvent('toggleTabbar', false)
      }

      if (scrollTop < 300 && this.data.isShowGoTop) {
        this.setData({
          isShowGoTop: false
        })
        this.triggerEvent('toggleTabbar', true)
      }
    },

    scrollTop() {
      this.setData({
        scrolltopValue: 0
      })
    },

    cancelQuery() {
      this.setData({
        isShowCancelQuery: false
      })
      query.clear()
      this.getTalents(query.get())
    },

    searchPost(e) {
      console.log(e, 'eee');
      this.setData({
        currentPage: 1
      })
      query.set({
        keyword: e.detail.detail.value
      })
      let data = query.get()
      this.getTalents(data)
    },

    pulldownrefresh() {
      this.setData({
        talents: [],
        currentIndex: 1,
        currentPage: 1,
        total: 0,
        isShowGoTop: false,
        scrolltopValue: 0,
        loadingText: '暂无更多',
        isShowCancelQuery: false
      })
      this.getTalents()
      setTimeout(() => {
        this.setData({
          isTriggerEnd: false
        })
      }, 1000);
    },

    async clickJobhuntingIndex(e) {
      const {
        index,
        id
      } = e.currentTarget.dataset
      this.setData({
        currentJobhuntingIndex: index
      })
      query.set({
        jobhunt_id: id
      })
      wx.showLoading({
        title: '加载中...'
      })
      setTimeout(() => {
        wx.hideLoading()
      }, 5 * 1000);
      await this.getTalents(query.get())
      wx.hideLoading()

    }


  }
})