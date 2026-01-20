# Bookart AI 项目开发 Prompt 记录

## 2026-01-20 10:35 - 项目初始化与开发规范设定

### 任务关键词
`项目初始化` `开发规范` `Git工作流` `文档管理` `部署配置`

### 需求描述

#### 1. 代码组织规范
- **开发目录**: 所有新代码在 `\Code\` 目录下编写
- **参考目录**: `\Code2\` 目录作为 UI 设计示例，参考其简洁明快的设计风格
- **产品文档**: `\PRD\` 目录下存放产品需求文档，严格按照文档要求开发
- **保护原则**: 不改动 Code 以外的其他目录代码

#### 2. 文档管理规范
- **开发文档**: 每个功能模块完成后需要进行审查和总结
- **文档位置**: 总结文档保存在 `\PRD\result\` 目录下
- **命名规范**: 文档名称需保持统一性和易读性
- **Prompt 记录**: 将每次用户输入的 prompt 重新组织语言后保存到 `\PRD\bookart_prompt.md`
  - 格式: Markdown
  - 内容: 包含日期时间、功能任务关键词、重新组织后的专业描述

#### 3. Git 版本控制规范
- **远程仓库**: https://github.com/baoqj/bookart.git
- **分支管理策略**:
  - `main` 分支: 生产环境代码
  - 功能分支: 按功能模块创建独立分支
- **提交规范**: 每次完成代码编写后推送到 Git

#### 4. 部署流程
- **平台**: Vercel
- **自动化部署**:
  - 功能开发阶段: 每次 push 到功能分支 → 自动生成 Preview 部署
  - 验收通过: 合并到 main 分支 → 自动触发 Production 部署
- **工作流**: `功能开发 → Preview 测试 → 验收 → 合并主分支 → 生产发布`

#### 5. 设计风格要求
- 简洁明快的界面风格
- 逻辑清晰
- 方便易用
- 参考 Code2 目录的设计实现

### 执行计划

1. ✅ 创建 `PRD/result` 目录用于存放开发总结文档
2. ✅ 创建 `PRD/bookart_prompt.md` 文件记录开发 prompt
3. ✅ 初始化 Git 仓库
4. ✅ 配置 Git 远程仓库和分支策略
5. ✅ 创建 .gitignore 文件
6. ✅ 在 Code 目录下初始化项目结构（Next.js + TypeScript + Tailwind）
7. ⏳ 配置 Vercel 部署（待功能分支推送后）
8. ✅ 开始按照 PRD 进行功能开发

### 开发工作流程

每个功能模块遵循以下流程：
1. 创建功能分支（命名规范：`feature/prompt-X-功能名称`）
2. 完成功能开发
3. 进行功能测试
4. 编写测试报告和功能总结（保存到 `PRD/result/`）
5. 提交代码并推送到功能分支
6. 在 Vercel Preview 环境验证
7. 验证通过后合并到 main 分支

---

## 2026-01-20 11:30 - 开始功能开发

### 任务关键词
`Prompt 0` `全站骨架` `路由架构` `数据模型` `Mock API` `基础布局`

### 功能模块：Prompt 0 - 全站信息架构与路由骨架

#### 技术要求
- Next.js App Router (app/ directory)
- TypeScript
- Tailwind CSS + shadcn/ui components
- 清晰简洁的布局，响应式设计（桌面优先）
- 不实现后端，使用 Mock API 和模拟数据
- 使用 Zustand 或 React Context 管理认证和积分状态
- 一致的布局：桌面端左侧边栏，移动端顶部导航栏
- 所有数据视图包含 loading、empty、error 三种状态
- 添加路由级别的骨架屏和可复用组件

#### 核心功能范围
1. **认证功能**：注册、登录、忘记密码
2. **项目管理**：列表、创建、项目详情
3. **文本导入**：粘贴文本 + 上传 .txt（仅 UI）
4. **段落选择**：显示切分的段落、多选、预览
5. **插图设置**：风格预设、色彩模式、画笔风格、纵横比、图片尺寸
6. **生成功能**：创建生成任务、显示任务状态、结果画廊、下载按钮
7. **积分系统**：header 显示积分、积分历史表格、购买积分 CTA
8. **账户管理**：个人资料 + 账单占位 + API 密钥占位
9. **管理员功能**：用户查询、手动调整积分/套餐（仅 UI）

#### 路由结构
```
/ - 营销落地页（简洁）
/auth/sign-in - 登录
/auth/sign-up - 注册
/auth/forgot - 忘记密码
/app - 认证后的应用布局
/app/projects - 项目列表
/app/projects/new - 创建新项目
/app/projects/[projectId] - 项目概览
/app/projects/[projectId]/manuscript - 书稿导入与段落管理
/app/projects/[projectId]/illustrations - 插图设置与生成
/app/credits - 积分余额、历史、购买
/app/account - 账户设置
/app/admin - 管理员面板（角色控制）
```

#### 数据模型（TypeScript 接口）
- User { id, email, name, role: 'user'|'admin', credits }
- Project { id, title, description, language, createdAt }
- Paragraph { id, index, content }
- IllustrationSettings { stylePreset, colorMode, brushStyle, aspectRatio, sizePreset }
- GenerationTask { id, projectId, paragraphIds, promptPreview, status, createdAt, updatedAt, errorMessage? }
- IllustrationAsset { id, taskId, url, width, height, createdAt }

#### UI 要求
- 侧边栏导航项：Projects, Illustrations（上下文相关）, Credits, Account, Admin（仅管理员）
- 项目页面内包含面包屑导航
- "New Project" 主要 CTA 按钮
- 项目详情页：Tabs（Overview, Manuscript, Illustrations）
- Manuscript 页面：左侧段落列表（带复选框）；右侧预览面板
- Illustrations 页面：设置面板 + "Generate" 按钮 + 任务列表 + 结果画廊
- Credits 页面：余额卡片、账本表格、"Buy credits" 模态框（仅 UI）
- 使用 shadcn/ui 组件：Dialog, Tabs, Card, Table, Badge, DropdownMenu, Toast
- 空状态使用简单图标（lucide-react）

#### 交付内容
- app/ 目录的文件/文件夹结构
- 主要布局组件和页面组件
- `/lib/api.ts` 中的 Mock API 层，包含函数：
  - listProjects, createProject, getProject
  - importManuscript, listParagraphs
  - createTask, listTasks, listAssets
  - getCreditsLedger, purchaseCredits
- 简单的认证守卫（将未认证用户重定向到 /auth/sign-in）

#### 开发目标
创建一个有凝聚力、类生产环境的前端应用。不编写后端代码。包含合理的占位内容。

---
