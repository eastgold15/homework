# Elysia + React + shadcn 单体全栈项目

一个现代化的单体全栈应用，集成了 **Elysia** 后端、**React** 前端和 **shadcn/ui** 组件库，使用 **Bun** 打包成单个可执行文件。

![Elysia](https://img.shields.io/badge/Elysia-latest-blue)
![React](https://img.shields.io/badge/React-19-black)
![Bun](https://img.shields.io/badge/Bun-latest-ffcf3d)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 特性

- 🚀 **单体架构**：前后端一体化开发，无需单独部署
- 📦 **单文件打包**：使用 Bun 编译成单个 `.exe` 可执行文件
- 🔥 **热重载**：开发模式支持前端和后端热更新
- 🎨 **现代 UI**：基于 shadcn/ui 和 Tailwind CSS 的精美界面
- ⚡ **高性能**：Bun 运行时提供极快的执行速度
- 🔌 **类型安全**：前后端类型共享，减少开发错误
- 📤 **文件上传**：内置文件上传功能
- 🔄 **状态管理**：使用 Zustand 进行状态管理
- 💾 **本地存储**：支持 localStorage 缓存

## 🛠️ 技术栈

### 后端
- [Elysia](https://elysiajs.com/) - 高性能 Web 框架
- [Bun](https://bun.sh/) - 运行时和打包工具
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript

### 前端
- [React 19](https://react.dev/) - 用户界面库
- [shadcn/ui](https://ui.shadcn.com/) - 高质量组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [Zustand](https://zustand-demo.pmnd.rs/) - 轻量级状态管理
- [Lucide React](https://lucide.dev/) - 图标库

### 开发工具
- [Biome](https://biomejs.dev/) - 代码格式化和检查
- [Ultracite](https://ultracite.com/) - 代码格式化工具

## 📦 安装

### 前置要求

- [Bun](https://bun.sh/) >= 1.0.0
- [Git](https://git-scm.com/)

### 克隆项目

```bash
git clone https://github.com/yourusername/elysia-bun-dler.git
cd elysia-bun-dler
```

### 安装依赖

```bash
bun install
```

## 🚀 快速开始

### 开发模式

启动开发服务器（支持热重载）：

```bash
bun run dev
```

访问 [http://localhost:4000](http://localhost:4000) 查看应用。

### 构建生产版本

#### 构建单个可执行文件（Windows）

```bash
bun run build:exe
```

构建完成后，可执行文件位于 `dist/server.exe`。

#### 跨平台构建

使用构建脚本编译多个平台：

```bash
./build-matrix.sh
```

这将编译所有主要平台（除了 Windows ARM64）。

### 构建命令选项

```bash
bun run build.ts --help
```

可用选项：
- `--outdir <path>` - 输出目录（默认："dist"）
- `--minify` - 启用压缩
- `--sourcemap <type>` - Source map 类型
- `--target <target>` - 构建目标
- `--format <format>` - 输出格式
- `--external <list>` - 外部依赖包

## 📁 项目结构

```
elysia-bun-dler/
├── src/
│   ├── client/           # 前端代码
│   │   ├── components/   # React 组件
│   │   │   └── ui/       # shadcn/ui 组件
│   │   ├── page/         # 页面组件
│   │   ├── store/        # Zustand 状态管理
│   │   ├── lib/          # 工具函数
│   │   ├── App.tsx       # 根组件
│   │   └── main.tsx      # 前端入口
│   ├── server/           # 后端代码
│   │   └── index.ts      # API 路由
│   ├── lib/              # 共享工具
│   ├── frontend.ts       # 前端集成
│   └── index.ts          # 主入口
├── public/               # 静态资源
├── dist/                 # 构建输出
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🔧 API 接口

### 文件上传

```bash
POST /api/upload
Content-Type: multipart/form-data

{
  "file": <File>
}

Response:
{
  "success": true,
  "message": "文件上传成功",
  "filePath": "/uploads/timestamp-filename"
}
```

### 获取消息

```bash
GET /api/message

Response: string
```

## 🎨 样式定制

项目使用 Tailwind CSS 进行样式管理，配置文件为 `tailwind.config.js`。

shadcn/ui 组件位于 `src/client/components/ui/`，可以根据需求进行定制。

## 🐳 Docker 部署（可选）

如果需要使用 Docker 部署，可以创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "4000:4000"
    volumes:
      - ./public/uploads:/app/public/uploads
```

## 📝 环境变量

在 `.env` 文件中配置环境变量：

```env
NODE_ENV=production
PORT=4000
```

## 🔍 代码规范

项目使用 Biome 和 Ultracite 进行代码格式化：

```bash
# 检查代码
bunx biome check .

# 格式化代码
bunx biome format --write .

# 使用 Ultracite 格式化
bunx ultracite format .
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Elysia](https://elysiajs.com/) - 优秀的高性能 Web 框架
- [Bun](https://bun.sh/) - 快速的 JavaScript 运行时
- [React](https://react.dev/) - 用于构建用户界面的库
- [shadcn/ui](https://ui.shadcn.com/) - 精美的 UI 组件库

## 📮 联系方式

- 项目主页: [https://github.com/yourusername/elysia-bun-dler](https://github.com/yourusername/elysia-bun-dler)
- 问题反馈: [Issues](https://github.com/yourusername/elysia-bun-dler/issues)

---

⭐ 如果这个项目对你有帮助，请给个 Star！
