import { Anchor, FileText, Filter, Loader2, Mail } from "lucide-react";
import type React from "react";
import type { HomeworkItem as EmailFish } from "../../types";

interface Props {
  emails: EmailFish[];
  isFishing: boolean;
}

const OceanBucket: React.FC<Props> = ({ emails, isFishing }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">捕捞作业池</h1>
        <p className="text-muted-foreground">
          正在从您的收件箱中筛选可能的学生提交
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="shadcn-button-outline flex items-center gap-2 rounded-md px-4 py-2 text-sm">
          <Filter className="h-4 w-4" />
          过滤
        </button>
      </div>
    </div>

    <div className="grid min-h-[400px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {!!isFishing && (
        <div className="col-span-full flex flex-col items-center justify-center space-y-4 rounded-3xl border bg-card py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center">
            <h3 className="font-bold text-lg">正在深海打捞...</h3>
            <p className="text-muted-foreground text-sm">
              正在同步并由 Gemini 进行智能语义对账
            </p>
          </div>
        </div>
      )}

      {!isFishing && emails.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card py-24 text-muted-foreground">
          <Anchor className="mb-4 h-12 w-12 opacity-20" />
          <p className="font-medium text-lg">鱼缸里还没货</p>
          <p className="text-sm">请先配置好设置并开始“捕捞”</p>
        </div>
      )}

      {!isFishing &&
        emails.map((email, idx) => (
          <div
            className="shadcn-card group fade-in zoom-in animate-in cursor-default p-5 transition-all duration-300 hover:border-primary/50"
            key={email.id}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-lg bg-primary/5 p-2 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex gap-2">
                {!!email.hasAttachment && (
                  <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-bold text-[10px] text-emerald-700">
                    <FileText className="h-3 w-3" />
                    ATTACHED
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h4
                className="line-clamp-2 font-bold text-foreground text-sm leading-tight"
                title={email.subject}
              >
                {email.subject}
              </h4>
              <p className="truncate text-muted-foreground text-xs">
                {email.sender}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                {email.timestamp}
              </span>
              <button className="font-bold text-[10px] text-primary opacity-0 transition-opacity group-hover:opacity-100">
                查看详情
              </button>
            </div>
          </div>
        ))}
    </div>
  </div>
);

export default OceanBucket;
