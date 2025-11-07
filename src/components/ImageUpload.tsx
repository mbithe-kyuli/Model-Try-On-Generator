import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  description: string;
  onImageSelect: (base64: string) => void;
  image: string | null;
}

export const ImageUpload = ({ label, description, onImageSelect, image }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearImage = useCallback(() => {
    onImageSelect('');
  }, [onImageSelect]);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-foreground mb-2">
        {label}
      </label>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all duration-300",
          "hover:border-primary hover:bg-muted/30",
          isDragging ? "border-primary bg-muted/50 scale-[1.02]" : "border-border",
          image ? "p-2" : "p-8"
        )}
      >
        {image ? (
          <div className="relative group">
            <img 
              src={image} 
              alt="Preview" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="w-12 h-12 text-muted-foreground mb-4" />
            <span className="text-sm font-medium text-foreground mb-1">
              Drop your image here
            </span>
            <span className="text-xs text-muted-foreground mb-4">
              or click to browse
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};
