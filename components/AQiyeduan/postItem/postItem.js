

const app = getApp().rencaiApp

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    postItem: {
      type: Object,
      value: {}
    },
    isEdit: {
      type: Boolean,
      value: false
    },
    isstop: {
      type: Boolean,
      value: false
    },
    isDelete: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  // pageLifetimes: {
  //   show: async function() {
  //     console.log(this.data.postItem, 'positiem,');
  //   },
  // },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoEdit(e) {
      const { id } = e.currentTarget.dataset
      app.gopath('/pages/AQiyeduan/addPost/addPost?id=' + id)
    },
    deleteItem(e){
      const { id } = e.currentTarget.dataset
      this.triggerEvent('deleteEvent', id)
    },
    deleteItem2(e){
      const { id } = e.currentTarget.dataset
      wx.showModal({
        title: "提示",
        content: "确认要删除吗",
        confirmColor: "#26BA8D",
        confirmText: "删除",
        cancelText: "再想想",
        cancelColor: "#000",
        success: async (res) => {
          if (res.confirm) {
            const resp = await deleteZpingReq({job_id: id})
            if (resp.data.code === 1) {
              app.toast('删除成功!')
            }
          }
        },
      })
    },
  }
})
