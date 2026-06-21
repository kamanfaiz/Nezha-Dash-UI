/**
 * =================================================================
 * Nezha-UI 音乐播放器模块
 * @description 对接老王eooce的音乐播放器项目,创建音乐播放器,强烈推荐老王音乐播放器,感谢老王!
 * =================================================================
 */  

/**
 * ================================================================
 * 音乐播放器 - 代码概览
 * ================================================================
 * 
 * 代码结构说明：
 * 
 * 第一部分：全局配置变量
 * 第二部分：CSS 样式定义
 * 第三部分：核心变量声明
 * 第四部分：UI 元素创建
 * 第五部分：播放列表功能
 * 第六部分：播放控制功能
 * 第七部分：UI 交互功能
 * 第八部分：主题适配功能
 * 第九部分：事件绑定
 * 第十部分：初始化执行
 * ================================================================
 */

// ================================================================
// 第一部分：全局配置变量
// ================================================================

// 音乐播放器基础配置
window.EnableMusicPlayer = true; // 是否启用音乐播放器（true/false）
window.MusicPlayerBallSize = 50; // 悬浮球尺寸（单位：像素）
window.MusicPlayerAutoCollapse = 2600; // 自动收起面板的延迟时间（单位：毫秒）
window.MusicPlayerTitle = "NeZha Music Player"; // 音乐播放器标题/默认艺术家名称（当文件名无"-"时使用）
window.MusicPlayerAPIUrl = "https://music.629569.xyz/data/info.json"; // 音乐列表API地址
window.MusicPlayerDefaultVolume = 0.7; // 默认音量（范围：0-1）

// GitHub 链接配置
window.MusicPlayerGitHubUrl = "https://github.com/kamanfaiz/Nezha-Dash-UI"; // GitHub仓库链接（留空或false则不显示图标）
window.MusicPlayerGitHubIconSize = 28; // GitHub 图标容器大小（单位：像素）

// 封面配置
window.MusicPlayerCoverList = [ // 封面图片列表（随机分配给歌曲）
  "https://css.629569.xyz/nezha/cover/cover01.png",
  "https://css.629569.xyz/nezha/cover/cover02.png",
];

// 视觉效果配置
window.MusicPlayerRotationSpeed = 5; // 唱片旋转速度（数值越大转速越慢，单位：秒/圈）
window.MusicPlayerStrokeWidth = 4.5; // 悬浮球描边宽度（单位：像素，0表示无描边）
window.MusicPlayerStrokeColor = ""; // 悬浮球描边颜色（留空则自动适配主题：暗色模式黑色，亮色模式白色）
window.MusicPlayerOpacity = 0.7; // 播放器面板不透明度（范围：0-1）

// 音波效果配置
window.MusicPlayerWaveStrokeWidth = "2.8px"; // PC端音波圆环宽度
window.MusicPlayerWaveMobileStrokeWidth = "1.8px"; // 移动端音波圆环宽度
window.MusicPlayerWaveSpeed = 2.0; // 音波扩散速度（单位：秒，完整扩散一轮所需时间）
window.MusicPlayerWaveScale = 1.8; // 音波扩散比例（最大扩散倍数）

// UI 图标配置
window.MusicPlayerBallIconSize = 23; // 悬浮球播放/暂停图标尺寸（单位：像素）
window.MusicPlayerExpandedAlbumSize = 70; // 展开面板唱片尺寸（单位：像素，建议比悬浮球大一些）

