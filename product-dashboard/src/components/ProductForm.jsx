import { useState } from "react";

function ProductForm({ product, onSubmit, onCancel, loading }) {
    const [title, setTitle] = useState(product?.title || "");
    const [price, setPrice] = useState(product?.price || "");
    const [category, setCategory] = useState(product?.category || "");
    const [stock, setStock] = useState(product?.stock || "");

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!price || Number(price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        if (!category.trim()) {
            newErrors.category = "Category is required";
        }

        if (!stock || Number(stock) < 0) {
            newErrors.stock = "Stock cannot be negative";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validate()) return;

        onSubmit({
            title: title.trim(),
            price: Number(price),
            category: category.trim(),
            stock: Number(stock),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <div>
                <label>Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                )}
            </div>

            <div>
                <label>Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price}</p>
                )}
            </div>

            <div>
                <label>Category</label>
                <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category}</p>
                )}
            </div>

            <div>
                <label>Stock</label>
                <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                {errors.stock && (
                    <p className="text-red-500 text-sm">{errors.stock}</p>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {loading
                        ? "Saving..."
                        : product
                            ? "Update Product"
                            : "Add Product"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-300 px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ProductForm;