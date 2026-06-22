const app = getApp();

Page({
  data: {
    categories: [],
    soundList: [],
    currentCategory: 'rain',
    playingId: null,
    isPlaying: false,
    currentSound: {},
    progress: 0,
    currentTime: 0,
    playSpeed: 1,
    progressTimer: null,
    showSpeed: false,
    favorites: []
  },

  onLoad() {
    this.setData({
      categories: app.globalData.categories,
      soundList: app.globalData.soundList,
      favorites: this.getFavorites()
    });
  },

  getFavorites() {
    return wx.getStorageSync('soundFavorites') || [];
  },

  isFavorited(id) {
    return this.data.favorites.includes(id);
  },

  toggleFavorite(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    let favorites = this.getFavorites();
    
    if (favorites.includes(id)) {
      favorites = favorites.filter(fid => fid !== id);
      wx.showToast({ title: '已取消喜欢', icon: 'none' });
    } else {
      favorites.push(id);
      wx.showToast({ title: '已添加喜欢', icon: 'success' });
    }
    
    wx.setStorageSync('soundFavorites', favorites);
    this.setData({ favorites });
  },

  get filteredSounds() {
    return this.data.soundList.filter(s => s.category === this.data.currentCategory);
  },

  getCategoryIcon(category) {
    const icons = {
      rain: '🌧',
      wave: '🌊',
      fire: '🔥',
      music: '🎵'
    };
    return icons[category] || '🎵';
  },

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  },

  switchCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentCategory: id });
  },

  toggleSound(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    
    if (this.data.playingId === id) {
      this.setData({ isPlaying: !this.data.isPlaying });
      if (this.data.isPlaying) {
        this.startProgress();
      } else {
        this.stopProgress();
      }
    } else {
      this.stopProgress();
      const sound = this.data.soundList.find(s => s.id === id);
      const [min, sec] = sound.duration.split(':').map(Number);
      this.setData({
        playingId: id,
        isPlaying: true,
        currentSound: sound,
        progress: 0,
        currentTime: 0,
        totalTime: min * 60 + sec
      });
      this.startProgress();
      wx.showToast({ title: `正在播放 ${sound.name}`, icon: 'none' });
    }
  },

  stopSound() {
    this.stopProgress();
    this.setData({
      playingId: null,
      isPlaying: false,
      currentSound: {},
      progress: 0,
      currentTime: 0
    });
  },

  startProgress() {
    if (this.data.progressTimer) return;
    
    this.data.progressTimer = setInterval(() => {
      const newTime = this.data.currentTime + 1 * this.data.playSpeed;
      if (newTime >= (this.data.totalTime || 3600)) {
        this.stopSound();
        return;
      }
      
      const total = this.data.totalTime || 3600;
      const progress = (newTime / total) * 100;
      
      this.setData({
        currentTime: newTime,
        progress
      });
    }, 1000);
  },

  stopProgress() {
    if (this.data.progressTimer) {
      clearInterval(this.data.progressTimer);
      this.data.progressTimer = null;
    }
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

  preventBubble() {},

  onUnload() {
    this.stopProgress();
  },

  onHide() {
    this.stopProgress();
  }
});