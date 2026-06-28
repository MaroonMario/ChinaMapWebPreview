# 开发进度

> 项目：可交互中国地图 Web  
> 当前版本：**v1.0.0**  
> 最后更新：**2026-06-28**

相关文档：[PRD](./PRD.md)

---

## 总体状态

| 指标 | 状态 |
|------|------|
| 当前阶段 | Phase 2 完成，Phase 3 待开始 |
| P0 需求 | 8 / 8 ✅ |
| P1 需求 | 0 / 5 ⬜ |
| 可运行 | ✅ `npm run dev` / `npm run build` |
| 已知 Bug | 无（已修复 file:// 白屏） |

---

## 阶段进度

| 阶段 | 范围 | 状态 | 完成日期 |
|------|------|------|----------|
| Phase 0 — 规划 | PRD、产品决策、技术选型 | ✅ 完成 | 2026-06-28 |
| Phase 1 — MVP | 地图渲染、悬停、点击详情、缩放平移 | ✅ 完成 | 2026-06-28 |
| Phase 2 — 测验 | 认位置测验、成绩反馈、模式切换 | ✅ 完成 | 2026-06-28 |
| Phase 3 — Polish | 本地进度、无障碍、深色模式等 P1 | ⬜ 未开始 | — |

---

## 需求完成度

### P0（Must-Have）

| ID | 需求 | 状态 |
|----|------|------|
| R1 | 省级矢量中国地图 | ✅ |
| R2 | 悬停高亮 | ✅ |
| R3 | 点击详情 | ✅ |
| R4 | 缩放与平移 | ✅ |
| R5 | 认位置测验 | ✅ |
| R6 | 模式切换 | ✅ |
| R7 | 响应式布局 | ✅ |
| R8 | 静态部署 | ✅ |

### P1（Nice-to-Have）

| ID | 需求 | 状态 |
|----|------|------|
| R9 | 反向测验（认名称） | ⬜ |
| R10 | 本地进度（localStorage） | ⬜ |
| R11 | 键盘无障碍 | ⬜ |
| R12 | 深色模式 | ⬜ |
| R13 | 区域筛选 | ⬜ |

---

## 更新日志

### 2026-06-28 — 壁纸轮播间隔改为 6 秒

**类型：** 功能

**完成内容：**
- 壁纸模式省份随机高亮切换间隔由 4 秒调整为 6 秒

**涉及文件：**
- `src/components/WallpaperView.tsx`

---

### 2026-06-28 — 修复壁纸轮播省界描边

**类型：** Bug 修复

**问题：** 壁纸模式随机高亮省份时，蓝色省界在部分边缘显示不全（与邻省共享边界被覆盖、贴边外缘被裁切）。

**原因：** 通过 `geo.regions` 的 `borderColor` / `borderWidth` 无法完整绘制省界，与测验高亮同类问题。

**修复：** 壁纸高亮改用 `geo.regions` 仅设填充色，完整省界由绑定 `geoIndex` 的 `lines` 系列绘制（线宽 1.5，与悬停 emphasis 一致）。

**涉及文件：**
- `src/components/ChinaMap.tsx`

---

### 2026-06-28 — 壁纸视图随机轮播省名

**类型：** 功能

**完成内容：**
- 壁纸模式下每 6 秒随机高亮一个省份
- 高亮样式与鼠标悬停一致（蓝色填充、边框及 tooltip 省名）
- 连续轮播避免重复同一省份

**涉及文件：**
- `src/components/WallpaperView.tsx`
- `src/components/ChinaMap.tsx`

---

### 2026-06-28 — 默认视图改为壁纸

**类型：** 功能

**完成内容：**
- 打开应用默认进入全屏壁纸视图（含离线 `file://`）
- 退出壁纸后 URL 为 `#app`；再次进入壁纸清除 hash 恢复默认
- 保留 `#wallpaper` 与无 hash 行为一致（均为壁纸）

**涉及文件：**
- `src/App.tsx`

---

### 2026-06-28 — 修复窗口缩放地图压扁

**类型：** Bug 修复

**问题：** 调整浏览器窗口宽高时，地图随容器独立拉伸，省界形状被压扁或拉宽。

