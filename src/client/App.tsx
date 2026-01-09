import { useEffect, useState } from "react";
import { rpc } from "#/api";
import reactLogo from "./assets/react.svg";
import Test from "./page/test";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 在组件加载时获取数据
  useEffect(() => {
    // 首先尝试从localStorage获取缓存数据
    const cachedData = localStorage.getItem("apiMessage");
    if (cachedData) {
      setData(cachedData);
      // 即使有缓存也继续从服务器获取最新数据
    }

    rpc.api.message.get().then(({ data, error }) => {
      if (data) {
        setData(data as string);
        // 将数据保存到localStorage中作为缓存
        localStorage.setItem("apiMessage", data as string);
      }
      if (error) {
        setError(String(error));
        // 如果API调用失败但有缓存数据，可以继续使用缓存
        const cached = localStorage.getItem("apiMessage");
        if (cached) {
          setData(cached);
        }
      }
    });
  }, []);

  // 保存计数器到localStorage
  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count]);

  // 从localStorage初始化计数器
  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (savedCount) {
      setCount(Number.parseInt(savedCount, 10));
    }
  }, []);

  return (
    <>
      <div>
        <a href="https://react.dev" rel="noopener" target="_blank">
          {/** biome-ignore lint/correctness/useImageSize: <explanation> */}
          <img alt="React logo" className="react" src={reactLogo} />
        </a>
      </div>
      <h1>Elysia + React SPA {data ?? ""}</h1>
      {!!error && <p>Error: {error}</p>}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} type="button">
          count is {count}
        </button>
        <p className="bg-red-300">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="h-20 w-20 bg-red-950">
        Click on the Vite and React logos to learn more
      </p>

      <Test />
      <input value={count} />
    </>
  );
}

export default App;
