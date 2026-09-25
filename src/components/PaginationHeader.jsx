export default function PaginationHeader({searchInput, setSearchInput, categories, categoryParam, sortParam, updateParams, limit, changeLimit}){
    return <div className="p-4 grid md:grid-cols-2 grid-col-2 lg:grid-cols-2 gap-4">
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
                    {categories?.map((category) => (
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
}