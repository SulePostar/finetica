import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator"
import AppHeaderDropdown from "@/components/header/AppHeaderDropdown"
import { ThemeToggle } from "../theme/ThemeToggle"

const AppHeader = () => {
    return (
        <header className="flex h-16 shrink-0 items-center bg-card justify-between border-b border-border px-4">
            {/* Left side */}
            <div className="flex items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            {/* Right side */}
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <AppHeaderDropdown />
            </div>
        </header>
    )
}

export default AppHeader;
