import { useEffect, useState } from "react"
import { logoutUser } from "../services/authService";
import { getProducts, searchProducts } from "../services/productService";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../hooks/Debounce";

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


    // Read values from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = Number(searchParams.get("page"));
    const limitParam = Number(searchParams.get("limit"));
    const searchParam = searchParams.get("search") || "";
    const [searchInput, setSearchInput] = useState(searchParam);
    const debouncedSearch = useDebounce(searchInput, 500);

    // Validate URL values
    const page =
        Number.isInteger(pageParam) && pageParam > 0
            ? pageParam
            : 1;

    const limit =
        [10, 20, 50].includes(limitParam)
            ? limitParam
            : 10;
    const start = total === 0
        ? 0
        : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    let totalPages = Math.ceil(total / limit);
    const changePage = (newPage) => {
        updateParams({
            page: newPage,
        });
    };

    const changeLimit = (newLimit) => {
        updateParams({
            page: 1,
            limit: newLimit,
        });
    };
    useEffect(() => {
        if (totalPages === 0) return;

        if (page > totalPages) {
            const params = new URLSearchParams(searchParams);
            params.set("page", String(totalPages));

            setSearchParams(params);
        }
    }, [page, totalPages, searchParams, setSearchParams]);
    useEffect(() => {
        const currentSearch = searchParams.get("search") || "";

        if (debouncedSearch === currentSearch) {
            return;
        }

        updateParams({
            search: debouncedSearch.trim(),
            page: 1,
        });
    }, [debouncedSearch]);
    useEffect(() => {
        const controller = new AbortController();
        const fetchProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const skip = (page - 1) * limit;

                let data;

                if (searchParam) {
                    data = await searchProducts({
                        query: searchParam,
                        limit,
                        skip,
                        signal: controller.signal,
                    });
                } else {
                    data = await getProducts({
                        limit,
                        skip,
                        signal: controller.signal,
                    });
                }

                setProducts(data.products);
                setTotal(data.total);
                totalPages = Math.ceil(data.total / limit);
            } catch (error) {
                if (error.name === "CanceledError") {
                    return;
                }

                if (error.code === "ERR_CANCELED") {
                    return;
                }

                setError("Failed to load products");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();
        return () => {
            controller.abort();
        };

    }, [page, limit, searchParam]);
    const updateParams = (updates) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (value === "" || value === null || value === undefined) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        setSearchParams(params);
    };
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
                        <div className="p-4 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Search Product here"
                                className="bg-white border border-black outline-none p-2 rounded transition-colors duration-200 focus:border-gray-300 focus:bg-gray-50"
                                value={searchInput}
                                onChange={(event) => {
                                    setSearchInput(event.target.value);
                                }}
                            />
                            <div className="flex items-center gap-3 font-sans">
                                <label htmlFor="limit-select" className="text-sm font-medium text-slate-700">
                                    Limit
                                </label>
                                <div className="relative">
                                    <select
                                        id="limit-select"
                                        value={limit}
                                        onChange={(event) => {
                                            changeLimit(Number(event.target.value));
                                        }}
                                        className="appearance-none min-w-[70px] bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium text-slate-800 shadow-sm cursor-pointer outline-none transition-all duration-200 hover:border-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    {/* Custom Chevron Arrow Icon */}
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {/* <span className="text-sm text-slate-500">per page</span> */}
                            </div>

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
                                <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-300 disabled:hover:bg-slate-300"
                                    disabled={page === 1}
                                    onClick={() => changePage(page - 1)}
                                >
                                    Previous
                                </button>

                                <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-300 disabled:hover:bg-slate-300"
                                    disabled={page === totalPages}
                                    onClick={() => changePage(page + 1)}
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