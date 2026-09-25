import { useEffect, useState } from "react";
import PaginationFooter from "./PaginationFooter";
import PaginationHeader from "./PaginationHeader";
import ProductCard from "./ProductCard";
import {  useSearchParams } from "react-router-dom";
import useDebounce from "../hooks/Debounce";
import ProductForm from "./ProductForm";
import {
    getProducts,
    searchProducts,
    getCategories,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService";
export default function Dashboard(){
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

    return <div className="h-auto px-5 bg-gray-200 ">
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
            <PaginationHeader searchInput={searchInput} setSearchInput={setSearchInput} categories={categories} categoryParam={categoryParam} sortParam={sortParam} updateParams={updateParams} limit={limit} changeLimit={changeLimit} />
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
                    <ProductCard product={product} setEditingProduct={setEditingProduct} setShowForm={setShowForm} handleDeleteProduct={handleDeleteProduct} />
                ))
            }
            {(products.length === 0 && !loading) && <p className="h-full w-full flex justify-center items-center">No products...</p>}
            <PaginationFooter start={start} end={end} total={total} page={page} changePage={changePage} totalPages={totalPages} />
        </div>
        {/* form modal */}
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
    </div>

}