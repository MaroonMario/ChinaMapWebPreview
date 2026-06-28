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
| 已知 Bug | 无 |

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
