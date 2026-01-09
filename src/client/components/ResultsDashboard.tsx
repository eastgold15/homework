import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  ExternalLink,
  Share2,
} from "lucide-react";
import type { Student } from "../../types";

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
          <h1 className="text-2xl font-bold tracking-tight">最终分析报告</h1>
          <p className="text-muted-foreground">
            基于 AI 语义匹配生成的学生作业提交概览
          </p>
        </div>
        <div className="flex gap-2">
          <button className="shadcn-button-outline px-4 py-2 rounded-md text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> 导出结果
          </button>
          <button className="shadcn-button-primary px-4 py-2 rounded-md text-sm flex items-center gap-2">
            <Share2 className="w-4 h-4" /> 发布通知
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Missing Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              未交名单
            </h3>
            <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-bold rounded-full">
              {missing.length} 位缺席
            </span>
          </div>

          <div className="shadcn-card divide-y overflow-hidden">
            {missing.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mb-2 text-emerald-500" />
                <p className="font-bold text-foreground">全员交齐</p>
                <p className="text-sm">这真是一个完美的班级！</p>
              </div>
            ) : (
              missing.map((s) => (
                <div
                  key={s.id}
                  className="p-4 flex items-center justify-between bg-white hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-bold">
                      {s.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold">{s.name}</span>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-destructive hover:underline">
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
            <h3 className="font-bold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              提交记录
            </h3>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
              {submitted.length} 已确认
            </span>
          </div>

          <div className="space-y-3">
            {submitted.length === 0 ? (
              <div className="shadcn-card p-12 flex flex-col items-center justify-center text-muted-foreground border-dashed">
                <Clock className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">暂无匹配成功的记录</p>
              </div>
            ) : (
              submitted.map((s) => (
                <div
                  key={s.id}
                  className="shadcn-card p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{s.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">
                        Matched by AI
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-2.5 rounded-md border text-[11px] text-muted-foreground flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span
                        className="font-semibold text-foreground truncate max-w-[80%]"
                        title={s.emailMatch}
                      >
                        {s.emailMatch}
                      </span>
                      <ExternalLink className="w-3 h-3 hover:text-primary cursor-pointer" />
                    </div>
                    <span className="text-[9px] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {s.submissionTime}
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
