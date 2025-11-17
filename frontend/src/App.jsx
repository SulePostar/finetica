import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Hello World with Tailwind CSS & shadcn/ui!</h1>
      <div className="flex gap-4 flex-wrap">
        <Button onClick={() => alert('Default button clicked')}>Default Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  )
}

export default App
