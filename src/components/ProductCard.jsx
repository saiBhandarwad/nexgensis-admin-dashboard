export default function ProductCard({ product, setEditingProduct, setShowForm, handleDeleteProduct }) {


    return <div
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
}   