const DefaultLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-card p-4">
                {/* Sidebar content will be added here */}
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="sticky top-0 z-10 h-16 border-b border-gray-200 bg-card">
                    {/* Header content will be added here */}
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
        </div>
    );
};

export default DefaultLayout;