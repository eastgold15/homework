import React from "react";
import { Mail, Loader2, Anchor, Filter, FileText } from "lucide-react";
import type { HomeworkItem as EmailFish } from "../../types";

interface Props {
  emails: EmailFish[];
  isFishing: boolean;
}

const OceanBucket: React.FC<Props> = ({ emails, isFishing }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">捕捞作业池</h1>
          <p className="text-muted-foreground">
            正在从您的收件箱中筛选可能的学生提交
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="shadcn-button-outline px-4 py-2 rounded-md text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            过滤
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {isFishing && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-card border rounded-3xl space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="text-center">
              <h3 className="font-bold text-lg">正在深海打捞...</h3>
              <p className="text-sm text-muted-foreground">
                正在同步并由 Gemini 进行智能语义对账
              </p>
            </div>
          </div>
        )}

        {!isFishing && emails.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-card border border-dashed rounded-3xl text-muted-foreground">
            <Anchor className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium text-lg">鱼缸里还没货</p>
            <p className="text-sm">请先配置好设置并开始“捕捞”</p>
          </div>
        )}

        {!isFishing &&
          emails.map((email, idx) => (
            <div
              key={email.id}
              className="shadcn-card group p-5 hover:border-primary/50 transition-all cursor-default animate-in fade-in zoom-in duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex gap-2">
                  {email.hasAttachment && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-100 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      ATTACHED
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h4
                  className="font-bold text-foreground text-sm leading-tight line-clamp-2"
                  title={email.subject}
                >
                  {email.subject}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {email.sender}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  {email.timestamp}
                </span>
                <button className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  查看详情
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OceanBucket;
