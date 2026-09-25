export default function PaginationFooter({start, end, total, page, changePage, totalPages}) {
    return <div className="p-4 flex justify-between">
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
}