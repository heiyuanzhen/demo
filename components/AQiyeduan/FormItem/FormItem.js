let ASCRECT_KEY = 'dfsfsddfsd56f8we9rwerew'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String | Array | Number,
      value: '',
      observer: function (newval) {
        // console.log(newval, 'newval');
      }
    },
    type: {
      type: String,
      value: 'text'
    },
    istype: {
      type: Boolean,
      value: true
    },
    label: {
      type: String,
      value: '文本'
    },
    placeholder: {
      type: String,
      value: '请输入文本'
    },
    isRequire: {
      type: Boolean,
      value: true
    },
    styleStr: {
      type: String,
      value: 'width: 320rpx;'
    },
    level: {
      type: String,
      value: 'one'
    },
    rangeArr: {
      type: Array,
      value: [{
        name: '行1数',
        id: 1
      },
      {
        name: '行2数',
        id: 2
      },
      {
        name: '行3数',
        id: 3
      },
      {
        name: '行4数',
        id: 4
      },
      {
        name: '行5数',
        id: 5
      },
      {
        name: '行6数',
        id: 6
      },
      {
        name: '行7数',
        id: 7
      },
      {
        name: '行8数',
        id: 8
      },
      {
        name: '行9数',
        id: 9
      },
      {
        name: '行10数',
        id: 10
      },
      ],
      observer: function (newval) {
        this.setData({
          normalRangeArr: newval
        })
        // console.log(this.data.normalRangeArr, 'normalRangeArr');
        // console.log(this.data.oneLevelId, 'oneLevelId');

        if (this.data.oneLevelId) {
          // console.log(this.data.normalRangeArr, 'this.data.normalRangeArr');
          let index = this.data.normalRangeArr.findIndex(e => e.id == this.data.oneLevelId)
          this.setData({
            index
          })
        }

      }
    },
    // 组件是否在筛选页面显示 false 则是在selectQuery 页面显示, 否则 就是在addPost页面显示
    fw: {
      type: Boolean,
      value: false
    },
    rangerObj: {
      type: Object,
      value: {},
      observer: function (newval) {
        // 模拟有三级的数据
        // console.log('rangerObj', newval);

        if (newval && newval.length > 0) {
          newval.forEach((item1) => {
            item1.child.forEach((item2) => {
              // 如果三级数组长度为空，则添加一些mock数据
              if (!item2.child || item2.child.length == 0) {
                item2.child = [{
                  catname: "",
                  catid: ASCRECT_KEY
                },]
              }

            })
          });
        }

        this.setData({
          rangeArr: newval || []
        })
        if (this.data.rangeArr && this.data.rangeArr.length > 0) {
          let threelevel = [
            [],
            [],
            []
          ]
          let range = [...this.data.rangeArr]
          range.forEach(item => {
            let arr = threelevel[0]
            arr.push(item.catname)
          })
          range[0].child.forEach(item => {
            let arr = threelevel[1]
            arr.push(item.catname)
          })
          range[0].child[0].child.forEach(item => {
            let arr = threelevel[2]
            arr.push(item.catname)
          })
          // console.log(threelevel, 'threelevel');
          this.setData({
            threelevel
          })
        }

      }
    },

    key: {
      type: String,
      value: ''
    },

    threeLevelLabel: {
      type: String,
      value: '',
      observer: function (newval) {
        if (newval) {
          this.setData({
            selectText: newval.split(',')
          })
        }
      }
    },

    threeLevelValue: {
      type: String,
      value: '',
      observer: function (newval) {
        if (newval) {
          this.setData({
            selectValue: newval.split(',')
          })
        }
      }
    },

    oneLevelId: {
      type: String | Number,
      value: '',
      observer: function (newcal = '') {
        if (newcal !== '' && this.data.normalRangeArr) {
          // console.log(this.data.normalRangeArr, 'this.data.normalRangeArr');
          let index = this.data.normalRangeArr.findIndex(e => e.id == newcal)
          this.setData({
            index
          })
        }
      }
    },

    address: {
      type: Array | String,
      value: [],
      observer: function (newval) {
        if (typeof newval == 'string') {
          this.setData({
            region: newval.split(',')
          })
        } else if (typeof newval == 'array') {
          this.setData({
            region: newval
          })
        } else {
          console.log(newval, 'newval');
          this.setData({
            region: []
          })
        }

        console.log(this.data.region, 'region');
      }
    },

    birthday: {
      type: String,
      value: '2000-11-11',
    },

    textRight: {
      type: String,
      value: ''
    },

    editorid: {
      type: String,
      value: 'editor'
    },

    minsalary: {
      type: Number | String,
      value: ''
    },
    maxsalary: {
      type: Number | String,
      value: ''
    },


  },

  /**
   * 组件的初始数据
   */
  data: {
    selectValue: [],
    index: '',
    selectText: [],
    threelevel: [],
    onelevel: 0,
    twolevelValue: '',
    customItem: '不限',
    normalRangeArr: [],
    region: [],
    isboss: '',
  },

  lifetimes: {
    attached: async function () {
      let isboss = wx.getStorageSync('isBoss')

      this.setData({
        isboss: isboss
      })
    },
    detached: function () {


    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    pickerChange(e) {
      // console.log(e, 'eee');
      let index = parseInt(e.detail.value)
      // console.log(index, 'index');
      this.setData({
        selectValue: this.data.rangeArr[index].id,
        index
      })
      e.detail.value = this.data.selectValue
      this.triggerEvent('twolevelPickerChange', e)
    },

    handleArray(arr) {
      let initArr = []
      arr.forEach(item => {
        initArr.push(item.catname)
      })
      return initArr
    },

    bindRegionChange(e) {
      console.log(e, 'eee');
      this.setData({
        region: e.detail.value || []
      })
      let item = this.data.region;
      // console.log(item, 'itemd');
      this.triggerEvent('addresschange', item)

    },
    pickerColumnChange(e) {
      // 逻辑 只需要加载他的子类即可不需要setData value 的操作
      const {
        column,
        value
      } = e.detail
      // console.log(column, value);
      switch (column) {
        case 0:
          // 一级的picker 变化
          // this.onePickerChange(value)
          let rangeArr = this.data.rangeArr
          let threelevel = this.data.threelevel
          // console.log(rangeArr, 'arr');
          // threelevel[1] = this.data.rangeArr
          break;
        case 1:
          // 二级的picker变化
          this.twoPickerChange(value)
          break;
        case 2:
          // 二级的picker变化
          this.threePickerChange(value)
          break;
        default:
          break;
      }


    },

    onePickerChange(value) {
      // // console.log(value, 'value');
      let threelevel = this.data.threelevel

      let otherClass = this.data.rangeArr[value].child.length > 0 ? true : false
      if (!otherClass) {
        let oneText = this.data.rangeArr[value].catname
        let oneValue = this.data.rangeArr[value].catid
        threelevel[1] = []
        threelevel[2] = []
        this.setData({
          selectText: [oneText, '', ''],
          selectValue: [oneValue, '', ''],
          threelevel
        })
        return
      }

      let threelevelInit = this.data.threelevel
      // let arrInit = []
      // childInit.forEach(item => {
      //   arrInit.push(item.catname)
      // })

      let childList = this.data.rangeArr[value].child
      // let arr = []
      // childList.forEach(item => {
      //   arr.push(item.catname)
      // })
      threelevel[1] = this.handleArray(childList)
      let childInit = this.data.rangeArr[value].child[0].child || []
      threelevelInit[2] = this.handleArray(childInit)

      this.setData({
        threelevel: threelevelInit,
        onelevel: value
      })

      // let oneText = this.data.rangeArr[value].catname
      // let oneValue = this.data.rangeArr[value].catid
      // let twoText, twoValue, threeText, threeValue

      // try {
      //   twoText = this.data.rangeArr[value].child[0].catname
      //   twoValue = this.data.rangeArr[value].child[0].catid

      //   threeText = this.data.rangeArr[value].child[0].child[0].catname
      //   threeValue = this.data.rangeArr[value].child[0].child[0].catid
      // } catch (error) {
      //   twoText = ''
      //   twoValue = ''
      //   threeText = ''
      //   threeValue = ''
      // }

      // this.setData({
      //   threelevel,
      //   selectText: [oneText, twoText, threeText],
      //   selectValue: [oneValue, twoValue, threeValue]
      // })
      // // console.log(this.data.selectText, 'selectText');
      // // console.log(this.data.selectValue, 'selectValue');
    },
    twoPickerChange(value) {
      let childList = this.data.rangeArr[this.data.onelevel].child[value].child
      // // console.log(childList, 'childList');
      let arr = []
      childList.forEach(item => {
        arr.push(item.catname)
      })

      let threelevel = this.data.threelevel
      threelevel[2] = arr

      // // console.log(threelevel, 'threelevel');

      this.setData({
        threelevel,
        twolevelValue: value,
      })

      // let onelevelList = this.data.rangeArr[this.data.onelevel]
      // let oneText = onelevelList.catname
      // let oneValue = onelevelList.catid
      // let twoText, twoValue, threeText, threeValue

      // try {
      //   twoText = onelevelList.child[value].catname
      //   twoValue = onelevelList.child[value].catid

      //   threeText = onelevelList.child[value].child[0].catname
      //   threeValue = onelevelList.child[value].child[0].catid
      // } catch (error) {
      //   twoText = ''
      //   twoValue = ''
      //   threeText = ''
      //   threeValue = ''
      // }

      // this.setData({
      //   threelevel,
      //   twolevelValue: value,
      //   selectText: [oneText, twoText, threeText],
      //   selectValue: [oneValue, twoValue, threeValue]
      // })
      // // console.log(this.data.selectText, 'selectText');
      // // console.log(this.data.selectValue, 'selectValue');
    },

    bindMultiPickerColumnChange(e) {
      const {
        column,
        value
      } = e.detail
      switch (column) {
        case 0:
          // 一级的picker 变化
          this.onePickerChange(value)
          break;
        case 1:
          // 二级的picker变化
          this.twoPickerChange(value)
          break;
        case 2:
          // 三级的picker变化
          // this.threePickerChange(value)
          break;
        default:
          break;
      }

    },

    threePickerChange(value) {
      // console.log(value, 'eee');
      let obj = this.data.rangeArr[this.data.onelevel].child[this.data.twolevelValue].child[value]
      let sV = this.data.selectValue
      let sT = this.data.selectText
      // sV[2] = obj.catid
      // sT[2] = obj.catname

      // this.setData({
      //   selectValue: sV,
      //   selectText: sT
      // })
      // console.log(sV, sT);

    },

    threeLevelPickerChange(e) {
      // console.log(e.detail.value, 'eee');
      // 根据下标找到对应的 Catid
      let indexOne = e.detail.value[0]
      let indexTwo = e.detail.value[1]
      let indexThree = e.detail.value[2]
      let rangeArr = this.data.rangeArr

      let selectOneItem = rangeArr[indexOne]
      let selectTwoItem = rangeArr[indexOne].child[indexTwo]
      let selectThreeItem = rangeArr[indexOne].child[indexTwo].child[indexThree]

      this.setData({
        selectText: [selectOneItem.catname, selectTwoItem.catname, selectThreeItem.catname],
        selectValue: [selectOneItem.catid, selectTwoItem.catid, selectThreeItem.catid]
      })

      // console.log(this.data.selectText,this.data.selectValue,'selectText,selectValue');




      // console.log(this.data.selectText);
      // console.log(this.data.selectValue);
      let valuePass = this.data.selectValue.filter(item => item)
      let pass = valuePass[valuePass.length - 1]
      if (pass == ASCRECT_KEY) {
        pass = valuePass[valuePass.length - 2]
      }

      // 初次点击给一个默认值
      if (!pass) {
        let oneIndex = e.detail.value[0]
        let catid = this.data.rangeArr[oneIndex].catid
        // console.log(catid);
        pass = catid
        this.setData({
          selectText: ['营销类'],
          selectValue: [77]
        })
      }
      this.triggerEvent('threeLevelPickerChange', pass)
    },

    InputTextChange(e) {

      this.triggerEvent('InputTextChange', e)
    },

    dateChange(e) {
      console.log(e, 'eee');
      this.setData({
        birthday: e.detail.value
      })
      this.triggerEvent('birthdayChange', e)

    },


    editorChange(e) {
      // console.log(this.data.key, e);
      this.triggerEvent('editorChange', e)

    },
    textareaChange(e) {
      this.triggerEvent('textareaChange', e)
    },


  }
})