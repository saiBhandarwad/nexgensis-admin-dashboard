import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './pages/NotFound'
function App() {
  const router = createBrowserRouter([
    {
      path: "/products",
      element:
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>

    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/*",
      element: <NotFound />
    },
    
  ])
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
