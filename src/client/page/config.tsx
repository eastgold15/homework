import { useEffect, useState } from "react";
import { rpc } from "#/api";

export default function ConfigPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [namingRule, setNamingRule] = useState("{姓名}_{学号}_{作业名}");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    rpc.api.email.config.get().then(({ data }) => {
      if (data && "email" in data) {
        setEmail((data as any).email);
        setNamingRule((data as any).namingRule || "{姓名}_{学号}_{作业名}");
      }
    });
  }, []);

  const handleSave = async () => {
    if (!(email && password)) {
      setMessage("请填写邮箱和授权码");
      return;
    }

    setLoading(true);
    const { data: result } = await rpc.api.email.config.post({
      email,
      password,
      namingRule,
    });
    setLoading(false);

    if (result?.success) {
      setMessage("配置保存成功");
    } else {
      setMessage("配置保存失败");
    }
  };

  const handleTest = async () => {
    if (!(email && password)) {
      setMessage("请填写邮箱和授权码");
      return;
    }

    setLoading(true);
    const { data: result } = await rpc.api.email.test.post({ email, password });
    setLoading(false);

    if (result?.success) {
      setMessage(result.message);
    } else {
      setMessage(result?.message || "测试失败");
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 font-bold text-2xl">邮箱配置</h2>

      <div className="mb-6">
        <p className="mb-4 text-gray-600 text-sm">
          请使用QQ邮箱的授权码，不是邮箱密码。
          <a
            className="ml-2 text-blue-500 underline"
            href="https://service.mail.qq.com/cgi-bin/help?subtype=1&id=28&no=1001256"
            rel="noopener noreferrer"
            target="_blank"
          >
            如何获取授权码？
          </a>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block font-medium">邮箱地址</label>
          <input
            className="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@qq.com"
            type="email"
            value={email}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">授权码</label>
          <input
            className="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入QQ邮箱授权码"
            type="password"
            value={password}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">命名规则</label>
          <input
            className="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            onChange={(e) => setNamingRule(e.target.value)}
            placeholder="{姓名}_{学号}_{作业名}"
            type="text"
            value={namingRule}
          />
          <p className="mt-1 text-gray-600 text-sm">
            支持的占位符：{"{姓名}, {学号}, {作业名}"}
          </p>
        </div>

        {message && (
          <div
            className={`rounded p-4 ${
              message.includes("成功")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex gap-4">
          <button
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? "保存中..." : "保存配置"}
          </button>
          <button
            className="rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600 disabled:bg-gray-400"
            disabled={loading}
            onClick={handleTest}
          >
            {loading ? "测试中..." : "测试连接"}
          </button>
        </div>
      </div>
    </div>
  );
}
