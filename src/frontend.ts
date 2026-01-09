/*
  使用 Bun 的生产 HTML bundle 与 Elysia 集成，提供单文件可执行的 SPA 服务器
  无需单独的服务器构建步骤
  参考文档: https://bun.com/reference/bun/HTMLBundle
 */

import Elysia from "elysia";
import indexHtml from "./client/index.html";
import tailwindcss from "bun-plugin-tailwind";

// 加载 index.html bundle 并打印路径信息
console.log("Loaded index.html bundle:", indexHtml);

// 判断是否为生产构建模式（生产模式下 indexHtml.files 会存在）
const isBuiltInProduction = !!indexHtml.files;
console.log("Is built in production mode?", isBuiltInProduction);

// 提取打包资源的虚拟基础路径（例如从 "/assets/index.html" 中提取 "/assets"）
const bundledAssetsBasePath = indexHtml.index.slice(
  0,
  indexHtml.index.lastIndexOf("/")
);
console.log("Bundled assets base path:", bundledAssetsBasePath);

/**
 * 规范化请求路径以匹配内部资源结构
 * - 如果存在基础路径前缀，则移除
 * - 将主 HTML 入口点视为根路径 ("/")
 * @param requestPath - 请求的原始路径
 * @returns 规范化后的路径
 */
function normalizeRequestPath(requestPath: string): string {
  let normalizedPath = requestPath;

  // 如果是 index.html 或主入口文件，将其映射到根路径
  if (
    normalizedPath.endsWith("index.html") ||
    normalizedPath.endsWith(indexHtml.index)
  ) {
    normalizedPath = "";
  }
  // 对于其他资源，移除虚拟基础路径前缀
  else if (normalizedPath.startsWith(bundledAssetsBasePath)) {
    normalizedPath = normalizedPath.slice(bundledAssetsBasePath.length);
  }

  return normalizedPath;
}

// 前端应用实例
let frontendApp: Elysia;

if (isBuiltInProduction) {
  // 生产模式：直接提供预打包的静态文件
  frontendApp = indexHtml.files!.reduce((app, bundledFile) => {
    const normalizedRoutePath = normalizeRequestPath(bundledFile.path);
    console.log(`Mapping ${bundledFile.path} → ${normalizedRoutePath || "/"}`);

    return app.get(
      normalizedRoutePath,
      () =>
        new Response(Bun.file(bundledFile.path), {
          headers: bundledFile.headers,
        })
    );
  }, new Elysia());
} else {
  // 开发模式：实时构建并提供输出文件
  console.log("Building SPA in development mode...");

  // 使用 Bun 构建前端资源
  const buildResult = await Bun.build({
    entrypoints: [indexHtml.index],
    minify: false,
    sourcemap: "linked",
    plugins: [tailwindcss],
  });

  // 构建失败时退出
  if (!buildResult.success) {
    console.error("Build failed:", buildResult.logs);
    process.exit(1);
  }

  // 遍历构建输出，为每个文件创建路由
  frontendApp = buildResult.outputs.reduce((app, outputFile) => {
    // Bun.build 输出路径如 "./dist/main.js"，移除前导的 "./"
    const processedAssetPath = outputFile.path.startsWith("./")
      ? outputFile.path.slice(2)
      : outputFile.path;
    const normalizedRoutePath = normalizeRequestPath(processedAssetPath);
    console.log(
      `Serving built asset ${processedAssetPath} → ${normalizedRoutePath || "/"}`
    );

    return app.get(
      normalizedRoutePath,
      () =>
        new Response(outputFile, {
          headers: { "Content-Type": outputFile.type },
        })
    );
  }, new Elysia());
}

export default frontendApp;
