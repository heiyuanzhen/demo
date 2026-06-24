import {
  uploadgai
} from '../../utils/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    editorHeight: {
      type: Number,
      value: 200
    },
    value: {
      type: String,
      value: '',
      // observer: function (value) {
      //   const query = wx.createSelectorQuery().in(this)
      //   query.select("#editorid").context((res1) => {
      //   // query.select(`#${this.data.editorid}`).context((res1) => {
      //     res1.context.setContents({
      //       html: value
      //     })
      //   }).exec()
      // }
    },
    isEdit: {
      type: Boolean,
      value: true, // 这个值为false说明只需要回显,为true富文本就是编辑状态
    },
    isScroll: {
      type: Boolean,
      value: true
    },
    isUploadImage: {
      type: Boolean,
      value: true
    },
    editorid: {
      type: String,
      value: 'editor'
    },
    isPagetop: {
      type: Boolean,
      value: false
    },
    width: {
      type: String,
      value: '100%'
    },
    isToolbar: {
      type: Boolean,
      value: true
    },
    placeholder: {
      type: String,
      value: '请输入'
    }
  },
  // 数据监听
  observers: {
    ['value'](newval, oldval) {
      console.log(newval, 'newval111111111111');
      // this.setValue(newval)
      // this.setData({
      //   _value: newval
      // })
      this.onEditorReady(newval)
      this.setValue(newval)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIOS: null,
    keyboardHeight: 0,
    content: '',
    _value: '',
    timer: null
  },


  lifetimes: {
    attached: function () {
      const platform = wx.getSystemInfoSync().platform
      this.setData({
        isIOS: platform === 'ios' ? true : false
      })
      console.log(this.data.value, 'value');
      // console.log(this.data.isEdit);
      // this.setValue(this.data._value)
      // this.setData({
      //   edotirid: Date.now()
      // })
    },
    detached: function () {

    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    readyEditor() {
      wx.createSelectorQuery().select('#editorid').context((res) => {
        this.editorCtx = res.context
        this.editorCtx.setContents({
          html: value
        });
      }).exec()
    },

    format(e) {
      console.log(e, "form触发事件")

      let {
        name,
        value
      } = e.target.dataset
      if (!name) return
      const query = wx.createSelectorQuery().in(this)
      // console.log(this.data.editorid, 'this.data.editorid');
      query.select("#editorid").context((res) => {
        console.log(res, "富文本比剪辑")
        res.context.format(name, value)
      }).exec()
    },
    getNetURL(src, res1) {
      let commonSrc = ''

      uploadgai({
        file: src
      }, function (ret) {
        commonSrc = ret
        console.log(ret, '上传成功');
        res1.context.insertImage({
          src: commonSrc,
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }, null);

    },
    insertImage: function () {
      wx.showLoading()
      const query = wx.createSelectorQuery().in(this)
      query.select("#editorid").context((res1) => {
        wx.chooseImage({
          success: (res) => {
            console.log(res, 'res222')
            this.getNetURL(res.tempFilePaths[0], res1)
          },
          fail: (err) => {
            console.log(err, 'err');
          }
        })
      }).exec()

    },
    onStatusChange(e) {
      // console.log(e, 'eee1');
    },
    editorIpt: function (e) {
      //解决编辑器光标跳转首字的问题存入缓存
      console.log(e, 'eee富文本编辑器内容');
      wx.setStorageSync('editorText', e.detail.html)
      // if (this.data.timer) {
      //   clearTimeout(this.data.timer)
      // }
      // let newtimer = setTimeout(() => {
      //   // return
      //   this.triggerEvent('editorChange', e)
      //     // this.setData({
      //     //   value: e.detail.value
      //     // })
      // }, 4000)
      // this.setData({
      //   timer: newtimer
      // })
      // this.triggerEvent('editorChange', e)
    },
    setValue(value) {
      const query = wx.createSelectorQuery().in(this)
      query.select("#editorid").context((res1) => {
      // query.select(`#${this.data.editorid}`).context((res1) => {
        res1.context.setContents({
          html: value
        })
      }).exec()
    },
    touchmove() {
      return
    },
    onEditorReady(value) {
      // const query = wx.createSelectorQuery().in(this)
      // query.select("#editorid").context((res1) => {
      //   res1.context.setContents({
      //     html: value
      //   })
      // }).exec()
      if (this.data.isPagetop) {
        this.triggerEvent('pagetop',"#editorid")
      }
    }
  },

})