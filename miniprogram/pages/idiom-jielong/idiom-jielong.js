const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    score: 0,
    tipNums: 3,
    scrollTop: 0,
    exampleList: [
      {
        "robot": '安富尊荣',
        "user": '荣华富贵',
      }, {
        "robot": '龟鹤遐寿',
        "user": '首当其冲',
      }, {
        "robot": '......',
        "user": '......',
      }
    ],
    list: [],
    robotWord: '',
    lastPinyin: '',
    inputValue: '',
    loading: false,
    showModalStatus: false,
    sending: false,
    isDown: false,
  },

  onLoad: function (options) {
    if (app.globalData.isLogin == 'isLogin') {
      this.setData({
        avatarUrl: app.globalData.avatarUrl
      })
    }

    this.getIdiom('', true)
  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value.trim()
    })
  },

  submitInput() {
    let { inputValue, lastPinyin, list, sending } = this.data

    if (!inputValue) {
      return
    }

    if (sending) {
      return
    }

    this.setData({
      sending: true,
      loading: true
    })

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'idiom2',
        page: 1,
        num: 1,
        condition: {
          word: inputValue
        }
      },
    }).then(res => {
      if (!res.result.data.length) {
        wx.showToast({
          title: '错误',
          image: '/images/warn.png',
          title: '错误的成语',
          duration: 1500
        })
        this.setData({
          sending: false,
          loading: false
        })
      } else {
        let res_data = res.result.data
        let pinyin = res_data[0]._pinyin.split(' ')

        if (pinyin[0] != lastPinyin) {
          wx.showToast({
            title: '错误',
            image: '/images/warn.png',
            title: `首字读音错误`,
            duration: 1500
          })

          this.setData({
            sending: false,
            loading: false
          })
          return false
        } else {
          list[list.length - 1] = {
            "robot": this.data.robotWord,
            "user": inputValue
          }
          this.setData({
            list,
            inputValue: '',
            scrollTop: this.data.scrollTop + 300,
            score: this.data.score + 1,
          })
          wx.setNavigationBarTitle({
            title: `成语接龙-${this.data.score}分`
          })
          if ([1, 2, 4, 6, 10].includes(this.data.score) || this.data.score >= 12) {
            wx.showToast({
              title: '成功',
              image: '/images/zan.png',
              title: `优秀`,
              mask: true,
              duration: 1500
            })
          }
          this.getIdiom(pinyin[pinyin.length - 1])
        }
      }
    })
      .catch(console.error)
  },

  getIdiom(param, flag) {
    wx.showLoading({
      title: '加载中...',
    })

    let { list, robotWord, lastPinyin } = this.data
    let condition = {
      _pinyin: {
        $regex: flag ? '^' + param : '^' + param + ' ',
        $options: 'i'
      }
    }
    let that = this

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'idiom2',
        page: flag ? Math.floor(Math.random() * 2000 + 1) : 1,
        num: 1,
        condition
      },
    }).then(res => {
      if (!res.result.data.length) {
        wx.showToast({
          title: '错误',
          image: '/images/warn.png',
          title: '加载异常',
        })
      } else {
        let res_data = res.result.data
        let pinyin = res_data[0]._pinyin.split(' ')
        list.push({
          "robot": res_data[0].word,
          "user": ''
        })
        setTimeout(() => {
          that.setData({
            list,
            robotWord: res_data[0].word,
            scrollTop: this.data.scrollTop + 300,
            lastPinyin: pinyin[pinyin.length - 1],
            loading: false,
            sending: false
          })

          wx.hideLoading()
        }, 400)
      }
      that.setData({
        isDown: true
      })
    })
      .catch(console.error)
  },

  showModal() {
    this.setData({
      showModalStatus: !this.data.showModalStatus
    })
  },

  bindCancal() {
    this.setData({
      showModalStatus: !this.data.showModalStatus
    })
  },

  getIdiomFromTips() {
    let { tipNums, lastPinyin } = this.data
    if (tipNums) {
      let condition = {
        _pinyin: {
          $regex: '^' + lastPinyin + ' ',
          $options: 'i'
        }
      }
      let that = this

      that.setData({
        inputValue: '请稍等...',
        showModalStatus: false,
        tipNums: --that.data.tipNums
      })

      wx.cloud.callFunction({
        name: 'collection_get',
        data: {
          database: 'idiom2',
          page: 1,
          num: 1,
          condition
        },
      }).then(res => {
        if (!res.result.data.length) {
          wx.showToast({
            title: '错误',
            image: '/images/warn.png',
            title: '无法继续接龙',
          })
        } else {
          let res_data = res.result.data[0]
          that.setData({
            inputValue: res_data.word
          })
        }
      })
        .catch(console.error)
    }
  },

  onShareAppMessage(res) {
    this.setData({
      showModalStatus: false,
      tipNums: ++this.data.tipNums
    })
    return {
      title: `跟我一起挑战最长的成语接龙吧！`,
      path: `pages/find/find`,
      imageUrl: '/images/jielong.jpg',
    }
  },

})