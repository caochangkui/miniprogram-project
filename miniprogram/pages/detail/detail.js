// miniprogram/pages/detail/detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    openid: '',
    tags: [], // 标签
    ingredients: [], // 主料
    burden: [], // 辅料
    loading: true,
    logged: false,
    isExit: true, // 此菜品是否存在
    isCollect: true // 菜品是否已收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isLogin = wx.getStorageSync('isLogin')
    this.loadDetail(options.id) // 加载详情

    wx.setStorageSync('shareId', options.id)

    console.log(options.id)
    console.log('用户是否授权：', isLogin)
    console.log('是否已有用户openId：', app.globalData.openid)

    this.setData({
      logged: isLogin ? true : false
    })

    // 是否存在用户的openId
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

    this.getcollect(options.id) // 获取收藏菜品，并判断是否已收藏 
  },

  loadDetail(param) {
    let that = this
    wx.showLoading({
      title: '详情加载中...',
    })

    // 从云数据库读取列表
    const db = wx.cloud.database()
    const _ = db.command

    db.collection('food').where({
      id: _.eq(param)
    }).get({
      success(res) {
        console.log('查询结果:', res.data)
        if (res.data.length) {
          that.setData({
            detail: res.data[0],
            tags: res.data[0].tags.split(';'),
            ingredients: res.data[0].ingredients.split(',').join('：').split(';'),
            burden: res.data[0].burden.split(',').join('：').split(';')
          })
          wx.setNavigationBarTitle({
            title: res.data[0].title
          })
        } else {
          console.log('该id为空')
          that.setData({
            isExit: false
          })
        }
        wx.hideLoading();
      },
      fail(res) {
        console.log('查询失败')
      }
    })
  },

  // 登录授权
  getUser(e) {
    console.log(e);
    wx.getUserInfo({
      success: (res) => {
        console.log(res)
        wx.setStorageSync('isLogin', 'isLogin')
        this.setData({
          logged: true
        })
      }
    })
  },

  // 授权后可以收藏
  bindCollect () {
    let that = this
    // 先检查是否以获取openId
    if (!this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('取到openId：', res.result)
          app.globalData.openid = res.result.openid
          that.setData({
            openid: res.result.openid
          })

          that.onCollect()

          wx.vibrateLong({
            success: res => {
              console.log('震动成功');
            },
            fail: (err) => {
              console.log('震动失败');
            }
          })

          wx.showToast({
            icon: '收藏',
            title: '收藏成功',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      that.onCollect()
      wx.vibrateLong({
        success: res => {
          console.log('震动成功');
        },
        fail: (err) => {
          console.log('震动失败');
        }
      })
      if(that.data.isCollect) {
        wx.showToast({
          icon: '收藏',
          title: '收藏成功',
        })
      } else {
        wx.showToast({
          icon: '收藏',
          title: '已经取消收藏',
        })
      }

    }
  },

  // 收藏
  onCollect () {
    const db = wx.cloud.database()
    let that = this

    // 查看是否有收藏记录
    db.collection('food').where({
      _openid: this.data.openid,
      _id: 'collect' + this.data.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        let like = that.data.detail // 需要收藏的菜品
        delete like._id
        delete like._openid

        if (!res.data.length) { // 如果从未收藏
          console.log(' 从未收藏')
          let detailArray = []
          detailArray.push(like)
          db.collection('food').add({
            data: {
              _id: 'collect' + that.data.openid,
              description: 'like',
              collectList: detailArray
            }
          }).then(res => {
              console.log(res)
            })
        } else { // 如果已有收藏记录
          console.log('已有收藏记录')
          let detailArray = res.data[0].collectList
          let i = 0
          let flag = false

          // 判断已有的收藏记录中是否已经收藏了此菜品
          detailArray.map((val,index) => {
            if (val.id == like.id) {
              i = index
              flag = true
            }
          })

          that.setData({
            isCollect: flag
          })

          that.data.isCollect ? detailArray.splice(i,1) : detailArray.push(like)

          db.collection('food').doc('collect' + that.data.openid).update({
            data: {
              collectList: detailArray
            }
          }).then((res)=>{
            console.log(res)
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
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
    db.collection('food').where({
      _openid: this.data.openid,
      _id: 'collect' + this.data.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        if (!res.data.length) { // 如果从未收藏
          console.log(' 从未收藏')
        } else { // 如果已有收藏记录
          console.log(res.data)
          let detailArray = res.data[0].collectList
          let flag = false
          // 判断已有的收藏记录中是否已经收藏了此菜品
          detailArray.map((val, index) => {
            if (val.id == param) {
              flag = true
            }
          })
          console.log(flag)
          that.setData({
            isCollect: !flag
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  onShareAppMessage(res) {
    let id = wx.getStorageSync('shareId')
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '开饭嘞',
      path: `pages/detail/detail?id=${id}`
    }
  },

  onBackhome () {
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})