import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

const DefaultLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-1 flex-col">
                        <main className="flex-1 overflow-y-auto p-4 md:p-6">
                            <div className="mx-auto max-w-7xl">{children}</div>
                        </main>

                        <footer className="border-t bg-card py-4 text-center text-sm text-muted-foreground w-full">
                            <div className="mx-auto max-w-7xl px-4">
                                <p className="break-words">© {new Date().getFullYear()} Future Experts. All rights reserved.</p>
                            </div>
                        </footer>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};


export default DefaultLayout;