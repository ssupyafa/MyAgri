import React, { useState, useRef } from 'react'
import { Upload, X, FileImage, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FileUpload = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      onFileSelect(droppedFile)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      onFileSelect(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    onFileSelect(null)
  }

  return (
    <div className="w-full">
      <div
        className={`relative h-64 border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-6 ${
          dragActive
            ? "border-primary bg-primary/5"
            : file ? "border-primary/40 bg-primary/5" : "border-white/10 hover:border-white/20"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/*"
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => inputRef.current.click()}
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <Upload className="text-primary" size={28} />
              </div>
              <h4 className="text-xl font-display font-medium mb-1">Drop foliage capture here</h4>
              <p className="text-gray-400 text-sm">OR CLICK TO BROWSE FILESYSTEM</p>
            </motion.div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-primary/20 bg-black/40 p-2">
                   <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                   />
                </div>
                <button
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white p-1 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-primary flex items-center gap-1 justify-center">
                  <CheckCircle size={14} /> {file.name}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB • READY FOR ANALYSIS</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold tracking-wider">
          <AlertCircle size={12} /> MAX SIZE: 25MB
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold tracking-wider uppercase">
          <FileImage size={12} /> Formats: JPG, RAW, PNG
        </div>
      </div>
    </div>
  )
}

export default FileUpload