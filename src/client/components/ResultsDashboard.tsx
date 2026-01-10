import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Share2,
} from "lucide-react";
import type React from "react";
import type { Student } from "@/types";

interface Props {
  students: Student[];
}

const ResultsDashboard: React.FC<Props> = ({ students }) => {
  const submitted = students.filter((s) => s.submitted);
  const missing = students.filter((s) => !s.submitted);
  const rate = Math.round((submitted.length / students.length) * 100) || 0;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">最终分析报告</h1>
          <p className="text-muted-foreground">
            基于 AI 语义匹配生成的学生作业提交概览
          </p>
        </div>
        <div className="flex gap-2">
          <button className="shadcn-button-outline flex items-center gap-2 rounded-md px-4 py-2 text-sm">
            <Download className="h-4 w-4" /> 导出结果
          </button>
          <button className="shadcn-button-primary flex items-center gap-2 rounded-md px-4 py-2 text-sm">
            <Share2 className="h-4 w-4" /> 发布通知
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Missing Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold text-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              未交名单
            </h3>
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-bold text-destructive text-xs">
              {missing.length} 位缺席
            </span>
          </div>

          <div className="shadcn-card divide-y overflow-hidden">
            {missing.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <CheckCircle2 className="mb-2 h-12 w-12 text-emerald-500" />
                <p className="font-bold text-foreground">全员交齐</p>
                <p className="text-sm">这真是一个完美的班级！</p>
              </div>
            ) : (
              missing.map((s) => (
                <div
                  className="flex items-center justify-between bg-white p-4 transition-colors hover:bg-muted/30"
                  key={s.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 font-bold text-destructive text-xs">
                      {s.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-sm">{s.name}</span>
                  </div>
                  <button className="font-bold text-[10px] text-destructive uppercase tracking-widest hover:underline">
                    催促
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Success Logs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold text-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              提交记录
            </h3>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 text-xs">
              {submitted.length} 已确认
            </span>
          </div>

          <div className="space-y-3">
            {submitted.length === 0 ? (
              <div className="shadcn-card flex flex-col items-center justify-center border-dashed p-12 text-muted-foreground">
                <Clock className="mb-2 h-10 w-10 opacity-20" />
                <p className="text-sm">暂无匹配成功的记录</p>
              </div>
            ) : (
              submitted.map((s) => (
                <div
                  className="shadcn-card p-4 transition-shadow hover:shadow-md"
                  key={s.id}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold text-sm">{s.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="font-bold text-[10px] text-emerald-600 uppercase">
                        Matched by AI
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-md border bg-muted/50 p-2.5 text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span
                        className="max-w-[80%] truncate font-semibold text-foreground"
                        title={s.emailMatch}
                      >
                        {s.emailMatch}
                      </span>
                      <ExternalLink className="h-3 w-3 cursor-pointer hover:text-primary" />
                    </div>
                    <span className="flex items-center gap-1 text-[9px]">
                      <Clock className="h-2.5 w-2.5" /> {s.submissionTime}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
