const app = getApp();

Page({
  data: {
    greeting: '夜深了，要睡了嘞',
    currentDate: '6月8日',
    currentWeek: '周日',
    userInfo: null,
    accompanyDays: 0
  },

  onLoad() {
    console.log('首页加载中');
    this.updateGreeting();
    this.updateDate();
    this.loadUserInfo();
  },

  onShow() {
    this.updateGreeting();
    this.loadUserInfo();
  },

  loadUserInfo() {
    this.setData({
      userInfo: app.userInfo,
      accompanyDays: app.getAccompanyDays()
    });
  },

  handleUserTap() {
    if (app.userInfo) {
      wx.switchTab({
        url: '/pages/mine/index'
      });
      return;
    }

    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: async (profileRes) => {
        try {
          wx.showLoading({ title: '登录中...' });
          
          await app.login(profileRes.userInfo);
          
          this.setData({ 
            userInfo: profileRes.userInfo,
            accompanyDays: app.getAccompanyDays()
          });
          wx.showToast({ title: '登录成功', icon: 'success' });
        } catch (err) {
          console.error('登录失败:', err);
          wx.showToast({ title: '登录失败，请重试', icon: 'none' });
        } finally {
          wx.hideLoading();
        }
      },
      fail: (err) => {
        console.warn('用户取消授权:', err);
        wx.showToast({ title: '请授权登录', icon: 'none' });
      }
    });
  },

  updateGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour >= 5 && hour < 12) {
      greeting = '早上好，新的一天开始了';
    } else if (hour >= 12 && hour < 18) {
      greeting = '下午好，记得休息一下';
    } else if (hour >= 18 && hour < 22) {
      greeting = '晚上好，准备放松一下吧';
    } else {
      greeting = '夜深了，要睡了嘞';
    }
    this.setData({ greeting });
    console.log('问候语更新:', greeting);
  },

  updateDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const week = weekDays[now.getDay()];
    
    this.setData({
      currentDate: `${month}月${day}日`,
      currentWeek: week
    });
    console.log('日期更新:', `${month}月${day}日`, week);
  },

  goToStory() {
    wx.switchTab({
      url: '/pages/story/index'
    });
  },

  goToSound() {
    wx.navigateTo({
      url: '/pages/sound/index'
    });
  },

  goToTreehole() {
    wx.switchTab({
      url: '/pages/treehole/index'
    });
  },

  goToVote() {
    wx.switchTab({
      url: '/pages/vote/index'
    });
  },

  goToPlan() {
    wx.showToast({
      title: '晚安计划开发中',
      icon: 'none'
    });
  }
});