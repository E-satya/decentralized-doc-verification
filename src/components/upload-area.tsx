"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, CheckCircle2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadAreaProps {
  onUpload: (files: FileList) => void
  isLoading: boolean
}

export default function UploadArea({ onUpload, isLoading }: UploadAreaProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(e.target.files)
    }
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-3xl mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center cursor-pointer group ${
            isDragActive
              ? "border-cyan-500 bg-cyan-500/10 scale-105"
              : "border-border/40 bg-gradient-to-br from-background/80 to-blue-500/5 hover:border-blue-500/50 hover:bg-blue-500/5"
          }`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-blue-600/0 group-hover:from-cyan-400/5 group-hover:to-blue-600/5 transition-colors duration-300"></div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx"
            disabled={isLoading}
          />

          <div className="relative z-10 space-y-4">
            {isLoading ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-border/40 border-t-cyan-500 animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold">Processing Documents</h3>
                <p className="text-muted-foreground">Verifying authenticity...</p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="text-cyan-600 dark:text-cyan-400" size={28} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
                  <p className="text-muted-foreground">
                    Drag and drop your files here or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
                    >
                      browse
                    </button>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG, XLSX (Max 50MB)
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                >
                  Select Files
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/40 hover:border-border/60 transition">
            <CheckCircle2 className="mx-auto mb-2 text-green-500" size={20} />
            <p className="text-xs font-medium">Bank-Level Security</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/40 hover:border-border/60 transition">
            <FileText className="mx-auto mb-2 text-blue-500" size={20} />
            <p className="text-xs font-medium">Multiple Formats</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/40 hover:border-border/60 transition">
            <Zap className="mx-auto mb-2 text-yellow-500" size={20} />
            <p className="text-xs font-medium">Lightning Fast</p>
          </div>
        </div>
      </div>
    </section>
  )
}
