import AppRoutes from "./routes/AppRoutes"
import DefaultLayout from "./layout/DefaultLayout"
import { ThemeProvider } from "./components/theme/ThemeProvider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App