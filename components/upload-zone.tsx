'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export function UploadZone({ onFileSelected, isLoading = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or PDF file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center cursor-pointer ${
          isDragging
            ? 'border-neon-cyan bg-neon-cyan/10'
            : 'border-neon-cyan/30 hover:border-neon-cyan/60'
        }`}
        whileHover={{ borderColor: 'rgba(0, 212, 255, 0.6)' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          disabled={isLoading}
        />

        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <Upload className="w-16 h-16 text-neon-cyan opacity-70" />
          
          {selectedFile ? (
            <>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="mt-4 bg-neon-cyan text-background hover:bg-neon-cyan/80"
              >
                Change File
              </Button>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Drag & drop your document
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Or click to browse
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, PNG, JPG (Max 10MB)
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="mt-4 bg-neon-cyan text-background hover:bg-neon-cyan/80"
              >
                Select File
              </Button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
