# Build a minimal SaaS frontend for “AI Book Illustration Generator (MVP)”.


建议的生成顺序（更稳定）

Prompt 0（骨架）

Prompt 2（Projects）

Prompt 4（Manuscript）

Prompt 5（Illustrations）

Prompt 6（Credits）

Prompt 1（Auth 美化/补齐）

Prompt 7（Account/Admin 占位）


## Prompt 0：生成全站信息架构与路由骨架

### Tech constraints:
- Next.js App Router (app/ directory), TypeScript
- Tailwind CSS + shadcn/ui components
- Use clean minimal layout, responsive (desktop-first)
- No backend implementation, but add typed API client stubs and mock data provider
- Use Zustand or React Context for auth + credits state (choose one, keep simple)
- Provide a consistent layout with a left sidebar (desktop) and top bar (mobile)
- Use loading, empty, error states for all data views
- Add route-level skeletons and reusable components

### Core features to cover in UI:
1) Auth: Sign up / Sign in / Forgot password
2) Projects: list, create, project detail
3) Text import: paste text + upload .txt (UI only)
4) Paragraph selection: show segmented paragraphs, multi-select, preview
5) Illustration settings: style preset (children story / history / education / architecture / government / culture), color mode, brush style, aspect ratio, image size presets
6) Generate: create generation tasks, show task statuses (queued/running/succeeded/failed), show results gallery and download button
7) Credits: show current credits in header, credits history table (ledger view), purchase credits CTA
8) Account: profile + billing placeholder + API keys placeholder
9) Admin (MVP minimal): user lookup, manually adjust user plan/credits (UI only)

### Routes (create the app folder structure):
- / (marketing landing, minimal)
- /auth/sign-in
- /auth/sign-up
- /auth/forgot
- /app (authenticated layout)
- /app/projects
- /app/projects/new
- /app/projects/[projectId] (overview)
- /app/projects/[projectId]/manuscript (import + paragraphs)
- /app/projects/[projectId]/illustrations (settings + generate + results)
- /app/credits (balance + ledger + purchase)
- /app/account (profile/billing placeholders)
- /app/admin (role-gated UI with “Admin” badge; use mock role)

### Data models (TypeScript interfaces):
- User { id, email, name, role: 'user'|'admin', credits }
- Project { id, title, description, language, createdAt }
- Paragraph { id, index, content }
- IllustrationSettings { stylePreset, colorMode, brushStyle, aspectRatio, sizePreset }
- GenerationTask { id, projectId, paragraphIds, promptPreview, status, createdAt, updatedAt, errorMessage? }
- IllustrationAsset { id, taskId, url, width, height, createdAt }

### UI requirements:
- Sidebar nav items: Projects, Illustrations (contextual), Credits, Account, Admin (only if admin role)
- Breadcrumbs inside project pages
- “New Project” primary CTA
- In project detail: tabs (Overview, Manuscript, Illustrations)
- Manuscript page: left list of paragraphs with checkboxes; right preview panel for selected paragraph(s)
- Illustrations page: settings panel + “Generate” button + task list + results gallery
- Credits page: balance card, ledger table, “Buy credits” modal (UI only)
- Use shadcn Dialog, Tabs, Card, Table, Badge, DropdownMenu, Toast
- Include empty state illustrations as simple icons (lucide)

### Deliverables:
- File/folder tree for app/
- Main layout components and page components
- Mock API layer in /lib/api.ts with functions (listProjects, createProject, getProject, importManuscript, listParagraphs, createTask, listTasks, listAssets, getCreditsLedger, purchaseCredits)
- A simple auth guard (redirect unauthenticated users to /auth/sign-in)

Make it cohesive and production-like. Do not write backend. Include sensible placeholder content.

## Prompt 1：登录/注册体验
### Create polished auth pages for the SaaS:
- /auth/sign-in
- /auth/sign-up
- /auth/forgot

### Requirements:
- Minimal modern layout, centered card, subtle background
- Form validation (client-side) and show error messages
- Remember me (checkbox) on sign-in
- Links between pages
- After “sign in” success: redirect to /app/projects (use mock auth)
- Show credits badge in header after login (mock)
Use shadcn Form, Input, Button, Separator, Alert.

## Prompt 2：Projects 列表与创建项目页（核心入口）

> Build the authenticated projects experience:

### Pages:
- /app/projects (list)
- /app/projects/new (create)

### Projects list:
- Table + card toggle (simple segmented control)
- Search input, language filter, sort by createdAt
- “New Project” CTA
- Each project row/card shows title, language, createdAt, short description
- Actions: Open, Duplicate (UI only), Delete (confirm dialog UI only)

### Create project:
- Form: title, description, language dropdown
- Submit creates project via mock API then route to /app/projects/[projectId]

### Add skeleton/loading and empty state.


## Prompt 3：Project Detail（含 Tabs + 面包屑）

### Create /app/projects/[projectId] project shell with:
- Breadcrumbs: Projects > {Project Title}
- Header with project title + actions (Rename, Delete - UI only)
- Tabs: Overview, Manuscript, Illustrations
- Overview tab: project summary + quick actions (Import manuscript, Generate illustration)
- Add sub-routes:
  - /app/projects/[projectId]/manuscript
  - /app/projects/[projectId]/illustrations
