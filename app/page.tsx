"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl(null); // เคลียร์ภาพเก่า

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          steps: 30,
          cfg_scale: 7,
          width: 512,
          height: 512,
          sampler_index: "Euler",
        }),
      });

      const data = await response.json();

      if (data.images && data.images.length > 0) {
        const base64Image = data.images[0];
        setImageUrl(`data:image/png;base64,${base64Image}`);
      } else if (data.error) {
        alert("🚫 Error from server: " + data.error);
      } else {
        alert("⚠️ No image returned from API.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("❌ Failed to generate image.");
    }

    setLoading(false);
  };


  return (
    <main className="min-h-screen bg-sky-300 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-black">🎨 AI Image Generator</h1>

        <span className="text-gray-600 mb-4 block">
          วิธีการใช้งานโดยการป้อนคำอธิบายภาพที่ต้องการสร้าง แล้วกดปุ่ม "Generate Image"
          <br />
          <ul className="list-disc pl-5 mt-2">
            <li>Prompt ต้องเป็นภาษาอังกฤษทั้งหมด</li>
            <li>สามารถใส่คำอธิบายได้หลายบรรทัด</li>
            <li>ต้องมีคำศัพท์คำว่า "Bosuak" อยู่ในคำสั่งด้วย</li>
          </ul>
        </span>

        <span className="text-green-600 mb-4 block">
          <strong>ตัวอย่าง Prompt:</strong> "A beautiful landscape with mountains and a river, Bosuak style"
        </span>

        <label className="block mb-1 font-medium text-black">Prompt</label>
        <textarea
          className="w-full p-2 mb-4 border rounded text-black"
          rows={4}
          placeholder="Describe your image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={!prompt || loading}
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {imageUrl && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2 text-black">Result</h2>
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full rounded border"
            />
          </div>
        )}
      </div>
    </main>
  );
}