**原因：** `chart.resize()` 直接使用容器完整宽高，ECharts geo 填满可用矩形时未保持地图投影宽高比；容器宽高比从 0.69 到 2.55 变化时，渲染地图 bbox 宽高比从 0.88 畸变为 2.76。

**修复：** 按固定 `MAP_VIEW_ASPECT` 做 letterbox 缩放并居中画布；geo 增加 `aspectScale` / `layoutCenter` / `layoutSize`；边距改为百分比。

**涉及文件：**
- `src/components/ChinaMap.tsx`
- `src/index.css`

---

### 2026-06-28 — 修复测验边线缩放延迟

**类型：** Bug 修复

**问题：** 答案省份蓝色边线在地图缩放/平移时滞后于 geo 图层移动。

**原因：** 边线使用独立 `map` overlay，需等 `georoam` 事件后再 `setOption` 同步 center/zoom，产生一帧以上延迟。

**修复：** 改回绑定 `geoIndex` 的 `lines` 系列绘制答案边线，与 geo 共用坐标变换，移除 `georoam` 手动同步。

**涉及文件：**
- `src/components/ChinaMap.tsx`

---

### 2026-06-28 — 修复测验答错高亮与省界描边

**类型：** Bug 修复

**问题：**
1. 测验答错后，正确答案未在地图上显示绿色标识
2. 高亮省份的蓝色省界在部分边缘显示不全

**原因：**
1. `map` series 指定 `geoIndex` 后，`data.itemStyle` 无法作用于底层 `geo` 图层
2. 仅对高亮省单独加粗蓝色描边时，与邻省共享边界会被覆盖；地图贴边时外缘描边易被裁切

**修复：**
- 改用 `geo.regions` 设置高亮填充色（绿/红/蓝）
- 新增独立 `map`  overlay 图层，仅对答案省份绘制完整蓝色边线（与 geo 同步缩放/平移）
- 为 `geo` 增加 24px 内边距，防止外缘描边被容器裁切

**涉及文件：**
- `src/components/ChinaMap.tsx`

---

### 2026-06-28 — 地图显示省会开关

**类型：** 功能

**完成内容：**
- 地图左下角新增「显示省会」复选框，可切换 34 个省级行政区省会标注
- 开启后在地图上以红点 + 城市名标注各省会/首府位置
- 新增省会经纬度数据，地图改用 geo + map 双层结构以支持散点叠加

**涉及文件：**
- `src/data/capitals.ts`
- `src/components/ChinaMap.tsx`
- `src/App.tsx`
- `src/index.css`

---

### 2026-06-28 — 修复壁纸模式 Hooks 报错

**类型：** Bug 修复

**问题：** 进入壁纸模式后控制台报 `Rendered fewer hooks than expected`，页面白屏。

**原因：** `handleProvinceClick` 的 `useCallback` 写在壁纸模式提前 `return` 之后，违反 Hooks 规则。

**修复：** 将所有 Hooks 移到条件 return 之前。

**涉及文件：**
- `src/App.tsx`

---

### 2026-06-28 — 移除开发目录离线方案

**类型：** 重构

**完成内容：**
- 根 `index.html` 恢复为标准 Vite 开发入口，移除 file:// 启动页与跳转逻辑
- 简化 `vite.config.ts`，仅保留 release 构建所需的 crossorigin 修复
- 离线验证改为只检查 `release/index.html`；`dist/`、`release/` 加入 `.gitignore`
- README / Cursor 规则：开发用 `npm run dev`，分发用 `npm run pack`

**涉及文件：**
- `index.html`
- `vite.config.ts`
- `scripts/check-offline-console.mjs`
- `.gitignore`
- `README.md`
- `.cursor/rules/verify-browser-console.mdc`

---

### 2026-06-28 — 可分发 release 文件夹

**类型：** 功能

**完成内容：**
- 新增 `npm run pack`：生成 `release/` 文件夹（`index.html` + favicon + 说明）
- 拷贝 `release/` 给他人即可双击 `index.html` 离线使用，无需 Node
- 打包后自动跑 `check:offline --release` 验证控制台

**涉及文件：**
- `scripts/pack-release.mjs`
- `scripts/check-offline-console.mjs`
- `package.json`
- `README.md`

---

### 2026-06-28 — 浏览器控制台自动验证

