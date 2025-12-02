import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("pdf") as File;

  if (!file) {
    return NextResponse.json({ status: "error", error: "No file uploaded" }, { status: 400 });
  }

  // Save file temporarily
  const buffer = Buffer.from(await file.arrayBuffer());
  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const tempFilePath = path.join(tempDir, `${uuidv4()}.pdf`);
  fs.writeFileSync(tempFilePath, buffer);

  try {
    const result = await runPythonExtractor(tempFilePath);
    fs.unlinkSync(tempFilePath);
    return NextResponse.json(result);
  } catch (error: any) {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    return NextResponse.json({ status: "error", error: error.message }, { status: 500 });
  }
}

function runPythonExtractor(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "scripts", "pdf_extractor.py");
    const py = spawn("python", [scriptPath, filePath]);

    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => (data += chunk.toString()));
    py.stderr.on("data", (chunk) => (error += chunk.toString()));

    py.on("close", (code) => {
      console.log("Python stdout:", data);
      console.error("Python stderr:", error);

      if (code === 0) {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Failed to parse Python output: " + data));
        }
      } else {
        reject(new Error(error || "Python script failed"));
      }
    });
  });
}
