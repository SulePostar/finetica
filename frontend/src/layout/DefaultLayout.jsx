import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Separator } from "@radix-ui/react-separator";
import AppHeaderDropdown from "@/components/header/AppHeaderDropdown";

const DefaultLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <SidebarProvider>
                {/* Sidebar */}
                <AppSidebar />
                <SidebarInset>
                    {/* Main Content Area */}
                    <div className="flex flex-1 flex-col">
                        {/* Header */}
                        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                            <div className="flex items-center gap-2 px-3">
                                <SidebarTrigger />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                            </div>
                            <div className="flex items-center gap-4">
                                <AppHeaderDropdown />
                            </div>
                        </header>

                        {/* Page Content */}
                        <main className="flex-1 overflow-y-auto p-4 md:p-6">
                            <div className="mx-auto max-w-7xl">{children}</div>
                        </main>

                        {/* Footer */}
                        <footer className="border-t border-gray-200 bg-card py-4">
                            {/* Footer content will be added here */}
                        </footer>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default DefaultLayout;