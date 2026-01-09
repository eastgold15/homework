import { Elysia } from "elysia";
import { ServerApp } from "~/index";
import frontendApp from "./frontend";

const app = new Elysia().use(frontendApp).use(ServerApp).listen(4000);

// 输出服务器运行信息
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

// 输出带下划线的可点击链接到终端，方便直接打开浏览器
const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🔗 Open in browser: \x1b]8;;${url}\x1b\\${url}\x1b]8;;\x1b\\`);
