import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

const DefaultLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col h-full overflow-hidden">
                    <main className="flex-1 flex flex-col overflow-y-auto xl:px-26 2xl:px-26">
                        <div className="flex-1 w-full mx-auto max-w-[900px] xl:max-w-[950px] 2xl:max-w-[2000px] p-4">
                            {children}
                        </div>

                        <footer className="border-t bg-card py-4 text-center text-sm text-muted-foreground w-full">
                            <div className="mx-auto max-w-7xl px-4">
                                <p className="break-words">© {new Date().getFullYear()} Future Experts. All rights reserved.</p>
                            </div>
                        </footer>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default DefaultLayout;