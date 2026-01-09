import { useState } from "react";
import { rpc } from "#/api";
import ConfigPage from "./page/config";
import StudentPage from "./page/students";
import DownloadPage from "./page/download";
import HomeworkPage from "./page/homework";
import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("config");

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-800">作业收取系统</h1>
            <div className="flex gap-4">
              <button
                className={`rounded px-4 py-2 ${
                  currentPage === "config"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentPage("config")}
              >
                邮箱配置
              </button>
              <button
                className={`rounded px-4 py-2 ${
                  currentPage === "students"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentPage("students")}
              >
                班级名单
              </button>
              <button
                className={`rounded px-4 py-2 ${
                  currentPage === "download"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentPage("download")}
              >
                下载作业
              </button>
              <button
                className={`rounded px-4 py-2 ${
                  currentPage === "homework"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentPage("homework")}
              >
                作业管理
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-4">
        {currentPage === "config" && <ConfigPage />}
        {currentPage === "students" && <StudentPage />}
        {currentPage === "download" && <DownloadPage />}
        {currentPage === "homework" && <HomeworkPage />}
      </main>
    </div>
  );
}

export default App;
