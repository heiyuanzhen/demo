const app = getApp().rencaiApp
const {
  getJobListReq,
  getJobHuntingReq,
  getBanner
} = require('../../../utils/api/reqTalent')
const {
  Query
} = require('../../../utils/index')
let query = new Query()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    vHeight: {
      type: String,
      value: '',

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    postItems: [],
    isShowGoTop: false,
    isTriggerEnd: true,
    currentPage: 1,
    currentIndex: 1,
    total: 0, 
    isShowCancelQuery: false,
    loadingText: '暂无更多',
    currentJobhuntingIndex: 1,
    banner: [],
    // poster: true
  },


  lifetimes: {
    attached: async function () {
      await this.getjobhuntings()
      await this.getJobList()
      await this.getBanner()

    },
    detached: function () {
      query.clear()
    },
  },
  pageLifetimes: {
    show: async function () {
      this.setData({
        isShowCancelQuery: query.isNull() ? false : true,
        userinfo: wx.getStorageSync('loginUserinfo')
      })
      // 有筛选条件, 发起请求
      if (this.data.isShowCancelQuery) {
        this.setData({
          currentPage: 1
        })
        this.getJobList(query.get())
      }
      // else {
      // await this.getJobList()
      // }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    async getjobhuntings() {
      const res = await getJobHuntingReq({
        userid: wx.getStorageSync('loginUserinfo').userid
      })
      console.log(res, "res1111")
      if (res.data.code === 1) {
        let list = res.data.data
        this.setData({
          jobhuntings: list.splice(0, 3)
        })
      } else {
        this.setData({
          jobhuntings: []
        })
      }
    },
    async getBanner() {
      const res = await getBanner({
        is_boss: 2
      })
      console.log(res, "banner图信息")
      if (res.data.code == 1) {
        this.setData({
          banner: res.data.data
        })
      }
    },

    goVip() {
      wx.navigateTo({
        url: '/pages/ARencaiduan/seasoncardOpened/seasoncardOpened',
      })
    },
    // activeClose() {
    //   this.setData({
    //     poster: false
    //   })
    // },

    searchPost(e) {
      // console.log(.log(e, 'eee');
      this.setData({
        currentPage: 1
      })
      query.set({
        keyword: e.detail.detail.value
      })
      let data = query.get()
      this.getJobList(data)
    },

    async gopath(e) {
      let isLogin = await app.showLoginAndEdit()
      if (!isLogin) {
        return
      }

      const {
        url,
        id
      } = e.currentTarget.dataset
      // console.log(.log(url, id, 'url id');
      let subString = url
      if (id) {
        subString = `${url}?id=${id}`
      }
      app.gopath(subString)
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

    pulldownrefresh() {
      this.setData({
        postItems: [],
        currentIndex: 1,
        currentPage: 1,
        total: 0,
        scrolltopValue: 0,
        loadingText: '暂无更多...',
        isShowCancelQuery: false
      })
      this.getJobList()
      setTimeout(() => {
        this.setData({
          isTriggerEnd: false
        })
      }, 1000);
    },

    async getJobList(querySync = {}) {

      this.setData({
        loadingText: '正在加载,稍等片刻...'
      })
      wx.showLoading({
        title: '加载中...'
      })

      let data = Object.assign({
        page: this.data.currentPage,
        index: this.data.currentIndex,
        userids: wx.getStorageSync('loginUserinfo').userid ? wx.getStorageSync('loginUserinfo').userid : ''
      }, querySync)

      try {
        const res = await getJobListReq(data)
        // console.log(.log(res, 'res');

        if (res.data.code === 1) {
          let list = res.data.data.data || []
          list.forEach(item => {
            let time = item.edittime.split(' ')
            item.edittime = time[0]
          })
          let i = this.data.currentPage
          console.log(list, 'list');
          this.setData({
            postItems: i == 1 ? list : [...this.data.postItems, ...list],
            total: res.data.data.total || 0
          })
        }

      } catch (error) {
        console.log(error, 'error');
        this.setData({
          postItems: [],
          total: 0
        })
      }

      wx.hideLoading()
      this.setData({
        loadingText: '暂无更多...'
      })
    },

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
      this.getJobList(data)
      this.setData({
        loadingText: ''
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
      this.getJobList(data)

    },

    cancelQuery() {
      this.setData({
        isShowCancelQuery: false
      })
      query.clear()
      this.getJobList(query.get())
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
      await this.getJobList(query.get())
      wx.hideLoading()

    }

  }
})