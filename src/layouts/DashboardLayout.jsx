import { useState } from "react"
import { logoutUser } from "../services/authService";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";

export default function DashboardLayout() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const handleLogout = () => {
        logoutUser()
        navigate("/login");
    };

    return <>
        <div className="flex w-screen h-screen">
            <Sidebar handleLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="md:w-[80%] w-full flex flex-col overflow-scroll">
                <Header setSidebarOpen={setSidebarOpen} />
                <Dashboard />
            </div>
        </div>
       
    </>
}