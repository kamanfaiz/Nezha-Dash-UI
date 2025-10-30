<div align="center">

# Nezha-Dash-UI

[![GitHub](https://img.shields.io/badge/GitHub-kamanfaiz%2FNezha--Dash--UI-blue?logo=github)](https://github.com/kamanfaiz/Nezha-Dash-UI)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

哪吒v1前端面板美化脚本的模块化版本，将不同功能拆分成独立的 JS 文件，通过`<script src=>`标签统一调用，可以根据自己喜好和需求自由组合搭配，分模块设计也便于按需加载和维护。

> **📢 声明**  
> * 本人只是出于个人爱好进行开发，本人审美不代表全部，欢迎各位根据自己的需求进行魔改和自定义，让项目更符合你的使用场景！
> * 目前仓库是通过jsdelivr cdn缓存来调用的，所以对于容器类或者质量不太好的小鸡可能存在加载慢的问题，请自行组合使用。
> * 有条件者可以将代码放到自己的CloudFlare R2存储桶中，因为jsdelivr cdn的缓存时间过长，有时候改完代码，可能需要很久才会刷新！


## 📑 目录

- [🎵 音乐播放器来源](#-音乐播放器来源)
- [📁 项目结构](#-项目结构)
- [🚀 快速开始](#-快速开始)
- [⚙️ 配置说明](#️-配置说明)
- [📦 模块说明](#-模块说明)
- [🎯 项目优势](#-项目优势)
- [📝 使用说明](#-使用说明)
- [🎨 自定义主题](#-自定义主题)
- [🤝 贡献](#-贡献)
- [📄 开源协议](#-开源协议)
- [🔗 相关链接](#-相关链接)
- [💡 致谢](#-致谢)

---

## 🎵 音乐播放器来源

本项目中的音乐播放器模块来自 [eooce/music-player](https://github.com/eooce/music-player)，感谢原作者的精彩工作！

本仓库对其进行了模块化封装，可以更方便地集成进哪吒前端面板使用。

> **⚠️ 重要提示**  
> **强烈建议部署属于自己的音乐播放器后端服务！**  
> 
> - 音乐播放器需要后端 API 支持，推荐使用 [eooce/music-player](https://github.com/eooce/music-player) 项目自行部署
> - 自建后端可以：
>   - 上传自己喜欢的音乐
>   - 避免依赖公共 API（可能存在限流、失效等问题）
>   - 完全控制播放列表和音乐资源
> - 部署完成后，在配置中修改 `window.MusicPlayerAPIUrl` 为你的 API 地址即可
> 
> **API 地址格式：**
> ```
> https://your-domain.com/api/music/list
> ```
> 
> API 返回的 JSON 格式示例：
> ```json
> {
>   "total": 20,
>   "data": [
>     {
>       "filename": "歌曲名-艺术家.mp3",
>       "url": "https://your-domain.com/music/歌曲名-艺术家.mp3",
>       "size": "8.81MB",
>       "extension": "MP3",
>       "lastModified": "10/29/2025, 6:57:40 AM"
>     }
>   ]
> }
> ```

---

## 📁 项目结构

```
Nezha-Dash-UI/
├── img/                         # 图片资源目录
│   ├── Candice.png             # 自定义插图示例
│   ├── Pilgrim.png             # Logo 示例
│   └── Wallpaper.png           # 背景图片示例
├── js/                          # 功能模块目录
│   ├── custom-links.js         # 自定义链接图标模块
│   ├── illustration.js         # 插图插入模块
│   ├── visitor-info.js         # 访客信息显示模块
│   ├── fireworks.js            # 烟花特效模块
│   ├── rain.js                 # 下雨特效模块
│   └── music-player.js         # 音乐播放器模块
├── nezha@v1.html               # 使用示例（可直接复制到哪吒面板）
├── LICENSE                      # MIT 开源协议
└── README.md                    # 项目说明文档
```

## 🚀 快速开始

### 方式一：完整引入（推荐）

将 `nezha@v1.html` 文件的内容复制到哪吒面板的"自定义代码"区域即可，已包含所有功能模块的 CDN 引入。

### 方式二：按需引入模块

如果只需要某些功能，可以选择性引入：

```html
<!-- 只引入访客信息和音乐播放器 -->
<script src="https://cdn.jsdelivr.net/gh/kamanfaiz/Nezha-Dash-UI@main/js/visitor-info.js"></script>
<script src="https://cdn.jsdelivr.net/gh/kamanfaiz/Nezha-Dash-UI@main/js/music-player.js"></script>
```

## ⚙️ 配置说明

所有配置变量都在 `nezha@v1.html` 文件或各模块的顶部，可以根据需要自定义：

### 🎨 哪吒面板基础配置

```javascript
window.CustomBackgroundImage = "图片URL";          // PC端背景图片
window.CustomMobileBackgroundImage = "图片URL";    // 移动端背景图片
window.CustomLogo = "图片URL";                     // 左上角Logo
window.CustomDesc = "描述文字";                    // Logo下方描述
window.ShowNetTransfer = true;                     // 是否显示实时流量
window.ForceCardInline = false;                    // 是否强制卡片同行显示
window.DisableAnimatedMan = true;                  // 是否禁用看板娘
window.CustomIllustration = "图片URL";             // 自定义插图（右下角）
window.FixedTopServerName = false;                 // 服务器名称固定顶部
window.ForceTheme = "";                            // 强制主题："light"/"dark"
```

### 📌 自定义链接 (custom-links.js)

```javascript
window.CustomLinks = JSON.stringify([
  { link: "https://blog.example.com", name: "Blog", icon: "icon-book" },
  { link: "https://t.me/your_bot", name: "Telegram", icon: "icon-paper-plane" }
]);
window.CustomLinkIconSize = "16px";                // 图标大小
window.CustomLinkIconColor = "";                   // 图标颜色（留空自动）
window.CustomLinkIconMarginRight = "1px";          // 图标与文字间距
```

### 🖼️ 插图 (illustration.js)

```javascript
window.CustomIllustration = "图片URL";             // 右下角插图URL
```

### 👤 访客信息 (visitor-info.js)

```javascript
window.VisitorInfoAutoHideDelay = 2600;            // 自动隐藏延迟（毫秒）
```

### 🎆 烟花特效 (fireworks.js)

```javascript
window.EnableFireworks = true;                     // 是否启用鼠标点击烟花
```

### 🌧️ 下雨特效 (rain.js)

```javascript
window.EnableRainEffect = true;                    // 是否启用背景下雨
```

### 🎵 音乐播放器 (music-player.js)

```javascript
// 基础配置
window.EnableMusicPlayer = true;                     // 是否启用音乐播放器
window.MusicPlayerBallSize = 50;                     // 悬浮球尺寸（像素）
window.MusicPlayerAutoCollapse = 2600;               // 自动收起延迟（毫秒）
window.MusicPlayerTitle = "NeZha Music Player";      // 播放器标题/默认艺术家名称
window.MusicPlayerAPIUrl = "API地址";                // 音乐列表API地址
window.MusicPlayerDefaultVolume = 0.2;               // 默认音量（0-1）

// GitHub 链接配置
window.MusicPlayerGitHubUrl = "GitHub链接";          // GitHub仓库链接（留空或false则不显示）
window.MusicPlayerGitHubIconSize = 28;               // GitHub图标容器大小（像素）

// 封面配置
window.MusicPlayerCoverList = ["封面URL1", "..."];   // 封面图片列表（随机分配）

// 视觉效果配置
window.MusicPlayerRotationSpeed = 5;                 // 唱片旋转速度（秒/圈，数值越大越慢）
window.MusicPlayerStrokeWidth = 4.5;                 // 悬浮球描边宽度（像素，0表示无描边）
window.MusicPlayerStrokeColor = "";                  // 悬浮球描边颜色（留空自动适配主题）
window.MusicPlayerOpacity = 0.5;                     // 面板不透明度（0-1）

// 音波效果配置
window.MusicPlayerWaveStrokeWidth = "2.8px";         // PC端音波圆环宽度
window.MusicPlayerWaveMobileStrokeWidth = "1.8px";   // 移动端音波圆环宽度
window.MusicPlayerWaveSpeed = 2.0;                   // 音波扩散速度（秒，完整扩散一轮所需时间）
window.MusicPlayerWaveScale = 1.8;                   // 音波扩散倍数（最大扩散倍数）

// UI 图标配置
window.MusicPlayerBallIconSize = 18;                 // 悬浮球播放/暂停图标尺寸（像素）
window.MusicPlayerExpandedAlbumSize = 70;            // 展开面板唱片尺寸（像素）
```

## 📦 模块说明

### 1️⃣ custom-links.js - 自定义链接图标
为导航栏的链接添加 iconfont 图标，支持自定义图标大小、颜色和间距。

**特性：**
- ✅ 自动识别导航链接
- ✅ 支持自定义图标样式
- ✅ 响应式适配

### 2️⃣ illustration.js - 插图插入
在页面右下角插入自定义插图，支持淡入动画效果。

**特性：**
- ✅ 异步加载，不阻塞页面渲染
- ✅ 淡入动画效果
- ✅ 路由变化时自动重新插入

### 3️⃣ visitor-info.js - 访客信息显示
显示访客的地理位置、IP、系统、浏览器等详细信息。

**特性：**
- ✅ **PC端**：右下角悬浮按钮，点击展开/收起
- ✅ **移动端**：首次自动弹出，2.6秒后隐藏
- ✅ 自动降低透明度，鼠标悬停恢复
- ✅ 包含国旗Emoji、系统、浏览器识别

### 4️⃣ fireworks.js - 烟花特效
鼠标点击页面时产生彩色粒子爆炸效果。

**特性：**
- ✅ Canvas 渲染，性能优化
- ✅ 对象池技术，减少内存开销
- ✅ 随机颜色和轨迹
- ✅ 自动清理过期粒子

### 5️⃣ rain.js - 下雨特效
在页面背景渲染持续的下雨动画。

**特性：**
- ✅ 背景层渲染，不影响交互
- ✅ 根据屏幕尺寸自适应雨滴密度
- ✅ 低性能开销

### 6️⃣ music-player.js - 音乐播放器
功能完整的音乐播放器，支持播放列表、进度控制、音量调节等。

**特性：**
- ✅ **悬浮球设计**：收起时为圆形悬浮球，展开时为完整面板
- ✅ **视觉效果**：
  - 唱片旋转动画（可自定义转速）
  - 音波扩散效果（播放时环绕悬浮球的动态音波）
  - 可自定义描边宽度和颜色
- ✅ **播放控制**：上一首、播放/暂停、下一首
- ✅ **进度控制**：拖动进度条跳转播放位置
- ✅ **音量调节**：独立音量滑块控制
- ✅ **播放列表**：显示所有歌曲，点击切换
- ✅ **自定义封面**：支持随机分配封面图片
- ✅ **API对接**：通过API获取音乐列表
- ✅ **主题自适应**：自动跟随系统深色/浅色模式
- ✅ **响应式设计**：PC端和移动端完美适配
- ✅ **GitHub链接**：可选的GitHub仓库跳转图标
- ✅ **自动收起**：展开后一段时间无操作自动收起

## 🎯 项目优势

✅ **模块化架构**：每个功能独立文件，便于维护和调试  
✅ **按需加载**：可根据需求选择性引入模块，减少冗余代码  
✅ **配置集中**：所有配置变量统一管理，修改方便  
✅ **无依赖冲突**：模块间相互独立，互不影响  
✅ **易于扩展**：添加新功能只需新建模块文件  
✅ **CDN 加速**：使用 jsDelivr CDN，全球加速访问  
✅ **主题适配**：自动跟随系统/哪吒面板主题切换  
✅ **响应式设计**：完美适配 PC 和移动端

## 📝 使用说明

### 图标库
项目默认使用阿里巴巴 Iconfont 图标库：
```html
<link rel="stylesheet" href="//at.alicdn.com/t/c/font_4956031_5kxc4fexu39.css" />
```

**使用自定义图标库：**
1. 替换上面的 CSS 链接为你自己的图标库链接
2. 修改代码中的图标类名（如 `icon-book`、`icon-paper-plane` 等）为你图标库中的对应类名
3. 示例：如果你的图标库中博客图标类名是 `iconfont icon-blog`，就将 `icon-book` 替换为 `icon-blog`

### CDN 缓存更新
如果更新了代码但 CDN 没有刷新，可以手动清除缓存：
```
https://purge.jsdelivr.net/gh/kamanfaiz/Nezha-Dash-UI@main/js/模块名.js
```

或在引入时添加版本号：
```html
<script src="https://cdn.jsdelivr.net/gh/kamanfaiz/Nezha-Dash-UI@main/js/music-player.js?v=20250128"></script>
```

**💡 进阶方案：使用 Cloudflare R2 存储桶**

有条件的用户可以把代码文件上传到自己的 Cloudflare R2 存储桶，优势：
- 缓存刷新更快，可以更灵活地控制缓存策略
- 不受 jsDelivr 限流影响
- 可以自定义域名访问

将 R2 绑定到自定义域名后，在 HTML 中引用：
```html
<script src="https://your-domain.com/js/music-player.js"></script>
```

### 浏览器兼容性
建议使用现代浏览器以获得最佳体验：
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

## 🎨 自定义主题

项目支持深色/浅色主题自动切换，会跟随：
1. 哪吒面板的主题设置
2. HTML 元素的 `data-theme` 属性
3. 系统的主题偏好 (`prefers-color-scheme`)

也可以强制指定主题：
```javascript
window.ForceTheme = "dark"; // 或 "light"
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

如果这个项目对你有帮助，欢迎 Star ⭐

## 📄 开源协议

[MIT License](LICENSE)

## 🔗 相关链接

- [哪吒监控面板](https://github.com/naiba/nezha)
- [音乐播放器 API (by eooce)](https://github.com/eooce/music-player)
- [Iconfont 图标库](https://www.iconfont.cn/)

## 💡 致谢

- 感谢 [哪吒监控](https://github.com/naiba/nezha) 提供的优秀监控面板
- 感谢 [eooce](https://github.com/eooce) 提供的音乐播放器 API 方案

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/kamanfaiz">kamanfaiz</a></sub>
</div>
