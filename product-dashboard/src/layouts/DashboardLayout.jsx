import { useEffect, useState } from "react"
import { logoutUser } from "../services/authService";
import { getProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const handleLogout = () => {
        logoutUser()
        navigate("/login");
    };
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    const totalPages = Math.ceil(total / limit);
    
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const skip = (page - 1) * limit;

                const data = await getProducts({
                    limit,
                    skip,
                });

                setProducts(data.products);
                setTotal(data.total);
            } catch (error) {
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, limit]);
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const skip = (page - 1) * limit;

                const data = await getProducts({
                    limit,
                    skip,
                });

                setProducts(data.products);
                setTotal(data.total);
            } catch (error) {
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <p className="w-screen h-screen flex justify-center items-center">Loading products...</p>;
    }

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
                <button type="button" onClick={handleLogout} className="fixed bottom-0 text-gray-200 flex items-center rounded-md py-2 text-sm font-semibold  cursor-pointer  transition-colors">
                    [➔ Log out
                </button>
            </div>
            <div className="md:w-[80%] w-full flex flex-col overflow-scroll">
                <div className="py-2 flex justify-between items-center">
                    <div className="text-4xl font-bold md:hidden" onClick={() => {
                        setSidebarOpen(true)
                    }}>≡</div>
                    <p className="hidden md:block text-pink-500 font-bold text-2xl ms-4">Next<span className="text-olive-500">Gensis</span></p>
                    <div className="flex items-center gap-1 pe-4">
                        <div className="bg-gray-500 w-10 h-10 flex justify-center items-center rounded-full">S</div>
                        <span>Saiprasad</span>
                    </div>
                </div>
                <div className="h-auto px-5 bg-gray-200 ">
                    <div className="flex justify-between my-5">
                        <div>
                            <h1 className="text-2xl font-semibold">Products</h1>
                            <h1 className="">Manage product details, pricing, inventory and availability</h1>
                        </div>
                        {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">Add Product</button> */}
                    </div>
                    <div className="bg-white h-auto rounded-xl shadow-2xl">
                        <div className="p-4">
                            <input  
                                type="text"
                                placeholder="Search Product here"
                                className="bg-white border border-black outline-none p-2 rounded transition-colors duration-200 focus:border-gray-300 focus:bg-gray-50"
                            />
                            <label htmlFor="">limit</label>
                            <select
                                value={limit}
                                onChange={(event) => {
                                    setLimit(Number(event.target.value));
                                    setPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="md:grid-cols-7 text-center p-4 bg-gray-200 hidden md:grid md:sticky top-0">
                            <div className="col-span-2">Product</div>
                            <div className="">Category</div>
                            <div className="">Price</div>
                            <div className="">Rating</div>
                            <div className="">Stock</div>
                            <div className="">Action</div>
                        </div>
                        {products.map((product) => {
                            return <div className="grid text-center md:grid-cols-7 rounded-xl border border-gray-300 grid-cols-2 p-4 my-1 mx-1" key={product.id}>
                                <div className="md:col-span-2 order-0 flex">
                                    <img className="w-10 h-10 rounded-xl me-2" src={product.thumbnail} alt="" />
                                    <p>{product.title}</p>
                                </div>
                                <div className="order-2 md:order-0">{product.category}</div>
                                <div className="order-3  md:order-0">${product.price}</div>
                                <div className="order-4  md:order-0">{product.rating}</div>
                                <div className="order-5  md:order-0">{product.stock}</div>
                                <div className="text-xl font-bold order-1  md:order-0">⋮</div>
                            </div>
                        })}
                        <div className="p-4 flex justify-between">
                            <p>
                                Showing {start}–{end} of {total}
                            </p>
                            <div className="flex gap-2">
                                <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </button>

                                <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>
}