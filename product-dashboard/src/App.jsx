import './App.css'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardLayout />
    },
    {
      path: "/login",
      element: <Login />
    }
  ])
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
