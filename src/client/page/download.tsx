import { useState } from "react";
import { rpc } from "#/api";

export default function DownloadPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    setLoading(true);
    setProgress(0);
    setMessage("");

    const { data: result } = await rpc.api.homework.download.post();
    setLoading(false);

    if (result?.success) {
      setMessage(result.message);
    } else {
      setMessage(result?.message || "下载失败");
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 font-bold text-2xl">下载作业</h2>

      <div className="mb-6">
        <p className="text-gray-600 text-sm">
          点击下方按钮，将自动从邮箱下载所有未读邮件的附件到 downloads/作业/
          目录
        </p>
      </div>

      {progress > 0 && (
        <div className="mb-6">
          <div className="mb-2 flex justify-between">
            <span className="font-medium text-sm">下载进度</span>
            <span className="font-medium text-sm">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mb-6 rounded p-4 ${
            message.includes("成功")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <button
        className="rounded bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading}
        onClick={handleDownload}
      >
        {loading ? "下载中..." : "开始下载作业"}
      </button>

      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-700">注意事项</h3>
        <ul className="list-inside list-disc space-y-2 text-gray-600 text-sm">
          <li>只下载未读邮件的附件</li>
          <li>附件将根据命名规则自动匹配学生信息</li>
          <li>下载后的文件保存在 downloads/作业/ 目录下</li>
          <li>如果无法匹配学生，将标记为"未找到"</li>
        </ul>
      </div>
    </div>
  );
}
