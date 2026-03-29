export default function Pagination({ page, totalPages, setPage, visiblePages }) {
  const PrevBtn = () => (
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => Math.max(1, p - 1))}
      className={`w-[32px] h-[32px] flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
        page === 1 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-1000'
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
      </svg>
    </button>
  );

  const NextBtn = () => (
    <button
      disabled={page === totalPages}
      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      className={`w-[32px] h-[32px] flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
        page === totalPages
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-1000'
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </button>
  );

  return (
    <div className="px-[6px] h-[32px] flex justify-center items-center gap-[6px]">
      <PrevBtn />
      {visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-body-sm flex-shrink-0 text-gray-1000 ${
            page === p ? 'bg-gray-300' : ''
          }`}
        >
          {p}
        </button>
      ))}
      <NextBtn />
    </div>
  );
}
