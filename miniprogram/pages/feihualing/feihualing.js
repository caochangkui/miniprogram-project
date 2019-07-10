// miniprogram/pages/feihualing/feihualing.js
const app = getApp()
Page({
  data: {
    logged: false,
    _id: '',
    type: '',
    list: [],
    page: 1,
    num: 1,
    sending: false,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })

    this.getList(this.data.type)
  },

  formSubmit(e) {
    let { key } = e.detail.value

    if (!key) {
      return
    }

    if (this.data.sending) {
      return
    }


    if (key.indexOf(this.data.type) == -1) {
      wx.showToast({
        title: '错误',
        image: '/images/warn.png',
        title: `诗词不包含${this.data.type}`,
        duration: 1500
      })
      return
    }

    if (key.trim().length < 5) {
      wx.showToast({
        title: '错误',
        image: '/images/warn.png',
        title: `诗词字数太少`,
        duration: 1500
      })
      return
    }


    if (this.ifExisted(key.trim())) {
      wx.showToast({
        title: '错误',
        image: '/images/warn.png',
        title: `别人提交过了`,
        duration: 1500
      })
      return
    }

    this.setData({
      key: key.trim(),
    })

    wx.showLoading({
      title: '加载中...',
    })

    this.setData({
      sending: true,
    })

    this.getPoem(this.data.key)
  },

  getPoem(key) {
    let { list, page, num } = this.data
    let that = this
    let condition = {
      content: {
        $regex: '.*' + key,
        $options: 'i'
      }
    }

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'feihualing',
        page,
        num,
        condition
      },
    }).then((res) => {
      if (!res.result.data.length) {
        wx.hideLoading()
        wx.showToast({
          title: '错误',
          image: '/images/warn.png',
          title: `未匹配到诗词`,
          duration: 1500
        })
        this.setData({
          sending: false
        })
      } else {
        let one = {
          avatarUrl: app.globalData.avatarUrl,
          username: app.globalData.username,
          dynasty: res.result.data[0].dynasty,
          poet: res.result.data[0].poet,
          title: res.result.data[0].title,
          _id: res.result.data[0]._id,
          content: key,
          time: this.timestampToTime(Date.parse(new Date())),
        }

        list.unshift(one)

        wx.showToast({
          title: '成功',
          image: '/images/zan.png',
          title: `优秀`,
          mask: true,
          duration: 1500
        })

        wx.cloud.callFunction({
          name: 'feihua_history_update',
          data: {
            database: 'feihua_history',
            id: this.data._id,
            data: {
              list
            }
          },
        }).then(res => {
          this.getList(this.data.type)
          this.setData({
            sending: false,
            inputValue: ''
          })
        })
          .catch(console.error)

      }
    }).catch((err) => {
      console.log(err)
    })
  },

  getList(type) {
    wx.showLoading({
      title: '加载中...',
    })

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'feihua_history',
        page: 1,
        num: 1,
        condition: {
          type
        }
      },
    }).then((res) => {
      this.setData({
        list: res.result.data[0].list,
        _id: res.result.data[0]._id
      })
      wx.hideLoading()
    })
  },

  goCangtoushiDetail (e) {
    let _id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/cangtoushi-detail/cangtoushi-detail?id=${_id}`,
    })
  },

  ifExisted(str) {
    let { list } = this.data
    let flag = false
    list.map((val, index) => {
      if (val.content.indexOf(str) != -1 || str.indexOf(val.content) != -1) {
        flag = true
      }
    })

    return flag
  },

  timestampToTime(timestamp, isMs = true) {
    const date = new Date(timestamp * (isMs ? 1 : 1000))
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  },


  onBackhome() {
    wx.switchTab({
      url: `/pages/find/find`,
    })
  },


  onShareAppMessage(res) {
    return {
      title: `挑战一下，你能写出多少带【${this.data.type}】字的诗词？`,
      path: `pages/feihualing/feihualing?type=${this.data.type}`
    }
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

})