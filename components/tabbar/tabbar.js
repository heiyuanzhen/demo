const app = getApp().rencaiApp

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isBoss: {
      type: String,
      default: 1,
      observer: function(newVal) {
        if (newVal == 1) {
          this.setData({
            tabbarList: [{
              icon: "../../images/footbar/tab_home.png",
              icon_on: "../../images/footbar/tab_home_pre.png",
              page: "pages/index/index",
              text: "人才信息"
            },
            {
              icon: "../../images/footbar/cyj333.png",
              icon_on: "../../images/footbar/cyj222.png",
              page: "pages/mine/mine",
              text: "我的"
            }]
          })
        }else{
          this.setData({
            tabbarList: [{
              icon: "../../images/footbar/zp.png",
              icon_on: "../../images/footbar/zp_on.png",
              page: "pages/mine/mine",
              text: "招聘大厅"
            }, {
              icon: "../../images/footbar/cyj333.png",
              icon_on: "../../images/footbar/cyj222.png",
              page: "pages/index/index",
              text: "我的"
            }]
          })
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbarList: [],
    currentTabIndex: 1
  },
  
  lifetimes: {
    attached: function () {
      this.getTabbarHeight()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickTabbar(e) {

      if (e.isFromLogin) {
        this.setData({
          currentTabIndex: e.index
        })
        return
      }

      const { index, page } = e.currentTarget.dataset
      console.log(page, 'page');
      this.setData({
        currentTabIndex: index + 1
      })
      this.triggerEvent('clicktabbar', e)
    },

    
    getTabbarHeight(){
      const query = wx.createSelectorQuery().in(this)
      query.select("#tabbarContainer").boundingClientRect(res=>{
        app.globalData.tabbarHeight = res.height
      }).exec()
    },
  }
})
