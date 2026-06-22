App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: wx.cloud.DYNAMIC_CURRENT_ENV,
        traceUser: true,
      });
    }
    this.getUserInfo();
  },

  userInfo: null,
  openid: '',

  globalData: {
    storyList: [
      {
        id: 1,
        title: "星星的约定",
        intro: "在遥远的星空深处，住着一群善良的星星精灵...",
        duration: "15:30",
        content: "在遥远的星空深处，住着一群善良的星星精灵。每一颗星星都有自己的故事，它们在夜空中闪烁，守护着每一个进入梦乡的孩子。\n\n小星星乐乐是星空中最调皮的一颗，它喜欢在云层间穿梭，和月亮姐姐捉迷藏。但是每当夜深人静的时候，乐乐总会安静下来，听风婆婆讲述那些古老的故事。\n\n有一天，乐乐遇到了一个睡不着的小女孩。小女孩望着星空，轻声许愿：\"希望我能做一个甜甜的梦。\"乐乐听到了，决定帮助她。\n\n它召集了所有的星星伙伴，一起编织了一个美丽的梦境。在梦里，小女孩来到了一个糖果做成的世界，到处都是甜甜的巧克力和五彩缤纷的糖果。\n\n小女孩在糖果世界里开心地玩耍，渐渐感到困意来袭。当她闭上眼睛的那一刻，所有的星星都轻轻地闪烁，为她唱起了晚安的歌谣。\n\n从那以后，每当有人在夜晚感到孤单或难以入睡时，星星们都会出现，用它们的光芒和故事陪伴每一个需要温暖的心灵。\n\n晚安，愿你的梦里有星星，有月亮，还有甜甜的微笑。"
      },
      {
        id: 2,
        title: "森林的夜晚",
        intro: "月光洒落在静谧的森林里，小动物们准备睡觉了...",
        duration: "12:45",
        content: "月光洒落在静谧的森林里，银色的光芒穿过树叶的缝隙，在地上织出一片片光斑。小动物们忙碌了一天，都准备睡觉了。\n\n小兔子蹦蹦跳跳地回到了自己的洞穴，把今天采到的胡萝卜整齐地摆放在门口。它轻轻地舔了舔爪子，然后蜷缩成一个毛茸茸的小球。\n\n小熊躺在温暖的树洞里，肚子里装满了甜甜的蜂蜜。它打了一个大大的哈欠，把熊掌放在胸前，慢慢地闭上了眼睛。\n\n猫头鹰站在高高的树枝上，它的眼睛在黑暗中闪着微光。虽然它是夜行性动物，但今晚它也感到了一丝倦意。\n\n小溪在林间静静地流淌，发出叮咚叮咚的声音，像是在为森林里的居民们唱着摇篮曲。微风轻轻吹过，树叶沙沙作响，像是在低语晚安。\n\n在森林的最深处，住着一位神秘的树精灵。它守护着这片森林，每当夜晚来临，它就会用魔法让所有的树木都进入甜美的梦乡。\n\n森林里的一切都安静下来了，只有星星和月亮在天空中默默地守护着这片宁静的土地。晚安，森林。晚安，所有可爱的小动物们。"
      },
      {
        id: 3,
        title: "云朵上的城堡",
        intro: "在高高的云端之上，有一座美丽的城堡...",
        duration: "18:20",
        content: "在高高的云端之上，有一座美丽的城堡。城堡的墙壁是用棉花糖做的，屋顶是用彩虹糖铺成的，窗户是亮晶晶的冰糖。\n\n城堡里住着一位温柔的云朵公主，她有一双像星星一样明亮的眼睛，头发像棉花一样柔软。公主最喜欢做的事情就是收集人们的美梦。\n\n每天晚上，公主都会骑着她的月亮马车，在天空中巡游。当她看到有人在做美梦时，就会轻轻地把那个梦收集起来，放进一个水晶瓶子里。\n\n这些美梦被保存在城堡的梦境花园里，花园里长满了会发光的花朵，每一朵花都代表着一个美好的梦想。\n\n有一天，公主遇到了一个小男孩，他因为白天和妈妈吵架而睡不着觉。小男孩的心里充满了愧疚和不安。\n\n公主轻轻地来到他的床边，用温柔的声音说：\"别难过，让我带你去云朵城堡看看吧。\"小男孩闭上了眼睛，跟着公主来到了云端。\n\n在城堡里，小男孩看到了许多美丽的梦境，他明白了妈妈的爱和关心。当他再次睁开眼睛时，心里已经充满了温暖和幸福。\n\n从那以后，小男孩每天晚上都会梦见云朵城堡，在那里，他学会了原谅和爱。晚安，愿你的梦里也有一座云朵城堡。"
      },
      {
        id: 4,
        title: "深海的秘密",
        intro: "在蔚蓝的大海深处，隐藏着一个神秘的海底世界...",
        duration: "14:10",
        content: "在蔚蓝的大海深处，隐藏着一个神秘的海底世界。那里有闪闪发光的珊瑚礁，有五颜六色的热带鱼，还有一座由珍珠建成的宫殿。\n\n海底世界的统治者是一位美丽的人鱼公主，她的尾巴像彩虹一样绚丽，歌声能让海浪平静下来。公主每天都会在海底花园里散步，欣赏那些奇异的海洋生物。\n\n在海底的最深处，有一颗巨大的蓝宝石，它是整个海底世界的能量来源。蓝宝石发出柔和的光芒，照亮了整个深海。\n\n有一天，一只迷路的小海豚来到了海底世界。它因为贪玩而离开了妈妈，现在找不到回家的路了。小海豚伤心地哭了起来。\n\n人鱼公主听到了小海豚的哭声，她游过来安慰它：\"别害怕，我会帮你找到妈妈的。\"公主带着小海豚穿过珊瑚礁，绕过海草森林。\n\n在寻找妈妈的过程中，小海豚看到了许多奇妙的景象：会发光的水母、巨大的海龟、还有会跳舞的章鱼。\n\n终于，小海豚找到了妈妈。海豚妈妈感激地对公主说：\"谢谢你，善良的公主。\"公主微笑着说：\"不用谢，帮助别人是最快乐的事情。\"\n\n夜晚来临，海底世界变得更加美丽。月光透过海水洒下来，像是一条条银色的丝带。晚安，大海。晚安，所有生活在海底的朋友们。"
      },
      {
        id: 5,
        title: "四季的童话",
        intro: "春夏秋冬，每个季节都有自己独特的故事...",
        duration: "16:00",
        content: "春夏秋冬，每个季节都有自己独特的故事。它们轮流来到人间，带来不同的风景和感受。\n\n春天，万物复苏。小草从土里探出头来，花朵们争相开放。春风轻轻吹拂，像是在唤醒沉睡的大地。春雨绵绵，滋润着每一寸土地。\n\n夏天，阳光灿烂。蝉在树上高声歌唱，蝴蝶在花丛中翩翩起舞。孩子们在游泳池里嬉戏，老人们在树荫下乘凉。夏夜的星空格外明亮，萤火虫在草丛中闪烁。\n\n秋天，硕果累累。树叶变成了金黄色，像是给大地铺上了一层金色的地毯。农民伯伯们忙着收割庄稼，果园里飘满了果香。秋风送爽，让人感到心旷神怡。\n\n冬天，银装素裹。雪花纷纷扬扬地飘落，给大地披上了一件白色的棉衣。孩子们在雪地里堆雪人、打雪仗，屋子里温暖如春。冬夜格外宁静，雪花落在窗户上，像是在讲述一个安静的故事。\n\n四季轮回，周而复始。每个季节都有它的美好，每个季节都值得我们珍惜。晚安，四季。晚安，这个美丽的世界。"
      }
    ],
    soundList: [
      { id: 1, name: "轻柔雨声", category: "rain", duration: "60:00" },
      { id: 2, name: "暴雨雷声", category: "rain", duration: "45:00" },
      { id: 3, name: "细雨绵绵", category: "rain", duration: "50:00" },
      { id: 4, name: "海浪轻拍", category: "wave", duration: "60:00" },
      { id: 5, name: "汹涌海浪", category: "wave", duration: "40:00" },
      { id: 6, name: "海风轻吟", category: "wave", duration: "55:00" },
      { id: 7, name: "温暖柴火", category: "fire", duration: "30:00" },
      { id: 8, name: "篝火噼啪", category: "fire", duration: "45:00" },
      { id: 9, name: "壁炉燃烧", category: "fire", duration: "60:00" },
      { id: 10, name: "月光奏鸣曲", category: "music", duration: "25:00" },
      { id: 11, name: "摇篮曲", category: "music", duration: "30:00" },
      { id: 12, name: "自然轻音乐", category: "music", duration: "40:00" }
    ],
    categories: [
      { id: "rain", name: "雨声" },
      { id: "wave", name: "海浪" },
      { id: "fire", name: "柴火" },
      { id: "music", name: "轻音乐" }
    ]
  },

  getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "早上好，新的一天开始了";
    } else if (hour >= 12 && hour < 18) {
      return "下午好，记得休息一下";
    } else if (hour >= 18 && hour < 22) {
      return "晚上好，准备放松一下吧";
    } else {
      return "夜深了，要睡了嘞";
    }
  },

  getAccompanyDays() {
    const firstDate = wx.getStorageSync('firstVisitDate');
    if (!firstDate) {
      const today = new Date().toISOString().split('T')[0];
      wx.setStorageSync('firstVisitDate', today);
      return 1;
    }
    const today = new Date();
    const first = new Date(firstDate);
    const diffTime = Math.abs(today - first);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  },

  getCollections() {
    return wx.getStorageSync('collections') || [];
  },

  addCollection(item) {
    const collections = this.getCollections();
    if (!collections.find(c => c.id === item.id)) {
      collections.push(item);
      wx.setStorageSync('collections', collections);
    }
  },

  removeCollection(itemId) {
    const collections = this.getCollections();
    const filtered = collections.filter(c => c.id !== itemId);
    wx.setStorageSync('collections', filtered);
  },

  isCollected(itemId) {
    const collections = this.getCollections();
    return collections.some(c => c.id === itemId);
  },

  getTreeholeMessages() {
    return wx.getStorageSync('treeholeMessages') || [
      {
        id: 1,
        content: "今天工作好累，希望能做个好梦",
        time: "2024-01-15 23:30",
        likes: 12
      },
      {
        id: 2,
        content: "想念远方的家人，愿他们一切安好",
        time: "2024-01-15 22:45",
        likes: 8
      },
      {
        id: 3,
        content: "明天要考试了，紧张但也要好好休息",
        time: "2024-01-15 21:20",
        likes: 15
      }
    ];
  },

  addTreeholeMessage(content) {
    const messages = this.getTreeholeMessages();
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMessage = {
      id: Date.now(),
      content,
      time: timeStr,
      likes: 0
    };
    messages.unshift(newMessage);
    wx.setStorageSync('treeholeMessages', messages);
    return newMessage;
  },

  toggleLike(messageId) {
    const messages = this.getTreeholeMessages();
    const message = messages.find(m => m.id === messageId);
    if (message) {
      message.likes += 1;
      wx.setStorageSync('treeholeMessages', messages);
    }
  },

  getNightMode() {
    return wx.getStorageSync('nightMode') || false;
  },

  setNightMode(enabled) {
    wx.setStorageSync('nightMode', enabled);
  },

  getSoundFavorites() {
    return wx.getStorageSync('soundFavorites') || [];
  },

  addSoundFavorite(soundId) {
    const favorites = this.getSoundFavorites();
    if (!favorites.includes(soundId)) {
      favorites.push(soundId);
      wx.setStorageSync('soundFavorites', favorites);
    }
  },

  removeSoundFavorite(soundId) {
    const favorites = this.getSoundFavorites();
    const filtered = favorites.filter(fid => fid !== soundId);
    wx.setStorageSync('soundFavorites', filtered);
  },

  isSoundFavorited(soundId) {
    const favorites = this.getSoundFavorites();
    return favorites.includes(soundId);
  },

  getUserInfo() {
    const storedUser = wx.getStorageSync('userInfo');
    const storedOpenid = wx.getStorageSync('openid');
    
    if (storedUser) {
      this.userInfo = storedUser;
    }
    if (storedOpenid) {
      this.openid = storedOpenid;
    }
  },

  setUserInfo(userInfo) {
    this.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  },

  setOpenid(openid) {
    this.openid = openid;
    wx.setStorageSync('openid', openid);
  },

  async login(userInfo = null) {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (res) => {
          if (res.code) {
            try {
              const result = await wx.cloud.callFunction({
                name: 'login',
                data: userInfo || {}
              });
              if (result.result.success) {
                this.setOpenid(result.result.openid);
                if (result.result.data) {
                  this.setUserInfo(result.result.data);
                }
                resolve(result.result);
              } else {
                reject(result.result.errMsg);
              }
            } catch (e) {
              reject(e);
            }
          } else {
            reject(res.errMsg);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  async getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: async (res) => {
          this.setUserInfo(res.userInfo);
          try {
            await this.login(res.userInfo);
          } catch (e) {
            console.warn('登录失败，但用户信息已保存');
          }
          resolve(res.userInfo);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  async callCloudFunction(name, action, data = {}) {
    try {
      const result = await wx.cloud.callFunction({
        name: name,
        data: { action, data }
      });
      return result.result;
    } catch (err) {
      console.error(`云函数 ${name} 调用失败:`, err);
      throw err;
    }
  },

  async getVoteList() {
    return await this.callCloudFunction('vote', 'list');
  },

  async createVote(data) {
    return await this.callCloudFunction('vote', 'create', data);
  },

  async getVoteDetail(voteId) {
    return await this.callCloudFunction('vote', 'detail', { voteId });
  },

  async submitVote(voteId, optionIndex) {
    return await this.callCloudFunction('vote', 'vote', { voteId, optionIndex });
  },

  async getTreeholeMessages() {
    return await this.callCloudFunction('treehole', 'list');
  },

  async addTreeholeMessage(content) {
    return await this.callCloudFunction('treehole', 'add', { content });
  },

  async likeTreeholeMessage(messageId) {
    return await this.callCloudFunction('treehole', 'like', { messageId });
  },

  async getUserCollections() {
    return await this.callCloudFunction('user', 'getCollections');
  },

  async addUserCollection(data) {
    return await this.callCloudFunction('user', 'addCollection', data);
  },

  async removeUserCollection(storyId) {
    return await this.callCloudFunction('user', 'removeCollection', { storyId });
  },

  async getUserUploads() {
    return await this.callCloudFunction('user', 'getUploads');
  },

  async addUserUpload(data) {
    return await this.callCloudFunction('user', 'addUpload', data);
  },

  async deleteUserUpload(fileId) {
    return await this.callCloudFunction('user', 'deleteUpload', { fileId });
  },

  async getUserInfoFromCloud() {
    return await this.callCloudFunction('user', 'get');
  },

  async updateAvatar(avatarUrl) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          action: 'update',
          data: { avatarUrl }
        },
        success: (res) => {
          if (res.result.success) {
            if (this.userInfo) {
              this.userInfo.avatarUrl = avatarUrl;
              this.setUserInfo(this.userInfo);
            }
            resolve(res.result);
          } else {
            reject(res.result.errMsg);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  logout() {
    this.userInfo = null;
    this.openid = '';
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('openid');
  },

  async uploadImage(filePath) {
    return new Promise((resolve, reject) => {
      const cloudPath = `images/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;
      
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: filePath,
        success: (res) => {
          resolve({
            fileID: res.fileID,
            cloudPath: cloudPath
          });
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  async downloadFile(fileID) {
    return new Promise((resolve, reject) => {
      wx.cloud.downloadFile({
        fileID: fileID,
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  async getFileInfo(fileID) {
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: [fileID],
        success: (res) => {
          if (res.fileList && res.fileList.length > 0) {
            resolve(res.fileList[0]);
          } else {
            reject(new Error('获取文件信息失败'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
});