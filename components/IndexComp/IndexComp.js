const app = getApp().rencaiApp

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // search栏相关
    type: {
      type: String,
      default: 'search'
    },
    title: {
      type: String,
      default: '您想找纺织人才吗'
    },
    placeholder: {
      type: String,
      default: '搜索岗位'
    },
    
    // tabitem相关
    // 是否展示取消按钮
    isShowCancelQuery: {
      type: Boolean,
      default: false,
      observer: (newval) => {
        console.log(newval, 'newval');
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // search栏相关
    searchTalent(e){
      console.log(e, 'indecomp');
      this.triggerEvent('handlesearch', e)
    },
    closeClick(e){
      console.log('eee');
      this.setData({
        keyword: ''
      })
      console.log(e, 'eee');
      this.triggerEvent('handlesearch', e)
    }

  }
})
