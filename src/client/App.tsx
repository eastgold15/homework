import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Settings,
  Waves,
  ClipboardList,
  Fish,
  Search,
} from "lucide-react";
import { rpc } from "#/api";
import type { Student, HomeworkItem, AppConfig } from "#client/types";
import ConfigPanel from "./components/ConfigPanel";
import ClassListEditor from "./components/ClassListEditor";
import OceanBucket from "./components/OceanBucket";
import ResultsDashboard from "./components/ResultsDashboard";
import "./index.css";

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([]);
  const [isFishing, setIsFishing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "settings" | "bucket" | "report"
  >("overview");
  const [config, setConfig] = useState<AppConfig>({
    email: "",
    password: "",
    server: "imap.qq.com",
    port: 993,
    namingRule: "{姓名}_{学号}_{作业名}",
  });

  useEffect(() => {
    loadConfig();
    loadStudents();
    loadHomeworks();
  }, []);

  const loadConfig = async () => {
    const { data: result } = await rpc.api.email.config.get();
    if (result?.success && result.data) {
      setConfig({
        email: result.data.email,
        password: "",
        server: result.data.imapServer || "imap.qq.com",
        port: result.data.imapPort || 993,
        namingRule: result.data.namingRule || "{姓名}_{学号}_{作业名}",
      });
    }
  };

  const loadStudents = async () => {
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
  };

  const loadHomeworks = async () => {
    const { data: hwList } = await rpc.api.homework.list.get();
    if (hwList) {
      setHomeworks(
        hwList.map((h: any) => ({
          id: h.homework.id,
          studentId: h.homework.student_id,
          fileName: h.homework.file_name,
          originalName: h.homework.original_name,
          emailFrom: h.homework.email_from,
          emailDate: h.homework.email_date,
        }))
      );
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
    const { data: result } = await rpc.api.email.config.post(config);
    if (result?.success) {
      alert("配置保存成功");
    }
  };

  const submittedCount = students.filter((s) => s.submitted).length;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 border-r bg-card flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary p-2 rounded-xl">
            <Fish className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">作业助手</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem
            icon={<LayoutGrid className="w-4 h-4" />}
            label="仪表盘"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <NavItem
            icon={<Waves className="w-4 h-4" />}
            label="捕捞池"
            active={activeTab === "bucket"}
            onClick={() => setActiveTab("bucket")}
          />
          <NavItem
            icon={<ClipboardList className="w-4 h-4" />}
            label="作业报告"
            active={activeTab === "report"}
            onClick={() => setActiveTab("report")}
          />
          <NavItem
            icon={<Settings className="w-4 h-4" />}
            label="设置"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            作业进度
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(submittedCount / students.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-xs font-medium">
            {submittedCount} / {students.length} 已交
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
        <header className="h-16 border-b bg-card flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold">
            {activeTab === "overview" && "概览"}
            {activeTab === "bucket" && "作业捕捞池"}
            {activeTab === "report" && "收作业报告"}
            {activeTab === "settings" && "系统设置"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索学生..."
                className="pl-10 w-64 rounded-full border border-muted bg-muted/50 px-4 py-2 text-sm"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  label="总名单人数"
                  value={students.length}
                  icon={<ClipboardList />}
                />
                <StatCard
                  label="今日已捕获"
                  value={homeworks.length}
                  icon={<Fish />}
                />
                <StatCard
                  label="缺交率"
                  value={`${Math.round(((students.length - submittedCount) / students.length) * 100)}%`}
                  icon={<LayoutGrid />}
                  color="text-destructive"
                />

                <div className="md:col-span-2 space-y-6">
                  <ClassListEditor
                    students={students}
                    setStudents={setStudents}
                  />
                </div>
                <div className="md:col-span-1">
                  <ConfigPanel
                    config={config}
                    setConfig={setConfig}
                    onStart={handleStartFishing}
                    isFishing={isFishing}
                    onSave={handleSaveConfig}
                  />
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-2xl mx-auto">
                <ConfigPanel
                  config={config}
                  setConfig={setConfig}
                  onStart={handleStartFishing}
                  isFishing={isFishing}
                  onSave={handleSaveConfig}
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
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
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
    <div className="shadcn-card p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-sm font-medium">{label}</span>
        <div className="p-1.5 bg-muted rounded-md">
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, {
                className: "w-4 h-4",
              })
            : icon}
        </div>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
