#  微信小程序云开发


## 0. 其他小程序（功能更完善）


[详情地址](https://www.cnblogs.com/cckui/p/10901925.html)

<br>
<img src="https://www.cnblogs.com/images/cnblogs_com/cckui/1107952/o_WechatIMG732.jpg" width="240" />
<br>


## 1. 项目简介

包括搜索、分享转发、收藏、查看历史记录等功能。

## 2. 菜谱小程序地址

[https://github.com/caochangkui/miniprogram-food](https://github.com/caochangkui/miniprogram-food)


## 3. 小程序预览：

<br>
<img src="https://www.cnblogs.com/images/cnblogs_com/cckui/1107952/o_code.jpg" width="240" />
<br>

## 4. 部分截图

#### 首页

<img src="https://www.cnblogs.com/images/cnblogs_com/cckui/1069317/o_%e9%a6%96%e9%a1%b5.GIF" width="225" height="400"  />

#### 收藏


<img src="https://www.cnblogs.com/images/cnblogs_com/cckui/1069317/o_421c638b171ef2820cd981776ac5ca69.GIF" width="225" height="400"  />

#### 历史记录


<img src="https://www.cnblogs.com/images/cnblogs_com/cckui/1069317/o_%e5%8e%86%e5%8f%b2%e8%ae%b0%e5%bd%95.GIF" width="225" height="400"  />

## 5. 项目树

```
.
├── README.md
├── project.config.json                               // 项目配置文件
└── cloudfunctions | 云环境                            // 存放云函数目录
│    └── login                                        // 云函数
│        ├── index.js
│        └── package.json
└── miniprogram
    ├── images                                        // 存放小程序图片
    ├── pages                                         // 存放小程序各种页面
    |    ├── index                                    // 首页
    |    └── menu                                     // 菜单页
    |    └── user                                     // 用户中心
    |    └── search                                   // 搜索页
    |    └── list                                     // 列表页 搜索结果页
    |    └── detail                                   // 详情页
    |    └── databaseGuide                            // 数据库指导页
    |    └── chooseLib                                // 提示页
    |    └── storageConsole                           // 文件上传提示
    ├── style                                         // 样式文件目录
    ├── app.js                                        // 小程序公用逻辑
    ├── app.json                                      // 全局配置
    ├── app.wxss                                      // 全局样式


```
