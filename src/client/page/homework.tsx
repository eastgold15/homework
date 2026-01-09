import { useEffect, useState } from "react";
import { rpc } from "#/api";

export default function HomeworkPage() {
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = () => {
    rpc.api.homework.list.get().then(({ data }) => {
      if (data) {
        setHomeworkList(data as any[]);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个作业吗？")) return;

    const { data: result } = await (rpc.api.homework as any).delete({ id });
    if (result?.success) {
      loadHomework();
    }
  };

  const handleRename = async () => {
    if (!(editingId && newFileName)) return;

    const { data: result } = await rpc.api.homework.rename.post({
      id: editingId,
      fileName: newFileName,
    });

    if (result?.success) {
      setEditingId(null);
      setNewFileName("");
      loadHomework();
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "submitted") return "text-green-600";
    if (status === "not_found") return "text-red-600";
    return "text-gray-600";
  };

  const getStatusText = (status: string) => {
    if (status === "submitted") return "已匹配";
    if (status === "not_found") return "未匹配";
    return "未知";
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 font-bold text-2xl">作业管理</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left">
                文件名
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                学生
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                学号
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                状态
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                提交时间
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {homeworkList.map((homework) => (
              <tr key={homework.id}>
                <td className="border border-gray-200 px-4 py-2">
                  {editingId === homework.id ? (
                    <input
                      className="w-full rounded border border-gray-300 px-2 py-1"
                      onChange={(e) => setNewFileName(e.target.value)}
                      type="text"
                      value={newFileName}
                    />
                  ) : (
                    homework.file_name
                  )}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {homework.name || "-"}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {homework.student_id || "-"}
                </td>
                <td
                  className={`border border-gray-200 px-4 py-2 ${getStatusColor(homework.submit_status)}`}
                >
                  {getStatusText(homework.submit_status)}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {homework.email_date
                    ? new Date(homework.email_date).toLocaleString("zh-CN")
                    : "-"}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <div className="flex gap-2">
                    {editingId === homework.id ? (
                      <>
                        <button
                          className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                          onClick={handleRename}
                        >
                          保存
                        </button>
                        <button
                          className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                          onClick={() => {
                            setEditingId(null);
                            setNewFileName("");
                          }}
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                          onClick={() => {
                            setEditingId(homework.id);
                            setNewFileName(homework.file_name);
                          }}
                        >
                          重命名
                        </button>
                        <button
                          className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          onClick={() => handleDelete(homework.id)}
                        >
                          删除
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {homeworkList.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          暂无作业文件，请先下载作业
        </div>
      )}
    </div>
  );
}
