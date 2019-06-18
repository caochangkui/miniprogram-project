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
    list: [
      // {
      //   "robot": '胸有成竹',
      //   "user": '竹报平安',
      // },{
      //   "robot": '安富尊荣',
      //   "user": '荣华富贵',
      // }
    ],
    robotWord: '', // 机器人最后一次给出的成语
    lastPinyin: '', // 成语最后一字的读音
    inputValue: '',
    loading: false,
    showModalStatus: false,
    sending: false, // 提交中，禁止重复提交
    isDown: false, // 页面是否请求结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

    // 防止用户连续提交
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
      if (!res.result.data.length) { // 没搜索到
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

  // 从idiom2数据库拿一个成语, flag为true表示第一次进入
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
      if (!res.result.data.length) { // 没搜索到
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

  // 提示 动画效果
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
        if (!res.result.data.length) { // 没搜索到
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


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let { score, list } = this.data
    if (app.globalData.isLogin != 'isLogin') {
      return;
    } else {
      let openid = app.globalData.openid
      let avatarUrl = app.globalData.avatarUrl
      let username = app.globalData.username
      const db = wx.cloud.database()
      let that = this

      db.collection('idiom_jielong').where({
        _openid: openid,
        _id: 'history' + openid
      }).get({
        success: res => {
          if (!res.data.length) { // 如果之前没做过接龙
            let historyList = []
            let scoreList = []
            historyList.unshift(list)
            scoreList.unshift(score)

            db.collection('idiom_jielong').add({
              data: {
                _id: 'history' + openid,
                description: 'history',
                avatarUrl,
                username,
                score: scoreList,
                historyList
              }
            }).then(res => {
              console.log('第一次接龙时，添加记录：', res)
            })

            // 更新排行榜
            that.updateRankingList(Math.max(...scoreList), username, avatarUrl)

          } else {
            let historyList = res.data[0].historyList
            let scoreList = res.data[0].score
            let username = res.data[0].username
            let avatarUrl = res.data[0].avatarUrl
            historyList.unshift(list)
            scoreList.unshift(score)

            db.collection('idiom_jielong').doc('history' + openid).update({
              data: {
                score: scoreList,
                historyList
              }
            }).then(res => {
              console.log('已有接龙记录时，更新记录：', res)
            })

            // 更新排行榜
            that.updateRankingList(Math.max(...scoreList), username, avatarUrl)
          }
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    }
  },

  updateRankingList(score, username, avatarUrl) {
    let openid = app.globalData.openid
    const db = wx.cloud.database()
    db.collection('idiom_jielong').doc('ranking-list').get({
      success: res => {
        let rankingList = res.data.rankingList
        let index = -1
        rankingList.map((val, i) => {
          if (val.openid == openid) {
            index = i
          }
        })
        if (index >= 0) {
          rankingList[index] = {
            openid,
            username,
            avatarUrl,
            score
          }
        } else {
          rankingList.push({
            openid,
            username,
            avatarUrl,
            score
          })
        }

        wx.cloud.callFunction({
          name: 'collection__jielong_update',
          data: {
            database: 'idiom_jielong',
            id: 'ranking-list',
            data: {
              rankingList
            }
          },
        }).then(res => {
          console.log('更新接龙排行榜：', res)
        })
          .catch(console.error)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },


})