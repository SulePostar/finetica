import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const SidebarUserInfo = ({ user }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center gap-3">
                    <div className="bg-[#6C69FF] text-white flex size-10 rounded-full items-center justify-center font-semibold shrink-0">
                        {user.profileImage ? (
                            <img src={user.profileImage} className="rounded-full size-full object-cover" alt="" />
                        ) : (
                            user.initials
                        )}
                    </div>
                    <div className="flex flex-col leading-tight text-sm">
                        <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent side="top">
                <p>{user.email}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);