Use a shared project layout component for these routes.

## Prompt 4：Manuscript 导入 + 段落切分 + 多选预览

> Build /app/projects/[projectId]/manuscript page.

### Layout:
- Top: “Import manuscript” section with two options:
  1) Paste text textarea + “Parse” button
  2) Upload .txt (UI only) + “Parse” button
- Parsing result: list of paragraphs (mock) in a left panel with:
  - checkbox per paragraph
  - paragraph index
  - first 120 chars preview
  - multi-select support
- Right panel:
  - Selected paragraphs preview (full text)
  - A “Mark for illustration” button that adds selected paragraphIds to a “Selected for generation” tray
Bottom tray:
- Shows selected paragraph count and allows removing items
- CTA: “Continue to Illustrations” → /app/projects/[projectId]/illustrations

### States:
- empty (no manuscript)
- parsed (paragraph list)
- no selection
- selection with preview
Use shadcn Tabs/Card/ScrollArea/Checkbox/Toast.

## Prompt 5：Illustrations 页面（设置 + 任务队列 + 结果库）

> Build /app/projects/[projectId]/illustrations page.

> Main sections:

### A) Settings panel (left on desktop, top on mobile)
- Style preset radio cards: Children Story, History, Education, Architecture, Government, Culture
- Color mode select: Colorful, Monochrome, Soft pastel, High contrast
- Brush style select: Watercolor, Flat illustration, Pencil sketch, Realistic
- Aspect ratio select: 1:1, 4:3, 16:9, 2:3
- Size preset select: 1024, 1536, 2048 (UI only)
- Switches: “No text in image” (on by default), “Keep consistent style across project” (UI only)
- Show a “Prompt preview” collapsible panel generated from selected paragraph(s) + settings (mock)

### B) Generation area (right)
- A “Selected paragraphs” chip list (coming from manuscript tray mock)
- Primary button “Generate illustration(s)”:
  - checks credits availability (mock)
  - creates task(s) and shows toast
- Task list table:
  - status badge (queued/running/succeeded/failed)
  - createdAt
  - paragraph count
  - prompt preview (truncated)
  - actions: View, Retry (if failed), Cancel (if queued/running) UI only
- Results gallery:
  - masonry-like grid
  - each card shows image placeholder, paragraph reference, download button
  - “Open detail” modal: image preview + metadata + regenerate UI only

Add robust empty/error/loading states.

## Prompt 6：Credits（余额 + 账本 Ledger + 购买弹窗）

> Build /app/credits page.

### Components:
- Balance card: current credits, plan badge (Free), usage tip
- Ledger table (append-only view):
  columns: time, type (earn/spend/refund), amount (+/-), reason, referenceId
- Filters: date range (simple), type filter
- “Buy credits” CTA opens a Dialog:
  - packages: 100, 500, 2000 credits
  - show price placeholders
  - confirm button (UI only) updates mock credits and adds ledger entry
- Include warning states: low credits banner and “insufficient credits” example

Make it auditable and clean.



## Prompt 7：Account + Admin（MVP占位但可演示）

Build /app/account and /app/admin pages.

Account:
- Profile card: name, email, language preference (UI only)
- Billing placeholder card: subscription plan, payment method placeholder
- API keys placeholder: generate/revoke UI only

Admin (role-gated):
- User search input (email)
- User detail card: role, credits, projects count (mock)
- Actions: adjust credits (+/-), set plan, disable user (UI only)
- Audit log table placeholder

Ensure admin nav item only appears when user.role === 'admin' in mock auth state.


- 用户打开项目主页，在不注册、不登录的情况下，就可以完成上传书稿、选定章节、选择风格模板和设定、批量生成插图的全部工作流程
- 更改网页整体配色方案，使用明亮而柔和的色彩色调，给用户亲切易用的感觉，而不是黑白冰冷的色调

- 整个网址需要支持多语言。在网站的header标题栏中增加语种选择功能，支持 英文、法语、德语、西班牙语、日语、韩语、简体中文、繁体中文。切换语种后，整站的提示文字都要转为相应语种
- 用户输入支持两种方式，直接粘贴文本，或拖拽/点击上传txt文件
- 上传后，使用AI对文本进行识别和切分，生成章节段落列表
- 选中需要生成插图的段落，点击生成插图，即可批量生成插图
- 生成的插图预览时，要高亮显示对应的段落内容
- 生成的插图可以选择单张重新生成、修改内容和风格、下载，也可以多选或全部批量重新生成，多张或全部打包下载


页面正常加载。

阅读 \PRD\bookart_PRD.md 请继续完成功能。
可以上传书籍文件：支持 TXT markdown PDF格式，其中 PDF格式要抽取其中的文本。
支持在文本框中直接粘贴文本。
根据输入的书稿，进行groq LLM的分析，按照文章意义分为合适的篇章，每个篇章 由标题和文章内容组成。
允许用户审阅 修改编辑 重新组合 篇章分割分组。

