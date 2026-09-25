export default function Header({ setSidebarOpen }){
    return <div className="py-2 flex justify-between items-center">
        <div className="text-4xl font-bold md:hidden" onClick={() => {
            setSidebarOpen(true)
        }}>≡</div>
        <p className="hidden md:block text-pink-500 font-bold text-2xl ms-4">Nex<span className="text-olive-500">Gensis</span></p>
        <div className="flex items-center gap-1 pe-4">
            <div className="bg-gray-500 text-white w-10 h-10 flex justify-center items-center rounded-full">E</div>
            <span>Emilys</span>
        </div>
    </div>
}