**类型：** 文档

**完成内容：**
- 新增 Cursor 规则：UI/构建修改后 Agent 须自行跑 `npm run check:offline` 检查控制台
- 新增 Playwright 脚本 `scripts/check-offline-console.mjs` 验证 `file://` 下 `dist/index.html`
- 当前验证通过：无 console error，地图 canvas 正常渲染

**涉及文件：**
- `.cursor/rules/verify-browser-console.mdc`
- `scripts/check-offline-console.mjs`
- `package.json`

---

### 2026-06-28 — 修复 crossorigin 误删导致语法错误

**类型：** Bug 修复

**问题：** 构建后全局替换 `crossorigin` 误删 JS 内 `crossOrigin` 字段（变成 `u=u.`），引发 `SyntaxError: Unexpected token ','`；`<script crossorigin>` 属性导致 file:// CORS。

**修复：**
- 仅移除 `<script type="module" crossorigin>` 标签属性，不触碰内联 JS
- 从 `dist/index.html` 剥离离线启动页代码
- 根 `index.html` 改为显示「打开地图 →」链接，无 JS 跳转

**涉及文件：**
- `vite.config.ts`
- `index.html`
- `dist/index.html`

---

### 2026-06-28 — 修复 file:// frame 安全错误

**类型：** Bug 修复

**问题：** Chrome 报 `Unsafe attempt to load URL ... from frame`，`location.replace` 与 `type="module"` 在 `file://` 下不可用。

**修复：**
- 根 `index.html` 改用 `<meta refresh>` + 手动链接，不再 `location.replace`
- 构建为 IIFE 经典脚本，构建后移除 `type="module"`
- `file://` 下壁纸模式仅用 React 状态，不用 hash/history API

**涉及文件：**
- `index.html`
- `vite.config.ts`
- `src/App.tsx`
- `dist/index.html`

---

### 2026-06-28 — 单文件 HTML 修复 file:// CORS

**类型：** Bug 修复

**问题：** Chrome 在 `file://` 下禁止加载外部 ES module（`dist/assets/*.js`），双击仍白屏。

**修复：**
- 引入 `vite-plugin-singlefile`，构建为单文件 `dist/index.html`（JS/CSS/地图数据全部内联）
- 不再依赖外部 `assets/` 脚本，规避 CORS

**涉及文件：**
- `vite.config.ts`
- `package.json`
- `dist/index.html`

---

### 2026-06-28 — 修复 Explorer 双击白屏

**类型：** Bug 修复

**问题：** 双击 `index.html` 页面空白；浏览器 `file://` 下 Vite 构建产物的 `crossorigin` 属性触发 CORS，且 `fetch(china.json)` 被拦截。

**修复：**
- 构建时移除 `crossorigin`，关闭 `modulePreload`
- 将 `china.json` 打包进 JS，不再依赖运行时 fetch
- 根 `index.html` 改为同步跳转 `dist/index.html`

**涉及文件：**
- `vite.config.ts`
- `src/components/ChinaMap.tsx`
- `src/data/china.json`
- `index.html`
- `dist/`

---

### 2026-06-28 — Explorer 双击离线使用完善

**类型：** 功能

**完成内容：**
- 加固根 `index.html` 跳转：兼容 Windows `\dist\` 路径，保留 hash/query
- `dist/` 缺失时显示友好提示，避免白屏
- 构建时自动移除 `dist/index.html` 中的跳转脚本
- `dist/` 纳入版本控制，克隆后可直接双击离线使用

**涉及文件：**
- `index.html`
- `vite.config.ts`
- `.gitignore`
- `dist/`
- `README.md`

---

### 2026-06-28 — 支持双击 index.html 离线使用

**类型：** 功能

**完成内容：**
- Vite 配置 `base: './'`，构建产物支持 `file://` 协议
- 地图数据改为相对路径加载
- 根目录 `index.html` 在本地双击时自动跳转至 `dist/index.html`
- README 补充离线使用说明

**涉及文件：**
- `vite.config.ts`
- `index.html`
- `src/components/ChinaMap.tsx`
- `README.md`

---

### 2026-06-28 — 壁纸视图

**类型：** 功能

