# S-parks V6 Release

S-parks V6 基于 `sparks-v5` 复制迭代，保留 v5 原版不动，并把原本停留在展示层的大量假 UI 继续补成可跳转、可串联、可继续扩展的页面工作流。

## V6 重点

- 从 `sparks-v5` 复制出独立的 `sparks-v6` 工作目录，避免原版本丢失。
- 新增 `#guide` 专题页体系，把支持中心卡片、页脚条款和联系入口全部接成真实跳转页面。
- 把素材页工具按钮补成真实交互，支持展开筛选建议、切换排序、直接创建项目夹。
- 新建项目夹后可直接进入 `#project` 详情页，形成从素材浏览到项目沉淀的闭环。
- 统一加强边框、面板填充、文字对比和图层层级，降低旧版本里常见的导航压层、字体撞色和控件弱可见问题。
- 版本标识已同步到 `v6.0.0`，包括 `index.html`、前端配置和对外说明文案。

## 当前路由

- `#home`: 首页 / 发现
- `#assets`: 素材库
- `#community`: 创作者社区
- `#support`: 支持中心
- `#guide?guide=...`: 专题指南页
- `#detail?asset=...`: 素材详情
- `#creator?creator=...&tab=...`: 创作者主页
- `#creator-onboarding`: 成为创作者
- `#account`: 个人主页
- `#upload`: 上传发布
- `#auth`: 登录注册
- `#licensing?asset=...`: 购买授权
- `#downloads`: 下载中心
- `#membership`: 积分会员
- `#admin`: 审核后台
- `#search`: 搜索结果
- `#collections`: 收藏夹 / 项目夹
- `#project?project=...`: 项目夹详情

## 关键文件

- `index.html`: 应用外壳、CSP、版本资源引用、页脚专题链接
- `assets/css/styles.css`: 设计系统、图层、边框、专题页与素材工具样式
- `assets/js/content.js`: 页面内容、专题页数据、素材与项目数据
- `assets/js/renderers.js`: 路由页面渲染器
- `assets/js/router.js`: Hash 路由解析与动态参数
- `assets/js/app.js`: 状态、交互、项目夹创建和页面事件
- `assets/js/config.js`: 前端版本号、本地登录兜底和 Supabase 公开配置

## 发布目标

- GitHub 仓库：发布后同步升级为 `https://github.com/logifore/s-parks-v6`
- Vercel 项目：延续现有线上项目做覆盖升级，并同步升级到 `s-parks-v6` 命名
- 发布策略：直接替换当前 `v5` 线上主版本，让 GitHub `main` 与 Vercel 生产部署共同指向 `v6`

## 本地预览

```bash
/Users/ylfy/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m http.server 8768
```

然后打开：

```text
http://127.0.0.1:8768/
```

## 安全说明

V6 仍是前端原型，不包含真实生产密钥、支付凭据或后端管理口令。

- `supabaseUrl` 与 `supabaseAnonKey` 默认为空。
- 当前仓库未引入非空的 API Key、Token、数据库密码或私有环境变量。
- 正式上线前仍需补全服务端鉴权、上传校验、下载权限、限流、审计日志和内容审核流程。
