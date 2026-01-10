import {
  ClipboardList,
  Fish,
  LayoutGrid,
  Search,
  Settings,
  Waves,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { rpc } from "#/api";
import ClassListEditor from "./components/ClassListEditor";
import ConfigPanel from "./components/ConfigPanel";
import OceanBucket from "./components/OceanBucket";
import ResultsDashboard from "./components/ResultsDashboard";
import TestPage from "./page/test";
import "./index.css";
import type { EmailConfigContract } from "#/db/model/email-config";
import type { HomeworkContract } from "#/db/model/home-work.model";
import type { StudentContract } from "#/db/model/student.model";

export default function App() {
  const [students, setStudents] = useState<StudentContract["Student"][]>([]);
  const [homeworks, setHomeworks] = useState<
    HomeworkContract["HomeworkItem"][]
  >([]);
  const [isFishing, setIsFishing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "settings" | "bucket" | "report" | "test"
  >("test");
  const [config, setConfig] = useState<EmailConfigContract["Config"]>({
    email: "1960825664@qq.com",
    password: "ltexjnbspblkdehd",
    imapServer: "smtp.qq.com",
    imapPort: 465,
    namingRule: "{姓名}_{学号}_{作业名}",
  });

  useEffect(() => {
    loadConfig();
    loadStudents();
    loadHomeworks();
  }, []);

  const loadConfig = async () => {
    try {
      const { data: result } = await rpc.api.email.config.get();
      if (result?.success && result.data) {
        setConfig({
          email: result.data.email,
          password: "",
          imapServer: result.data.imapServer || "imap.163.com",
          imapPort: result.data.imapPort || 993,
          namingRule: result.data.namingRule || "{姓名}_{学号}_{作业名}",
        });
      }
    } catch (error) {
      console.error("加载配置失败:", error);
    }
  };

  const loadStudents = async () => {
    try {
      const { data: studentList } = await rpc.api.student.list.get();
      if (studentList) {
        setStudents(
          studentList.map((s: any) => ({
            id: s.id,
            name: s.name,
            studentId: s.student_id,
            className: s.class_name,
            submitted: false,
          }))
        );
      }
    } catch (error) {
      console.error("加载学生失败:", error);
    }
  };

  const loadHomeworks = async () => {
    try {
      const { data: hwList } = await rpc.api.homework.list.get();
      if (hwList) {
        const submittedIds = new Set();
        hwList.forEach((h) => {
          if (h.homework.studentId) {
            submittedIds.add(h.homework.studentId);
          }
        });

        setHomeworks(
          hwList.map((h) => ({
            id: h.homework.id,
            studentId: h.homework.studentId,
            fileName: h.homework.fileName,
            originalName: h.homework.originalName,
            emailFrom: h.homework.emailFrom,
            emailDate: h.homework.emailDate,
            hasAttachment: h.homework.hasAttachment,
          }))
        );

        setStudents((prev) =>
          prev.map((s) => ({
            ...s,
            submitted: submittedIds.has(s.id),
          }))
        );
      }
    } catch (error) {
      console.error("加载作业失败:", error);
    }
  };

  const handleStartFishing = async () => {
    setIsFishing(true);
    setActiveTab("bucket");

    try {
      const { data: result } = await rpc.api.homework.download.post();
      if (result?.success) {
        await loadHomeworks();
        await loadStudents();
        setIsFishing(false);
      }
    } catch (error) {
      console.error("下载错误:", error);
      setIsFishing(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const { data: result } = await rpc.api.email.config.post(config);
      if (result?.success) {
        alert("配置保存成功");
      }
    } catch (error) {
      console.error("保存配置失败:", error);
    }
  };

  const submittedCount = students.filter((s) => s.submitted).length;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="flex w-64 flex-col space-y-8 border-r bg-card p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="rounded-xl bg-primary p-2">
            <Fish className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">作业助手</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem
            active={activeTab === "test"}
            icon={<LayoutGrid className="h-4 w-4" />}
            label="测试"
            onClick={() => setActiveTab("test")}
          />
          <NavItem
            active={activeTab === "overview"}
            icon={<LayoutGrid className="h-4 w-4" />}
            label="仪表盘"
            onClick={() => setActiveTab("overview")}
          />
          <NavItem
            active={activeTab === "bucket"}
            icon={<Waves className="h-4 w-4" />}
            label="捕捞池"
            onClick={() => setActiveTab("bucket")}
          />
          <NavItem
            active={activeTab === "report"}
            icon={<ClipboardList className="h-4 w-4" />}
            label="作业报告"
            onClick={() => setActiveTab("report")}
          />
          <NavItem
            active={activeTab === "settings"}
            icon={<Settings className="h-4 w-4" />}
            label="设置"
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <div className="mb-2 font-semibold text-muted-foreground text-xs uppercase">
            作业进度
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(submittedCount / students.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 font-medium text-xs">
            {submittedCount} / {students.length} 已交
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden bg-[#fafafa]">
        <header className="flex h-16 items-center justify-between border-b bg-card px-8">
          <h2 className="font-semibold text-lg">
            {activeTab === "test" && "API 测试"}
            {activeTab === "overview" && "概览"}
            {activeTab === "bucket" && "作业捕捞池"}
            {activeTab === "report" && "收作业报告"}
            {activeTab === "settings" && "系统设置"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <input
                className="w-64 rounded-full border border-muted bg-muted/50 px-4 py-2 pl-10 text-sm"
                placeholder="搜索学生..."
                type="text"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-5xl space-y-8">
            {activeTab === "test" && <TestPage />}

            {activeTab === "overview" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard
                  icon={<ClipboardList />}
                  label="总名单人数"
                  value={students.length}
                />
                <StatCard
                  icon={<Fish />}
                  label="今日已捕获"
                  value={homeworks.length}
                />
                <StatCard
                  color="text-destructive"
                  icon={<LayoutGrid />}
                  label="缺交率"
                  value={`${Math.round(((students.length - submittedCount) / students.length) * 100)}%`}
                />

                <div className="space-y-6 md:col-span-2">
                  <ClassListEditor
                    setStudents={setStudents}
                    students={students}
                  />
                </div>
                <div className="md:col-span-1">
                  <ConfigPanel
                    config={config}
                    isFishing={isFishing}
                    onSave={handleSaveConfig}
                    onStart={handleStartFishing}
                    setConfig={setConfig}
                  />
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="mx-auto max-w-2xl">
                <ConfigPanel
                  config={config}
                  isFishing={isFishing}
                  onSave={handleSaveConfig}
                  onStart={handleStartFishing}
                  setConfig={setConfig}
                />
              </div>
            )}

            {activeTab === "bucket" && (
              <OceanBucket emails={homeworks} isFishing={isFishing} />
            )}

            {activeTab === "report" && <ResultsDashboard students={students} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 font-medium text-sm transition-colors ${
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  label,
  value,
  icon,
  color = "text-primary",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="shadcn-card flex flex-col gap-2 p-6">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="font-medium text-sm">{label}</span>
        <div className="rounded-md bg-muted p-1.5">{icon}</div>
      </div>
      <div className={`font-bold text-2xl ${color}`}>{value}</div>
    </div>
  );
}
