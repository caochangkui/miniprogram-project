// miniprogram/pages/detail/detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    currentData: 0, // 选项卡
    detail: {},
    thisIndex: -1,
    page: 1, // 页码
    num: 1, // 每页展示个数
    logged: false,
    openid: '',
    isCollect: false, // 菜品是否已收藏
    isDown: false, // 是否完全加载
    loading: false, // 是否正在加载
    isExist: true, // 此诗词是否存在
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let isLogin = app.globalData.isLogin

    console.log('用户是否授权：', app.globalData.isLogin)
    console.log('是否已有用户openId：', app.globalData.openid)

    this.setData({
      id: options.id
    })

    this.setData({
      logged: isLogin ? true : false
    })

    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

    if (options.id) {
      wx.setStorageSync('shareId', options.id)
      this.loadDetail(options.id) // 加载详情
    }

    if (isLogin) {
      this.getcollect(options.id) // 获取收藏菜品，并判断是否已收藏
    }
  },

  // 登录授权
  onGetUserInfo(e) {
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          logged: true,
          avatarUrl: e.detail.userInfo.avatarUrl,
          username: e.detail.userInfo.nickName,
        })

        wx.setStorageSync('isLogin', 'isLogin')
        wx.setStorageSync('avatarUrl', this.data.avatarUrl)
        wx.setStorageSync('username', this.data.username)
        app.globalData.isLogin = wx.getStorageSync('isLogin')
        app.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
        app.globalData.username = wx.getStorageSync('username')

        this.getcollect(this.data.id)
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  // 收藏
  bindCollect() {
    const db = wx.cloud.database()
    let that = this

    wx.showLoading({
      title: '收藏中...',
    })

    // 查看是否有收藏记录
    db.collection('shici_collection').where({
      _openid: this.data.openid,
      _id: 'collect' + this.data.openid
    }).get({
      success: res => {
        let like = that.data.detail // 需要收藏的菜品

        if (!res.data.length) { // 如果从未收藏
          console.log(' 从未收藏')
          let detailArray = []
          detailArray.push(like)
          db.collection('shici_collection').add({
            data: {
              _id: 'collect' + that.data.openid,
              description: 'like',
              username: app.globalData.username,
              collectList: detailArray
            }
          }).then(res => {
            console.log('收藏成功，', res)
            wx.showToast({
              icon: '收藏',
              title: '收藏成功',
            })
            that.setData({
              isCollect: true
            })
          }).catch(err => {
            wx.showToast({
              title: '错误',
              image: '/images/warn.png',
              title: '收藏失败',
            })
          })
        } else { // 如果已有收藏记录
          console.log('已有收藏记录')
          let detailArray = res.data[0].collectList
          detailArray.push(like)

          db.collection('shici_collection').doc('collect' + that.data.openid).update({
            data: {
              collectList: detailArray
            }
          }).then((res) => {
            console.log('收藏更新成功，', res)

            wx.hideLoading()

            wx.showToast({
              icon: '收藏',
              title: '收藏成功',
            })
            that.setData({
              isCollect: true
            })
          }).catch(err => {
            wx.hideLoading()
            wx.showToast({
              title: '错误',
              image: '/images/warn.png',
              title: '收藏失败',
            })
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '加载出错'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  // 取消收藏
  unbindCollect() {
    const db = wx.cloud.database()
    let that = this

    wx.showLoading({
      title: '正在取消...',
    })

    db.collection('shici_collection').where({
      _openid: this.data.openid,
      _id: 'collect' + this.data.openid
    }).get({
      success: res => {
        if (!res.data.length) {
          console.log('哪里有误')
        } else {
          let detailArray = res.data[0].collectList

          detailArray.splice(this.data.thisIndex, 1)

          db.collection('shici_collection').doc('collect' + that.data.openid).update({
            data: {
              collectList: detailArray
            }
          }).then((res) => {
            console.log('取消收藏成功，', res)

            wx.showLoading()

            wx.showToast({
              icon: '收藏',
              title: '取消收藏成功',
            })
            that.setData({
              isCollect: false
            })
          }).catch(err => {
            wx.showLoading()
            wx.showToast({
              title: '错误',
              image: '/images/warn.png',
              title: '取消收藏失败',
            })
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '加载出错'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  // 读取收藏列表
  getcollect(param) {
    let that = this
    const db = wx.cloud.database()
    // 查看是否有收藏记录
    db.collection('shici_collection').where({
      _openid: this.data.openid,
      _id: 'collect' + this.data.openid
    }).get({
      success: res => {
        if (!res.data.length) { // 如果从未收藏
          console.log(' 从未收藏')
        } else { // 如果已有收藏记录
          console.log('用户已收藏列表：',res.data)
          let detailArray = res.data[0].collectList
          let flag = false
          let i = -1
          // 判断已有的收藏记录中是否已经收藏了此菜品
          detailArray.map((val, index) => {
            if (val._id == param) {
              flag = true
              i = index
            }
          })
          that.setData({
            isCollect: flag,
            thisIndex: i
          })
        }
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },


  loadDetail(id) {
    let { detail, page, num } = this.data
    let that = this
    wx.showLoading({
      title: '详情加载中...',
    })

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'gushici',
        page,
        num,
        condition: {
          _id: id
        }
      },
    }).then(res => {
      if (!res.result.data.length) { // 没搜索到
        wx.showToast({
          icon: 'warn',
          title: '加载失败',
        })
      } else {
        this.setData({
          detail: res.result.data[0]
        })

        wx.hideLoading()
      }
      that.setData({
        isDown: true
      })
    })
      .catch(err => {
        console.log('失败')
        that.setData({
          isExist: false
        })
      })
  },

  goList(e) {
    wx.navigateTo({
      url: `/pages/list/list?parenttags=${e.currentTarget.dataset.parenttags}&tags=${e.currentTarget.dataset.tags}`,
    })
  },

  goPoet(e) {
    let poet = e.currentTarget.dataset.poet
    if (poet == '佚名') {
      return false;
    } else {
      wx.navigateTo({
        url: `/pages/poet/poet?poet=${e.currentTarget.dataset.poet}`,
      })
    }
  },

  //点击切换 Tab
  checkCurrent(e) {
    if (this.data.currentData === e.target.dataset.current) {
      return false
    } else {
      this.setData({
        currentData: e.target.dataset.current
      })
    }
  },

  onShareAppMessage(res) {
    let id = wx.getStorageSync('shareId')
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我发现了一首很喜欢的诗，分享给你',
      path: `pages/detail/detail?id=${id}`
    }
  },

  onBackhome() {
    wx.switchTab({
      url: `/pages/index/index`,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})