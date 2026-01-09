import { useRef, useState } from "react";
import { rpc } from "#/api";

export default function Test() {
  const [count, setCount] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const increase = () => setCount((c) => c + 1);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data: result, error } = await rpc.api.upload.post({
        file,
      });

      if (error || !result) {
        return null;
      }

      if (result.success) {
        setUploadMessage(result.message);
        setUploadedImage(result?.filePath || "");
      } else {
        setUploadMessage(result.message);
      }
    } catch (error) {
      console.error("上传错误:", error);
      setUploadMessage("上传过程中发生错误");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl">Bun/Elysia Fullstack</h1>
          <h2 className="text-6xl">{count}</h2>
          <button
            className="rounded-xl bg-blue-100 px-6 py-2 text-blue-500 text-xl"
            onClick={increase}
          >
            Increase
          </button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <h3 className="mb-4 font-semibold text-xl">图片上传</h3>

        <div className="rounded-lg border-2 border-gray-300 border-dashed p-6 text-center">
          <input
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            ref={fileInputRef}
            type="file"
          />

          <button
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-400"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "上传中..." : "选择图片"}
          </button>
        </div>

        {/** biome-ignore lint/nursery/noLeakedRender: <explanation> */}
        {uploadMessage && (
          <div className="mt-4 rounded bg-blue-100 p-2 text-blue-700">
            {uploadMessage}
          </div>
        )}

        {/** biome-ignore lint/nursery/noLeakedRender: <explanation> */}
        {uploadedImage && (
          <div className="mt-4">
            <h4 className="mb-2 font-medium text-lg">上传的图片:</h4>
            {/** biome-ignore lint/correctness/useImageSize: <explanation> */}
            <img
              alt="上传的图片"
              className="w-full rounded-lg shadow-md"
              src={uploadedImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
