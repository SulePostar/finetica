import AppRoutes from "./routes/AppRoutes"
import { ThemeProvider } from "./components/theme/ThemeProvider"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App