// ================================================================
// 主函数：音乐播放器初始化
// ================================================================
function initMusicPlayer() {
  if (!window.EnableMusicPlayer) return;

  // ================================================================
  // 第二部分：CSS 样式定义
  // ================================================================
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
  /* ==================== 动画定义 ==================== */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* 音波扩散动画 */
  @keyframes soundwave {
    from {
      transform: scale(1);
      opacity: 0.95;
    }
    to {
      transform: scale(var(--wave-scale, 1.6));
      opacity: 0;
    }
  }

  /* ==================== 音波容器 ==================== */
  /* 音波容器 - 独立定位在悬浮球下方 */
  .wave-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0; /* 位于主面板下方 */
  }

  /* 音波圆环 */
  .wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: var(--wave-stroke-width, 1.8px) solid var(--wave-color);
    pointer-events: none;
    display: none; /* 默认隐藏 */
  }

  /* 仅在收起状态且播放时显示音波动画 */
  .music-player-container:not(.expanded).playing .wave {
    display: block;
    animation: soundwave var(--wave-speed, 2.4s) infinite ease-out;
  }

  /* ==================== 主容器 ==================== */
  .music-player-container {
    position: fixed;
    left: 20px;
    bottom: 20px;
    z-index: 1050;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    overflow: visible; /* 允许音波超出容器 */
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8); /* 默认值，会被 JavaScript 动态更新 */
  }

  .music-player-container.expanded {
    border-radius: 15px;
    width: auto !important;
    height: auto !important;
    overflow: visible; /* 允许播放列表弹出容器上方 */
  }

  /* ==================== 主内容区 ==================== */
  .music-player-main {
    display: flex;
    align-items: center;
    padding: 0;
    gap: 0;
    border-radius: inherit;
    position: relative;
    background: inherit;
    z-index: 1; /* 位于音波之上 */
    overflow: hidden; /* 裁剪内容为圆形 */
  }

  .music-player-container.expanded .music-player-main {
    padding: 10px;
    gap: 12px;
    overflow: hidden; /* 内容限制在容器内 */
  }

  /* ==================== 悬浮球封面（收起状态） ==================== */
  .music-ball-album {
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden; /* 裁剪为圆形 */
  }

  .music-player-container.expanded .music-ball-album {
    display: none;
  }

  .music-ball-rotating {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .music-ball-image {
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    object-position: center;
    width: 100%;
    height: 100%;
    transform: scale(1.001); /* 微调缩放，消除子像素渲染缝隙 */
  }

  .music-ball-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    z-index: 2;
  }

  .music-ball-album:hover .music-ball-overlay {
    opacity: 1;
  }

  /* ==================== 展开状态封面（唱片效果） ==================== */
  .music-expanded-album {
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .music-player-container.expanded .music-expanded-album {
    display: flex;
  }

  .music-expanded-rotating {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s linear;
  }

  .music-expanded-rotating::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      from 88deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 8%,
      transparent 18%,
      transparent 50%,
      rgba(255, 255, 255, 0.4) 58%,
      transparent 68%
    );
    pointer-events: none;
    z-index: 1;
  }

  .music-expanded-base {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    border-radius: 50%;
    z-index: 0;
  }

  .music-expanded-image {
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
    width: 55%;
    height: 55%;
    position: relative;
    z-index: 2;
  }

  .music-expanded-overlay {
    position: absolute;
    top: 22.5%;
    left: 22.5%;
    width: 55%;
    height: 55%;
    background: rgba(0,0,0,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    z-index: 2;
  }

  .music-expanded-album:hover .music-expanded-overlay {
    opacity: 1;
  }

  .music-wave-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: 50%;
  }

  /* ==================== 信息和控制区域 ==================== */
  .music-info-section {
    flex: 1;
    min-width: 0; /* 允许flex子项收缩，防止溢出 */
    opacity: 0;
    display: none;
    flex-direction: column;
    overflow: hidden;
    align-items: stretch;
  }

  .music-player-container.expanded .music-info-section {
    opacity: 1;
    display: flex;
  }

  .music-track-info {
    display: flex;
    flex-direction: column;
    gap: 0px; /* 歌名和作者之间的间距 */
    align-self: stretch;
    margin-bottom: 6px; /* 歌曲信息与进度条之间的间距 */
  }

  .music-title {
    color: #333;
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .music-artist {
    color: #999;           /* 更淡的颜色 */
    font-size: 11px;       /* 更小的字体 */
    font-weight: 400;      /* 正常字重 */
    opacity: 0.8;          /* 降低不透明度 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 2px;       /* 与标题稍微拉开距离 */
  }

  /* ==================== 进度条 ==================== */
  .music-progress-section {
    display: none;
    flex-direction: column;
    gap: 4px;
    opacity: 0;
    align-self: stretch;
    margin-bottom: 0px; /* 进度条与控制按钮之间的间距 */
  }

  .music-player-container.expanded .music-progress-section {
    display: flex;
    opacity: 1;
  }

  .music-progress-bar {
    width: 100%;
    height: 4px;
    background: var(--progress-bg, rgba(0, 0, 0, 0.1));
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .music-progress-fill {
    height: 100%;
    background: var(--progress-fill, rgba(36, 44, 54, 0.8));
    border-radius: 2px;
    width: 0%;
    transition: width 0.1s linear;
  }

  .music-time {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #666;
    padding: 0 2px;
  }

  /* ==================== 控制按钮 ==================== */
  .music-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    overflow: visible;
    align-self: stretch;
  }

  .music-btn {
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    opacity: 0.7;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .music-btn:hover {
    opacity: 1;
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.05);
  }

  /* ==================== 移动端适配 ==================== */
  @media (max-width: 768px) {
    .music-player-container.expanded {
      max-width: 90vw;
    }
    .music-controls {
      flex-wrap: wrap;
      gap: 4px;
    }
    .music-volume-slider {
      width: 40px;
    }
    .music-btn {
      min-width: 44px;
      min-height: 44px;
    }
    .music-playlist {
      width: 260px;
      margin-left: -130px;
    }
    .music-playlist-inner {
      max-height: 200px;
    }
    .music-progress-bar {
      height: 6px;
    }
    .music-progress-section {
      min-width: 0; /* 防止进度条溢出 */
    }
    .music-time {
      font-size: 10px;
      white-space: nowrap;
    }
    .music-track-info {
      min-width: 0; /* 允许文字截断 */
    }
  }

  /* GitHub链接图标 */
  .music-github-link {
    position: absolute;
    top: 10px;
    right: 10px;
    width: var(--github-icon-size, 24px);
    height: var(--github-icon-size, 24px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    opacity: 0.5;
    transition: all 0.3s;
    cursor: pointer;
    border-radius: 50%;
    z-index: 5;
    text-decoration: none;
  }

  .music-github-link:hover {
    opacity: 1;
    transform: scale(1.15);
    background: rgba(0, 0, 0, 0.05);
  }

  .music-github-link i {
    font-size: calc(var(--github-icon-size, 24px) * 0.75);
  }

  .music-btn.play-btn {
    font-size: 20px;
    width: 36px;
    height: 36px;
    opacity: 1;
  }

  /* ==================== 音量控制 ==================== */
  .music-volume-control {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .music-volume-slider {
    width: 60px;
    display: flex;
    align-items: center;
  }

  .music-volume-slider input {
    width: 100%;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      var(--slider-fill, #242c36) 0%,
      var(--slider-fill, #242c36) var(--slider-percent, 50%),
      var(--slider-bg, rgba(0, 0, 0, 0.1)) var(--slider-percent, 50%),
      var(--slider-bg, rgba(0, 0, 0, 0.1)) 100%
    );
    outline: none;
  }

  .music-volume-slider input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--slider-thumb, #242c36);
    cursor: pointer;
    transition: all 0.2s;
  }

  .music-volume-slider input::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .music-volume-slider input::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--slider-thumb, #242c36);
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  .music-volume-slider input::-moz-range-thumb:hover {
    transform: scale(1.2);
  }

  .music-volume-slider input::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: transparent;
  }

  /* ==================== 播放列表 ==================== */
  .music-playlist {
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -140px;
    margin-bottom: 8px;
    width: 280px;
    background: var(--playlist-bg, rgba(255, 255, 255, 0.95));
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-radius: 10px;
    overflow: hidden;
    opacity: 0;
    transform: scale(0.95) translateY(10px);
    transform-origin: bottom center;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1051;
    display: flex;
    flex-direction: column;
  }

  .music-playlist.show {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
  }

  .music-playlist-inner {
    max-height: 250px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .music-playlist-header {
    padding: 12px;
    border-bottom: 1px solid var(--playlist-border, rgba(0, 0, 0, 0.08));
    font-weight: 600;
    color: var(--playlist-header-text, #333);
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: var(--playlist-header-bg, rgba(255, 255, 255, 0.98));
    backdrop-filter: blur(10px);
    z-index: 1;
  }

  .music-playlist-close {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
    font-size: 18px;
  }

  .music-playlist-close:hover {
    opacity: 1;
  }

  .music-playlist-item {
    padding: 10px 12px;
    color: var(--playlist-item-text, #555);
    font-size: 13px;
    cursor: pointer;
    border-bottom: 1px solid var(--playlist-item-border, rgba(0, 0, 0, 0.05));
    transition: background 0.2s;
  }

  .music-playlist-item:last-child {
    border-bottom: none;
  }

  .music-playlist-item:hover {
    background: var(--playlist-item-hover, rgba(0, 0, 0, 0.05));
  }

  .music-playlist-item.active {
    background: var(--playlist-item-active-bg, rgba(0, 0, 0, 0.08));
    color: var(--playlist-item-active-text, #333);
    font-weight: 600;
  }

  .music-playlist-inner::-webkit-scrollbar {
    width: 6px;
  }

  .music-playlist-inner::-webkit-scrollbar-track {
    background: transparent;
  }

  .music-playlist-inner::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }

  .music-playlist-inner::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;
  document.head.appendChild(styleSheet);

  // ================================================================
  // 第三部分：核心变量声明
  // ================================================================
  
  // 播放状态变量
  let isPlaying = false;
  let isExpanded = false;
  let showPlaylist = false;
  let playlist = [];
  let currentIndex = 0;
  
  // 动画相关变量
  let rotationAngle = 0;
  let animationFrameId = null;
  
  // 定时器变量
  let autoCollapseTimer = null;
  let isInitialAutoCollapse = false; // 标记首次自动收起是否已完成
  
  // 音量控制变量
  let lastVolume = 0.5;
  
  // 尺寸配置
  const ballSize = window.MusicPlayerBallSize || 50;
  
  // 音频对象
  const audio = new Audio();
  audio.volume = window.MusicPlayerDefaultVolume || 0.5;

  // ================================================================
  // 第四部分：UI 元素创建
  // ================================================================
  
  // 4.1 创建主容器
  const container = document.createElement("div");
  container.className = "music-player-container";
  container.style.width = `${ballSize}px`;
  container.style.height = `${ballSize}px`;
  document.body.appendChild(container);

  // 4.2 创建主内容区域
  const mainSection = document.createElement("div");
  mainSection.className = "music-player-main";

  // 4.3 创建 GitHub 链接图标
  let githubLink = null;
  if (window.MusicPlayerGitHubUrl && window.MusicPlayerGitHubUrl.trim() !== "" && window.MusicPlayerGitHubUrl !== false) {
    const githubIconSize = window.MusicPlayerGitHubIconSize || 24;
    container.style.setProperty('--github-icon-size', `${githubIconSize}px`);
    
    githubLink = document.createElement("a");
    githubLink.className = "music-github-link";
    githubLink.href = window.MusicPlayerGitHubUrl;
    githubLink.target = "_blank";
    githubLink.rel = "noopener noreferrer";
    githubLink.title = "View on GitHub";
    githubLink.innerHTML = '<i class="iconfont icon-github"></i>';
    githubLink.style.display = "none";
    githubLink.onclick = (e) => e.stopPropagation();
    mainSection.appendChild(githubLink);
  }

  // 4.4 创建悬浮球封面区域（收起状态）
  const ballAlbum = document.createElement("div");
  ballAlbum.className = "music-ball-album";
  ballAlbum.style.width = `${ballSize}px`;
  ballAlbum.style.height = `${ballSize}px`;

  const ballRotating = document.createElement("div");
  ballRotating.className = "music-ball-rotating";

  const ballImage = document.createElement("img");
  ballImage.className = "music-ball-image";
  ballImage.style.display = 'none';

  const ballOverlay = document.createElement("div");
  ballOverlay.className = "music-ball-overlay";
  const ballIconSize = window.MusicPlayerBallIconSize || 18;
  ballOverlay.innerHTML = `<i class="iconfont icon-play" style="font-size: ${ballIconSize}px;"></i>`;

  ballRotating.appendChild(ballImage);
  ballAlbum.append(ballRotating, ballOverlay);

  // 4.5 创建展开状态封面区域（唱片效果）
  const expandedAlbum = document.createElement("div");
  expandedAlbum.className = "music-expanded-album";
  const expandedAlbumSize = window.MusicPlayerExpandedAlbumSize || ballSize;
  expandedAlbum.style.width = `${expandedAlbumSize}px`;
  expandedAlbum.style.height = `${expandedAlbumSize}px`;

  const expandedRotating = document.createElement("div");
  expandedRotating.className = "music-expanded-rotating";

  const expandedBase = document.createElement("div");
  expandedBase.className = "music-expanded-base";

  const expandedImage = document.createElement("img");
  expandedImage.className = "music-expanded-image";
  expandedImage.style.display = 'none';

  const expandedOverlay = document.createElement("div");
  expandedOverlay.className = "music-expanded-overlay";
  expandedOverlay.innerHTML = '<i class="iconfont icon-play" style="font-size: 24px;"></i>';

  expandedRotating.append(expandedBase, expandedImage);
  expandedAlbum.append(expandedRotating, expandedOverlay);

  // 4.6 创建信息和控制区域
  const infoSection = document.createElement("div");
  infoSection.className = "music-info-section";

  // 4.6.1 歌曲信息
  const trackInfo = document.createElement("div");
  trackInfo.className = "music-track-info";
  trackInfo.innerHTML = `
    <div class="music-artist">${window.MusicPlayerTitle || "Music Player"}</div>
    <div class="music-title">未播放</div>
  `;

  // 4.6.2 进度条区域
  const progressSection = document.createElement("div");
  progressSection.className = "music-progress-section";
  
  const progressBar = document.createElement("div");
  progressBar.className = "music-progress-bar";
  progressBar.innerHTML = '<div class="music-progress-fill"></div>';
  
  const timeDisplay = document.createElement("div");
  timeDisplay.className = "music-time";
  timeDisplay.innerHTML = `
    <span class="music-current-time">0:00</span>
    <span class="music-total-time">0:00</span>
  `;
  
  progressSection.append(progressBar, timeDisplay);

  // 4.6.3 控制按钮
  const controls = document.createElement("div");
  controls.className = "music-controls";

  const prevBtn = document.createElement("button");
  prevBtn.className = "music-btn";
  prevBtn.innerHTML = '<i class="iconfont icon-backward"></i>';
  prevBtn.title = "上一曲";

  const playBtn = document.createElement("button");
  playBtn.className = "music-btn play-btn";
  playBtn.innerHTML = '<i class="iconfont icon-play"></i>';
  playBtn.title = "播放/暂停";

  const nextBtn = document.createElement("button");
  nextBtn.className = "music-btn";
  nextBtn.innerHTML = '<i class="iconfont icon-forward"></i>';
  nextBtn.title = "下一曲";

  const listBtnWrapper = document.createElement("div");

  const listBtn = document.createElement("button");
  listBtn.className = "music-btn";
  listBtn.innerHTML = '<i class="iconfont icon-list-ul"></i>';
  listBtn.title = "播放列表";

  listBtnWrapper.appendChild(listBtn);

  const volumeControl = document.createElement("div");
  volumeControl.className = "music-volume-control";
  
  const volumeBtn = document.createElement("button");
  volumeBtn.className = "music-btn";
  volumeBtn.innerHTML = '<i class="iconfont icon-volume"></i>';
  volumeBtn.title = "音量";

  const volumeSlider = document.createElement("div");
  volumeSlider.className = "music-volume-slider";
  volumeSlider.innerHTML = '<input type="range" min="0" max="100" value="50">';

  volumeControl.append(volumeBtn, volumeSlider);

  controls.append(prevBtn, playBtn, nextBtn, listBtnWrapper, volumeControl);
  infoSection.append(trackInfo, progressSection, controls);
  mainSection.append(ballAlbum, expandedAlbum, infoSection);

  // 4.7 创建独立的音波容器
  const waveContainer = document.createElement("div");
  waveContainer.className = "wave-container";
  
  const WAVES_COUNT = 4;
  const waveSpeedValue = window.MusicPlayerWaveSpeed || 2.0;
  const delayInterval = waveSpeedValue / WAVES_COUNT;
  for (let i = 0; i < WAVES_COUNT; i++) {
    const wave = document.createElement("div");
    wave.className = "wave";
    wave.style.animationDelay = `${i * delayInterval}s`;
    waveContainer.appendChild(wave);
  }

  container.append(waveContainer, mainSection);

  // 4.8 创建播放列表
  const playlistDiv = document.createElement("div");
  playlistDiv.className = "music-playlist";
  
  const playlistHeader = document.createElement("div");
  playlistHeader.className = "music-playlist-header";
  playlistHeader.innerHTML = `
    <span>播放列表</span>
    <i class="iconfont icon-close music-playlist-close"></i>
  `;
  
  const playlistInner = document.createElement("div");
  playlistInner.className = "music-playlist-inner";
  
  const playlistContent = document.createElement("div");
  playlistContent.className = "music-playlist-content";
  
  playlistInner.appendChild(playlistContent);
  playlistDiv.append(playlistHeader, playlistInner);
  container.appendChild(playlistDiv); // 直接挂载到容器，避免被 mainSection 的 overflow:hidden 裁剪

  // 获取音量输入控件
  const volumeInput = volumeSlider.querySelector('input');
  volumeInput.value = audio.volume * 100;

  // ================================================================
  // 第五部分：播放列表功能
  // ================================================================
  
  // 5.1 从API获取播放列表
  async function loadPlaylist() {
    try {
      const response = await fetch(window.MusicPlayerAPIUrl);
      const data = await response.json();
      
      if (data && data.data && data.data.length > 0) {
        const coverList = window.MusicPlayerCoverList && window.MusicPlayerCoverList.length > 0
          ? window.MusicPlayerCoverList
          : null;
        
        playlist = data.data.map(item => {
          const randomCover = coverList 
            ? coverList[Math.floor(Math.random() * coverList.length)]
            : null;
          
          // 解析文件名：格式为 "歌曲名-作者.mp3"
          const nameWithoutExt = item.filename.replace(/\.[^/.]+$/, "");
          const parts = nameWithoutExt.split('-');
          const songTitle = parts.length > 1 ? parts[0].trim() : nameWithoutExt;
          const songArtist = parts.length > 1 ? parts.slice(1).join('-').trim() : (window.MusicPlayerTitle || "Music Player");
          
          return {
            url: item.url,
            title: songTitle,
            artist: songArtist,
            cover: randomCover
          };
        });
        
        renderPlaylist();
        
        const randomIndex = Math.floor(Math.random() * playlist.length);
        loadTrack(randomIndex);
      } else {
        console.warn("播放列表为空");
      }
    } catch (error) {
      console.error("获取播放列表失败:", error);
    }
  }

  // 5.2 渲染播放列表
  function renderPlaylist() {
    playlistContent.innerHTML = playlist.map((track, index) => 
      `<div class="music-playlist-item ${index === currentIndex ? 'active' : ''}" data-index="${index}">
        ${index + 1}. ${track.title}
      </div>`
    ).join('');

    playlistContent.querySelectorAll('.music-playlist-item').forEach(item => {
      item.onclick = () => {
        const index = parseInt(item.dataset.index);
        loadTrack(index);
        if (isPlaying) play();
        
        // 切换歌曲后自动关闭播放列表
        if (showPlaylist) {
          togglePlaylist();
        }
      };
    });
  }

  // 5.3 加载指定曲目
  function loadTrack(index) {
    if (playlist.length === 0) return;
    
    currentIndex = index;
    const track = playlist[currentIndex];
    
    audio.src = track.url;
    updateInfo({
      title: track.title,
      artist: track.artist,
      cover: track.cover
    });

    playlistContent.querySelectorAll('.music-playlist-item').forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });
  }

  // 5.4 更新歌曲信息显示
  function updateInfo(info) {
    if (info.title) {
      trackInfo.querySelector(".music-title").textContent = info.title;
    }
    if (info.artist) {
      trackInfo.querySelector(".music-artist").textContent = info.artist;
    }
    
    if (info.cover) {
      ballImage.src = info.cover;
      expandedImage.src = info.cover;
      ballImage.style.display = 'block';
      expandedImage.style.display = 'block';
    } else {
      ballImage.style.display = 'none';
      expandedImage.style.display = 'none';
    }
  }

  // ================================================================
  // 第六部分：播放控制功能
  // ================================================================
  
  // 6.1 播放
  function play() {
    audio.play();
    setPlaying(true);
  }

  // 6.2 暂停
  function pause() {
    audio.pause();
    setPlaying(false);
  }

  // 6.3 上一曲
  function prevTrack() {
    if (playlist.length === 0) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    if (isPlaying) play();
  }

  // 6.4 下一曲
  function nextTrack() {
    if (playlist.length === 0) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    if (isPlaying) play();
  }

  // 6.5 设置播放状态
  function setPlaying(playing) {
    isPlaying = playing;
    if (playing) {
      container.classList.add("playing");
      playBtn.innerHTML = '<i class="iconfont icon-pause"></i>';
      ballOverlay.innerHTML = '<i class="iconfont icon-pause" style="font-size: 24px;"></i>';
      expandedOverlay.innerHTML = '<i class="iconfont icon-pause" style="font-size: 24px;"></i>';
      
      if (isExpanded && animationFrameId === null) {
        rotateAlbum();
      }
    } else {
      container.classList.remove("playing");
      playBtn.innerHTML = '<i class="iconfont icon-play"></i>';
      ballOverlay.innerHTML = '<i class="iconfont icon-play" style="font-size: 24px;"></i>';
      expandedOverlay.innerHTML = '<i class="iconfont icon-play" style="font-size: 24px;"></i>';
      
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }

  // 6.6 唱片旋转动画
  function rotateAlbum() {
    if (isPlaying && isExpanded) {
      const speed = window.MusicPlayerRotationSpeed || 10;
      const degreesPerFrame = 360 / (speed * 60);
      rotationAngle += degreesPerFrame;
      expandedRotating.style.transform = `rotate(${rotationAngle}deg)`;
      animationFrameId = requestAnimationFrame(rotateAlbum);
    }
  }

  // 6.7 格式化时间
  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // 6.8 更新进度条
  function updateProgress() {
    const progressFill = progressBar.querySelector('.music-progress-fill');
    const currentTimeEl = timeDisplay.querySelector('.music-current-time');
    const totalTimeEl = timeDisplay.querySelector('.music-total-time');
    
    const current = audio.currentTime;
    const duration = audio.duration;
    
    if (duration && !isNaN(duration)) {
      const percentage = (current / duration) * 100;
      progressFill.style.width = `${percentage}%`;
      currentTimeEl.textContent = formatTime(current);
      totalTimeEl.textContent = formatTime(duration);
    }
  }

  // ================================================================
  // 第七部分：UI 交互功能
  // ================================================================
  
  // 7.1 展开播放器
  function expandPlayer(enableClickOutside = true) {
    isExpanded = true;
    container.classList.add("expanded");

    container.style.opacity = '1';
    clearTimeout(window._musicOpacityTimer);
    clearTimeout(autoCollapseTimer);

    ballAlbum.style.border = "none";

    if (githubLink) {
      githubLink.style.display = "flex";
    }

    if (isPlaying && animationFrameId === null) {
      rotateAlbum();
    }

    // 只有非首次展开时才添加点击外部监听
    if (enableClickOutside) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }
  }

  // 7.2 收起播放器
  function collapsePlayer() {
    isExpanded = false;
    showPlaylist = false;
    container.classList.remove("expanded");
    playlistDiv.classList.remove("show");
    clearTimeout(autoCollapseTimer);
    
    if (githubLink) {
      githubLink.style.display = "none";
    }
    
    updateTheme();
    
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    document.removeEventListener('click', handleClickOutside);

    startOpacityTimer();
  }

  // 7.3 启动透明度降低定时器
  function startOpacityTimer() {
    clearTimeout(window._musicOpacityTimer);
    container.style.opacity = '1';
    
    window._musicOpacityTimer = setTimeout(() => {
      if (!isExpanded) {
        container.style.opacity = '0.3';
      }
    }, 2600);
  }

  // 7.4 重置透明度定时器
  function resetOpacityTimer() {
    if (!isExpanded) {
      container.style.opacity = '1';
      startOpacityTimer();
    }
  }

  // 7.5 取消首次自动收起（用户交互时调用）
  function cancelInitialAutoCollapse() {
    if (!isInitialAutoCollapse) {
      clearTimeout(autoCollapseTimer);
      isInitialAutoCollapse = true; // 标记首次自动收起已被取消
      
      // 用户首次交互后，启用点击外部收起功能
      if (isExpanded) {
        setTimeout(() => {
          document.addEventListener('click', handleClickOutside);
        }, 0);
      }
    }
  }

  // 7.6 点击外部关闭
  function handleClickOutside(e) {
    if (!container.contains(e.target)) {
      collapsePlayer();
    }
  }

  // 7.7 切换播放列表
  function togglePlaylist() {
    showPlaylist = !showPlaylist;
    playlistDiv.classList.toggle("show", showPlaylist);
    
    if (showPlaylist) {
      setTimeout(() => {
        document.addEventListener('click', handlePlaylistClickOutside);
      }, 0);
    } else {
      document.removeEventListener('click', handlePlaylistClickOutside);
    }
  }

  // 7.8 播放列表外部点击关闭
  function handlePlaylistClickOutside(e) {
    // 排除播放列表本身、列表按钮和音量控制区域
    const isVolumeControl = e.target.closest('.music-volume-control');
    if (!playlistDiv.contains(e.target) && !listBtn.contains(e.target) && !isVolumeControl) {
      togglePlaylist();
    }
  }

  // 7.9 更新音量滑块进度显示
  function updateSliderProgress() {
    const percent = volumeInput.value;
    container.style.setProperty('--slider-percent', `${percent}%`);
  }

  // 7.10 更新音量图标
  function updateVolumeIcon() {
    if (audio.volume === 0) {
      volumeBtn.innerHTML = '<i class="iconfont icon-mute"></i>';
    } else {
      volumeBtn.innerHTML = '<i class="iconfont icon-volume"></i>';
    }
  }

  // ================================================================
  // 第八部分：主题适配功能
  // ================================================================
  
  function updateTheme() {
    const theme = document.documentElement.getAttribute("data-theme");
    const isDark =
      theme === "dark" ||
      document.documentElement.classList.contains("dark") ||
      (theme !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const opacity = window.MusicPlayerOpacity || 0.8;
    const bgColor = isDark
      ? `rgba(30, 30, 30, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`;
    const textColor = isDark ? "#fff" : "#333";
    const buttonColor = isDark ? "#fff" : "#242c36";

    container.style.backgroundColor = bgColor;
    
    const titleEl = trackInfo.querySelector(".music-title");
    const artistEl = trackInfo.querySelector(".music-artist");
    if (titleEl) titleEl.style.color = textColor;
    if (artistEl) artistEl.style.color = textColor;
    
    [prevBtn, playBtn, nextBtn, listBtn, volumeBtn].forEach(
      (btn) => btn && (btn.style.color = buttonColor)
    );

    if (githubLink) {
      githubLink.style.color = buttonColor;
    }

    const sliderBg = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)";
    const sliderFill = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(36, 44, 54, 0.8)";
    const sliderThumb = isDark ? "#fff" : "#242c36";
    container.style.setProperty('--slider-bg', sliderBg);
    container.style.setProperty('--slider-fill', sliderFill);
    container.style.setProperty('--slider-thumb', sliderThumb);

    const currentStrokeWidth = window.MusicPlayerStrokeWidth || 0;
    const currentStrokeColor = window.MusicPlayerStrokeColor ||
      (isDark ? "#000" : "#fff");
    
    if (!isExpanded && currentStrokeWidth > 0) {
      ballAlbum.style.border = `${currentStrokeWidth}px solid ${currentStrokeColor}`;
      ballAlbum.style.boxSizing = "border-box";
    }

    const waveColor = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.4)";
    container.style.setProperty('--wave-color', waveColor);
    
    const initialScale = 1.0;
    container.style.setProperty('--wave-initial-scale', initialScale);

    const progressBg = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)";
    const progressFill = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(36, 44, 54, 0.8)";
    container.style.setProperty('--progress-bg', progressBg);
    container.style.setProperty('--progress-fill', progressFill);

    const playlistBg = isDark ? "rgba(40, 40, 40, 0.95)" : "rgba(255, 255, 255, 0.95)";
    const playlistHeaderBg = isDark ? "rgba(40, 40, 40, 0.98)" : "rgba(255, 255, 255, 0.98)";
    const playlistHeaderText = isDark ? "#fff" : "#333";
    const playlistBorder = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
    const playlistItemText = isDark ? "rgba(255, 255, 255, 0.7)" : "#555";
    const playlistItemBorder = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const playlistItemHover = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
    const playlistItemActiveBg = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.08)";
    const playlistItemActiveText = isDark ? "#fff" : "#333";

    container.style.setProperty('--playlist-bg', playlistBg);
    container.style.setProperty('--playlist-header-bg', playlistHeaderBg);
    container.style.setProperty('--playlist-header-text', playlistHeaderText);
    container.style.setProperty('--playlist-border', playlistBorder);
    container.style.setProperty('--playlist-item-text', playlistItemText);
    container.style.setProperty('--playlist-item-border', playlistItemBorder);
    container.style.setProperty('--playlist-item-hover', playlistItemHover);
    container.style.setProperty('--playlist-item-active-bg', playlistItemActiveBg);
    container.style.setProperty('--playlist-item-active-text', playlistItemActiveText);
  }

  // ================================================================
  // 第九部分：事件绑定
  // ================================================================
  
  // 9.1 悬浮球点击事件
  ballAlbum.onclick = () => {
    expandPlayer();
    cancelInitialAutoCollapse();
  };

  ballAlbum.onmouseenter = () => {
    resetOpacityTimer();
    cancelInitialAutoCollapse();
  };

  // 9.2 展开封面点击事件
  expandedAlbum.onclick = () => {
    cancelInitialAutoCollapse();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // 9.3 控制按钮点击事件
  playBtn.onclick = (e) => {
    e.stopPropagation();
    cancelInitialAutoCollapse();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  prevBtn.onclick = (e) => {
    e.stopPropagation();
    cancelInitialAutoCollapse();
    prevTrack();
  };

  nextBtn.onclick = (e) => {
    e.stopPropagation();
    cancelInitialAutoCollapse();
    nextTrack();
  };

  listBtn.onclick = (e) => {
    e.stopPropagation();
    cancelInitialAutoCollapse();
    togglePlaylist();
  };

  // 9.4 播放列表关闭按钮
  const closeBtn = playlistHeader.querySelector('.music-playlist-close');
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    cancelInitialAutoCollapse();
    togglePlaylist();
  };

  // 9.5 音量控制事件
  volumeInput.oninput = (e) => {
    cancelInitialAutoCollapse();
    audio.volume = e.target.value / 100;
    if (audio.volume > 0) {
      lastVolume = audio.volume;
    }
    updateSliderProgress();
    updateVolumeIcon();
  };

  volumeBtn.onclick = (e) => {
    e.stopPropagation();
    cancelInitialAutoCollapse();
    if (audio.volume === 0) {
      audio.volume = lastVolume > 0 ? lastVolume : 0.5;
      volumeInput.value = audio.volume * 100;
    } else {
      lastVolume = audio.volume;
      audio.volume = 0;
      volumeInput.value = 0;
    }
    updateSliderProgress();
    updateVolumeIcon();
  };

  // 9.6 音频事件监听
  audio.onended = nextTrack;
  audio.onerror = () => {
    console.error("音频加载失败");
    setPlaying(false);
  };
  audio.ontimeupdate = updateProgress;
  audio.onloadedmetadata = updateProgress;

  // 9.7 进度条点击跳转
  progressBar.onclick = (e) => {
    e.stopPropagation();
    cancelInitialAutoCollapse();
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * audio.duration;
  };

  // 9.8 容器鼠标事件（取消首次自动收起，重置透明度）
  container.onmouseenter = () => {
    if (isExpanded) {
      cancelInitialAutoCollapse();
    } else {
      resetOpacityTimer();
    }
  };

  // 9.9 主题变化监听
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme);
  document.documentElement.addEventListener("themechange", updateTheme);
  
  const themeObserver = new MutationObserver(updateTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class"],
  });

  // ================================================================
  // 第十部分：初始化执行
  // ================================================================
  
  // 10.1 设备检测与音波样式
  const isMobile = window.innerWidth <= 768;
  const waveStrokeWidth = isMobile
    ? (window.MusicPlayerWaveMobileStrokeWidth || "1.5px")
    : (window.MusicPlayerWaveStrokeWidth || "2.0px");
  container.style.setProperty('--wave-stroke-width', waveStrokeWidth);

  const waveSpeed = (window.MusicPlayerWaveSpeed || 2.4) + 's';
  const waveScale = window.MusicPlayerWaveScale || 1.6;
  container.style.setProperty('--wave-speed', waveSpeed);
  container.style.setProperty('--wave-scale', waveScale);

  // 移动端额外适配
  function applyMobileAdaptation(mobile) {
    if (mobile) {
      container.style.bottom = '16px';
      container.style.left = '12px';
      container.style.touchAction = 'manipulation';
      const currentSize = parseInt(container.style.width);
      if (currentSize < 48) {
        container.style.width = '48px';
        container.style.height = '48px';
        ballAlbum.style.width = '48px';
        ballAlbum.style.height = '48px';
      }
    } else {
      container.style.bottom = '20px';
      container.style.left = '20px';
      container.style.touchAction = '';
    }
  }
  if (isMobile) applyMobileAdaptation(true);

  // 断点切换监听
  window.addEventListener('resize', () => {
    const nowMobile = window.innerWidth <= 768;
    applyMobileAdaptation(nowMobile);
    const newStrokeWidth = nowMobile
      ? (window.MusicPlayerWaveMobileStrokeWidth || "1.5px")
      : (window.MusicPlayerWaveStrokeWidth || "2.0px");
    container.style.setProperty('--wave-stroke-width', newStrokeWidth);
  });

  // 10.2 加载播放列表
  loadPlaylist();
  
  // 10.3 初始化滑块进度显示
  const initialVolume = audio.volume * 100;
  container.style.setProperty('--slider-percent', `${initialVolume}%`);
  
  // 10.4 初始化主题
  updateTheme();

  // 10.5 首次加载时自动展开面板（不启用点击外部收起）
  setTimeout(() => {
    expandPlayer(false); // 传入 false，首次展开不启用点击外部收起
    
    // 启动一次性自动收起定时器
    const autoCollapseDelay = window.MusicPlayerAutoCollapse || 2600;
    autoCollapseTimer = setTimeout(() => {
      if (isExpanded && !isInitialAutoCollapse) {
        collapsePlayer();
        isInitialAutoCollapse = true; // 标记首次自动收起已完成
      }
    }, autoCollapseDelay);
  }, 100);
}

// ================================================================
// 启动播放器
// ================================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMusicPlayer);
} else {
  initMusicPlayer();
}
