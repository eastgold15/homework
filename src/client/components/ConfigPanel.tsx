import React from "react";
import { Mail, Shield, Server, ArrowRight, Save } from "lucide-react";
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
}) => {
  return (
    <div className="shadcn-card p-6 flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <SettingsIcon />
          邮箱接入
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          同步 IMAP 邮件服务器中的最新数据
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">
            邮箱账户
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="example@qq.com"
              value={config.email}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, email: e.target.value }))
              }
              className="shadcn-input w-full pl-10 rounded-md"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">
            授权码
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="•••••••••"
              value={config.password}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, password: e.target.value }))
              }
              className="shadcn-input w-full pl-10 rounded-md"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">
            命名规则
          </label>
          <input
            type="text"
            value={config.namingRule}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, namingRule: e.target.value }))
            }
            className="shadcn-input w-full rounded-md"
            placeholder="{姓名}_{学号}_{作业名}"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">
              IMAP 地址
            </label>
            <input
              type="text"
              value={config.server}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, server: e.target.value }))
              }
              className="shadcn-input w-full rounded-md"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">
              端口
            </label>
            <input
              type="number"
              value={config.port}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  port: parseInt(e.target.value),
                }))
              }
              className="shadcn-input w-full rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSave}
          className="shadcn-button-outline flex-1 py-2.5 rounded-md flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          保存配置
        </button>
        <button
          onClick={onStart}
          disabled={isFishing}
          className={`shadcn-button-primary flex-1 py-2.5 rounded-md flex items-center justify-center gap-2 ${isFishing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isFishing ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              开始捕捞作业 <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

function SettingsIcon() {
  return (
    <div className="p-1.5 bg-muted rounded-md">
      <Server className="w-4 h-4" />
    </div>
  );
}

export default ConfigPanel;
