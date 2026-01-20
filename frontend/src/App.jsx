import AppRoutes from "./routes/AppRoutes"
import { ThemeProvider } from "./components/theme/ThemeProvider"
import { AuthProvider } from "./context/AuthContext"
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  )
}

export default App