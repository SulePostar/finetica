import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import FileUploadModal from "./modals/FileUploadModal";

export default function UploadButton({ onUploadSuccess, buttonText = "Upload", variant = "default", size = "default", className = "" }) {
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
                className={className}
            >
                <CloudUpload className="w-4 h-4 mr-2" />
                {buttonText}
            </Button>

            <FileUploadModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
            />
        </>
    );
}
