export default function Sidebar({ handleLogout, sidebarOpen, setSidebarOpen }){
    return <div className={`md:w-[30%] lg:w-[20%] z-50 bg-gray-600 px-2 fixed h-full transition-transform duration-300 ease-in-out ${sidebarOpen ? "" : "-translate-x-full"} md:static md:translate-x-[0%]`}>
        <div className="flex gap-10 md:gap-0 items-center justify-between my-3">
            <p className="text-2xl font-bold text-white">Product Admin</p>
            <div className="md:hidden text-xl font text-white px-2 border-2 border-gray-500" onClick={() => { setSidebarOpen(false) }}>X</div>
        </div>
        <p className="text-gray-200 text-xl font-semibold cursor-pointer hover:underline">📊Dashboard</p>
        <button type="button" onClick={handleLogout} className="fixed bottom-0 text-gray-200 flex items-center rounded-md py-2 text-sm font-semibold  cursor-pointer  transition-colors">
            [➔ Log out
        </button>
    </div>
}