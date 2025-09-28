"use client";

import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: FileStatus;
}

export default function DocumentUploader() {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((incomingFiles: FileList) => {
    if (isProcessing) return;
    const newFiles: UploadingFile[] = Array.from(incomingFiles).map(file => ({
      id: `${file.name}-${file.lastModified}`,
      file,
      progress: 0,
      status: 'pending',
    }));
    setFiles(prev => [...prev, ...newFiles.filter(nf => !prev.some(pf => pf.id === nf.id))]);
  }, [isProcessing]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };
  
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const startProcessing = () => {
    if (!files.some(f => f.status === 'pending')) return;
    setIsProcessing(true);

    const filesToProcess = files.filter(f => f.status === 'pending');
    filesToProcess.forEach(fileToProcess => {
      setFiles(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, status: 'uploading' } : f));
      
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === fileToProcess.id && f.progress < 100) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setFiles(prev => prev.map(f => {
          if (f.id === fileToProcess.id) {
            const isError = Math.random() > 0.9; // 10% chance of error
            return { ...f, progress: 100, status: isError ? 'error' : 'success' };
          }
          return f;
        }));

        if (files.every(f => f.status === 'success' || f.status === 'error')) {
          setIsProcessing(false);
        }
      }, 2200);
    });
  };

  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === 'success').length;
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText /> Document Ingestion</CardTitle>
        <CardDescription>Upload employee resumes, reviews, and other documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFileSelect} />
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Drag & drop files here, or click to select files</p>
          <p className="text-xs text-muted-foreground/80">Supports PDF, DOCX, TXT, CSV</p>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            {files.map(upload => (
              <div key={upload.id} className="flex items-center gap-4 p-2 rounded-md bg-secondary/50">
                <FileText className="h-6 w-6 text-primary" />
                <div className="flex-grow">
                  <p className="text-sm font-medium truncate">{upload.file.name}</p>
                  <Progress value={upload.progress} className="h-2 mt-1" />
                </div>
                <div className="w-6 h-6">
                  {upload.status === 'uploading' && <Loader className="h-5 w-5 animate-spin text-muted-foreground" />}
                  {upload.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {upload.status === 'error' && <XCircle className="h-5 w-5 text-destructive" />}
                </div>
              </div>
            ))}
            <Button onClick={startProcessing} disabled={isProcessing || !files.some(f=>f.status === 'pending')} className="w-full">
              {isProcessing ? 'Processing...' : `Process ${files.filter(f=>f.status==='pending').length} Files`}
            </Button>
            
            {isProcessing && (
              <Alert>
                <AlertDescription>
                  Processing... {completedFiles}/{totalFiles} complete.
                </AlertDescription>
              </Alert>
            )}
            
            {!isProcessing && files.every(f => f.status !== 'pending' && f.status !== 'uploading') && (
              <Alert className="bg-accent/20 border-accent">
                 <CheckCircle className="h-4 w-4 text-accent-foreground" />
                <AlertDescription>
                  {completedFiles} documents indexed successfully. {totalFiles - completedFiles} failed.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
