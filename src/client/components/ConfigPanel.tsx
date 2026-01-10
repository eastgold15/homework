import { ArrowRight, Mail, Save, Server, Shield } from "lucide-react";
import type React from "react";
import type { AppConfig } from "../types";

interface Props {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onStart: () => void;
  isFishing: boolean;
  onSave: () => void;
}

const ConfigPanel: React.FC<Props> = ({
  config,
  setConfig,
  onStart,
  isFishing,
  onSave,
}) => (
  <div className="shadcn-card flex flex-col gap-6 p-6">
    <div>
      <h3 className="flex items-center gap-2 font-semibold text-lg">
        <SettingsIcon />
        邮箱接入
      </h3>
      <p className="mt-1 text-muted-foreground text-sm">
        同步 IMAP 邮件服务器中的最新数据
      </p>
    </div>

    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="font-semibold text-muted-foreground text-xs uppercase tracking-tight">
          邮箱账户
        </label>
        <div className="relative">
          <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <input
            className="shadcn-input w-full rounded-md pl-10"
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="example@qq.com"
            type="email"
            value={config.email}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-semibold text-muted-foreground text-xs uppercase tracking-tight">
          授权码
        </label>
        <div className="relative">
          <Shield className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <input
            className="shadcn-input w-full rounded-md pl-10"
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="•••••••••"
            type="password"
            value={config.password}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-semibold text-muted-foreground text-xs uppercase tracking-tight">
          命名规则
        </label>
        <input
          className="shadcn-input w-full rounded-md"
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, namingRule: e.target.value }))
          }
          placeholder="{姓名}_{学号}_{作业名}"
          type="text"
          value={config.namingRule}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground text-xs uppercase tracking-tight">
            IMAP 地址
          </label>
          <input
            className="shadcn-input w-full rounded-md"
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, server: e.target.value }))
            }
            type="text"
            value={config.server}
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground text-xs uppercase tracking-tight">
            端口
          </label>
          <input
            className="shadcn-input w-full rounded-md"
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                port: Number.parseInt(e.target.value, 10),
              }))
            }
            type="number"
            value={config.port}
          />
        </div>
      </div>
    </div>

    <div className="flex gap-3">
      <button
        className="shadcn-button-outline flex flex-1 items-center justify-center gap-2 rounded-md py-2.5"
        onClick={onSave}
      >
        <Save className="h-4 w-4" />
        保存配置
      </button>
      <button
        className={`shadcn-button-primary flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 ${isFishing ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={isFishing}
        onClick={onStart}
      >
        {isFishing ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        ) : (
          <>
            开始捕捞作业 <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  </div>
);

function SettingsIcon() {
  return (
    <div className="rounded-md bg-muted p-1.5">
      <Server className="h-4 w-4" />
    </div>
  );
}

export default ConfigPanel;
