import { Button } from "@/components/ui/button"
import AppRoutes from "./routes/AppRoutes"
import DefaultLayout from "./layout/DefaultLayout"

function App() {
  return (
    <DefaultLayout>
      <AppRoutes />
    </DefaultLayout>
  )
}

export default App