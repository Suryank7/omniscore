"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
}

export default function FileDropzone({
  onFileSelect,
  selectedFile,
  accept = ".pdf,.docx,.txt",
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`dropzone p-8 text-center relative transition-all ${
        isDragOver ? "drag-over" : ""
      } ${selectedFile ? "has-file" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for analysis
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="py-4">
          <div className="w-14 h-14 rounded-2xl bg-navy-700/60 border border-glass-border flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            Click to upload or drag and drop
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-3">
            Supported formats: PDF, DOCX, or TXT (Max 10MB)
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800/80 border border-white/5 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            PII Masking & Privacy Protected
          </div>
        </div>
      )}
    </div>
  );
}
