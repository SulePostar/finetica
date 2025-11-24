import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import AppHeader from "@/components/header/AppHeader";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useEffect } from "react";

const DefaultLayout = ({ children }) => {
    const isBreakpoint = useMediaQuery(`(min-width: 1024px)`);
    const [isSidebarOpen, setIsSidebarOpen] = useState(isBreakpoint);

    useEffect(() => {
        setIsSidebarOpen(isBreakpoint);
    }, [isBreakpoint]);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                {/* Sidebar */}
                <AppSidebar />
                <SidebarInset>
                    {/* Main Content Area */}
                    <div className="flex flex-1 flex-col">
                        {/* Header */}
                        <AppHeader />
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