// app/api/generate/route.ts (Next.js 13+ ใช้ App Router)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt, steps, cfg_scale, width, height, sampler_index} = body;

  // เรียก API ไปยัง Stable Diffusion ที่รันใน RunPod
  const res = await fetch("...", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      steps,
      cfg_scale,
      width,
      height,
      sampler_index,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    return NextResponse.json({ error }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
