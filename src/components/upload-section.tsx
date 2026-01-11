"use client"

import type React from "react"
import { useState } from "react"
import { Upload, File } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadSectionProps {
  file: File | null
  onFileChange: (file: File | null) => void
  onUpload: () => Promise<void>
  isLoading: boolean
  isConnected: boolean
}

export default function UploadSection({ file, onFileChange, onUpload, isLoading, isConnected }: UploadSectionProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0])
    }
  }

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 border-b border-border/40">
      <div className="max-w-3xl mx-auto">
        <div
          className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
            isDragActive ? "border-cyan-500 bg-cyan-500/5" : "border-border/40 bg-background/50"
          } p-8 md:p-12`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
              <Upload className="text-cyan-500" size={32} />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Upload Your Document</h3>
              <p className="text-muted-foreground text-sm mb-6">Drag and drop your file here, or click to select</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <label className="flex-1">
                <input type="file" onChange={(e) => onFileChange(e.target.files?.[0] || null)} className="hidden" />
                <span className="flex items-center justify-center gap-2 px-6 py-3 bg-background border border-border/40 rounded-lg cursor-pointer hover:border-border/60 transition">
                  <File size={18} />
                  Choose File
                </span>
              </label>

              <Button
                onClick={onUpload}
                disabled={!file || isLoading || !isConnected}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>

            {file && (
              <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                <File size={16} />
                <span>{file.name}</span>
              </div>
            )}

            {!isConnected && (
              <div className="mt-4 text-sm text-orange-600">Please connect your wallet to upload documents</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
