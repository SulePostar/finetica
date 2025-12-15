import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User } from "lucide-react";
import { cn } from "@/lib/utils";

const CircleImage = ({ src, alt = "Profile", size = "medium", borderColor = "border-muted", showEditIcon = false, className = "" }) => {
    const sizeClasses = {
        small: "w-18 h-18",
        medium: "w-32 h-32",
        large: "w-40 h-40",
    };

    const iconSizes = {
        small: "w-3 h-3",
        medium: "w-6 h-6",
        large: "w-8 h-8",
    };

    return (
        <div className="relative inline-block">
            <Avatar
                className={cn(
                    sizeClasses[size],
                    "rounded-full border-4 overflow-hidden bg-background flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity",
                    borderColor,
                    className
                )}
            >
                {src ? (
                    <AvatarImage src={src} alt={alt} className="object-cover" />
                ) : (
                    <AvatarFallback className="w-full h-full bg-secondary flex items-center justify-center">
                        <User className="w-1/2 h-1/2 text-muted-foreground stroke-1" />
                    </AvatarFallback>
                )}
            </Avatar>
            {showEditIcon && (
                <div className="absolute bottom-0 right-0 bg-spurple rounded-full p-2 border-2 border-background shadow-lg">
                    <Camera className={cn(iconSizes[size], "text-white bg-spurple")} />
                </div>
            )}
        </div>
    );
}
export default CircleImage