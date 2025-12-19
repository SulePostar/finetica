import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Toaster } from "@/components/ui/sooner";

const DefaultLayout = ({ children }) => {
    return (
        <div className="flex w-full overflow-hidden bg-background text-foreground">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-1 flex-col">
                        <main className="flex-1 overflow-y-auto xl:px-26 2xl:px-26">
                            <div className="w-full mx-auto max-w-[900px] xl:max-w-full 2xl:max-w-[2000px]">
                                {children}
                            </div>
                        </main>

                        <footer className="border-t bg-card py-4 text-center text-sm text-muted-foreground w-full">
                            <div className="mx-auto max-w-7xl px-4">
                                <p className="break-words">© {new Date().getFullYear()} Future Experts. All rights reserved.</p>
                            </div>
                        </footer>
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <Toaster />
        </div>
    );
};


export default DefaultLayout;