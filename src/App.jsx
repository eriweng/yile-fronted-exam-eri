import { useState, useEffect } from 'react';
import JobCard from './components/JobCard';

function App() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // 取得工作資料
    fetch(`/api/v1/jobs?pre_page=4&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.data);
        setTotal(data.total);
      });
  }, [page]);

  // 簡易計算總頁數，若需要精確呈現亦可使用 total
  const totalPages = Math.ceil(total / 4) || 6;

  return (
    <div className="mx-auto min-h-screen max-w-[375px] bg-white shadow-xl flex flex-col overflow-hidden relative">
      {/* 頂部 Hero 區塊 (使用 bg-gray-500 暫代) */}
      <div className="h-[200px] w-full bg-gray-500 flex-shrink-0 relative">
        {/* 手機版模擬圖佔位 */}
        <div className="absolute top-2 left-2 bg-gray-400 text-white text-xs px-2 py-1 rounded">
          Mobile
        </div>
      </div>

      {/* 內容區塊 */}
      <div className="p-[16px] flex flex-col flex-grow gap-[12px] bg-white border-t border-b border-gray-500 shadow-content-card">
        {/* 段落標題 */}
        <div className="flex items-center self-start gap-[8px] mb-[16px]">
          <div className="h-[20px] w-[4px] rounded bg-orange-500" />
          <h2 className="text-display-6 font-bold text-gray-700">
            適合前端工程師的好工作
          </h2>
        </div>

        {/* 卡片列表 */}
        <div className="flex flex-col gap-[16px] w-full items-center">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              companyName={job.companyName}
              jobTitle={job.jobTitle}
              description={job.preview}
            />
          ))}
        </div>

        {/* 分頁元件 */}
        <div className="px-[6px] h-[32px] flex justify-center items-center gap-[6px]">
          {/* 上一頁 — ChevronLeft icon，disabled 時淡化 */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`w-[32px] h-[32px] flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
              page === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
          </button>

          {/* 頁碼 */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-body-sm flex-shrink-0 text-gray-1000 transition-colors ${
                  page === p
                    ? 'bg-gray-300 text-gray-1000 font-bold'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            );
          })}

          {/* 下一頁 — ChevronRight icon，disabled 時淡化 */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`w-[32px] h-[32px] flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
              page === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
