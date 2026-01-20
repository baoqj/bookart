# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Bookart AI 是一个 AI 书籍插图生成器的 SaaS 应用，帮助用户为书稿自动生成插图。主代码库位于 `Code2/` 目录中。

**核心工作流程：**
1. 用户上传书稿文本（粘贴或上传 .txt 文件）
2. AI 自动切分章节段落
3. 用户选择需要生成插图的段落
4. 配置插图风格（儿童故事、历史、教育等）
5. 批量生成插图并下载

**重要设计原则：**
- 用户无需注册登录即可完成完整工作流程
- 使用明亮柔和的配色方案，营造亲切易用的感觉
- 支持多语言（英文、法语、德语、西班牙语、日语、韩语、简体中文、繁体中文）

## 技术栈

- **框架**: Next.js 16 App Router (TypeScript)
- **UI**: Tailwind CSS 4 + shadcn/ui (Radix UI components)
- **状态管理**: 计划使用 Zustand 或 React Context
- **表单**: react-hook-form + zod 验证
- **主题**: next-themes (支持深色模式)
- **图标**: lucide-react
- **包管理器**: pnpm

## 常用命令

```bash
# 切换到代码目录
cd Code2

# 安装依赖
pnpm install

# 开发服务器（默认 http://localhost:3000）
pnpm dev

# 生产构建
pnpm build

# 运行生产构建
pnpm start

# 代码检查
pnpm lint
```

**注意**: `next.config.mjs` 中设置了 `typescript.ignoreBuildErrors: true`，生产环境前应移除此配置。

## 项目架构

### 目录结构

```
Code2/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证页面组（共享 layout）
│   │   └── auth/          # 登录、注册、忘记密码
│   ├── (app)/             # 认证后的主应用
│   │   └── app/           # 业务功能页面
│   │       ├── projects/  # 项目管理
│   │       ├── credits/   # 积分系统
│   │       ├── account/   # 用户账户
│   │       └── admin/     # 管理员功能
│   ├── (marketing)/       # 营销落地页
│   ├── dashboard/         # 旧版仪表板（待整合）
│   └── layout.tsx         # 根 layout
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件库
│   ├── auth-guard.tsx    # 认证保护组件
│   └── theme-provider.tsx
├── lib/                   # 工具库
│   ├── api.ts            # Mock API 客户端（模拟后端）
│   ├── types.ts          # TypeScript 类型定义
│   ├── mock-data.ts      # 模拟数据
│   └── utils.ts          # 工具函数
├── hooks/                 # React Hooks
├── public/               # 静态资源
└── styles/               # 全局样式
```

### 核心数据模型

**参见 `lib/types.ts`**，主要类型包括：

- `User`: 用户信息（id, email, name, role, credits）
- `Project`: 项目（title, description, language, manuscriptStatus）
- `Paragraph`: 段落（content, index, markedForIllustration）
- `IllustrationSettings`: 插图设置（风格、色彩、画笔、尺寸）
- `GenerationTask`: 生成任务（status: queued/running/succeeded/failed）
- `IllustrationAsset`: 生成的插图资源
- `CreditTransaction`: 积分交易记录

### API 层设计

**当前状态**: 使用 `lib/api.ts` 中的 mock API 模拟后端响应。

**API 模块划分**:
- `authApi`: 登录、注册、获取当前用户
- `projectsApi`: 项目 CRUD 操作
- `manuscriptApi`: 书稿导入、段落解析
- `illustrationsApi`: 创建生成任务、获取生成结果
- `creditsApi`: 积分余额、交易历史、购买积分
- `adminApi`: 用户管理、积分调整

所有 API 函数都包含模拟延迟（`delay()`）以模拟真实网络请求。

### 路由架构

**认证流程**:
- `/auth/sign-in` - 登录
- `/auth/sign-up` - 注册
- `/auth/forgot` - 忘记密码

**主应用**（需要认证，但 MVP 阶段支持未登录访问）:
- `/app/projects` - 项目列表
- `/app/projects/new` - 创建新项目
- `/app/projects/[projectId]` - 项目详情（概览）
  - `/manuscript` - 书稿导入与段落管理
  - `/illustrations` - 插图设置与生成
- `/app/credits` - 积分管理
- `/app/account` - 账户设置
- `/app/admin` - 管理员面板（role-gated）

