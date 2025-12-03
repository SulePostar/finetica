import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileIcon, FileText } from "lucide-react";

export default function FileUploadModal({ open, onClose, onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const fileRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        const renamedFile =
            fileName && fileName !== selectedFile.name
                ? new File([selectedFile], fileName, { type: selectedFile.type })
                : selectedFile;

        onUploadSuccess?.(renamedFile);
        resetState();
        onClose();
    };

    const resetState = () => {
        setSelectedFile(null);
        setFileName("");
        setDragOver(false);
    };

    const handleCancel = () => {
        resetState();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <UploadCloud className="w-5 h-5 text-foreground" />
                        Upload File
                    </DialogTitle>
                </DialogHeader>
                <Label className="text-sm font-medium text-foreground">Select File</Label>
                <div
                    onClick={() => fileRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition
                        ${dragOver ? "border-primary bg-primary/10" : "border-border"}
                        ${selectedFile ? "bg-green/10 border-green" : ""}
                    `}
                >
                    <input
                        type="file"
                        ref={fileRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    {selectedFile ? (
                        <div className="text-center">
                            <FileIcon className="h-10 w-10 text-green mx-auto mb-2" />
                            <div className="font-semibold text-green-foreground">
                                {selectedFile.name}
                            </div>

                            <div className="text-xs text-green-foreground mt-2">
                                Click to select a different file
                            </div>
                        </div>
                    ) : (
                        <div className="text-muted-foreground">
                            <UploadCloud className="h-10 w-10 mx-auto mb-2 text-spurple" />
                            <p className="font-medium text-spurple">Drop your file here</p>
                            <p className="text-sm">or click to browse</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 space-y-2">
                    <Label className="flex items-center gap-2 text-foreground">
                        <FileText className="w-4 h-4 text-primary" />
                        File Name (optional)
                    </Label>
                    <Input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter custom file name or leave blank"
                        className="bg-muted border border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">
                        Leave empty to use the original file name:{" "}
                        <strong>{selectedFile?.name || "None selected"}</strong>
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!selectedFile}>
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
