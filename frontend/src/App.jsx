import { Button } from "@/components/ui/button"
import AppRoutes from "./routes/AppRoutes"
import DefaultLayout from "./layout/DefaultLayout"
import { ThemeProvider } from "./components/theme/ThemeProvider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
    </ThemeProvider>
  )
}

export default App