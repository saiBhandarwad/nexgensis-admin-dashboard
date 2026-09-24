import { useEffect, useState } from "react"
import { logoutUser } from "../services/authService";
import {
    getProducts,
    searchProducts,
    getCategories,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../hooks/Debounce";
import ProductForm from "../components/ProductForm";

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
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    // Read values from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = Number(searchParams.get("page"));
    const limitParam = Number(searchParams.get("limit"));
    const searchParam = searchParams.get("search") || "";
    const [searchInput, setSearchInput] = useState(searchParam);
    const debouncedSearch = useDebounce(searchInput, 500);

    const categoryParam = searchParams.get("category") || "";
    const [categories, setCategories] = useState([]);

    const sortParam = searchParams.get("sort") || "";

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
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        const fetchProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const skip = (page - 1) * limit;
                let sortBy;
                let order;
                let data;

                if (sortParam) {
                    const [field, direction] = sortParam.split("-");

                    sortBy = field;
                    order = direction;
                }


                if (searchParam) {
                    data = await searchProducts({
                        query: searchParam,
                        limit,
                        skip,
                        sortBy,
                        order,
                        signal: controller.signal,
                    });
                } else if (categoryParam) {
                    data = await getProductsByCategory({
                        category: categoryParam,
                        limit,
                        skip,
                        sortBy,
                        order,
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

    }, [page, limit, searchParam, categoryParam, sortParam]);
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
    const handleProductSubmit = async (productData) => {
        if (saving) return;

        setSaving(true);

        try {
            if (editingProduct) {
                const updatedProduct = await updateProduct(
                    editingProduct.id,
                    productData
                );

                setProducts((currentProducts) =>
                    currentProducts.map((product) =>
                        product.id === editingProduct.id
                            ? { ...product, ...updatedProduct }
                            : product
                    )
                );
            } else {
                const newProduct = await addProduct(productData);

                setProducts((currentProducts) => [
                    newProduct,
                    ...currentProducts,
                ]);
            }

            setShowForm(false);
            setEditingProduct(null);

        } catch (error) {
            setError("Failed to save product");
        } finally {
            setSaving(false);
        }
    };
    const handleDeleteProduct = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            await deleteProduct(id);

            setProducts((currentProducts) =>
                currentProducts.filter((product) => product.id !== id)
            );

            setTotal((currentTotal) => Math.max(0, currentTotal - 1));

        } catch (error) {
            setError("Failed to delete product");
        }
    };

    return <>
        <div className="flex w-screen h-screen">
            <div className={`md:w-[30%] lg:w-[20%] z-50 bg-gray-600 px-2 fixed h-full transition-transform duration-300 ease-in-out ${sidebarOpen ? "" : "-translate-x-full"} md:static md:translate-x-[0%]`}>
                <div className="flex gap-10 md:gap-0 items-center justify-between my-3">
                    <p className="text-2xl font-bold text-white">Product Admin</p>
                    <div className="md:hidden text-xl font text-white px-2 border-2 border-gray-500" onClick={() => { setSidebarOpen(false) }}>X</div>
                </div>
                <p className="text-gray-200 text-xl font-semibold cursor-pointer hover:underline">📊Dashboard</p>
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
                        <div className="bg-gray-500 text-white w-10 h-10 flex justify-center items-center rounded-full">E</div>
                        <span>Emilys</span>
                    </div>
                </div>
                <div className="h-auto px-5 bg-gray-200 ">
                    <div className="flex justify-between items-center my-5">
                        <div>
                            <h1 className="text-xl font-semibold">Products</h1>
                            <h1 className="text-sm">Manage product details, pricing, inventory and availability</h1>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setShowForm(true);
                                }}
                                className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded whitespace-nowrap cursor-pointer transition-colors hover:bg-blue-600"
                            >
                                Add Product
                            </button>
                        </div>

                    </div>
                    <div className="bg-white h-auto rounded-xl shadow-2xl">
                        <div className="p-4 grid md:grid-cols-2 grid-col-2 lg:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Search Product here"
                                className=" bg-white border border-black outline-none p-2 rounded transition-colors duration-200 focus:border-gray-300 focus:bg-gray-50"
                                value={searchInput}
                                onChange={(event) => {
                                    setSearchInput(event.target.value);
                                }}
                            />
                            {/* category starts */}
                            <div className="flex items-center gap-3 font-sans">
                                <label htmlFor="category-select" className="text-sm font-medium text-slate-700">
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="category-select"
                                        value={categoryParam}
                                        onChange={(event) => {
                                            updateParams({
                                                category: event.target.value,
                                                page: 1,
                                            });
                                        }}
                                        className="appearance-none min-w-[70px] bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium text-slate-800 shadow-sm cursor-pointer outline-none transition-all duration-200 hover:border-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.slug} value={category.slug}>
                                                {category.name}
                                            </option>
                                        ))}
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
                            {/* category end */}
                            {/* sort by starts */}
                            <div className=" flex items-center gap-3 font-sans">
                                <label htmlFor="sort-select" className="text-sm font-medium text-slate-700">
                                    Sort By
                                </label>
                                <div className="relative">
                                    <select
                                        id="sort-select"
                                        value={sortParam}
                                        onChange={(event) => {
                                            updateParams({
                                                sort: event.target.value,
                                                page: 1,
                                            });
                                        }}
                                        className="appearance-none min-w-[70px] bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium text-slate-800 shadow-sm cursor-pointer outline-none transition-all duration-200 hover:border-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="">Default Sort</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="rating-desc">Rating: High to Low</option>
                                        <option value="title-asc">Title: A to Z</option>
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
                            {/* sort by end */}
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
                                <span className="text-sm text-slate-500">per page</span>
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
                        {loading && <p className="h-full w-full flex justify-center items-center">Loading products...</p>}
                        {!loading &&
                            products.map((product) => (
                                <div
                                    key={product.id}
                                    className="
                border border-gray-300 rounded-xl p-4 my-2 mx-1
                md:grid md:grid-cols-7 md:items-center md:text-center
            "
                                >
                                    {/* Product */}
                                    <div className="md:col-span-2 flex items-center mb-4 md:mb-0">
                                        <img
                                            className="w-12 h-12 rounded-xl mr-3 object-cover"
                                            src={product.thumbnail}
                                            alt={product.title}
                                        />

                                        <div className="text-left">
                                            <p className="font-medium line-clamp-2">
                                                {product.title}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mobile details */}
                                    <div className="grid grid-cols-2 gap-2 md:contents">
                                        <div className="flex justify-between md:block">
                                            <span className="font-semibold md:hidden">
                                                Category
                                            </span>
                                            <span>{product.category}</span>
                                        </div>

                                        <div className="flex justify-between md:block">
                                            <span className="font-semibold md:hidden">
                                                Price
                                            </span>
                                            <span>${product.price}</span>
                                        </div>

                                        <div className="flex justify-between md:block">
                                            <span className="font-semibold md:hidden">
                                                Rating
                                            </span>
                                            <span>{product.rating}</span>
                                        </div>

                                        <div className="flex justify-between md:block">
                                            <span className="font-semibold md:hidden">
                                                Stock
                                            </span>
                                            <span>{product.stock}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4 mt-4 md:mt-0 md:justify-center">
                                        <button
                                            onClick={() => {
                                                setEditingProduct(product);
                                                setShowForm(true);
                                            }}
                                            className="text-blue-500 cursor-pointer"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-red-500 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
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
        {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">
                        {editingProduct ? "Edit Product" : "Add Product"}
                    </h2>

                    <ProductForm
                        product={editingProduct}
                        loading={saving}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingProduct(null);
                        }}
                        onSubmit={handleProductSubmit}
                    />
                </div>
            </div>
        )}
    </>
}