**完成内容：**
- 新增全屏「壁纸」视图：隐藏标题、侧栏与模式面板，仅保留地图
- 保留悬停 tooltip、点击高亮、缩放与平移交互
- 支持 URL `#wallpaper` 直达；Esc 或右上角「退出」返回主界面
- 主界面 header 增加「壁纸」入口按钮

**涉及文件：**
- `src/components/WallpaperView.tsx`
- `src/components/ChinaMap.tsx`
- `src/App.tsx`
- `src/index.css`

---

### 2026-06-28 — 首次提交至 GitHub

**类型：** 文档

**完成内容：**
- 关联远程仓库 `git@github.com:MaroonMario/ChinaMapWebPreview.git`
- 首次提交 v1 完整代码与文档

**涉及文件：**
- 全项目初始版本

---

### 2026-06-28 — 初始化 Git 仓库

**类型：** 文档

**完成内容：**
- 执行 `git init`，默认分支 `main`
- 完善 `.gitignore`（node_modules、dist、日志、环境变量等）
- 保留 `.cursor/rules/` 纳入版本控制，忽略调试日志

**涉及文件：**
- `.gitignore`

---

### 2026-06-28 — 文档与进度机制

**类型：** 文档

- 新增 `docs/PROGRESS.md` 开发进度跟踪
- 新增 Cursor 规则：每次开发完成后自动更新本文件
- PRD 已存在于 `docs/PRD.md`

---

### 2026-06-28 — Bug 修复：悬停错位 & 地图加载失败

**类型：** Bug 修复

**问题：**
1. 鼠标悬停位置与高亮省份对不上
2. 调试期间出现「地图加载失败」

**原因：**
1. 悬停时在 `mouseover` 中反复调用 `setOption`，与 ECharts 内置 `emphasis` 冲突，导致命中区域偏移
2. 在首次 `setOption` 之前调用 `getOption()`，ECharts `_model` 为空，抛错触发加载失败

**修复：**
- 悬停仅使用 ECharts `emphasis`，不再在 `mouseover` 时重绘
- 首次加载先完整 `setOption`，后续只增量更新 `series.data`
- 加载后 `resize()` + `ResizeObserver` 同步画布尺寸

**涉及文件：**
- `src/components/ChinaMap.tsx`

---

### 2026-06-28 — v1 功能实现

**类型：** 功能

**完成内容：**
- 项目脚手架：React + Vite + TypeScript + ECharts
- 省级 GeoJSON（`public/china.json`，阿里云 DataV）
- 34 省元数据（`src/data/provinces.ts`）
- **探索模式**：悬停 tooltip、点击显示简称/省会/区域
- **测验模式**：认位置练习，每轮 10 题，对错反馈
- 清爽白底 + 蓝色高亮 UI
- 响应式布局（桌面 + 移动端）
- 静态构建与部署支持

**涉及文件：**
- `src/App.tsx`
- `src/components/ChinaMap.tsx`
- `src/components/ExplorePanel.tsx`
- `src/components/QuizPanel.tsx`
- `src/hooks/useQuiz.ts`
- `src/data/provinces.ts`
- `src/types.ts`
- `src/index.css`
- `README.md`

---

### 2026-06-28 — 产品规划

**类型：** 规划

- 确认 v1 范围：认位置测验、中文、白底蓝高亮、保留探索模式
- 编写 PRD（`docs/PRD.md`）

---

## 下一步计划

1. **Phase 3 候选**（按优先级）：
   - R10 本地进度：保存测验成绩与错题列表
   - R13 区域筛选：按大区高亮辅助记忆
   - R11 键盘无障碍
2. 部署到静态托管（GitHub Pages / Cloudflare Pages）
3. Lighthouse 性能优化（ECharts 按需加载）

---

## 维护说明

每次开发任务完成后，须在本文件 **更新日志** 追加一条记录，并同步更新：

- 文首「最后更新」日期
- **总体状态** / **阶段进度** / **需求完成度** 中受影响的条目
- 如有新 Bug 或已修复 Bug，更新「已知 Bug」

日志条目格式：

```markdown
### YYYY-MM-DD — 简短标题

**类型：** 功能 | Bug 修复 | 重构 | 文档 | 规划

**完成内容：**
- ...

**涉及文件：**（可选）
- path/to/file

**备注：**（可选）
```
