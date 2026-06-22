const app = getApp();

Page({
  data: {
    story: {},
    contentParagraphs: [],
    isCollected: false,
    isPlaying: false,
    currentTime: 0,
    totalTime: 0,
    progress: 0,
    playSpeed: 1,
    showTimer: false,
    showSpeed: false,
    showEffects: false,
    selectedTimer: 0,
    selectedEffect: 'none',
    timerText: '定时关闭',
    playTimer: null,
    paragraphIndex: 0
  },

  onLoad(options) {
    const id = parseInt(options.id);
    const story = app.globalData.storyList.find(s => s.id === id);
    
    if (story) {
      const [min, sec] = story.duration.split(':').map(Number);
      this.setData({
        story,
        contentParagraphs: story.content.split('\n').filter(p => p.trim()),
        isCollected: app.isCollected(id),
        totalTime: min * 60 + sec
      });
    }
  },

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },

  togglePlay() {
    if (this.data.isPlaying) {
      this.pausePlay();
    } else {
      this.startPlay();
    }
  },

  startPlay() {
    this.setData({ isPlaying: true });
    this.startProgress();
    wx.showToast({ title: '开始播放', icon: 'none' });
  },

  pausePlay() {
    this.setData({ isPlaying: false });
    this.stopProgress();
    wx.showToast({ title: '已暂停', icon: 'none' });
  },

  startProgress() {
    if (this.data.playTimer) return;
    
    this.data.playTimer = setInterval(() => {
      const newTime = this.data.currentTime + 1 * this.data.playSpeed;
      if (newTime >= this.data.totalTime) {
        this.stopPlay();
        return;
      }
      
      const progress = (newTime / this.data.totalTime) * 100;
      const paragraphIndex = Math.floor((progress / 100) * this.data.contentParagraphs.length);
      
      this.setData({
        currentTime: newTime,
        progress,
        paragraphIndex
      });

      if (paragraphIndex < this.data.contentParagraphs.length) {
        wx.pageScrollTo({
          selector: `#paragraph-${paragraphIndex}`,
          duration: 300
        });
      }
    }, 1000);
  },

  stopProgress() {
    if (this.data.playTimer) {
      clearInterval(this.data.playTimer);
      this.data.playTimer = null;
    }
  },

  stopPlay() {
    this.stopProgress();
    this.setData({
      isPlaying: false,
      currentTime: 0,
      progress: 0,
      paragraphIndex: 0
    });
    wx.showToast({ title: '播放结束', icon: 'none' });
  },

  showSpeedModal() {
    this.setData({ showSpeed: true });
  },

  hideSpeedModal() {
    this.setData({ showSpeed: false });
  },

  selectSpeed(e) {
    const speed = parseFloat(e.currentTarget.dataset.speed);
    this.setData({ 
      playSpeed: speed,
      showSpeed: false 
    });
    wx.showToast({ title: `播放速度 ${speed}x`, icon: 'none' });
  },

  showSoundEffects() {
    this.setData({ showEffects: true });
  },

  hideEffectsModal() {
    this.setData({ showEffects: false });
  },

  selectEffect(e) {
    const effect = e.currentTarget.dataset.effect;
    const effectNames = {
      none: '无',
      rain: '雨声',
      wave: '海浪',
      fire: '柴火',
      music: '轻音乐'
    };
    this.setData({ 
      selectedEffect: effect,
      showEffects: false 
    });
    wx.showToast({ title: `背景音效：${effectNames[effect]}`, icon: 'none' });
  },

  async toggleCollect() {
    const id = this.data.story.id;
    if (this.data.isCollected) {
      try {
        const result = await app.removeUserCollection(id);
        if (result.success) {
          this.setData({ isCollected: false });
          wx.showToast({ title: '已取消收藏', icon: 'none' });
        } else {
          wx.showToast({ title: result.errMsg || '操作失败', icon: 'none' });
        }
      } catch (e) {
        console.error(e);
        wx.showToast({ title: '操作失败，请重试', icon: 'none' });
      }
    } else {
      try {
        const result = await app.addUserCollection({
          storyId: id,
          storyData: this.data.story
        });
        if (result.success) {
          this.setData({ isCollected: true });
          wx.showToast({ title: '收藏成功', icon: 'success' });
        } else {
          wx.showToast({ title: result.errMsg || '操作失败', icon: 'none' });
        }
      } catch (e) {
        console.error(e);
        wx.showToast({ title: '操作失败，请重试', icon: 'none' });
      }
    }
  },

  showTimerModal() {
    this.setData({ showTimer: true });
  },

  hideTimerModal() {
    this.setData({ showTimer: false });
  },

  preventClose() {},

  selectTimer(e) {
    const time = parseInt(e.currentTarget.dataset.time);
    this.setData({
      selectedTimer: time,
      timerText: time === 0 ? '定时关闭' : `${time}分钟后关闭`,
      showTimer: false
    });
    
    if (time > 0) {
      wx.showToast({ title: `已设置${time}分钟后关闭`, icon: 'none' });
    }
  },

  onUnload() {
    this.stopProgress();
  },

  onHide() {
    this.stopProgress();
  }
});