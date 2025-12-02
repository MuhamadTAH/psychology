// 🧠 FILE PURPOSE
// Admin page for batch uploading lesson JSON files.
// Allows uploading multiple JSON files at once (entire Section B folder).
// Automatically creates all lessons in the database with progress tracking.

"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload, CheckCircle, XCircle, AlertTriangle, ArrowLeft, FileJson } from "lucide-react";
import Link from "next/link";

export default function BatchUploadLessonsPage() {
  // Step 1: State management
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // Step 2: Single upload mutation (upload one lesson at a time)
  const uploadSingleLesson = useMutation(api.darkPsychology.uploadSingleLesson);

  // Step 3: Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).filter(file => file.name.endsWith('.json'));
      setSelectedFiles(files);
      setUploadResult(null);
    }
  };

  // Step 4: Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.name.endsWith('.json'));
      setSelectedFiles(files);
      setUploadResult(null);
    }
  };

  // Step 5: Handle upload (upload files one by one to avoid memory limit)
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select JSON files first");
      return;
    }

    setUploading(true);
    setUploadResult(null);
    setCurrentUploadIndex(0);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      uploadedLessons: [] as any[],
    };

    try {
      // Upload files one by one (sequential to avoid memory limits)
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setCurrentUploadIndex(i + 1);
        setUploadProgress(`Uploading ${i + 1} of ${selectedFiles.length}: ${file.name}`);

        try {
          // Read single JSON file
          const lessonData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const json = JSON.parse(e.target?.result as string);
                resolve(json);
              } catch (error) {
                reject(new Error(`Failed to parse ${file.name}: Invalid JSON`));
              }
            };
            reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
            reader.readAsText(file);
          });

          // Upload single lesson to database
          const result = await uploadSingleLesson({ lessonData });

          results.success++;
          results.uploadedLessons.push({
            id: result.lessonId,
            title: result.title,
            lessonId: result.lessonIdFromJson,
          });

        } catch (error: any) {
          results.failed++;
          results.errors.push(error.message || `Failed to upload ${file.name}`);
        }
      }

      setUploadResult(results);
      if (results.success > 0) {
        setSelectedFiles([]); // Clear files on success
      }

    } catch (error: any) {
      setUploadResult({
        success: 0,
        failed: selectedFiles.length,
        errors: [error.message],
        uploadedLessons: [],
      });
    } finally {
      setUploading(false);
      setUploadProgress("");
      setCurrentUploadIndex(0);
    }
  };

  // Step 6: Remove file from selection
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Upload className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Batch Upload Lessons</h1>
              <p className="text-gray-400 mt-1">Upload multiple JSON lesson files at once</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Instructions */}
        <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6 mb-8">
          <h3 className="text-white font-bold text-lg mb-3">📚 How to Use:</h3>
          <ol className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">1.</span>
              <span>Select multiple JSON files (or drag & drop entire Section B folder)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">2.</span>
              <span>Review the file list to ensure all lessons are included</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">3.</span>
              <span>Click "Upload All Lessons" to create them in the database</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">4.</span>
              <span>Wait for completion - you'll see success/failure counts</span>
            </li>
          </ol>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-4 border-dashed rounded-xl p-12 mb-6 transition-all ${
            dragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 bg-gray-800/30 hover:border-gray-500"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">
              Drop JSON files here or click to browse
            </h3>
            <p className="text-gray-400 mb-6">
              Supports multiple file selection and entire folder upload
            </p>
            <input
              type="file"
              multiple
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg cursor-pointer hover:bg-blue-500 transition-all"
            >
              Select JSON Files
            </label>
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl border-2 border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">
                Selected Files ({selectedFiles.length})
              </h3>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileJson className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">{file.name}</span>
                    <span className="text-gray-500 text-sm">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFiles.length > 0 && (
          <div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                uploading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
              }`}
            >
              {uploading ? "Uploading..." : `Upload ${selectedFiles.length} Lesson${selectedFiles.length > 1 ? 's' : ''}`}
            </button>

            {/* Progress indicator */}
            {uploading && uploadProgress && (
              <div className="mt-4 bg-gray-800/50 rounded-xl border-2 border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Progress</span>
                  <span className="text-blue-400 font-bold">
                    {currentUploadIndex} / {selectedFiles.length}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentUploadIndex / selectedFiles.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm">{uploadProgress}</p>
              </div>
            )}
          </div>
        )}

        {/* Upload Results */}
        {uploadResult && (
          <div className="bg-gray-800/50 rounded-xl border-2 border-gray-700 p-6 mt-6">
            <h3 className="text-white font-bold text-lg mb-4">Upload Results</h3>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-green-400 text-2xl font-bold">{uploadResult.success}</div>
                <div className="text-gray-400 text-sm">Successful</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-red-400 text-2xl font-bold">{uploadResult.failed}</div>
                <div className="text-gray-400 text-sm">Failed</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-blue-400 text-2xl font-bold">
                  {uploadResult.success + uploadResult.failed}
                </div>
                <div className="text-gray-400 text-sm">Total</div>
              </div>
            </div>

            {/* Uploaded Lessons */}
            {uploadResult.uploadedLessons.length > 0 && (
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">✅ Successfully Uploaded:</h4>
                <div className="space-y-2">
                  {uploadResult.uploadedLessons.map((lesson: any, index: number) => (
                    <div key={index} className="bg-green-500/10 rounded-lg p-3 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">{lesson.title}</p>
                        <p className="text-gray-400 text-sm">Lesson ID: {lesson.lessonId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {uploadResult.errors.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">❌ Errors:</h4>
                <div className="space-y-2">
                  {uploadResult.errors.map((error: string, index: number) => (
                    <div key={index} className="bg-red-500/10 rounded-lg p-3 flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// Batch upload page with drag-and-drop support for JSON files.
// Multiple file selection for uploading entire Section B folder at once.
// Progress tracking with success/failure counts.
// Detailed results showing which lessons uploaded successfully and which failed.
// File list with size display and ability to remove individual files.
// Clear error messages for debugging upload issues.