**特殊说明**: `app/(app)/` 和 `app/dashboard/` 存在重复路由，需要后续整合。

### 状态管理策略

**当前**: 使用 React Context + useState（简单场景）

**建议**:
- 用户认证状态、积分余额等全局状态考虑使用 Zustand
- 项目内段落选择等局部状态使用组件 state
- 表单状态使用 react-hook-form

### UI 组件规范

**基础组件**: 使用 shadcn/ui（位于 `components/ui/`），包括：
- Dialog, Tabs, Card, Table, Badge
- Form, Input, Select, Checkbox, Switch
- Button, DropdownMenu, Toast, Skeleton

**组件使用原则**:
- 所有页面必须包含 loading、empty、error 三种状态
- 使用 Skeleton 组件提供加载占位
- 使用 lucide-react 图标库提供空状态图标
- 响应式设计：桌面端优先，移动端适配

### 样式系统

**配色方案**: 使用明亮柔和的色调（区别于黑白冷色调）

**Tailwind 配置**: 使用 Tailwind CSS 4 + `@tailwindcss/postcss`

**主题**: 支持明暗主题切换（通过 `next-themes`）

**路径别名**: `@/*` 映射到项目根目录

## 开发注意事项

### 多语言支持

网站需支持 8 种语言：英文、法语、德语、西班牙语、日语、韩语、简体中文、繁体中文。

**实现要点**:
- 在 header 添加语言选择器
- 所有 UI 文本需要国际化
- 建议使用 next-intl 或 next-i18next

### 认证与权限

**当前实现**: Mock 认证（`lib/api.ts`）

- 邮箱包含 "admin" 时自动获得管理员权限
- 使用 `auth-guard.tsx` 保护需要登录的页面
- Admin 导航项通过 `user.role === 'admin'` 控制显示

### 文本导入与段落切分

**实现位置**: `/app/projects/[projectId]/manuscript`

**功能要求**:
- 支持直接粘贴文本
- 支持拖拽/点击上传 .txt 文件
- 使用 AI 自动识别并切分段落（当前使用 `\n\n` 简单分割，实际需接入 AI 服务）
- 段落列表支持多选
- 预览面板实时显示选中段落内容

### 插图生成流程

**实现位置**: `/app/projects/[projectId]/illustrations`

**设置选项**:
- 风格预设：儿童故事、历史、教育、建筑、政府、文化
- 色彩模式：彩色、单色、柔和粉彩、高对比
- 画笔风格：水彩、扁平插画、铅笔素描、写实
- 纵横比：1:1, 4:3, 16:9, 2:3
- 图片尺寸：1024, 1536, 2048

**生成任务状态**:
- queued（排队中）
- running（生成中）
- succeeded（成功）
- failed（失败）

**结果展示**:
- 瀑布流网格布局
- 预览插图时高亮对应段落
- 支持单张重新生成、修改设置、下载
- 支持多选批量操作、全部打包下载

### 积分系统

**实现位置**: `/app/credits`

**功能组件**:
- 余额卡片：显示当前积分和套餐
- 交易账本：时间、类型、金额、原因、关联 ID
- 购买积分弹窗：100/500/2000 积分包（UI only）
- 低积分警告：余额不足时显示 banner

## 当前待办事项

根据 PRD (`PRD/bookart_PRD.md`)，以下功能需要逐步实现：

1. ✅ 全站骨架与路由（Prompt 0）
2. ✅ 认证页面美化（Prompt 1）
3. ✅ Projects 列表与创建（Prompt 2）
4. 🔄 Project Detail 与 Tabs（Prompt 3）
5. 🔄 Manuscript 导入与段落管理（Prompt 4）
6. 🔄 Illustrations 设置与生成（Prompt 5）
7. 🔄 Credits 积分系统（Prompt 6）
8. ⏸️ Account + Admin 占位页面（Prompt 7）

**后续集成**:
- 接入真实 AI 文本分割服务
- 接入真实图片生成 API（Stable Diffusion / DALL-E）
- 实现真实的用户认证（Clerk / NextAuth）
- 实现支付集成（Stripe）
- 多语言国际化完整实现
- 整合 `app/(app)/` 和 `app/dashboard/` 路由
