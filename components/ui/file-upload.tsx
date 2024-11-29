import { ChangeEvent, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ImageIcon, UploadIcon } from 'lucide-react';

interface FileUploadProps {
  onChange: (file: File) => void;
  value?: File | null;
  className?: string;
  accept?: string;
}

export function FileUpload({
  onChange,
  value,
  className,
  accept = 'image/*'
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onChange(acceptedFiles[0]);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer',
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <UploadIcon className="h-8 w-8 text-gray-500" />
        {value ? (
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>{value.name}</span>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            <p>Drag & drop an image here, or click to select</p>
            <p className="text-xs">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
} 