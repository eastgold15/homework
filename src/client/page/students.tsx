import { useEffect, useState } from "react";
import { rpc } from "#/api";

export default function StudentPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [notSubmitted, setNotSubmitted] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
    loadNotSubmitted();
  }, []);

  const loadStudents = () => {
    rpc.api.student.list.get().then(({ data }) => {
      if (data) {
        setStudents(data as any[]);
      }
    });
  };

  const loadNotSubmitted = () => {
    (rpc.api.student as any)["not-submit"].get().then(({ data }) => {
      if (data) {
        setNotSubmitted(data as any[]);
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");

    const { data: result } = await rpc.api.student.upload.post({ file });
    setLoading(false);

    if (result?.success) {
      setMessage(result.message);
      loadStudents();
      loadNotSubmitted();
    } else {
      setMessage(result?.message || "导入失败");
    }
  };

  const exportReport = async () => {
    const { data: result } = await rpc.api.report.export.get();
    if (result?.success && result.data) {
      const link = document.createElement("a");
      link.href = result.data;
      link.download = `作业提交报告_${new Date().toLocaleDateString("zh-CN")}.xlsx`;
      link.click();
    } else {
      setMessage("导出失败");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 font-bold text-2xl">班级名单</h2>

        <div className="mb-6">
          <label className="mb-2 block font-medium">上传Excel文件</label>
          <p className="mb-2 text-gray-600 text-sm">
            Excel格式：第一行姓名，第二行学号（可选），第三行班级（可选）
          </p>
          <input
            accept=".xlsx,.xls"
            className="block w-full text-gray-500 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 file:text-sm hover:file:bg-blue-100"
            onChange={handleFileUpload}
            type="file"
          />
        </div>

        {message && (
          <div
            className={`mb-4 rounded p-4 ${
              message.includes("成功")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-lg">
            学生名单 ({students.length}人)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    姓名
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    学号
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    班级
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="border border-gray-200 px-4 py-2">
                      {student.name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {student.student_id || "-"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {student.class_name || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-lg text-red-600">
            未交作业学生 ({notSubmitted.length}人)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-red-200">
              <thead>
                <tr className="bg-red-50">
                  <th className="border border-red-200 px-4 py-2 text-left">
                    姓名
                  </th>
                  <th className="border border-red-200 px-4 py-2 text-left">
                    学号
                  </th>
                  <th className="border border-red-200 px-4 py-2 text-left">
                    班级
                  </th>
                </tr>
              </thead>
              <tbody>
                {notSubmitted.map((student) => (
                  <tr key={student.id}>
                    <td className="border border-red-200 px-4 py-2">
                      {student.name}
                    </td>
                    <td className="border border-red-200 px-4 py-2">
                      {student.student_id || "-"}
                    </td>
                    <td className="border border-red-200 px-4 py-2">
                      {student.class_name || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          className="mt-6 rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600"
          onClick={exportReport}
        >
          导出作业提交报告
        </button>
      </div>
    </div>
  );
}
