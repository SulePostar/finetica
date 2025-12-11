import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import FileUploadModal from "./modals/FileUploadModal";

export default function UploadButton({ onUploadSuccess, variant = "default", size = "default", className = "" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadSuccess = (file) => {
    onUploadSuccess?.(file);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        size={size}
        className={`group relative overflow-hidden transition-all duration-200 ${className}`}
        aria-label="Upload file"
      >
        <div className="flex items-center justify-center">
          <CloudUpload className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
          <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-0.5 group-hover:mr-0.5 group-hover:gap-0.2 transition-all duration-200 whitespace-nowrap">
                        Upload
                    </span>
        </div>
      </Button>

      <FileUploadModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}