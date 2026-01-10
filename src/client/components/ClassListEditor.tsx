import { Trash2, UserPlus, Users } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { StudentContract } from "#/db/model/student.model";

interface Props {
  students: StudentContract["Student"][];
  setStudents: React.Dispatch<
    React.SetStateAction<Partial<StudentContract["Student"]>[]>
  >;
}

const ClassListEditor: React.FC<Props> = ({ students, setStudents }) => {
  const [newNames, setNewNames] = useState("");

  const handleBulkAdd = () => {
    const names = newNames
      .split(/[\n,，]/)
      .map((n) => n.trim())
      .filter((n) => n !== "");
    const newStudents: Partial<StudentContract["Student"]>[] = names.map(
      (name, idx) => ({
        name,
        submitted: false,
      })
    );
    setStudents((prev) => [...prev, ...newStudents]);
    setNewNames("");
  };

  const removeStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="shadcn-card flex h-[520px] flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <div className="rounded-md bg-muted p-1.5">
              <Users className="h-4 w-4" />
            </div>
            学生名单
          </h3>
          <p className="mt-0.5 text-muted-foreground text-sm">
            管理作业提交的核对名单
          </p>
        </div>
        <div className="rounded-full bg-secondary px-2.5 py-1 font-bold text-xs">
          {students.length} 位学生
        </div>
      </div>

      <div className="-mr-2 custom-scrollbar mb-6 flex-1 space-y-1 overflow-y-auto pr-2">
        {students.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
            <Users className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">暂无名单，请导入</p>
          </div>
        ) : (
          students.map((s) => (
            <div
              className="group flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted/50"
              key={s.id}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-bold text-muted-foreground text-xs uppercase">
                  {s.name.charAt(0)}
                </div>
                <span className="font-medium text-sm">{s.name}</span>
              </div>
              <button
                className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                onClick={() => removeStudent(s.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 border-t pt-4">
        <textarea
          className="shadcn-input h-24 w-full resize-none rounded-md"
          onChange={(e) => setNewNames(e.target.value)}
          placeholder="批量粘贴学生姓名 (以换行或逗号分隔)"
          value={newNames}
        />
        <button
          className="shadcn-button-outline flex w-full items-center justify-center gap-2 rounded-md py-2 font-semibold text-sm"
          onClick={handleBulkAdd}
        >
          <UserPlus className="h-4 w-4" />
          导入名单
        </button>
      </div>
    </div>
  );
};

export default ClassListEditor;
