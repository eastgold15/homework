# 作业收取系统

一个基于 Elysia + React + Bun 的全栈应用，用于自动收取和管理工作作业。支持从QQ邮箱批量下载作业附件，自动匹配学生信息，生成提交报告。

![Elysia](https://img.shields.io/badge/Elysia-latest-blue)
![React](https://img.shields.io/badge/React-19-black)
![Bun](https://img.shields.io/badge/Bun-latest-ffcf3d)

## ✨ 特性

- 📧 **邮箱集成**：支持QQ邮箱IMAP协议自动下载附件
- 📊 **Excel导入**：支持导入班级名单（Excel格式）
- 🔍 **智能匹配**：根据自定义命名规则自动匹配学生信息
- 📈 **提交报告**：自动生成作业提交情况统计表
- 📁 **文件管理**：支持文件重命名、删除等操作
- 🚀 **单体架构**：前后端一体化，单文件打包成exe
- 🎨 **现代UI**：基于Tailwind CSS的精美界面
- 💾 **本地存储**：SQLite数据库，无需额外数据库服务

## 🛠️ 技术栈

### 后端
- [Elysia](https://elysiajs.com/) - Web框架
- [Bun](https://bun.sh/) - 运行时和打包工具
- [imap-simple](https://github.com/mscdex/node-imap) - IMAP协议
- [exceljs](https://github.com/exceljs/exceljs) - Excel处理
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite数据库
- [Drizzle ORM](https://orm.drizzle.team/) - 数据库ORM

### 前端
- [React 19](https://react.dev/) - UI框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Zustand](https://zustand-demo.pmnd.rs/) - 状态管理

## 📦 安装

### 前置要求

- [Bun](https://bun.sh/) >= 1.0.0

### 安装依赖

```bash
bun install
```

## 🚀 快速开始

### 开发模式

```bash
bun run dev
```

访问 [http://localhost:4000](http://localhost:4000)

### 打包EXE

```bash
bun run build:exe
```

生成的exe文件在 `dist/server.exe`

## 📖 使用说明

### 1. 邮箱配置

- 填写QQ邮箱地址
- 填写QQ邮箱授权码（不是邮箱密码）
- 设置命名规则，支持占位符：`{姓名}`、`{学号}`、`{作业名}`
- 点击"测试连接"验证配置

**获取QQ邮箱授权码：**
1. 登录QQ邮箱网页版
2. 设置 -> 账户 -> POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务
3. 开启"IMAP/SMTP服务"
4. 生成授权码

### 2. 导入班级名单

- 上传Excel文件（.xlsx或.xls）
- 格式：第一列姓名，第二列学号（可选），第三列班级（可选）
- 系统会自动解析并显示学生列表

### 3. 下载作业

- 点击"开始下载作业"按钮
- 系统自动下载未读邮件的附件
- 根据命名规则匹配学生信息
- 文件保存在 `downloads/作业/` 目录

### 4. 作业管理

- 查看已下载的作业列表
- 支持重命名和删除文件
- 查看匹配状态（已匹配/未匹配）
- 查看提交时间

### 5. 导出报告

- 点击"导出作业提交报告"按钮
- 自动生成Excel格式的统计报告
- 包含学生信息和提交状态
- 未提交的学生会标红显示

## 🎯 命名规则示例

支持的占位符：
- `{姓名}` - 学生姓名
- `{学号}` - 学生学号
- `{作业名}` - 作业名称

常见格式：
- `{姓名}_{学号}_{作业名}` - 推荐
- `{姓名}_作业名`
- `{学号}_{姓名}`
- `{姓名}-{学号}`

## 📁 项目结构

```
homework/
├── src/
│   ├── client/              # 前端代码
│   │   ├── page/           # 页面组件
│   │   │   ├── config.tsx   # 邮箱配置
│   │   │   ├── students.tsx # 班级名单
│   │   │   ├── download.tsx # 下载作业
│   │   │   └── homework.tsx # 作业管理
│   │   └── App.tsx         # 主应用
│   ├── server/              # 后端代码
│   │   └── modules/         # 功能模块
│   │       ├── email/       # 邮箱模块
│   │       ├── student/     # 学生模块
│   │       ├── homework/    # 作业模块
│   │       └── report/      # 报告模块
│   └── lib/                # 工具库
│       └── db.ts            # 数据库
├── downloads/               # 下载目录
│   └── 作业/
├── public/                 # 静态资源
├── homework.db            # SQLite数据库
└── dist/                  # 构建输出
```

## 🔧 API 接口

### 邮箱配置

```bash
GET /api/email/config      # 获取配置
POST /api/email/config    # 保存配置
POST /api/email/test      # 测试连接
```

### 学生管理

```bash
GET /api/student/list          # 获取学生列表
GET /api/student/not-submit    # 获取未提交学生
POST /api/student/upload       # 导入Excel
```

### 作业管理

```bash
GET /api/homework/list     # 获取作业列表
POST /api/homework/download # 下载作业
DELETE /api/homework/delete/:id  # 删除作业
POST /api/homework/rename  # 重命名作业
```

### 报告

```bash
GET /api/report/export     # 导出报告
```

## 📝 注意事项

1. **授权码**：使用QQ邮箱授权码，不是邮箱密码
2. **未读邮件**：只下载未读邮件的附件
3. **命名规则**：确保文件名与命名规则匹配，否则无法识别学生
4. **Excel格式**：第一行是表头，第二行开始是数据
5. **文件保存**：作业文件保存在 `downloads/作业/` 目录

## 🔍 故障排除

### 下载失败
- 检查邮箱和授权码是否正确
- 确保IMAP服务已开启
- 检查网络连接

### 无法匹配学生
- 检查命名规则是否正确
- 确认文件名格式是否符合规则
- 检查班级名单是否已导入

### Excel导入失败
- 确认Excel格式正确（xlsx或xls）
- 检查第一行是否为表头
- 确保第一列为姓名

## 📄 许可证

MIT License

---

如有问题或建议，欢迎反馈！
