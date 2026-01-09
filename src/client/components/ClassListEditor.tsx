import React, { useState } from "react";
import { Users, UserPlus, X, Trash2 } from "lucide-react";
import type { Student } from "../../types";

interface Props {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const ClassListEditor: React.FC<Props> = ({ students, setStudents }) => {
  const [newNames, setNewNames] = useState("");

  const handleBulkAdd = () => {
    const names = newNames
      .split(/[\n,，]/)
      .map((n) => n.trim())
      .filter((n) => n !== "");
    const newStudents: Student[] = names.map((name, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      name,
      submitted: false,
    }));
    setStudents((prev) => [...prev, ...newStudents]);
    setNewNames("");
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="shadcn-card p-6 flex flex-col h-[520px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className="p-1.5 bg-muted rounded-md">
              <Users className="w-4 h-4" />
            </div>
            学生名单
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            管理作业提交的核对名单
          </p>
        </div>
        <div className="text-xs font-bold bg-secondary px-2.5 py-1 rounded-full">
          {students.length} 位学生
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1 mb-6 custom-scrollbar">
        {students.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
            <Users className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm">暂无名单，请导入</p>
          </div>
        ) : (
          students.map((s) => (
            <div
              key={s.id}
              className="group flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                  {s.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{s.name}</span>
              </div>
              <button
                onClick={() => removeStudent(s.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 pt-4 border-t">
        <textarea
          placeholder="批量粘贴学生姓名 (以换行或逗号分隔)"
          className="shadcn-input w-full h-24 rounded-md resize-none"
          value={newNames}
          onChange={(e) => setNewNames(e.target.value)}
        />
        <button
          onClick={handleBulkAdd}
          className="shadcn-button-outline w-full py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          导入名单
        </button>
      </div>
    </div>
  );
};

export default ClassListEditor;
