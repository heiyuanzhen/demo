const { contactTalentReq } = require('../../../utils/api/index')

// components/talent-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowstar: {
      type: Boolean,
      default: false
    },
    talent: {
      type: Object,
      default: {}
    },
    havaDelete: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: false
    }
  },

  lifetimes: {
    attached: function() {
      // console.log(this.data.havaDelete, 'this.data.havaDelete');
      // console.log(this.data.isShowstar, 'this.data.isShowstar');
      if (this.data.havaDelete) {
        this.setData({
          scrollContentStyle: 'width: 870rpx;',
          l_info: wx.getStorageSync('loginUserinfo')
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowstar: true,
    scrollContentStyle: '',
    scrollid: 'scrollone',

    // isclickDelete: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancelBtn(e) {
      this.triggerEvent('cancelClick', e)
    },

    srcolldragendEvent(e) {
      console.log(e, 'end');
      let value = e.detail.scrollLeft
      if (value >= 0 && value <= 30) {
        this.setData({
          scrollid: 'scrollone'
        })
      } else if (value > 30 && value <= 60) {
        this.setData({
          scrollid: 'scrolltwo'
        })
      }
    },

    // cancelDelete(){
    //   this.setData({
    //     isclickDelete: true,
    //     scrollContentStyle: ''
    //   })
    // }
    deleteItem(e) {
      const { id } = e.currentTarget.dataset
      this.triggerEvent('deleteEvent', id)
    },
    async deleteItem2(e) {
      console.log(e, 'eee');
      const { id } = e.currentTarget.dataset
      const res = await contactTalentReq({
        user_id: this.data.l_info.userid,
        is_del: 1,
        resume_id: id
      })
      console.log(res, 'id eee');
      this.triggerEvent('refreshTalentList')
        // this.setData({
        //   scrollid: 'scrollone'
        // })
    }

  }
})