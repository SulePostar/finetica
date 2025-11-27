import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react"

const AppHeaderDropdown = () => {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="size-7 flex items-center justify-center rounded-md hover:bg-accent focus:outline-none"
            >
                <User className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("/profile")}
                >
                    <User className="h-4 w-4" />
                    Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AppHeaderDropdown
