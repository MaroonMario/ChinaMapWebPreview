# 中国地图 Web

可交互中国省级地图，用于熟悉省界与「认位置」练习。

## 功能

- **探索模式**：悬停预览省名，点击查看简称、省会、所属区域
- **测验模式**：随机出题「请点击 XX 省」，每轮 10 题，即时反馈
- 地图支持缩放、拖拽，可重置视图

## 开发

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:5173` 即可，与常见 Vite 项目相同。

## 拷贝给他人（离线）

```bash
npm run pack
```

将生成的 **`release/` 整个文件夹** 拷贝给对方，双击其中的 `index.html` 即可，无需 Node。

> 修改源码后重新 `npm run pack` 再分发。

地图数据来自 [阿里云 DataV GeoJSON](https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json)。
