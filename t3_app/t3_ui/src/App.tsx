
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Router/AppRoutes'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import BreadcrumbContext from './Context/BreadcrumbContext'
const queryClient = new QueryClient()
function App() {

  return (
    <BrowserRouter>
      <BreadcrumbContext>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </BreadcrumbContext>
    </BrowserRouter>
  )
}

export default App
