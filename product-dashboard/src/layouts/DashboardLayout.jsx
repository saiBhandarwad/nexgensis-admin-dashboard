import { useState } from "react"

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    return <>
        <div className="flex w-screen h-screen">
            <div className={`md:w-[20%] bg-gray-600 px-2 fixed h-full ${sidebarOpen ? "" : "-translate-x-full"} md:static md:translate-x-[0%]`}>
                <div className="flex justify-between my-3">
                    <p className="text-3xl font-bold text-white">Product Admin</p>
                    <div className="md:hidden text-2xl font-bold " onClick={() => { setSidebarOpen(false) }}>X</div>
                </div>
                <p className="text-gray-200 text-xl font-semibold">Dashboard</p>
                <p className="text-gray-200 text-xl font-semibold">Products</p>
                <p className="text-gray-200 text-xl font-semibold">Categories</p>
            </div>
            <div className="md:w-[80%] w-full flex flex-col">
                <div className="h-[10%] flex justify-between md:justify-end items-center">
                    <div className="text-4xl font-bold md:hidden" onClick={() => {
                        setSidebarOpen(true)
                    }}>≡</div>
                    <div className="flex items-center gap-1 pe-4">
                        <div className="bg-gray-500 w-10 h-10 flex justify-center items-center rounded-full">S</div>
                        <span>Saiprasad</span>
                    </div>
                </div>
                <div className="h-[90%] px-5 bg-gray-200 ">
                    <div className="flex justify-between h-[15%]">
                        <div>
                            <h1 className="text-2xl font-semibold">Products</h1>
                            <h1 className="">Manage product details, pricing, inventory and availability</h1>
                        </div>
                        {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">Add Product</button> */}
                    </div>
                    <div className="bg-white h-[80%] rounded-xl shadow-2xl overflow-scroll">
                        <div className="p-4">
                            <input
                                type="text"
                                placeholder="Search Product here"
                                class="bg-white border border-black outline-none p-2 rounded transition-colors duration-200 focus:border-gray-300 focus:bg-gray-50"
                            />
                        </div>
                        <div className="md:grid-cols-7 p-4 bg-gray-200 hidden md:grid md:sticky top-0">
                            <div className="col-span-2">Product</div>
                            <div className="">Category</div>
                            <div className="">Price</div>
                            <div className="">Rating</div>
                            <div className="">Stock</div>
                            <div className="">Action</div>
                        </div>
                        <div className="grid md:grid-cols-7 rounded-xl border border-gray-300 grid-cols-2 p-4 my-1 mx-1">
                            <div className="md:col-span-2 order-0 flex">
                                <img className="w-10 h-10 rounded-xl me-2" src="https://www.youngurbanproject.com/wp-content/uploads/2025/03/Product-Marketing.jpg" alt="" />
                                <p>Aero wireless headphones</p>
                            </div>
                            <div className="order-2 md:order-0">Electronics</div>
                            <div className="order-3  md:order-0">$200</div>
                            <div className="order-4  md:order-0">4.7</div>
                            <div className="order-5  md:order-0">in-stock</div>
                            <div className="text-xl font-bold order-1  md:order-0">⋮</div>
                        </div>
                        <div className="grid md:grid-cols-7 rounded-xl border border-gray-300 grid-cols-2 p-4 my-1 mx-1">
                            <div className="md:col-span-2 order-0 flex">
                                <img className="w-10 h-10 rounded-xl me-2" src="https://www.youngurbanproject.com/wp-content/uploads/2025/03/Product-Marketing.jpg" alt="" />
                                <p>Aero wireless headphones</p>
                            </div>
                            <div className="order-2 md:order-0">Electronics</div>
                            <div className="order-3  md:order-0">$200</div>
                            <div className="order-4  md:order-0">4.7</div>
                            <div className="order-5  md:order-0">in-stock</div>
                            <div className="text-xl font-bold order-1  md:order-0">⋮</div>
                        </div>
                        <div className="grid md:grid-cols-7 rounded-xl border border-gray-300 grid-cols-2 p-4 my-1 mx-1">
                            <div className="md:col-span-2 order-0 flex">
                                <img className="w-10 h-10 rounded-xl me-2" src="https://www.youngurbanproject.com/wp-content/uploads/2025/03/Product-Marketing.jpg" alt="" />
                                <p>Aero wireless headphones</p>
                            </div>
                            <div className="order-2 md:order-0">Electronics</div>
                            <div className="order-3  md:order-0">$200</div>
                            <div className="order-4  md:order-0">4.7</div>
                            <div className="order-5  md:order-0">in-stock</div>
                            <div className="text-xl font-bold order-1  md:order-0">⋮</div>
                        </div>
                        <div className="grid md:grid-cols-7 rounded-xl border border-gray-300 grid-cols-2 p-4 my-1 mx-1">
                            <div className="md:col-span-2 order-0 flex">
                                <img className="w-10 h-10 rounded-xl me-2" src="https://www.youngurbanproject.com/wp-content/uploads/2025/03/Product-Marketing.jpg" alt="" />
                                <p>Aero wireless headphones</p>
                            </div>
                            <div className="order-2 md:order-0">Electronics</div>
                            <div className="order-3  md:order-0">$200</div>
                            <div className="order-4  md:order-0">4.7</div>
                            <div className="order-5  md:order-0">in-stock</div>
                            <div className="text-xl font-bold order-1  md:order-0">⋮</div>
                        </div>
                        <div className="grid md:grid-cols-7 rounded-xl border border-gray-300 grid-cols-2 p-4 my-1 mx-1">
                            <div className="md:col-span-2 order-0 flex">
                                <img className="w-10 h-10 rounded-xl me-2" src="https://www.youngurbanproject.com/wp-content/uploads/2025/03/Product-Marketing.jpg" alt="" />
                                <p>Aero wireless headphones</p>
                            </div>
                            <div className="order-2 md:order-0">Electronics</div>
                            <div className="order-3  md:order-0">$200</div>
                            <div className="order-4  md:order-0">4.7</div>
                            <div className="order-5  md:order-0">in-stock</div>
                            <div className="text-xl font-bold order-1  md:order-0">⋮</div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </>
}