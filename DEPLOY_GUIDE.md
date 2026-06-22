# 微信小程序云开发升级部署指南

## 一、项目概述

本项目是一个睡前陪伴小程序「要睡了嘞」，已完成云开发升级，包含以下功能模块：

- **用户系统**：登录、用户信息管理
- **投票功能**：创建投票、参与投票、查看结果
- **树洞功能**：发布消息、点赞互动
- **故事收藏**：收藏喜欢的故事
- **云存储**：图片上传和管理

## 二、环境配置

### 2.1 配置项目环境

1. 打开微信开发者工具，导入项目
2. 在 `project.config.json` 中配置您的 APPID：
```json
{
  "appid": "your-app-id",
  "projectname": "yaoshuilelei"
}
```

3. 在 `miniprogram/envList.js` 中配置您的云环境 ID：
```javascript
const envList = [
  {
    envId: 'your-env-id',
    alias: '生产环境'
  }
];
```

## 三、云函数部署

### 3.1 云函数列表

| 云函数名称 | 功能说明 | 文件路径 |
|-----------|---------|---------|
| `login` | 用户登录与注册 | `cloudfunctions/login/` |
| `vote` | 投票管理（创建/投票/查询） | `cloudfunctions/vote/` |
| `treehole` | 树洞管理（发布/点赞/查询） | `cloudfunctions/treehole/` |
| `user` | 用户数据管理（收藏/上传） | `cloudfunctions/user/` |
| `quickstartFunctions` | 综合函数（保留兼容） | `cloudfunctions/quickstartFunctions/` |

### 3.2 部署步骤

1. 在微信开发者工具中右键点击每个云函数目录
2. 选择「上传并部署：云端安装依赖」
3. 等待部署完成

## 四、数据库配置

### 4.1 需要创建的集合

| 集合名称 | 用途 | 字段结构 |
|---------|------|----------|
| **users** | 用户信息 | `openid`, `nickName`, `avatarUrl`, `createdAt`, `lastLoginAt` |
| **votes** | 投票数据 | `title`, `options`, `deadline`, `createdAt`, `createdBy`, `voters`, `status` |
| **treehole** | 树洞消息 | `content`, `createdAt`, `createdBy`, `nickName`, `likes`, `likedBy` |
| **story_collections** | 故事收藏 | `storyId`, `storyData`, `createdBy`, `createdAt` |
| **user_uploads** | 用户上传 | `fileID`, `cloudPath`, `createdBy`, `createdAt` |

### 4.2 权限设置

#### users 集合（用户信息）
```javascript
{
  "read": "auth.openid == resource.data.openid",
  "write": "auth.openid == resource.data.openid"
}
```

#### votes 集合（投票数据）
```javascript
{
  "read": true,
  "write": "auth.openid == resource.data.createdBy"
}
```

#### treehole 集合（树洞消息）
```javascript
{
  "read": true,
  "write": "auth.openid == resource.data.createdBy"
}
```

#### story_collections 集合（故事收藏）
```javascript
{
  "read": "auth.openid == resource.data.createdBy",
  "write": "auth.openid == resource.data.createdBy"
}
```

#### user_uploads 集合（用户上传）
```javascript
{
  "read": "auth.openid == resource.data.createdBy",
  "write": "auth.openid == resource.data.createdBy"
}
```

### 4.3 索引配置

| 集合名称 | 索引字段 | 索引类型 | 用途 |
|---------|---------|---------|------|
| users | `openid` | 唯一索引 | 用户登录查询 |
| votes | `createdAt` | 普通索引 | 投票列表排序 |
| votes | `status` | 普通索引 | 状态筛选 |
| treehole | `createdAt` | 普通索引 | 消息列表排序 |
| story_collections | `createdBy` | 普通索引 | 用户收藏查询 |
| story_collections | `storyId` | 普通索引 | 重复收藏判断 |
| user_uploads | `createdBy` | 普通索引 | 用户上传查询 |

## 五、云存储配置

### 5.1 存储权限

在云开发控制台 → 云存储 → 权限设置：

```javascript
{
  "read": true,
  "write": true
}
```

### 5.2 文件目录结构

```
cloud://your-env-id/images/
├── {timestamp}_{random}.png  # 用户上传的图片
└── ...
```

## 六、功能验证清单

### 6.1 用户登录
- [ ] 点击首页用户区域触发登录
- [ ] 获取用户昵称和头像
- [ ] 用户信息持久化存储

### 6.2 投票功能
- [ ] 创建新投票
- [ ] 参与投票
- [ ] 查看投票结果
- [ ] 投票截止时间判断

### 6.3 树洞功能
- [ ] 发布树洞消息
- [ ] 点赞/取消点赞
- [ ] 消息列表展示

### 6.4 故事收藏
- [ ] 收藏故事
- [ ] 取消收藏
- [ ] 个人中心查看收藏列表

### 6.5 图片上传
- [ ] 选择图片上传
- [ ] 图片预览
- [ ] 个人中心查看相册

### 6.6 错误处理
- [ ] 加载状态显示
- [ ] 网络失败提示
- [ ] 操作成功反馈

## 七、部署命令

### 7.1 安装依赖（云函数内）
每个云函数目录执行：
```bash
npm install
```

### 7.2 上传云函数
在微信开发者工具中右键上传，或使用 CLI：
```bash
wx cloud deploy function --function login
wx cloud deploy function --function vote
wx cloud deploy function --function treehole
wx cloud deploy function --function user
```

## 八、注意事项

1. **环境变量**：确保云环境 ID 正确配置
2. **权限规则**：首次部署后需要手动配置数据库权限
3. **索引优化**：为常用查询字段创建索引
4. **版本管理**：定期备份云函数代码
5. **测试验证**：部署后进行完整功能测试

## 九、参考文档

- [微信小程序云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/basis/getting-started.html)
- [云函数开发指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/cloudfunction/cloudfunction.html)
- [云数据库文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/database/database.html)