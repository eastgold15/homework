import { useState } from "react";
import { rpc } from "#/api";

export default function TestPage() {
  const [message, setMessage] = useState("");

  const testConfig = async () => {
    try {
      const result = await rpc.api.email.config.get();
      setMessage(JSON.stringify(result, null, 2));
    } catch (error) {
      setMessage("Error: " + String(error));
    }
  };

  const saveConfig = async () => {
    try {
      const result = await rpc.api.email.config.post({
        email: "test@test.com",
        password: "test123",
        namingRule: "{姓名}_{学号}_{作业名}",
      });
      setMessage(JSON.stringify(result, null, 2));
    } catch (error) {
      setMessage("Error: " + String(error));
    }
  };

  const getStudents = async () => {
    try {
      const result = await rpc.api.student.list.get();
      setMessage(JSON.stringify(result, null, 2));
    } catch (error) {
      setMessage("Error: " + String(error));
    }
  };

  const getHomework = async () => {
    try {
      const result = await rpc.api.homework.list.get();
      setMessage(JSON.stringify(result, null, 2));
    } catch (error) {
      setMessage("Error: " + String(error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-bold text-3xl">API 测试</h1>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 font-semibold text-xl">测试操作</h2>
          <div className="space-y-3">
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={testConfig}
            >
              获取邮箱配置
            </button>
            <button
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={saveConfig}
            >
              保存配置
            </button>
            <button
              className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
              onClick={getStudents}
            >
              获取学生列表
            </button>
            <button
              className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
              onClick={getHomework}
            >
              获取作业列表
            </button>
          </div>
        </div>

        {message && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">结果</h2>
            <pre className="overflow-x-auto rounded bg-gray-100 p-4">
              {message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
